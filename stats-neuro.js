/* ===== Statistics of brain-encoding models (TRIBE v2 and similar) — route #neuro =====
   How do we judge a model that predicts fMRI responses? Per-region accuracy (Pearson r between predicted and observed
   time series), the noise ceiling from split-half reliability (Spearman–Brown), normalised accuracy, a permutation test
   that respects autocorrelation (circular shifts), and multiple comparisons across regions (Bonferroni vs BH-FDR).
   Runs on simulated data for teaching, or on a CSV of real predictions/observations. */
(function () {
  var E = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var f = function (x, d) { return isFinite(x) ? (+x).toFixed(d == null ? 2 : d) : '—'; };
  function r(a, b) { var n = a.length, ma = 0, mb = 0, i; for (i = 0; i < n; i++) { ma += a[i]; mb += b[i]; } ma /= n; mb /= n; var s = 0, sa = 0, sb = 0; for (i = 0; i < n; i++) { var x = a[i] - ma, y = b[i] - mb; s += x * y; sa += x * x; sb += y * y; } return sa && sb ? s / Math.sqrt(sa * sb) : 0; }
  function gauss() { var u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function smooth(x, k) { var o = x.slice(); for (var i = 1; i < x.length; i++) o[i] = k * o[i - 1] + Math.sqrt(1 - k * k) * x[i]; return o; }
  function simulate(R, T, signal, noise, quality) {
    var regs = [];
    for (var j = 0; j < R; j++) {
      var active = j < Math.round(R * 0.4), s = smooth(Array.from({ length: T }, gauss), 0.8).map(function (v) { return v * (active ? signal : 0.05); });
      var o1 = s.map(function (v) { return v + noise * gauss(); }), o2 = s.map(function (v) { return v + noise * gauss(); });
      var pr = s.map(function (v) { return quality * v + (1 - quality) * signal * gauss() * 0.6; });
      regs.push({ name: (active ? 'منطقة لغوية ' : 'منطقة أخرى ') + (j + 1), pred: pr, o1: o1, o2: o2, active: active });
    }
    return regs;
  }
  function perm(pred, obs, P) { var r0 = r(pred, obs), T = obs.length, ge = 0; for (var p = 0; p < P; p++) { var k = 1 + Math.floor(Math.random() * (T - 1)), sh = obs.slice(k).concat(obs.slice(0, k)); if (r(pred, sh) >= r0) ge++; } return (ge + 1) / (P + 1); }
  function bh(ps, q) { var m = ps.length, idx = ps.map(function (p, i) { return [p, i]; }).sort(function (a, b) { return a[0] - b[0]; }), cut = -1; idx.forEach(function (x, k) { if (x[0] <= q * (k + 1) / m) cut = k; }); var sig = new Array(m).fill(false); for (var k = 0; k <= cut; k++) sig[idx[k][1]] = true; return sig; }
  function analyse(regs, P) {
    var rows = regs.map(function (g) {
      var avg = g.o1.map(function (v, i) { return (v + g.o2[i]) / 2; }), acc = r(g.pred, avg), rh = r(g.o1, g.o2), rel = rh > 0 ? 2 * rh / (1 + rh) : 0, ceil = Math.sqrt(Math.max(0, rel));
      return { name: g.name, active: g.active, acc: acc, rel: rel, ceil: ceil, norm: ceil > 0.05 ? acc / ceil : NaN, p: perm(g.pred, avg, P) };
    });
    var ps = rows.map(function (x) { return x.p; }), fdr = bh(ps, 0.05), m = rows.length;
    rows.forEach(function (x, i) { x.unc = x.p < 0.05; x.bonf = x.p < 0.05 / m; x.fdr = fdr[i]; });
    return rows;
  }
  function bars(rows) {
    var W = 640, H = 220, P = 30, n = rows.length, bw = (W - 2 * P) / n, g = '';
    rows.forEach(function (x, i) { var h = Math.max(0, x.acc) * (H - 2 * P), c = Math.max(0, x.ceil) * (H - 2 * P), X = P + i * bw; g += '<rect x="' + (X + 1) + '" y="' + (H - P - c) + '" width="' + (bw - 2) + '" height="' + c + '" fill="rgba(251,191,36,.25)"/><rect x="' + (X + bw * 0.2) + '" y="' + (H - P - h) + '" width="' + (bw * 0.6) + '" height="' + h + '" fill="' + (x.fdr ? '#c2410c' : '#9aa5b4') + '"><title>' + E(x.name) + ': r=' + f(x.acc) + ' ceiling=' + f(x.ceil) + '</title></rect>'; });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img" aria-label="دقة التنبؤ لكل منطقة مع سقف الضوضاء">' + g + '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - P) + '" y2="' + (H - P) + '" stroke="#888"/><text x="' + (W / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="12">المناطق (البرتقالي = دال بعد FDR · الأصفر الخلفي = سقف الضوضاء)</text></svg>';
  }
  function parseCSV(t) {
    var L = t.replace(/\r/g, '').split('\n').filter(function (l) { return l.trim(); }), h = L[0].split(',').map(function (x) { return x.trim(); }), ix = function (k) { return h.indexOf(k); };
    if ([ix('region'), ix('pred'), ix('obs1'), ix('obs2')].some(function (i) { return i < 0; })) throw new Error('الأعمدة المطلوبة: region,pred,obs1,obs2 (صف لكل نقطة زمنية في كل منطقة)');
    var by = {}; L.slice(1).forEach(function (l) { var c = l.split(','), k = c[ix('region')]; (by[k] = by[k] || { name: k, pred: [], o1: [], o2: [] }); by[k].pred.push(+c[ix('pred')]); by[k].o1.push(+c[ix('obs1')]); by[k].o2.push(+c[ix('obs2')]); });
    var regs = Object.keys(by).map(function (k) { return by[k]; }); if (!regs.length || regs[0].pred.length < 20) throw new Error('يلزم 20 نقطة زمنية على الأقل لكل منطقة'); return regs;
  }
  function render() {
    var v = document.getElementById('view');
    v.innerHTML = '<div class="ex-wrap"><div class="ex-head"><h2>إحصاء النماذج العصبية التنبؤية</h2><span class="ex-badge">TRIBE v2 · ناشئ</span></div>' +
      '<div class="panel"><p style="margin:0">نماذج «الترميز العصبي» مثل <b>TRIBE v2</b> (Meta FAIR، 2026) تتنبأ باستجابة الرنين المغناطيسي الوظيفي (fMRI) لمخ متوسط عند قراءة نص أو مشاهدة فيديو. السؤال الإحصائي: <b>كيف نحكم أن التنبؤ جيد؟</b> ولماذا لا يكفي معامل ارتباط مرتفع في منطقة واحدة؟</p>' +
      '<ol style="margin:8px 0 0"><li><b>دقة التنبؤ:</b> ارتباط بيرسون r بين السلسلة الزمنية المتوقعة والمرصودة في كل منطقة.</li><li><b>سقف الضوضاء:</b> البيانات المرصودة نفسها فيها ضوضاء؛ فنحسب ثباتها من تكرارين (التجزئة النصفية مصححة بسبيرمان–براون)، وأعلى r ممكنة = √الثبات.</li><li><b>الدقة المعيارية</b> = r ÷ السقف: نسبة ما يفسره النموذج مما يمكن تفسيره.</li><li><b>اختبار التباديل بالإزاحة الدائرية:</b> يحافظ على الارتباط الذاتي للسلسلة الزمنية، فيعطي p أصدق من جدول t.</li><li><b>المقارنات المتعددة:</b> مع عشرات المناطق تظهر نتائج دالة بالصدفة؛ نقارن غير المصحح وبونفيروني وبنجاميني–هوخبرج (FDR).</li></ol></div>' +
      '<div class="panel"><h3 style="margin:0 0 6px">جرّب بالمحاكاة</h3><div class="row" style="flex-wrap:wrap;gap:10px">' +
      '<label>المناطق <input type="number" id="nzR" value="30" min="5" max="120" style="width:80px"></label><label>النقاط الزمنية <input type="number" id="nzT" value="200" min="40" max="1000" style="width:90px"></label>' +
      '<label>قوة الإشارة <input type="number" id="nzS" value="1" step="0.1" min="0.1" max="3" style="width:80px"></label><label>الضوضاء <input type="number" id="nzN" value="1.5" step="0.1" min="0.1" max="5" style="width:80px"></label><label>جودة النموذج (0–1) <input type="number" id="nzQ" value="0.6" step="0.05" min="0" max="1" style="width:80px"></label>' +
      '<button class="btn" id="nzGo">شغّل</button></div><p class="muted" style="margin:6px 0 0">في المحاكاة 40% من المناطق فيها إشارة حقيقية والباقي بلا إشارة، لتشاهد كيف تكشف التصحيحات المختلفة النتائج الزائفة.</p>' +
      '<div class="row" style="margin-top:8px"><label>أو ارفع بيانات حقيقية (CSV: region,pred,obs1,obs2) <input type="file" id="nzF" accept=".csv"></label></div></div><div id="nzOut"></div></div>';
    var run = function (regs, sim) {
      var out = document.getElementById('nzOut'); out.innerHTML = '<div class="panel">جارٍ الحساب…</div>';
      setTimeout(function () {
        var Pn = Math.min(5000, Math.max(999, Math.ceil(2 * regs.length / 0.05))), rows = analyse(regs, Pn), cnt = function (k) { return rows.filter(function (x) { return x[k]; }).length; }, falsePos = function (k) { return sim ? rows.filter(function (x) { return x[k] && !x.active; }).length : null; };
        var tbl = '<table class="otbl"><thead><tr><th>المنطقة</th><th>r</th><th>الثبات</th><th>السقف</th><th>المعيارية</th><th>p (تباديل)</th><th>غير مصحح</th><th>بونفيروني</th><th>FDR</th></tr></thead><tbody>' + rows.map(function (x) { return '<tr><th>' + E(x.name) + '</th><td>' + f(x.acc) + '</td><td>' + f(x.rel) + '</td><td>' + f(x.ceil) + '</td><td>' + f(x.norm) + '</td><td>' + (x.p < 0.001 ? '<.001' : f(x.p, 3)) + '</td><td>' + (x.unc ? '✓' : '') + '</td><td>' + (x.bonf ? '✓' : '') + '</td><td>' + (x.fdr ? '✓' : '') + '</td></tr>'; }).join('') + '</tbody></table>';
        out.innerHTML = '<div class="panel"><div class="readouts"><div><span>دال (غير مصحح)</span><b class="num">' + cnt('unc') + (sim ? ' <small>(' + falsePos('unc') + ' زائفة)</small>' : '') + '</b></div><div><span>دال (بونفيروني)</span><b class="num">' + cnt('bonf') + (sim ? ' <small>(' + falsePos('bonf') + ' زائفة)</small>' : '') + '</b></div><div><span>دال (FDR)</span><b class="num">' + cnt('fdr') + (sim ? ' <small>(' + falsePos('fdr') + ' زائفة)</small>' : '') + '</b></div><div><span>متوسط الدقة المعيارية</span><b class="num">' + f(rows.filter(function (x) { return isFinite(x.norm); }).reduce(function (s, x, i, a) { return s + x.norm / a.length; }, 0)) + '</b></div></div>' + bars(rows) +
          '<p class="muted" style="margin:6px 0">' + (sim ? 'لاحظ: بدون تصحيح تظهر مناطق «دالة» بلا إشارة حقيقية؛ بونفيروني يمنعها لكنه يفقد مناطق حقيقية؛ وFDR توازن بين الاثنين. ' : '') + 'الدقة المعيارية القريبة من 1 تعني أن النموذج يفسر تقريبًا كل ما يمكن تفسيره في تلك المنطقة. عدد التباديل ' + Pn + '، فأصغر p ممكنة ≈ ' + f(1 / (Pn + 1), 4) + '؛ ولابد أن تكون أصغر من حد بونفيروني (0.05 ÷ عدد المناطق) وإلا استحال أن يكون أي اختبار دالًا بعد التصحيح.</p>' + tbl + '</div>';
      }, 30);
    };
    document.getElementById('nzGo').onclick = function () { var g = function (id) { return +document.getElementById(id).value; }; run(simulate(Math.max(5, Math.min(120, g('nzR'))), Math.max(40, Math.min(1000, g('nzT'))), g('nzS'), g('nzN'), Math.max(0, Math.min(1, g('nzQ')))), true); };
    document.getElementById('nzF').onchange = function (e) { var fl = e.target.files[0]; if (!fl) return; var rd = new FileReader(); rd.onload = function () { try { run(parseCSV(rd.result), false); } catch (err) { document.getElementById('nzOut').innerHTML = '<div class="panel">' + E(err.message) + '</div>'; } }; rd.readAsText(fl); };
  }
  function route() { var h = (location.hash || '').slice(1).split('/')[0]; if (h !== 'neuro') return; try { setTab('lab'); } catch (e) { } render(); }
  addEventListener('hashchange', function () { setTimeout(route, 0); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(route, 0); }); else setTimeout(route, 0);
})();
