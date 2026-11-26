import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import { copy, type Language } from '@/lib/content';

/* ────────────────────────────────────────────────────────────────────────────
   About — "Sarah, in orbit".
   A personal system map instead of a paragraph: a monogram core with three
   rings of skills, colour-coded by the four things Sarah does (apps, XR,
   design, leadership). Legend chips focus one orbit and explain it; below it,
   the chapters that shaped her and a slow ribbon of strengths. The full bio
   stays one click away so no content is lost.
   ──────────────────────────────────────────────────────────────────────────── */

type Cat = 'apps' | 'xr' | 'design' | 'lead';
type Node = { label: string; cat: Cat; ring: 0 | 1 | 2; at: number };

const nodes: Node[] = [
  // inner ring: the core craft
  { label: 'Flutter', cat: 'apps', ring: 0, at: 20 },
  { label: 'Unity', cat: 'xr', ring: 0, at: 140 },
  { label: 'Figma', cat: 'design', ring: 0, at: 260 },
  // middle ring
  { label: 'Dart', cat: 'apps', ring: 1, at: 0 },
  { label: 'C#', cat: 'xr', ring: 1, at: 60 },
  { label: 'Meta Quest 3', cat: 'xr', ring: 1, at: 112 },
  { label: 'Design Thinking', cat: 'design', ring: 1, at: 178 },
  { label: 'GDGoC', cat: 'lead', ring: 1, at: 240 },
  { label: 'Firebase', cat: 'apps', ring: 1, at: 298 },
  // outer ring
  { label: 'Clean Architecture', cat: 'apps', ring: 2, at: 330 },
  { label: 'XR Interaction Toolkit', cat: 'xr', ring: 2, at: 34 },
  { label: 'Mentoring', cat: 'lead', ring: 2, at: 88 },
  { label: 'Usability Testing', cat: 'design', ring: 2, at: 140 },
  { label: 'AR', cat: 'xr', ring: 2, at: 192 },
  { label: 'Arabic RTL', cat: 'design', ring: 2, at: 236 },
  { label: 'Team Coordination', cat: 'lead', ring: 2, at: 282 },
];

const nodeAr: Record<string, string> = {
  'Design Thinking': 'التفكير التصميمي',
  'Clean Architecture': 'البنية النظيفة',
  Mentoring: 'الإرشاد',
  'Usability Testing': 'اختبار الاستخدام',
  AR: 'الواقع المعزّز',
  'Arabic RTL': 'العربية RTL',
  'Team Coordination': 'تنسيق الفريق',
};

