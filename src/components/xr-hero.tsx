import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { Link } from 'wouter';
import { copy, type Language } from '@/lib/content';

/* ────────────────────────────────────────────────────────────────────────────
   XR Hero — a "spatial workspace" first screen.
   Left: identity + a live role line (Application Developer ↔ XR Developer).
   Right: a real-time wireframe viewport (canvas 2D, no 3D library) that morphs
   between a phone (apps) and a headset (XR). Drag to orbit; HUD shows the pose.
   ──────────────────────────────────────────────────────────────────────────── */

type Mode = 'app' | 'xr';
type V3 = [number, number, number];
type Path = { pts: V3[]; closed?: boolean; tone?: 0 | 1 | 2; width?: number };

const text = {
  en: {
    kicker: 'Computer Science Graduate',
    status: 'Open to opportunities',
    build: 'role:',
    roles: { app: 'Application Developer', xr: 'XR Developer' },
    rolesA11y: 'Application Developer and XR Developer',
    modeLabel: 'Viewport mode',
    modes: { app: 'Apps', xr: 'XR' },
    hud: { title: 'XR VIEWPORT', tracking: 'TRACKING', ok: 'OK', mode: 'MODE', mesh: 'MESH', drag: 'Drag to orbit' },
    mesh: { app: 'phone.mesh', xr: 'headset.mesh' },
    featured: 'Featured',
    feature: { app: { slug: 'talaqi', name: 'Talaqi', note: 'Flutter app' }, xr: { slug: 'captain-crew', name: 'Captain Crew', note: 'VR on Meta Quest 3' } },
    stack: 'Stack',
    stacks: { app: ['Flutter', 'Dart', 'Firebase', 'Clean Architecture', 'APIs'], xr: ['Unity', 'C#', 'Meta Quest 3', 'XR Interaction Toolkit', 'VR / AR'] },
    viewportA11y: 'Interactive 3D viewport. A wireframe phone represents application development and a wireframe headset represents XR development.',
  },
  ar: {
    kicker: 'خريجة علوم الحاسب',
    status: 'متاحة للفرص المهنية',
    build: 'الدور:',
    roles: { app: 'مطوّرة تطبيقات', xr: 'مطوّرة واقع ممتد (XR)' },
    rolesA11y: 'مطوّرة تطبيقات ومطوّرة واقع ممتد',
    modeLabel: 'وضع العرض',
    modes: { app: 'التطبيقات', xr: 'الواقع الممتد' },
    hud: { title: 'نافذة XR', tracking: 'التتبّع', ok: 'يعمل', mode: 'الوضع', mesh: 'المجسّم', drag: 'اسحب للتدوير' },
    mesh: { app: 'phone.mesh', xr: 'headset.mesh' },
    featured: 'مشروع مختار',
    feature: { app: { slug: 'talaqi', name: 'تلاقي', note: 'تطبيق Flutter' }, xr: { slug: 'captain-crew', name: 'كابتن كرو', note: 'واقع افتراضي على Meta Quest 3' } },
    stack: 'الأدوات',
    stacks: { app: ['Flutter', 'Dart', 'Firebase', 'البنية النظيفة', 'واجهات برمجة التطبيقات'], xr: ['Unity', 'C#', 'Meta Quest 3', 'XR Interaction Toolkit', 'الواقع الافتراضي والمعزّز'] },
    viewportA11y: 'نافذة ثلاثية الأبعاد تفاعلية: هاتف بخطوط هيكلية يمثّل تطوير التطبيقات، ونظارة واقع افتراضي تمثّل تطوير الواقع الممتد.',
  },
} as const;

/* ───────── geometry helpers ───────── */
function roundRect(w: number, h: number, r: number, z: number, cx = 0, cy = 0, seg = 5): V3[] {
  const pts: V3[] = [];
  const corners: [number, number, number][] = [[w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, 90], [-w / 2 + r, -h / 2 + r, 180], [w / 2 - r, -h / 2 + r, 270]];
  for (const [x, y, start] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = ((start + (90 * i) / seg) * Math.PI) / 180;
      pts.push([cx + x + Math.cos(a) * r, cy + y + Math.sin(a) * r, z]);
    }
  }
  return pts;
}
function circle(r: number, cx: number, cy: number, z: number, seg = 22): V3[] {
  return Array.from({ length: seg }, (_, i) => { const a = (i / seg) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z] as V3; });
}
function line(a: V3, b: V3): V3[] { return [a, b]; }

