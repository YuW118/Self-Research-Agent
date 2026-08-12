/**
 * Self-Research Agent - 应用主逻辑
 * 路由管理 / 事件处理 / 状态管理 / PWA
 */

const AIClient = {
  _clean(text) {
    if (!text) return '';
    let t = text.trim();
    const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) t = fence[1].trim();
    const start = t.search(/[{\[]/);
    if (start > 0) t = t.slice(start);
    return t;
  },

  async complete(messages, options = {}) {
    const ai = Store.getSettings().ai || {};
    if (!ai.endpoint || !ai.apiKey) throw new Error('未配置 AI（请在设置中填写 API 地址与 Key）');
    const body = {
      model: ai.model || 'gpt-4o-mini',
      messages,
      temperature: options.temperature != null ? options.temperature : 0.7
    };
    if (options.json) body.response_format = { type: 'json_object' };

    const res = await fetch(ai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ai.apiKey}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.text()).slice(0, 200); } catch (e) {}
      throw new Error(`请求失败 (${res.status}) ${detail}`);
    }
    const data = await res.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error('AI 返回内容为空');
    return content;
  },

  async completeWithImage(imageDataUrl, textPrompt, options = {}) {
    const ai = Store.getSettings().ai || {};
    if (!ai.endpoint || !ai.apiKey) throw new Error('未配置 AI');
    const body = {
      model: ai.model || 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: textPrompt },
          { type: 'image_url', image_url: { url: imageDataUrl } }
        ]
      }],
      temperature: options.temperature != null ? options.temperature : 0.3
    };
    const res = await fetch(ai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ai.apiKey}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.text()).slice(0, 200); } catch (e) {}
      throw new Error(`请求失败 (${res.status}) ${detail}`);
    }
    const data = await res.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error('AI 返回内容为空');
    return content;
  }
};