const text = {
  en: {
    eyebrow: 'Who’s behind the work',
    lede: 'I build for two kinds of screens: the one in your pocket, and the one that surrounds you.',
    facts: [
      { k: 'Studied', v: 'Computer Science · PNU' },
      { k: 'Trained', v: 'stc × TCS · Tuwaiq Academy' },
      { k: 'Builds', v: 'Apps · XR · Interfaces' },
    ],
    orbitTitle: 'Skill orbit',
    orbitHint: 'Pick an orbit',
    all: 'Everything',
    cats: {
      apps: { name: 'Apps', line: 'Apps you hold. Flutter and Dart, clean architecture, APIs and real-time features.' },
      xr: { name: 'XR', line: 'Worlds you step into. Unity and C# for Meta Quest 3, natural hand interaction and spatial UI.' },
      design: { name: 'Design', line: 'Interfaces that feel obvious. Research, prototypes and usability tests in Figma, with Arabic RTL done properly.' },
      lead: { name: 'People', line: 'The people around the work. GDGoC leader and mentor, Student Advisory Council, Ajyalna Alwaidah.' },
    },
    allLine: 'Four orbits, one practice: build it well, make it feel human.',
    chaptersTitle: 'What shaped me',
    chapters: [
      { tag: 'Degree', name: 'Princess Nourah University', note: 'B.Sc. Computer Science', cat: 'violet' },
      { tag: 'Community', name: 'GDGoC', note: 'Leader & mentor, Core Team 2023–2024', cat: 'lead' },
      { tag: 'Co-op', name: 'stc × TCS', note: 'Enterprise applications sector', cat: 'design' },
      { tag: 'Camp', name: 'Tuwaiq Academy', note: 'Emerging Technologies & Virtual Worlds', cat: 'xr' },
    ],
    strengths: ['Communication', 'Leadership', 'Problem-solving', 'Continuous learning', 'Arabic & English', 'User-centred thinking'],
    exploring: 'Currently exploring',
    story: 'Read the full story',
  },
  ar: {
    eyebrow: 'مَن وراء هذه الأعمال',
    lede: 'أبني لنوعين من الشاشات: شاشة تحملها في جيبك، وأخرى تحيط بك من كل جانب.',
    facts: [
      { k: 'الدراسة', v: 'علوم الحاسب · جامعة الأميرة نورة' },
      { k: 'التدريب', v: 'stc × TCS · أكاديمية طويق' },
      { k: 'أبني', v: 'تطبيقات · واقع ممتد · واجهات' },
    ],
    orbitTitle: 'مدار المهارات',
    orbitHint: 'اختر مدارًا',
    all: 'الكل',
    cats: {
      apps: { name: 'التطبيقات', line: 'تطبيقات تحملها بين يديك: Flutter وDart، والبنية النظيفة، وواجهات برمجة التطبيقات، والميزات الفورية.' },
      xr: { name: 'الواقع الممتد', line: 'عوالم تخطو داخلها: Unity وC# لنظارة Meta Quest 3، مع تفاعل طبيعي باليدين وواجهات مكانية.' },
      design: { name: 'التصميم', line: 'واجهات تبدو بديهية: أبحاث ونماذج أولية واختبارات استخدام في Figma، مع دعم متقن للعربية.' },
      lead: { name: 'القيادة', line: 'الناس حول العمل: قائدة ومرشدة في GDGoC، والمجلس الاستشاري الطلابي، ومبادرة «أجيالنا الواعدة».' },
    },
    allLine: 'أربعة مدارات وممارسة واحدة: أن يُبنى العمل بإتقان، وأن يبقى إنسانيًا.',
    chaptersTitle: 'محطات صنعتني',
    chapters: [
      { tag: 'الدرجة', name: 'جامعة الأميرة نورة', note: 'بكالوريوس علوم الحاسب', cat: 'violet' },
      { tag: 'المجتمع', name: 'GDGoC', note: 'قائدة ومرشدة، الفريق الأساسي 2023–2024', cat: 'lead' },
      { tag: 'التدريب', name: 'stc × TCS', note: 'قطاع التطبيقات المؤسسية', cat: 'design' },
      { tag: 'المعسكر', name: 'أكاديمية طويق', note: 'التقنيات الناشئة والعوالم الافتراضية', cat: 'xr' },
    ],
    strengths: ['التواصل', 'القيادة', 'حل المشكلات', 'التعلّم المستمر', 'العربية والإنجليزية', 'التفكير المتمحور حول المستخدم'],
    exploring: 'أستكشف حاليًا',
    story: 'اقرأ القصة كاملة',
  },
} as const;

const catOrder: Cat[] = ['apps', 'xr', 'design', 'lead'];

