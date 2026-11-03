/* Progress storage. Backend is swappable: LocalBackend now, a cloud backend later
   (implement the same load()/save(data) interface and set MEA.Store.backend). */
(function (MEA) {
  'use strict';
  const KEY = 'malik-english-adventures.v1';

  const LocalBackend = {
    name: 'local',
    load() { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { this.broken = true; return null; } },
    save(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { this.broken = true; return false; } }
  };

  function fresh() {
    return {
      version: 1, created: Date.now(), xp: 0,
      results: {},      // "3a/n1" → {status, best, last, attempts, updated, mistakes:[]}
      sessions: {},     // in-progress exercise snapshots for resume
      practise: {},     // key → {label, answer, mode, prompt, ru, art, audio, errors, streak, added}
      cleared: 0,       // words removed from Words to Practise
      badges: {}, stamps: {},
      stats: { typedFirstTry: 0, itemsCorrect: 0, itemsTotal: 0 },
      last: null,       // {lesson, ex}
      writing: {},      // exercise key → text
      assigned: [],     // teacher's picks: exercise keys
      settings: { voice: null, rate: 0.9, teacher: false, noticeSeen: false }
    };
  }

  const Store = {
    backend: LocalBackend, data: null, available: true,
    load() {
      const d = this.backend.load();
      this.data = Object.assign(fresh(), d || {});
      this.data.settings = Object.assign(fresh().settings, (d && d.settings) || {});
      this.data.stats = Object.assign(fresh().stats, (d && d.stats) || {});
      this.available = !this.backend.broken;
      return this.data;
    },
    save() { const ok = this.backend.save(this.data); if (!ok) this.available = false; return ok; },
    reset() { this.data = fresh(); this.save(); },
    exportJSON() { return JSON.stringify(this.data); },
    importJSON(text) {
      const d = JSON.parse(text);
      if (!d || typeof d !== 'object' || !d.results) throw new Error('bad');
      this.data = Object.assign(fresh(), d); this.save();
    },
    result(key) { return this.data.results[key] || null; },
    setResult(key, patch) { this.data.results[key] = Object.assign({}, this.data.results[key] || {}, patch, { updated: Date.now() }); this.save(); },

    /* ---- Words to Practise ---- */
    noteError(item) {
      if (!item || !item.pkey) return;
      const p = this.data.practise[item.pkey] || { errors: 0, streak: 0, added: false };
      Object.assign(p, { label: item.plabel || item.answerText, answer: item.answerText, mode: item.mode || 'word', ru: item.ru || '', art: item.art || null, audio: item.audioText || null });
      p.errors += 1; p.streak = 0;
      if (p.errors >= 2 || item.revealed) p.added = true;
      this.data.practise[item.pkey] = p; this.save();
    },
    noteCorrect(pkey, firstTry, inReview) {
      const p = this.data.practise[pkey]; if (!p || !p.added) return false;
      if (firstTry) p.streak += 1; else p.streak = 0;
      const need = inReview ? 2 : 3;
      if (p.streak >= need) { delete this.data.practise[pkey]; this.data.cleared += 1; this.save(); return true; }
      this.save(); return false;
    },
    practiseList() { return Object.entries(this.data.practise).filter(([, p]) => p.added).map(([k, p]) => Object.assign({ key: k }, p)); },
    weakKeys(prefix) { return this.practiseList().filter((p) => p.key.startsWith(prefix)).map((p) => p.key); }
  };
  MEA.Store = Store;
})(window.MEA = window.MEA || {});
