/* ===== Last year's inferential statistics exam (solved), exam-style simulation, and the question bank =====
   Exam: Minia University, Faculty of Education, Dept. of Educational Psychology — Special Diploma (Educational
   Psychology), Inferential Statistics, first term 2025/2026, 2 hours, 70 marks (Dr. Elham Galal). Answers and worked
   solutions are by the lab. Routes: #exam (solved exam + simulation) and #qbank (bank). */
(function () {
  var L4 = ['أ', 'ب', 'ج', 'د'];
  var E = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  function f(x, d) { return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); }

  /* ---------- original exam ---------- */
  var OTF = [
    ['الإحصاء الاستدلالي يستخدم لوصف خصائص العينة فقط دون تعميم النتائج.', 0, 'هذا تعريف الإحصاء الوصفي؛ الاستدلالي يعمم من العينة إلى المجتمع.'],
    ['اختبار T لعينة واحدة يتطلب معرفة الانحراف المعياري للمجتمع.', 0, 'الذي يتطلبه هو اختبار Z؛ اختبار T يستخدم الانحراف المعياري للعينة.'],
    ['الإحصاء البارامتري يتطلب توفر شروط مثل اعتدالية التوزيع وتجانس التباين.', 1, 'ومنها أيضًا العشوائية والمستوى الفئوي أو النسبي للبيانات.'],
    ['العينة العشوائية ضرورية لضمان تمثيلية العينة للمجتمع.', 1, 'العشوائية تعطي كل فرد فرصة متساوية، فتقل التحيزات.'],
    ['مستوى الدلالة 0.05 يعني أننا نتحمل خطأ بنسبة 5% في رفض الفرضية الصفرية إذا كانت صحيحة.', 1, 'هذا هو الخطأ من النوع الأول α.'],
    ['الإحصاء الوصفي يهدف إلى تعميم نتائج العينة على المجتمع.', 0, 'الوصفي يلخص البيانات ويصفها فقط؛ التعميم وظيفة الاستدلالي.'],
    ['الهدف الأساسي للإحصاء الاستدلالي هو تقدير خصائص المجتمع بناءً على إحصاءات العينة.', 1, 'بالتقدير (فترات الثقة) واختبار الفرضيات.'],
    ['الإحصاء اللابارامتري يناسب البيانات التصنيفية والرتبية.', 1, 'مثل كاي تربيع وسبيرمان ومان–ويتني.'],
    ['الفرضية الصفرية تفترض وجود فرق أو علاقة بين المتغيرات.', 0, 'الصفرية تفترض عدم وجود فرق أو علاقة؛ والبديلة تفترض وجودهما.'],
    ['اختبار ANOVA يستخدم لمقارنة متوسطين فقط.', 0, 'يقارن ثلاثة متوسطات أو أكثر في وقت واحد.'],
    ['معامل الارتباط (r = 0) يعني أن المتغيرين غير مرتبطين.', 1, 'أي لا توجد علاقة خطية بينهما (قد توجد علاقة غير خطية).'],
    ['الإحصاء اللابارامتري مناسب فقط للعينات الكبيرة والبيانات الكمية.', 0, 'يناسب العينات الصغيرة والبيانات الاسمية والرتبية.'],
    ['الخطأ المعياري يتناسب طرديًا مع حجم العينة.', 0, 'يتناسب عكسيًا: SE = σ ÷ √n، فكلما زاد n قل الخطأ.'],
    ['اختبار Z يستخدم عندما يكون حجم العينة أقل من 30.', 0, 'Z للعينات الكبيرة (n ≥ 30) أو حين يُعرف σ؛ والعينات الصغيرة لها T.'],
    ['قيمة Z لعينة متوسطها 80 ومتوسط المجتمع 75 والخطأ المعياري 2 هي 2.5.', 1, 'Z = (80 − 75) ÷ 2 = 2.5.']
  ];
  var OMCQ = [
    ['أي من الأدوات التالية ليست من أدوات الإحصاء الاستدلالي؟', ['تقدير فترة الثقة', 'حساب المتوسط الحسابي للعينة', 'اختبار الفرضيات', 'تحليل الانحدار'], 1, 'المتوسط الحسابي للعينة إحصاء وصفي.'],
    ['إذا كان معامل الارتباط بين متغيرين يساوي +0.90 فإن العلاقة بينهما تكون:', ['طردية قوية', 'عكسية قوية', 'ضعيفة', 'معدومة'], 0, 'الإشارة موجبة والقيمة قريبة من 1.'],
    ['اختبار T لعينتين مستقلتين يتطلب:', ['أن تكون العينات مرتبطة', 'أن يكون حجم العينة أقل من 30', 'تجانس التباين بين العينتين', 'أن يكون الانحراف المعياري للمجتمع معروفًا'], 2, 'يُفحص بليفين؛ وعند عدم التجانس يُستخدم تصحيح ويلش.'],
    ['الفرضية البديلة الموجهة (One-Tailed) تعني:', ['أن منطقة الرفض موزعة على طرفي التوزيع', 'أن الباحث يتوقع فرقًا في اتجاه محدد', 'أن الفرضية الصفرية دائمًا صحيحة', 'أن مستوى الدلالة يكون 0.01 دائمًا'], 1, 'منطقة الرفض في طرف واحد.'],
    ['أي من الاختبارات التالية يُعتبر اختبارًا لا بارامتريًا؟', ['اختبار Z', 'اختبار T', 'اختبار كاي تربيع', 'تحليل التباين ANOVA'], 2, 'كاي تربيع للتكرارات والبيانات الاسمية.'],
    ['أي من الشروط التالية ليس من شروط استخدام الإحصاء البارامتري؟', ['اعتدالية توزيع المجتمع', 'تجانس التباين', 'بيانات نوعية (اسمية)', 'عينات عشوائية'], 2, 'البيانات الاسمية تناسب اللابارامتري.'],
    ['إذا كانت القيمة الاحتمالية (p-value) في اختبار الفرضيات تساوي 0.03 ومستوى الدلالة 0.05، فإن القرار المناسب هو:', ['قبول الفرضية الصفرية', 'رفض الفرضية الصفرية', 'عدم وجود معلومات كافية', 'إعادة الاختبار'], 1, 'p = 0.03 < α = 0.05 ← نرفض الصفرية والنتيجة دالة.'],
    ['أي من الاختبارات التالية يناسب مقارنة أكثر من متوسطين في وقت واحد؟', ['اختبار Z', 'اختبار T لعينتين', 'اختبار ANOVA', 'معامل الارتباط'], 2, 'تحليل التباين.'],
    ['الفرضية البديلة غير الموجهة (Two-Tailed Test) تعني:', ['توقع فرق في اتجاه محدد', 'توقع وجود فرق دون تحديد اتجاهه', 'توقع تساوي المجموعات', 'توقع علاقة طردية فقط'], 1, 'منطقة الرفض موزعة على الطرفين.'],
    ['معامل ارتباط سبيرمان يستخدم للبيانات:', ['الكمية ذات التوزيع الطبيعي', 'النسبية فقط', 'الرتبية (الترتيبية)', 'الاسمية'], 2, 'ارتباط الرتب.'],
    ['مستوى الدلالة (α = 0.01) يعني:', ['احتمال 1% لرفض فرضية صفرية صحيحة', 'احتمال 99% لقبول فرضية صفرية خاطئة', 'ثقة 1% في النتائج', 'جميع ما سبق'], 0, 'الخطأ من النوع الأول.'],
    ['اختبار كاي تربيع (Chi-Square) يستخدم أساسًا للبيانات:', ['الكمية المستمرة', 'الفئوية (التصنيفية)', 'ذات التوزيع الطبيعي', 'جميع ما سبق'], 1, 'يقارن التكرارات المشاهدة بالمتوقعة.'],
    ['أي من التالي يعتبر من مزايا الإحصاء اللابارامتري؟', ['يحتاج إلى عينات كبيرة', 'يتطلب توزيعًا طبيعيًا', 'يناسب العينات الصغيرة', 'أكثر دقة من البارامتري دائمًا'], 2, 'ولا يشترط شكل التوزيع.'],
    ['اختبار T لعينتين مرتبطتين يستخدم عندما:', ['العينتان مستقلتان تمامًا', 'القياسات مأخوذة من نفس الأفراد في وقتين مختلفين', 'حجم العينة أقل من 15', 'التباين غير متجانس'], 1, 'مثل القياس القبلي والبعدي.'],
    ['في اختبار T لعينتين مستقلتين، درجات الحرية (df) تساوي:', ['n₁ + n₂ − 2', 'n − 1', 'n₁ + n₂ − 1', 'n'], 0, 'نطرح 1 عن كل عينة.']
  ];
  var OPROB = [
    { t: 'السؤال الثالث (15 درجة): كاي تربيع لجودة المطابقة', q: 'ادّعت إحدى الدراسات أن نسبة الطلاب الذين يستخدمون المكتبة في جامعة معينة هي 20%. أُخذت عينة عشوائية مكونة من 150 طالبًا، فوجد أن 40 منهم يستخدمون المكتبة بانتظام. هل يمكن قبول هذا الادعاء عند مستوى دلالة 0.05؟ علمًا بأن χ²(0.05) = 3.84.',
      a: '<p><b>الفرضيات:</b> H₀: نسبة المستخدمين = 20% · H₁: النسبة ≠ 20%.</p><table class="ex-t"><tr><th></th><th>يستخدمون</th><th>لا يستخدمون</th><th>المجموع</th></tr><tr><td>المشاهد O</td><td>40</td><td>110</td><td>150</td></tr><tr><td>المتوقع E</td><td>150 × 0.20 = 30</td><td>150 × 0.80 = 120</td><td>150</td></tr></table><p>χ² = Σ (O − E)² ÷ E = (40 − 30)² ÷ 30 + (110 − 120)² ÷ 120 = 100 ÷ 30 + 100 ÷ 120 = 3.333 + 0.833 = <b>4.17</b></p><p>درجات الحرية = عدد الفئات − 1 = 1، والقيمة الجدولية 3.84.</p><p><b>القرار:</b> 4.17 &gt; 3.84 ← نرفض الفرضية الصفرية؛ أي <b>لا يمكن قبول الادعاء</b>، فنسبة المستخدمين في العينة (40 ÷ 150 ≈ 26.7%) تختلف دالًا عن 20%.</p><p class="muted">تحقق: باختبار Z للنسبة: Z = (0.267 − 0.20) ÷ √(0.2 × 0.8 ÷ 150) = 0.0667 ÷ 0.0327 = 2.04، وZ² = 4.17 = χ²، و2.04 &gt; 1.96.</p>' },
    { t: 'السؤال الرابع (15 درجة): معامل ارتباط بيرسون', q: 'أجرى باحث دراسة لمعرفة العلاقة بين عدد ساعات المذاكرة (X) والدرجة النهائية (Y) لـ 6 طلاب: X = 2، 4، 3، 5، 6، 3 · Y = 6، 7، 6، 8، 9، 6. احسب معامل ارتباط بيرسون وحدد قوة العلاقة.',
      a: '<table class="ex-t"><tr><th>X</th><th>Y</th><th>XY</th><th>X²</th><th>Y²</th></tr><tr><td>2</td><td>6</td><td>12</td><td>4</td><td>36</td></tr><tr><td>4</td><td>7</td><td>28</td><td>16</td><td>49</td></tr><tr><td>3</td><td>6</td><td>18</td><td>9</td><td>36</td></tr><tr><td>5</td><td>8</td><td>40</td><td>25</td><td>64</td></tr><tr><td>6</td><td>9</td><td>54</td><td>36</td><td>81</td></tr><tr><td>3</td><td>6</td><td>18</td><td>9</td><td>36</td></tr><tr><th>23</th><th>42</th><th>170</th><th>99</th><th>302</th></tr></table><p>r = [nΣXY − ΣX ΣY] ÷ √([nΣX² − (ΣX)²][nΣY² − (ΣY)²])</p><p>= [6 × 170 − 23 × 42] ÷ √([6 × 99 − 23²][6 × 302 − 42²]) = (1020 − 966) ÷ √(65 × 48) = 54 ÷ √3120 = 54 ÷ 55.86 = <b>0.97</b></p><p><b>التفسير:</b> علاقة <b>طردية قوية جدًا</b>: كلما زادت ساعات المذاكرة زادت الدرجة النهائية.</p>' },
    { t: 'السؤال الخامس (10 درجات): اختبار ت لعينتين مستقلتين', q: 'أراد باحث مقارنة متوسط درجات الطلاب في مادة الرياضيات بين مدرستين (أ، ب): المدرسة أ: n₁ = 25، μ₁ = 75، SD₁ = 8 · المدرسة ب: n₂ = 25، μ₂ = 80، SD₂ = 10. اختبر الفرضية أن هناك فرقًا بين متوسطي الدرجات عند مستوى دلالة 0.05، علمًا بأن T(0.05) = 2.01.',
      a: '<p><b>الفرضيات:</b> H₀: μ₁ = μ₂ · H₁: μ₁ ≠ μ₂ (ذيلين).</p><p>التباين المشترك: S²p = [(n₁ − 1)S₁² + (n₂ − 1)S₂²] ÷ (n₁ + n₂ − 2) = (24 × 64 + 24 × 100) ÷ 48 = 3936 ÷ 48 = 82</p><p>الخطأ المعياري للفرق: √[S²p (1/n₁ + 1/n₂)] = √(82 × 0.08) = √6.56 = 2.561</p><p>t = (75 − 80) ÷ 2.561 = <b>−1.95</b> · درجات الحرية = 25 + 25 − 2 = 48</p><p><b>القرار:</b> |t| = 1.95 &lt; 2.01 ← نقبل الفرضية الصفرية؛ <b>لا يوجد فرق دال</b> بين متوسطي المدرستين عند 0.05 (الفرق 5 درجات قد يرجع للصدفة).</p><p class="muted">ملاحظة: لأن العينتين متساويتان في الحجم، يعطي تصحيح ويلش الخطأ المعياري نفسه √(64/25 + 100/25) = 2.561.</p>' }
  ];

  /* ---------- extra exam-style pool ---------- */
  var XTF = [
    ['الخطأ من النوع الثاني هو قبول فرضية صفرية خاطئة.', 1, 'ويُرمز له β، وقوة الاختبار = 1 − β.'],
    ['زيادة حجم العينة تزيد قوة الاختبار الإحصائي.', 1, 'لأن الخطأ المعياري يقل.'],
    ['فترة الثقة 95% أضيق من فترة الثقة 99% للبيانات نفسها.', 1, 'الثقة الأعلى تحتاج فترة أعرض.'],
    ['القيمة الاحتمالية p هي احتمال أن تكون الفرضية الصفرية صحيحة.', 0, 'هي احتمال الحصول على نتيجة بهذا التطرف أو أكثر إذا كانت الصفرية صحيحة.'],
    ['إذا كانت قيمة t المحسوبة أكبر من الجدولية نرفض الفرضية الصفرية.', 1, 'النتيجة دالة.'],
    ['درجات الحرية لاختبار T لعينة واحدة تساوي n − 1.', 1, ''],
    ['درجات الحرية لاختبار T لعينتين مرتبطتين تساوي n₁ + n₂ − 2.', 0, 'تساوي n − 1 حيث n عدد الأزواج.'],
    ['في اختبار كاي تربيع لجدول اقتران 3 × 2 تكون درجات الحرية 2.', 1, '(3 − 1)(2 − 1) = 2.'],
    ['يشترط في كاي تربيع ألا تقل التكرارات المتوقعة في الخلية غالبًا عن 5.', 1, 'وإلا تُدمج الفئات أو يُستخدم اختبار فيشر.'],
    ['معامل الارتباط −0.85 أضعف من +0.60.', 0, 'القوة بالقيمة المطلقة: 0.85 أقوى؛ والإشارة للاتجاه فقط.'],
    ['الارتباط القوي بين متغيرين يثبت أن أحدهما سبب للآخر.', 0, 'الارتباط لا يعني السببية.'],
    ['مربع معامل الارتباط r² يمثل نسبة التباين المشترك بين المتغيرين.', 1, 'معامل التحديد.'],
    ['اختبار مان–ويتني هو البديل اللابارامتري لاختبار T لعينتين مستقلتين.', 1, ''],
    ['اختبار ويلكوكسون هو البديل اللابارامتري لاختبار T لعينتين مرتبطتين.', 1, ''],
    ['اختبار كروسكال–واليس هو البديل اللابارامتري لتحليل التباين الأحادي.', 1, ''],
    ['النسبة الفائية F في تحليل التباين = التباين بين المجموعات ÷ التباين داخل المجموعات.', 1, 'متوسط مربعات بين ÷ متوسط مربعات داخل.'],
    ['إذا كانت F دالة في تحليل التباين نعرف مباشرة أي المجموعات تختلف.', 0, 'نحتاج مقارنات بعدية مثل شيفيه أو توكي.'],
    ['اختبار ليفين يستخدم لفحص تجانس التباين.', 1, 'شرط لاختبار T المستقل وANOVA.'],
    ['التوزيع الطبيعي متماثل ومتوسطه ووسيطه ومنواله متساوية.', 1, ''],
    ['يقع نحو 95% من قيم التوزيع الطبيعي بين −1.96 و+1.96 انحرافًا معياريًا.', 1, ''],
    ['القيمة الحرجة لـ Z عند 0.05 لاختبار ذيلين = 1.645.', 0, '1.96 لذيلين، و1.645 لذيل واحد.'],
    ['حجم الأثر يوضح أهمية الفرق عمليًا بغض النظر عن حجم العينة.', 1, 'مثل d لكوهين وإيتا تربيع.'],
    ['d لكوهين = 0.8 يعني أثرًا كبيرًا.', 1, '0.2 صغير، 0.5 متوسط، 0.8 كبير.'],
    ['الإحصاءة تصف المجتمع والمعلمة تصف العينة.', 0, 'العكس: المعلمة (μ، σ) للمجتمع، والإحصاءة (x̄، s) للعينة.'],
    ['العينة الطبقية تقسم المجتمع إلى فئات ثم تسحب عشوائيًا من كل فئة.', 1, ''],
    ['الخطأ المعياري للمتوسط = الانحراف المعياري ÷ √n.', 1, ''],
    ['انخفاض مستوى الدلالة من 0.05 إلى 0.01 يزيد احتمال الخطأ من النوع الأول.', 0, 'يقلله، لكنه يزيد احتمال الخطأ من النوع الثاني.'],
    ['معامل ارتباط فاي يستخدم بين متغيرين ثنائيين.', 1, ''],
    ['معامل الارتباط الثنائي الأصيل (بوينت بايسيريال) يستخدم بين متغير ثنائي ومتغير متصل.', 1, ''],
    ['اختبار T يمكن استخدامه لاختبار دلالة معامل الارتباط.', 1, 't = r√(n − 2) ÷ √(1 − r²).']
  ];
  var XMCQ = [
    ['الخطأ من النوع الأول هو:', ['رفض فرضية صفرية صحيحة', 'قبول فرضية صفرية خاطئة', 'رفض فرضية بديلة صحيحة', 'خطأ في الحساب'], 0, 'احتماله α.'],
    ['قوة الاختبار الإحصائي تساوي:', ['α', 'β', '1 − β', '1 − α'], 2, ''],
    ['القيمة الحرجة لـ Z لاختبار ذيلين عند 0.05:', ['1.645', '1.96', '2.33', '2.58'], 1, ''],
    ['القيمة الحرجة لـ Z لاختبار ذيلين عند 0.01:', ['1.96', '2.33', '2.58', '3.29'], 2, ''],
    ['عينة n = 36، x̄ = 52، σ = 12، μ = 50؛ قيمة Z:', ['0.17', '1.00', '2.00', '6.00'], 1, 'SE = 12 ÷ 6 = 2؛ Z = 2 ÷ 2 = 1.'],
    ['الخطأ المعياري لعينة n = 100 وانحرافها المعياري 20:', ['0.2', '2', '10', '20'], 1, '20 ÷ √100 = 2.'],
    ['درجات الحرية لاختبار T لعينة واحدة حجمها 20:', ['18', '19', '20', '21'], 1, 'n − 1.'],
    ['درجات الحرية لاختبار T لعينتين مرتبطتين من 15 زوجًا:', ['13', '14', '28', '30'], 1, 'n − 1 = 14.'],
    ['درجات الحرية لكاي تربيع في جدول 2 × 4:', ['3', '4', '6', '8'], 0, '(2 − 1)(4 − 1) = 3.'],
    ['القيمة الجدولية لكاي تربيع بدرجة حرية 1 عند 0.05:', ['1.96', '2.71', '3.84', '5.99'], 2, ''],
    ['القيمة الجدولية لكاي تربيع بدرجتي حرية عند 0.05:', ['3.84', '5.99', '7.81', '9.49'], 1, ''],
    ['البديل اللابارامتري لاختبار T لعينتين مستقلتين:', ['ويلكوكسون', 'مان–ويتني', 'فريدمان', 'كروسكال–واليس'], 1, ''],
    ['البديل اللابارامتري لتحليل التباين الأحادي:', ['مان–ويتني', 'ويلكوكسون', 'كروسكال–واليس', 'كاي تربيع'], 2, ''],
    ['معامل التحديد لـ r = 0.70:', ['0.49', '0.70', '0.84', '0.30'], 0, 'r² = 0.49 ← 49% تباين مشترك.'],
    ['أي قيم معامل الارتباط التالية تدل على أقوى علاقة؟', ['0.65', '−0.80', '0.30', '−0.10'], 1, 'بالقيمة المطلقة.'],
    ['في تحليل التباين الأحادي لثلاث مجموعات كل منها 10 أفراد، درجات الحرية بين وداخل:', ['2 و27', '3 و30', '2 و30', '3 و27'], 0, 'k − 1 = 2، N − k = 27.'],
    ['بعد F دالة في ANOVA نستخدم:', ['اختبار ليفين', 'المقارنات البعدية (شيفيه، توكي)', 'كاي تربيع', 'اختبار Z'], 1, ''],
    ['لاختبار تجانس التباين نستخدم:', ['ليفين', 'شابيرو–ويلك', 'كولموجوروف', 'بيرسون'], 0, ''],
    ['لاختبار اعتدالية التوزيع نستخدم:', ['ليفين', 'شابيرو–ويلك', 'مان–ويتني', 'شيفيه'], 1, ''],
    ['إذا كان p = 0.08 وα = 0.05:', ['نرفض الصفرية', 'لا نرفض الصفرية', 'نرفض البديلة دائمًا', 'النتيجة دالة جدًا'], 1, 'p > α.'],
    ['اختبار مناسب لمقارنة درجات مجموعة واحدة قبل برنامج وبعده:', ['T لعينتين مستقلتين', 'T لعينتين مرتبطتين', 'كاي تربيع', 'ANOVA'], 1, ''],
    ['اختبار مناسب لدراسة العلاقة بين النوع (ذكر/أنثى) والتخصص (علمي/أدبي):', ['بيرسون', 'كاي تربيع للاستقلال', 'T', 'ANOVA'], 1, 'متغيران اسميان.'],
    ['حجم الأثر d لكوهين = 0.5 يعني أثرًا:', ['صغيرًا', 'متوسطًا', 'كبيرًا', 'معدومًا'], 1, ''],
    ['المعلمة التي تمثل متوسط المجتمع:', ['x̄', 'μ', 's', 'r'], 1, ''],
    ['عند زيادة حجم العينة أربعة أضعاف، فإن الخطأ المعياري:', ['يتضاعف', 'ينخفض إلى النصف', 'ينخفض إلى الربع', 'لا يتغير'], 1, '√4 = 2.'],
    ['فترة الثقة 95% للمتوسط = x̄ ± :', ['1.645 SE', '1.96 SE', '2.58 SE', 'SE'], 1, ''],
    ['اختبار t لدلالة r = 0.50 مع n = 27:', ['1.50', '2.89', '3.00', '5.00'], 1, 't = 0.5√25 ÷ √0.75 = 2.5 ÷ 0.866 = 2.89.'],
    ['معامل الارتباط المناسب بين ترتيب 10 طلاب في مادتين:', ['بيرسون', 'سبيرمان', 'فاي', 'كاي تربيع'], 1, ''],
    ['أي مما يلي من شروط اختبار T لعينتين مستقلتين؟', ['اعتدالية التوزيع', 'تجانس التباين', 'استقلال العينتين', 'جميع ما سبق'], 3, ''],
    ['إذا رفضنا الصفرية عند 0.01 فإننا:', ['نرفضها أيضًا عند 0.05', 'نقبلها عند 0.05', 'لا نعرف عند 0.05', 'نعيد الاختبار'], 0, 'p < 0.01 < 0.05.']
  ];

  /* ---------- problem generators (new numbers every time) ---------- */
  var RI = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); };
  var TCRIT = { 10: 2.228, 12: 2.179, 14: 2.145, 16: 2.120, 18: 2.101, 20: 2.086, 22: 2.074, 24: 2.064, 26: 2.056, 28: 2.048, 30: 2.042, 38: 2.024, 40: 2.021, 48: 2.011, 58: 2.002, 60: 2.000, 78: 1.991, 98: 1.984 };
  var GEN = {
    chi: function () { var p0 = [10, 15, 20, 25, 30, 40][RI(0, 5)], n = [100, 120, 150, 200, 250][RI(0, 4)], e1 = n * p0 / 100, o1 = Math.round(e1 + (Math.random() < 0.5 ? -1 : 1) * RI(2, Math.max(3, Math.round(e1 * 0.45)))), o2 = n - o1, e2 = n - e1, x2 = Math.pow(o1 - e1, 2) / e1 + Math.pow(o2 - e2, 2) / e2;
      return { t: 'كاي تربيع لجودة المطابقة', q: 'ادّعت دراسة أن نسبة الطلاب الذين يمارسون الرياضة بانتظام هي ' + p0 + '%. سُحبت عينة عشوائية من ' + n + ' طالبًا فوجد أن ' + o1 + ' منهم يمارسونها. هل يمكن قبول الادعاء عند 0.05؟ (χ²(0.05، 1) = 3.84)',
        a: '<p>E₁ = ' + n + ' × ' + (p0 / 100) + ' = ' + f(e1, 1) + ' · E₂ = ' + f(e2, 1) + '</p><p>χ² = (' + o1 + ' − ' + f(e1, 1) + ')² ÷ ' + f(e1, 1) + ' + (' + o2 + ' − ' + f(e2, 1) + ')² ÷ ' + f(e2, 1) + ' = <b>' + f(x2, 2) + '</b></p><p><b>القرار:</b> ' + (x2 > 3.84 ? f(x2, 2) + ' &gt; 3.84 ← نرفض الادعاء (النسبة تختلف دالًا).' : f(x2, 2) + ' &lt; 3.84 ← نقبل الادعاء (لا فرق دال).') + '</p>' }; },
    pearson: function () { var n = 6, X = [], Y = [], i; for (i = 0; i < n; i++) { var x = RI(1, 9); X.push(x); Y.push(Math.max(1, Math.min(12, Math.round(x * (Math.random() < 0.8 ? 1 : -1) * 0.8 + RI(1, 4))))); }
      var sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0; for (i = 0; i < n; i++) { sx += X[i]; sy += Y[i]; sxy += X[i] * Y[i]; sx2 += X[i] * X[i]; sy2 += Y[i] * Y[i]; }
      var num = n * sxy - sx * sy, den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy)); if (!den) return GEN.pearson(); var r = num / den, ar = Math.abs(r);
      return { t: 'معامل ارتباط بيرسون', q: 'احسب معامل ارتباط بيرسون بين X وY لستة طلاب وحدد قوة العلاقة: X = ' + X.join('، ') + ' · Y = ' + Y.join('، '),
        a: '<p>ΣX = ' + sx + '، ΣY = ' + sy + '، ΣXY = ' + sxy + '، ΣX² = ' + sx2 + '، ΣY² = ' + sy2 + '</p><p>r = (' + n + ' × ' + sxy + ' − ' + sx + ' × ' + sy + ') ÷ √[(' + n + ' × ' + sx2 + ' − ' + sx + '²)(' + n + ' × ' + sy2 + ' − ' + sy + '²)] = ' + num + ' ÷ ' + f(den, 2) + ' = <b>' + f(r, 2) + '</b></p><p><b>التفسير:</b> علاقة ' + (r >= 0 ? 'طردية' : 'عكسية') + ' ' + (ar >= 0.8 ? 'قوية جدًا' : ar >= 0.6 ? 'قوية' : ar >= 0.4 ? 'متوسطة' : ar >= 0.2 ? 'ضعيفة' : 'ضعيفة جدًا') + '.</p>' }; },
    tind: function () { var n = [10, 12, 15, 20, 25, 30][RI(0, 5)], m1 = RI(60, 80), m2 = m1 + RI(-9, 9), s1 = RI(6, 12), s2 = RI(6, 12), df = 2 * n - 2, sp2 = ((n - 1) * s1 * s1 + (n - 1) * s2 * s2) / df, se = Math.sqrt(sp2 * 2 / n), t = (m1 - m2) / se, tc = TCRIT[df] || 2.0;
      return { t: 'اختبار ت لعينتين مستقلتين', q: 'قارن باحث بين مجموعتين في درجات القلق: المجموعة أ: n = ' + n + '، M = ' + m1 + '، SD = ' + s1 + ' · المجموعة ب: n = ' + n + '، M = ' + m2 + '، SD = ' + s2 + '. اختبر الفرق عند 0.05 (T الجدولية = ' + tc + ').',
        a: '<p>S²p = [(' + (n - 1) + ' × ' + s1 * s1 + ') + (' + (n - 1) + ' × ' + s2 * s2 + ')] ÷ ' + df + ' = ' + f(sp2, 2) + '</p><p>SE = √(' + f(sp2, 2) + ' × 2/' + n + ') = ' + f(se, 3) + ' · t = (' + m1 + ' − ' + m2 + ') ÷ ' + f(se, 3) + ' = <b>' + f(t, 2) + '</b> · df = ' + df + '</p><p><b>القرار:</b> ' + (Math.abs(t) > tc ? '|t| &gt; ' + tc + ' ← يوجد فرق دال.' : '|t| &lt; ' + tc + ' ← لا يوجد فرق دال.') + '</p>' }; },
    z: function () { var n = [36, 49, 64, 100][RI(0, 3)], sig = RI(8, 20), mu = RI(50, 80), xb = mu + RI(-6, 6) || mu + 3, se = sig / Math.sqrt(n), z = (xb - mu) / se;
      return { t: 'اختبار Z لعينة واحدة', q: 'متوسط درجات الذكاء في المجتمع ' + mu + ' وانحرافه المعياري ' + sig + '. أُخذت عينة من ' + n + ' طالبًا فكان متوسطها ' + xb + '. هل يختلف متوسط العينة عن المجتمع عند 0.05؟ (Z الحرجة = 1.96)',
        a: '<p>SE = σ ÷ √n = ' + sig + ' ÷ ' + Math.sqrt(n) + ' = ' + f(se, 3) + '</p><p>Z = (' + xb + ' − ' + mu + ') ÷ ' + f(se, 3) + ' = <b>' + f(z, 2) + '</b></p><p><b>القرار:</b> ' + (Math.abs(z) > 1.96 ? '|Z| &gt; 1.96 ← فرق دال.' : '|Z| &lt; 1.96 ← لا فرق دال.') + '</p>' }; },
    t1: function () { var n = [11, 13, 15, 17, 19, 21][RI(0, 5)], mu = RI(40, 70), xb = mu + RI(-7, 7) || mu + 4, s = RI(5, 12), df = n - 1, se = s / Math.sqrt(n), t = (xb - mu) / se, tc = TCRIT[df] || 2.1;
      return { t: 'اختبار ت لعينة واحدة', q: 'متوسط الدرجة على مقياس للتوافق في المجتمع ' + mu + '. طُبق على عينة من ' + n + ' طالبًا فكان المتوسط ' + xb + ' والانحراف المعياري ' + s + '. اختبر الفرق عند 0.05 (T الجدولية بدرجة حرية ' + df + ' = ' + tc + ').',
        a: '<p>SE = s ÷ √n = ' + s + ' ÷ √' + n + ' = ' + f(se, 3) + '</p><p>t = (' + xb + ' − ' + mu + ') ÷ ' + f(se, 3) + ' = <b>' + f(t, 2) + '</b> · df = ' + df + '</p><p><b>القرار:</b> ' + (Math.abs(t) > tc ? '|t| &gt; ' + tc + ' ← فرق دال.' : '|t| &lt; ' + tc + ' ← لا فرق دال.') + '</p>' }; }
  };

  /* ---------- bank assembly ---------- */
  var ALL = null;
  function bank() {
    if (ALL) return ALL; var out = [], add = function (o) { o.id = out.length; out.push(o); };
    OTF.forEach(function (x) { add({ type: 'tf', q: x[0], a: x[1], w: x[2], src: 'امتحان 2025/2026' }); });
    OMCQ.forEach(function (x) { add({ type: 'mcq', q: x[0], o: x[1], a: x[2], w: x[3], src: 'امتحان 2025/2026' }); });
    XTF.forEach(function (x) { add({ type: 'tf', q: x[0], a: x[1], w: x[2], src: 'بنمط الامتحان' }); });
    XMCQ.forEach(function (x) { add({ type: 'mcq', q: x[0], o: x[1], a: x[2], w: x[3], src: 'بنمط الامتحان' }); });
    try { allQ().forEach(function (x) { add({ type: 'mcq', q: x.q, o: x.o, a: x.a, w: x.w || '', src: 'الدروس: ' + (x.src || '') }); }); } catch (e) { }
    OPROB.forEach(function (p) { add({ type: 'prob', q: p.t + ': ' + p.q, ans: p.a, src: 'امتحان 2025/2026' }); });
    ['chi', 'pearson', 'tind', 'z', 't1'].forEach(function (k) { add({ type: 'gen', g: k, q: GEN[k]().t + ' (أرقام جديدة في كل مرة)', src: 'مولّد مسائل' }); });
    return (ALL = out);
  }
  var TYPES = [['tf', 'صح وخطأ'], ['mcq', 'اختيار من متعدد'], ['prob', 'مسائل الامتحان'], ['gen', 'مولّد مسائل']];
  var SRC = [['', 'كل المصادر'], ['امتحان', 'امتحان السنة الماضية'], ['بنمط', 'بنمط الامتحان'], ['الدروس', 'أسئلة الدروس']];
  var st = { type: '', src: '', q: '', page: 0 }, PER = 25;
  function pts(n) { try { S.xp = (S.xp || 0) + n; save(); renderBar(); } catch (e) { } }

  function ansHTML(x) {
    if (x.type === 'tf') return '<b>' + (x.a ? '✓ صحيحة' : '✗ خاطئة') + '</b> — ' + E(x.w);
    if (x.type === 'mcq') return '<b>(' + L4[x.a] + ') ' + E(x.o[x.a]) + '</b>' + (x.w ? ' — ' + E(x.w) : '');
    if (x.type === 'gen') { var g = GEN[x.g](); return '<p><b>مسألة جديدة:</b> ' + E(g.q) + '</p><details><summary>الحل</summary>' + g.a + '</details>'; }
    return x.ans;
  }
  function renderBank() {
    var all = bank(), s = st.q.trim(), list = all.filter(function (x) { return (!st.type || x.type === st.type) && (!st.src || x.src.indexOf(st.src) === 0) && (!s || (x.q + ' ' + (x.o || []).join(' ')).indexOf(s) >= 0); });
    var pages = Math.max(1, Math.ceil(list.length / PER)); st.page = Math.min(st.page, pages - 1);
    var cnt = function (k) { return all.filter(function (x) { return x.type === k; }).length; };
    var h = '<div class="ex-head"><h2>بنك الأسئلة</h2><span class="ex-badge">' + all.length + ' سؤال</span><span class="grow"></span><button class="btn sm ghost" onclick="go(\'exam\')">امتحان السنة الماضية محلولًا</button></div>' +
      '<div class="panel"><p class="muted" style="margin:0">أسئلة امتحان الإحصاء الاستدلالي (2025/2026) بإجاباتها، وأسئلة إضافية بنمطه، وكل أسئلة الدروس، ومولّد مسائل يعطيك أرقامًا جديدة كل مرة. اضغط على السؤال لترى الإجابة.</p>' +
      '<div class="ex-seg">' + '<button data-ty="" aria-pressed="' + !st.type + '">الكل</button>' + TYPES.map(function (t) { return '<button data-ty="' + t[0] + '" aria-pressed="' + (st.type === t[0]) + '">' + t[1] + ' (' + cnt(t[0]) + ')</button>'; }).join('') + '</div>' +
      '<div class="ex-seg">' + SRC.map(function (t) { return '<button data-sr="' + t[0] + '" aria-pressed="' + (st.src === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="row"><input type="search" id="xbS" style="flex:1;min-width:0" placeholder="ابحث… (مثلًا: كاي، ارتباط، درجات الحرية)" value="' + E(st.q) + '" aria-label="بحث"><button class="btn" id="xbQ">اختبرني في المختار</button>' + (typeof REWARD !== 'undefined' ? '<button class="btn ghost" id="xbR">مراجعة اليوم (' + REWARD.dueCount(all.map(function (x) { return 'x:' + x.q.slice(0, 60); })) + ')</button><button class="btn ghost" onclick="go(\'schedules\')">كروت العلماء وجداول التعزيز</button>' : '') + '</div>' +
      '<p class="muted" style="margin:6px 0 0">' + list.length + ' سؤال مطابق' + (pages > 1 ? ' · صفحة ' + (st.page + 1) + ' من ' + pages : '') + '</p></div>' +
      list.slice(st.page * PER, st.page * PER + PER).map(function (x, i) { return '<details class="panel ex-q"><summary><span class="num">' + (st.page * PER + i + 1) + '.</span> ' + E(x.q) + (x.o ? '<div class="muted ex-opts">' + x.o.map(function (o, j) { return L4[j] + ') ' + E(o); }).join(' · ') + '</div>' : '') + '<div class="ex-tags"><span>' + (TYPES.filter(function (t) { return t[0] === x.type; })[0] || ['', ''])[1] + '</span><span>' + E(x.src) + '</span></div></summary><div class="ex-ans" data-id="' + x.id + '"></div></details>'; }).join('') +
      (pages > 1 ? '<div class="row" style="justify-content:space-between"><button class="btn sm ghost" id="xbP"' + (st.page ? '' : ' disabled') + '>السابق</button><button class="btn sm ghost" id="xbN"' + (st.page < pages - 1 ? '' : ' disabled') + '>التالي</button></div>' : '');
    view.innerHTML = '<div class="ex-wrap">' + h + '</div>';
    $$('details.ex-q', view).forEach(function (d) { d.addEventListener('toggle', function () { var a = $('.ex-ans', d); if (d.open && !a.innerHTML) a.innerHTML = ansHTML(all[+a.dataset.id]); }); });
    $$('[data-ty]', view).forEach(function (b) { b.onclick = function () { st.type = b.dataset.ty; st.page = 0; renderBank(); }; });
    $$('[data-sr]', view).forEach(function (b) { b.onclick = function () { st.src = b.dataset.sr; st.page = 0; renderBank(); }; });
    var sI = $('#xbS'), tm; sI.oninput = function () { clearTimeout(tm); tm = setTimeout(function () { st.q = sI.value; st.page = 0; renderBank(); var n = $('#xbS'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }, 350); };
    var P = $('#xbP'), N = $('#xbN'); if (P) P.onclick = function () { st.page--; renderBank(); scrollTo(0, 0); }; if (N) N.onclick = function () { st.page++; renderBank(); scrollTo(0, 0); };
    var xr = $('#xbR'); if (xr) xr.onclick = function () { var due = all.filter(function (x) { return (x.type === 'tf' || x.type === 'mcq') && REWARD.isDue('x:' + x.q.slice(0, 60)); }); if (!due.length) return toast('مفيش أسئلة مستحقة المراجعة النهارده. الغلط بيرجع بعد 1 ثم 3 ثم 7 ثم 14 يوم.'); objQuiz(due.slice(0, 10), 'مراجعة اليوم (تكرار متباعد)', null); };
    $('#xbQ').onclick = function () { var pool = list.filter(function (x) { return x.type === 'tf' || x.type === 'mcq'; }); if (pool.length < 3) return toast('اختر نوعًا فيه 3 أسئلة موضوعية على الأقل'); objQuiz(pool.sort(function () { return Math.random() - 0.5; }).slice(0, 10), 'اختبار سريع من البنك', null); };
  }

  /* ---------- objective quiz renderer (used by bank + simulation) ---------- */
  function objQuiz(qs, title, extra) {
    var h = '<div class="ex-head"><h2>' + E(title) + '</h2><span class="grow"></span><span class="ex-badge" id="xT"></span></div><form id="xF">' +
      qs.map(function (x, i) { var ops = x.type === 'tf' ? ['✓ صح', '✗ خطأ'] : x.o; return '<fieldset class="panel ex-q" data-i="' + i + '"><legend><span class="num">' + (i + 1) + '.</span> ' + E(x.q) + '</legend><div class="ex-ops">' + ops.map(function (o, j) { return '<label><input type="radio" name="x' + i + '" value="' + j + '"> ' + (x.type === 'tf' ? '' : L4[j] + ') ') + E(o) + '</label>'; }).join('') + '</div><div class="ex-fb"></div></fieldset>'; }).join('') +
      (extra ? extra.html : '') + '<div id="xR"></div><button class="btn" type="submit">صحّح إجاباتي</button></form>';
    view.innerHTML = '<div class="ex-wrap">' + h + '</div>'; scrollTo(0, 0);
    var timer = null;
    if (extra && extra.minutes) { var end = Date.now() + extra.minutes * 60000; var tick = function () { var el = $('#xT'); if (!el) return clearInterval(timer); var ms = Math.max(0, end - Date.now()); el.textContent = '⏱ ' + String(Math.floor(ms / 60000)).padStart(2, '0') + ':' + String(Math.floor(ms % 60000 / 1000)).padStart(2, '0'); if (!ms) { clearInterval(timer); toast('انتهى الوقت'); $('#xF').requestSubmit(); } }; tick(); timer = setInterval(tick, 1000); }
    $('#xF').onsubmit = function (e) {
      e.preventDefault(); if (timer) clearInterval(timer); var right = 0;
      qs.forEach(function (x, i) { var fs = $('[data-i="' + i + '"]'), c = $('input:checked', fs), correct = x.type === 'tf' ? (x.a ? 0 : 1) : x.a, ok = c && +c.value === correct; if (ok) right++; if (c && typeof REWARD !== 'undefined') REWARD.onAnswer('x:' + x.q.slice(0, 60), !!ok);
        $$('input', fs).forEach(function (n) { n.disabled = true; }); fs.classList.add(ok ? 'ok' : 'no');
        $('.ex-fb', fs).innerHTML = '<b>' + (ok ? 'صحيحة' : c ? 'خاطئة' : 'لم تُجب') + '</b> · الإجابة: ' + (x.type === 'tf' ? (x.a ? '✓ صح' : '✗ خطأ') : '(' + L4[x.a] + ') ' + E(x.o[x.a])) + (x.w ? ' — ' + E(x.w) : ''); });
      if (extra && extra.after) extra.after();
      pts(right + 3);
      $('#xR').innerHTML = '<div class="panel ex-score"><b>' + right + ' / ' + qs.length + '</b><span>' + (right / qs.length >= 0.8 ? 'ممتاز! أنت جاهز.' : right / qs.length >= 0.6 ? 'جيد؛ راجع الأسئلة الخاطئة.' : 'راجع الشرح تحت كل سؤال.') + (extra && extra.after ? ' قيّم حلك للمسائل بنفسك مقارنة بالحل النموذجي.' : '') + '</span></div>';
      $('#xF button[type=submit]').hidden = true; $('#xR').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
  }

  /* ---------- solved original exam + simulation ---------- */
  function renderExam() {
    var h = '<div class="ex-head"><h2>امتحان الإحصاء الاستدلالي محلولًا</h2><span class="grow"></span><button class="btn sm" id="xSim">امتحان محاكاة جديد</button><button class="btn sm ghost" onclick="go(\'qbank\')">بنك الأسئلة</button><button class="btn sm ghost" onclick="window.print()">طباعة</button></div>' +
      '<div class="panel ex-sheet"><table class="ex-hdr"><tr><td>جامعة المنيا<br>كلية التربية<br>قسم علم النفس التربوي</td><td><b>اختبار الإحصاء الاستدلالي</b><br>الدبلوم الخاص — تخصص علم نفس تربوي<br>الفصل الدراسي الأول 2025/2026</td><td>الزمن: ساعتان<br>الدرجة: 70<br>د. إلهام جلال</td></tr></table>' +
      '<div class="row"><label class="row" style="gap:6px"><input type="checkbox" id="xShow" checked> إظهار الإجابات النموذجية</label></div>' +
      '<h3>السؤال الأول (15 درجة): ضع علامة (✓) أمام العبارة الصحيحة وعلامة (✗) أمام العبارة الخاطئة</h3><ol>' + OTF.map(function (x) { return '<li>' + E(x[0]) + '<div class="ex-a"><b>' + (x[1] ? '(✓)' : '(✗)') + '</b> ' + E(x[2]) + '</div></li>'; }).join('') + '</ol>' +
      '<h3>السؤال الثاني (15 درجة): اختر الإجابة الصحيحة من بين (أ، ب، ج، د)</h3><ol>' + OMCQ.map(function (x) { return '<li>' + E(x[0]) + '<div class="muted ex-opts">' + x[1].map(function (o, j) { return L4[j] + ') ' + E(o); }).join(' · ') + '</div><div class="ex-a"><b>(' + L4[x[2]] + ') ' + E(x[1][x[2]]) + '</b> — ' + E(x[3]) + '</div></li>'; }).join('') + '</ol>' +
      OPROB.map(function (p) { return '<h3>' + E(p.t) + '</h3><p>' + E(p.q) + '</p><div class="ex-a">' + p.a + '</div>'; }).join('') +
      '<p class="muted" style="text-align:center">الإجابات النموذجية والحلول من إعداد المختبر للمذاكرة، وليست صادرة عن الكلية.</p></div>';
    view.innerHTML = '<div class="ex-wrap">' + h + '</div>';
    $('#xShow').onchange = function (e) { view.classList.toggle('ex-hide', !e.target.checked); };
    $('#xSim').onclick = simulate;
  }
  function simulate() {
    var tf = OTF.concat(XTF).map(function (x) { return { type: 'tf', q: x[0], a: x[1], w: x[2] }; }).sort(function () { return Math.random() - 0.5; }).slice(0, 15);
    var mc = OMCQ.concat(XMCQ).map(function (x) { return { type: 'mcq', q: x[0], o: x[1], a: x[2], w: x[3] }; }).sort(function () { return Math.random() - 0.5; }).slice(0, 15);
    var probs = [GEN.chi(), GEN.pearson(), Math.random() < 0.6 ? GEN.tind() : (Math.random() < 0.5 ? GEN.z() : GEN.t1())], marks = [15, 15, 10];
    var extra = { minutes: 120, html: probs.map(function (p, i) { return '<div class="panel ex-q"><h3 style="margin:0 0 6px">السؤال ' + ['الثالث', 'الرابع', 'الخامس'][i] + ' (' + marks[i] + ' درجة): ' + E(p.t) + '</h3><p style="margin:0">' + E(p.q) + '</p><textarea placeholder="اكتب خطوات الحل هنا للمراجعة" style="width:100%;min-height:90px;margin-top:8px"></textarea><div class="ex-sol" hidden>' + p.a + '</div></div>'; }).join(''), after: function () { $$('.ex-sol', view).forEach(function (n) { n.hidden = false; }); } };
    objQuiz(tf.concat(mc), 'امتحان محاكاة — الإحصاء الاستدلالي (70 درجة، ساعتان)', extra);
  }

  /* ---------- styles + routing ---------- */
  var css = '.ex-wrap{display:grid;gap:12px}.ex-head{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.ex-head h2{margin:0}.ex-head .grow{flex:1}' +
    '.ex-badge{background:linear-gradient(90deg,#fb923c,#f43f5e);color:#1c0a02;font-weight:800;border-radius:999px;padding:2px 12px;font-size:14px}' +
    '.ex-seg{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.ex-seg button{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:6px 12px;min-height:38px;cursor:pointer}.ex-seg button[aria-pressed="true"]{background:var(--teal);border-color:var(--teal);color:#fff}' +
    '.ex-q summary{cursor:pointer;list-style:none}.ex-q summary::-webkit-details-marker{display:none}.ex-opts{font-size:14px;margin-top:4px}.ex-tags{display:flex;gap:6px;margin-top:6px}.ex-tags span{font-size:12px;background:var(--gray-soft);border-radius:6px;padding:1px 8px;color:var(--muted)}' +
    '.ex-ans,.ex-a{margin-top:8px;background:var(--teal-soft);border-inline-start:3px solid var(--teal);border-radius:8px;padding:8px 12px;font-size:15px}.ex-hide .ex-a{display:none}' +
    '.ex-sheet h3{text-decoration:underline;text-underline-offset:5px;font-size:17px}.ex-sheet ol{display:grid;gap:8px;padding-inline-start:1.5em}.ex-hdr{width:100%;border-collapse:collapse}.ex-hdr td{border:1px solid var(--line);text-align:center;padding:8px;font-size:14px}' +
    '.ex-t{border-collapse:collapse;margin:6px 0}.ex-t td,.ex-t th{border:1px solid var(--line);padding:4px 10px;text-align:center}' +
    '.ex-ops{display:grid;gap:6px;margin-top:8px}.ex-ops label{border:1px solid var(--line);border-radius:10px;padding:8px 12px;cursor:pointer;min-height:44px;display:flex;gap:8px;align-items:center}.ex-ops label:has(input:checked){border-color:var(--teal);background:var(--teal-soft)}' +
    '.ex-q legend{font-weight:600}.ex-q.ok{border-color:var(--good)}.ex-q.no{border-color:var(--bad)}.ex-fb{margin-top:6px;font-size:14.5px}.ex-score{display:flex;gap:14px;align-items:center}.ex-score b{font-size:30px;font-family:var(--f-display)}' +
    '.ex-wrap{min-width:0}.ex-wrap>*{min-width:0}.ex-hdr{table-layout:fixed}.ex-hdr td{word-break:break-word;font-size:13px}.ex-a,.ex-ans,.ex-sol{overflow-x:auto}.ex-sheet{overflow-wrap:anywhere}' +
    '@media print{.ex-head button,#xShow{display:none}}';
  var tag = document.createElement('style'); tag.textContent = css; document.head.appendChild(tag);
  function myRoute() {
    var h = (location.hash || '').slice(1).split('/')[0];
    if (h !== 'exam' && h !== 'qbank') return;
    try { setTab('practice'); } catch (e) { }
    if (h === 'exam') renderExam(); else renderBank();
  }
  window.STATS_EXAM = { renderExam: renderExam, renderBank: renderBank, simulate: simulate, count: function () { return bank().length; } };
  addEventListener('hashchange', function () { setTimeout(myRoute, 0); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(myRoute, 0); }); else setTimeout(myRoute, 0);
})();