export function AboutOrbit({ lang, heading }: { lang: Language; heading: React.ReactNode }) {
  const t = text[lang];
  const c = copy[lang];
  const [focus, setFocus] = useState<Cat | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  // reveal once in view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // spotlight + gentle tilt that follows the pointer over the orbit card
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = orbitRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--rx', `${((0.5 - y) * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 6).toFixed(2)}deg`);
  };
  const onLeave = () => { const el = orbitRef.current; if (el) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); } };

  const label = (n: string) => (lang === 'ar' ? nodeAr[n] ?? n : n);

  return (
    <section ref={rootRef} id="about" className={`about-orbit scroll-mt-20 ${lang === 'ar' ? 'about-orbit--ar' : ''}`} aria-labelledby="about-heading">
      <div className="about-orbit__aurora" aria-hidden="true" />
      <div className="about-orbit__inner">
        {heading}

        <div className="about-orbit__top">
          <div className="about-orbit__intro">
            <p className="about-orbit__eyebrow"><span className="about-orbit__spark" aria-hidden="true" />{t.eyebrow}</p>
            <p className="about-orbit__lede">{t.lede}</p>
            <dl className="about-orbit__facts">
              {t.facts.map((f, i) => (
                <div key={f.k} className="about-orbit__fact" style={{ ['--i' as string]: i } as CSSProperties}>
                  <dt>{f.k}</dt><dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            ref={orbitRef}
            className="about-orbit__card"
            data-focus={focus ?? 'all'}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            <div className="about-orbit__card-head">
              <span>{t.orbitTitle}</span>
              <span className="about-orbit__hint">{t.orbitHint}</span>
            </div>
            <div className="about-orbit__system" role="img" aria-label={`${t.orbitTitle}: ${nodes.map((n) => label(n.label)).join(', ')}`}>
              {[0, 1, 2].map((ring) => (
                <div key={ring} className={`about-orbit__ring about-orbit__ring--${ring}`} aria-hidden="true">
                  {nodes.filter((n) => n.ring === ring).map((n) => (
                    <span key={n.label} className="about-orbit__slot" style={{ ['--a' as string]: `${n.at}deg` }}>
                      <span className={`about-orbit__node about-orbit__node--${n.cat}`} data-cat={n.cat} dir="auto">
                        <i aria-hidden="true" />{label(n.label)}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
              <div className="about-orbit__core" aria-hidden="true">
                <span className="about-orbit__core-ring" />
                <span className="about-orbit__monogram">SA</span>
                <span className="about-orbit__core-sub">App × XR</span>
              </div>
            </div>
            <div className="about-orbit__legend" role="group" aria-label={t.orbitTitle}>
              <button type="button" aria-pressed={focus === null} onClick={() => setFocus(null)} className="about-orbit__chip about-orbit__chip--all" data-testid="about-orbit-all">{t.all}</button>
              {catOrder.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={focus === cat}
                  onClick={() => setFocus(focus === cat ? null : cat)}
                  onMouseEnter={() => setFocus(cat)}
                  className={`about-orbit__chip about-orbit__chip--${cat}`}
                  data-testid={`about-orbit-${cat}`}
                >
                  <i aria-hidden="true" />{t.cats[cat].name}
                </button>
              ))}
            </div>
            <p className="about-orbit__caption" aria-live="polite" key={focus ?? 'all'}>{focus ? t.cats[focus].line : t.allLine}</p>
          </div>
        </div>

        <div className="about-orbit__chapters-wrap">
          <p className="about-orbit__kicker">{t.chaptersTitle}</p>
          <ol className="about-orbit__chapters">
            {t.chapters.map((ch, i) => (
              <li key={ch.name} className={`about-orbit__chapter about-orbit__chapter--${ch.cat}`} style={{ ['--i' as string]: i } as CSSProperties}>
                <span className="about-orbit__chapter-dot" aria-hidden="true" />
                <span className="about-orbit__chapter-tag">{String(i + 1).padStart(2, '0')} · {ch.tag}</span>
                <span className="about-orbit__chapter-name">{ch.name}</span>
                <span className="about-orbit__chapter-note">{ch.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="about-orbit__ribbon" aria-label={lang === 'ar' ? 'نقاط القوة' : 'Strengths'}>
          <div className="about-orbit__ribbon-track">
            {[0, 1].map((copyIndex) => (
              <ul key={copyIndex} aria-hidden={copyIndex === 1}>
                {t.strengths.map((s, i) => <li key={s} style={{ ['--i' as string]: i } as CSSProperties}><i aria-hidden="true" />{s}</li>)}
              </ul>
            ))}
          </div>
        </div>

        <div className="about-orbit__bottom">
          <div className="about-orbit__now">
            <span className="about-orbit__eq" aria-hidden="true"><i /><i /><i /><i /></span>
            <div>
              <p className="about-orbit__kicker">{t.exploring}</p>
              <p className="about-orbit__now-text">{c.focus}</p>
            </div>
          </div>
          <details className="about-orbit__story">
            <summary>{t.story}<ChevronDown className="h-4 w-4" aria-hidden="true" /></summary>
            <div className="about-orbit__story-body">
              <p>{c.aboutBody}</p>
              <p>{c.aboutBody2}</p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
