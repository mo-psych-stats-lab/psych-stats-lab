/* ===== Reinforcement layer shared by both labs.
   1) Variable-ratio reinforcement (VR-5): after a correct answer, a scientist card appears with p = 0.2.
   2) Spaced repetition: a wrong answer comes back after 1 day, then 3, 7 and 14 days (Leitner-style boxes).
   3) Reinforcement-schedules lab: the learner responds under FR, VR, FI and VI and sees the cumulative record.
   Everything is stored in this browser only. ===== */
var REWARD = (function () {
  var KEY = 'reward-v1', D = 864e5, BOX = [1, 3, 7, 14];
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || { cards: {}, sr: {}, n: 0 }; } catch (e) { return { cards: {}, sr: {}, n: 0 }; } }
  var st = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var CARDS = [
    ['galton', 'فرانسيس جالتون', 1884, 'أسس القياس العقلي، وابتكر معامل الارتباط مفهومًا، ومعمل القياس الأنثروبومتري.', 'نادر'],
    ['pearson', 'كارل بيرسون', 1896, 'صاغ معامل الارتباط الذي يحمل اسمه، واختبار كاي تربيع.', 'شائع'],
    ['spearman', 'تشارلز سبيرمان', 1904, 'العامل العام g، وأساس التحليل العاملي، ومعادلة سبيرمان–براون.', 'نادر'],
    ['binet', 'ألفريد بينيه', 1905, 'أول اختبار ذكاء عملي مع تيودور سيمون.', 'شائع'],
    ['thurstone', 'لويس ثرستون', 1928, 'قياس الاتجاهات بالفترات المتساوية، والقدرات العقلية الأولية.', 'نادر'],
    ['likert', 'رنسيس ليكرت', 1932, 'مقياس التقديرات المجمّعة، الأكثر استخدامًا في العالم.', 'شائع'],
    ['guttman', 'لويس جتمان', 1944, 'التدرج التراكمي ومعامل إعادة الإنتاج.', 'نادر'],
    ['cronbach', 'لي كرونباخ', 1951, 'معامل ألفا، والصدق البنائي مع ميل (1955)، ونظرية التعميم.', 'شائع'],
    ['skinner', 'بي. إف. سكنر', 1957, 'جداول التعزيز مع فيرستر. وأنت الآن تحت جدول نسبة متغيرة!', 'أسطوري'],
    ['osgood', 'تشارلز أوزجود', 1957, 'التمايز الدلالي: التقييم والقوة والنشاط.', 'نادر'],
    ['campbell', 'دونالد كامبل', 1959, 'مصفوفة السمات والطرق المتعددة مع فيسك.', 'نادر'],
    ['rasch', 'جورج راش', 1960, 'نموذج راش، وأساس القياس الموضوعي.', 'نادر'],
    ['lord', 'فريدريك لورد', 1968, 'النظرية الحديثة للاختبارات ونظرية الاستجابة للمفردة.', 'نادر'],
    ['messick', 'صامويل ميسك', 1989, 'المفهوم الموحد للصدق وعواقب الاستخدام.', 'أسطوري'],
    ['kane', 'مايكل كين', 2013, 'حجة الصدق: التفسير والاستخدام كدعوى تحتاج أدلة.', 'أسطوري'],
    ['clarkwatson', 'كلارك وواتسون', 2019, '«بناء الصدق»: الدليل الحديث لبناء المقاييس.', 'أسطوري']];
  var BY = {}; CARDS.forEach(function (c) { BY[c[0]] = c; });
  var css = '.rw-card{position:fixed;inset-inline-start:50%;top:18%;transform:translateX(50%);z-index:9999;width:min(320px,90vw);border-radius:16px;padding:16px;color:#fff;background:linear-gradient(160deg,#3b2a8a,#1f6f6a);box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center}[dir=ltr] .rw-card{transform:translateX(-50%)}.rw-card b{display:block;font-size:20px;margin:6px 0}.rw-card small{opacity:.85}.rw-card .rw-r{display:inline-block;border-radius:999px;padding:0 10px;background:rgba(255,255,255,.2);font-size:12px}.rw-card button{margin-top:10px;border:0;border-radius:8px;padding:6px 14px;cursor:pointer;font:inherit}.rw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.rw-c{border:1px solid var(--line,#ddd);border-radius:12px;padding:10px;font-size:13px}.rw-c.lock{opacity:.35}.rw-c b{display:block}.rw-sv{width:100%;height:auto;border:1px solid var(--line,#ddd);border-radius:10px}';
  function injectCss() { if (document.getElementById('rw-css')) return; var s = document.createElement('style'); s.id = 'rw-css'; s.textContent = css; document.head.appendChild(s); }
  function showCard(c, isNew) { injectCss(); var n = document.createElement('div'); n.className = 'rw-card'; n.setAttribute('role', 'dialog'); n.setAttribute('aria-label', 'كارت عالِم'); n.innerHTML = '<small>' + (isNew ? 'كارت جديد!' : 'كارت مكرر') + '</small><b>' + E(c[1]) + ' · ' + c[2] + '</b><span class="rw-r">' + E(c[4]) + '</span><p style="margin:8px 0 0">' + E(c[3]) + '</p><small>مجموعتك: ' + Object.keys(st.cards).length + ' / ' + CARDS.length + '</small><br><button>تمام</button>'; document.body.appendChild(n); var close = function () { n.remove(); }; n.querySelector('button').onclick = close; setTimeout(close, 6000); }
  function draw() { var r = Math.random(), pool = CARDS.filter(function (c) { return r < 0.1 ? c[4] === 'أسطوري' : r < 0.4 ? c[4] === 'نادر' : c[4] === 'شائع'; }); return pool[Math.floor(Math.random() * pool.length)]; }
  function onAnswer(id, ok) {
    st.n++;
    var s = st.sr[id];
    if (!ok) st.sr[id] = { b: 0, due: Date.now() + BOX[0] * D };
    else if (s) { var b = s.b + 1; if (b >= BOX.length) delete st.sr[id]; else st.sr[id] = { b: b, due: Date.now() + BOX[b] * D }; }
    var got = null;
    if (ok && Math.random() < 0.2) { var c = draw(), isNew = !st.cards[c[0]]; st.cards[c[0]] = (st.cards[c[0]] || 0) + 1; got = c; setTimeout(function () { showCard(c, isNew); }, 250); try { if (typeof addXP === 'function') addXP(isNew ? 5 : 2); } catch (e) { } }
    save(); return got;
  }
  function isDue(id) { var s = st.sr[id]; return !!s && s.due <= Date.now(); }
  function dueCount(ids) { st = load(); return ids.filter(isDue).length; }
  function inReview(id) { return !!st.sr[id]; }
  function collectionHTML() { injectCss(); return '<div class="rw-grid">' + CARDS.map(function (c) { var have = st.cards[c[0]]; return '<div class="rw-c ' + (have ? '' : 'lock') + '"><b>' + (have ? E(c[1]) : '؟؟؟') + '</b><span>' + c[2] + ' · ' + E(c[4]) + '</span>' + (have ? '<p style="margin:4px 0 0">' + E(c[3]) + '</p>' : '') + '</div>'; }).join('') + '</div><p class="muted small">جمعت ' + Object.keys(st.cards).length + ' من ' + CARDS.length + '. الكروت بتظهر بعد بعض الإجابات الصحيحة، من غير ما تعرف امتى: ده جدول «نسبة متغيرة» (VR-5). جرّب معمل جداول التعزيز علشان تعرف ليه الجدول ده بالذات.</p>'; }
  /* ---------- schedules lab ---------- */
  var SCH = [['FR', 'نسبة ثابتة FR-5', 'مكافأة بعد كل 5 استجابات بالظبط.'], ['VR', 'نسبة متغيرة VR-5', 'مكافأة بعد 5 استجابات في المتوسط، ومش معروف امتى بالظبط.'], ['FI', 'فترة ثابتة FI-4ث', 'أول استجابة بعد مرور 4 ثواني من آخر مكافأة.'], ['VI', 'فترة متغيرة VI-4ث', 'أول استجابة بعد فترة متوسطها 4 ثواني، ومتغيرة.']];
  function labMount(el) {
    injectCss(); var rec = {}, cur = null;
    el.innerHTML = '<div class="stack"><div class="section-title"><h2>معمل جداول التعزيز</h2><span class="chip">سكنر وفيرستر 1957</span></div><section class="card stack"><p style="margin:0">اختار جدول ودوس «استجب» زي ما إنت عايز لمدة 20 ثانية. البرنامج بيكافئك حسب الجدول، وبيرسم <b>السجل التراكمي</b>: كل ما الخط يطلع بسرعة يبقى معدل استجابتك أعلى، والعلامات الصغيرة هي المكافآت.</p><div class="row" id="rwS">' + SCH.map(function (s) { return '<button class="btn sm ghost" data-s="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div><p class="small muted" id="rwD"></p><div class="row"><button class="btn" id="rwB" disabled style="min-width:160px;min-height:56px">استجب</button><span id="rwT" class="chip"></span><span id="rwR" class="chip"></span></div><svg id="rwG" class="rw-sv" viewBox="0 0 600 260" role="img" aria-label="السجل التراكمي"></svg><div id="rwX"></div></section><section class="card stack"><h3 style="margin:0">مجموعة كروت العلماء</h3>' + collectionHTML() + '</section></div>';
    var COL = { FR: '#d97706', VR: '#7c3aed', FI: '#0f766e', VI: '#2563eb' };
    function plot() { var g = '', W = 600, H = 260, P = 30, maxY = Math.max(20, Math.max.apply(null, Object.keys(rec).map(function (k) { return rec[k].r.length; }).concat([0]))); g += '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - 10) + '" y2="' + (H - P) + '" stroke="currentColor" stroke-opacity=".3"/><line x1="' + P + '" y1="10" x2="' + P + '" y2="' + (H - P) + '" stroke="currentColor" stroke-opacity=".3"/><text x="' + (W / 2) + '" y="' + (H - 6) + '" font-size="11" text-anchor="middle" fill="currentColor">الزمن (20 ثانية)</text><text x="12" y="' + (H / 2) + '" font-size="11" fill="currentColor" transform="rotate(-90 12 ' + (H / 2) + ')" text-anchor="middle">الاستجابات التراكمية</text>';
      Object.keys(rec).forEach(function (k) { var R = rec[k], pts = ['' + P + ',' + (H - P)]; R.r.forEach(function (t, i) { pts.push((P + t / 20000 * (W - P - 10)).toFixed(1) + ',' + (H - P - (i + 1) / maxY * (H - P - 10)).toFixed(1)); }); g += '<polyline fill="none" stroke="' + COL[k] + '" stroke-width="2" points="' + pts.join(' ') + '"/>'; R.w.forEach(function (i) { var t = R.r[i]; var x = P + t / 20000 * (W - P - 10), y = H - P - (i + 1) / maxY * (H - P - 10); g += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 6) + '" y2="' + (y + 6) + '" stroke="' + COL[k] + '" stroke-width="2"/>'; }); g += '<text x="' + (W - 14) + '" y="' + (18 + 14 * Object.keys(rec).indexOf(k)) + '" font-size="12" text-anchor="end" fill="' + COL[k] + '">' + k + ': ' + R.r.length + ' استجابة، ' + R.w.length + ' مكافأة</text>'; });
      el.querySelector('#rwG').innerHTML = g; }
    function start(k) {
      var s = SCH.find(function (x) { return x[0] === k; }); el.querySelector('#rwD').textContent = s[2]; var b = el.querySelector('#rwB'); b.disabled = false; rec[k] = { r: [], w: [] }; cur = k;
      var t0 = performance.now(), cnt = 0, need = k === 'VR' ? 1 + Math.floor(Math.random() * 9) : 5, last = 0, wait = k === 'VI' ? 1000 + Math.random() * 6000 : 4000;
      b.onclick = function () { var t = performance.now() - t0; if (t > 20000) return; var R = rec[k]; R.r.push(t); cnt++; var win = false;
        if (k === 'FR' || k === 'VR') { if (cnt >= need) { win = true; cnt = 0; need = k === 'VR' ? 1 + Math.floor(Math.random() * 9) : 5; } }
        else if (t - last >= wait) { win = true; last = t; wait = k === 'VI' ? 1000 + Math.random() * 6000 : 4000; }
        if (win) { R.w.push(R.r.length - 1); el.querySelector('#rwR').textContent = '⭐ مكافأة! (' + R.w.length + ')'; }
        plot(); };
      var tick = setInterval(function () { var t = performance.now() - t0, tt = el.querySelector('#rwT'); if (!tt) return clearInterval(tick); tt.textContent = '⏱ ' + Math.max(0, 20 - t / 1000).toFixed(0) + ' ث'; if (t > 20000) { clearInterval(tick); b.disabled = true; done(); } }, 200);
      plot();
    }
    function done() { var n = Object.keys(rec).length; el.querySelector('#rwX').innerHTML = '<div class="notice small"><b>إيه اللي المفروض يظهر؟</b>في تجارب سكنر: <b>VR</b> بيدّي أعلى معدل استجابة وأكثره ثباتًا، وأقوى مقاومة للانطفاء، وده سر ماكينات القمار وإشعارات السوشيال ميديا. <b>FR</b> بيدّي معدل عالي مع وقفة بعد كل مكافأة. <b>FI</b> بيدّي شكل «الصدفة» (scallop): بطء بعد المكافأة وتسارع قبل الموعد، زي المذاكرة قبل الامتحان. <b>VI</b> معدل متوسط ثابت، زي متابعة الرسايل.' + (n < 4 ? ' جرّب الأربع جداول وقارن.' : ' قارن خطوطك: هل ظهر النمط ده عندك؟ ولاحظ إن كروت العلماء في الموقع شغالة بجدول VR.') + '</div>'; }
    el.querySelectorAll('[data-s]').forEach(function (b) { b.onclick = function () { start(b.dataset.s); }; });
    plot();
  }
  if (typeof VIEWS !== 'undefined') VIEWS.schedules = labMount;
  else { var route = function () { if ((location.hash || '').slice(1) !== 'schedules') return; var v = document.getElementById('view'); if (v) labMount(v); }; addEventListener('hashchange', function () { setTimeout(route, 0); }); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(route, 0); }); else setTimeout(route, 0); }
  return { onAnswer: onAnswer, isDue: isDue, dueCount: dueCount, inReview: inReview, collectionHTML: collectionHTML, labMount: labMount };
})();
