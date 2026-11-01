/* ===== Audience adaptation: age group / generation × language register, without breaking measurement =====
   Shared by the scales lab and the statistics lab. Rules:
   - wording may change; the construct, the item's direction (positive/negative), the number of response points and the
     time frame may not — otherwise the versions measure different things and cannot be compared;
   - every adapted version is checked automatically here, then empirically after data collection (DIF / invariance).
   Generation labels are birth cohorts (approximate); what drives wording is reading level and life context. */
var AUD = (function () {
  var PROFILES = [
    { id: 'alpha', t: 'الأطفال 8–12 سنة', g: 'جيل ألفا (مواليد 2013 وما بعدها)', maxW: 9, neg: false, pts: [3, 4], ctx: 'المدرسة، والبيت، والأصدقاء، والألعاب', tips: ['جمل قصيرة جدًا (أقل من 9 كلمات) وكلمات مألوفة', 'تجنب النفي والعبارات المعكوسة؛ الأطفال يخطئون في فهمها', 'تدريج من 3 نقاط بكلمات بسيطة أو وجوه', 'زمن قريب ومحدد: «هذا الأسبوع» بدل «عادةً»', 'اقرأ العبارات بصوت مرتفع للصغار'] },
    { id: 'teen', t: 'المراهقون 13–17 سنة', g: 'جيل Z (مواليد 1997–2012)', maxW: 12, neg: true, pts: [4, 5], ctx: 'المدرسة، والأصدقاء، ووسائل التواصل، والأسرة', tips: ['جمل قصيرة (حتى 12 كلمة)', 'عبارات سالبة قليلة وواضحة، ولا نفي مزدوج', 'لغة غير وعظية ولا تبدو كأسئلة الكبار', 'أكّد السرية: المراهقون أكثر حساسية للمرغوبية الاجتماعية'] },
    { id: 'youth', t: 'الشباب 18–28 سنة', g: 'جيل Z (مواليد 1997–2012)', maxW: 15, neg: true, pts: [5, 7], ctx: 'الجامعة، والعمل الأول، والعلاقات، والحياة الرقمية', tips: ['جمل مباشرة (حتى 15 كلمة)', 'التدريج الخماسي مناسب', 'الأمثلة الرقمية مقبولة في التعليمات لا في العبارات'] },
    { id: 'millennial', t: 'البالغون 29–44 سنة', g: 'جيل الألفية Y (مواليد 1981–1996)', maxW: 18, neg: true, pts: [5, 7], ctx: 'العمل، والأسرة، والأبوة والأمومة', tips: ['الصياغة القياسية مناسبة', 'راعِ ضيق الوقت: مقياس أقصر يرفع جودة الاستجابة'] },
    { id: 'genx', t: 'منتصف العمر 45–60 سنة', g: 'الجيل X (مواليد 1965–1980)', maxW: 16, neg: true, pts: [4, 5], ctx: 'العمل، والأسرة، والصحة', tips: ['فصحى ميسرة غالبًا أوضح من العامية في السياق الرسمي', 'تجنب المصطلحات الرقمية الحديثة غير الشائعة', 'خط أكبر وتباعد مريح'] },
    { id: 'older', t: 'كبار السن 60+ سنة', g: 'جيل الطفرة وما قبله (مواليد قبل 1965)', maxW: 12, neg: false, pts: [3, 4], ctx: 'الصحة، والأسرة، والأنشطة اليومية', tips: ['جمل قصيرة وخط كبير', 'تجنب العبارات المعكوسة؛ تزيد أخطاء الاستجابة', 'تدريج من 3 أو 4 نقاط بكلمات واضحة', 'يمكن التطبيق بالمقابلة بدل الورقة'] }
  ];
  var REGISTERS = [
    { id: 'fusha', t: 'فصحى رسمية', d: 'للمقاييس المقننة والبحوث المنشورة' },
    { id: 'easy', t: 'فصحى ميسرة', d: 'فصحى بكلمات شائعة وتراكيب قصيرة؛ الأنسب لمعظم الفئات' },
    { id: 'ammiya', t: 'عامية مصرية', d: 'أقرب للغة الحياة اليومية؛ مناسبة للأطفال والمراهقين والاستبيانات غير الرسمية' }
  ];
  // phrase-level dictionary (longest first). Output always needs human review.
  var EASY = [['يصعب عليّ', 'من الصعب عليّ'], ['في كثير من الأحيان', 'كثيرًا'], ['لديّ', 'عندي'], ['لدي', 'عندي'], ['المحيطون بي', 'من حولي'], ['أدائي الدراسي', 'دراستي'], ['المهام', 'الأعمال المطلوبة'], ['أتجنب', 'أبتعد عن'], ['أستطيع', 'أقدر'], ['عندما', 'لما']];
  var AMM = [
    ['لا أستطيع', 'مش قادر'], ['ليست لديّ', 'معنديش'], ['ليست لدي', 'معنديش'], ['في كثير من', 'في كتير من'], ['المواقف اليومية', 'مواقف كل يوم'], ['لا أقدر', 'مش قادر'], ['ليس لديّ', 'معنديش'], ['ليس لدي', 'معنديش'], ['في كثير من الأحيان', 'كتير'], ['في المواقف اليومية', 'في يومي'],
    ['يصعب عليّ', 'صعب عليا'], ['أجد صعوبة في', 'بلاقي صعوبة في'], ['يلاحظ المحيطون بي', 'اللي حواليا بياخدوا بالهم من'], ['المحيطون بي', 'اللي حواليا'],
    ['أشعر بالضيق', 'بتضايق'], ['أشعر بأنني', 'بحس إني'], ['أشعر أنني', 'بحس إني'], ['أشعر بـ', 'بحس بـ'], ['أشعر', 'بحس'], ['أستطيع', 'أقدر'],
    ['أفكر', 'بفكر'], ['أحب', 'بحب'], ['أتصرف', 'بتصرف'], ['أتذكر', 'فاكر'], ['أؤجل', 'بأجّل'], ['أنشغل', 'بتلهي'], ['أتجنب', 'ببعد عن'], ['أقلق', 'بقلق'], ['أخاف', 'بخاف'],
    ['أنجز', 'بخلّص'], ['أنام', 'بنام'], ['أستيقظ', 'بصحى'], ['أترك', 'بسيب'], ['أبدأ', 'ببدأ'], ['أضع', 'بحط'], ['ألتزم', 'بلتزم'], ['أواجه', 'بواجه'], ['أهرب', 'بهرب'], ['أفاجأ', 'بتفاجئ'],
    ['أجد نفسي', 'بلاقي نفسي'], ['أتمنى', 'نفسي'], ['أريد', 'عايز'], ['يظهر', 'بيبان'], ['يؤثر', 'بيأثر'], ['يستمر', 'بيفضل'], ['تتكرر', 'بتتكرر'],
    ['لديّ', 'عندي'], ['لدي', 'عندي'], ['عندما', 'لما'], ['الذي', 'اللي'], ['التي', 'اللي'], ['الذين', 'اللي'], ['هذا', 'ده'], ['هذه', 'دي'], ['هؤلاء', 'دول'],
    ['كثيرًا', 'كتير'], ['كثيرا', 'كتير'], ['أحيانًا', 'ساعات'], ['أحيانا', 'ساعات'], ['دائمًا', 'دايمًا'], ['جدًا', 'أوي'], ['الآن', 'دلوقتي'], ['كيف', 'إزاي'], ['لماذا', 'ليه'], ['ماذا', 'إيه'],
    ['ليست', 'مش'], ['ليس', 'مش'], ['لست', 'مش'], ['أكثر من غيري', 'أكتر من غيري'], ['أكثر', 'أكتر'], ['أمام', 'قدام'], ['مع ذلك', 'ومع كده'], ['فقط', 'بس'], ['أيضًا', 'كمان']
  ];
  var LABELS = {
    fusha: { 3: ['تنطبق كثيرًا', 'تنطبق أحيانًا', 'لا تنطبق'], 4: ['تنطبق دائمًا', 'تنطبق غالبًا', 'تنطبق نادرًا', 'لا تنطبق أبدًا'], 5: ['تنطبق دائمًا', 'تنطبق غالبًا', 'تنطبق أحيانًا', 'تنطبق نادرًا', 'لا تنطبق أبدًا'] },
    easy: { 3: ['كثيرًا', 'أحيانًا', 'لا'], 4: ['دائمًا', 'غالبًا', 'قليلًا', 'أبدًا'], 5: ['دائمًا', 'غالبًا', 'أحيانًا', 'نادرًا', 'أبدًا'] },
    ammiya: { 3: ['كتير', 'ساعات', 'لأ'], 4: ['دايمًا', 'غالبًا', 'قليل', 'خالص'], 5: ['دايمًا', 'غالبًا', 'ساعات', 'نادرًا', 'خالص'] }
  };
  var AGREE = { fusha: ['أوافق بشدة', 'أوافق', 'محايد', 'أرفض', 'أرفض بشدة'], easy: ['موافق جدًا', 'موافق', 'مش متأكد', 'غير موافق', 'غير موافق أبدًا'], ammiya: ['موافق جدًا', 'موافق', 'مش متأكد', 'مش موافق', 'مش موافق خالص'] };
  var NEG = /(^|\s)(لا|لم|لن|ليس|ليست|لست|غير|عدم|بدون|دون|مش|ما)(\s|$)/;
  function prof(id) { return PROFILES.filter(function (p) { return p.id === id; })[0] || PROFILES[2]; }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  // whole-word replacement; a first-person verb right after «لم/لن» is left for human review (its negated form differs)
  function swap(text, dict, notes) {
    var t = ' ' + text + ' ';
    dict.slice().sort(function (a, b) { return b[0].length - a[0].length; }).forEach(function (p) {
      var tail = /بـ$/.test(p[0]) ? '' : '(?=$|[\\s.،؟!])';
      t = t.replace(new RegExp('(^|\\s)(لم\\s|لن\\s)?' + esc(p[0]) + tail, 'g'), function (m, sp, neg) {
        if (neg && /^أ/.test(p[0])) { notes && notes.push('negverb'); return m; }
        return sp + (neg || '') + p[1];
      });
    });
    return t.trim();
  }
  function adapt(text, profileId, registerId) {
    var t = String(text || '').replace(/[«»"]/g, ''), notes = [];
    if (registerId === 'ammiya') t = swap(t, AMM, notes); else if (registerId === 'easy') t = swap(t, EASY, notes);
    t = t.replace(/بـ(?=[^\s])/g, 'ب').replace(/\s+/g, ' ').replace(/\s+([.،؟])/g, '$1').trim();
    var w = check(text, t, profileId, registerId);
    if (notes.length) w.push(['warn', 'فيها فعل منفي بـ«لم/لن»؛ صُغه بالعامية يدويًا مع الحفاظ على النفي']);
    if (registerId === 'ammiya' && /(لم|لن|سوف|إنني|لكنني)\s/.test(t)) w.push(['warn', 'ما زالت فيها تراكيب فصحى؛ راجعها']);
    return { text: t, warnings: w };
  }
  // measurement-safety checks between the original and an adapted item
  function check(orig, adapted, profileId, registerId) {
    var w = [], p = prof(profileId), wc = String(adapted).split(/\s+/).filter(Boolean).length, wo = String(orig).split(/\s+/).filter(Boolean).length;
    if (!String(adapted).trim()) return [['bad', 'عبارة فارغة']];
    if (wc > p.maxW) w.push(['warn', 'أطول من المناسب لهذه الفئة (' + wc + ' كلمة؛ الحد ' + p.maxW + ')']);
    if (wo && wc > wo * 1.6 + 2) w.push(['warn', 'أطول كثيرًا من الأصل؛ تأكد أنك لم تضف معنى جديدًا']);
    var negO = NEG.test(' ' + orig + ' '), negA = NEG.test(' ' + adapted + ' ');
    if (negO !== negA) w.push(['bad', 'تغيّر اتجاه العبارة (نفي/إثبات)؛ هذا يغيّر التصحيح ويكسر المقارنة']);
    if (negA && !p.neg) w.push(['warn', 'عبارة منفية لفئة يصعب عليها النفي؛ اكتب بديلًا مثبتًا وعدّل اتجاه التصحيح في كل النسخ']);
    if ((String(adapted).match(/ و/g) || []).length >= 2) w.push(['warn', 'قد تحمل أكثر من فكرة']);
    if (/[؟?]/.test(adapted)) w.push(['warn', 'صيغة سؤال؛ اجعلها عبارة تقريرية']);
    return w;
  }
  function labels(base, profileId, registerId) {
    var n = (base || []).length, isAgree = (base || []).some(function (x) { return /أوافق|موافق|أرفض/.test(x); });
    if (n === 5 && isAgree) return AGREE[registerId] ? AGREE[registerId].slice() : base;
    var L = (LABELS[registerId] || LABELS.fusha)[n];
    return L ? L.slice() : base;
  }
  function instructions(profileId, registerId) {
    var kid = profileId === 'alpha';
    if (registerId === 'ammiya') return kid ? 'هنقرا جمل قصيرة. اختار الإجابة اللي شبهك. مفيش إجابة صح وإجابة غلط.' : 'اقرا كل جملة كويس، واختار الإجابة اللي بتعبّر عنك فعلًا. مفيش إجابة صح وغلط، وإجاباتك سرية.';
    if (registerId === 'easy') return kid ? 'اقرأ كل جملة، واختر الإجابة التي تشبهك. لا توجد إجابة صحيحة وأخرى خاطئة.' : 'اقرأ كل عبارة، واختر الإجابة التي تعبّر عنك. لا توجد إجابات صحيحة أو خاطئة، وإجاباتك سرية.';
    return null;
  }
  function prompt(items, profileId, registerId, construct) {
    var p = prof(profileId), r = REGISTERS.filter(function (x) { return x.id === registerId; })[0] || REGISTERS[0];
    return 'أنت خبير في القياس النفسي وتكييف المقاييس. أعد صياغة عبارات مقياس «' + (construct || 'السمة') + '» لتناسب ' + p.t + ' (' + p.g + ') بلغة: ' + r.t + '.\n' +
      'قواعد إلزامية حتى لا يختل القياس:\n1) احتفظ بالمعنى والسمة المقاسة نفسها؛ لا تضف ولا تحذف فكرة.\n2) احتفظ باتجاه كل عبارة (المثبتة تبقى مثبتة والمنفية تبقى منفية).\n3) احتفظ بالإطار الزمني وشدة العبارة (لا تحوّل «أحيانًا» إلى «دائمًا»).\n4) فكرة واحدة لكل عبارة، وبحد أقصى ' + p.maxW + ' كلمة.\n5) سياقات مألوفة للفئة: ' + p.ctx + '، دون تغيير ما تقيسه العبارة.\n' +
      'أعد JSON فقط: {"items":[{"id":"...","text":"..."}]}\nالعبارات:\n' + items.map(function (x) { return JSON.stringify({ id: x.id, text: x.text }); }).join('\n');
  }
  /* empirical check after data: standardization DIF (Dorans & Kulick) of each item between two versions,
     conditioning on the rest score; returns per-item STD on the item's own scale. */
  function stdDIF(rowsRef, rowsFoc, nItems, lo, hi) {
    var first = stdPass(rowsRef, rowsFoc, nItems, lo, hi, {});
    var drop = {}; first.forEach(function (x, j) { if (x.level === 'flag' || x.level === 'review') drop[j] = 1; });
    return Object.keys(drop).length && Object.keys(drop).length < nItems - 1 ? stdPass(rowsRef, rowsFoc, nItems, lo, hi, drop) : first;
  }
  function stdPass(rowsRef, rowsFoc, nItems, lo, hi, drop) {
    var out = [], R = hi - lo || 1;
    for (var j = 0; j < nItems; j++) {
      var rest = function (r) { var s = 0; for (var k = 0; k < nItems; k++) if (k !== j && !drop[k]) s += r[k]; return s; };
      var all = rowsRef.map(rest).concat(rowsFoc.map(rest)), mn = Math.min.apply(null, all), mx = Math.max.apply(null, all), B = Math.max(1, Math.min(8, Math.round((mx - mn) / 2) + 1)), bw = (mx - mn) / B || 1;
      var bin = function (v) { return Math.min(B - 1, Math.floor((v - mn) / bw)); }, sR = {}, nR = {}, sF = {}, nF = {};
      rowsRef.forEach(function (r) { var b = bin(rest(r)); sR[b] = (sR[b] || 0) + r[j]; nR[b] = (nR[b] || 0) + 1; });
      rowsFoc.forEach(function (r) { var b = bin(rest(r)); sF[b] = (sF[b] || 0) + r[j]; nF[b] = (nF[b] || 0) + 1; });
      var num = 0, den = 0; Object.keys(nF).forEach(function (b) { if (!nR[b]) return; num += nF[b] * (sF[b] / nF[b] - sR[b] / nR[b]); den += nF[b]; });
      var std = den ? num / den : NaN, rel = Math.abs(std) / R;
      out.push({ std: std, level: !isFinite(std) ? 'na' : rel < 0.1 ? 'ok' : rel < 0.2 ? 'review' : 'flag' });
    }
    return out;
  }
  function selectorsHTML(sel, idp) {
    idp = idp || 'au';
    return '<div class="aud-sel"><label class="fl" for="' + idp + 'P">الفئة العمرية المستهدفة</label><select id="' + idp + 'P">' + PROFILES.map(function (p) { return '<option value="' + p.id + '"' + (sel && sel.p === p.id ? ' selected' : '') + '>' + p.t + ' — ' + p.g + '</option>'; }).join('') + '</select>' +
      '<label class="fl" for="' + idp + 'R">لغة الصياغة</label><select id="' + idp + 'R">' + REGISTERS.map(function (r) { return '<option value="' + r.id + '"' + (sel && sel.r === r.id ? ' selected' : '') + '>' + r.t + ' — ' + r.d + '</option>'; }).join('') + '</select></div>';
  }
  function tipsHTML(profileId) { var p = prof(profileId); return '<ul class="aud-tips">' + p.tips.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'; }
  return { PROFILES: PROFILES, REGISTERS: REGISTERS, prof: prof, adapt: adapt, check: check, labels: labels, instructions: instructions, prompt: prompt, stdDIF: stdDIF, selectorsHTML: selectorsHTML, tipsHTML: tipsHTML };
})();
