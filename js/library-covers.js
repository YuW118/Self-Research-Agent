/**
 * 书籍封面存储模块（LibCovers）
 *
 * 设计目标：
 *   - 图片二进制存放在 IndexedDB（避免 5MB 大图直接写进 localStorage 撑爆配额）
 *   - 书籍记录只保存一个布尔标记 cover:true，真正的图片按 bookId 索引
 *   - 对外暴露 getCached(bookId) 做同步读取（需在 preload 之后）
 *   - 兼容无 IndexedDB 的极端环境：回退到 localStorage 的 data URL 映射
 *
 * 接口（均返回 Promise，除 getCached/setCached/clearCache 同步）：
 *   init()            打开/升级数据库
 *   put(bookId, src)  src 可为 Blob/File/DataURL，存入并刷新内存缓存
 *   get(bookId)      返回 data URL（Promise）
 *   has(bookId)      是否存在（Promise<boolean>）
 *   remove(bookId)   删除
 *   preload()        一次性把所有封面读入内存缓存
 *   getCached(id)    同步读取缓存（无则 null）
 *   setCached(id,url)/clearCache()
 */
const LibCovers = (function () {
  'use strict';

  const DB_NAME = 'sr_library_covers';
  const STORE = 'covers';
  const VERSION = 1;
  const LS_KEY = 'sr_library_bookCover'; // fallback：localStorage 的 id->dataUrl 映射

  let dbPromise = null;
  let usingIDB = true;
  const cache = new Map(); // bookId -> dataUrl

  /* ---------- 底层：打开数据库 ---------- */
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window) || !window.indexedDB) {
        usingIDB = false;
        reject(new Error('no-indexeddb'));
        return;
      }
      let req;
      try {
        req = window.indexedDB.open(DB_NAME, VERSION);
      } catch (e) {
        usingIDB = false;
        reject(e);
        return;
      }
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => { usingIDB = false; reject(req.error); };
    });
    return dbPromise;
  }

  /* ---------- 事务包装：保证事务生命周期正确 ---------- */
  function withStore(mode, fn) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const txn = db.transaction(STORE, mode);
      const store = txn.objectStore(STORE);
      let result;
      Promise.resolve(fn(store)).then(r => { result = r; }).catch(reject);
      txn.oncomplete = () => resolve(result);
      txn.onerror = () => reject(txn.error);
      txn.onabort = () => reject(txn.error);
    }));
  }

  /* ---------- data URL <-> Blob ---------- */
  function dataUrlToBlob(dataUrl) {
    const idx = dataUrl.indexOf(',');
    const head = dataUrl.slice(0, idx);
    const body = dataUrl.slice(idx + 1);
    const mime = (head.match(/:(.*?);/) || [null, 'image/png'])[1];
    const bin = atob(body);
    const len = bin.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }

  function normalizeSource(src) {
    if (typeof src === 'string' && src.indexOf('data:') === 0) return dataUrlToBlob(src);
    return src; // Blob / File
  }

  /* ---------- 内存缓存辅助（fallback 模式） ---------- */
  function lsMap() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function lsSet(map) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(map)); } catch (e) { /* 容量满则忽略 */ }
  }

  /* ---------- 公开接口 ---------- */
  function put(bookId, src) {
    const blob = normalizeSource(src);
    if (!usingIDB) {
      // fallback：直接存 data URL 到 localStorage
      return blobToDataUrl(blob).then(url => {
        const m = lsMap(); m[bookId] = url; lsSet(m); cache.set(bookId, url); return url;
      });
    }
    return withStore('readwrite', (store) => new Promise((resolve, reject) => {
      const rec = { id: bookId, blob, type: blob.type, size: blob.size, updatedAt: Date.now() };
      const r = store.put(rec);
      r.onsuccess = () => resolve();
      r.onerror = () => reject(r.error);
    })).then(() => blobToDataUrl(blob)).then(url => { cache.set(bookId, url); return url; });
  }

  function get(bookId) {
    if (!usingIDB) {
      const m = lsMap();
      const url = m[bookId] || null;
      if (url) cache.set(bookId, url); else cache.delete(bookId);
      return Promise.resolve(url);
    }
    return withStore('readonly', (store) => new Promise((resolve, reject) => {
      const r = store.get(bookId);
      r.onsuccess = () => resolve(r.result || null);
      r.onerror = () => reject(r.error);
    })).then(rec => {
      if (!rec) { cache.delete(bookId); return null; }
      return blobToDataUrl(rec.blob).then(url => { cache.set(bookId, url); return url; });
    });
  }

  function has(bookId) {
    if (!usingIDB) return Promise.resolve(!!lsMap()[bookId]);
    return withStore('readonly', (store) => new Promise((resolve, reject) => {
      const r = store.getKey(bookId);
      r.onsuccess = () => resolve(!!r.result);
      r.onerror = () => reject(r.error);
    }));
  }

  function remove(bookId) {
    cache.delete(bookId);
    if (!usingIDB) {
      const m = lsMap(); delete m[bookId]; lsSet(m); return Promise.resolve();
    }
    return withStore('readwrite', (store) => new Promise((resolve, reject) => {
      const r = store.delete(bookId);
      r.onsuccess = () => resolve();
      r.onerror = () => reject(r.error);
    }));
  }

  function preload() {
    if (!usingIDB) {
      const m = lsMap();
      Object.keys(m).forEach(k => cache.set(k, m[k]));
      return Promise.resolve(cache.size);
    }
    return openDB().then(db => new Promise((resolve) => {
      const txn = db.transaction(STORE, 'readonly');
      const req = txn.objectStore(STORE).getAll();
      req.onsuccess = () => {
        const items = req.result || [];
        let pending = items.length;
        if (!pending) return resolve(0);
        items.forEach(it => {
          blobToDataUrl(it.blob).then(url => { cache.set(it.id, url); })
            .catch(() => {})
            .then(() => { if (--pending === 0) resolve(cache.size); });
        });
      };
      req.onerror = () => resolve(0);
    })).catch(() => 0);
  }

  function getCached(bookId) { return cache.get(bookId) || null; }
  function setCached(bookId, url) { if (url) cache.set(bookId, url); else cache.delete(bookId); }
  function clearCache() { cache.clear(); }
  function isUsingIDB() { return usingIDB; }

  return {
    init: openDB,
    put, get, has, remove, preload,
    getCached, setCached, clearCache, isUsingIDB,
    dataUrlToBlob
  };
})();
