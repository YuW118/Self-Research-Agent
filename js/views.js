/**
 * Self-Research Agent - 视图渲染层
 * 7 个视图：Dashboard / Check-in / Research / Manual / Insights / Timeline / Settings
 */

const HEALING_QUOTES = [
  '灵魂的欲望是命运的先知',
  '你不需要被修复，你只需要被读懂',
  'Self-Research，是把窥探别人的时间，用来读懂自己',
  '真正的自由，是看清自己的边界后依然温柔',
  '允许一切发生，包括你偶尔的不够好',
  '你研究世界这么久，也该好好研究自己了',
  '情绪不是敌人，是指向你未被满足需求的信使',
  '所谓成长，不过是一次次把"原来如此"变成"我懂了"',
  '把自己当成一个值得长期投资的项目',
  '你不必追逐光，你本就可以成为自己的灯',
  '敏感不是缺陷，是比别人多开了一扇感知的窗',
  '慢一点没关系，只要方向是向内的'
];

const SOURCE_TYPES = [
  { id: 'book', label: '书籍', emoji: '📖', color: 'olive' },
  { id: 'wechat', label: '公众号', emoji: '💬', color: 'blue' },
  { id: 'bilibili', label: 'B站', emoji: '📺', color: 'purple' },
  { id: 'douyin', label: '抖音', emoji: '🎬', color: 'amber' },
  { id: 'custom', label: '自定义', emoji: '✨', color: 'coral' }
];