function phoneModel(): Path[] {
  const w = 1.15, h = 2.3, d = 0.16, r = 0.18;
  const front = roundRect(w, h, r, -d / 2), back = roundRect(w, h, r, d / 2);
  const paths: Path[] = [{ pts: front, closed: true, width: 1.6 }, { pts: back, closed: true, tone: 2 }];
  [0, 5, 6, 11, 12, 17, 18, 23].forEach((i) => paths.push({ pts: line(front[i], back[i]), tone: 2 }));
  const z = -d / 2 - 0.01;
  paths.push({ pts: roundRect(w - 0.14, h - 0.16, r - 0.07, z), closed: true, tone: 1 });
  paths.push({ pts: roundRect(0.34, 0.07, 0.035, z, 0, h / 2 - 0.15), closed: true, tone: 2 });
  // app UI: header, avatar, cards, nav
  paths.push({ pts: circle(0.11, -0.3, 0.78, z, 14), closed: true, tone: 1 });
  paths.push({ pts: line([-0.12, 0.82, z], [0.36, 0.82, z]), tone: 1 });
  paths.push({ pts: line([-0.12, 0.72, z], [0.18, 0.72, z]), tone: 2 });
  paths.push({ pts: roundRect(0.86, 0.48, 0.06, z, 0, 0.3), closed: true });
  paths.push({ pts: line([-0.34, 0.38, z], [0.2, 0.38, z]), tone: 2 });
  paths.push({ pts: line([-0.34, 0.24, z], [0.06, 0.24, z]), tone: 2 });
  paths.push({ pts: roundRect(0.4, 0.4, 0.06, z, -0.23, -0.24), closed: true, tone: 1 });
  paths.push({ pts: roundRect(0.4, 0.4, 0.06, z, 0.23, -0.24), closed: true, tone: 1 });
  paths.push({ pts: roundRect(0.86, 0.22, 0.06, z, 0, -0.62), closed: true, tone: 2 });
  [-0.3, -0.1, 0.1, 0.3].forEach((x) => paths.push({ pts: circle(0.035, x, -0.96, z, 8), closed: true, tone: 1 }));
  return paths;
}

function headsetModel(): Path[] {
  const w = 2.1, h = 1.05, d = 0.82, r = 0.34;
  const front = roundRect(w, h, r, -d / 2, 0, 0, 6), back = roundRect(w - 0.2, h - 0.12, r - 0.05, d / 2, 0, 0, 6);
  const paths: Path[] = [{ pts: front, closed: true, width: 1.6 }, { pts: back, closed: true, tone: 2 }];
  [0, 6, 7, 13, 14, 20, 21, 27].forEach((i) => paths.push({ pts: line(front[i], back[i]), tone: 2 }));
  paths.push({ pts: roundRect(w - 0.32, h - 0.3, r - 0.12, -d / 2 - 0.01, 0, 0, 6), closed: true, tone: 1 });
  // tracking cameras on the visor
  [[-0.78, 0.3], [0.78, 0.3], [-0.78, -0.3], [0.78, -0.3]].forEach(([x, y]) => paths.push({ pts: circle(0.07, x, y, -d / 2 - 0.02, 10), closed: true, tone: 1 }));
  // lenses inside
  paths.push({ pts: circle(0.25, -0.42, 0, d / 2 - 0.05), closed: true });
  paths.push({ pts: circle(0.25, 0.42, 0, d / 2 - 0.05), closed: true });
  // nose bridge
  paths.push({ pts: [[-0.17, -h / 2 + 0.06, d / 2], [0, -0.12, d / 2], [0.17, -h / 2 + 0.06, d / 2]], tone: 2 });
  // strap (half ellipse behind the head) + top strap
  const strap: V3[] = []; const top: V3[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI;
    strap.push([Math.cos(a) * 1.02, 0, d / 2 + Math.sin(a) * 1.35]);
    top.push([0, h / 2 - 0.05 + Math.sin(a) * 0.45, d / 2 + (1 - Math.cos(a)) * 0.68]);
  }
  paths.push({ pts: strap, tone: 2 }, { pts: top, tone: 2 });
  return paths;
}

const MODELS: Record<Mode, Path[]> = { app: phoneModel(), xr: headsetModel() };

