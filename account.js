/* ===== Optional accounts =====
   Web (GitHub Pages): Firebase Authentication (email + password) + Firestore, only when
   window.FIREBASE_CONFIG is set (see SETUP-FIREBASE.md). Passwords never touch this code's
   storage: Firebase Auth stores them hashed (scrypt) on Google's servers.
   Inside claude.ai: the viewer's Claude account; progress syncs through the artifact db when allowed. */
(function () {
  const APP = window.ACCT_APP || 'scales';             /* 'scales' | 'stats' */
  const cfg = window.FIREBASE_CONFIG || null;
  const OTHER = APP === 'scales' ? 'stats' : 'scales';
  const st = { mode: 'none', user: null, ready: false, fb: null, db: null, lbOptIn: true, verified: false, name: '', failures: 0, lockUntil: 0, claudeDb: null, claudeUid: null, claudeName: '' };
  const h = s => (typeof esc === 'function' ? esc(s) : String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  const getS = () => window.ACCT_HOOKS.get(), setS = x => window.ACCT_HOOKS.set(x), changed = () => window.ACCT_HOOKS.changed();
  const week7 = s => { let t = 0; for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); t += (s.hist && s.hist[k]) || 0; } return t; };

  /* ---------- loading the vendored SDK (same-origin files, pinned 10.12.2) ---------- */
  function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.async = false; s.onload = res; s.onerror = () => rej(new Error('load ' + src)); document.head.appendChild(s); }); }

  /* ---------- email action links (verify email / reset password) handled inside the site ----------
     Works when the Firebase email templates use this site as the custom action URL, and also as the continue URL. */
  const acs = () => ({ url: location.origin + location.pathname + '#account' });
  async function sendVer(user) { try { await user.sendEmailVerification(acs()); } catch (e) { if (/continue-uri|unauthorized-domain/.test(e && e.code || '')) await user.sendEmailVerification(); else throw e; } }
  async function sendReset(auth, em) { try { await auth.sendPasswordResetEmail(em, acs()); } catch (e) { if (/continue-uri|unauthorized-domain/.test(e && e.code || '')) await auth.sendPasswordResetEmail(em); else throw e; } }
  function actionBox(html) { const d = document.createElement('div'); d.setAttribute('role', 'dialog'); d.style.cssText = 'position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(0,0,0,.45);padding:16px'; d.innerHTML = '<div style="background:var(--surface,#fff);color:var(--ink,#111);border-radius:14px;padding:18px;max-width:420px;width:100%;display:flex;flex-direction:column;gap:10px;font:inherit">' + html + '</div>'; document.body.appendChild(d); return d; }
  async function handleAction(auth) {
    const q = new URLSearchParams(location.search), mode = q.get('mode'), code = q.get('oobCode'); if (!mode || !code) return;
    const clean = () => { try { history.replaceState(null, '', location.pathname + '#account'); } catch (e) { } };
    const bad = e => { const c = (e && e.code) || ''; return /expired|invalid-action-code/.test(c) ? 'اللينك ده انتهى أو اتستخدم قبل كده. لو طلبت أكتر من رسالة، استخدم آخر رسالة بس، أو اطلب رسالة جديدة من «حسابي».' : 'حصل خطأ: ' + (c || (e && e.message) || ''); };
    try {
      if (mode === 'verifyEmail') { await auth.applyActionCode(code); clean(); await new Promise(r => { const un = auth.onAuthStateChanged(u => { un(); r(u); }); }); if (auth.currentUser) { await auth.currentUser.reload(); await auth.currentUser.getIdToken(true); st.verified = !!auth.currentUser.emailVerified; changed(); } const d = actionBox('<h3 style="margin:0">تم تأكيد بريدك ✓</h3><p style="margin:0">حسابك مفعّل دلوقتي. لو مش داخل، سجّل دخولك من «حسابي».</p><button style="padding:8px 14px;border-radius:9px;border:0;cursor:pointer">تمام</button>'); d.querySelector('button').onclick = () => d.remove(); }
      else if (mode === 'resetPassword') { const em = await auth.verifyPasswordResetCode(code); const d = actionBox('<h3 style="margin:0">كلمة مرور جديدة</h3><p style="margin:0" dir="ltr">' + String(em).replace(/[<>&"]/g, '') + '</p><label for="rpw">كلمة المرور الجديدة (8 أحرف على الأقل)</label><input id="rpw" type="password" autocomplete="new-password" style="padding:8px;border-radius:8px;border:1px solid #ccc"><div id="rpm" style="font-size:14px"></div><button style="padding:8px 14px;border-radius:9px;border:0;cursor:pointer">احفظ</button>'); d.querySelector('button').onclick = async () => { const pw = d.querySelector('#rpw').value; if (pw.length < 8) { d.querySelector('#rpm').textContent = 'كلمة المرور لازم تكون 8 أحرف على الأقل'; return; } try { await auth.confirmPasswordReset(code, pw); clean(); d.querySelector('div').innerHTML = '<h3 style="margin:0">اتغيرت كلمة المرور ✓</h3><p style="margin:0">سجّل دخولك دلوقتي بكلمة المرور الجديدة من «حسابي».</p>'; setTimeout(() => d.remove(), 4000); } catch (e) { d.querySelector('#rpm').textContent = bad(e); } }; }
      else if (mode === 'recoverEmail') { await auth.checkActionCode(code); await auth.applyActionCode(code); clean(); const d = actionBox('<h3 style="margin:0">رجع بريدك القديم ✓</h3><p style="margin:0">يُفضّل تغيّر كلمة المرور دلوقتي من «حسابي».</p><button style="padding:8px 14px;border-radius:9px;border:0;cursor:pointer">تمام</button>'); d.querySelector('button').onclick = () => d.remove(); }
    } catch (e) { clean(); const d = actionBox('<h3 style="margin:0">مقدرناش نكمّل</h3><p style="margin:0">' + bad(e) + '</p><button style="padding:8px 14px;border-radius:9px;border:0;cursor:pointer">تمام</button>'); d.querySelector('button').onclick = () => d.remove(); }
  }
  async function initFirebase() {
    const base = (window.FIREBASE_SDK_BASE || 'vendor/firebase-10.12.2/');
    await loadScript(base + 'firebase-app-compat.js'); await loadScript(base + 'firebase-auth-compat.js'); await loadScript(base + 'firebase-firestore-compat.js');
    const app = firebase.initializeApp(cfg);
    if (window.FIREBASE_APPCHECK_SITE_KEY) { try { await loadScript(base + 'firebase-app-check-compat.js'); firebase.appCheck().activate(new firebase.appCheck.ReCaptchaV3Provider(window.FIREBASE_APPCHECK_SITE_KEY), true); } catch (e) { } }
    st.fb = firebase; st.db = firebase.firestore();
    firebase.auth().useDeviceLanguage();
    handleAction(firebase.auth());
    firebase.auth().onAuthStateChanged(async u => {
      st.user = u; st.verified = !!(u && u.emailVerified); st.name = u ? (u.displayName || '') : '';
      st.ready = true;
      if (u) { await pullAndMerge(); hookCloud(); } else unhookCloud();
      changed();
    });
  }
  const userRef = () => st.db.collection('users').doc(st.user.uid);
  async function pullAndMerge() {
    try {
      const snap = await userRef().get(); const d = snap.exists ? snap.data() : {};
      if (d.prefs && typeof d.prefs.lb === 'boolean') st.lbOptIn = d.prefs.lb;
      const remote = d[APP] && d[APP].state ? safeParse(d[APP].state) : null, local = getS();
      if (remote && (remote.xp || 0) > (local.xp || 0)) { setS(Object.assign({}, local, remote, { fs: local.fs, theme: local.theme })); }
      await pushState(getS(), true);
      if (APP === 'scales' && typeof SCALES !== 'undefined') {
        const qs = await userRef().collection('scales').get();
        const remoteScales = qs.docs.map(x => safeParse(x.data().json)).filter(Boolean);
        SCALES.merge(remoteScales);
        SCALES.list().forEach(s => pushScale(s));
      }
    } catch (e) {  }
  }
  const safeParse = s => { try { return JSON.parse(s); } catch (e) { return null; } };
  let lastPush = 0;
  async function pushState(s, force) {
    if (!st.user) return; const now = Date.now(); if (!force && now - lastPush < 4000) return; lastPush = now;
    const json = JSON.stringify(s); if (json.length > 400000) return;
    const ts = st.fb.firestore.FieldValue.serverTimestamp();
    try {
      await userRef().set({ name: (st.name || '').slice(0, 40), [APP]: { state: json, xp: s.xp | 0 }, updated: ts }, { merge: true });
      if (st.lbOptIn && st.verified) {
        const lbRef = st.db.collection('leaderboard').doc(st.user.uid), cur = await lbRef.get(), c = cur.exists ? cur.data() : {};
        const xpMine = Math.max(0, Math.min(1e6, s.xp | 0)), wMine = Math.max(0, Math.min(1e6, week7(s) | 0));
        const xpOther = (c.xp && c.xp[OTHER]) | 0, wOther = (c.w && c.w[OTHER]) | 0;
        await lbRef.set({ name: (st.name || 'باحث').slice(0, 40), xp: { [APP]: xpMine, [OTHER]: xpOther }, w: { [APP]: wMine, [OTHER]: wOther }, total: xpMine + xpOther, week: wMine + wOther, updated: ts });
      }
    } catch (e) {  }
  }
  async function pushScale(s) { if (!st.user || APP !== 'scales') return; const json = JSON.stringify(s); if (json.length > 900000) return; try { await userRef().collection('scales').doc(s.id).set({ json, updated: st.fb.firestore.FieldValue.serverTimestamp() }); } catch (e) {  } }
  function hookCloud() { if (typeof Cloud !== 'undefined') Cloud.push = s => pushState(s); if (typeof SCALES !== 'undefined') { SCALES.cloud.push = s => pushScale(s); SCALES.cloud.remove = id => st.user && userRef().collection('scales').doc(id).delete().catch(() => { }); } }
  function unhookCloud() { if (typeof Cloud !== 'undefined') Cloud.push = null; if (typeof SCALES !== 'undefined') { SCALES.cloud.push = null; SCALES.cloud.remove = null; } }

  /* ---------- Claude (artifact) mode ---------- */
  async function initClaude() {
    try {
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!user) return; const id = await user.id(); st.claudeUid = id; st.claudeName = (await user.name()) || '';
      st.mode = 'claude'; st.ready = true;
      if (db && id) {
        const ref = db.collection('data/users/' + id).doc('progress-v2');
        const snap = await ref.get();
        if (snap.exists) { const r = safeParse(snap.data().json); if (r && (r.xp || 0) > (getS().xp || 0)) setS(Object.assign({}, getS(), r)); }
        let writable = true;
        const push = async s => { if (!writable) return; try { await ref.set({ json: JSON.stringify(s), updated: Date.now() }); } catch (e) { writable = false; } };
        await push(getS());
        if (writable) { st.claudeDb = db; if (typeof Cloud !== 'undefined') Cloud.push = push; }
        if (writable && typeof SCALES !== 'undefined') {
          const col = db.collection('data/users/' + id);
          try { const qs = await col.get(); SCALES.merge(qs.docs.filter(d => d.id.startsWith('scale_')).map(d => safeParse(d.data().json)).filter(Boolean)); } catch (e) { }
          SCALES.cloud.push = s => col.doc('scale_' + s.id).set({ json: JSON.stringify(s), updated: Date.now() }).catch(() => { });
          SCALES.cloud.remove = sid => col.doc('scale_' + sid).delete().catch(() => { });
        }
      }
      changed();
    } catch (e) { }
  }

  /* ---------- live forms (Firestore) ---------- */
  const forms = {
    available: () => st.mode === 'firebase' && !!st.user && st.verified,
    async panel(s, el, api) {
      const meta = s.live || null;
      const link = fid => location.origin + location.pathname + '#form-' + fid;
      const draw = () => {
        el.innerHTML = `<section class="card stack"><h3>${ic('link')} النموذج الأونلاين المباشر</h3>${s.live ? `<div class="row"><span class="live-dot" aria-hidden="true"></span><b class="grow">${s.live.open ? 'النموذج مفتوح ويستقبل الإجابات' : 'النموذج مغلق'}</b><span class="chip blue" id="liveN">${(s.liveSeen || []).length} استجابة وصلت</span></div><div class="codebox">${h(link(s.live.fid))}</div><div class="row"><button class="btn sm" id="lCp">${ic('copy')} نسخ الرابط</button><a class="btn sm ghost" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text=${encodeURIComponent('أرجو الإجابة عن مقياس «' + s.name + '»: ' + link(s.live.fid))}">${ic('whats')} واتساب</a><button class="btn sm ghost" id="lTog">${s.live.open ? 'إغلاق النموذج' : 'إعادة فتحه'}</button><button class="btn sm ghost" id="lUpd">تحديث العبارات في النموذج</button></div><p class="small muted" style="margin:0">لا يحتاج المستجيب إلى حساب. الإجابات تُحفظ في حسابك فقط، ولا يقرؤها غيرك.</p>` : `<p style="margin:0">انشر نموذجًا له رابط تشاركه مع المستجيبين؛ تصل كل إجابة إلى هذا المقياس فور إرسالها.</p><button class="btn" id="lPub" style="justify-self:start">${ic('link')} نشر النموذج</button>`}</section>`;
        const pub = $('#lPub', el); if (pub) pub.onclick = async () => { try { const def = api.formDef(s); const fid = st.db.collection('forms').doc().id; await st.db.collection('forms').doc(fid).set({ owner: st.user.uid, title: s.name.slice(0, 120), def: JSON.stringify(def), open: true, created: st.fb.firestore.FieldValue.serverTimestamp() }); s.live = { fid, open: true }; s.liveSeen = []; api.save(); draw(); listen(); toast('نُشر النموذج'); } catch (e) { toast('تعذر النشر: ' + errMsg(e)); } };
        const cp = $('#lCp', el); if (cp) cp.onclick = () => copyText(link(s.live.fid));
        const tg = $('#lTog', el); if (tg) tg.onclick = async () => { try { await st.db.collection('forms').doc(s.live.fid).update({ open: !s.live.open }); s.live.open = !s.live.open; api.save(); draw(); } catch (e) { toast(errMsg(e)); } };
        const up = $('#lUpd', el); if (up) up.onclick = async () => { try { await st.db.collection('forms').doc(s.live.fid).update({ def: JSON.stringify(api.formDef(s)), title: s.name.slice(0, 120) }); api.save(); toast('حُدّثت عبارات النموذج'); } catch (e) { toast(errMsg(e)); } };
      };
      const listen = () => {
        if (!s.live) return; if (forms._un) forms._un();
        forms._un = st.db.collection('forms').doc(s.live.fid).collection('responses').onSnapshot(snap => {
          let added = 0; s.liveSeen = s.liveSeen || [];
          snap.docChanges().forEach(ch => { if (ch.type !== 'added') return; const id = ch.doc.id; if (s.liveSeen.includes(id)) return; const d = ch.doc.data(); if (!/^[0-7]{1,200}$/.test(d.r || '')) return; const res = api.addResponse(s, d.v, d.r.split('').map(Number), { src: 'live', g: String(d.g || '').slice(0, 10), a: String(d.a || '').slice(0, 3) }); if (res === 'ok') { s.liveSeen.push(id); added++; } });
          if (added) { api.save(); const n = $('#liveN'); if (n) n.textContent = s.liveSeen.length + ' استجابة وصلت'; toast('وصلت ' + added + ' استجابة جديدة'); }
        }, e => toast('انقطع الاستماع للنموذج: ' + errMsg(e)));
      };
      draw(); listen();
    },
    async respond(el, fid, api) {
      el.innerHTML = '<p class="muted">جارٍ تحميل النموذج…</p>';
      try {
        const doc = await st.db.collection('forms').doc(fid).get();
        if (!doc.exists || !doc.data().open) { el.innerHTML = '<div class="card"><h3>النموذج غير متاح</h3><p class="muted">ربما أغلقه الباحث أو أن الرابط غير صحيح.</p></div>'; return; }
        const def = safeParse(doc.data().def); if (!def || !Array.isArray(def.q) || !Array.isArray(def.l) || def.q.length > 200 || def.l.length > 7) throw new Error('bad');
        let sent = false; try { sent = localStorage.getItem('sent-' + fid) === '1'; } catch (e) { }
        if (sent) { el.innerHTML = '<div class="card"><h3>سبق أن أرسلت إجاباتك</h3><p class="muted">شكرًا لك؛ وصلت إجاباتك إلى الباحث.</p></div>'; return; }
        el.innerHTML = api.formHTML(def);
        api.bindForm(el, def, async (vals, demo) => {
          const btn = $('button[type=submit]', el); if (btn) btn.disabled = true;
          try { await st.db.collection('forms').doc(fid).collection('responses').add({ r: vals.join(''), v: String(def.v).slice(0, 20), g: String(demo.g || '').slice(0, 10), a: String(demo.a || '').slice(0, 3), ts: st.fb.firestore.FieldValue.serverTimestamp() }); try { localStorage.setItem('sent-' + fid, '1'); } catch (e) { }
            el.innerHTML = `<div class="card stack"><h3>${ic('check')} شكرًا لك</h3><p style="margin:0">وصلت إجاباتك إلى الباحث.</p></div>`; }
          catch (e) { if (btn) btn.disabled = false; toast('تعذر الإرسال: ' + errMsg(e)); }
        });
      } catch (e) { el.innerHTML = '<div class="card"><h3>تعذر تحميل النموذج</h3><p class="muted">تحقق من الرابط أو اتصال الإنترنت.</p></div>'; }
    }
  };

  /* ---------- errors (generic on sign-in to avoid account enumeration) ---------- */
  function errMsg(e) {
    const c = (e && e.code) || '';
    return ({
      'auth/email-already-in-use': 'هذا البريد مسجل بالفعل؛ جرّب تسجيل الدخول أو استعادة كلمة المرور.',
      'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة.',
      'auth/weak-password': 'كلمة المرور ضعيفة؛ استخدم 8 أحرف على الأقل مع حروف وأرقام.',
      'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحين.', 'auth/wrong-password': 'البريد أو كلمة المرور غير صحيحين.', 'auth/user-not-found': 'البريد أو كلمة المرور غير صحيحين.',
      'auth/too-many-requests': 'محاولات كثيرة؛ انتظر قليلًا ثم حاول مرة أخرى.',
      'auth/network-request-failed': 'تعذر الاتصال بالإنترنت.',
      'auth/requires-recent-login': 'لأسباب أمنية سجّل الخروج ثم الدخول مرة أخرى قبل هذا الإجراء.',
      'permission-denied': 'ليست لديك صلاحية لهذا الإجراء.'
    })[c] || 'حدث خطأ غير متوقع؛ حاول مرة أخرى.';
  }
  function pwStrength(p) { let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[a-z]/i.test(p) && /\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++; return s; }

  /* ---------- account page ---------- */

  /* ---------- real-name rule, Google sign-in, and verification by pasting the email link ---------- */
  const realName = nm => { const w = String(nm || '').trim().split(/\s+/); return nm.length <= 40 && w.length >= 2 && w.every(x => /^[A-Za-zء-ي٠-٩کگی'-]{2,}$/.test(x)) && !/\d/.test(nm); };
  const NAME_ERR = 'اكتب اسمك الحقيقي بالكامل (الاسم الأول واسم الأب على الأقل) بالحروف بس، من غير أرقام أو رموز.';
  function loadGsi() { return new Promise((res, rej) => { if (window.google && google.accounts && google.accounts.id) return res(); const s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = res; s.onerror = () => rej(new Error('gsi')); document.head.appendChild(s); }); }
  async function googleButton(box, onErr) {
    if (!box || st.mode !== 'firebase') return;
    const cid = window.GOOGLE_CLIENT_ID;
    if (cid) { try { await loadGsi(); google.accounts.id.initialize({ client_id: cid, callback: async r => { try { await st.fb.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(r.credential)); toast('أهلًا بيك'); } catch (e) { onErr(errMsg(e)); } } }); box.innerHTML = ''; google.accounts.id.renderButton(box, { theme: 'outline', size: 'large', text: 'continue_with', locale: 'ar', width: 280 }); return; } catch (e) { } }
    box.innerHTML = '<button class="btn ghost" type="button" style="width:100%"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4z"/></svg> متابعة بحساب Google</button>';
    box.querySelector('button').onclick = async () => { try { await st.fb.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()); toast('أهلًا بيك'); } catch (e) { const c = (e && e.code) || ''; onErr(/operation-not-allowed/.test(c) ? 'الدخول بحساب Google لسه مش مفعّل في إعدادات Firebase.' : /popup-closed|cancelled-popup/.test(c) ? 'اتقفلت نافذة Google قبل ما تكمّل.' : /network|internal/.test(c) ? 'نافذة Google مقدرتش تفتح على الشبكة دي. جرّب شبكة تانية، أو سجّل بالإيميل.' : errMsg(e)); } };
  }
  async function verifyFromLink(link) { const m = String(link).match(/oobCode(?:=|%3D)([A-Za-z0-9_-]+)/); if (!m) throw new Error('nolink'); await st.fb.auth().applyActionCode(m[1]); const u = st.fb.auth().currentUser; if (u) { await u.reload(); await u.getIdToken(true); st.verified = !!u.emailVerified; } }
  function renderPanel(el) {
    const s = getS(), rk = typeof rankOf === 'function' ? rankOf(s.xp).name : '';
    const perks = `<ul class="stack small" style="list-style:none;padding:0;margin:0;gap:6px">
      <li>${ic('check')} يُحفظ تقدمك (النقاط، والسلسلة، والدروس، و${APP === 'scales' ? 'مقاييسك واستجاباتها' : 'نتائج اختباراتك'}) على كل أجهزتك.</li>
      <li>${ic('check')} حساب واحد للموقعين: مختبر المقاييس ومختبر الإحصاء.</li>
      <li>${ic('check')} تظهر في لوحة المتصدرين الأسبوعية (يمكنك إخفاء اسمك).</li>
      ${APP === 'scales' ? `<li>${ic('check')} تنشر نموذج مقياسك أونلاين وتصلك الإجابات لحظيًا.</li>` : ''}
      <li>${ic('check')} وسام «عضو مسجل» و15 نقطة.</li></ul>`;
    if (st.mode === 'claude') {
      el.innerHTML = `<div class="section-title"><h2>حسابي</h2></div><section class="card stack"><div class="row"><span class="avatar">${h((st.claudeName || '؟')[0])}</span><div class="grow"><b>${h(st.claudeName || 'حساب Claude')}</b><div class="small muted">${h(rk)}</div></div></div><p class="small" style="margin:0">داخل Claude يُستخدم حسابك في Claude مباشرة؛ لا تحتاج إلى تسجيل منفصل.</p><div class="notice small ${st.claudeDb ? 'good' : ''}">${st.claudeDb ? 'تقدمك ومقاييسك تُحفظ في حسابك وتتزامن بين أجهزتك.' : 'تقدمك يُحفظ في هذا المتصفح. لحفظه على كل أجهزتك استخدم نسخة الموقع المنشورة على GitHub وأنشئ حسابًا هناك.'}</div></section>`;
      return;
    }
    if (st.mode !== 'firebase') {
      el.innerHTML = `<div class="section-title"><h2>حسابي</h2></div><section class="card stack"><h3>${ic('user')} التسجيل غير مفعّل في هذه النسخة بعد</h3><p style="margin:0">تقدمك محفوظ الآن في هذا المتصفح (${s.xp} نقطة، سلسلة ${s.streak} يوم). يُفعَّل التسجيل بالبريد الإلكتروني بعد ربط الموقع بمشروع Firebase مجاني (ملف SETUP-FIREBASE.md).</p><div class="field"><label class="fl" for="nmLocal">اسمك في هذا المتصفح (اختياري)</label><input type="text" id="nmLocal" maxlength="40" value="${h(s.name || '')}"></div></section><section class="card">${perks}</section>`;
      $('#nmLocal', el).onchange = e => { const x = getS(); x.name = e.target.value.trim().slice(0, 40); setS(x); changed(); };
      return;
    }
    if (!st.ready) { el.innerHTML = '<p class="muted">جارٍ التحميل…</p>'; return; }
    if (!st.user) {
      let mode = 'up';
      const draw = () => {
        el.innerHTML = `<div class="section-title"><h2>حسابي</h2><span class="chip">اختياري</span></div>
        <div class="grid2"><section class="card stack"><div class="seg" role="tablist"><button data-am="up" aria-pressed="${mode === 'up'}">إنشاء حساب</button><button data-am="in" aria-pressed="${mode === 'in'}">تسجيل الدخول</button></div>
          <div id="aG"></div><div class="row small muted" style="justify-content:center">أو بالإيميل وكلمة مرور</div><form id="aForm" class="stack" novalidate>
            ${mode === 'up' ? `<div class="field"><label class="fl" for="aName">اسمك الحقيقي بالكامل (ثنائي أو ثلاثي)</label><input type="text" id="aName" maxlength="40" autocomplete="name" required placeholder="مثال: محمد أحمد عثمان"></div>` : ''}
            <div class="field"><label class="fl" for="aEmail">البريد الإلكتروني</label><input type="email" id="aEmail" autocomplete="email" required inputmode="email"></div>
            <div class="field"><label class="fl" for="aPw">كلمة المرور</label><input type="password" id="aPw" autocomplete="${mode === 'up' ? 'new-password' : 'current-password'}" minlength="8" required>${mode === 'up' ? '<div class="pbar" style="margin-top:6px"><i id="pwBar" style="width:0"></i></div><small class="muted" id="pwTxt">8 أحرف على الأقل، وحروف وأرقام.</small>' : ''}</div>
            ${mode === 'up' ? '<div class="field"><label class="fl" for="aPw2">تأكيد كلمة المرور</label><input type="password" id="aPw2" autocomplete="new-password" required></div>' : ''}
            <div id="aErr" class="notice bad small" hidden role="alert"></div>
            <button class="btn" type="submit">${mode === 'up' ? 'إنشاء الحساب' : 'دخول'}</button>
            ${mode === 'in' ? '<button class="btn ghost sm" type="button" id="aReset">نسيت كلمة المرور</button>' : ''}
          </form></section>
          <section class="card stack"><h3>${ic('star')} لماذا تنشئ حسابًا؟</h3><div class="tile hl"><small>تقدمك الحالي في هذا المتصفح</small><b style="direction:rtl;text-align:start;font-family:inherit">${s.xp} نقطة · ${s.streak} يوم</b></div>${perks}<p class="small muted" style="margin:0">الحساب اختياري تمامًا؛ كل أدوات الموقع تعمل بدونه.</p></section></div>`;
        $$('[data-am]', el).forEach(b => b.onclick = () => { mode = b.dataset.am; draw(); });
        const pw = $('#aPw', el), bar = $('#pwBar', el); if (bar) pw.oninput = () => { const k = pwStrength(pw.value); bar.style.width = k * 25 + '%'; bar.style.background = k >= 3 ? 'var(--good)' : k === 2 ? 'var(--amber)' : 'var(--bad)'; $('#pwTxt', el).textContent = ['ضعيفة جدًا', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية'][k]; };
        const err = m => { const e = $('#aErr', el); e.hidden = false; e.textContent = m; };
        googleButton($('#aG', el), err);
        const rs = $('#aReset', el); if (rs) rs.onclick = async () => { const em = $('#aEmail', el).value.trim(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return err('اكتب بريدك الإلكتروني أولًا.'); try { await sendReset(st.fb.auth(), em); } catch (e) { } toast('إن كان البريد مسجلًا فستصلك رسالة لاستعادة كلمة المرور'); };
        $('#aForm', el).onsubmit = async e => {
          e.preventDefault(); if (Date.now() < st.lockUntil) return err('محاولات كثيرة؛ انتظر ' + Math.ceil((st.lockUntil - Date.now()) / 1000) + ' ثانية.');
          const em = $('#aEmail', el).value.trim(), p = $('#aPw', el).value;
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em) || em.length > 254) return err('صيغة البريد الإلكتروني غير صحيحة.');
          const btn = $('button[type=submit]', el); btn.disabled = true;
          try {
            if (mode === 'up') {
              const nm = $('#aName', el).value.replace(/[<>]/g, '').trim().slice(0, 40);
              if (!realName(nm)) { btn.disabled = false; return err(NAME_ERR); }
              if (p.length < 8 || !(/[a-z؀-ۿ]/i.test(p) && /\d/.test(p))) { btn.disabled = false; return err('كلمة المرور: 8 أحرف على الأقل وتحتوي حروفًا وأرقامًا.'); }
              if (p !== $('#aPw2', el).value) { btn.disabled = false; return err('كلمتا المرور غير متطابقتين.'); }
              const cr = await st.fb.auth().createUserWithEmailAndPassword(em, p);
              await cr.user.updateProfile({ displayName: nm }); st.name = nm;
              try { await sendVer(cr.user); } catch (x) { }
              toast('أُنشئ حسابك. أرسلنا رسالة تأكيد لبريدك، ولو مش في الوارد بص في الـ Spam');
            } else { await st.fb.auth().signInWithEmailAndPassword(em, p); st.failures = 0; toast('مرحبًا بعودتك'); }
          } catch (x) { st.failures++; if (st.failures >= 5) { st.lockUntil = Date.now() + 30000 * Math.min(4, st.failures - 4); } btn.disabled = false; err(errMsg(x)); }
        };
      };
      draw(); return;
    }
    const u = st.user;
    el.innerHTML = `<div class="section-title"><h2>حسابي</h2></div>
      <div class="grid2"><section class="card stack"><div class="row"><span class="avatar">${h((st.name || u.email || '؟')[0])}</span><div class="grow"><b>${h(st.name || 'باحث')}</b><div class="small muted ltr" style="text-align:right">${h(u.email || '')}</div></div><span class="chip amber">${h(rk)}</span></div>
        ${st.verified ? '<div class="notice good small">بريدك مؤكد. تقدمك يُحفظ في حسابك تلقائيًا.</div>' : '<div class="notice warn small"><b>أكّد بريدك الإلكتروني</b>افتح الرسالة التي أرسلناها واضغط اللينك. <b>لو مش لاقيها، بص في مجلد الرسائل غير المرغوب فيها (Spam)</b> واضغط «ليست رسالة غير مرغوب فيها»، علشان الرسائل الجاية توصل الوارد. استخدم آخر رسالة بس. التأكيد مطلوب للظهور في لوحة المتصدرين ونشر النماذج.<div class="row" style="margin-top:6px"><button class="btn sm ghost" id="aVer">إعادة إرسال الرسالة</button><button class="btn sm ghost" id="aRel">تحققت، حدّث الحالة</button></div><details style="margin-top:8px"><summary><b>اللينك بيفتح صفحة خطأ؟</b></summary><p style="margin:6px 0">انسخ اللينك من الإيميل (اضغط عليه ضغطة طويلة ثم «نسخ الرابط»)، والصقه هنا، والموقع هيأكّد بريدك من غير ما يفتح صفحة Firebase.</p><div class="row"><input type="text" id="aLink" dir="ltr" class="grow" placeholder="https://...oobCode=..."><button class="btn sm" id="aLinkGo">أكّد</button></div></details></div>'}<div class="row" style="margin-top:8px"><a class="btn sm ghost" href="#admin" style="text-decoration:none">لوحة المسؤول</a><span class="muted small">للمسؤول فقط</span></div>
        ${realName(st.name || '') ? '' : '<div class="notice warn small"><b>اكتب اسمك الحقيقي بالكامل</b>مطلوب علشان مسؤول الموقع يقدر يتابعك ويساعدك.</div>'}<div class="field"><label class="fl" for="aNm">اسمك الحقيقي بالكامل</label><div class="row"><input type="text" id="aNm" maxlength="40" value="${h(st.name)}" class="grow"><button class="btn sm ghost" id="aNmS">حفظ</button></div></div>
        <label class="row small"><input type="checkbox" id="aLb" ${st.lbOptIn ? 'checked' : ''}> اعرض اسمي في لوحة المتصدرين</label>
        <div class="row"><button class="btn ghost sm" id="aOut">تسجيل الخروج</button><button class="btn sm danger" id="aDel">حذف الحساب</button></div></section>
        <section class="card stack"><h3>${ic('trophy')} لوحة المتصدرين</h3><div class="seg"><button data-lb="week" aria-pressed="true">آخر 7 أيام</button><button data-lb="total" aria-pressed="false">الكل</button></div><div id="lbList"><p class="muted small">جارٍ التحميل…</p></div></section></div>`;
    const v = $('#aVer', el); if (v) v.onclick = async () => { try { await sendVer(u); toast('أُرسلت رسالة تأكيد جديدة. استخدم آخر رسالة بس، لأن الرسائل القديمة بتبطل'); } catch (e) { toast(errMsg(e)); } };
    const lg = $('#aLinkGo', el); if (lg) lg.onclick = async () => { try { await verifyFromLink($('#aLink', el).value); if (st.verified) await pushState(getS(), true); toast(st.verified ? 'تم تأكيد بريدك ✓' : 'اتأكد، حدّث الصفحة'); changed(); } catch (e) { toast(e && e.message === 'nolink' ? 'ده مش لينك التأكيد. انسخ اللينك اللي في الإيميل كله.' : /expired|invalid-action-code/.test((e && e.code) || '') ? 'اللينك ده قديم أو اتستخدم قبل كده. اطلب رسالة جديدة واستخدم آخر واحدة.' : errMsg(e)); } };
    const r = $('#aRel', el); if (r) r.onclick = async () => { await u.reload(); st.verified = st.fb.auth().currentUser.emailVerified; if (st.verified) { await st.fb.auth().currentUser.getIdToken(true); await pushState(getS(), true); } changed(); };
    $('#aNmS', el).onclick = async () => { const nm = $('#aNm', el).value.replace(/[<>]/g, '').trim().slice(0, 40); if (!realName(nm)) return toast(NAME_ERR); try { await u.updateProfile({ displayName: nm }); st.name = nm; await pushState(getS(), true); toast('حُفظ الاسم'); changed(); } catch (e) { toast(errMsg(e)); } };
    $('#aLb', el).onchange = async e => { st.lbOptIn = e.target.checked; try { await userRef().set({ prefs: { lb: st.lbOptIn }, updated: st.fb.firestore.FieldValue.serverTimestamp() }, { merge: true }); if (!st.lbOptIn) await st.db.collection('leaderboard').doc(u.uid).delete(); else await pushState(getS(), true); toast(st.lbOptIn ? 'اسمك ظاهر في اللوحة' : 'أُخفي اسمك من اللوحة'); loadLb('week'); } catch (x) { toast(errMsg(x)); } };
    $('#aOut', el).onclick = () => st.fb.auth().signOut();
    $('#aDel', el).onclick = () => (typeof confirmBox === 'function' ? confirmBox : (m, y, f) => f())('سيُحذف حسابك وبياناتك المحفوظة على الخادم نهائيًا (تبقى نسخة على هذا الجهاز).', 'حذف الحساب', async () => {
      try { const uidv = u.uid; const sc = await userRef().collection('scales').get(); for (const d of sc.docs) await d.ref.delete(); const fq = await st.db.collection('forms').where('owner', '==', uidv).get(); for (const f of fq.docs) { const rs = await f.ref.collection('responses').get(); for (const r of rs.docs) await r.ref.delete(); await f.ref.delete(); } await st.db.collection('leaderboard').doc(uidv).delete().catch(() => { }); await userRef().delete(); await u.delete(); toast('حُذف الحساب'); } catch (e) { toast(errMsg(e)); }
    });
    const loadLb = async by => {
      const box = $('#lbList', el); if (!box) return;
      try {
        const qs = await st.db.collection('leaderboard').orderBy(by, 'desc').limit(20).get();
        const rows = qs.docs.map((d, i) => { const x = d.data(); const me = d.id === u.uid; return `<div class="lb-row ${me ? 'me' : ''}"><b class="num">${i + 1}</b><span>${h(x.name || 'باحث')}${me ? ' <span class="chip amber">أنت</span>' : ''}</span><span class="num">${(x[by] | 0)}</span></div>`; }).join('');
        box.innerHTML = rows || '<p class="muted small">لا أحد في اللوحة بعد. كن الأول!</p>';
        if (!st.verified) box.innerHTML += '<p class="small muted">أكّد بريدك لتظهر هنا.</p>';
      } catch (e) { box.innerHTML = `<p class="muted small">${h(errMsg(e))}</p>`; }
    };
    $$('[data-lb]', el).forEach(b => b.onclick = () => { $$('[data-lb]', el).forEach(x => x.setAttribute('aria-pressed', x === b)); loadLb(b.dataset.lb); });
    loadLb('week');
  }

  window.ACCT = {
    available: () => st.mode === 'firebase' || st.mode === 'claude',
    signedIn: () => (st.mode === 'firebase' && !!st.user) || (st.mode === 'claude' && !!st.claudeDb),
    displayName: () => st.mode === 'firebase' ? (st.user ? st.name : '') : st.mode === 'claude' ? st.claudeName : '',
    renderPanel, forms,
    // minimal Firestore access for the know-yourself journey and the admin page (firebase mode only)
    fs: {
      ready: () => st.mode === 'firebase' && !!st.user && !!st.db,
      uid: () => st.user ? st.user.uid : null, email: () => st.user ? (st.user.email || '') : '', name: () => st.name || '', verified: () => !!st.verified,
      get: async p => { const d = await st.db.doc(p).get(); return d.exists ? d.data() : null; },
      set: async (p, data) => st.db.doc(p).set(Object.assign({}, data, { updated: firebase.firestore.FieldValue.serverTimestamp() })),
      list: async c => (await st.db.collection(c).get()).docs.map(d => Object.assign({ id: d.id }, d.data())),
      del: async p => st.db.doc(p).delete(),
      refresh: async () => { if (!st.user) return false; try { await st.user.reload(); } catch (e) { } const u = st.fb.auth().currentUser; if (u) { await u.getIdToken(true); st.verified = !!u.emailVerified; } return st.verified; },
      put: async (p, data) => { const d = {}; Object.keys(data).forEach(k => { d[k] = data[k] === '__ts__' ? firebase.firestore.FieldValue.serverTimestamp() : data[k]; }); return st.db.doc(p).set(d); }
    },
    init() {
      if (window.claude && typeof window.claude.use === 'function') { initClaude(); return; }
      if (cfg && cfg.apiKey && cfg.projectId) { st.mode = 'firebase'; initFirebase().catch(e => { st.mode = 'none';  changed(); }); }
    }
  };
})();