const Views = {

  icons: {
    dashboard: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.3"/></svg>',
    checkin: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3 8h14M7 2v4M13 2v4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M7 12l2 2 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    readings: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5c0-.5.4-1 1-1h4.5c.6 0 1 .5 1 1v11.5c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1V5z" stroke="currentColor" stroke-width="1.3"/><path d="M17 5c0-.5-.4-1-1-1h-4.5c-.6 0-1 .5-1 1v11.5c0-.6.4-1 1-1H16c.6 0 1 .4 1 1V5z" stroke="currentColor" stroke-width="1.3"/></svg>',
    research: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    profile: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h12v12H4z" stroke="currentColor" stroke-width="1.3"/><path d="M7 8h6M7 11h6M7 14h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    insights: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16V8M9 16V4M14 16v-6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    timeline: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.3"/><path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    vision: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.3"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="14" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="14" r="1" fill="currentColor"/><circle cx="14" cy="14" r="1" fill="currentColor"/></svg>',
    settings: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
  },

  navItems: [
    { id: 'dashboard', label: '首页', icon: 'dashboard' },
    { id: 'vision', label: '愿景板', icon: 'vision' },
    { id: 'checkin', label: '每日打卡', icon: 'checkin' },
    { id: 'research', label: '维度研究', icon: 'research' },
    { id: 'readings', label: '阅读共鸣', icon: 'readings' },
    { id: 'profile', label: '自我画像', icon: 'profile' },
    { id: 'insights', label: '模式洞察', icon: 'insights' },
    { id: 'timeline', label: '成长轨迹', icon: 'timeline' },
    { id: 'settings', label: '设置', icon: 'settings' }
  ],

  // === Helpers ===
  _moduleColor(modId) {
    const m = MODULES.find(x => x.id === modId);
    return m ? m.color : 'olive';
  },

  _localIndex(dimId, moduleId) {
    const mod = getModule(moduleId);
    if (!mod) return dimId;
    const i = mod.dimensionIds.indexOf(dimId);
    return i >= 0 ? i + 1 : dimId;
  },

  _fmtDate(dateStr) {
    const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''));
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  },

  _fmtDateTime(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const date = `${d.getMonth() + 1}月${d.getDate()}日`;
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return `${date} · ${time}`;
  },

  _weekday(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
  },

  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _escape(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  _healQuote() {
    const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return HEALING_QUOTES[doy % HEALING_QUOTES.length];
  },

  // 渲染 🎤 语音按钮（webkitSpeechRecognition）
  // field: 用于在 _dispatchAction 里查找目标 textarea/input
  _voiceBtn(field) {
    const supported = (typeof window !== 'undefined') && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    if (!supported) return '';   // 浏览器不支持就不渲染
    return `<button class="voice-btn" type="button" data-action="voice-toggle" data-field="${this._escape(field)}" title="语音输入（再次点击停止）" aria-label="语音输入">🎤</button>`;
  },

  // 阅读共鸣拍下的图片缩略图区
  _readingImagesBlock(images) {
    const arr = Array.isArray(images) ? images : [];
    const empty = arr.length === 0
      ? '<div class="rd-images-empty">还没有图片。点击上方拍照或选择图片后，文字会自动填入下方，图片也会保留在这里方便回看。</div>'
      : '';
    const thumbs = arr.map((src, idx) => `
      <div class="rd-thumb" data-idx="${idx}">
        <img src="${this._escape(src)}" alt="图片${idx + 1}" data-action="view-reading-image" data-idx="${idx}">
        <button class="rd-thumb-x" type="button" data-action="remove-reading-image" data-idx="${idx}" title="删除此图" aria-label="删除图片">×</button>
      </div>`).join('');
    return `
      <div class="rd-images-block">
        <div class="rd-images-label">📷 已添加的图片${arr.length ? ` · ${arr.length} 张` : ''}</div>
        ${empty}
        <div class="rd-images-row">${thumbs}</div>
      </div>
    `;
  },

  _corr(xs, ys) {
    const n = Math.min(xs.length, ys.length);
    if (n < 3) return null;
    const mx = xs.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const my = ys.slice(0, n).reduce((a, b) => a + b, 0) / n;
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      dx += (xs[i] - mx) ** 2;
      dy += (ys[i] - my) ** 2;
    }
    const den = Math.sqrt(dx * dy);
    return den > 0 ? num / den : 0;
  },

  // === Charts ===
  _trendChart(checkins) {
    const recent = checkins.slice(-7);
    if (recent.length === 0) return '<div class="empty-state"><div class="es-text">暂无打卡数据</div></div>';
    const w = 300, h = 70, barW = w / 7, gap = 3;
    const slot = barW / 3;
    let bars = '';
    recent.forEach((c, i) => {
      const x = i * barW + gap;
      const bw = slot - gap;
      const moodH = Math.max(2, (c.mood / 10) * h);
      const energyH = Math.max(2, (c.energy / 10) * h);
      // Sleep normalized to 0-10 scale (assuming 8h = full score)
      const sleepScore = Math.min(10, Math.max(0, (c.sleep / 8) * 10));
      const sleepH = Math.max(2, (sleepScore / 10) * h);
      bars += `<rect x="${x}" y="${h - moodH}" width="${bw}" height="${moodH}" rx="2" fill="#C9A0A0" opacity="0.85"/>`;
      bars += `<rect x="${x + slot}" y="${h - energyH}" width="${bw}" height="${energyH}" rx="2" fill="#7B9E87" opacity="0.85"/>`;
      bars += `<rect x="${x + slot * 2}" y="${h - sleepH}" width="${bw}" height="${sleepH}" rx="2" fill="#C4A35A" opacity="0.85"/>`;
    });
    let labels = '';
    recent.forEach((c, i) => {
      const d = new Date(c.date + 'T00:00:00');
      labels += `<text x="${i * barW + barW / 2}" y="${h + 14}" text-anchor="middle" font-size="9" fill="#9B9B98">${d.getMonth() + 1}/${d.getDate()}</text>`;
    });
    const legend = `
      <g transform="translate(0, ${h + 24})">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#C9A0A0"/>
        <text x="12" y="8" font-size="10" fill="#6B6B68">情绪</text>
        <rect x="50" y="0" width="8" height="8" rx="2" fill="#7B9E87"/>
        <text x="62" y="8" font-size="10" fill="#6B6B68">能量</text>
        <rect x="100" y="0" width="8" height="8" rx="2" fill="#C4A35A"/>
        <text x="112" y="8" font-size="10" fill="#6B6B68">睡眠(8h=满)</text>
      </g>`;
    return `<svg viewBox="0 0 ${w} ${h + 36}" width="100%" style="max-width:340px;"><g>${bars}</g>${labels}${legend}</svg>`;
  },

  _donut(explored, total) {
    const pct = total > 0 ? explored / total : 0;
    const r = 36, c = 2 * Math.PI * r;
    const offset = c * (1 - pct);
    return `<svg viewBox="0 0 100 100" width="90" height="90">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="#E5E4E2" stroke-width="7"/>
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="#9B9476" stroke-width="7"
        stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
        transform="rotate(-90 50 50)" stroke-linecap="round"/>
      <text x="50" y="48" text-anchor="middle" dominant-baseline="central" font-size="18" font-weight="500" fill="#2C2C2A">${explored}</text>
      <text x="50" y="62" text-anchor="middle" font-size="10" fill="#9B9B98">/ ${total}</text>
    </svg>`;
  },

  // === Dashboard ===
  dashboard() {
    const stats = Store.getStats();
    const today = Store.getTodayCheckin();
    const explored = Store.getExploredDimensions();

    const nextDim = DIMENSIONS.find(d => !explored.includes(d.id));

    const moduleHtml = MODULES.map(m => {
      const dims = m.dimensionIds;
      const done = dims.filter(id => explored.includes(id)).length;
      const pct = (done / dims.length * 100).toFixed(0);
      const color = m.color;
      const dimTags = dims.map(id => {
        const d = getDimension(id);
        const isDone = explored.includes(id);
        return `<span class="mod-dim-tag ${isDone ? 'explored' : ''}">${this._localIndex(id, m.id)}.${d.name}</span>`;
      }).join('');
      return `<div class="module-card mod-${color}" data-action="select-module" data-module="${m.id}">
        <div class="mod-header">
          <span class="mod-name text-${color}">${m.name}</span>
          <span class="mod-count tag-${color}">${done}/${dims.length}</span>
        </div>
        <div class="mod-sub">${m.subtitle}</div>
        <div class="mod-progress"><div class="mod-progress-bar progress-${color}" style="width:${pct}%"></div></div>
        <div class="mod-dims">${dimTags}</div>
      </div>`;
    }).join('');

    const recentTl = Store.getTimeline().slice(0, 3);
    const tlHtml = recentTl.length > 0
      ? recentTl.map(e => `<div style="padding:6px 0; border-bottom:0.5px solid var(--border);">
          <div style="font-size:11px; color:var(--text-tertiary);">${this._fmtDate(e.date)}</div>
          <div style="font-size:13px; color:var(--text-primary); margin-top:2px;">${this._escape(e.title)}</div>
        </div>`).join('')
      : '<div class="empty-state"><div class="es-text">还没有动态，开始你的第一次打卡吧</div></div>';

    const recent7 = Store.getRecentCheckins(7).slice().reverse();
    const chartHtml = this._trendChart(recent7);

    // 桌面/移动端"添加到主屏幕"横幅（仅在可安装且未安装时显示）
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const canInstall = !isStandalone && !!App.state.deferredPrompt;
    const installBanner = canInstall ? `
      <div class="card install-banner" style="margin-bottom:16px;">
        <div class="ib-left">
          <img src="assets/icon.svg" alt="" class="ib-icon">
          <div>
            <div class="ib-title">把 Self-Research 添加到主屏幕</div>
            <div class="ib-desc">像原生应用一样使用，支持离线打开</div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" data-action="pwa-install" style="flex-shrink:0;">安装</button>
      </div>` : '';

    return `
      <div class="page-header">
        <h1>Self-Research</h1>
        <div class="desc">用研究外部世界的方法论，系统拆解自己</div>
      </div>

      ${installBanner}

      <div class="heal-quote">
        <div class="hq-mark">"</div>
        <button class="hq-shuffle" data-action="refresh-heal-quote" title="换一句开场白" aria-label="换一句开场白">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M11 1.5L14 4.5L11 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 4.5H14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M5 14.5L2 11.5L5 8.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11.5H2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="hq-text">${App.state.healQuote || this._healQuote()}</div>
        <div class="hq-sub">${App.state.healQuote ? 'AI 为你生成的鼓励 · 来自你的自我研究计划' : '今日治愈开场白 · 来自你的自我研究计划'}</div>
      </div>

      <div class="card card-hover" style="margin-bottom:16px; cursor:pointer;" data-action="goto-checkin">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:14px; font-weight:500; color:var(--text-primary);">今日打卡</div>
            <div style="font-size:12px; color:var(--text-tertiary); margin-top:2px;">
              ${today ? `已完成 · 情绪${today.mood} 能量${today.energy} 睡眠${today.sleep}h` : '尚未打卡，点击开始'}
            </div>
          </div>
          <button class="btn ${today ? '' : 'btn-primary'} btn-sm">${today ? '更新' : '去打卡'}</button>
        </div>
      </div>

      <div class="grid grid-3" style="margin-bottom:16px;">
        <div class="stat-card">
          <div class="stat-value">${stats.daysSinceStart}<span class="stat-unit">天</span></div>
          <div class="stat-label">累计研究</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.exploredCount}<span class="stat-unit">/20</span></div>
          <div class="stat-label">已探索维度</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalCheckins}<span class="stat-unit">次</span></div>
          <div class="stat-label">打卡记录</div>
        </div>
      </div>

      <div class="card status-card">
        <div class="sc-top">
          <div class="card-title" style="margin-bottom:0;">近 7 天状态</div>
          <div class="sc-legend">
            <span><i class="status-dot sd-rose"></i>情绪</span>
            <span><i class="status-dot sd-emerald"></i>能量</span>
          </div>
        </div>
        ${today ? `<div style="display:flex; gap:18px; font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
            <span>今日情绪 <b style="color:var(--c-rose-dark);">${today.mood}</b></span>
            <span>今日能量 <b style="color:var(--c-emerald-dark);">${today.energy}</b></span>
            <span>睡眠 <b style="color:var(--c-blue-dark);">${today.sleep}h</b></span>
          </div>` : '<div style="font-size:12px; color:var(--text-tertiary); margin-bottom:10px;">今日尚未打卡，先去记录状态吧</div>'}
        <div class="chart-container">${chartHtml}</div>
      </div>

      ${nextDim ? `<div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-olive);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:11px; color:var(--text-tertiary);">本周推荐深挖</div>
            <div style="font-size:15px; font-weight:500; margin-top:4px;">${this._localIndex(nextDim.id, nextDim.module)}. ${nextDim.name}</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${nextDim.subtitle}</div>
          </div>
          <button class="btn btn-primary btn-sm" data-action="goto-dimension" data-dim="${nextDim.id}">开始研究</button>
        </div>
      </div>` : ''}

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">六大模块进度</div>
        <div class="grid grid-modules">${moduleHtml}</div>
      </div>

      <div class="card">
        <div class="card-title">最近动态</div>
        ${tlHtml}
      </div>
    `;
  },

  // === Check-in ===
  checkin() {
    const editDate = App.state.checkinEditDate;
    const today = editDate ? Store.getCheckin(editDate) : Store.getTodayCheckin();
    const mood = today?.mood ?? 5;
    const energy = today?.energy ?? 5;
    const sleep = today?.sleep ?? 7.5;
    const note = today?.note ?? '';
    const selTags = App.state.selectedTags;
    const customTags = App.state.customTags;
    const gratitudeEntries = App.state.gratitudeEntries;
    const journal = App.state.gratitudeJournal;
    const noteAI = App.state.noteAI;
    const speech = today?.speech || {};
    const speechTopic = App.state.speechTopic || speech.topic || '';
    const speechHint = App.state.speechTopicHint || speech.hint || '';
    const speechText = speech.text || '';
    const speechAI = App.state.speechAITemp || speech.aiAnalysis || null;

    const dateStr = editDate || this._today();
    const isEditingHistory = !!editDate;

    const tagHtml = MOOD_TAGS.map(t => {
      const s = selTags.includes(t) ? 'selected' : '';
      return `<button class="tag-btn ${s}" data-action="toggle-tag" data-tag="${t}">${t}</button>`;
    }).join('');

    const customHtml = customTags.map(t =>
      `<span class="custom-chip">${this._escape(t)}<span class="x" data-action="remove-custom-tag" data-tag="${this._escape(t)}">×</span></span>`
    ).join('');

    const gratHtml = gratitudeEntries.map((g, i) =>
      `<div class="grat-item">
        <span style="color:var(--c-olive); font-size:12px; flex-shrink:0;">${i + 1}.</span>
        <span class="gi-text">${this._escape(g)}</span>
        <span class="gi-x" data-action="remove-gratitude" data-index="${i}">×</span>
      </div>`
    ).join('');

    const journalHtml = journal ? `
      <div class="grat-journal">
        <div class="gj-title">📖 每日感恩日记 · ${this._fmtDate(journal.createdAt?.slice(0,10) || dateStr)}</div>
        <div class="gj-summary">${this._escape(journal.summary || '')}</div>
        ${(journal.entries || []).map(e => `
          <div class="gj-entry"><span class="gj-raw">${this._escape(e.raw || '')}</span><br>${this._escape(e.insight || '')}</div>
        `).join('')}
        ${(journal.shiningPoints && journal.shiningPoints.length) ? `
          <div class="gj-shine-title">✨ 被看见的闪光点</div>
          ${journal.shiningPoints.map(s => `<div class="gj-shine">${this._escape(s)}</div>`).join('')}
        ` : ''}
      </div>` : '';

    const recent = Store.getRecentCheckins(7).slice().reverse();
    const chartHtml = this._trendChart(recent);

    const hasAI = !!(Store.getSettings().ai && Store.getSettings().ai.endpoint && Store.getSettings().ai.apiKey);

    return `
      <div class="page-header">
        <h1>每日打卡</h1>
        <div class="desc">${this._fmtDate(dateStr)} ${this._weekday(dateStr)}</div>
      </div>

      ${isEditingHistory ? `
        <div class="card" style="border-left:3px solid var(--c-coral); margin-bottom:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="font-size:13px;">
            <span style="color:var(--c-coral); font-weight:500;">✎ 编辑历史打卡</span>
            <span style="color:var(--text-secondary); margin-left:6px;">保存时更新 ${this._fmtDate(dateStr)} 的记录</span>
          </div>
          <button class="btn btn-secondary btn-sm" data-action="cancel-edit-checkin">← 回到今天</button>
        </div>
      ` : ''}

      <div class="card checkin-section">
        <div class="card-title">状态评分</div>
        <div class="slider-row">
          <span class="slider-label">情绪</span>
          <input type="range" min="1" max="10" value="${mood}" data-slider="mood">
          <span class="slider-value">${mood}</span>
        </div>
        <div class="slider-row">
          <span class="slider-label">能量</span>
          <input type="range" min="1" max="10" value="${energy}" data-slider="energy">
          <span class="slider-value">${energy}</span>
        </div>
        <div class="slider-row">
          <span class="slider-label">睡眠</span>
          <input type="range" min="0" max="12" step="0.5" value="${sleep}" data-slider="sleep" data-suffix="h">
          <span class="slider-value">${sleep}h</span>
        </div>
      </div>

      <div class="card checkin-section">
        <div class="card-title">情绪标签</div>
        <div class="tag-group">${tagHtml}</div>
        <div class="tag-custom-input">
          <input type="text" id="customTagInput" placeholder="没找到合适的？自定义一个情绪，回车添加…" maxlength="12">
          <button class="btn btn-sm" data-action="add-custom-tag">添加</button>
        </div>
        <div class="custom-tag-list" id="customTagList">${customHtml}</div>
      </div>

      <div class="card checkin-section" style="border-left:3px solid var(--c-coral);">
        <div class="card-title">今日最触动的一件事</div>
        <div class="grat-desc">记录今天最触动你的事——无论快乐、难过还是平静。这是你的情绪觉察入口，用于看清自己的触发点。</div>
        <div class="textarea-wrap">
          <textarea data-field="note" placeholder="写下今天最触动你的事，无论大小...">${this._escape(note)}</textarea>
          ${this._voiceBtn('note')}
        </div>
        <div class="grat-actions">
          <button class="btn btn-ai btn-sm" data-action="ai-note" ${hasAI ? '' : 'disabled'}>✨ AI 分析触动点</button>
          ${hasAI ? '' : '<span class="ai-hint">未配置 AI（设置页可配置）</span>'}
        </div>
        ${noteAI ? `
          <div class="rd-ai-result" style="margin-top:8px;">
            <div class="rd-ai-section">
              <div class="rd-ai-label">情绪洞察</div>
              <div class="rd-ai-text">${this._escape(noteAI.insight || '')}</div>
            </div>
            ${noteAI.trigger ? `
              <div class="rd-ai-section">
                <div class="rd-ai-label">触发模式</div>
                <div class="rd-ai-text">${this._escape(noteAI.trigger)}</div>
              </div>` : ''}
            ${noteAI.suggestedDimension ? `
              <div class="rd-ai-section">
                <div class="rd-ai-label">关联维度建议</div>
                <div class="rd-ai-text">${this._escape(noteAI.suggestedDimension)}</div>
              </div>` : ''}
          </div>` : ''}
      </div>

      <div class="card checkin-section" style="border-left:3px solid var(--c-olive);">
        <div class="card-title">感恩日记</div>
        <div class="grat-desc">与"最触动的事"互补——这里专门收集值得感恩的细碎片段，一次早睡、一顿好饭、一个不期而至的善意，都算。</div>
        <div class="grat-add">
          <div class="input-wrap" style="flex:1;">
            <input type="text" id="gratitudeInput" placeholder="今天值得感恩的一件小事…" maxlength="120">
            ${this._voiceBtn('gratitude-input')}
          </div>
          <button class="btn btn-sm" data-action="add-gratitude">添加</button>
        </div>
        <div class="grat-list" id="gratitudeList">${gratHtml}</div>
        <div class="grat-actions">
          <button class="btn btn-ai btn-sm" data-action="ai-gratitude" ${hasAI ? '' : 'disabled'}>✨ AI 整理感恩日记</button>
          ${hasAI ? '<span class="ai-hint">可一键整理每日感恩日记，总结每条价值、挖掘闪光点，感受世界的丰盛与温暖。</span>' : '<span class="ai-hint">未配置 AI（设置页可配置）</span>'}
        </div>
        ${journalHtml}
      </div>

      <div class="card checkin-section" style="border-left:3px solid var(--c-purple);">
        <div class="card-title">🎙️ 表达力训练</div>
        <div class="grat-desc">3 分钟主题演讲，练习结构化表达。不知道说什么？系统每天给你一个随机主题，也可以换。</div>

        <div class="sp-topic-bar">
          <div class="sp-topic-info">
            <span class="sp-topic-label">今日主题</span>
            <span class="sp-topic-title">${this._escape(speechTopic || '点击换题')}</span>
          </div>
          <button class="btn btn-sm sp-shuffle-btn" data-action="change-speech-topic" title="换一个主题">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M11 1.5L14 4.5L11 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 4.5H14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M5 14.5L2 11.5L5 8.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 11.5H2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        ${speechHint ? `<div class="sp-topic-hint">💡 ${this._escape(speechHint)}</div>` : ''}

        <div class="sp-structure">
          <div class="sp-struct-item"><span class="sp-struct-num">1</span> 开场引入</div>
          <div class="sp-struct-arrow">→</div>
          <div class="sp-struct-item"><span class="sp-struct-num">2</span> 主体阐述</div>
          <div class="sp-struct-arrow">→</div>
          <div class="sp-struct-item"><span class="sp-struct-num">3</span> 总结收尾</div>
        </div>

        <div class="textarea-wrap">
          <textarea data-field="speech" placeholder="点击 🎤 开始录音，围绕主题自由表达。讲完后点击下方 AI 按钮帮你梳理结构…" style="min-height:120px;">${this._escape(speechText)}</textarea>
          ${this._voiceBtn('speech')}
        </div>

        <div class="grat-actions">
          <button class="btn btn-ai btn-sm" data-action="ai-speech" ${hasAI ? '' : 'disabled'}>✨ AI 梳理分析</button>
          ${hasAI ? '<span class="ai-hint">AI 会分析你的表述结构、亮点与改进空间，帮你持续提升表达力</span>' : '<span class="ai-hint">未配置 AI（设置页可配置）</span>'}
        </div>

        <div id="speechAIResult">
          ${speechAI ? `
            <div class="rd-ai-result">
              ${speechAI.structure ? `
                <div class="rd-ai-section">
                  <div class="rd-ai-label">📐 结构分析</div>
                  <div class="rd-ai-text">${this._escape(speechAI.structure)}</div>
                </div>` : ''}
              ${speechAI.highlights && speechAI.highlights.length ? `
                <div class="rd-ai-section">
                  <div class="rd-ai-label">✨ 表达亮点</div>
                  ${speechAI.highlights.map(h => `<div class="rd-ai-question">${this._escape(h)}</div>`).join('')}
                </div>` : ''}
              ${speechAI.improvements && speechAI.improvements.length ? `
                <div class="rd-ai-section">
                  <div class="rd-ai-label">🔧 改进建议</div>
                  ${speechAI.improvements.map(imp => `<div class="rd-ai-question">${this._escape(imp)}</div>`).join('')}
                </div>` : ''}
              ${speechAI.suggestedOutline ? `
                <div class="rd-ai-section">
                  <div class="rd-ai-label">📋 建议重构提纲</div>
                  <div class="rd-ai-text" style="white-space:pre-line;">${this._escape(speechAI.suggestedOutline)}</div>
                </div>` : ''}
            </div>` : ''}
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-bottom:24px;" data-action="save-checkin">
        ${today ? '更新打卡' : '保存打卡'}
      </button>

      <div class="card">
        <div class="card-title">近 7 天趋势（状态评分）</div>
        <div style="display:flex; gap:16px; font-size:11px; margin-bottom:8px;">
          <span style="color:var(--c-rose-dark);">● 玫粉 = 情绪</span>
          <span style="color:var(--c-emerald-dark);">● 翡翠绿 = 能量</span>
        </div>
        <div class="chart-container">${chartHtml}</div>
      </div>

      ${this._checkinHistory()}
    `;
  },

  _checkinHistory() {
    const all = Store.getCheckins();
    const today = this._today();
    const sorted = all
      .filter(c => c.date)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 30);

    if (sorted.length === 0) {
      return `
        <div class="card">
          <div class="card-title">历史打卡记录</div>
          <div class="empty-state" style="padding:20px 0;">
            <div class="es-text">还没有打卡记录。先完成一次打卡就能在这里看到了 ✨</div>
          </div>
        </div>`;
    }

    const itemsHtml = sorted.map(c => {
      const isToday = c.date === today;
      const tagBadges = (c.tags || []).slice(0, 3).map(t => `<span class="tag-mini">${this._escape(t)}</span>`).join('');
      const notePreview = c.note ? this._escape(c.note.slice(0, 80)) + (c.note.length > 80 ? '…' : '') : '<span style="color:var(--text-tertiary);">（未写触动）</span>';
      const gratList = c.gratitude || [];
      const gratPreview = gratList.length
        ? gratList.slice(0, 2).map(g => `· ${this._escape(g)}`).join('<br>')
        : '<span style="color:var(--text-tertiary);">（无感恩条目）</span>';
      const gratJournal = c.gratitudeJournal;
      const gratJournalHtml = gratJournal && gratJournal.text
        ? `<div class="ci-hist-section">
            <div class="ci-hist-label">📖 感恩日记（AI 整理）</div>
            <div class="ci-hist-text" style="white-space:pre-wrap;">${this._escape(gratJournal.text.slice(0, 200))}${gratJournal.text.length > 200 ? '…' : ''}</div>
          </div>`
        : '';
      return `<div class="ci-hist-item ${isToday ? 'is-today' : ''}" data-action="view-checkin" data-date="${c.date}" style="cursor:pointer;">
        <div class="ci-hist-head">
          <div>
            <span class="ci-hist-date">${this._fmtDate(c.date)}</span>
            <span class="ci-hist-weekday">${this._weekday(c.date)}</span>
            ${isToday ? '<span class="ci-today-tag">今天</span>' : ''}
          </div>
          <div class="ci-hist-stats">
            <span class="ci-stat" style="color:var(--c-rose-dark);">情绪 ${c.mood ?? '-'}</span>
            <span class="ci-stat" style="color:var(--c-emerald-dark);">能量 ${c.energy ?? '-'}</span>
            <span class="ci-stat">睡眠 ${c.sleep ?? '-'}h</span>
          </div>
        </div>
        ${tagBadges ? `<div class="ci-hist-tags">${tagBadges}</div>` : ''}
        <div class="ci-hist-section">
          <div class="ci-hist-label">今日触动</div>
          <div class="ci-hist-text">${notePreview}</div>
        </div>
        ${gratList.length ? `
          <div class="ci-hist-section">
            <div class="ci-hist-label">感恩条目 (${gratList.length})</div>
            <div class="ci-hist-text">${gratPreview}${gratList.length > 2 ? `<br><span style="color:var(--text-tertiary); font-size:11px;">还有 ${gratList.length - 2} 条…</span>` : ''}</div>
          </div>` : ''}
        ${gratJournalHtml}
        <div class="ci-hist-actions">
          <button class="btn btn-secondary btn-sm" data-action="edit-checkin" data-date="${c.date}">✎ 修改</button>
          <button class="btn btn-sm btn-danger-outline" data-action="delete-checkin" data-date="${c.date}">🗑 删除</button>
        </div>
      </div>`;
    }).join('');

    return `
      <div class="card">
        <div class="card-title">历史打卡记录 · ${sorted.length} 天</div>
        <div class="ci-hist-list">${itemsHtml}</div>
      </div>
    `;
  },

  checkinDetail(date) {
    const c = Store.getCheckin(date);
    if (!c) return '<div class="empty-state"><div class="es-text">找不到该日打卡记录</div></div>';

    const note = c.note || '';
    const noteAI = c.noteAI || null;
    const gratList = c.gratitude || [];
    const gratJournal = c.gratitudeJournal || null;
    const speech = c.speech || null;
    const tagBadges = (c.tags || []).map(t => `<span class="tag-mini">${this._escape(t)}</span>`).join(' ');
    const customBadges = (c.customTags || []).map(t => `<span class="tag-mini" style="background:var(--c-coral-light);color:var(--c-coral-dark);">${this._escape(t)}</span>`).join(' ');

    // 状态评分
    const scoreHtml = `
      <div class="ci-detail-scores">
        <div class="ci-detail-score" style="color:var(--c-rose-dark);"><span>情绪</span><b>${c.mood ?? '-'}</b></div>
        <div class="ci-detail-score" style="color:var(--c-emerald-dark);"><span>能量</span><b>${c.energy ?? '-'}</b></div>
        <div class="ci-detail-score"><span>睡眠</span><b>${c.sleep ?? '-'}h</b></div>
      </div>`;

    // 情绪标签
    const tagsHtml = tagBadges || customBadges
      ? `<div class="ci-detail-tags">${tagBadges}${customBadges}</div>`
      : '';

    // AI 触动点分析
    const noteAIHtml = noteAI ? `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">✨ AI 触动点分析</div>
        <div class="rd-ai-result">
          ${noteAI.insight ? `
            <div class="rd-ai-section">
              <div class="rd-ai-label">情绪洞察</div>
              <div class="rd-ai-text">${this._escape(noteAI.insight)}</div>
            </div>` : ''}
          ${noteAI.trigger ? `
            <div class="rd-ai-section">
              <div class="rd-ai-label">触发模式</div>
              <div class="rd-ai-text">${this._escape(noteAI.trigger)}</div>
            </div>` : ''}
          ${noteAI.suggestedDimension ? `
            <div class="rd-ai-section">
              <div class="rd-ai-label">关联维度建议</div>
              <div class="rd-ai-text">${this._escape(noteAI.suggestedDimension)}</div>
            </div>` : ''}
        </div>
      </div>` : '';

    // 感恩条目
    const gratEntriesHtml = gratList.length ? `
      <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-olive);">
        <div class="card-title">🙏 感恩条目 · ${gratList.length} 条</div>
        ${gratList.map((g, i) => `<div class="ci-detail-grat">
          <span class="ci-detail-grat-num">${i + 1}</span>
          <span>${this._escape(g)}</span>
        </div>`).join('')}
      </div>` : '';

    // AI 感恩日记
    const gratJournalHtml = gratJournal ? `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">✨ AI 整理 · 每日感恩日记</div>
        <div class="grat-journal">
          ${gratJournal.summary ? `<div class="gj-summary" style="font-size:13px;line-height:1.7;white-space:pre-wrap;">${this._escape(gratJournal.summary)}</div>` : ''}
          ${(gratJournal.entries || []).map(e => `
            <div class="gj-entry" style="margin-top:10px;">
              <div class="gj-raw" style="font-size:12px;color:var(--text-tertiary);">${this._escape(e.raw || '')}</div>
              <div style="font-size:13px;color:var(--text-primary);margin-top:2px;">${this._escape(e.insight || '')}</div>
            </div>
          `).join('')}
          ${(gratJournal.shiningPoints || []).length ? `
            <div class="gj-shine-title" style="margin-top:12px;">✨ 被看见的闪光点</div>
            ${gratJournal.shiningPoints.map(s => `<div class="gj-shine">${this._escape(s)}</div>`).join('')}
          ` : ''}
        </div>
      </div>` : '';

    // 表达力训练
    const speechHtml = speech && (speech.text || speech.topic) ? `
      <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-purple);">
        <div class="card-title">🎙️ 表达力训练</div>
        <div style="font-size:12px;color:var(--text-tertiary);margin-bottom:8px;">主题：<b>${this._escape(speech.topic || '')}</b>${speech.hint ? ' · ' + this._escape(speech.hint) : ''}</div>
        ${speech.text ? `<div style="font-size:13px;line-height:1.8;white-space:pre-wrap;color:var(--text-primary);margin-bottom:10px;">${this._escape(speech.text)}</div>` : ''}
        ${speech.aiAnalysis ? `
          <div class="rd-ai-result">
            ${speech.aiAnalysis.structure ? `<div class="rd-ai-section"><div class="rd-ai-label">📐 结构分析</div><div class="rd-ai-text">${this._escape(speech.aiAnalysis.structure)}</div></div>` : ''}
            ${speech.aiAnalysis.highlights && speech.aiAnalysis.highlights.length ? `<div class="rd-ai-section"><div class="rd-ai-label">✨ 表达亮点</div>${speech.aiAnalysis.highlights.map(h => `<div class="rd-ai-question">${this._escape(h)}</div>`).join('')}</div>` : ''}
            ${speech.aiAnalysis.improvements && speech.aiAnalysis.improvements.length ? `<div class="rd-ai-section"><div class="rd-ai-label">🔧 改进建议</div>${speech.aiAnalysis.improvements.map(imp => `<div class="rd-ai-question">${this._escape(imp)}</div>`).join('')}</div>` : ''}
            ${speech.aiAnalysis.suggestedOutline ? `<div class="rd-ai-section"><div class="rd-ai-label">📋 建议重构提纲</div><div class="rd-ai-text" style="white-space:pre-line;">${this._escape(speech.aiAnalysis.suggestedOutline)}</div></div>` : ''}
          </div>` : ''}
      </div>` : '';

    const hasContent = note || noteAI || gratList.length || gratJournal || (speech && (speech.text || speech.topic));

    return `
      <div class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <button class="btn btn-sm" data-action="close-checkin-detail">← 返回</button>
          <div>
            <h1>${this._fmtDate(date)} ${this._weekday(date)}</h1>
            <div class="desc">打卡详情</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          ${scoreHtml}
          <button class="btn btn-sm" data-action="edit-checkin" data-date="${date}">✎ 修改</button>
        </div>
        ${tagsHtml}
      </div>

      ${note ? `
        <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-coral);">
          <div class="card-title">今日最触动的一件事</div>
          <div style="font-size:14px; line-height:1.8; color:var(--text-primary); white-space:pre-wrap;">${this._escape(note)}</div>
        </div>` : ''}

      ${noteAIHtml}
      ${gratEntriesHtml}
      ${gratJournalHtml}
      ${speechHtml}

      ${!hasContent ? `
        <div class="card">
          <div class="empty-state"><div class="es-text">该日仅记录了状态评分，未写触动事件或感恩条目</div></div>
        </div>` : ''}

      <div style="margin-top:12px; display:flex; gap:8px;">
        <button class="btn btn-sm" data-action="close-checkin-detail">← 返回打卡列表</button>
      </div>
    `;
  },

  // === Readings (阅读共鸣) ===
  readings(view, editId) {
    if (view === 'editor') return this.readingEditor(editId);
    if (view === 'detail') return this.readingDetail(editId);
    return this.readingList();
  },

  readingList() {
    const readings = Store.getReadings();

    if (readings.length === 0) {
      return `
        <div class="page-header">
          <h1>阅读共鸣</h1>
          <div class="desc">记录每一次被文字击中的瞬间，拍照识别 + 写下感悟</div>
        </div>
        <div class="card">
          <div class="empty-state">
            <div class="es-text">还没有阅读共鸣记录。<br>读到了触动你的文字？点击下方开始记录。</div>
          </div>
          <div style="text-align:center; margin-top:16px;">
            <button class="btn btn-primary" data-action="new-reading">+ 新增共鸣记录</button>
          </div>
        </div>`;
    }

    const cardsHtml = readings.map(r => {
      const st = SOURCE_TYPES.find(s => s.id === r.sourceType) || SOURCE_TYPES[0];
      const srcLabel = st.id === 'custom' ? (r.sourceLabel || '自定义') : st.label;
      const date = r.createdAt ? this._fmtDate(r.createdAt.slice(0, 10)) : '';
      const excerpt = r.excerpt ? this._escape(r.excerpt.slice(0, 120)) + (r.excerpt.length > 120 ? '…' : '') : '';
      const resonance = r.resonance ? this._escape(r.resonance.slice(0, 80)) + (r.resonance.length > 80 ? '…' : '') : '';
      const reflection = r.reflection ? this._escape(r.reflection.slice(0, 120)) + (r.reflection.length > 120 ? '…' : '') : '';
      const dim = r.relatedDimension ? getDimension(r.relatedDimension) : null;
      const dimMod = dim ? getModule(dim.module) : null;
      const aiBadge = r.aiAnalysis ? '<span class="rd-ai-badge">✨ AI分析</span>' : '';
      const imgs = Array.isArray(r.images) ? r.images : [];
      const imgThumbsHtml = imgs.length
        ? `<div class="rd-images-row" style="margin-top:8px;">${imgs.slice(0, 4).map((src, i) =>
            `<div class="rd-thumb" style="width:60px; height:60px;"><img src="${this._escape(src)}" alt="图片${i + 1}" data-action="view-reading-image-existing" data-src="${this._escape(src)}"></div>`
          ).join('')}${imgs.length > 4 ? `<div class="rd-images-empty" style="margin:0; align-self:center;">+${imgs.length - 4}</div>` : ''}</div>`
        : '';

      return `<div class="rd-card rd-${st.color}" data-id="${r.id}" data-action="view-reading" style="cursor:pointer;">
        <div class="rd-card-head">
          <span class="rd-type tag-${st.color}">${st.emoji} ${srcLabel}</span>
          <span class="rd-date">${date}</span>
        </div>
        <div class="rd-title">${this._escape(r.title || '无标题')} ${r.author ? `<span class="rd-author">${this._escape(r.author)}</span>` : ''}</div>
        ${excerpt ? `<div class="rd-excerpt">"${excerpt}"</div>` : ''}
        ${resonance ? `<div class="rd-resonance">🎯 ${resonance}</div>` : ''}
        ${reflection ? `<div class="rd-reflection">💭 ${reflection}</div>` : ''}
        ${imgThumbsHtml}
        <div class="rd-card-foot">
          ${dim ? `<span class="rd-dim tag-${dimMod.color}">关联: ${dim.name}</span>` : ''}
          ${aiBadge}
          <div class="rd-actions">
            <button class="rd-action-btn" data-action="edit-reading" data-id="${r.id}" title="编辑">✎</button>
            <button class="rd-action-btn rd-action-del" data-action="delete-reading-confirm" data-id="${r.id}" title="删除">🗑</button>
          </div>
        </div>
      </div>`;
    }).join('');

    return `
      <div class="page-header">
        <h1>阅读共鸣</h1>
        <div class="desc">记录每一次被文字击中的瞬间，拍照识别 + 写下感悟</div>
      </div>

      <div class="card card-hover" style="margin-bottom:16px; cursor:pointer;" data-action="new-reading">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:14px; font-weight:500;">+ 新增共鸣记录</div>
            <div style="font-size:12px; color:var(--text-tertiary); margin-top:2px;">读到触动你的文字？拍照识别，写下感悟</div>
          </div>
          <button class="btn btn-primary btn-sm">开始记录</button>
        </div>
      </div>

      <div class="rd-list">${cardsHtml}</div>
    `;
  },

  readingEditor(editId) {
    let data = {
      sourceType: 'book', title: '', author: '',
      excerpt: '', resonance: '', reflection: '',
      relatedDimension: null, aiAnalysis: null
    };
    let isEdit = false;
    if (editId) {
      const found = Store.getReading(editId);
      if (found) { data = found; isEdit = true; }
    }

    const currentSource = App.state.readingSource || data.sourceType || 'book';
    const aiAnalysis = App.state.readingAITemp || data.aiAnalysis || null;
    const hasAI = !!(Store.getSettings().ai && Store.getSettings().ai.endpoint && Store.getSettings().ai.apiKey);

    const sourcePills = SOURCE_TYPES.map(s =>
      `<button class="src-pill ${s.id === currentSource ? 'active' : ''}" data-action="select-source" data-source="${s.id}">${s.emoji} ${s.label}</button>`
    ).join('');

    const isCustom = currentSource === 'custom';
    const customLabel = data.sourceType === 'custom' ? (data.sourceLabel || '') : '';

    const dimOptions = MODULES.map(m => {
      const dims = getDimensionsByModule(m.id);
      const opts = dims.map(d =>
        `<option value="${d.id}" ${data.relatedDimension === d.id ? 'selected' : ''}>${m.name} · ${d.name}</option>`
      ).join('');
      return `<optgroup label="${m.name}">${opts}</optgroup>`;
    }).join('');

    const aiHtml = aiAnalysis ? `
      <div class="rd-ai-result">
        <div class="rd-ai-section">
          <div class="rd-ai-label">深度分析</div>
          <div class="rd-ai-text">${this._escape(aiAnalysis.analysis || '')}</div>
        </div>
        ${aiAnalysis.deepQuestions && aiAnalysis.deepQuestions.length ? `
          <div class="rd-ai-section">
            <div class="rd-ai-label">深化思考</div>
            ${aiAnalysis.deepQuestions.map(q => `<div class="rd-ai-question">❓ ${this._escape(q)}</div>`).join('')}
          </div>` : ''}
        ${aiAnalysis.patternNote ? `
          <div class="rd-ai-section">
            <div class="rd-ai-label">认知模式</div>
            <div class="rd-ai-text">${this._escape(aiAnalysis.patternNote)}</div>
          </div>` : ''}
      </div>` : `
      <div class="ai-hint" style="margin-top:8px;">${hasAI ? '点击上方按钮，AI会分析文字为何触动你，挖掘认知模式，给出深化思考的引导问题' : '未配置 AI（设置页可配置），无法使用深度分析'}</div>`;

    return `
      <div class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <button class="btn btn-sm" data-action="reading-list">← 返回</button>
          <div>
            <h1>${isEdit ? '编辑共鸣' : '新增共鸣'}</h1>
            <div class="desc">记录每一次被文字击中的瞬间</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">来源类型</div>
        <div class="src-type-pills">${sourcePills}</div>
        <input type="text" data-field="rd-source-label" placeholder="输入自定义来源名称（如：小红书、知乎、播客…）" value="${this._escape(customLabel)}" class="src-custom-input" style="margin-top:8px; ${isCustom ? '' : 'display:none;'}">
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">基本信息</div>
        <input type="text" data-field="rd-title" placeholder="标题（书名/文章名/视频标题）" value="${this._escape(data.title || '')}" style="margin-bottom:8px;">
        <input type="text" data-field="rd-author" placeholder="作者（可选）" value="${this._escape(data.author || '')}">
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">拍照识别文字</div>
        <div class="rd-photo-area" data-action="capture-photo">
          <div class="rd-photo-icon">📷</div>
          <div class="rd-photo-text">点击拍照或选择图片</div>
          <div class="rd-photo-hint">支持拍照、从相册上传或屏幕截图，一次最多 6 张。${hasAI ? '将使用AI识别文字' : '联网后可用AI识别，当前可手动输入'}</div>
        </div>
        <input type="file" id="readingPhotoInput" accept="image/*" multiple style="display:none;">
        <div class="rd-ocr-loading" id="ocrLoading" style="display:none;">
          <div class="rd-ocr-spinner"></div>
          <span id="ocrStatus">正在识别文字...</span>
        </div>
        ${this._readingImagesBlock(data.images || App.state.readingImages || [])}
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">摘录原文</div>
        <div class="textarea-wrap">
          <textarea data-field="rd-excerpt" placeholder="拍照后自动填入，或手动输入引起你共鸣的原文..." style="min-height:80px;">${this._escape(data.excerpt || '')}</textarea>
          ${this._voiceBtn('rd-excerpt')}
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">最触动你的点</div>
        <div class="textarea-wrap">
          <textarea data-field="rd-resonance" placeholder="哪句话、哪个观点最触动你？为什么？" style="min-height:60px;">${this._escape(data.resonance || '')}</textarea>
          ${this._voiceBtn('rd-resonance')}
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">你的感悟</div>
        <div class="textarea-wrap">
          <textarea data-field="rd-reflection" placeholder="写下你的思考、联想、自省..." style="min-height:100px;">${this._escape(data.reflection || '')}</textarea>
          ${this._voiceBtn('rd-reflection')}
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">关联自我研究维度</div>
        <select data-field="rd-dimension">
          <option value="">不关联</option>
          ${dimOptions}
        </select>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="card-title" style="margin-bottom:0;">AI 深度分析</div>
          <button class="btn btn-ai btn-sm" data-action="ai-reading" ${hasAI ? '' : 'disabled'}>✨ 分析共鸣</button>
        </div>
        <div id="aiResultContainer">${aiHtml}</div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-bottom:12px;" data-action="save-reading">
        保存共鸣记录
      </button>
      ${isEdit ? `<button class="btn btn-sm btn-block" style="color:var(--c-coral-dark); border-color:var(--c-coral);" data-action="delete-reading" data-id="${editId}">删除此记录</button>` : ''}
    `;
  },

  readingDetail(id) {
    const r = Store.getReading(id);
    if (!r) return '<div class="empty-state"><div class="es-text">记录不存在</div></div>';

    const st = SOURCE_TYPES.find(s => s.id === r.sourceType) || SOURCE_TYPES[0];
    const srcLabel = st.id === 'custom' ? (r.sourceLabel || '自定义') : st.label;
    const date = r.createdAt ? this._fmtDate(r.createdAt.slice(0, 10)) : '';
    const timeLabel = r.createdAt ? (r.createdAt.slice(11, 16) || '') : '';
    const dim = r.relatedDimension ? getDimension(r.relatedDimension) : null;
    const dimMod = dim ? getModule(dim.module) : null;
    const imgs = Array.isArray(r.images) ? r.images : [];

    const aiHtml = r.aiAnalysis ? `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">✨ AI 深度分析</div>
        <div class="rd-ai-result">
          ${r.aiAnalysis.analysis ? `
            <div class="rd-ai-section">
              <div class="rd-ai-label">深度分析</div>
              <div class="rd-ai-text">${this._escape(r.aiAnalysis.analysis)}</div>
            </div>` : ''}
          ${r.aiAnalysis.deepQuestions && r.aiAnalysis.deepQuestions.length ? `
            <div class="rd-ai-section">
              <div class="rd-ai-label">深化思考</div>
              ${r.aiAnalysis.deepQuestions.map(q => `<div class="rd-ai-question">❓ ${this._escape(q)}</div>`).join('')}
            </div>` : ''}
          ${r.aiAnalysis.patternNote ? `
            <div class="rd-ai-section">
              <div class="rd-ai-label">认知模式</div>
              <div class="rd-ai-text">${this._escape(r.aiAnalysis.patternNote)}</div>
            </div>` : ''}
        </div>
      </div>` : '';

    const imgHtml = imgs.length ? `
      <div class="rd-images-row" style="margin-top:8px; flex-wrap:wrap;">
        ${imgs.map((src, i) => `
          <div class="rd-thumb" style="width:80px; height:80px;"><img src="${this._escape(src)}" alt="图片${i + 1}" data-action="view-reading-image-existing" data-src="${this._escape(src)}"></div>
        `).join('')}
      </div>` : '';

    return `
      <div class="page-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <button class="btn btn-sm" data-action="reading-list">← 返回</button>
          <div>
            <h1>${this._escape(r.title || '无标题')}</h1>
            <div class="desc">${r.author ? this._escape(r.author) + ' · ' : ''}${date}${timeLabel ? ' · ' + timeLabel : ''}</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="rd-type tag-${st.color}">${st.emoji} ${srcLabel}</span>
            ${dim ? `<span class="rd-dim tag-${dimMod.color}">关联: ${dim.name}</span>` : ''}
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm" data-action="edit-reading" data-id="${id}">✎ 修改</button>
            <button class="btn btn-sm" style="color:var(--c-coral-dark); border-color:var(--c-coral);" data-action="delete-reading-confirm" data-id="${id}">🗑 删除</button>
          </div>
        </div>
      </div>

      ${r.excerpt ? `
        <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-olive);">
          <div class="card-title">📖 摘录原文</div>
          <div style="font-size:14px; line-height:1.8; color:var(--text-primary); white-space:pre-wrap;">${this._escape(r.excerpt)}</div>
          ${imgHtml}
        </div>` : ''}

      ${r.resonance ? `
        <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-coral);">
          <div class="card-title">🎯 最触动你的点</div>
          <div style="font-size:14px; line-height:1.8; color:var(--text-primary); white-space:pre-wrap;">${this._escape(r.resonance)}</div>
        </div>` : ''}

      ${r.reflection ? `
        <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-purple);">
          <div class="card-title">💭 你的感悟</div>
          <div style="font-size:14px; line-height:1.8; color:var(--text-primary); white-space:pre-wrap;">${this._escape(r.reflection)}</div>
        </div>` : ''}

      ${!r.excerpt && !r.resonance && !r.reflection ? `
        <div class="card" style="margin-bottom:16px;">
          <div class="empty-state"><div class="es-text">该记录暂无内容</div></div>
        </div>` : ''}

      ${aiHtml}
    `;
  },

  // === Research (module overview + dimension cards) ===
  research(moduleId, dimId) {
    const dim = getDimension(dimId);
    if (!dim) return '<div class="empty-state"><div class="es-text">维度不存在</div></div>';

    const saved = Store.getDimensionData(dimId);
    const answers = saved?.answers || {};
    const insight = saved?.insight || '';
    const confidence = saved?.confidence || 0;
    const explored = Store.getExploredDimensions();
    const isExplored = explored.includes(dimId);
    const openModule = App.state.openModule || moduleId;

    // 编辑历史快照模式：表单项内容改成那份历史快照中的数据
    const editIdx = App.state.dimSnapshotEditIdx;
    const editSnap = (editIdx != null) ? Store.getDimensionSnapshot(dimId, editIdx) : null;
    const formAnswers = editSnap ? (editSnap.answers || {}) : answers;
    const formInsight = editSnap ? (editSnap.insight || '') : insight;
    const formConfidence = editSnap ? (editSnap.confidence || 0) : confidence;

    const hasAI = !!(Store.getSettings().ai && Store.getSettings().ai.endpoint && Store.getSettings().ai.apiKey);

    // 顶部6模块总览图
    const overviewHtml = MODULES.map(m => {
      const color = m.color;
      const dims = m.dimensionIds;
      const done = dims.filter(id => explored.includes(id)).length;
      const pct = (done / dims.length) * 100;
      const isActive = m.id === moduleId;
      // SVG 进度环
      const r = 18, c = 2 * Math.PI * r, offset = c * (1 - pct / 100);
      return `<div class="mod-overview mod-overview-${color} ${isActive ? 'active' : ''}" data-action="select-module" data-module="${m.id}">
        <svg viewBox="0 0 50 50" width="44" height="44" class="mo-ring">
          <circle cx="25" cy="25" r="${r}" fill="none" stroke="#E5E4E2" stroke-width="3"/>
          <circle cx="25" cy="25" r="${r}" fill="none" stroke="var(--c-${color})" stroke-width="3"
            stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
            transform="rotate(-90 25 25)" stroke-linecap="round"/>
          <text x="25" y="27" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="500" fill="var(--text-primary)">${done}/${dims.length}</text>
        </svg>
        <div class="mo-info">
          <div class="mo-name text-${color}">${m.name}</div>
          <div class="mo-sub">${m.subtitle}</div>
        </div>
      </div>`;
    }).join('');

    // 当前模块下所有维度（已展开视图）
    const activeMod = getModule(moduleId);
    const dimsArr = activeMod ? activeMod.dimensionIds.map(id => getDimension(id)) : [];
    const dimCardsHtml = dimsArr.map((d, i) => {
      const ddone = explored.includes(d.id);
      const ddata = Store.getDimensionData(d.id);
      const dconfidence = ddata?.confidence || 0;
      const isActive = d.id === dimId;
      return `<div class="dim-card ${isActive ? 'active' : ''} ${ddone ? 'done' : ''}" data-action="select-dimension" data-dim="${d.id}">
        <div class="dim-card-num">${i + 1}</div>
        <div class="dim-card-body">
          <div class="dim-card-name">${d.name}</div>
          <div class="dim-card-sub">${d.subtitle}</div>
        </div>
        <div class="dim-card-meta">
          ${ddone ? `<span class="dim-card-stars">${'●'.repeat(dconfidence) || '●'}</span>` : '<span class="dim-card-pending">未探索</span>'}
          ${ddone ? '<span class="dim-card-tick">✓</span>' : ''}
        </div>
      </div>`;
    }).join('');

    const qaHtml = dim.questions.map((q, i) => {
      const answer = formAnswers[`q${i + 1}`] || '';
      return `<div class="qa-block">
        <div class="qa-num">问题 ${i + 1} / ${dim.questions.length}</div>
        <div class="qa-question">${q}</div>
        <div class="textarea-wrap">
          <textarea data-field="answer-${i}" placeholder="在这里写下你的思考...">${this._escape(answer)}</textarea>
          ${this._voiceBtn(`answer-${i}`)}
        </div>
      </div>`;
    }).join('');

    const confHtml = [1, 2, 3, 4, 5].map(i =>
      `<div class="conf-dot ${i <= formConfidence ? 'active' : ''}" data-action="set-confidence" data-level="${i}"></div>`
    ).join('');

    const localIdx = this._localIndex(dimId, moduleId);
    const editSnapDate = editSnap ? this._fmtDate((editSnap.date || '').slice(0, 10)) : '';

    return `
      <div class="page-header">
        <h1>维度研究</h1>
        <div class="desc">每周深挖一个维度，20 周完成一轮自我拆解</div>
      </div>

      ${editSnap ? `
        <div class="card dh-edit-banner" style="border-left:3px solid var(--c-coral); margin-bottom:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="font-size:13px;">
            <span style="color:var(--c-coral); font-weight:500;">✎ 正在修改历史快照</span>
            <span style="color:var(--text-secondary); margin-left:6px;">${editSnapDate}的版本，保存时覆盖此快照（不会生成新快照）</span>
          </div>
          <button class="btn btn-secondary btn-sm" data-action="cancel-edit-dim-snapshot">← 回到当前编辑</button>
        </div>
      ` : ''}

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">6 大模块总览</div>
        <div class="mod-overview-grid">${overviewHtml}</div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div class="card-title" style="margin-bottom:0;">${activeMod ? activeMod.name : '选择模块'}的维度</div>
          <span style="font-size:11px; color:var(--text-tertiary);">点击切换</span>
        </div>
        <div class="dim-card-grid">${dimCardsHtml}</div>
      </div>

      <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-${this._moduleColor(moduleId)});">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-size:11px; color:var(--text-tertiary);">${getModule(moduleId).name} · 第 ${localIdx} 项 · 全局 ${dim.id}/20</div>
            <h2 style="font-size:18px; font-weight:500; margin-top:4px;">${dim.name}</h2>
            <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">${dim.subtitle}</div>
          </div>
          ${isExplored ? '<span class="tag-olive" style="font-size:11px; padding:3px 8px; border-radius:4px;">已探索</span>' : ''}
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">引导问答</div>
        ${qaHtml}
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div class="card-title" style="margin-bottom:0;">洞察总结</div>
          <button class="btn btn-ai btn-sm" data-action="ai-insight" ${hasAI ? '' : 'disabled'}>✨ AI 帮我总结</button>
        </div>
        ${hasAI ? '<div class="ai-hint" style="margin-bottom:8px;">AI 会基于你的回答，整理核心洞察并给出可执行建议（可再编辑）</div>' : '<div class="ai-hint" style="margin-bottom:8px;">未配置 AI，可手动总结；设置页配置后支持一键生成</div>'}
        <div class="textarea-wrap">
        <textarea data-field="insight" placeholder="用 1-2 句话总结你从这组问题中得出的核心洞察..." style="min-height:60px;">${this._escape(formInsight)}</textarea>
        ${this._voiceBtn('insight')}
      </div>
        <div class="confidence-row">
          <span style="font-size:13px; color:var(--text-secondary);">置信度</span>
          <div class="confidence-dots">${confHtml}</div>
          <span style="font-size:12px; color:var(--text-tertiary);">你对这个洞察有多确定？</span>
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-bottom:24px;" data-action="save-dimension">
        ${editSnap ? '保存修订（原历史快照）' : '保存研究记录'}
      </button>

      ${this._dimHistorySection(dimId)}
    `;
  },

  _dimHistorySection(dimId) {
    const hist = Store.getDimensionHistory(dimId);
    if (!hist.length) {
      return `
        <div class="card">
          <div class="card-title">历史快照</div>
          <div class="empty-state" style="padding:18px 0;">
            <div class="es-text">还没有历史记录。每次保存会保留一份快照，方便回看思路演变。</div>
          </div>
        </div>`;
    }

    const items = hist.map((h, idx) => {
      const dateKey = (h.date || '').slice(0, 10);
      const dateLabel = this._fmtDate(dateKey);
      const weekday = this._weekday(dateKey);
      const filledAnswers = Object.values(h.answers || {}).filter(a => a && a.trim()).length;
      const confidence = h.confidence || 0;
      const insightPreview = h.insight
        ? this._escape(h.insight.slice(0, 60)) + (h.insight.length > 60 ? '…' : '')
        : '<span style="color:var(--text-tertiary);">（未写洞察）</span>';
      const timeLabel = (h.date || '').slice(11, 16) || '';
      const isEditingThis = App.state.dimSnapshotEditIdx === idx;
      const editedBadge = h.editedAt ? '<span class="dh-edited-tag">已修订</span>' : '';
      return `<div class="dh-item ${isEditingThis ? 'is-editing' : ''}">
        <div class="dh-row1" data-action="view-dim-snapshot" data-dim="${dimId}" data-idx="${idx}">
          <span class="dh-date">📅 ${dateLabel}${timeLabel ? ` · ${timeLabel}` : ''}</span>
          <span class="dh-weekday">${weekday}</span>
          ${editedBadge}
          <span class="dh-stats">📝 ${filledAnswers} 回答 · ●${'●'.repeat(confidence)}${'○'.repeat(5 - confidence)}</span>
        </div>
        <div class="dh-insight" data-action="view-dim-snapshot" data-dim="${dimId}" data-idx="${idx}">💡 ${insightPreview}</div>
        <div class="dh-actions">
          <button class="dh-action-btn dh-edit-btn" data-action="edit-dim-snapshot" data-dim="${dimId}" data-idx="${idx}" title="修改这份快照" aria-label="修改这份快照">
            <span class="dh-act-icon">✎</span>
          </button>
          <button class="dh-action-btn dh-del-btn" data-action="delete-dim-snapshot" data-dim="${dimId}" data-idx="${idx}" title="删除这份快照" aria-label="删除这份快照">
            <span class="dh-act-icon">🗑</span>
          </button>
        </div>
      </div>`;
    }).join('');

    return `
      <div class="card">
        <div class="card-title">历史快照 · ${hist.length} 份</div>
        <div class="dh-list">${items}</div>
        <div class="ai-hint" style="margin-top:8px;">点击任一条可只读查看当时的回答与洞察；想覆盖当前？直接改上面的问答后保存即可。</div>
      </div>
    `;
  },

  _dimSnapshotView(dimId, idx) {
    const dim = getDimension(dimId);
    if (!dim) return '<div class="empty-state"><div class="es-text">维度不存在</div></div>';
    const snap = Store.getDimensionSnapshot(dimId, parseInt(idx));
    if (!snap) {
      return `<div class="empty-state"><div class="es-text">快照不存在</div></div>`;
    }
    const answers = snap.answers || {};
    const filled = dim.questions.map((q, i) => {
      const a = answers[`q${i + 1}`] || '';
      return a.trim()
        ? `<div class="qa-block">
            <div class="qa-num">问题 ${i + 1} / ${dim.questions.length}</div>
            <div class="qa-question">${q}</div>
            <div class="qa-snapshot">${this._escape(a)}</div>
          </div>`
        : '';
    }).join('');

    const confidence = snap.confidence || 0;
    const snapDateKey = (snap.date || '').slice(0, 10);
    const snapTime = (snap.date || '').slice(11, 16) || '';
    return `
      <div class="page-header">
        <h1>${dim.name}</h1>
        <div class="desc">历史快照 · ${this._fmtDate(snapDateKey)} ${this._weekday(snapDateKey)}${snapTime ? ` · ${snapTime}` : ''}</div>
      </div>

      <div style="margin-bottom:12px;">
        <button class="btn btn-secondary btn-sm" data-action="back-to-dim" data-dim="${dimId}" data-module="${App.state.openModule || ''}">← 返回当前编辑</button>
      </div>

      <div class="card" style="margin-bottom:16px; border-left:3px solid var(--c-${this._moduleColor(App.state.openModule)});">
        <div style="font-size:11px; color:var(--text-tertiary);">当时置信度：${'●'.repeat(confidence)}${'○'.repeat(5 - confidence)}（${confidence}/5）</div>
        ${snap.insight ? `
          <div style="margin-top:8px;">
            <div class="card-title" style="margin-bottom:4px;">当时的洞察</div>
            <div class="qa-snapshot" style="white-space:pre-wrap;">${this._escape(snap.insight)}</div>
          </div>` : ''}
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">当时的回答</div>
        ${filled || '<div class="es-text" style="color:var(--text-tertiary);">（该快照下没有回答）</div>'}
      </div>
    `;
  },

  // === Accordion body (lazily rendered on expand) ===
  accordionBody(moduleId, currentDimId, explored) {
    const dims = getDimensionsByModule(moduleId);
    return dims.map((d, i) => {
      const ddone = explored.includes(d.id);
      return `<button class="acc-dim ${d.id === currentDimId ? 'active' : ''}" data-action="select-dimension" data-dim="${d.id}">
        <span class="acc-idx">${i + 1}</span>
        <span>${d.name}</span>
        <span class="acc-status ${ddone ? 'done' : 'pending'}"></span>
      </button>`;
    }).join('');
  },

  // === Self Portrait (自我画像) ===
  profile() {
    const allData = Store.getAllDimensionData();
    const explored = Store.getExploredDimensions();
    const stats = Store.getStats();

    if (explored.length === 0) {
      return `
        <div class="page-header">
          <h1>自我画像</h1>
          <div class="desc">把 20 个维度的探索，凝结成一页可随时回看的自己</div>
        </div>
        <div class="card">
          <div class="manual-empty">还没有探索任何维度。<br>去「维度研究」完成第一个维度的引导问答，这里会自动生成你的自我画像。</div>
        </div>`;
    }

    const moduleSections = MODULES.map(m => {
      const dims = getDimensionsByModule(m.id).filter(d => explored.includes(d.id));
      if (dims.length === 0) return '';
      const color = m.color;
      const cards = dims.map(d => {
        const data = allData[d.id];
        const insight = data?.insight || '';
        const conf = data?.confidence || 0;
        const updated = data?.updatedAt ? this._fmtDate(data.updatedAt.slice(0, 10)) : '';
        // 历史洞察时间线：每次保存的洞察都展示，按时间倒序
        const history = Array.isArray(data?.history) ? data.history : [];
        const insightHistory = history
          .filter(h => (h.insight || '').trim())
          .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        const historyHtml = insightHistory.length > 0
          ? `<div class="md-history">
              <div class="md-history-title">📜 洞察历史 · ${insightHistory.length} 条</div>
              ${insightHistory.map(h => {
                const ts = h.date ? this._fmtDateTime(h.date) : '';
                const hc = h.confidence || 0;
                return `<div class="md-h-item">
                  <div class="md-h-head">
                    <span class="md-h-date">${this._escape(ts)}</span>
                    ${hc > 0 ? `<span class="md-h-conf">${'●'.repeat(hc)}${'○'.repeat(5 - hc)}</span>` : ''}
                  </div>
                  <div class="md-h-text">${this._escape(h.insight)}</div>
                </div>`;
              }).join('')}
            </div>`
          : '';
        return `<div class="manual-dim" data-action="goto-dimension" data-dim="${d.id}">
          <div class="md-head">
            <span class="md-name">${this._localIndex(d.id, m.id)}. ${d.name}</span>
            <span class="md-confidence">${'●'.repeat(conf) || '—'}</span>
          </div>
          <div class="md-insight"><span class="md-current-tag">最新</span> ${this._escape(insight) || '<span style="color:var(--text-tertiary);">已探索但未写洞察</span>'}</div>
          <div class="md-meta">更新于 ${updated}${conf > 0 ? ` · 置信度 ${conf}/5` : ''}</div>
          ${historyHtml}
        </div>`;
      }).join('');
      return `<div class="manual-module">
        <div class="mm-head"><span class="mm-dot" style="background:var(--c-${color});"></span>${m.name} · ${dims.length} 个维度已探索</div>
        ${cards}
      </div>`;
    }).join('');

    return `
      <div class="page-header">
        <h1>自我画像</h1>
        <div class="desc">把 20 个维度的探索，凝结成一页可随时回看的自己</div>
      </div>

      <div class="grid grid-3" style="margin-bottom:16px;">
        <div class="stat-card">
          <div class="stat-value">${stats.exploredCount}<span class="stat-unit">/20</span></div>
          <div class="stat-label">已探索</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${explored.filter(id => allData[id] && allData[id].confidence >= 3).length}<span class="stat-unit">个</span></div>
          <div class="stat-label">高置信洞察</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalCheckins}<span class="stat-unit">天</span></div>
          <div class="stat-label">打卡天数</div>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <button class="btn btn-sm" data-action="export-manual">📄 导出自我画像（文本）</button>
      </div>

      <div class="card">${moduleSections}</div>
    `;
  },

  // === Insights ===
  insights() {
    const checkins = Store.getCheckins();
    const explored = Store.getExploredDimensions();

    const recent = checkins.slice(-30);
    const avgMood = recent.length > 0 ? (recent.reduce((s, c) => s + c.mood, 0) / recent.length).toFixed(1) : '-';
    const avgEnergy = recent.length > 0 ? (recent.reduce((s, c) => s + c.energy, 0) / recent.length).toFixed(1) : '-';
    const avgSleep = recent.length > 0 ? (recent.reduce((s, c) => s + c.sleep, 0) / recent.length).toFixed(1) : '-';

    const sleepVals = recent.map(c => c.sleep);
    const moodVals = recent.map(c => c.mood);
    const corr = this._corr(sleepVals, moodVals);
    const corrText = corr === null ? '数据不足' :
      corr > 0.5 ? '强正相关 — 睡眠越好情绪越好' :
      corr > 0.2 ? '弱正相关 — 睡眠对情绪有一定影响' :
      corr > -0.2 ? '无明显关联' :
      corr > -0.5 ? '弱负相关 — 反常模式，值得关注' : '强负相关 — 需要进一步分析';

    const tagCount = {};
    checkins.forEach(c => (c.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const tagCloud = sortedTags.length > 0
      ? sortedTags.map(([t, c]) => `<span class="tag-btn selected" style="margin:2px;">${t} (${c})</span>`).join('')
      : '<span style="font-size:12px; color:var(--text-tertiary);">暂无标签数据</span>';

    const chartHtml = this._trendChart(checkins.slice().reverse());
    const donutHtml = this._donut(explored.length, 20);
    const patterns = Store.getPatterns();
    const patternsHtml = patterns.length > 0
      ? patterns.map(p => `<div class="card" style="margin-bottom:8px;">
          <div style="font-size:13px; font-weight:500; color:var(--text-primary);">${this._escape(p.pattern)}</div>
          ${p.evidence ? `<div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">证据: ${this._escape(p.evidence)}</div>` : ''}
          ${p.action ? `<div style="font-size:12px; color:var(--c-olive-dark); margin-top:4px;">建议: ${this._escape(p.action)}</div>` : ''}
          <div style="font-size:11px; color:var(--text-tertiary); margin-top:4px;">${this._fmtDate(p.createdAt?.slice(0, 10) || this._today())}</div>
        </div>`).join('')
      : '<div class="empty-state"><div class="es-text">还没有发现模式，坚持打卡后自然会浮现</div></div>';

    return `
      <div class="page-header">
        <h1>模式洞察</h1>
        <div class="desc">跨维度找规律，用数据验证直觉</div>
      </div>

      <div class="grid grid-3" style="margin-bottom:16px;">
        <div class="stat-card"><div class="stat-value">${avgMood}</div><div class="stat-label">近30天平均情绪</div></div>
        <div class="stat-card"><div class="stat-value">${avgEnergy}</div><div class="stat-label">近30天平均能量</div></div>
        <div class="stat-card"><div class="stat-value">${avgSleep}<span class="stat-unit">h</span></div><div class="stat-label">近30天平均睡眠</div></div>
      </div>

      <div class="grid grid-2" style="margin-bottom:16px;">
        <div class="card">
          <div class="card-title">维度覆盖</div>
          <div style="display:flex; align-items:center; gap:16px;">
            ${donutHtml}
            <div style="font-size:12px; color:var(--text-secondary); line-height:1.8;">
              已探索 ${explored.length} / 20 个维度<br>
              完成 ${((explored.length / 20) * 100).toFixed(0)}%<br>
              <span style="color:var(--text-tertiary);">点击「自我画像」查看详情</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">睡眠与情绪关联</div>
          <div style="font-size:28px; font-weight:500; color:var(--c-olive);">
            ${corr === null ? '-' : (corr > 0 ? '+' : '') + corr.toFixed(2)}
          </div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${corrText}</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">情绪能量趋势</div>
        <div style="display:flex; gap:16px; font-size:11px; margin-bottom:8px;">
          <span style="color:var(--c-rose-dark);">● 情绪</span>
          <span style="color:var(--c-emerald-dark);">● 能量</span>
        </div>
        <div class="chart-container">${chartHtml}</div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">高频情绪标签</div>
        <div class="tag-group">${tagCloud}</div>
      </div>

      <div class="card">
        <div class="card-title">发现的模式</div>
        ${patternsHtml}
      </div>
    `;
  },

  // === Timeline ===
  timeline() {
    const events = Store.getTimeline();
    const typeColors = { start: 'olive', dimension: 'emerald', pattern: 'amber', shift: 'purple', milestone: 'coral' };
    const typeLabels = { start: '开始', dimension: '维度', pattern: '模式', shift: '认知', milestone: '里程碑' };

    const tlHtml = events.length > 0
      ? events.map(e => {
        const color = typeColors[e.type] || 'olive';
        const isStart = e.type === 'start';
        return `<div class="timeline-item">
          ${!isStart ? `<button class="tl-delete" data-action="delete-timeline" data-id="${e.id}" title="删除">×</button>` : ''}
          <div class="tl-date">${this._fmtDate(e.date)}</div>
          <span class="tl-tag tag-${color}">${typeLabels[e.type] || e.type}</span>
          <div class="tl-title">${this._escape(e.title)}</div>
          ${e.description ? `<div class="tl-desc">${this._escape(e.description)}</div>` : ''}
        </div>`;
      }).join('')
      : '<div class="empty-state"><div class="es-text">还没有成长记录</div></div>';

    return `
      <div class="page-header">
        <h1>成长轨迹</h1>
        <div class="desc">记录认知迭代的每一步，不和任何人攀比进度</div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">添加记录</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
          <select data-field="tl-type" style="padding:8px 12px; border:0.5px solid var(--border); border-radius:8px; font-size:13px;">
            <option value="milestone">里程碑</option>
            <option value="dimension">维度突破</option>
            <option value="pattern">模式发现</option>
            <option value="shift">认知迭代</option>
            <option value="start">起点</option>
          </select>
          <input type="text" data-field="tl-date" value="${this._today()}" style="padding:8px 12px; border:0.5px solid var(--border); border-radius:8px; font-size:13px;" placeholder="YYYY-MM-DD">
        </div>
        <input type="text" data-field="tl-title" placeholder="标题（如：发现自己的情绪触发模式）" style="margin-bottom:8px;">
        <textarea data-field="tl-desc" placeholder="详细描述..." style="min-height:60px; margin-bottom:8px;"></textarea>
        <button class="btn btn-primary btn-sm" data-action="add-timeline">添加记录</button>
      </div>

      <div class="card">
        <div class="card-title">成长时间线</div>
        <div class="timeline">${tlHtml}</div>
      </div>
    `;
  },

  // === Vision Board (愿景板) ===
  visionBoard() {
    const board = Store.getVisionBoard();
    const stats = Store.getStats();
    const themes = board.themes || [];

    const themesHtml = themes.map(t => {
      const imgs = t.images || [];
      const tilesHtml = imgs.length === 0
        ? `<div class="vb-empty-tile">还没有图片，点右上角 ＋ 添加</div>`
        : imgs.map((src, idx) => `
            <div class="vb-image-tile" data-action="open-vision-image" data-theme="${this._escape(t.id)}" data-index="${idx}">
              <img src="${src}" alt="${this._escape(t.title)}图${idx + 1}" loading="lazy">
              <div class="vb-image-x" data-action="delete-vision-image" data-theme="${this._escape(t.id)}" data-index="${idx}" title="删除">×</div>
            </div>
          `).join('');

      const noteHtml = t.note
        ? `<div class="vb-note">${this._escape(t.note)}</div>`
        : '';

      return `
        <div class="card vb-theme-card" data-theme-id="${this._escape(t.id)}">
          <div class="vb-theme-head">
            <input class="vb-theme-title" data-action="edit-vision-title" data-theme="${this._escape(t.id)}"
                   value="${this._escape(t.title)}" maxlength="24" spellcheck="false">
            <div class="vb-theme-tools">
              <span class="vb-count">${imgs.length} 图</span>
              <label class="vb-tool-btn vb-add-img" data-theme="${this._escape(t.id)}" title="添加图片">
                <input type="file" class="vb-file-input" accept="image/*" data-theme="${this._escape(t.id)}" multiple>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
                  <circle cx="5.5" cy="6.5" r="1.3" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M2.5 12l3.5-3.5 2.5 2.5 2-2 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2v4M6 4h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
              </label>
              <button class="vb-tool-btn" data-action="toggle-vision-note" data-theme="${this._escape(t.id)}" title="备注">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M13 2.5L13.5 3a2 2 0 01-3 3L4 12.5 1.5 14l1.5-2.5L9.5 5a2 2 0 013-2.5z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="vb-tool-btn vb-tool-del" data-action="delete-vision-theme" data-theme="${this._escape(t.id)}" title="删除主题">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.8 9.5h6.4L12 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="vb-image-grid">${tilesHtml}</div>
          <textarea class="vb-note-input" data-action="edit-vision-note" data-theme="${this._escape(t.id)}"
                    placeholder="对这个主题写一句驱动力 / 行动宣言…"
                    style="display:${t.note ? 'block' : 'none'};">${this._escape(t.note)}</textarea>
          ${noteHtml}
        </div>
      `;
    }).join('');

    return `
      <div class="page-header">
        <h1>愿景板</h1>
        <div class="desc">${stats.visionImageCount} 张图 · ${stats.visionThemeCount} 个主题 · 把想要的未来贴出来</div>
      </div>

      <div class="vb-topbar">
        <button class="btn btn-primary" data-action="add-vision-theme">+ 新增主题</button>
      </div>

      <div class="vb-theme-grid">
        ${themesHtml || `<div class="card manual-empty" style="grid-column:1/-1;">还没有主题。点击「+ 新增主题」，写下你想成为的样子。</div>`}
      </div>

      <div id="visionModal" class="vb-modal" style="display:none;">
        <div class="vb-modal-back" data-action="close-vision-modal"></div>
        <div class="vb-modal-body">
          <button class="vb-modal-x" data-action="close-vision-modal" aria-label="关闭">×</button>
          <img id="visionModalImg" src="" alt="">
          <div class="vb-modal-foot">
            <span id="visionModalCaption" class="vb-modal-cap"></span>
            <button class="btn btn-secondary btn-sm" data-action="delete-vision-image-from-modal">删除这张</button>
          </div>
        </div>
      </div>
    `;
  },

  // === Settings ===
  settings(deferredPrompt) {
    const stats = Store.getStats();
    const canInstall = !!deferredPrompt;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const ai = Store.getSettings().ai || {};

    return `
      <div class="page-header">
        <h1>设置</h1>
        <div class="desc">应用配置与数据管理</div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">应用</div>
        <div class="setting-row">
          <div>
            <div class="sr-label">安装到桌面</div>
            <div class="sr-desc">${isStandalone ? '已安装，正在独立模式运行' : canInstall ? '点击安装，可离线使用' : '使用 Chrome/Edge 打开可安装'}</div>
          </div>
          ${isStandalone
            ? '<span style="font-size:12px; color:var(--c-emerald-dark);">已安装</span>'
            : `<button class="btn btn-primary btn-sm" data-action="pwa-install" ${canInstall ? '' : 'disabled style="opacity:0.5; cursor:not-allowed;"'}>安装</button>`
          }
        </div>
        <div class="setting-row">
          <div>
            <div class="sr-label">离线使用</div>
            <div class="sr-desc">Service Worker 已启用，应用可离线运行</div>
          </div>
          <span style="font-size:12px; color:var(--c-emerald-dark);">已启用</span>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">AI 助手配置</div>
        <div class="ai-note" style="margin-bottom:12px;">配置后，感恩日记与维度洞察可调用大模型整理总结。配置仅保存在本机浏览器（localStorage），不会上传到任何服务器。支持任意 OpenAI 兼容接口。</div>
        <div class="ai-form">
          <div class="af-row">
            <label>API 地址（兼容 OpenAI /chat/completions）</label>
            <input type="text" data-field="ai-endpoint" placeholder="https://api.openai.com/v1/chat/completions" value="${this._escape(ai.endpoint || '')}">
          </div>
          <div class="af-row">
            <label>API Key</label>
            <input type="password" data-field="ai-key" placeholder="sk-..." value="${this._escape(ai.apiKey || '')}">
          </div>
          <div class="af-row">
            <label>模型名称</label>
            <input type="text" data-field="ai-model" placeholder="选择或输入模型名称…" list="ai-model-list" value="${this._escape(ai.model || '')}">
            <datalist id="ai-model-list">
              <option value="deepseek-chat">DeepSeek V3</option>
              <option value="deepseek-reasoner">DeepSeek R1</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              <option value="qwen-plus">通义千问 Plus</option>
              <option value="moonshot-v1-8k">Moonshot v1</option>
            </datalist>
          </div>
        </div>
        <div style="margin-top:12px;">
          <button class="btn btn-primary btn-sm" data-action="save-ai">保存 AI 配置</button>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">数据管理</div>
        <div class="ai-note" style="margin-bottom:12px;">用于在电脑和手机之间同步数据：点「导出」下载 .json 文件 → 把文件传到另一台设备 → 选择导入方式。</div>
        <div class="setting-row">
          <div><div class="sr-label">导出数据</div><div class="sr-desc">备份所有打卡、研究、共鸣、时间线、愿景板数据为 .json 文件</div></div>
          <button class="btn btn-sm" data-action="export-data">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="margin-right:4px;vertical-align:middle;">
              <path d="M8 2v9M8 2L5 5M8 2l3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 10v3h12v-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            导出
          </button>
        </div>
        <div class="setting-row">
          <div><div class="sr-label">合并导入（推荐）</div><div class="sr-desc">导入备份，同日期/同ID取导入版本，本地独有数据保留</div></div>
          <button class="btn btn-sm" data-action="import-merge">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="margin-right:4px;vertical-align:middle;">
              <path d="M2 8h12M8 2v12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            合并
          </button>
        </div>
        <div class="setting-row">
          <div><div class="sr-label">覆盖导入</div><div class="sr-desc">用导入文件完全替换本机所有数据（旧数据将丢失）</div></div>
          <button class="btn btn-sm" data-action="import-overwrite" style="color:var(--c-coral-dark); border-color:var(--c-coral);">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="margin-right:4px;vertical-align:middle;">
              <path d="M8 2v9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M5 7l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12v1.5h12V12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            覆盖
          </button>
        </div>
        ${(() => {
          const info = Store.getBackupInfo();
          if (!info) return '';
          const dateStr = new Date(info.backupAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          return `<div class="setting-row">
            <div><div class="sr-label" style="color:var(--c-olive-dark, #6B7F4A);">♻️ 从自动备份恢复</div><div class="sr-desc">备份时间：${dateStr} · 含 ${info.checkins} 条打卡、${info.dimensions} 个维度、${info.readings} 条共鸣</div></div>
            <button class="btn btn-sm" data-action="restore-backup" style="color:var(--c-olive-dark, #6B7F4A); border-color:var(--c-olive, #8B9E6B);">恢复</button>
          </div>`;
        })()}
        <div class="setting-row">
          <div><div class="sr-label" style="color:var(--c-coral-dark);">重置所有数据</div><div class="sr-desc">清除全部记录，重新开始</div></div>
          <button class="btn btn-sm" data-action="reset-data" style="color:var(--c-coral-dark); border-color:var(--c-coral);">重置</button>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-title">统计概览</div>
        <div class="grid grid-3" style="margin-bottom:8px;">
          <div class="stat-card"><div class="stat-value">${stats.daysSinceStart}<span class="stat-unit">天</span></div><div class="stat-label">累计研究</div></div>
          <div class="stat-card"><div class="stat-value">${stats.totalCheckins}<span class="stat-unit">次</span></div><div class="stat-label">打卡记录</div></div>
          <div class="stat-card"><div class="stat-value">${stats.exploredCount}<span class="stat-unit">/20</span></div><div class="stat-label">维度探索</div></div>
        </div>
        <div class="grid grid-2">
          <div class="stat-card"><div class="stat-value">${stats.timelineCount}<span class="stat-unit">条</span></div><div class="stat-label">成长记录</div></div>
          <div class="stat-card"><div class="stat-value">${stats.readingCount || 0}<span class="stat-unit">条</span></div><div class="stat-label">阅读共鸣</div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">关于</div>
        <div style="font-size:13px; color:var(--text-secondary); line-height:1.8;">
          <strong style="color:var(--text-primary);">Self-Research Agent</strong><br>
          版本 1.0.0<br><br>
          <span style="color:var(--text-tertiary);">向外探索是消遣，Self-Research 才是成长。把用来窥探别人的时间，全部用来读懂自己。</span>
        </div>
      </div>
    `;
  }
};
