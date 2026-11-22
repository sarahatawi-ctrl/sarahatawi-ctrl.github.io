(() => {
  const ar = {
    'skip': 'انتقل إلى المحتوى',
    'name': 'ساره عطوي',
    'nav.about': 'نبذة',
    'nav.interests': 'الاهتمامات',
    'nav.work': 'الأعمال',
    'nav.background': 'المسيرة',
    'nav.contact': 'تواصل',
    'hero.kicker': 'خريجة علوم الحاسب',
    'hero.first': 'ساره',
    'hero.last': 'عطوي',
    'hero.lede': 'أطوّر تطبيقات الجوال، وأصمم واجهات يستمتع الناس باستخدامها، وأستكشف ما يتيحه الواقع الافتراضي والتقنيات الناشئة.',
    'hero.cta1': 'أعمال مختارة',
    'hero.cta2': 'تواصل معي',
    'int.apps.short': 'التطبيقات',
    'int.ux.short': 'UI/UX',
    'int.vr.short': 'الواقع الافتراضي',
    'int.emerging.short': 'التقنيات الناشئة',
    'about.title': 'نبذة',
    'about.p1': 'خريجة علوم الحاسب من جامعة الأميرة نورة بنت عبدالرحمن، أمتلك خبرة عملية في تطوير تطبيقات الجوال باستخدام Flutter وDart، وتصميم واجهات تتمحور حول المستخدم باستخدام Figma.',
    'about.p2': 'أكملت التدريب التعاوني في stc بالشراكة مع شركة تاتا للخدمات الاستشارية ضمن قطاع التطبيقات. كما شاركت في المعسكر التدريبي المكثّف «التقنيات الناشئة والعوالم الافتراضية» في أكاديمية طويق، وشاركت في تطوير «كابتن كرو»، تجربة واقع افتراضي غامرة لنظارة Meta Quest 3.',
    'about.p3': 'إلى جانب دراستي، قُدت مجتمع Google Developer Groups on Campus في جامعة الأميرة نورة، وكنت عضوًا في المجلس الطلابي. أهتم بالتواصل والقيادة والتعلّم المستمر.',
    'interests.title': 'الاهتمامات',
    'int.apps.title': 'تطوير التطبيقات',
    'int.apps.body': 'تطبيقات جوّال باستخدام Flutter وDart، من Clean Architecture إلى التكامل مع واجهات API والميزات الفورية.',
    'int.ux.title': 'تصميم UI/UX',
    'int.ux.body': 'منهجية Design Thinking وأبحاث المستخدم والنمذجة الأولية واختبار قابلية الاستخدام في Figma، مع دعم مدروس للعربية وRTL.',
    'int.vr.title': 'الواقع الافتراضي',
    'int.vr.body': 'تجارب غامرة باستخدام Unity لنظارة Meta Quest 3، مع تفاعل طبيعي باليدين وواجهات داخل البيئة الافتراضية.',
    'int.emerging.title': 'التقنيات الناشئة',
    'int.emerging.body': 'شغف بمعرفة اتجاه المنصات الجديدة، وكيف نحوّلها إلى تجارب مفيدة وإنسانية.',
    'work.title': 'أعمال مختارة',
    'work.cc.alt': 'مقصورة طائرة افتراضية في كابتن كرو مع علامات إرشادية للمهام على امتداد الممر',
    'work.cc.cat': 'الواقع الافتراضي · مشروع جماعي',
    'work.cc.body': 'تجربة واقع افتراضي غامرة طُوّرت باستخدام Unity وMeta Quest 3: بيئة VR تفاعلية يشارك فيها المستخدمون في مهام وأنشطة ضمن تجربة افتراضية مشتركة.',
    'work.team': 'الفريق',
    'work.cc.team': 'ساره عطوي، ريماس السلطان، جنى الحامدي',
    'chip.vr': 'الواقع الافتراضي',
    'chip.mp': 'VR متعدد الأجهزة',
    'chip.ux': 'تصميم UI/UX',
    'work.case': 'اقرأ دراسة الحالة',
    'work.talaqi.alt': 'شعار تلاقي',
    'work.talaqi.cat': 'مشروع التخرج · تطبيق جوّال',
    'work.talaqi.title': 'تلاقي',
    'work.talaqi.body': 'تطبيق Flutter لتبادل المهارات بين الأقران، يشمل جلسات التعلّم والرسائل الفورية وتتبع الساعات التطوعية وروبوت محادثة ذكي.',
    'work.rateel.alt': 'شعار رتيل',
    'work.rateel.cat': 'التدريب التعاوني · stc / TCS',
    'work.rateel.title': 'رتيل',
    'work.rateel.body': 'ساهمت في UI/UX وعناصر Flutter المتجاوبة وClean Architecture والسمات الديناميكية وبث الصوت عبر واجهات API خارجية.',
    'work.banner.alt': 'شاشة الحضور بعد إعادة تصميم نظام بانر',
    'work.banner.cat': 'إعادة تصميم UI/UX',
    'work.banner.title': 'نظام بانر',
    'work.banner.body': 'إعادة تصميم نظام بانر الجامعي بمنهجية Design Thinking: الجداول والسجلات والحضور ودعم RTL والتنقل.',
    'work.portfolio': 'ملف الأعمال الكامل',
    'bg.title': 'المسيرة',
    'bg.edu': 'التعليم',
    'edu.pnu.inst': 'جامعة الأميرة نورة بنت عبدالرحمن',
    'edu.pnu.prog': 'علوم الحاسب',
    'edu.pnu.type': 'درجة البكالوريوس',
    'edu.tuwaiq.inst': 'أكاديمية طويق',
    'edu.tuwaiq.prog': 'التقنيات الناشئة والعوالم الافتراضية',
    'edu.tuwaiq.type': 'معسكر تدريبي مكثّف',
    'bg.exp': 'الخبرة',
    'exp.tcs.org': 'تاتا للخدمات الاستشارية (TCS) | stc',
    'exp.tcs.role': 'متدربة تدريب تعاوني، قطاع التطبيقات',
    'exp.tcs.body': 'تطوير تطبيقات مؤسسية ضمن بيئة stc: اختبار التطبيقات وتصحيح الأخطاء والتوثيق التقني وسير عمل تطوير البرمجيات.',
    'bg.lead': 'القيادة',
    'lead.gdg': 'قائدة GDGoC في جامعة الأميرة نورة',
    'lead.gdg.when': '2024–2025',
    'lead.core': 'عضو الفريق الأساسي، GDGoC / GDSC في جامعة الأميرة نورة',
    'lead.core.when': '2023–2024',
    'lead.council': 'عضو المجلس الطلابي، جامعة الأميرة نورة',
    'lead.ajyalna': 'قائدة لجنة الجودة والتطوير، أجيالنا الواعدة',
    'contact.title': 'تواصل',
    'contact.line': 'لنبنِ معًا شيئًا',
    'contact.em': 'ذا معنى.',
    'footer.top': 'العودة للأعلى ↑',
  };

  const meta = {
    en: { title: 'Sarah Atawi — Computer Science Graduate', toggle: 'عرض الموقع بالعربية' },
    ar: { title: 'ساره عطوي — خريجة علوم الحاسب', toggle: 'View the site in English' },
  };

  const root = document.documentElement;
  const textNodes = [...document.querySelectorAll('[data-i18n]')];
  const altNodes = [...document.querySelectorAll('[data-i18n-alt]')];
  // Remember the English source text so we can switch back without a reload.
  textNodes.forEach((el) => { el.dataset.en = el.textContent; });
  altNodes.forEach((el) => { el.dataset.enAlt = el.getAttribute('alt'); });

  function apply(lang) {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    textNodes.forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = lang === 'ar' && ar[key] ? ar[key] : el.dataset.en;
    });
    altNodes.forEach((el) => {
      const key = el.dataset.i18nAlt;
      el.setAttribute('alt', lang === 'ar' && ar[key] ? ar[key] : el.dataset.enAlt);
    });
    document.title = meta[lang].title;
    const toggle = document.getElementById('langToggle');
    if (toggle) toggle.setAttribute('aria-label', meta[lang].toggle);
  }

  let lang = 'en';
  try {
    const saved = localStorage.getItem('sa-lang');
    if (saved === 'ar' || saved === 'en') lang = saved;
    else if ((navigator.language || '').toLowerCase().startsWith('ar')) lang = 'ar';
  } catch (_) { /* storage unavailable */ }
  apply(lang);

  document.getElementById('langToggle')?.addEventListener('click', () => {
    lang = lang === 'en' ? 'ar' : 'en';
    apply(lang);
    try { localStorage.setItem('sa-lang', lang); } catch (_) { /* ignore */ }
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }
})();