/* ───────── component ───────── */
export function XRHero({ lang, viewWork, contactMe, scroll }: { lang: Language; viewWork: string; contactMe: string; scroll: string }) {
  const tx = text[lang];
  const c = copy[lang];
  const [mode, setMode] = useState<Mode>('xr');
  const [userPicked, setUserPicked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);
  const modeRef = useRef<Mode>(mode);
  const roleRef = useRef<HTMLSpanElement>(null);

  // auto-cycle the two identities until the visitor chooses one
  useEffect(() => {
    if (userPicked) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => setMode((m) => (m === 'app' ? 'xr' : 'app')), 5200);
    return () => window.clearInterval(id);
  }, [userPicked]);

  // scramble the role text on change (Latin only — Arabic letters must keep joining)
  useEffect(() => {
    modeRef.current = mode;
    const el = roleRef.current; if (!el) return;
    const target = tx.roles[mode];
    if (lang === 'ar' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = target; return; }
    const glyphs = '01<>/{}[]=+*#XR_';
    let raf = 0;
    const start = performance.now(); const duration = 480;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(p * target.length);
      const seed = Math.floor(now / 40);
      el.textContent = target.split('').map((ch, i) => (i < reveal || ch === ' ' ? ch : glyphs[(i * 7 + seed) % glyphs.length])).join('');
      if (p < 1) raf = requestAnimationFrame(tick); else el.textContent = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, lang, tx.roles]);

  // render loop
  useEffect(() => {
    const canvas = canvasRef.current; const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = stage.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(stage);

    const css = getComputedStyle(document.documentElement);
    const hsl = (v: string, a: number) => `hsl(${css.getPropertyValue(v).trim() || '269 43% 64%'} / ${a})`;
    const tones = ['--primary', '--soft-cyan', '--soft-pink'];

    let yaw = -0.55, pitch = 0.34, vy = 0, vx = 0, dragging = false, lastX = 0, lastY = 0, hoverX = 0, hoverY = 0;
    let blend = modeRef.current === 'xr' ? 1 : 0;
    let visible = true; let raf = 0; const t0 = performance.now(); let lastFrame = t0;

    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; lastY = e.clientY; stage.setPointerCapture(e.pointerId); stage.classList.add('is-dragging'); };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      hoverX = ((e.clientX - r.left) / r.width - 0.5) * 2; hoverY = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!dragging) return;
      vy = (e.clientX - lastX) * 0.008; vx = (e.clientY - lastY) * 0.006;
      yaw += vy; pitch = Math.max(-0.9, Math.min(0.9, pitch + vx));
      lastX = e.clientX; lastY = e.clientY;
      if (!raf) draw(performance.now());
    };
    const onUp = () => { dragging = false; stage.classList.remove('is-dragging'); };
    const onLeave = () => { hoverX = 0; hoverY = 0; };
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }, { threshold: 0 });
    io.observe(stage);

    function project(p: V3, ry: number, rx: number, scale: number): [number, number, number] {
      let [x, y, z] = p; x *= scale; y *= scale; z *= scale;
      const cy = Math.cos(ry), sy = Math.sin(ry); [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      const cx = Math.cos(rx), sx = Math.sin(rx); [y, z] = [y * cx - z * sx, y * sx + z * cx];
      const D = 6.2; const f = Math.min(w, h) * 1.32;
      const k = f / (D + z);
      return [w / 2 + x * k, h * 0.44 - y * k, z];
    }

    function drawModel(paths: Path[], alpha: number, scale: number, ry: number, rx: number) {
      if (alpha <= 0.01) return;
      for (const path of paths) {
        const pr = path.pts.map((p) => project(p, ry, rx, scale));
        const zAvg = pr.reduce((s, p) => s + p[2], 0) / pr.length;
        const depth = Math.max(0.25, Math.min(1, 0.85 - zAvg * 0.22));
        ctx!.beginPath();
        pr.forEach(([x, y], i) => (i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y)));
        if (path.closed) ctx!.closePath();
        ctx!.strokeStyle = hsl(tones[path.tone ?? 0], depth * alpha);
        ctx!.lineWidth = (path.width ?? 1.15) * (w < 420 ? 0.85 : 1);
        ctx!.stroke();
      }
    }

    function draw(now: number) {
      const t = (now - t0) / 1000;
      // time-based motion so speed is identical at 30, 60 or 120 fps (and on throttled devices)
      const dt = Math.min(0.1, Math.max(0, (now - lastFrame) / 1000)); lastFrame = now;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      if (!dragging && !reduce) { yaw += 0.25 * dt + vy * 0.9 * dt * 60; vy *= Math.pow(0.92, dt * 60); }
      const target = modeRef.current === 'xr' ? 1 : 0;
      blend += (target - blend) * (reduce ? 1 : 1 - Math.exp(-dt * 5));
      const ry = yaw + hoverX * 0.18; const rx = pitch + hoverY * 0.12;

      // floor grid (spatial ground plane)
      ctx!.lineWidth = 1;
      for (let i = -6; i <= 6; i++) {
        const a = project([i * 0.5, -1.55, -3], ry * 0.25, rx, 1); const b = project([i * 0.5, -1.55, 3], ry * 0.25, rx, 1);
        ctx!.strokeStyle = hsl('--primary', 0.06 + (1 - Math.abs(i) / 6) * 0.12);
        ctx!.beginPath(); ctx!.moveTo(a[0], a[1]); ctx!.lineTo(b[0], b[1]); ctx!.stroke();
        const c1 = project([-3, -1.55, i * 0.5], ry * 0.25, rx, 1); const c2 = project([3, -1.55, i * 0.5], ry * 0.25, rx, 1);
        ctx!.beginPath(); ctx!.moveTo(c1[0], c1[1]); ctx!.lineTo(c2[0], c2[1]); ctx!.stroke();
      }
      // anchor ring + orbiting spatial anchors
      const ring: V3[] = Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2; return [Math.cos(a) * 1.9, -1.55, Math.sin(a) * 1.9]; });
      const rp = ring.map((p) => project(p, ry, rx, 1));
      ctx!.beginPath(); rp.forEach(([x, y], i) => (i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y))); ctx!.closePath();
      ctx!.setLineDash([3, 6]); ctx!.strokeStyle = hsl('--soft-cyan', 0.35); ctx!.stroke(); ctx!.setLineDash([]);
      for (let k = 0; k < 3; k++) {
        const a = t * 0.6 + (k * Math.PI * 2) / 3;
        const p = project([Math.cos(a) * 1.9, -1.55 + Math.sin(t * 1.3 + k) * 0.06 + 0.9 * (k === 1 ? 1 : 0), Math.sin(a) * 1.9], ry, rx, 1);
        ctx!.fillStyle = hsl(k === 1 ? '--soft-pink' : '--soft-cyan', 0.9);
        ctx!.fillRect(p[0] - 2.5, p[1] - 2.5, 5, 5);
        ctx!.strokeStyle = hsl('--soft-cyan', 0.35);
        ctx!.beginPath(); ctx!.moveTo(p[0] - 8, p[1]); ctx!.lineTo(p[0] + 8, p[1]); ctx!.moveTo(p[0], p[1] - 8); ctx!.lineTo(p[0], p[1] + 8); ctx!.stroke();
      }

      // the two identities, cross-faded with a subtle scale
      const bob = reduce ? 0 : Math.sin(t * 1.1) * 0.05;
      ctx!.save();
      ctx!.shadowColor = hsl('--primary', 0.55); ctx!.shadowBlur = 12;
      drawModel(MODELS.app.map((p) => ({ ...p, pts: p.pts.map(([x, y, z]) => [x, y + bob, z] as V3) })), 1 - blend, 0.82 + (1 - blend) * 0.18, ry, rx);
      drawModel(MODELS.xr.map((p) => ({ ...p, pts: p.pts.map(([x, y, z]) => [x, y + bob, z] as V3) })), blend, 0.82 + blend * 0.18, ry, rx);
      ctx!.restore();

      if (hudRef.current) {
        const deg = (v: number) => `${Math.round((((v * 180) / Math.PI) % 360 + 360) % 360)}°`.padStart(4, '0');
        hudRef.current.textContent = `yaw ${deg(ry)}  pitch ${Math.round((rx * 180) / Math.PI)}°  z −2.00m`;
      }
    }

    function loop(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      draw(now);
      if (!reduce || dragging || Math.abs((modeRef.current === 'xr' ? 1 : 0) - blend) > 0.01) raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    const onVis = () => { if (!document.hidden && !raf) raf = requestAnimationFrame(loop); };
    document.addEventListener('visibilitychange', onVis);
    // with reduced motion the scene is static: redraw on mode change
    const redraw = window.setInterval(() => { if (reduce && !raf) raf = requestAnimationFrame(loop); }, 400);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.clearInterval(redraw);
      document.removeEventListener('visibilitychange', onVis);
      stage.removeEventListener('pointerdown', onDown); stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp); stage.removeEventListener('pointercancel', onUp); stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const pick = (m: Mode) => { setUserPicked(true); setMode(m); };
  const feat = tx.feature[mode];

  return (
    <section className={`xr-hero ${lang === 'ar' ? 'xr-hero--ar' : ''}`} aria-labelledby="hero-name" data-mode={mode}>
      <div className="xr-hero__floor" aria-hidden="true" />
      <div className="xr-hero__glow" aria-hidden="true" />
      <div className="xr-hero__inner">
        <div className="xr-hero__identity">
          <p className="xr-hero__kicker">
            <span className="xr-hero__pulse" aria-hidden="true" />
            <span>{tx.kicker}</span>
            <span className="xr-hero__sep" aria-hidden="true">/</span>
            <span className="xr-hero__status">{tx.status}</span>
          </p>
          <h1 id="hero-name" className="xr-hero__name">
            {(lang === 'ar' ? ['ساره', 'عطوي'] : ['Sarah', 'Atawi']).map((word, i) => (
              <span key={word} className="xr-hero__word" style={{ ['--d' as string]: `${0.12 + i * 0.14}s` }}><span>{word}</span></span>
            ))}
          </h1>
          <p className="xr-hero__role">
            <span className="sr-only">{tx.rolesA11y}</span>
            <span aria-hidden="true" className="xr-hero__role-pre">{tx.build}</span>
            <span aria-hidden="true" className="xr-hero__role-box">
              <span className="xr-hero__role-bracket">[</span>
              <span ref={roleRef} className="xr-hero__role-text" />
              <span className="xr-hero__caret" />
              <span className="xr-hero__role-bracket">]</span>
            </span>
          </p>
          <p className="xr-hero__bio">{c.heroBody}</p>
          <div className="xr-hero__actions">
            <a href="#work-heading" className="xr-btn xr-btn--solid" data-testid="link-view-work">{viewWork}<ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
            <a href="#contact" className="xr-btn" data-testid="link-contact-me">{contactMe}</a>
            <span className="xr-hero__socials">
              <a href="https://www.linkedin.com/in/sarah-atawi-332922291/" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-testid="link-hero-social-linkedin"><Linkedin className="h-4 w-4" aria-hidden="true" /></a>
              <a href="https://github.com/sarahatawi-ctrl" target="_blank" rel="noreferrer" aria-label="GitHub" data-testid="link-hero-social-github"><Github className="h-4 w-4" aria-hidden="true" /></a>
            </span>
          </div>
          <div className="xr-hero__stack" aria-label={tx.stack}>
            <span className="xr-hero__stack-label">{tx.stack}</span>
            <ul key={mode}>{tx.stacks[mode].map((s, i) => <li key={s} style={{ ['--i' as string]: i }} dir="auto">{s}</li>)}</ul>
          </div>
        </div>

        <div className="xr-hero__viewport">
          <div className="xr-hero__hud-top">
            <span className="xr-hero__hud-title">{tx.hud.title}</span>
            <div className="xr-hero__modes" role="group" aria-label={tx.modeLabel}>
              {(['app', 'xr'] as Mode[]).map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => pick(m)} data-testid={`button-hero-mode-${m}`}>{tx.modes[m]}</button>
              ))}
            </div>
          </div>
          <div ref={stageRef} className="xr-hero__stage" role="img" aria-label={tx.viewportA11y}>
            <canvas ref={canvasRef} />
            <span className="xr-hero__corner xr-hero__corner--tl" aria-hidden="true" />
            <span className="xr-hero__corner xr-hero__corner--tr" aria-hidden="true" />
            <span className="xr-hero__corner xr-hero__corner--bl" aria-hidden="true" />
            <span className="xr-hero__corner xr-hero__corner--br" aria-hidden="true" />
            <span className="xr-hero__drag" aria-hidden="true">{tx.hud.drag}</span>
          </div>
          <div className="xr-hero__hud-bottom" aria-hidden="true">
            <span><b>{tx.hud.tracking}</b> <i className="xr-hero__ok" /> {tx.hud.ok}</span>
            <span><b>{tx.hud.mesh}</b> <span dir="ltr">{tx.mesh[mode]}</span></span>
            <span ref={hudRef} dir="ltr" className="xr-hero__pose">yaw 000°  pitch 0°</span>
          </div>
          <Link href={`/work/${feat.slug}`} className="xr-hero__feature" data-testid="link-hero-featured">
            <span className="xr-hero__feature-label">{tx.featured}</span>
            <span className="xr-hero__feature-name">{feat.name}</span>
            <span className="xr-hero__feature-note">{feat.note}</span>
            <ArrowUpRight className={`h-4 w-4 ${lang === 'ar' ? '-scale-x-100' : ''}`} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <a href="#about" className="xr-hero__scroll"><span className="xr-hero__scroll-line" aria-hidden="true" />{scroll}</a>
    </section>
  );
}
