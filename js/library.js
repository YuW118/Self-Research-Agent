/**
 * 知识库模块（library）
 *
 * 整合自 knowledge-demo.html，命名空间前缀：
 *   - 状态/数据缓存：localStorage 'sr_library_*'
 *   - CSS 前缀：     .lib-page / .lib-
 *   - DOM ID 前缀：  #lib-*
 *
 * 与 self-research 的耦合点（外部依赖）：
 *   - Store（来自 store.js）：公开 getBooks()/getBook()/addBook()/updateBook()/deleteBook()/setBookStatus()
 *                            getResonanceCountForBook(bookId) 由 Store 提供
 *   - window.Views (来自 views.js)：用于 readingForm 中 paper 源 + 关联图书下拉
 *   - window.App   (来自 app.js)：toast / route
 *   - window.SOURCE_TYPES (来自 views.js)
 *
 * 模块以 window.Library 单例暴露，外部统一通过 Library 调取。
 */

(function () {
  'use strict';

  /* ==================== 状态 ==================== */
  const state = {
    tab: 'books',
    domain: 'all',
    bookStatus: 'all',
    bookSort: 'default',
    bookSearch: '',
    paperView: 'daily',
    paperDiff: 'all',
    paperRead: 'all',
    formDraft: {
      id: null,
      title: '', author: '', domain: 'humanity', difficulty: 'medium',
      cover: null, coverSource: 'auto',
      mindmap: null, guide: null
    }
  };

  /* ==================== 本地存储（独立 sr_library_ 命名空间） ==================== */
  const LibStore = {
    get(key, def) {
      try {
        const v = localStorage.getItem('sr_library_' + key);
        return v ? JSON.parse(v) : def;
      } catch (e) { return def; }
    },
    set(key, val) {
      try { localStorage.setItem('sr_library_' + key, JSON.stringify(val)); return true; }
      catch (e) { console.error(e); return false; }
    }
  };

  /* ==================== 数据获取（合并 SEED + 用户数据 + overrides） ==================== */

  function getBooks() {
    const custom = LibStore.get('customBooks', []);
    const hidden = LibStore.get('hiddenBookIds', []);
    const extraBooks = typeof LIB_SEED_BOOKS_EXTRA !== 'undefined' ? LIB_SEED_BOOKS_EXTRA : [];
    const allSeed = [...LIB_SEED_BOOKS, ...extraBooks];
    const seed = allSeed.filter(b => !hidden.includes(b.id));
    const overrides = LibStore.get('bookOverrides', {});
    return [
      ...custom.map(b => ({ ...b, isCustom: true, ...(overrides[b.id] || {}) })),
      ...seed.map(b => ({ ...b, isCustom: false, ...(overrides[b.id] || {}) }))
    ];
  }
  function getBook(id) { return getBooks().find(b => b.id === id) || null; }
  function getBookStatus(id) {
    const s = LibStore.get('bookStatus', {});
    return s[id] || 'none';
  }
  function getBookCover(id) {
    const covers = LibStore.get('bookCover', {});
    return covers[id] || null;
  }
  function getPapers() { return LIB_SEED_PAPERS; }
  function getReadSet() { return LibStore.get('paperReadSet', {}); }
  function getBookDomain(id) {
    const d = LibStore.get('bookDomain', {});
    return d[id] || null;
  }

  /**
   * 该书的共鸣数：
   * 优先从 sr_readings 统计（用户实际新增的 + relatedBook 字段），
   * 计数时不区分 sourceType（任何来源只要 relatedBook 关联到这本书都算）。
   */
  function getResonanceCountForBook(bookId) {
    try {
      const rs = JSON.parse(localStorage.getItem('sr_readings') || '[]');
      return rs.filter(r => r && r.relatedBook === bookId).length;
    } catch (e) { return 0; }
  }

  /**
   * 书籍详情 tab 用：读取所有相关共鸣
   */
  function getResonancesForBook(bookId) {
    try {
      const rs = JSON.parse(localStorage.getItem('sr_readings') || '[]');
      return rs
        .filter(r => r && r.relatedBook === bookId)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } catch (e) { return []; }
  }

  /* ==================== 工具 ==================== */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function todaySeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function seededShuffle(arr, seed) {
    const a = [...arr];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function diffOrder(d) { return d === 'easy' ? 0 : d === 'medium' ? 1 : 2; }
  function fmtDay(iso) {
    if (!iso) return '';
    const d = new Date(iso.slice(0, 10) + 'T00:00:00');
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  function flashTip(msg) {
    let tip = document.getElementById('libFlashTip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'libFlashTip';
      tip.className = 'lib-flash-tip';
      document.body.appendChild(tip);
    }
    tip.textContent = msg;
    tip.style.opacity = '1';
    clearTimeout(tip._t);
    tip._t = setTimeout(() => { tip.style.opacity = '0'; }, 1600);
  }

  /* ==================== AI 占位（与 demo 一致） ==================== */
  function aiCall(prompt, onChunk) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reply = '（占位）这里是 AI 的回答，正式版会调用你在 self-research 设置中配置的 OpenAI 兼容接口。\n当前未配置或配置信息不完整。';
        if (onChunk) onChunk(reply);
        resolve(reply);
      }, 400);
    });
  }
  async function aiStreamTo(el, prompt) {
    el.style.display = 'block'; el.textContent = '';
    const reply = await aiCall(prompt, t => { el.textContent = t; });
    el.textContent = reply;
    return reply;
  }

  /* ==================== 200 天阅读热力图（50×4 = 200 个小方格，从首次打卡开始）==================== */
  const HEATMAP_DAYS = 200;
  function _todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function _getReadingLog() {
    return LibStore.get('readingLog', {});
  }
  function _getFirstCheckinDate() {
    const log = _getReadingLog();
    const dates = Object.keys(log).filter(k => log[k].total > 0).sort();
    if (dates.length === 0) return null;
    return new Date(dates[0] + 'T00:00:00');
  }
  function _toggleDayCheckin(dateKey) {
    const log = _getReadingLog();
    const entry = log[dateKey] || { books: 0, papers: 0, total: 0 };
    const isManual = entry.manual === true;
    if (isManual) {
      // 取消打卡
      entry.manual = false;
      entry.total = (entry.books || 0) + (entry.papers || 0);
      if (entry.total === 0) delete log[dateKey];
      else log[dateKey] = entry;
      LibStore.set('readingLog', log);
      return false;
    } else {
      // 打卡：手动 +1
      entry.manual = true;
      entry.total = (entry.books || 0) + (entry.papers || 0) + 1;
      log[dateKey] = entry;
      LibStore.set('readingLog', log);
      return true;
    }
  }
  function _calendarIcon() {
    return `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="14" height="12" rx="1.5"/>
      <path d="M3 9h14"/>
      <path d="M7 3v4M13 3v4"/>
      <circle cx="8" cy="13" r="0.7" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="13" r="0.7" fill="currentColor" stroke="none"/>
      <circle cx="8" cy="16" r="0.7" fill="currentColor" stroke="none"/>
    </svg>`;
  }
  function renderHeatmap() {
    const el = document.getElementById('lib-heatmap');
    if (!el) return;
    const log = _getReadingLog();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = _todayKey();

    // 第一格从首次打卡开始；无打卡记录则从今天开始
    const firstDate = _getFirstCheckinDate() || new Date(today);
    firstDate.setHours(0, 0, 0, 0);

    // 打卡超过 N 天时滑动窗口，确保今天始终可见
    const daysSinceStart = Math.floor((today - firstDate) / 86400000);
    const startOffset = daysSinceStart < HEATMAP_DAYS ? 0 : daysSinceStart - (HEATMAP_DAYS - 1);

    // N 格 = 第 (startOffset+1) 天 到 第 (startOffset+N) 天
    const cells = [];
    let activeDays = 0, totalActions = 0;
    for (let i = 0; i < HEATMAP_DAYS; i++) {
      const d = new Date(firstDate);
      d.setDate(firstDate.getDate() + startOffset + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const entry = log[key] || { books: 0, papers: 0, total: 0 };
      const isFuture = d > today;
      const isToday = key === todayKey;
      if (entry.total > 0) { activeDays++; totalActions += entry.total; }
      cells.push({ date: d, key, entry, isToday, isFuture, dayNum: startOffset + i + 1 });
    }

    // 连续天数（从今天往前数连续有活动的天数）
    const todayIdx = cells.findIndex(c => c.isToday);
    let streak = 0;
    if (todayIdx >= 0) {
      for (let i = todayIdx; i >= 0; i--) {
        if (cells[i].entry.total > 0) streak++;
        else break;
      }
    }

    // 渲染 50 列 × 4 行 = 200 格
    const cellHtml = cells.map((c) => {
      const t = c.entry.total || 0;
      const lv = t === 0 ? 0 : t === 1 ? 1 : t <= 3 ? 2 : t <= 5 ? 3 : 4;
      const labelDate = `${c.date.getMonth() + 1}/${c.date.getDate()}`;
      const tipParts = [`第${c.dayNum}天`, labelDate];
      if (c.entry.books) tipParts.push(`书${c.entry.books}`);
      if (c.entry.papers) tipParts.push(`论文${c.entry.papers}`);
      const tip = tipParts.join(' ') + (t === 0 ? '' : ` 共${t}`);
      const classes = ['heatmap-cell', `lv-${lv}`];
      if (c.isToday) classes.push('is-today');
      if (c.isFuture) classes.push('is-future');
      const actionAttr = c.isFuture ? '' : 'data-lib-action="toggle-day-checkin"';
      return `<div class="${classes.join(' ')}" ${actionAttr} data-key="${c.key}"><span class="heatmap-tooltip">${tip}</span></div>`;
    }).join('');

    // 今天是第几天
    const todayDayNum = daysSinceStart + 1;
    el.innerHTML = `
      <div class="heatmap-head">
        <div class="heatmap-title">${_calendarIcon()} 阅读热力图 · 第 ${todayDayNum} 天</div>
        <div class="heatmap-stats">
          <span><span class="hs-num">${activeDays}</span>活跃</span>
          <span><span class="hs-num">${totalActions}</span>动作</span>
          <span><span class="hs-num">${streak}</span>连续</span>
        </div>
      </div>
      <div class="heatmap-wrap"><div class="heatmap-grid">${cellHtml}</div></div>
      <div class="heatmap-legend">少<span class="heatmap-legend-cells"><span></span><span></span><span></span><span></span><span></span></span>多</div>
    `;
  }

  /* ==================== Store 外部接口（暴露给 self-research Store） ====================
     self-research 的 Store 想跨接图书馆数据时可通过 Library.exportStore() 拿到。
     默认 keep-internal，外部需要时调 Library.getBooksForOther() 即可。 */
  function getBooksForOther() {
    return getBooks().map(b => ({
      id: b.id, title: b.title, author: b.author, domain: b.domain
    }));
  }

  /* ==================== 主视图 ==================== */
  function renderLibrary() {
    return `
      <div class="lib-page">
        <div class="lib-banner">知识库模块 · 数据本地保存 (sr_library_*) · 标记已读 / 状态 / 编辑实时同步</div>
        <div class="page-header" style="margin-bottom:20px;">
          <h1>知识库</h1>
          <div class="desc">书籍库 + 论文库 · 按六大领域管理 · AI 讲解与问答</div>
        </div>

        <!-- 100 天阅读热力图（点击格子打卡） -->
        <div id="lib-heatmap" class="heatmap-card"></div>

        <!-- 主 Tab -->
        <div class="main-tabs">
          <button class="main-tab ${state.tab === 'books' ? 'active' : ''}" data-lib-action="switch-tab" data-tab="books">
            ${LIB_Icon.book} 书籍库
          </button>
          <button class="main-tab ${state.tab === 'papers' ? 'active' : ''}" data-lib-action="switch-tab" data-tab="papers">
            ${LIB_Icon.paper} 论文库
          </button>
        </div>

        <!-- 领域筛选条（仅作用于书籍库）-->
        <div class="section-label" id="lib-domain-label" style="${state.tab === 'books' ? '' : 'display:none;'}">
          ${LIB_Icon.folder} 领域筛选<span class="sl-tip">仅作用于书籍库</span>
        </div>
        <div class="domain-strip" id="lib-domain-strip" style="${state.tab === 'books' ? '' : 'display:none;'}"></div>

        <!-- 书籍库视图 -->
        <div id="lib-view-books" style="${state.tab === 'books' ? '' : 'display:none;'}">
          ${renderBooksToolbar()}
          <div id="lib-book-list"></div>
        </div>

        <!-- 论文库视图 -->
        <div id="lib-view-papers" style="${state.tab === 'papers' ? '' : 'display:none;'}">
          <div class="papers-header">
            <h2 class="papers-title">论文</h2>
            <div class="papers-sub" id="lib-papers-sub"></div>
          </div>
          <div class="papers-toolbar">
            <div class="seg seg-big" id="lib-paper-view-seg">
              <button data-view="daily" class="${state.paperView === 'daily' ? 'active' : ''}">
                ${LIB_Icon.spark} 今日推荐
              </button>
              <button data-view="library" class="${state.paperView === 'library' ? 'active' : ''}">
                ${LIB_Icon.paper} 论文库
              </button>
            </div>
            <div class="papers-filters" id="lib-papers-filters-daily" style="${state.paperView === 'daily' ? '' : 'display:none;'}">
              <div class="seg paper-diff-seg">
                <button data-diff="all" class="${state.paperDiff === 'all' ? 'active' : ''}">全部</button>
                <button data-diff="easy" class="${state.paperDiff === 'easy' ? 'active' : ''}">入门</button>
                <button data-diff="medium" class="${state.paperDiff === 'medium' ? 'active' : ''}">进阶</button>
                <button data-diff="hard" class="${state.paperDiff === 'hard' ? 'active' : ''}">精深</button>
              </div>
              <div class="seg paper-read-seg">
                <button data-read="all" class="${state.paperRead === 'all' ? 'active' : ''}">全部</button>
                <button data-read="read" class="${state.paperRead === 'read' ? 'active' : ''}">已读</button>
                <button data-read="unread" class="${state.paperRead === 'unread' ? 'active' : ''}">未读</button>
              </div>
            </div>
            <div class="papers-filters" id="lib-papers-filters-lib" style="${state.paperView === 'library' ? '' : 'display:none;'}">
              <div class="seg paper-diff-seg">
                <button data-diff="all" class="${state.paperDiff === 'all' ? 'active' : ''}">全部</button>
                <button data-diff="easy" class="${state.paperDiff === 'easy' ? 'active' : ''}">入门</button>
                <button data-diff="medium" class="${state.paperDiff === 'medium' ? 'active' : ''}">进阶</button>
                <button data-diff="hard" class="${state.paperDiff === 'hard' ? 'active' : ''}">精深</button>
              </div>
              <div class="seg paper-read-seg">
                <button data-read="all" class="${state.paperRead === 'all' ? 'active' : ''}">全部</button>
                <button data-read="read" class="${state.paperRead === 'read' ? 'active' : ''}">已读</button>
                <button data-read="unread" class="${state.paperRead === 'unread' ? 'active' : ''}">未读</button>
              </div>
            </div>
          </div>
          <div class="hint-bar">
            ${LIB_Icon.beaker}
            <span id="lib-papers-hint-text"></span>
          </div>
          <div id="lib-paper-list"></div>
        </div>

        <!-- 弹窗挂载点 -->
        <div id="lib-book-modal" style="display:none;"></div>
        <div id="lib-paper-modal" style="display:none;"></div>
        <div id="lib-form-modal" style="display:none;"></div>
      </div>
    `;
  }

  /* ==================== 视图：领域条 + 书籍列表 + 论文列表 ==================== */
  function renderBooksToolbar() {
    return `
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            ${LIB_Icon.book}
            <input type="text" id="lib-book-search" placeholder="搜索书名 / 作者" value="${esc(state.bookSearch)}">
          </div>
          <button class="lib-btn" data-lib-action="open-form-book">
            ${LIB_Icon.plus} 添加书籍
          </button>
        </div>
        <div class="toolbar-right">
          <select class="filter-select" id="lib-book-sort">
            <option value="default" ${state.bookSort === 'default' ? 'selected' : ''}>默认排序</option>
            <option value="easy" ${state.bookSort === 'easy' ? 'selected' : ''}>入门优先</option>
            <option value="hard" ${state.bookSort === 'hard' ? 'selected' : ''}>精深优先</option>
          </select>
          <div class="status-filter" id="lib-book-status-seg">
            <button data-status="all" class="${state.bookStatus === 'all' ? 'active' : ''}">全部</button>
            <button data-status="want" class="${state.bookStatus === 'want' ? 'active' : ''}">想读</button>
            <button data-status="reading" class="${state.bookStatus === 'reading' ? 'active' : ''}">在读</button>
            <button data-status="done" class="${state.bookStatus === 'done' ? 'active' : ''}">已读</button>
            <button data-status="none" class="${state.bookStatus === 'none' ? 'active' : ''}">未读</button>
          </div>
        </div>
      </div>
    `;
  }
  function renderDomainStrip() {
    const el = document.getElementById('lib-domain-strip');
    if (!el) return;
    const all = getBooks();
    const counts = all.reduce((acc, b) => {
      const d = getBookDomain(b.id) || b.domain;
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    let html = `<div class="domain-chip ${state.domain === 'all' ? 'active' : ''}" data-domain="all" style="${state.domain === 'all' ? 'background:var(--lib-olive);color:#fff;' : ''}">全部 <span class="dc-count">${all.length}</span></div>`;
    LIB_DOMAINS.forEach(d => {
      const a = state.domain === d.id;
      html += `<div class="domain-chip ${a ? 'active' : ''}" data-domain="${d.id}" style="${a ? `background:var(--lib-${d.color});color:#fff;` : ''}">${d.icon} ${d.name} <span class="dc-count">${counts[d.id] || 0}</span></div>`;
    });
    el.innerHTML = html;
  }

  function renderBooks() {
    const el = document.getElementById('lib-book-list');
    if (!el) return;
    let books = getBooks();
    if (state.domain !== 'all') books = books.filter(b => (getBookDomain(b.id) || b.domain) === state.domain);
    if (state.bookSearch) {
      const q = state.bookSearch.toLowerCase();
      books = books.filter(b => (b.title + ' ' + (b.author || '')).toLowerCase().includes(q));
    }
    if (state.bookStatus === 'none') books = books.filter(b => !getBookStatus(b.id));
    else if (state.bookStatus !== 'all') books = books.filter(b => getBookStatus(b.id) === state.bookStatus);
    if (state.bookSort === 'easy') books = [...books].sort((a, b) => diffOrder(a.difficulty) - diffOrder(b.difficulty));
    if (state.bookSort === 'hard') books = [...books].sort((a, b) => diffOrder(b.difficulty) - diffOrder(a.difficulty));
    if (!books.length) { el.innerHTML = '<div class="empty">没有匹配的书籍</div>'; return; }

    const groups = { want: [], reading: [], done: [], none: [] };
    books.forEach(b => {
      const s = getBookStatus(b.id);
      const key = s || 'none';
      groups[key].push(b);
    });
    const order = state.bookStatus === 'all' ? ['want', 'reading', 'done', 'none'] : [state.bookStatus];
    let html = '';
    order.forEach(st => {
      const list = groups[st];
      if (!list || !list.length) return;
      html += `<div class="group-head"><span>${LIB_STATUS_MAP[st]}</span><span class="gh-count">${list.length} 本</span></div>`;
      html += '<div class="book-grid">' + list.map(bookCard).join('') + '</div>';
    });
    el.innerHTML = html;
  }
  function bookCard(b) {
    const d = LIB_DOMAINS.find(x => x.id === (getBookDomain(b.id) || b.domain));
    const st = getBookStatus(b.id);
    const diff = LIB_DIFF_MAP[b.difficulty] || LIB_DIFF_MAP.medium;
    const coverStyle = b.cover ? `background-image:url('${esc(b.cover)}');` : `background:var(--lib-${d.color});`;
    const resonanceCount = getResonanceCountForBook(b.id);
    return `<div class="book-card" data-lib-action="open-book" data-id="${b.id}">
      <div class="book-cover ${b.cover ? 'has-cover' : ''}" style="${coverStyle}">
        <div class="bc-title">${esc(b.title)}</div>
        ${resonanceCount > 0 ? `<div class="bc-resonance-count">${LIB_Icon.resonance} ${resonanceCount}</div>` : ''}
        <div class="bc-domain" style="background:var(--lib-${d.color}-dark);">${d.icon} ${d.name}</div>
      </div>
      <div class="book-body">
        <div class="book-title">${esc(b.title)}</div>
        <div class="book-author">${esc(b.author || '未知作者')}</div>
        <div class="book-meta">
          <span class="lib-tag ${diff.cls}">${diff.label}</span>
          <span class="lib-tag tag-status tag-status-${st}">${LIB_Icon.bookmark} ${LIB_STATUS_MAP[st]}</span>
        </div>
      </div>
      ${b.isCustom ? `<button class="book-del-btn" data-lib-action="delete-book" data-id="${b.id}" title="删除此书">${LIB_Icon.trash}</button>` : ''}
    </div>`;
  }

  /* ==================== 论文渲染（每日 10 篇 + 补足逻辑） ==================== */
  const DAILY_COUNT = 10;
  function renderPapers() {
    const el = document.getElementById('lib-paper-list');
    const subEl = document.getElementById('lib-papers-sub');
    const hintEl = document.getElementById('lib-papers-hint-text');
    if (!el) return;
    const readSet = getReadSet();
    const papers = getPapers();

    if (state.paperView === 'daily') {
      const seed = todaySeed();
      const unread = papers.filter(p => !readSet[p.id]);

      let pool = seededShuffle(unread, seed).slice(0, DAILY_COUNT);
      if (pool.length < DAILY_COUNT) {
        const need = DAILY_COUNT - pool.length;
        const remaining = unread.filter(p => !pool.includes(p));
        const extra = seededShuffle(remaining, seed + 1).slice(0, need);
        pool = pool.concat(extra);
      }
      let list = pool;
      if (state.paperDiff !== 'all') list = list.filter(p => p.difficulty === state.paperDiff);
      if (state.paperRead === 'read') list = list.filter(p => readSet[p.id]);
      if (state.paperRead === 'unread') list = list.filter(p => !readSet[p.id]);

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      const readTotal = Object.values(readSet).filter(Boolean).length;
      const totalPapers = papers.length;
      if (subEl) subEl.textContent = `${dateStr} · 每日推荐 ${DAILY_COUNT} 篇 · 已累计读 ${readTotal}/${totalPapers} · 今日池自动补足到 ${DAILY_COUNT} 篇`;
      if (hintEl) hintEl.textContent = '聚焦 AI/数据/机器人/经济领域经典论文，标记已读后自动从未读池补充。';

      if (!list.length) { el.innerHTML = '<div class="empty">已全部读完 ✨ 明天会推荐新的</div>'; return; }
      el.innerHTML = '<div class="paper-list">' + list.map(p => paperCard(p, readSet)).join('') + '</div>';
      return;
    }

    let list = papers;
    if (state.paperDiff !== 'all') list = list.filter(p => p.difficulty === state.paperDiff);
    if (state.paperRead === 'read') list = list.filter(p => readSet[p.id]);
    if (state.paperRead === 'unread') list = list.filter(p => !readSet[p.id]);
    list = [...list].sort((a, b) => (b.citeCount - a.citeCount) || (b.year - a.year));

    const total = list.length;
    const totalRead = list.filter(p => readSet[p.id]).length;
    if (subEl) subEl.textContent = `论文库 · 共 ${total} 篇 · 已读 ${totalRead} · 按引用量排序`;
    if (hintEl) hintEl.textContent = '完整论文池，可按难度与已读状态筛选。';
    if (!list.length) { el.innerHTML = '<div class="empty">没有匹配的论文</div>'; return; }
    el.innerHTML = '<div class="paper-list">' + list.map(p => paperCard(p, readSet)).join('') + '</div>';
  }
  function paperCard(p, readSet) {
    const d = LIB_DOMAINS.find(x => x.id === p.domain);
    const diff = LIB_DIFF_MAP[p.difficulty] || LIB_DIFF_MAP.medium;
    const read = !!readSet[p.id];
    const cite = p.citeCount >= 1000 ? (p.citeCount / 1000).toFixed(p.citeCount >= 10000 ? 0 : 1) + 'k' : p.citeCount;
    const tagHtml = p.tags.map(t => {
      const cls = t === '经典' ? 'amber' : t === '最新' ? 'emerald' : t === '高引用' ? 'blue' : 'purple';
      return `<span class="lib-tag" style="background:var(--lib-${cls}-light);color:var(--lib-${cls}-dark);">${t}</span>`;
    }).join('');
    return `<div class="paper-card ${read ? 'is-read' : ''}">
      <div class="paper-top">
        <div class="paper-icon">${LIB_Icon.paper}</div>
        <div class="paper-main">
          <a class="paper-title" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>
          <div class="paper-meta">${esc(p.authors)} · ${esc(p.journal)} · ${p.year}</div>
          <div class="paper-tags">
            <span class="lib-tag ${diff.cls}">${diff.label}</span>
            <span class="lib-tag tag-cite">被引 ${cite}</span>
            ${tagHtml}
            <span class="lib-tag tag-domain">${d.icon} ${d.name}</span>
          </div>
          <div class="paper-actions">
            <button class="lib-btn lib-btn-ai lib-btn-sm" data-lib-action="ai-explain" data-id="${p.id}">${LIB_Icon.ai} AI 讲解</button>
            <button class="lib-btn lib-btn-sm" data-lib-action="open-paper" data-id="${p.id}">${LIB_Icon.guide} 详情/问答</button>
            <button class="lib-btn lib-btn-sm ${read ? 'lib-btn-primary' : ''}" data-lib-action="toggle-read" data-id="${p.id}" title="点击切换已读状态" style="margin-left:auto;">${LIB_Icon.check}${read ? ' 已读' : ' 标记已读'}</button>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ==================== 弹窗：详情 / 论文 / 表单 ==================== */
  function openBook(id) {
    const b = getBook(id); if (!b) return;
    const d = LIB_DOMAINS.find(x => x.id === (getBookDomain(b.id) || b.domain));
    const st = getBookStatus(b.id);
    const coverStyle = b.cover ? `background-image:url('${esc(b.cover)}');color:transparent;` : `background:var(--lib-${d.color});`;
    const resonanceCount = getResonanceCountForBook(b.id);
    const modal = document.getElementById('lib-book-modal');
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="lib-modal-back" data-lib-action="close-modal">
        <div class="lib-modal" data-lib-action="noop">
          <div class="lib-modal-head">
            <div class="lib-modal-cover ${b.cover ? 'has-cover' : ''}" style="${coverStyle}">${b.cover ? '' : esc((b.title || '').slice(0, 4))}</div>
            <div class="lib-modal-head-title">
              <div class="mh-name">${esc(b.title)}</div>
              <div class="mh-author">${esc(b.author || '未知作者')} · ${d.icon} ${d.name}</div>
            </div>
            <div class="lib-modal-head-actions">
              <button class="lib-btn lib-btn-sm" data-lib-action="fetch-cover" data-id="${id}" title="从 OpenLibrary 自动获取封面">${LIB_Icon.link}获取封面</button>
              <button class="lib-btn lib-btn-sm" data-lib-action="open-form-book" data-id="${id}" title="编辑书名/作者/领域/难度">${LIB_Icon.edit}编辑</button>
              <button class="lib-btn lib-btn-sm lib-btn-ghost" data-lib-action="delete-book" data-id="${id}" title="删除此书">${LIB_Icon.trash}删除</button>
              <button class="lib-modal-close" data-lib-action="close-modal">×</button>
            </div>
          </div>
          <div class="lib-modal-body">
            <div class="status-row">
              ${['want', 'reading', 'done'].map(s => `<button class="status-btn ${st === s ? 'active' : ''}" data-lib-action="set-status" data-id="${id}" data-status="${s}">${LIB_STATUS_MAP[s]}</button>`).join('')}
              <span class="lib-hint" style="margin-left:auto;">已读计入首页"已读完书籍"</span>
            </div>
            <div class="detail-tabs" id="lib-detail-tabs">
              <button class="detail-tab active" data-lib-action="detail-tab" data-tab="mindmap" data-id="${id}">${LIB_Icon.mindmap}思维导图</button>
              <button class="detail-tab" data-lib-action="detail-tab" data-tab="guide" data-id="${id}">${LIB_Icon.guide}导读</button>
              <button class="detail-tab" data-lib-action="detail-tab" data-tab="essence" data-id="${id}">${LIB_Icon.essence}精华解读</button>
              <button class="detail-tab" data-lib-action="detail-tab" data-tab="resonance" data-id="${id}">${LIB_Icon.resonance}阅读共鸣 ${resonanceCount > 0 ? `<span class="dt-badge">${resonanceCount}</span>` : ''}</button>
            </div>
            <div id="lib-detail-body">${mindmapHtml(b)}</div>
            <div class="ai-box">
              <div class="ai-input-row">
                <input type="text" id="lib-ai-question" placeholder="就这本书提问">
                <button class="lib-btn lib-btn-primary lib-btn-sm" data-lib-action="ai-ask-book" data-id="${id}">${LIB_Icon.ai}提问</button>
              </div>
              <div id="lib-ai-answer" class="ai-answer" style="display:none;"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function mindmapHtml(b) {
    if (!b.mindmap || !(b.mindmap.children || []).length) return '<div class="empty">暂无思维导图</div>';
    const root = b.mindmap.root || b.title;
    const renderBranch = (children) => children.map(c => {
      if (c.children && c.children.length) {
        return `<div class="mm-branch">
          <div class="mm-branch-head"><span class="leaf-bullet">▸</span>${esc(c.label)}</div>
          ${c.children.map(leaf => `<div class="mm-leaf"><span class="leaf-bullet">·</span>${esc(leaf.label)}</div>`).join('')}
        </div>`;
      }
      return `<div class="mm-leaf" style="margin-left:0;"><span class="leaf-bullet">·</span>${esc(c.label)}</div>`;
    }).join('');
    return `<div class="mindmap">
      <div class="mm-root">${LIB_Icon.mindmap} ${esc(root)}</div>
      ${renderBranch(b.mindmap.children)}
    </div>`;
  }
  function guideHtml(b) {
    const g = b.guide || {};
    const diff = LIB_DIFF_MAP[b.difficulty] || LIB_DIFF_MAP.medium;
    return `
      <div class="guide-section"><div class="gs-title">${LIB_Icon.target} 为什么读</div><div class="gs-body">${esc(g.why || '—')}</div></div>
      <div class="guide-section"><div class="gs-title">${LIB_Icon.question} 带着问题阅读（${(g.questions || []).length} 个）</div>
        <div class="guide-q-list">
          ${(g.questions || []).map((q, i) => `<div class="guide-question"><span class="gq-num">Q${i + 1}</span><span>${esc(q)}</span></div>`).join('')}
        </div>
      </div>
      <div class="guide-section"><div class="gs-title">${LIB_Icon.bulb} 核心概念</div>
        <div class="core-tags">${(g.core || []).map(c => `<span class="ct-tag">${esc(c)}</span>`).join('')}</div>
      </div>
      <div class="guide-section"><div class="gs-title">${LIB_Icon.folder} 阅读难度</div>
        <div class="diff-row">
          <span class="lib-tag ${diff.cls}">${diff.label}</span>
          <span class="diff-desc">${esc(g.difficultyDesc || '')}</span>
        </div>
      </div>`;
  }
  function essenceHtml(b) {
    const q = encodeURIComponent(b.title + ' 解读');
    return `
      <a class="essence-link" href="https://search.bilibili.com/all?keyword=${q}" target="_blank" rel="noopener">
        <span class="el-badge bili">B站</span>
        <span class="el-title">在 B 站搜索「${esc(b.title)}」解读视频</span>
        <span class="el-go">${LIB_Icon.link}</span>
      </a>
      <a class="essence-link" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">
        <span class="el-badge yt">YouTube</span>
        <span class="el-title">在 YouTube 搜索「${esc(b.title)}」解读视频</span>
        <span class="el-go">${LIB_Icon.link}</span>
      </a>
      <a class="essence-link" href="https://weread.qq.com/search?keyword=${encodeURIComponent(b.title)}" target="_blank" rel="noopener">
        <span class="el-badge zy">微信读书</span>
        <span class="el-title">在「微信读书」搜索「${esc(b.title)}」精华解读</span>
        <span class="el-go">${LIB_Icon.link}</span>
      </a>
      <div class="lib-hint" style="margin-top:8px;">三站外链搜索：微信读书的精华解读、B 站视频讲解、YouTube 海外视角。</div>
    `;
  }
  function resonanceHtml(bookId) {
    const list = getResonancesForBook(bookId);
    if (!list.length) {
      return `<div class="resonance-empty">
        ${LIB_Icon.resonance}
        <div>你还没有为这本书添加共鸣。</div>
        <div class="re-tip">在阅读共鸣模块新增条目时，关联图书选择这本书即可自动同步</div>
      </div>`;
    }
    return `<div class="resonance-list">${list.map(r => {
      const date = r.createdAt ? fmtDay(r.createdAt) : '';
      return `<div class="resonance-card">
        <button class="rc-x" data-lib-action="delete-resonance" data-id="${r.id}" title="解除关联" aria-label="解除关联">×</button>
        <div class="rc-meta">${LIB_Icon.resonance}<span>${esc(date)}</span></div>
        ${r.excerpt ? `<div class="rc-excerpt">"${esc(r.excerpt)}"</div>` : ''}
        <div class="rc-resonance"><b>触动：</b>${esc(r.resonance || '')}</div>
        ${r.reflection ? `<div class="rc-reflect"><b>感悟：</b>${esc(r.reflection)}</div>` : ''}
      </div>`;
    }).join('')}</div>`;
  }

  function openPaper(id) {
    const p = getPapers().find(x => x.id === id); if (!p) return;
    const d = LIB_DOMAINS.find(x => x.id === p.domain);
    const diff = LIB_DIFF_MAP[p.difficulty] || LIB_DIFF_MAP.medium;
    const modal = document.getElementById('lib-paper-modal');
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="lib-modal-back" data-lib-action="close-modal">
        <div class="lib-modal" data-lib-action="noop" style="max-width:680px;">
          <div class="lib-modal-head">
            <div class="lib-modal-cover" style="background:var(--lib-${d.color}-light);">${LIB_Icon.paper}</div>
            <div class="lib-modal-head-title">
              <div class="mh-name">${esc(p.title)}</div>
              <div class="mh-author">${esc(p.authors)} · ${esc(p.journal)} · ${p.year}</div>
            </div>
            <div class="lib-modal-head-actions">
              <button class="lib-btn lib-btn-sm" data-lib-action="open-paper-url" data-url="${esc(p.url)}">${LIB_Icon.link} 原文</button>
              <button class="lib-modal-close" data-lib-action="close-modal">×</button>
            </div>
          </div>
          <div class="lib-modal-body">
            <div class="paper-tags" style="margin-bottom:14px;">
              <span class="lib-tag ${diff.cls}">${diff.label}</span>
              <span class="lib-tag tag-cite">被引 ${p.citeCount.toLocaleString()}</span>
              <span class="lib-tag tag-domain">${d.icon} ${d.name}</span>
              ${p.tags.map(t => `<span class="lib-tag">${esc(t)}</span>`).join('')}
            </div>
            <div class="lib-card-title">${LIB_Icon.ai} 500 字通俗讲解</div>
            <button class="lib-btn lib-btn-ai lib-btn-sm" data-lib-action="ai-explain-paper" data-id="${id}">✨ 一键生成讲解</button>
            <div id="lib-paper-explain-body" class="paper-explain-inline" style="display:none;"></div>
            <div class="ai-box">
              <div class="lib-card-title">${LIB_Icon.chat} AI 问答</div>
              <div class="ai-input-row">
                <input type="text" id="lib-paper-question" placeholder="就这篇论文提问">
                <button class="lib-btn lib-btn-primary lib-btn-sm" data-lib-action="ai-ask-paper" data-id="${id}">提问</button>
              </div>
              <div id="lib-paper-answer" class="ai-answer" style="display:none;"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function openFormBook(bookId) {
    const isEdit = !!bookId;
    let draft;
    if (isEdit) {
      const b = getBook(bookId); if (!b) return;
      draft = {
        id: b.id, title: b.title || '', author: b.author || '',
        domain: (getBookDomain(b.id) || b.domain) || 'humanity',
        difficulty: b.difficulty || 'medium',
        cover: b.cover || null, coverSource: b.cover ? 'upload' : 'auto'
      };
    } else {
      draft = { id: null, title: '', author: '', domain: 'humanity', difficulty: 'medium', cover: null, coverSource: 'auto' };
    }
    state.formDraft = draft;
    const modal = document.getElementById('lib-form-modal');
    const d = LIB_DOMAINS.find(x => x.id === draft.domain) || LIB_DOMAINS[0];
    modal.style.display = 'block';
    modal.innerHTML = `
      <div class="lib-modal-back" data-lib-action="close-modal">
        <div class="lib-modal" data-lib-action="noop" style="max-width:560px;">
          <div class="lib-modal-head">
            <div class="lib-modal-head-title"><div class="mh-name">${isEdit ? '编辑书籍' : '添加书籍'}</div></div>
            <button class="lib-modal-close" data-lib-action="close-modal">×</button>
          </div>
          <div class="lib-modal-body">
            <div id="lib-ol-search-section" style="margin-bottom:16px; padding-bottom:16px; border-bottom:0.5px solid var(--border);">
              <label style="font-size:12px; color:var(--text-secondary, #6B6B68); display:block; margin-bottom:6px;">${LIB_Icon.link} OpenLibrary 全球书库搜索</label>
              <div style="display:flex; gap:6px;">
                <input type="text" id="lib-ol-search-input" placeholder="输入书名搜索（如：影响力）" style="flex:1; padding:7px 12px; border:0.5px solid var(--border); border-radius:var(--radius); font-size:13px; outline:none;" onfocus="this.style.borderColor='var(--lib-olive)'" onblur="this.style.borderColor='var(--border)'">
                <button class="lib-btn lib-btn-sm lib-btn-primary" data-lib-action="ol-search">搜索</button>
              </div>
              <div id="lib-ol-results" style="margin-top:8px;"></div>
            </div>
            <div class="cover-uploader">
              <div class="cu-preview" id="lib-cover-preview" style="${draft.cover ? `background-image:url('${esc(draft.cover)}');` : `background:var(--lib-${d.color});color:rgba(255,255,255,0.85);`}">${draft.cover ? '' : `${esc((draft.title || '书名').slice(0,4))}`}</div>
              <div class="cu-fields">
                <div class="cu-buttons">
                  <input type="file" id="lib-book-cover-input" accept="image/*">
                  <button class="lib-btn lib-btn-sm" data-lib-action="pick-cover">${LIB_Icon.upload} 上传封面</button>
                  <button class="lib-btn lib-btn-sm lib-btn-ghost" data-lib-action="clear-cover" ${draft.cover ? '' : 'style="display:none;"'}>${LIB_Icon.trash} 清除</button>
                </div>
                <div class="cu-hint">支持 jpg / png / webp；建议竖图（2:3）。也可用上方 OpenLibrary 搜索自动获取封面。不设置则使用领域色 + 书名居中。</div>
                <div class="cu-source" id="lib-cover-source">${draft.cover ? '已使用自定义封面' : '当前使用领域色封面'}</div>
              </div>
            </div>
            <div class="form-row" style="margin-top:16px;"><label>书名 <span style="color:var(--lib-rose-dark);">*</span></label>
              <input type="text" id="lib-form-title" value="${esc(draft.title)}" placeholder="例如：思考，快与慢" maxlength="60"></div>
            <div class="form-row"><label>作者</label>
              <input type="text" id="lib-form-author" value="${esc(draft.author)}" placeholder="可选" maxlength="60"></div>
            <div class="form-row"><label>所属领域</label>
              <select id="lib-form-domain">${LIB_DOMAINS.map(x => `<option value="${x.id}" ${x.id === draft.domain ? 'selected' : ''}>${x.icon} ${x.name}</option>`).join('')}</select></div>
            <div class="form-row"><label>阅读难度</label>
              <select id="lib-form-difficulty">
                <option value="easy" ${draft.difficulty === 'easy' ? 'selected' : ''}>入门</option>
                <option value="medium" ${draft.difficulty === 'medium' ? 'selected' : ''}>进阶</option>
                <option value="hard" ${draft.difficulty === 'hard' ? 'selected' : ''}>精深</option>
              </select></div>
            <div class="lib-hint" style="margin-bottom:8px;">${isEdit ? '保存后更新书名/作者/领域/难度/封面。' : '添加后自动生成基础思维导图和导读占位。'}</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="lib-btn lib-btn-primary" data-lib-action="save-form-book">保存</button>
              <button class="lib-btn" data-lib-action="close-modal">取消</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ==================== 事件委托 ==================== */

  function closeModals() {
    ['lib-book-modal', 'lib-paper-modal', 'lib-form-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function bindEvents(rootEl) {
    // 分段按钮（领域/状态/视图/难度/已读）——委托到 handleSegmentClicks
    rootEl.addEventListener('click', handleSegmentClicks);
    // 工具栏：搜索/排序
    const searchInput = rootEl.querySelector('#lib-book-search');
    if (searchInput) searchInput.addEventListener('input', (e) => {
      state.bookSearch = e.target.value; renderBooks();
    });
    const sortSelect = rootEl.querySelector('#lib-book-sort');
    if (sortSelect) sortSelect.addEventListener('change', (e) => {
      state.bookSort = e.target.value; renderBooks();
    });
    // 初始化图标 svg 的 width/height（在视图绘制后立刻绑定）
    rootEl.querySelectorAll('svg.icon').forEach(svg => {
      if (!svg.getAttribute('width')) svg.setAttribute('width', '14');
      if (!svg.getAttribute('height')) svg.setAttribute('height', '14');
    });
  }

  function handleLibraryClick(e) {
    const t = e.target.closest('[data-lib-action]');
    if (!t) return;
    const action = t.dataset.libAction;
    switch (action) {
      case 'close-modal': closeModals(); break;
      case 'noop': e.stopPropagation(); break;
      case 'toggle-day-checkin': {
        const dateKey = t.dataset.key;
        const checked = _toggleDayCheckin(dateKey);
        renderHeatmap();
        if (checked) {
          const firstDate = _getFirstCheckinDate();
          const clickDate = new Date(dateKey + 'T00:00:00');
          const dayNum = firstDate ? Math.floor((clickDate - firstDate) / 86400000) + 1 : 1;
          let msg;
          if (dayNum === 1) msg = '今天是读书的第 1 天，开启阅读之旅！';
          else if (dayNum === 7) msg = '第 7 天打卡成功！一周坚持达成！';
          else if (dayNum === 14) msg = '第 14 天！两周坚持，阅读已成习惯。';
          else if (dayNum === 30) msg = '第 30 天！一个月坚持，了不起！';
          else if (dayNum === 50) msg = '第 50 天！半百达成，你很棒！';
          else if (dayNum === 100) msg = '第 100 天！百日坚持，致敬！';
          else if (dayNum > 100) msg = '第 ' + dayNum + ' 天！百日的坚持，了不起！';
          else msg = '第 ' + dayNum + ' 天打卡成功！坚持就是胜利。';
          flashTip(msg);
        } else {
          flashTip('已取消打卡');
        }
        break;
      }
      case 'switch-tab': {
        state.tab = t.dataset.tab;
        document.querySelectorAll('.main-tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        document.getElementById('lib-view-books').style.display = state.tab === 'books' ? 'block' : 'none';
        document.getElementById('lib-view-papers').style.display = state.tab === 'papers' ? 'block' : 'none';
        const isBooks = state.tab === 'books';
        const labelEl = document.getElementById('lib-domain-label');
        const stripEl = document.getElementById('lib-domain-strip');
        if (labelEl) labelEl.style.display = isBooks ? '' : 'none';
        if (stripEl) stripEl.style.display = isBooks ? 'flex' : 'none';
        if (state.tab === 'papers') renderPapers();
        break;
      }
      case 'detail-tab': {
        e.stopPropagation();
        const id = t.dataset.id;
        const b = getBook(id);
        document.querySelectorAll('#lib-detail-tabs .detail-tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        const body = document.getElementById('lib-detail-body');
        const which = t.dataset.tab;
        if (which === 'mindmap') body.innerHTML = mindmapHtml(b);
        else if (which === 'guide') body.innerHTML = guideHtml(b);
        else if (which === 'essence') body.innerHTML = essenceHtml(b);
        else if (which === 'resonance') body.innerHTML = resonanceHtml(id);
        const cnt = getResonanceCountForBook(id);
        const head = document.querySelector('#lib-detail-tabs .detail-tab[data-tab="resonance"]');
        if (head) head.innerHTML = `${LIB_Icon.resonance}阅读共鸣 ${cnt > 0 ? `<span class="dt-badge">${cnt}</span>` : ''}`;
        break;
      }
      case 'open-book': openBook(t.dataset.id); break;
      case 'set-status': {
        e.stopPropagation();
        const id = t.dataset.id;
        const st = LibStore.get('bookStatus', {});
        const oldStatus = st[id];
        // 点击已激活状态 → 清除；否则切换到新状态
        const targetStatus = t.dataset.status;
        const newStatus = (oldStatus === targetStatus) ? null : targetStatus;
        if (newStatus === null) delete st[id];
        else st[id] = newStatus;
        LibStore.set('bookStatus', st);
        // 状态变更不计入热力图（只打卡计入）
        // 更新按钮 active 状态
        document.querySelectorAll('#lib-book-modal .status-btn').forEach(x => x.classList.remove('active'));
        if (st[id]) {
          const targetBtn = document.querySelector(`#lib-book-modal .status-btn[data-status="${st[id]}"]`);
          if (targetBtn) targetBtn.classList.add('active');
        }
        renderBooks();
        renderHeatmap();
        // 通知 self-research 首页更新大数字
        if (window.App) {
          window.App.renderDashboard && window.App.renderDashboard();
          window.App.renderSidebar && window.App.renderSidebar();
        }
        flashTip(st[id] ? `已设为「${LIB_STATUS_MAP[st[id]]}」` : '已清除状态');
        break;
      }
      case 'ai-ask-book': {
        e.stopPropagation();
        const qEl = document.getElementById('lib-ai-question');
        const q = (qEl?.value || '').trim();
        if (!q) { qEl?.focus?.(); return; }
        aiStreamTo(document.getElementById('lib-ai-answer'), q);
        break;
      }
      case 'open-paper': openPaper(t.dataset.id); break;
      case 'toggle-read': {
        e.stopPropagation();
        e.preventDefault();
        const id = t.dataset.id;
        const set = getReadSet();
        set[id] = !set[id];
        LibStore.set('paperReadSet', set);
        // 论文已读不计入热力图（只打卡计入）
        renderPapers();
        renderHeatmap();
        if (set[id]) {
          const totalPapers = getPapers().length;
          const readTotal = Object.values(getReadSet()).filter(Boolean).length;
          flashTip(`已标记为已读 · 累计 ${readTotal}/${totalPapers} · 今日推荐已自动补充`);
        } else flashTip('已取消已读');
        break;
      }
      case 'ai-explain': {
        e.stopPropagation();
        const id = t.dataset.id;
        const p = getPapers().find(x => x.id === id); if (!p) break;
        const card = t.closest('.paper-card');
        let el = card.querySelector('.paper-explain-inline');
        if (!el) { el = document.createElement('div'); el.className = 'paper-explain-inline'; card.appendChild(el); }
        aiStreamTo(el, `为论文《${p.title}》写一段 500 字内的通俗中文讲解`);
        break;
      }
      case 'ai-explain-paper': {
        e.stopPropagation();
        const id = t.dataset.id;
        const p = getPapers().find(x => x.id === id); if (!p) break;
        aiStreamTo(document.getElementById('lib-paper-explain-body'), `为论文《${p.title}》写一段 500 字内的通俗中文讲解`);
        break;
      }
      case 'ai-ask-paper': {
        e.stopPropagation();
        const qEl = document.getElementById('lib-paper-question');
        const q = (qEl?.value || '').trim();
        if (!q) { qEl?.focus?.(); return; }
        aiStreamTo(document.getElementById('lib-paper-answer'), q);
        break;
      }
      case 'open-paper-url': {
        e.stopPropagation();
        window.open(t.dataset.url, '_blank', 'noopener');
        break;
      }
      case 'open-form-book': {
        e.stopPropagation();
        openFormBook(t.dataset.id || null);
        break;
      }
      case 'pick-cover': {
        e.stopPropagation();
        document.getElementById('lib-book-cover-input').click();
        break;
      }
      case 'clear-cover': {
        e.stopPropagation();
        state.formDraft.cover = null;
        const preview = document.getElementById('lib-cover-preview');
        const d = LIB_DOMAINS.find(x => x.id === state.formDraft.domain) || LIB_DOMAINS[0];
        preview.classList.remove('has-cover');
        preview.style.backgroundImage = '';
        preview.style.background = `var(--lib-${d.color})`;
        preview.style.color = 'rgba(255,255,255,0.85)';
        preview.textContent = (state.formDraft.title || '书名').slice(0, 4);
        t.style.display = 'none';
        const src = document.getElementById('lib-cover-source');
        if (src) src.textContent = '当前使用领域色封面';
        break;
      }
      case 'save-form-book': {
        e.stopPropagation();
        const d = state.formDraft;
        d.title = document.getElementById('lib-form-title').value.trim();
        d.author = document.getElementById('lib-form-author').value.trim();
        d.domain = document.getElementById('lib-form-domain').value;
        d.difficulty = document.getElementById('lib-form-difficulty').value;
        if (!d.title) { flashTip('请输入书名'); return; }
        if (d.id) {
          const overrides = LibStore.get('bookOverrides', {});
          overrides[d.id] = { ...(overrides[d.id] || {}), title: d.title, author: d.author, domain: d.domain, difficulty: d.difficulty, cover: d.cover };
          LibStore.set('bookOverrides', overrides);
          flashTip('已更新');
        } else {
          const custom = LibStore.get('customBooks', []);
          custom.push({
            id: 'c' + Date.now(), domain: d.domain, title: d.title, author: d.author || '未知作者',
            difficulty: d.difficulty, cover: d.cover,
            mindmap: { root: d.title, children: [
              { label: '核心概念' }, { label: '关键方法' }, { label: '应用场景' }, { label: '延伸阅读' }
            ]},
            guide: { why: '（待 AI 生成 — 首次保存后可在「编辑」中补全）',
                     questions: ['（待补充导读问题）'], core: [], difficulty: LIB_DIFF_MAP[d.difficulty].label, difficultyDesc: '' }
          });
          LibStore.set('customBooks', custom);
          flashTip('已添加');
        }
        closeModals();
        renderDomainStrip(); renderBooks();
        if (window.App && window.App.renderDashboard) window.App.renderDashboard();
        break;
      }
      case 'delete-resonance': {
        e.stopPropagation();
        const id = t.dataset.id;
        // 仅解除关联：把 sr_readings 中对应 id 的 relatedBook 清空
        try {
          const rs = JSON.parse(localStorage.getItem('sr_readings') || '[]');
          const i = rs.findIndex(x => x.id === id);
          if (i >= 0) { rs[i].relatedBook = null; localStorage.setItem('sr_readings', JSON.stringify(rs)); }
        } catch (e) {}
        const modal = document.getElementById('lib-book-modal');
        const editBtn = modal.querySelector('[data-lib-action="open-form-book"]');
        const bookId = editBtn?.dataset.id;
        if (bookId) {
          document.getElementById('lib-detail-body').innerHTML = resonanceHtml(bookId);
          const cnt = getResonanceCountForBook(bookId);
          const tab = document.querySelector('#lib-detail-tabs .detail-tab[data-tab="resonance"]');
          if (tab) tab.innerHTML = `${LIB_Icon.resonance}阅读共鸣 ${cnt > 0 ? `<span class="dt-badge">${cnt}</span>` : ''}`;
        }
        renderBooks();
        flashTip('已解除关联');
        break;
      }
      case 'delete-book': {
        e.stopPropagation();
        e.preventDefault();
        const id = t.dataset.id;
        const b = getBook(id);
        if (!b) break;
        if (!confirm(`确定删除《${b.title}》？`)) break;
        if (b.isCustom) {
          // 自定义书籍：从 customBooks 中物理删除
          const custom = LibStore.get('customBooks', []).filter(x => x.id !== id);
          LibStore.set('customBooks', custom);
          // 同时清除 overrides
          const overrides = LibStore.get('bookOverrides', {});
          delete overrides[id];
          LibStore.set('bookOverrides', overrides);
        } else {
          // 种子书籍：加入隐藏列表
          const hidden = LibStore.get('hiddenBookIds', []);
          if (!hidden.includes(id)) hidden.push(id);
          LibStore.set('hiddenBookIds', hidden);
        }
        // 清除阅读状态
        const st = LibStore.get('bookStatus', {});
        delete st[id];
        LibStore.set('bookStatus', st);
        renderDomainStrip(); renderBooks();
        closeModals();
        if (window.App && window.App.renderDashboard) window.App.renderDashboard();
        flashTip(`已删除《${b.title}》`);
        break;
      }
      case 'ol-search': {
        const input = document.getElementById('lib-ol-search-input');
        const resultsEl = document.getElementById('lib-ol-results');
        if (!input || !resultsEl) break;
        const q = input.value.trim();
        if (!q) { resultsEl.innerHTML = '<div style="font-size:12px;color:var(--lib-rose-dark);padding:4px 0;">请输入书名</div>'; break; }
        resultsEl.innerHTML = '<div style="font-size:12px;color:var(--text-tertiary, #9B9B98);padding:4px 0;">搜索中...</div>';
        fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=6&fields=key,title,author_name,cover_i,first_publish_year`)
          .then(r => r.json())
          .then(data => {
            const docs = (data.docs || []).filter(d => d.title);
            if (!docs.length) {
              resultsEl.innerHTML = '<div style="font-size:12px;color:var(--text-tertiary, #9B9B98);padding:4px 0;">未找到相关书籍</div>';
              return;
            }
            resultsEl.innerHTML = docs.map((d, i) => {
              const cover = d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : '';
              const coverHtml = cover
                ? `<img src="${cover}" style="width:30px;height:42px;object-fit:cover;border-radius:3px;flex-shrink:0;" onerror="this.style.display='none'">`
                : `<div style="width:30px;height:42px;border-radius:3px;background:var(--bg-hover,#F0EFED);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-tertiary,#9B9B98);">${LIB_Icon.book}</div>`;
              return `<div data-lib-action="ol-pick" data-idx="${i}" style="display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='var(--bg-hover,#F0EFED)'" onmouseout="this.style.background='transparent'">
                ${coverHtml}
                <div style="flex:1;min-width:0;">
                  <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(d.title)}</div>
                  <div style="font-size:11px;color:var(--text-tertiary,#9B9B98);">${esc((d.author_name || ['未知']).join(', '))}${d.first_publish_year ? ' · ' + d.first_publish_year : ''}</div>
                </div>
                <span style="font-size:11px;color:var(--lib-olive-dark);">${LIB_Icon.plus}</span>
              </div>`;
            }).join('');
            // Store results for ol-pick
            state._olResults = docs.map(d => ({
              title: d.title,
              author: (d.author_name || []).join(', '),
              cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : null
            }));
          })
          .catch(err => {
            resultsEl.innerHTML = '<div style="font-size:12px;color:var(--lib-rose-dark);padding:4px 0;">搜索失败，请检查网络</div>';
          });
        break;
      }
      case 'ol-pick': {
        const idx = parseInt(t.dataset.idx);
        const results = state._olResults || [];
        if (isNaN(idx) || !results[idx]) break;
        const r = results[idx];
        const titleEl = document.getElementById('lib-form-title');
        const authorEl = document.getElementById('lib-form-author');
        const coverPreview = document.getElementById('lib-cover-preview');
        const coverSource = document.getElementById('lib-cover-source');
        const clearBtn = document.querySelector('[data-lib-action="clear-cover"]');
        if (titleEl) titleEl.value = r.title;
        if (authorEl) authorEl.value = r.author;
        if (r.cover && coverPreview) {
          coverPreview.style.backgroundImage = `url('${r.cover}')`;
          coverPreview.style.backgroundSize = 'cover';
          coverPreview.style.backgroundPosition = 'center';
          coverPreview.classList.add('has-cover');
          coverPreview.textContent = '';
          state.formDraft.cover = r.cover;
          state.formDraft.coverSource = 'openlibrary';
          if (coverSource) coverSource.textContent = '已从 OpenLibrary 获取封面';
          if (clearBtn) clearBtn.style.display = '';
        }
        // Clear search results
        document.getElementById('lib-ol-results').innerHTML = '';
        document.getElementById('lib-ol-search-input').value = '';
        flashTip(`已填入：${r.title}`);
        break;
      }
      case 'fetch-cover': {
        // Auto-fetch cover from OpenLibrary for a book in detail modal
        const id = t.dataset.id;
        const b = getBook(id);
        if (!b) break;
        flashTip('正在搜索封面...');
        fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(b.title)}&limit=1&fields=title,cover_i`)
          .then(r => r.json())
          .then(data => {
            const doc = (data.docs || [])[0];
            if (doc && doc.cover_i) {
              const coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
              // Save to overrides
              const overrides = LibStore.get('bookOverrides', {});
              overrides[id] = { ...(overrides[id] || {}), cover: coverUrl };
              LibStore.set('bookOverrides', overrides);
              // Update modal cover
              const modalCover = document.querySelector('.lib-modal-cover');
              if (modalCover) {
                modalCover.style.backgroundImage = `url('${coverUrl}')`;
                modalCover.classList.add('has-cover');
                modalCover.textContent = '';
              }
              renderBooks();
              flashTip('封面获取成功');
            } else {
              flashTip('未找到封面，使用领域色');
            }
          })
          .catch(() => flashTip('搜索失败，请检查网络'));
        break;
      }
    }
  }

  // 标签/分段点击（领域条、书状态、论文分段）
  function handleSegmentClicks(e) {
    const t = e.target.closest('[data-domain],[data-status],[data-view],[data-diff],[data-read]');
    if (!t) return;
    if (t.dataset.domain !== undefined) {
      state.domain = t.dataset.domain;
      renderDomainStrip(); renderBooks();
      return;
    }
    if (t.dataset.status !== undefined && t.closest('#lib-book-status-seg')) {
      document.querySelectorAll('#lib-book-status-seg button').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      state.bookStatus = t.dataset.status;
      renderBooks();
      return;
    }
    if (t.dataset.view !== undefined) {
      document.querySelectorAll('#lib-paper-view-seg button').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      state.paperView = t.dataset.view;
      document.getElementById('lib-papers-filters-daily').style.display = state.paperView === 'daily' ? 'flex' : 'none';
      document.getElementById('lib-papers-filters-lib').style.display = state.paperView === 'library' ? 'flex' : 'none';
      renderPapers();
      return;
    }
    if (t.dataset.diff !== undefined && t.closest('.paper-diff-seg')) {
      t.closest('.paper-diff-seg').querySelectorAll('button').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      // Sync the other visible seg group
      document.querySelectorAll('.paper-diff-seg').forEach(sg => {
        if (sg !== t.closest('.paper-diff-seg')) sg.querySelectorAll('button').forEach(x => x.classList.toggle('active', x.dataset.diff === t.dataset.diff));
      });
      state.paperDiff = t.dataset.diff;
      renderPapers();
      return;
    }
    if (t.dataset.read !== undefined && t.closest('.paper-read-seg')) {
      t.closest('.paper-read-seg').querySelectorAll('button').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.querySelectorAll('.paper-read-seg').forEach(sg => {
        if (sg !== t.closest('.paper-read-seg')) sg.querySelectorAll('button').forEach(x => x.classList.toggle('active', x.dataset.read === t.dataset.read));
      });
      state.paperRead = t.dataset.read;
      renderPapers();
      return;
    }
  }

  // 封面文件上传
  function handleFormChange(e) {
    if (e.target && e.target.id === 'lib-book-cover-input') {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      if (f.size > 2 * 1024 * 1024) { flashTip('封面图请控制在 2MB 以内'); e.target.value = ''; return; }
      const reader = new FileReader();
      reader.onload = ev => {
        state.formDraft.cover = ev.target.result;
        state.formDraft.coverSource = 'upload';
        const preview = document.getElementById('lib-cover-preview');
        preview.style.backgroundImage = `url('${ev.target.result}')`;
        preview.classList.add('has-cover');
        preview.textContent = '';
        const clrBtn = document.querySelector('[data-lib-action="clear-cover"]');
        if (clrBtn) clrBtn.style.display = '';
        const src = document.getElementById('lib-cover-source');
        if (src) src.textContent = `已使用自定义封面（${(f.size / 1024).toFixed(0)} KB）`;
      };
      reader.readAsDataURL(f);
    }
  }

  /* ==================== 主流程 ==================== */
  function mount() {
    // 主视图已由 Views.library() 渲染到 #main 中
    renderHeatmap();
    renderDomainStrip();
    renderBooks();
    renderPapers();
  }

  /* ==================== 公开发布 ==================== */
  window.Library = {
    state,
    mount,
    renderLibrary,
    renderDomainStrip,
    renderBooks,
    renderPapers,
    renderBooksToolbar,
    bindEvents,
    handleLibraryClick,
    handleSegmentClicks,
    handleFormChange,
    getBooks,
    getBook,
    getPapers,
    getReadSet,
    getBookStatus,
    getBookDomain,
    getResonanceCountForBook,
    getResonancesForBook,
    getBooksForOther,
    countReadBooks() {
      let n = 0;
      const s = LibStore.get('bookStatus', {});
      Object.values(s).forEach(v => { if (v === 'done') n++; });
      return n;
    },
    closeModals,
    flashTip,
    LIB_Icon, LIB_DOMAINS, LIB_DIFF_MAP, LIB_STATUS_MAP,
    LIB_SEED_BOOKS, LIB_SEED_PAPERS,
    LIB_SEED_BOOKS_EXTRA: typeof LIB_SEED_BOOKS_EXTRA !== 'undefined' ? LIB_SEED_BOOKS_EXTRA : []
  };
})();
