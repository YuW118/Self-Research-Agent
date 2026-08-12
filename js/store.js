/**
 * Self-Research Agent - 数据存储层
 * 基于 localStorage 的本地持久化
 */

const Store = {
  KEYS: {
    checkins: 'sr_checkins',
    dimensions: 'sr_dimensions',
    triggers: 'sr_triggers',
    patterns: 'sr_patterns',
    timeline: 'sr_timeline',
    settings: 'sr_settings',
    startedAt: 'sr_startedAt',
    readings: 'sr_readings',
    visionBoard: 'sr_visionBoard',
    backup: 'sr_autoBackup'
  },

  // 愿景板默认空——用户自己添加主题

  _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },

  _write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage write failed:', e);
      return false;
    }
  },

  init() {
    if (!localStorage.getItem(this.KEYS.startedAt)) {
      this._write(this.KEYS.startedAt, new Date().toISOString());
      this._write(this.KEYS.checkins, []);
      this._write(this.KEYS.dimensions, {});
      this._write(this.KEYS.triggers, []);
      this._write(this.KEYS.patterns, []);
      this._write(this.KEYS.timeline, [{
        id: this._uuid(),
        date: new Date().toISOString().slice(0, 10),
        type: 'start',
        title: '启动 Self-Research 计划',
        description: '开始系统研究自己的20个维度',
        relatedDimensions: []
      }]);
      this._write(this.KEYS.settings, { theme: 'morandi' });
      this._write(this.KEYS.readings, []);
      this._write(this.KEYS.visionBoard, { themes: [] });
    }
    // 迁移前先自动备份（防止迁移出 bug 导致数据丢失）
    this._autoBackup();
    // 数据迁移：把 pre-v17 的维度数据（没有 history 数组）安全升级
    this._migrateDimensions();
  },

  // 自动备份：每次启动时把全部数据存一份到 sr_autoBackup（只保留最新一份）
  _autoBackup() {
    try {
      const dump = {};
      Object.values(this.KEYS).forEach(k => {
        if (k === this.KEYS.backup) return;
        const raw = localStorage.getItem(k);
        if (raw) dump[k] = raw;  // 保留原始 JSON 字符串
      });
      dump.__backupAt = new Date().toISOString();
      localStorage.setItem(this.KEYS.backup, JSON.stringify(dump));
    } catch (e) {
      console.warn('Auto-backup failed:', e);
    }
  },

  // 从自动备份恢复
  restoreFromBackup() {
    try {
      const raw = localStorage.getItem(this.KEYS.backup);
      if (!raw) return false;
      const dump = JSON.parse(raw);
      Object.keys(dump).forEach(k => {
        if (k.startsWith('__')) return;
        localStorage.setItem(k, dump[k]);  // 恢复原始 JSON 字符串
      });
      return true;
    } catch (e) {
      console.error('Restore from backup failed:', e);
      return false;
    }
  },

  hasBackup() {
    try {
      const raw = localStorage.getItem(this.KEYS.backup);
      if (!raw) return false;
      const dump = JSON.parse(raw);
      return !!(dump.__backupAt);
    } catch (e) {
      return false;
    }
  },

  getBackupInfo() {
    try {
      const raw = localStorage.getItem(this.KEYS.backup);
      if (!raw) return null;
      const dump = JSON.parse(raw);
      const backupAt = dump.__backupAt || '未知时间';
      let checkins = 0, dimensions = 0, readings = 0;
      try { checkins = JSON.parse(dump[this.KEYS.checkins] || '[]').length; } catch(e) {}
      try { dimensions = Object.keys(JSON.parse(dump[this.KEYS.dimensions] || '{}')).length; } catch(e) {}
      try { readings = JSON.parse(dump[this.KEYS.readings] || '[]').length; } catch(e) {}
      return { backupAt, checkins, dimensions, readings };
    } catch (e) {
      return null;
    }
  },

  _migrateDimensions() {
    const all = this._read(this.KEYS.dimensions, {});
    let changed = false;
    Object.keys(all).forEach(k => {
      const d = all[k];
      // pre-v17 数据没有 history 数组 → 从现有 answers/insight 补一份快照（不删除！）
      if (!Array.isArray(d.history)) {
        const hasContent = d.answers && Object.values(d.answers).some(a => a && a.trim());
        if (hasContent) {
          d.history = [{
            date: d.updatedAt || new Date().toISOString(),
            answers: d.answers,
            insight: d.insight || '',
            confidence: d.confidence || 0
          }];
        } else {
          // 真正的空数据（没回答、没洞察、没历史）才清除
          delete all[k];
        }
        changed = true;
      }
    });
    if (changed) this._write(this.KEYS.dimensions, all);
  },

  _uuid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },

  getStartedAt() {
    return this._read(this.KEYS.startedAt, new Date().toISOString());
  },

  getDaysSinceStart() {
    const start = new Date(this.getStartedAt());
    const now = new Date();
    return Math.floor((now - start) / 86400000) + 1;
  },

  // === Check-ins ===
  getCheckins() {
    return this._read(this.KEYS.checkins, []);
  },

  getCheckin(date) {
    return this.getCheckins().find(c => c.date === date);
  },

  getTodayCheckin() {
    return this.getCheckin(this._today());
  },

  saveCheckin(data) {
    const checkins = this.getCheckins();
    const date = data.date || this._today();
    const idx = checkins.findIndex(c => c.date === date);
    const record = { ...data, date, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      checkins[idx] = { ...checkins[idx], ...record };
    } else {
      checkins.push(record);
    }
    this._write(this.KEYS.checkins, checkins);
    return record;
  },

  deleteCheckin(date) {
    const checkins = this.getCheckins();
    const filtered = checkins.filter(c => c.date !== date);
    this._write(this.KEYS.checkins, filtered);
    return filtered;
  },

  getRecentCheckins(days) {
    const checkins = this.getCheckins();
    return checkins.slice(-days).reverse();
  },

  // === Dimensions ===
  getDimensionData(dimId) {
    const all = this._read(this.KEYS.dimensions, {});
    return all[dimId] || null;
  },

  getAllDimensionData() {
    return this._read(this.KEYS.dimensions, {});
  },

  saveDimensionData(dimId, data) {
    const all = this._read(this.KEYS.dimensions, {});
    const prev = all[dimId];
    const now = new Date().toISOString();

    let history = Array.isArray(prev?.history) ? prev.history.slice() : [];

    // 把当前（含首次保存）的状态归档到历史快照，让用户随时能看到历史记录
    // 同一日多次保存都各自保留一份（不去重），用户能看到每次提交的版本
    const hasContent = Object.values(data.answers || {}).some(a => a && a.trim());
    if (hasContent) {
      const snapshot = {
        date: now,
        answers: { ...(data.answers || {}) },
        insight: data.insight || '',
        confidence: data.confidence || 0
      };
      history.unshift(snapshot);
      history = history.slice(0, 30);  // 最多保留 30 份
    }

    all[dimId] = {
      dimensionId: dimId,
      answers: data.answers || {},
      insight: data.insight || '',
      confidence: data.confidence || 0,
      history,
      updatedAt: now
    };
    this._write(this.KEYS.dimensions, all);
    return all[dimId];
  },

  getDimensionHistory(dimId) {
    const d = this.getDimensionData(dimId);
    return d?.history || [];
  },

  getDimensionSnapshot(dimId, idx) {
    const hist = this.getDimensionHistory(dimId);
    if (typeof idx === 'number') return hist[idx] || null;
    // 兼容旧调用：按 dateKey 字符串取第一条
    return hist.find(h => (h.date || '').slice(0, 10) === idx) || null;
  },

  // 原地覆盖某 idx 的历史快照（不新增、不 unshift），用于「修改历史快照」
  updateDimensionSnapshot(dimId, idx, data) {
    const all = this._read(this.KEYS.dimensions, {});
    const prev = all[dimId];
    if (!prev) return null;
    const hist = Array.isArray(prev.history) ? prev.history.slice() : [];
    if (typeof idx !== 'number' || idx < 0 || idx >= hist.length) return null;
    const now = new Date().toISOString();
    hist[idx] = {
      date: hist[idx].date || now,
      answers: { ...(hist[idx].answers || {}), ...(data.answers || {}) },
      insight: data.insight ?? hist[idx].insight ?? '',
      confidence: typeof data.confidence === 'number' ? data.confidence : (hist[idx].confidence || 0),
      editedAt: now,
      originalDate: hist[idx].originalDate || hist[idx].date
    };
    all[dimId] = { ...prev, history: hist, updatedAt: now };
    this._write(this.KEYS.dimensions, all);
    return hist[idx];
  },

  // 删除某 idx 的历史快照；如果所有快照都被删完，等同于重置该维度（主数据 + 已探索标记一起清空）
  deleteDimensionSnapshot(dimId, idx) {
    const all = this._read(this.KEYS.dimensions, {});
    const prev = all[dimId];
    if (!prev) return null;
    const hist = Array.isArray(prev.history) ? prev.history.slice() : [];
    if (typeof idx !== 'number' || idx < 0 || idx >= hist.length) return null;
    const removed = hist.splice(idx, 1)[0];
    const now = new Date().toISOString();

    if (hist.length === 0) {
      // 所有快照都删完了 → 整个维度重置：自我画像、统计也跟着消失
      delete all[dimId];
    } else {
      all[dimId] = { ...prev, history: hist, updatedAt: now };
    }
    this._write(this.KEYS.dimensions, all);
    return removed;
  },

  getExploredDimensions() {
    const all = this._read(this.KEYS.dimensions, {});
    return Object.keys(all).filter(k => {
      const d = all[k];
      return d.answers && Object.values(d.answers).some(a => a && a.trim().length > 0);
    }).map(Number);
  },

  // === Triggers ===
  getTriggers() {
    return this._read(this.KEYS.triggers, []);
  },

  addTrigger(trigger) {
    const triggers = this.getTriggers();
    triggers.push({ ...trigger, id: this._uuid(), timestamp: new Date().toISOString() });
    this._write(this.KEYS.triggers, triggers);
    return trigger;
  },

  // === Patterns ===
  getPatterns() {
    return this._read(this.KEYS.patterns, []);
  },

  addPattern(pattern) {
    const patterns = this.getPatterns();
    patterns.push({ ...pattern, id: this._uuid(), createdAt: new Date().toISOString() });
    this._write(this.KEYS.patterns, patterns);
    return pattern;
  },

  // === Timeline ===
  getTimeline() {
    return this._read(this.KEYS.timeline, []).sort((a, b) => b.date.localeCompare(a.date));
  },

  addTimelineEvent(event) {
    const timeline = this._read(this.KEYS.timeline, []);
    timeline.push({ ...event, id: this._uuid() });
    this._write(this.KEYS.timeline, timeline);
    return event;
  },

  deleteTimelineEvent(id) {
    const timeline = this._read(this.KEYS.timeline, []);
    this._write(this.KEYS.timeline, timeline.filter(e => e.id !== id));
  },

  // === Readings (阅读共鸣) ===
  getReadings() {
    return this._read(this.KEYS.readings, []).sort((a, b) =>
      (b.createdAt || '').localeCompare(a.createdAt || '')
    );
  },

  getReading(id) {
    return this.getReadings().find(r => r.id === id) || null;
  },

  addReading(data) {
    const readings = this._read(this.KEYS.readings, []);
    const reading = {
      ...data,
      id: this._uuid(),
      createdAt: new Date().toISOString()
    };
    readings.push(reading);
    this._write(this.KEYS.readings, readings);
    return reading;
  },

  updateReading(id, data) {
    const readings = this._read(this.KEYS.readings, []);
    const idx = readings.findIndex(r => r.id === id);
    if (idx >= 0) {
      readings[idx] = { ...readings[idx], ...data, updatedAt: new Date().toISOString() };
      this._write(this.KEYS.readings, readings);
      return readings[idx];
    }
    return null;
  },

  deleteReading(id) {
    const readings = this._read(this.KEYS.readings, []);
    this._write(this.KEYS.readings, readings.filter(r => r.id !== id));
  },

  // === Vision Board (愿景板) ===
  getVisionBoard() {
    const board = this._read(this.KEYS.visionBoard, null);
    if (!board || !Array.isArray(board.themes)) {
      const empty = { themes: [] };
      this._write(this.KEYS.visionBoard, empty);
      return empty;
    }
    return board;
  },

  addVisionTheme(title) {
    const board = this.getVisionBoard();
    const theme = {
      id: this._uuid(),
      title: (title || '新主题').trim().slice(0, 24),
      images: [],
      note: '',
      order: board.themes.length,
      createdAt: new Date().toISOString()
    };
    board.themes.push(theme);
    this._write(this.KEYS.visionBoard, board);
    return theme;
  },

  updateVisionTheme(id, patch) {
    const board = this.getVisionBoard();
    const idx = board.themes.findIndex(t => t.id === id);
    if (idx >= 0) {
      board.themes[idx] = { ...board.themes[idx], ...patch, updatedAt: new Date().toISOString() };
      this._write(this.KEYS.visionBoard, board);
      return board.themes[idx];
    }
    return null;
  },

  deleteVisionTheme(id) {
    const board = this.getVisionBoard();
    board.themes = board.themes.filter(t => t.id !== id);
    this._write(this.KEYS.visionBoard, board);
  },

  addVisionImage(themeId, dataUrl) {
    const board = this.getVisionBoard();
    const t = board.themes.find(x => x.id === themeId);
    if (!t) return null;
    t.images = t.images || [];
    t.images.push(dataUrl);
    t.updatedAt = new Date().toISOString();
    this._write(this.KEYS.visionBoard, board);
    return t;
  },

  removeVisionImage(themeId, imageIdx) {
    const board = this.getVisionBoard();
    const t = board.themes.find(x => x.id === themeId);
    if (!t || !t.images) return null;
    t.images.splice(imageIdx, 1);
    t.updatedAt = new Date().toISOString();
    this._write(this.KEYS.visionBoard, board);
    return t;
  },

  getVisionImageCount() {
    const board = this.getVisionBoard();
    return board.themes.reduce((sum, t) => sum + (t.images ? t.images.length : 0), 0);
  },

  // === Settings ===
  getSettings() {
    return this._read(this.KEYS.settings, { theme: 'morandi' });
  },

  updateSettings(updates) {
    const settings = { ...this.getSettings(), ...updates };
    this._write(this.KEYS.settings, settings);
    return settings;
  },

  // === Export / Import ===
  exportAll() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      startedAt: this.getStartedAt(),
      checkins: this.getCheckins(),
      dimensions: this.getAllDimensionData(),
      triggers: this.getTriggers(),
      patterns: this.getPatterns(),
      timeline: this._read(this.KEYS.timeline, []),
      readings: this.getReadings(),
      visionBoard: this.getVisionBoard(),
      settings: this.getSettings()
    };
  },

  importAll(data) {
    if (!data || data.version !== 1) return false;
    this._write(this.KEYS.startedAt, data.startedAt || new Date().toISOString());
    this._write(this.KEYS.checkins, data.checkins || []);
    this._write(this.KEYS.dimensions, data.dimensions || {});
    this._write(this.KEYS.triggers, data.triggers || []);
    this._write(this.KEYS.patterns, data.patterns || []);
    this._write(this.KEYS.timeline, data.timeline || []);
    this._write(this.KEYS.readings, data.readings || []);
    this._write(this.KEYS.visionBoard, data.visionBoard || this.getVisionBoard());
    this._write(this.KEYS.settings, data.settings || { theme: 'morandi' });
    return true;
  },

  resetAll() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    this.init();
  },

  // === Stats ===
  getStats() {
    const checkins = this.getCheckins();
    const explored = this.getExploredDimensions();
    const patterns = this.getPatterns();
    const timeline = this.getTimeline();
    return {
      daysSinceStart: this.getDaysSinceStart(),
      totalCheckins: checkins.length,
      exploredCount: explored.length,
      totalDimensions: 20,
      patternCount: patterns.length,
      timelineCount: timeline.length,
      readingCount: this.getReadings().length,
      visionImageCount: this.getVisionImageCount(),
      visionThemeCount: this.getVisionBoard().themes.length,
      hasTodayCheckin: !!this.getTodayCheckin()
    };
  },

  // === Helpers ===
  _today() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
};
