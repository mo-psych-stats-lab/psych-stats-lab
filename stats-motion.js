/* «ملعب الإحصاء» motion layer for the statistics lab.
   Lenis smooth scrolling synced with GSAP ScrollTrigger, a live Galton board in the hero (balls build the normal curve),
   split headline, count-up readouts, and scroll reveals for every page. Reduced-motion viewers get static visuals. */
(function () {
  var G = window.gsap, ST = window.ScrollTrigger, SPLIT = window.SplitText;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, on = !!G && !reduce;
  if (G && ST) G.registerPlugin(ST);
  if (G && SPLIT) G.registerPlugin(SPLIT);
  var lenis = null;
  if (on && window.Lenis && ST) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on('scroll', ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis');
  }
  // keep native scroll inside dialogs, sheets and scrolling panes
  function preventLenis(root) { (root || document).querySelectorAll('.modal,.sheet,.ov,[role="dialog"],.dlg,.sd2,.out,.grid-wrap,.tw,.codebox,#aiPanel').forEach(function (n) { n.setAttribute('data-lenis-prevent', ''); }); }

  /* ---------- Galton board ---------- */
  function galton(cv) {
    var ctx = cv.getContext('2d'), rows = 11, bins = rows + 1, counts = new Array(bins).fill(0), balls = [], n = 0, raf = 0, w = 0, h = 0, dead = false;
    var css = getComputedStyle(document.documentElement);
    var col = { peg: 'rgba(255,255,255,.28)', ball: (css.getPropertyValue('--hero-curve') || '#fb923c').trim(), bar: 'rgba(251,191,36,.38)', curve: '#fde68a', txt: 'rgba(255,255,255,.65)' };
    function fit() { var r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * devicePixelRatio; cv.height = h * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
    function geom() { var top = h * 0.08, bottom = h * 0.56, dx = Math.min(w / (bins + 2), 34), dy = (bottom - top) / rows; return { top: top, bottom: bottom, dx: dx, dy: dy, cx: w / 2, binTop: bottom + dy * 0.6, binH: h - (bottom + dy * 0.6) - 6 }; }
    function pegX(g, r, k) { return g.cx + (k - r / 2) * g.dx; }
    function spawn() { balls.push({ r: 0, k: 0, t: 0, path: [] }); }
    function stats() {
      var tot = 0, m = 0, v = 0; counts.forEach(function (c, i) { tot += c; m += c * i; }); if (!tot) return;
      m /= tot; counts.forEach(function (c, i) { v += c * (i - m) * (i - m); }); v /= tot;
      var N = document.getElementById('galN'), M = document.getElementById('galM'), S = document.getElementById('galS');
      if (N) N.textContent = tot; if (M) M.textContent = m.toFixed(2); if (S) S.textContent = Math.sqrt(v).toFixed(2);
    }
    function draw() {
      if (dead) return; var g = geom(); ctx.clearRect(0, 0, w, h);
      // pegs
      ctx.fillStyle = col.peg; for (var r = 0; r < rows; r++) for (var k = 0; k <= r; k++) { ctx.beginPath(); ctx.arc(pegX(g, r, k), g.top + r * g.dy, 2.2, 0, 7); ctx.fill(); }
      // bins
      var mx = Math.max.apply(null, counts.concat([1]));
      for (var i = 0; i < bins; i++) { var x = g.cx + (i - bins / 2) * g.dx, bh = counts[i] / mx * g.binH; ctx.fillStyle = col.bar; ctx.fillRect(x + 2, g.binTop + g.binH - bh, g.dx - 4, bh); }
      // expected binomial (normal) curve
      var tot = counts.reduce(function (a, b) { return a + b; }, 0);
      if (tot > 20) { ctx.strokeStyle = col.curve; ctx.lineWidth = 2; ctx.beginPath(); var mu = rows / 2, sd = Math.sqrt(rows) / 2;
        for (var px = 0; px <= 120; px++) { var xi = -0.5 + px / 120 * bins, z = (xi - 0.5 - mu) / sd, dens = Math.exp(-z * z / 2) / (sd * Math.sqrt(2 * Math.PI)), yy = g.binTop + g.binH - dens * tot / mx * g.binH, xx = g.cx + (xi - bins / 2) * g.dx;
          if (px === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); } ctx.stroke(); }
      // balls
      ctx.fillStyle = col.ball;
      for (var b = balls.length - 1; b >= 0; b--) {
        var o = balls[b]; o.t += 0.09;
        if (o.t >= 1) { o.t = 0; o.prev = [pegX(g, o.r, o.k), g.top + o.r * g.dy]; o.r++; if (o.r > rows) { counts[o.k]++; n++; balls.splice(b, 1); stats(); continue; } if (Math.random() < 0.5) o.k++; }
        var p0 = o.prev || [g.cx, g.top - g.dy], x1 = o.r < rows ? pegX(g, o.r, o.k) : g.cx + (o.k - bins / 2 + 0.5) * g.dx, y1 = o.r < rows ? g.top + o.r * g.dy : g.binTop;
        var bx = p0[0] + (x1 - p0[0]) * o.t, by = p0[1] + (y1 - p0[1]) * o.t - Math.sin(o.t * Math.PI) * g.dy * 0.3;
        ctx.beginPath(); ctx.arc(bx, by, 3.6, 0, 7); ctx.fill();
      }
      if (n >= 520) { counts = counts.map(function () { return 0; }); n = 0; }
      if (on) { if (Math.random() < 0.55) spawn(); raf = requestAnimationFrame(draw); }
    }
    fit(); addEventListener('resize', fit);
    if (!on) { for (var s = 0; s < 400; s++) { var k = 0; for (var r2 = 0; r2 < rows; r2++) if (Math.random() < 0.5) k++; counts[k]++; } stats(); draw(); }
    else draw();
    return function () { dead = true; cancelAnimationFrame(raf); removeEventListener('resize', fit); };
  }

  /* ---------- page enter + reveals ---------- */
  var stopGalton = null;
  function enter(view) {
    preventLenis(view);
    var cv = view.querySelector('#galton');
    if (stopGalton && !cv) { stopGalton(); stopGalton = null; }
    if (cv && !cv.dataset.on) { cv.dataset.on = '1'; if (stopGalton) stopGalton(); stopGalton = galton(cv); }
    if (!on) return;
    if (ST) ST.getAll().forEach(function (t) { if (t.vars && t.vars.id === 'srv') t.kill(); });
    var h1 = view.querySelector('.hero2 h1');
    if (h1 && SPLIT && !h1.dataset.split) { h1.dataset.split = '1'; var sp = new SPLIT(h1, { type: 'words' }); G.from(sp.words, { yPercent: 100, autoAlpha: 0, duration: 0.7, ease: 'power4.out', stagger: 0.08 }); }
    var hero = view.querySelector('.hero2');
    if (hero) {
      G.from(hero.querySelectorAll('.hero2-kicker,.hero2-lead,.hero2 .row > *,.readouts > div'), { autoAlpha: 0, y: 14, duration: 0.5, ease: 'power2.out', stagger: 0.06, delay: 0.2, clearProps: 'all' });
      hero.querySelectorAll('.readouts b').forEach(function (b) { var m = (b.textContent || '').match(/^(\d+)(.*)$/); if (!m) return; var o = { v: 0 }, end = +m[1], suf = m[2]; G.to(o, { v: end, duration: 1.1, delay: 0.3, ease: 'power2.out', onUpdate: function () { b.textContent = Math.round(o.v) + suf; } }); });
    }
    var items = [].slice.call(view.querySelectorAll('.toolstrip > button, .unit2, .panel, .lcard, .card'));
    if (ST && items.length) {
      G.set(items, { autoAlpha: 0, y: 22 });
      ST.batch(items, { id: 'srv', start: 'top 94%', once: true, onEnter: function (b) { G.to(b, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.05, clearProps: 'transform,opacity,visibility' }); } });
      ST.refresh();
    }
  }
  function boot() {
    var view = document.getElementById('view'); if (!view) return;
    var pend = false;
    new MutationObserver(function () { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; enter(view); }); }).observe(view, { childList: true });
    enter(view);
    addEventListener('hashchange', function () { if (lenis) lenis.scrollTo(0, { immediate: true }); });
    new MutationObserver(function () { preventLenis(document.body); }).observe(document.body, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