const App = {
  state: {
    page: 'dashboard',
    researchModule: 'emotion',
    researchDimension: 1,
    openModule: 'emotion',
    dimSnapshotIdx: null,
    dimSnapshotEditIdx: null,
    checkinEditDate: null,
    selectedTags: [],
    customTags: [],
    gratitudeEntries: [],
    gratitudeJournal: null,
    noteAI: null,
    confidence: 0,
    deferredPrompt: null,
    readingView: 'list',
    readingEditId: null,
    readingSource: 'book',
    readingAITemp: null,
    readingImages: [],
    speechTopic: null,
    speechTopicHint: null,
    speechAITemp: null
  },

  init() {
    this.registerSW(); // 最先注册 SW，确保离线能力尽早生效
    Store.init();
    this.renderSidebar();
    this.bindEvents();
    this.route(this.getInitialPage());
  },

  // 支持 manifest shortcuts 的 ?view=xxx 直达页面
  getInitialPage() {
    try {
      const v = new URLSearchParams(window.location.search).get('view');
      const valid = Views.navItems.some(n => n.id === v);
      return valid ? v : 'dashboard';
    } catch (e) {
      return 'dashboard';
    }
  },

  // === Sidebar ===
  renderSidebar() {
    const nav = document.getElementById('sidebarNav');
    nav.innerHTML = Views.navItems.map(item => `
      <div class="nav-item ${this.state.page === item.id ? 'active' : ''}"
           data-action="navigate" data-page="${item.id}">
        <div class="nav-icon">${Views.icons[item.icon]}</div>
        <div class="nav-label">${item.label}</div>
      </div>
    `).join('');

    const stats = Store.getStats();
    document.getElementById('sidebarFooter').innerHTML =
      `第 ${stats.daysSinceStart} 天<br>${stats.exploredCount}/20 维度`;
  },

  // === Events ===
  bindEvents() {
    // Sidebar nav
    document.getElementById('sidebarNav').addEventListener('click', (e) => {
      const item = e.target.closest('[data-action="navigate"]');
      if (item) {
        this.route(item.dataset.page);
        this.closeSidebar();
      }
    });

    // Main content delegation
    document.getElementById('main').addEventListener('click', (e) => {
      this.handleClick(e);
    });

    // Slider live update
    document.getElementById('main').addEventListener('input', (e) => {
      if (e.target.matches('input[type="range"][data-slider]')) {
        const display = e.target.parentElement.querySelector('.slider-value');
        if (display) {
          const suffix = e.target.dataset.suffix || '';
          display.textContent = e.target.value + suffix;
        }
      }
      // Vision board: live title / note editing
      const t = e.target;
      if (t.matches('.vb-theme-title')) {
        Store.updateVisionTheme(t.dataset.theme, { title: t.value.trim() || '未命名主题' });
      } else if (t.matches('.vb-note-input')) {
        Store.updateVisionTheme(t.dataset.theme, { note: t.value });
      }
    });

    // Mobile toggle
    document.getElementById('mobileToggle').addEventListener('click', () => this.toggleSidebar());
    document.getElementById('sidebarOverlay').addEventListener('click', () => this.closeSidebar());

    // Enter to add custom tag / gratitude entry
    document.getElementById('main').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      if (e.target.id === 'customTagInput') { e.preventDefault(); this.addCustomTag(); }
      else if (e.target.id === 'gratitudeInput') { e.preventDefault(); this.addGratitude(); }
    });

    // File input for reading photo OCR + vision board image upload
    document.getElementById('main').addEventListener('change', (e) => {
      if (e.target.id === 'readingPhotoInput' && e.target.files && e.target.files.length) {
        this.handleReadingPhotos(Array.from(e.target.files));
      } else if (e.target.classList && e.target.classList.contains('vb-file-input') && e.target.files.length) {
        this.handleVisionImages(e.target.dataset.theme, e.target.files);
      }
    });

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.state.deferredPrompt = e;
      // 刷新当前页以显示安装横幅（首页/设置页）
      if (this.state.page === 'dashboard' || this.state.page === 'settings') {
        this.route(this.state.page);
      }
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      this.state.deferredPrompt = null;
      this.toast('已安装到桌面');
    });
  },

  handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    try {
      this._dispatchAction(action, target, e);
    } catch (err) {
      console.error('[handleClick] action failed:', action, err);
      this.toast('操作失败：' + (err?.message || err));
    }
  },

  _dispatchAction(action, target, e) {
    switch (action) {
      case 'navigate': this.route(target.dataset.page); break;
      case 'goto-checkin': this.route('checkin'); break;
      case 'save-checkin': this.saveCheckin(); break;
      case 'edit-checkin': this.editCheckin(target.dataset.date); break;
      case 'delete-checkin': this.deleteCheckin(target.dataset.date); break;
      case 'cancel-edit-checkin': this.cancelEditCheckin(); break;
      case 'toggle-tag': this.toggleTag(target.dataset.tag); break;
      case 'add-custom-tag': this.addCustomTag(); break;
      case 'remove-custom-tag': this.removeCustomTag(target.dataset.tag); break;
      case 'add-gratitude': this.addGratitude(); break;
      case 'remove-gratitude': this.removeGratitude(parseInt(target.dataset.index)); break;
      case 'ai-gratitude': this.aiGratitude(); break;
      case 'ai-note': this.aiNoteAnalysis(); break;
      case 'ai-insight': this.aiInsight(); break;
      case 'change-speech-topic': this.changeSpeechTopic(); break;
      case 'ai-speech': this.aiSpeechAnalysis(); break;
      case 'toggle-accordion': this.toggleAccordion(target.dataset.module); break;
      case 'select-module': this.selectModule(target.dataset.module); break;
      case 'select-dimension': this.selectDimension(parseInt(target.dataset.dim)); break;
      case 'view-dim-snapshot': this.viewDimSnapshot(target.dataset.dim, target.dataset.idx); break;
      case 'back-to-dim': this.backToDim(target.dataset.dim); break;
      case 'edit-dim-snapshot': this.editDimSnapshot(target.dataset.dim, parseInt(target.dataset.idx)); break;
      case 'delete-dim-snapshot': this.deleteDimSnapshot(target.dataset.dim, parseInt(target.dataset.idx)); break;
      case 'cancel-edit-dim-snapshot': this.cancelEditDimSnapshot(); break;
      case 'save-dimension': this.saveDimension(); break;
      case 'goto-dimension': this.gotoDimension(parseInt(target.dataset.dim)); break;
      case 'set-confidence': this.setConfidence(parseInt(target.dataset.level)); break;
      case 'save-ai': this.saveAI(); break;
      case 'export-manual': this.exportManual(); break;
      case 'export-data': this.exportData(); break;
      case 'import-data': this.importData(); break;
      case 'reset-data': this.resetData(); break;
      case 'restore-backup': this.restoreBackup(); break;
      case 'pwa-install': this.installPWA(); break;
      case 'add-timeline': this.addTimeline(); break;
      case 'delete-timeline': this.deleteTimeline(target.dataset.id); break;
      case 'new-reading': this.newReading(); break;
      case 'edit-reading': this.editReading(target.dataset.id); break;
      case 'view-reading': this.viewReading(target.dataset.id); break;
      case 'reading-list': this.readingBackToList(); break;
      case 'select-source': this.selectSource(target.dataset.source); break;
      case 'capture-photo': this.capturePhoto(); break;
      case 'save-reading': this.saveReading(); break;
      case 'delete-reading-confirm': this.deleteReading(target.dataset.id); break;
      case 'delete-reading': this.deleteReading(target.dataset.id); break;
      case 'ai-reading': this.aiReadingAnalysis(); break;
      case 'voice-toggle': this.toggleVoice(target.dataset.field); break;
      case 'view-reading-image': this.viewReadingImage(this.state.readingImages[parseInt(target.dataset.idx)]); break;
      case 'view-reading-image-existing': this.viewReadingImage(target.dataset.src); break;
      case 'remove-reading-image': this.removeReadingImage(parseInt(target.dataset.idx)); break;
      case 'close-reading-image': this.closeReadingImage(); break;
      case 'add-vision-theme': this.addVisionTheme(); break;
      case 'delete-vision-theme': this.deleteVisionTheme(target.dataset.theme); break;
      case 'toggle-vision-note': this.toggleVisionNote(target.dataset.theme); break;
      case 'open-vision-image': this.openVisionImage(target.dataset.theme, parseInt(target.dataset.index)); break;
      case 'delete-vision-image': this.deleteVisionImageHandler(target.dataset.theme, parseInt(target.dataset.index)); break;
      case 'close-vision-modal': this.closeVisionModal(); break;
      case 'delete-vision-image-from-modal': this.deleteVisionImageFromModal(); break;
    }
  },

  // === Routing ===
  route(page) {
    this.state.page = page;

    // 切路由时自动停掉语音输入
    if (typeof Voice !== 'undefined' && Voice.cancel) Voice.cancel();

    const main = document.getElementById('main');

    // Page-specific state init
    if (page === 'checkin') {
      // 若处于编辑历史日期模式，保留已加载的历史数据；否则加载今天的
      if (!this.state.checkinEditDate) {
        const today = Store.getTodayCheckin();
        this.state.selectedTags = today?.tags ? [...today.tags] : [];
        this.state.customTags = today?.customTags ? [...today.customTags] : [];
        this.state.gratitudeEntries = today?.gratitude ? [...today.gratitude] : [];
        this.state.gratitudeJournal = today?.gratitudeJournal || null;
        this.state.noteAI = today?.noteAI || null;
        // 表达力训练: 恢复已有主题和 AI 分析
        const speech = today?.speech || {};
        this.state.speechTopic = speech.topic || getSpeechTopic().topic;
        this.state.speechTopicHint = speech.hint || getSpeechTopic().hint;
        this.state.speechAITemp = speech.aiAnalysis || null;
      }
    }
    if (page === 'research') {
      const saved = Store.getDimensionData(this.state.researchDimension);
      this.state.confidence = saved?.confidence || 0;
    }
    switch (page) {
      case 'dashboard': main.innerHTML = Views.dashboard(); break;
      case 'checkin': main.innerHTML = Views.checkin(); break;
      case 'readings': main.innerHTML = Views.readings(this.state.readingView, this.state.readingEditId); break;
      case 'research':
        if (this.state.dimSnapshotIdx != null) {
          main.innerHTML = Views._dimSnapshotView(this.state.researchDimension, this.state.dimSnapshotIdx);
        } else {
          main.innerHTML = Views.research(this.state.researchModule, this.state.researchDimension);
        }
        break;      case 'vision': main.innerHTML = Views.visionBoard(); break;
      case 'profile': main.innerHTML = Views.profile(); break;
      case 'insights': main.innerHTML = Views.insights(); break;
      case 'timeline': main.innerHTML = Views.timeline(); break;
      case 'settings': main.innerHTML = Views.settings(this.state.deferredPrompt); break;
    }

    this.renderSidebar();
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  // === Actions ===
  persistCheckin() {
    const moodEl = document.querySelector('[data-slider="mood"]');
    const energyEl = document.querySelector('[data-slider="energy"]');
    const sleepEl = document.querySelector('[data-slider="sleep"]');
    const noteEl = document.querySelector('[data-field="note"]');
    if (!moodEl || !energyEl || !sleepEl) return;

    // 支持"编辑历史日期"——若设置，则保存到该日而非今天
    const editDate = this.state.checkinEditDate || null;

    Store.saveCheckin({
      date: editDate || undefined,
      mood: parseInt(moodEl.value),
      energy: parseInt(energyEl.value),
      sleep: parseFloat(sleepEl.value),
      note: noteEl?.value || '',
      tags: [...this.state.selectedTags],
      customTags: [...this.state.customTags],
      gratitude: [...this.state.gratitudeEntries],
      gratitudeJournal: this.state.gratitudeJournal,
      noteAI: this.state.noteAI,
      speech: this._collectSpeechData()
    });

    // 保存后清除编辑日期，避免后续误改历史
    this.state.checkinEditDate = null;
  },

  saveCheckin() {
    this.persistCheckin();
    this.toast('打卡成功');
    this.state.selectedTags = [];
    this.state.customTags = [];
    this.state.gratitudeEntries = [];
    this.state.gratitudeJournal = null;
    this.state.noteAI = null;
    this.state.checkinEditDate = null;
    // 不跳转首页——保留在打卡页，重新渲染以刷新历史记录
    this.route('checkin');
  },

  editCheckin(date) {
    if (!date) return;
    const c = Store.getCheckin(date);
    if (!c) {
      this.toast('找不到该日打卡记录');
      return;
    }
    if (!confirm(`加载 ${Views._fmtDate(date)} 的打卡数据到表单？保存时会更新该日记录（不影响今天）。`)) return;
    this.state.checkinEditDate = date;
    this.state.selectedTags = [...(c.tags || [])];
    this.state.customTags = [...(c.customTags || [])];
    this.state.gratitudeEntries = [...(c.gratitude || [])];
    this.state.gratitudeJournal = c.gratitudeJournal || null;
    this.state.noteAI = c.noteAI || null;
    this.toast(`已加载 ${Views._fmtDate(date)} 的打卡，修改后保存即更新该日`);
    this.route('checkin');
  },

  deleteCheckin(date) {
    if (!date) return;
    if (!confirm(`确定删除 ${Views._fmtDate(date)} 的打卡记录吗？此操作不可恢复。`)) return;
    Store.deleteCheckin(date);
    this.toast('已删除');
    this.route('checkin');
  },

  cancelEditCheckin() {
    this.state.checkinEditDate = null;
    this.state.selectedTags = [];
    this.state.customTags = [];
    this.state.gratitudeEntries = [];
    this.state.gratitudeJournal = null;
    this.state.noteAI = null;
    this.toast('已回到今日打卡');
    this.route('checkin');
  },

  toggleTag(tag) {
    const idx = this.state.selectedTags.indexOf(tag);
    if (idx >= 0) {
      this.state.selectedTags.splice(idx, 1);
    } else {
      this.state.selectedTags.push(tag);
    }
    const btn = document.querySelector(`[data-tag="${tag}"]`);
    if (btn) btn.classList.toggle('selected');
  },

  selectModule(moduleId) {
    const mod = MODULES.find(m => m.id === moduleId);
    if (mod && mod.dimensionIds.length > 0) {
      this.state.researchModule = moduleId;
      this.state.researchDimension = mod.dimensionIds[0];
      this.state.openModule = moduleId;
      this.state.dimSnapshotIdx = null;
      this.state.dimSnapshotEditIdx = null;
      const saved = Store.getDimensionData(this.state.researchDimension);
      this.state.confidence = saved?.confidence || 0;
      this.route('research');
    }
  },

  selectDimension(dimId) {
    const dim = getDimension(dimId);
    if (dim) this.state.openModule = dim.module;
    this.state.researchDimension = dimId;
    this.state.dimSnapshotIdx = null;
    this.state.dimSnapshotEditIdx = null;
    const saved = Store.getDimensionData(dimId);
    this.state.confidence = saved?.confidence || 0;
    this.route('research');
  },

  viewDimSnapshot(dimId, idx) {
    const dim = getDimension(parseInt(dimId));
    if (dim) this.state.openModule = dim.module;
    this.state.researchDimension = parseInt(dimId);
    this.state.dimSnapshotIdx = idx;
    this.state.dimSnapshotEditIdx = null;
    this.route('research');
  },

  backToDim(dimId) {
    this.state.dimSnapshotIdx = null;
    this.state.dimSnapshotEditIdx = null;
    this.selectDimension(parseInt(dimId));
  },

  gotoDimension(dimId) {
    const dim = getDimension(dimId);
    if (dim) {
      this.state.researchModule = dim.module;
      this.state.researchDimension = dimId;
      this.state.openModule = dim.module;
      this.state.dimSnapshotIdx = null;
      this.state.dimSnapshotEditIdx = null;
      const saved = Store.getDimensionData(dimId);
      this.state.confidence = saved?.confidence || 0;
      this.route('research');
    }
  },

  // 进入"修改历史快照"模式：表单显示该快照内容，保存时原地覆盖
  editDimSnapshot(dimId, idx) {
    if (typeof idx !== 'number' || isNaN(idx)) return;
    const snap = Store.getDimensionSnapshot(parseInt(dimId), idx);
    if (!snap) {
      this.toast('找不到该历史快照');
      return;
    }
    const dim = getDimension(parseInt(dimId));
    if (dim) this.state.openModule = dim.module;
    this.state.researchDimension = parseInt(dimId);
    this.state.dimSnapshotIdx = null;
    this.state.dimSnapshotEditIdx = idx;
    this.state.confidence = snap.confidence || 0;
    this.toast(`已加载 ${Views._fmtDate((snap.date || '').slice(0, 10))} 的快照，修改后保存即覆盖原快照`);
    this.route('research');
  },

  cancelEditDimSnapshot() {
    this.state.dimSnapshotEditIdx = null;
    // 把 confidence 重置回当前最新版本
    const saved = Store.getDimensionData(this.state.researchDimension);
    this.state.confidence = saved?.confidence || 0;
    this.toast('已回到当前编辑');
    this.route('research');
  },

  deleteDimSnapshot(dimId, idx) {
    if (typeof idx !== 'number' || isNaN(idx)) return;
    const snap = Store.getDimensionSnapshot(parseInt(dimId), idx);
    if (!snap) {
      this.toast('找不到该历史快照');
      return;
    }
    const dateLabel = Views._fmtDate((snap.date || '').slice(0, 10));
    if (!confirm(`确定删除 ${dateLabel} 的快照吗？此操作不可恢复。`)) return;
    Store.deleteDimensionSnapshot(parseInt(dimId), idx);
    this.toast('快照已删除');
    // 若删除的正是当前编辑的那份，清掉编辑模式
    if (this.state.dimSnapshotEditIdx === idx) {
      this.state.dimSnapshotEditIdx = null;
    }
    this.route('research');
  },

  setConfidence(level) {
    this.state.confidence = level;
    document.querySelectorAll('.conf-dot').forEach(dot => {
      const dotLevel = parseInt(dot.dataset.level);
      dot.classList.toggle('active', dotLevel <= level);
    });
  },

  saveDimension() {
    const dimId = this.state.researchDimension;
    const dim = getDimension(dimId);
    if (!dim) return;

    const wasExplored = Store.getExploredDimensions().includes(dimId);

    const answers = {};
    dim.questions.forEach((q, i) => {
      const field = document.querySelector(`[data-field="answer-${i}"]`);
      answers[`q${i + 1}`] = field ? field.value : '';
    });

    const insightEl = document.querySelector('[data-field="insight"]');
    const insight = insightEl ? insightEl.value : '';
    const confidence = this.state.confidence;

    // 两条分支：1) 编辑历史快照模式 → 原地覆盖；2) 普通保存 → unshift 新快照
    const editIdx = this.state.dimSnapshotEditIdx;
    if (editIdx != null && !isNaN(editIdx)) {
      Store.updateDimensionSnapshot(dimId, editIdx, { answers, insight, confidence });
      this.toast('历史快照已修订');
      // 退出编辑模式，回到当前最新版本
      this.state.dimSnapshotEditIdx = null;
      const cur = Store.getDimensionData(dimId);
      this.state.confidence = cur?.confidence || 0;
      setTimeout(() => this.route('research'), 600);
      return;
    }

    Store.saveDimensionData(dimId, { answers, insight, confidence });

    // Add timeline event if newly explored
    if (!wasExplored) {
      Store.addTimelineEvent({
        date: Views._today(),
        type: 'dimension',
        title: `完成「${dim.name}」维度探索`,
        description: dim.subtitle,
        relatedDimensions: [dimId]
      });
    }

    this.toast('研究记录已保存');
    setTimeout(() => this.route('research'), 600);
  },

  addTimeline() {
    const typeEl = document.querySelector('[data-field="tl-type"]');
    const dateEl = document.querySelector('[data-field="tl-date"]');
    const titleEl = document.querySelector('[data-field="tl-title"]');
    const descEl = document.querySelector('[data-field="tl-desc"]');

    if (!titleEl || !titleEl.value.trim()) {
      this.toast('请填写标题');
      return;
    }

    Store.addTimelineEvent({
      date: dateEl?.value || Views._today(),
      type: typeEl?.value || 'milestone',
      title: titleEl.value.trim(),
      description: descEl?.value || '',
      relatedDimensions: []
    });

    this.toast('记录已添加');
    this.route('timeline');
  },

  deleteTimeline(id) {
    if (!confirm('确定删除这条成长记录？删除后不可恢复。')) return;
    Store.deleteTimelineEvent(id);
    this.toast('已删除');
    this.route('timeline');
  },

  // === Check-in extras: custom emotion tags ===
  addCustomTag() {
    const input = document.getElementById('customTagInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    if (this.state.customTags.includes(val) || this.state.selectedTags.includes(val)) {
      this.toast('该情绪已存在');
      input.value = '';
      return;
    }
    this.state.customTags.push(val);
    input.value = '';
    this._renderCustomTags();
  },

  removeCustomTag(tag) {
    this.state.customTags = this.state.customTags.filter(t => t !== tag);
    this._renderCustomTags();
  },

  _renderCustomTags() {
    const list = document.getElementById('customTagList');
    if (!list) return;
    list.innerHTML = this.state.customTags.map(t =>
      `<span class="custom-chip">${Views._escape(t)}<span class="x" data-action="remove-custom-tag" data-tag="${Views._escape(t)}">×</span></span>`
    ).join('');
  },

  // === Check-in extras: gratitude journal ===
  addGratitude() {
    const input = document.getElementById('gratitudeInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    this.state.gratitudeEntries.push(val);
    input.value = '';
    this._renderGratitude();
  },

  removeGratitude(index) {
    if (isNaN(index)) return;
    this.state.gratitudeEntries.splice(index, 1);
    this._renderGratitude();
  },

  _renderGratitude() {
    const list = document.getElementById('gratitudeList');
    if (!list) return;
    list.innerHTML = this.state.gratitudeEntries.map((g, i) =>
      `<div class="grat-item">
        <span style="color:var(--c-olive); font-size:12px; flex-shrink:0;">${i + 1}.</span>
        <span class="gi-text">${Views._escape(g)}</span>
        <span class="gi-x" data-action="remove-gratitude" data-index="${i}">×</span>
      </div>`
    ).join('');
  },

  async aiGratitude() {
    if (this.state.gratitudeEntries.length === 0) {
      this.toast('请先添加几条感恩片段');
      return;
    }
    this.persistCheckin();
    const entries = this.state.gratitudeEntries;
    const list = entries.map((e, i) => `${i + 1}. ${e}`).join('\n');
    const prompt =
      `你是"每日感恩日记"整理助手。用户记录了今天 ${entries.length} 件值得感恩的小事，原文如下：\n${list}\n\n` +
      `请输出 JSON（不要 markdown 代码块），结构：\n` +
      `{"summary":"用1-2句温暖的话总结今天整体感受","entries":[{"raw":"原始内容","insight":"这条小事背后体现的价值，或它带来的温暖感悟，一句话"}],"shiningPoints":["从今天这些小事里，挖掘出用户身上1-3个闪光点（如温柔、敏锐、知足、热爱生活等）"]}`;

    try {
      this.toast('AI 整理中…');
      const content = await AIClient.complete([
        { role: 'system', content: '你擅长用温暖、细腻、不油腻的语言帮人整理感恩日记，挖掘闪光点。只输出 JSON，不要任何解释文字。' },
        { role: 'user', content: prompt }
      ], { json: true });
      const parsed = JSON.parse(AIClient._clean(content));
      this.state.gratitudeJournal = {
        createdAt: new Date().toISOString(),
        summary: parsed.summary || '',
        entries: (parsed.entries || []).map(e => ({ raw: e.raw || '', insight: e.insight || '' })),
        shiningPoints: parsed.shiningPoints || []
      };
      this.persistCheckin();
      this.route('checkin');
      this.toast('每日感恩日记已生成');
    } catch (err) {
      console.error('aiGratitude failed:', err);
      this.toast('AI 整理失败：' + err.message);
    }
  },

  async aiNoteAnalysis() {
    const noteEl = document.querySelector('[data-field="note"]');
    const note = noteEl ? noteEl.value.trim() : '';
    if (!note) {
      this.toast('请先写下今天最触动你的事');
      return;
    }
    this.persistCheckin();
    const prompt =
      `你是用户的情绪觉察分析助手。用户记录了今天最触动自己的一件事：\n\n${note}\n\n` +
      `请输出 JSON（不要 markdown 代码块），结构：\n` +
      `{"insight":"用1-2句话点出这件事背后隐藏的情绪触发点或心理需求（像懂他的老友那样说，不说教）","trigger":"分析这是一个什么类型的触发模式（如：被认可的需求、边界感、控制欲、安全感、自我价值感等），一句话","suggestedDimension":"根据内容，建议用户可以深入探索的自我研究维度名称（从这20个里选最贴近的：情绪节律、情绪触发点、焦虑模式、自我对话、独处偏好、身体能量节律、睡眠质量、运动与状态、性格内核、决策模式、边界感、原生家庭印记、社交能量、亲密关系模式、学习方式、工作节奏、创造力表达、理想生活、人生优先级、意义感），只输出维度名称"}`;

    try {
      this.toast('AI 分析中…');
      const content = await AIClient.complete([
        { role: 'system', content: '你擅长用温暖、敏锐、不评判的语言帮人看清自己的情绪触发点。只输出 JSON，不要任何解释文字。' },
        { role: 'user', content: prompt }
      ], { json: true });
      const parsed = JSON.parse(AIClient._clean(content));
      this.state.noteAI = {
        createdAt: new Date().toISOString(),
        insight: parsed.insight || '',
        trigger: parsed.trigger || '',
        suggestedDimension: parsed.suggestedDimension || ''
      };
      this.persistCheckin();
      this.route('checkin');
      this.toast('触动点分析已生成');
    } catch (err) {
      console.error('aiNoteAnalysis failed:', err);
      this.toast('AI 分析失败：' + err.message);
    }
  },

  // === Speech / 表达力训练 ===
  _collectSpeechData() {
    const textarea = document.querySelector('[data-field="speech"]');
    const text = textarea ? textarea.value.trim() : '';
    // 如果没有任何内容，不保存
    if (!text && !this.state.speechAITemp) return undefined;
    return {
      topic: this.state.speechTopic || '',
      hint: this.state.speechTopicHint || '',
      text,
      aiAnalysis: this.state.speechAITemp || null
    };
  },

  changeSpeechTopic() {
    // 从主题库中随机换一个（排除当前）
    const used = [this.state.speechTopic];
    const available = SPEECH_TOPICS.filter(t => !used.includes(t.topic));
    const pool = available.length > 0 ? available : SPEECH_TOPICS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.state.speechTopic = pick.topic;
    this.state.speechTopicHint = pick.hint;
    this.state.speechAITemp = null;
    // 只刷新主题部分（不重整整个打卡页，避免丢失其他填写的状态）
    const topicTitle = document.querySelector('.sp-topic-title');
    const topicHint = document.querySelector('.sp-topic-hint');
    if (topicTitle) topicTitle.textContent = pick.topic;
    if (topicHint) topicHint.textContent = pick.hint;
    // 清除 AI 分析结果区域
    const aiArea = document.getElementById('speechAIResult');
    if (aiArea) aiArea.innerHTML = '';
  },

  async aiSpeechAnalysis() {
    const textarea = document.querySelector('[data-field="speech"]');
    const text = textarea ? textarea.value.trim() : '';
    if (!text || text.length < 20) {
      this.toast('请先讲一段话（至少 20 字），内容太短不好分析');
      return;
    }

    const topic = this.state.speechTopic || '未指定主题';
    const hint = this.state.speechTopicHint || '';

    const prompt =
      `你是用户的表达力教练。用户进行了以下主题演讲练习：\n\n` +
      `演讲主题：${topic}\n` +
      `${hint ? `主题提示：${hint}\n` : ''}` +
      `演讲内容：\n${text}\n\n` +
      `请分析这份演讲，输出 JSON（不要 markdown 代码块），结构：\n` +
      `{\n` +
      `  "structure": "结构分析（1-2句，评估是否有开场-主体-总结的三段式结构，逻辑是否清晰）",\n` +
      `  "highlights": ["1-2个表达亮点（金句、比喻、故事、情感共鸣点等）"],\n` +
      `  "improvements": ["2-3条具体改进建议（如时间分配、逻辑顺序、例子的丰富度、结尾力度等）"],\n` +
      `  "suggestedOutline": "如果重新组织这个主题，你建议的 3 段式提纲（简短，每条 8-15 字）"\n` +
      `}`;

    try {
      this.toast('AI 分析中…');
      const content = await AIClient.complete([
        { role: 'system', content: '你是表达力训练教练。只输出 JSON，不要任何解释文字。' },
        { role: 'user', content: prompt }
      ], { json: true });

      const parsed = JSON.parse(AIClient._clean(content));
      this.state.speechAITemp = {
        structure: parsed.structure || '',
        highlights: parsed.highlights || [],
        improvements: parsed.improvements || [],
        suggestedOutline: parsed.suggestedOutline || ''
      };

      // 原地更新 AI 分析结果区域
      const container = document.getElementById('speechAIResult');
      if (container) {
        const a = this.state.speechAITemp;
        container.innerHTML = `
          <div class="rd-ai-result">
            <div class="rd-ai-section">
              <div class="rd-ai-label">📐 结构分析</div>
              <div class="rd-ai-text">${Views._escape(a.structure)}</div>
            </div>
            ${a.highlights.length ? `
              <div class="rd-ai-section">
                <div class="rd-ai-label">✨ 表达亮点</div>
                ${a.highlights.map(h => `<div class="rd-ai-question">${Views._escape(h)}</div>`).join('')}
              </div>` : ''}
            ${a.improvements.length ? `
              <div class="rd-ai-section">
                <div class="rd-ai-label">🔧 改进建议</div>
                ${a.improvements.map(imp => `<div class="rd-ai-question">${Views._escape(imp)}</div>`).join('')}
              </div>` : ''}
            ${a.suggestedOutline ? `
              <div class="rd-ai-section">
                <div class="rd-ai-label">📋 建议重构提纲</div>
                <div class="rd-ai-text" style="white-space:pre-line;">${Views._escape(a.suggestedOutline)}</div>
              </div>` : ''}
          </div>`;
      }
      this.toast('表达力分析完成');
    } catch (err) {
      console.error('aiSpeechAnalysis failed:', err);
      this.toast('AI 分析失败：' + err.message);
    }
  },

  async aiInsight() {
    const dimId = this.state.researchDimension;
    const dim = getDimension(dimId);
    if (!dim) return;

    const answers = {};
    dim.questions.forEach((q, i) => {
      const f = document.querySelector(`[data-field="answer-${i}"]`);
      answers[`q${i + 1}`] = f ? f.value.trim() : '';
    });
    const answeredCount = Object.values(answers).filter(v => v).length;
    if (answeredCount === 0) {
      this.toast('请先回答几个问题');
      return;
    }
    const qaText = dim.questions.map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[`q${i + 1}`] || '(未答)'}`).join('\n\n');

    const prompt =
      `关于自我维度「${dim.name}」——${dim.subtitle}。用户的回答如下：\n\n${qaText}\n\n` +
      `请做两件事：\n1）写一段"洞察总结"（2-4句话，点出核心规律或反复出现的模式，像懂他的老友那样说）；\n` +
      `2）给出 2-3 条可执行的具体建议，帮助他扬长避短。全部用中文，温暖、具体、不空洞。`;

    try {
      this.toast('AI 分析中…');
      const content = await AIClient.complete([
        { role: 'system', content: '你是用户的自我研究教练，擅长从碎片化的自我回答中提炼洞察，并给出可操作建议。' },
        { role: 'user', content: prompt }
      ]);
      const ta = document.querySelector('[data-field="insight"]');
      if (ta) ta.value = content.trim();
      this.toast('洞察已生成，可继续编辑');
    } catch (err) {
      console.error('aiInsight failed:', err);
      this.toast('AI 分析失败：' + err.message);
    }
  },

  saveAI() {
    const ep = document.querySelector('[data-field="ai-endpoint"]');
    const key = document.querySelector('[data-field="ai-key"]');
    const model = document.querySelector('[data-field="ai-model"]');
    Store.updateSettings({
      ai: {
        endpoint: ep?.value.trim() || '',
        apiKey: key?.value.trim() || '',
        model: model?.value.trim() || ''
      }
    });
    this.toast('AI 配置已保存');
    this.route('settings');
  },

  exportManual() {
    const allData = Store.getAllDimensionData();
    const explored = Store.getExploredDimensions();
    let text = '我的自我画像（Self-Research）\n生成于 ' + Views._today() + '\n已探索 ' + explored.length + ' / 20 个维度\n';
    text += '='.repeat(40) + '\n\n';

    MODULES.forEach(m => {
      const dims = getDimensionsByModule(m.id).filter(d => explored.includes(d.id));
      if (dims.length === 0) return;
      text += `【${m.name}】\n`;
      dims.forEach(d => {
        const data = allData[d.id];
        text += `\n${Views._localIndex(d.id, m.id)}. ${d.name}（${d.subtitle}）\n`;
        text += `   洞察：${data?.insight ? data.insight : '（已探索，未写洞察）'}\n`;
        text += `   置信度：${data?.confidence || 0}/5\n`;
      });
      text += '\n';
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `self-manual-${Views._today()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast('自我画像已导出');
  },

  toggleAccordion(moduleId) {
    const el = document.querySelector(`.acc-module[data-module="${moduleId}"]`);
    if (!el) return;
    const willOpen = !el.classList.contains('open');
    el.classList.toggle('open', willOpen);
    const body = el.querySelector('.acc-body');
    if (willOpen && body) {
      body.innerHTML = Views.accordionBody(moduleId, this.state.researchDimension, Store.getExploredDimensions());
      this.state.openModule = moduleId;
    }
  },

  // === Reading Echoes (阅读共鸣) ===
  newReading() {
    this.state.readingView = 'editor';
    this.state.readingEditId = null;
    this.state.readingSource = 'book';
    this.state.readingAITemp = null;
    this.state.readingImages = [];
    this.route('readings');
  },

  editReading(id) {
    const r = Store.getReading(id);
    if (!r) return;
    this.state.readingView = 'editor';
    this.state.readingEditId = id;
    this.state.readingSource = r.sourceType || 'book';
    this.state.readingAITemp = r.aiAnalysis || null;
    this.state.readingImages = Array.isArray(r.images) ? r.images.slice() : [];
    this.route('readings');
  },

  viewReading(id) {
    const r = Store.getReading(id);
    if (!r) return;
    this.state.readingView = 'detail';
    this.state.readingEditId = id;
    this.route('readings');
  },

  readingBackToList() {
    this.state.readingView = 'list';
    this.state.readingEditId = null;
    this.state.readingAITemp = null;
    this.state.readingImages = [];
    this.route('readings');
  },

  selectSource(source) {
    this.state.readingSource = source;
    document.querySelectorAll('.src-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.source === source);
    });
    const customInput = document.querySelector('[data-field="rd-source-label"]');
    if (customInput) {
      customInput.style.display = source === 'custom' ? '' : 'none';
      if (source !== 'custom') customInput.value = '';
    }
  },

  capturePhoto() {
    const input = document.getElementById('readingPhotoInput');
    if (input) input.click();
  },

  async handleReadingPhotos(files) {
    if (!files || !files.length) return;
    const loading = document.getElementById('ocrLoading');
    const status = document.getElementById('ocrStatus');
    const ai = Store.getSettings().ai || {};
    const aiReady = !!(ai.endpoint && ai.apiKey);
    if (loading) loading.style.display = 'flex';
    let lastText = '';
    let savedCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file || !file.type || !file.type.startsWith('image/')) continue;
        if (status) status.textContent = `识别第 ${i + 1} / ${files.length} 张...`;
        // 单条记录最多保留 6 张图，超出就跳过
        if ((this.state.readingImages || []).length >= 6) {
          this.toast('已达上限 6 张，已停止追加');
          break;
        }
        try {
          const savedImageDataUrl = await this._compressImage(file, 720, 0.7);
          const imageDataUrl = await this._compressImage(file, 1024, 0.8);
          let text = '';
          if (aiReady) {
            try {
              if (status) status.textContent = `AI 识别第 ${i + 1} / ${files.length} 张...`;
              const out = await AIClient.completeWithImage(
                imageDataUrl,
                '请识别图片中的文字内容，只输出纯文本，保持原文格式和换行。如果是中文内容保持中文原文。不要加任何解释、标注或代码块标记。'
              );
              text = (out || '').trim();
            } catch (e) {
              console.warn('AI OCR failed, falling back:', e);
            }
          }
          if (!text) {
            try {
              if (status) status.textContent = `本地识别第 ${i + 1} / ${files.length} 张...`;
              const Tesseract = await this._loadTesseract();
              const result = await Tesseract.recognize(imageDataUrl, 'chi_sim+eng', {
                logger: m => {
                  if (m.status === 'recognizing text' && status) {
                    status.textContent = `识别第 ${i + 1}/${files.length}：${Math.round(m.progress * 100)}%`;
                  }
                }
              });
              text = (result.data.text || '').trim();
            } catch (e) {
              console.warn('Local OCR failed:', e);
            }
          }
          this._appendReadingImage(savedImageDataUrl);
          savedCount++;
          if (text) lastText = text;
        } catch (oneErr) {
          console.error('file failed:', oneErr);
        }
      }
      // 把识别出来的文字填进摘录原文（多张用换行分隔）
      if (lastText) {
        const excerptEl = document.querySelector('[data-field="rd-excerpt"]');
        if (excerptEl) {
          const prev = excerptEl.value.trim();
          excerptEl.value = (prev ? prev + '\n\n' : '') + lastText;
        }
      }
      this.toast(savedCount > 0
        ? `已添加 ${savedCount} 张图片${lastText ? '并识别文字' : ''}`
        : '没有图片被添加');
    } catch (err) {
      console.error('OCR failed:', err);
      this.toast('识别失败：' + err.message + '，请手动输入');
    } finally {
      if (loading) loading.style.display = 'none';
      const input = document.getElementById('readingPhotoInput');
      if (input) input.value = '';
    }
  },

  _appendReadingImage(dataUrl) {
    if (!Array.isArray(this.state.readingImages)) this.state.readingImages = [];
    // 单条记录最多保留 6 张图，避免 localStorage 超限
    if (this.state.readingImages.length >= 6) {
      this.state.readingImages.shift();
    }
    this.state.readingImages.push(dataUrl);
    // 重新渲染缩略图区
    const block = document.querySelector('.rd-images-block');
    if (block) {
      // 找到父级 .card，把整个 block 替换
      const wrap = block.parentElement;
      const tmp = document.createElement('div');
      tmp.innerHTML = Views._readingImagesBlock(this.state.readingImages);
      const newBlock = tmp.firstElementChild;
      wrap.replaceChild(newBlock, block);
    }
  },

  removeReadingImage(idx) {
    if (!Array.isArray(this.state.readingImages)) return;
    if (idx < 0 || idx >= this.state.readingImages.length) return;
    this.state.readingImages.splice(idx, 1);
    const block = document.querySelector('.rd-images-block');
    if (block) {
      const wrap = block.parentElement;
      const tmp = document.createElement('div');
      tmp.innerHTML = Views._readingImagesBlock(this.state.readingImages);
      const newBlock = tmp.firstElementChild;
      wrap.replaceChild(newBlock, block);
    }
  },

  viewReadingImage(src) {
    if (!src) return;
    const modal = document.createElement('div');
    modal.className = 'rd-img-modal';
    modal.setAttribute('data-action', 'close-reading-image');
    modal.innerHTML = `
      <button class="rd-img-close" type="button" data-action="close-reading-image" aria-label="关闭">×</button>
      <img src="${src}" alt="阅读图片">
    `;
    document.body.appendChild(modal);
  },

  closeReadingImage() {
    const modal = document.querySelector('.rd-img-modal');
    if (modal) modal.remove();
  },

  // 语音输入：找到目标 textarea / input，切换录音状态
  toggleVoice(field) {
    if (!Voice.isSupported()) {
      this.toast('当前浏览器不支持语音输入（建议用 Chrome / Safari 16.4+ / Edge）');
      return;
    }
    let textarea;
    if (field === 'gratitude-input') {
      textarea = document.getElementById('gratitudeInput');
    } else {
      textarea = document.querySelector(`[data-field="${field}"]`);
    }
    const btn = document.querySelector(`[data-action="voice-toggle"][data-field="${field}"]`);
    if (!textarea || !btn) return;
    Voice.toggle({ textarea, button: btn });
  },

  _compressImage(file, maxW, quality) {
    maxW = maxW || 1024;
    quality = quality || 0.8;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  },

  _loadTesseract() {
    return new Promise((resolve, reject) => {
      if (window.Tesseract) return resolve(window.Tesseract);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => resolve(window.Tesseract);
      script.onerror = () => reject(new Error('OCR 库加载失败，请检查网络或手动输入'));
      document.head.appendChild(script);
    });
  },

  _fillExcerpt(text) {
    const ta = document.querySelector('[data-field="rd-excerpt"]');
    if (!ta) return;
    if (ta.value.trim()) {
      ta.value = ta.value.trim() + '\n\n' + text;
    } else {
      ta.value = text;
    }
  },

  saveReading() {
    const titleEl = document.querySelector('[data-field="rd-title"]');
    const authorEl = document.querySelector('[data-field="rd-author"]');
    const excerptEl = document.querySelector('[data-field="rd-excerpt"]');
    const resonanceEl = document.querySelector('[data-field="rd-resonance"]');
    const reflectionEl = document.querySelector('[data-field="rd-reflection"]');
    const dimEl = document.querySelector('[data-field="rd-dimension"]');
    const sourceLabelEl = document.querySelector('[data-field="rd-source-label"]');

    if (!titleEl || !titleEl.value.trim()) {
      this.toast('请填写标题');
      return;
    }

    const srcType = this.state.readingSource || 'book';
    const data = {
      sourceType: srcType,
      sourceLabel: srcType === 'custom' ? (sourceLabelEl ? sourceLabelEl.value.trim() : '') : '',
      title: titleEl.value.trim(),
      author: authorEl ? authorEl.value.trim() : '',
      excerpt: excerptEl ? excerptEl.value : '',
      resonance: resonanceEl ? resonanceEl.value : '',
      reflection: reflectionEl ? reflectionEl.value : '',
      relatedDimension: dimEl && dimEl.value ? parseInt(dimEl.value) : null,
      aiAnalysis: this.state.readingAITemp || null,
      images: Array.isArray(this.state.readingImages) ? this.state.readingImages.slice() : []
    };

    if (this.state.readingEditId) {
      Store.updateReading(this.state.readingEditId, data);
      this.toast('共鸣记录已更新');
    } else {
      Store.addReading(data);
      this.toast('共鸣记录已保存');
    }

    this.state.readingView = 'list';
    this.state.readingEditId = null;
    this.state.readingSource = 'book';
    this.state.readingAITemp = null;
    this.state.readingImages = [];
    setTimeout(() => this.route('readings'), 600);
  },

  deleteReading(id) {
    if (!id) return;
    const r = Store.getReadings().find(x => x.id === id);
    const title = r ? (r.title || '无标题') : '这条记录';
    if (!confirm(`确定删除「${title}」吗？此操作不可恢复。`)) return;
    Store.deleteReading(id);
    this.state.readingView = 'list';
    this.state.readingEditId = null;
    this.toast('已删除');
    this.route('readings');
  },

  async aiReadingAnalysis() {
    const excerptEl = document.querySelector('[data-field="rd-excerpt"]');
    const resonanceEl = document.querySelector('[data-field="rd-resonance"]');
    const reflectionEl = document.querySelector('[data-field="rd-reflection"]');
    const titleEl = document.querySelector('[data-field="rd-title"]');
    const dimEl = document.querySelector('[data-field="rd-dimension"]');

    const excerpt = excerptEl ? excerptEl.value.trim() : '';
    const reflection = reflectionEl ? reflectionEl.value.trim() : '';
    const resonance = resonanceEl ? resonanceEl.value.trim() : '';

    if (!excerpt && !reflection) {
      this.toast('请先填写摘录原文或你的感悟');
      return;
    }

    const title = titleEl ? titleEl.value : '';
    const dimId = dimEl && dimEl.value ? parseInt(dimEl.value) : null;
    const dim = dimId ? getDimension(dimId) : null;

    const sourceType = this.state.readingSource || 'book';
    const st = SOURCE_TYPES.find(s => s.id === sourceType);
    const sourceLabelEl = document.querySelector('[data-field="rd-source-label"]');
    const customLabel = sourceType === 'custom' && sourceLabelEl ? sourceLabelEl.value.trim() : '';
    const srcDisplay = st ? (st.id === 'custom' && customLabel ? customLabel : st.label) : sourceType;

    const prompt =
      `你是用户的深度阅读分析助手。用户在阅读中遇到了引起共鸣的文字，并记录了自己的感悟。\n\n` +
      `来源类型: ${srcDisplay}\n标题: ${title}\n` +
      `${dim ? `关联维度: ${dim.name} - ${dim.subtitle}\n` : ''}` +
      `原文摘录:\n${excerpt || '(无)'}\n\n` +
      `最触动用户的点:\n${resonance || '(无)'}\n\n` +
      `用户的感悟:\n${reflection || '(无)'}\n\n` +
      `请输出 JSON（不要 markdown 代码块），结构：\n` +
      `{"analysis":"从心理学和哲学角度分析这段文字为什么可能触动了用户，以及用户的感悟中体现了什么自我认知模式（2-3段，温暖、有洞察力，像懂他的老友那样说）","deepQuestions":["1-2个引导用户深化思考的问题"],"patternNote":"从用户的感悟中发现的认知或情绪模式（一句话）"}`;

    try {
      this.toast('AI 分析中…');
      const content = await AIClient.complete([
        { role: 'system', content: '你是用户的深度阅读分析助手，擅长从文字共鸣中挖掘认知模式。只输出 JSON，不要任何解释文字。' },
        { role: 'user', content: prompt }
      ], { json: true });

      const parsed = JSON.parse(AIClient._clean(content));
      this.state.readingAITemp = {
        analysis: parsed.analysis || '',
        deepQuestions: parsed.deepQuestions || [],
        patternNote: parsed.patternNote || ''
      };

      const container = document.getElementById('aiResultContainer');
      if (container) {
        const a = this.state.readingAITemp;
        container.innerHTML = `
          <div class="rd-ai-result">
            <div class="rd-ai-section">
              <div class="rd-ai-label">深度分析</div>
              <div class="rd-ai-text">${Views._escape(a.analysis)}</div>
            </div>
            ${a.deepQuestions.length ? `
              <div class="rd-ai-section">
                <div class="rd-ai-label">深化思考</div>
                ${a.deepQuestions.map(q => `<div class="rd-ai-question">❓ ${Views._escape(q)}</div>`).join('')}
              </div>` : ''}
            ${a.patternNote ? `
              <div class="rd-ai-section">
                <div class="rd-ai-label">认知模式</div>
                <div class="rd-ai-text">${Views._escape(a.patternNote)}</div>
              </div>` : ''}
          </div>`;
      }
      this.toast('AI 分析完成');
    } catch (err) {
      console.error('aiReadingAnalysis failed:', err);
      this.toast('AI 分析失败：' + err.message);
    }
  },

  // === Vision Board (愿景板) ===
  async handleVisionImages(themeId, files) {
    if (!files || !files.length) return;
    const totalSize = Array.from(files).reduce((s, f) => s + f.size, 0);
    if (totalSize > 12 * 1024 * 1024) {
      this.toast('一次最多 12MB，请分批上传');
      return;
    }
    let added = 0;
    let failed = 0;
    for (const f of files) {
      if (!f.type.startsWith('image/')) { failed++; continue; }
      try {
        const dataUrl = await this._compressImage(f, 800, 0.78);
        Store.addVisionImage(themeId, dataUrl);
        added++;
      } catch (e) {
        console.warn('vision image compress failed:', e);
        failed++;
      }
    }
    if (added > 0) this.toast(`已添加 ${added} 张图${failed ? `（${failed} 张失败）` : ''}`);
    else if (failed > 0) this.toast(`${failed} 张图处理失败`);
    this.route('vision');
  },

  addVisionTheme() {
    const input = document.querySelector('.vb-theme-title');
    const title = (input?.value || '').trim();
    if (title && title !== '未命名主题') {
      Store.addVisionTheme(title);
    } else {
      // 直接新增默认主题
      Store.addVisionTheme('新主题');
    }
    this.toast('新主题已添加');
    this.route('vision');
  },

  deleteVisionTheme(themeId) {
    const board = Store.getVisionBoard();
    const t = board.themes.find(x => x.id === themeId);
    if (!t) return;
    const imgs = (t.images || []).length;
    if (!confirm(`确定删除「${t.title}」主题？${imgs ? `包含的 ${imgs} 张图也会一起删除。` : ''}`)) return;
    Store.deleteVisionTheme(themeId);
    this.toast('主题已删除');
    this.route('vision');
  },

  toggleVisionNote(themeId) {
    const card = document.querySelector(`[data-theme-id="${themeId}"]`);
    if (!card) return;
    const ta = card.querySelector('.vb-note-input');
    if (!ta) return;
    ta.style.display = ta.style.display === 'none' ? 'block' : 'none';
    if (ta.style.display === 'block') ta.focus();
  },

  openVisionImage(themeId, idx) {
    const board = Store.getVisionBoard();
    const t = board.themes.find(x => x.id === themeId);
    if (!t || !t.images || !t.images[idx]) return;
    const modal = document.getElementById('visionModal');
    const img = document.getElementById('visionModalImg');
    const cap = document.getElementById('visionModalCaption');
    if (!modal || !img) return;
    this._modalCtx = { themeId, idx };
    img.src = t.images[idx];
    cap.textContent = `${t.title} · ${idx + 1}/${t.images.length}`;
    modal.style.display = 'flex';
  },

  closeVisionModal() {
    const modal = document.getElementById('visionModal');
    if (modal) modal.style.display = 'none';
    this._modalCtx = null;
  },

  deleteVisionImageFromModal() {
    if (!this._modalCtx) return;
    const { themeId, idx } = this._modalCtx;
    const board = Store.getVisionBoard();
    const t = board.themes.find(x => x.id === themeId);
    if (!t || !t.images || !t.images[idx]) return;
    if (!confirm('删除这张图？')) return;
    Store.removeVisionImage(themeId, idx);
    this.toast('已删除');
    this.closeVisionModal();
    this.route('vision');
  },

  deleteVisionImageHandler(themeId, idx, e) {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    if (!confirm('删除这张图？')) return;
    Store.removeVisionImage(themeId, idx);
    this.route('vision');
  },

  // === Data Management ===
  exportData() {
    const data = Store.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    // 文件名带时间戳，避免同一天多次导出互相覆盖
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `self-research-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast('数据已导出，把 .json 文件传到另一台设备后用「导入」恢复');
  },

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          // 统计即将导入的数据量，让用户心里有数
          const stats = this._summarizeImport(data);
          // 导入前确认，防止误操作覆盖本机新数据
          const ok = confirm(
            `即将导入备份文件：\n\n` +
            `  · 打卡记录：${stats.checkins} 条\n` +
            `  · 维度研究：${stats.dimensions} 个\n` +
            `  · 阅读共鸣：${stats.readings} 条\n` +
            `  · 愿景主题：${stats.themes} 个\n` +
            `  · 时间线事件：${stats.timeline} 条\n\n` +
            `⚠️ 这会覆盖本机当前的所有数据。\n\n` +
            `确定继续吗？`
          );
          if (!ok) return;
          if (Store.importAll(data)) {
            this.toast(`导入成功：${stats.checkins} 条打卡、${stats.dimensions} 个维度、${stats.readings} 条共鸣`);
            this.route('dashboard');
          } else {
            this.toast('导入失败：文件格式不正确（版本不匹配）');
          }
        } catch (err) {
          this.toast('导入失败：文件解析错误，请确认是本应用导出的 JSON 文件');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },

  _summarizeImport(data) {
    if (!data) return { checkins: 0, dimensions: 0, readings: 0, themes: 0, timeline: 0 };
    return {
      checkins: Array.isArray(data.checkins) ? data.checkins.length : 0,
      dimensions: data.dimensions && typeof data.dimensions === 'object' ? Object.keys(data.dimensions).length : 0,
      readings: Array.isArray(data.readings) ? data.readings.length : 0,
      themes: data.visionBoard && Array.isArray(data.visionBoard.themes) ? data.visionBoard.themes.length : 0,
      timeline: Array.isArray(data.timeline) ? data.timeline.length : 0
    };
  },

  resetData() {
    if (confirm('确定要重置所有数据吗？此操作不可恢复。')) {
      Store.resetAll();
      this.toast('数据已重置');
      this.route('dashboard');
    }
  },

  restoreBackup() {
    const info = Store.getBackupInfo();
    if (!info) {
      this.toast('没有可用的自动备份');
      return;
    }
    const dateStr = new Date(info.backupAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (confirm(
      `即将从自动备份恢复数据：\n\n` +
      `  · 备份时间：${dateStr}\n` +
      `  · 打卡记录：${info.checkins} 条\n` +
      `  · 维度研究：${info.dimensions} 个\n` +
      `  · 阅读共鸣：${info.readings} 条\n\n` +
      `⚠️ 这会覆盖本机当前的所有数据。\n\n确定继续吗？`
    )) {
      if (Store.restoreFromBackup()) {
        this.toast('已从自动备份恢复数据');
        this.route('dashboard');
      } else {
        this.toast('恢复失败，备份文件已损坏');
      }
    }
  },

  // === PWA ===
  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.warn('SW registration failed:', err);
      });
    }
  },

  installPWA() {
    if (this.state.deferredPrompt) {
      this.state.deferredPrompt.prompt();
      this.state.deferredPrompt.userChoice.then(() => {
        this.state.deferredPrompt = null;
      });
    } else {
      this.toast('请使用 Chrome 或 Edge 浏览器打开，点击地址栏右侧的安装按钮');
    }
  },

  // === Mobile Sidebar ===
  toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  },

  closeSidebar() {
    document.getElementById('sidebar').classList.remove('show');
    document.getElementById('sidebarOverlay').classList.remove('show');
  },

  // === Toast ===
  toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  }
};

// === Boot ===
document.addEventListener('DOMContentLoaded', () => App.init());
