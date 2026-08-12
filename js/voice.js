/**
 * Voice — 全局语音转文字模块（webkitSpeechRecognition）
 *
 * - 仅 Chrome / Edge / Safari 16.4+ 支持
 * - 必须 HTTPS 或 localhost
 * - 需要用户授权麦克风
 *
 * 使用方式：
 *   Voice.toggle({ textarea, button });   // 切换录音状态
 *   Voice.isSupported();                 // 检查是否可用
 */

const Voice = {
  // 单例：同一时间只允许一个录制
  _active: null,

  isSupported() {
    return typeof window !== 'undefined'
      && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  },

  /**
   * 切换某个 textarea 的录音状态。
   * @param {{textarea: HTMLTextAreaElement|HTMLInputElement, button: HTMLElement}} opts
   */
  toggle(opts) {
    if (!this.isSupported()) {
      if (window.App && App.toast) App.toast('当前浏览器不支持语音输入（建议用 Chrome / Safari 16.4+ / Edge）');
      return;
    }
    const { textarea, button } = opts;
    if (!textarea || !button) return;

    // 如果已经在录别的目标 → 先关掉
    if (this._active && this._active.textarea !== textarea) {
      this._stop(this._active);
    }

    if (this._active && this._active.textarea === textarea) {
      this._stop(this._active);
      return;
    }

    this._start(textarea, button);
  },

  _start(textarea, button) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = (navigator.language || 'zh-CN').startsWith('zh') ? 'zh-CN' : 'en-US';
    rec.continuous = true;     // 持续识别
    rec.interimResults = true; // 边说边出结果
    rec.maxAlternatives = 1;

    let finalTranscript = textarea.value;
    // 如果已有内容且末尾不是空格，加个空格再接
    if (finalTranscript && !finalTranscript.endsWith(' ') && !finalTranscript.endsWith('\n')) {
      finalTranscript += ' ';
    }

    rec.onstart = () => {
      this._active = { textarea, button, rec, baseValue: textarea.value };
      button.classList.add('recording');
      button.setAttribute('data-state', 'recording');
      button.title = '正在录音，点击停止';
      if (window.App && App.toast) App.toast('🎤 正在录音…再次点击按钮停止', 2000);
    };

    rec.onresult = (event) => {
      let interim = '';
      let finalAppend = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalAppend += transcript;
        } else {
          interim += transcript;
        }
      }
      if (finalAppend) {
        finalTranscript += finalAppend;
      }
      // 同步到 textarea
      textarea.value = finalTranscript + interim;
      // 触发 input 事件，让现有的 input 监听能感知
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    };

    rec.onerror = (event) => {
      const errMap = {
        'not-allowed': '麦克风权限被拒绝',
        'no-speech': '没检测到语音',
        'audio-capture': '没有可用的麦克风',
        'network': '网络错误（语音识别需要联网）',
        'aborted': '录音已取消'
      };
      const msg = errMap[event.error] || ('识别错误：' + event.error);
      if (window.App && App.toast) App.toast(msg);
      this._stop({ textarea, button, rec });
    };

    rec.onend = () => {
      // 录音结束 → 复位按钮
      if (this._active && this._active.rec === rec) {
        this._active = null;
        button.classList.remove('recording');
        button.removeAttribute('data-state');
        button.title = '点击开始录音（再次点击停止）';
      }
    };

    try {
      rec.start();
    } catch (e) {
      if (window.App && App.toast) App.toast('启动录音失败：' + e.message);
    }
  },

  _stop(ctx) {
    try {
      if (ctx && ctx.rec) ctx.rec.stop();
    } catch (e) { /* ignore */ }
  },

  /**
   * 路由切换或页面卸载时调用：关掉当前录音。
   */
  cancel() {
    if (this._active) this._stop(this._active);
  }
};

// 卸载页面 / 切路由时自动停
window.addEventListener('beforeunload', () => Voice.cancel());
window.addEventListener('pagehide', () => Voice.cancel());