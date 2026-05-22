// Animation primitives — Stage with scrubber + step controls.
// Designed for stepwise algorithm visualizations.

const { useState: useS, useEffect: useE, useRef: useR, useMemo: useMm } = React;

// === Generic step player ===
// children receives ({ step, t, playing }) where step = current step idx,
// t = 0..1 progress within step, playing = boolean
function StepPlayer({ steps, children, autoplay = false, stepDuration = 1400, height = 360, label }) {
  const [step, setStep] = useS(0);
  const [t, setT] = useS(0);
  const [playing, setPlaying] = useS(autoplay);
  const rafRef = useR(0);
  const startRef = useR(0);

  useE(() => {
    if (!playing) return;
    let mounted = true;
    function loop(now) {
      if (!mounted) return;
      if (!startRef.current) startRef.current = now;
      const dt = now - startRef.current;
      const newT = Math.min(1, dt / stepDuration);
      setT(newT);
      if (newT >= 1) {
        if (step >= steps - 1) {
          setPlaying(false);
          startRef.current = 0;
          return;
        }
        setStep(s => s + 1);
        startRef.current = now;
        setT(0);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => { mounted = false; cancelAnimationFrame(rafRef.current); };
     
  }, [playing, step, steps, stepDuration]);

  const reset = () => { setStep(0); setT(0); setPlaying(false); startRef.current = 0; };
  const togglePlay = () => {
    if (step >= steps - 1 && t >= 1) {
      setStep(0); setT(0); setPlaying(true); startRef.current = 0;
    } else {
      setPlaying(p => !p);
      startRef.current = 0;
    }
  };
  const stepNext = () => { setT(1); if (step < steps - 1) { setStep(step + 1); setT(0);} setPlaying(false); };
  const stepPrev = () => { setT(0); if (step > 0) setStep(step - 1); setPlaying(false); };

  return (
    <div>
      <div style={{minHeight: height}}>{children({ step, t, playing })}</div>
      <div className="anim-controls">
        <button className="btn small" onClick={stepPrev} title="ก่อนหน้า">◀</button>
        <button className="btn small primary" onClick={togglePlay} title="เล่น/หยุด">
          {playing ? "⏸" : "▶"}
        </button>
        <button className="btn small" onClick={stepNext} title="ถัดไป">▶</button>
        <button className="btn small ghost" onClick={reset}>↺</button>
        <span className="anim-step-label">{label ? label(step) : `Step ${step+1}/${steps}`}</span>
        <div className="scrubber">
          <input type="range" min={0} max={(steps-1)*100} value={step*100 + t*100}
            onChange={e => {
              setPlaying(false);
              const v = +e.target.value;
              const s = Math.min(steps-1, Math.floor(v/100));
              const sub = (v - s*100) / 100;
              setStep(s); setT(sub);
            }} />
        </div>
      </div>
    </div>
  );
}

// === Easing ===
const ease = {
  linear: t => t,
  inOut: t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t*t*t,
};

// === Helpers for axis ===
function makeScale(domain, range) {
  const [d0, d1] = domain, [r0, r1] = range;
  const m = (r1 - r0) / (d1 - d0);
  return v => r0 + (v - d0) * m;
}

// Plot function as path
function plotPath(fn, x0, x1, sx, sy, n = 200) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = x0 + (x1 - x0) * i / n;
    let y;
    try { y = fn(x); } catch (e) { continue; }
    if (!isFinite(y)) continue;
    d += (i === 0 ? "M" : "L") + sx(x).toFixed(2) + "," + sy(y).toFixed(2) + " ";
  }
  return d;
}

// === Axis component ===
function Axes({ width, height, padding, xDomain, yDomain, xTicks = 6, yTicks = 5, gridColor = "#2b3340" }) {
  const sx = makeScale(xDomain, [padding.l, width - padding.r]);
  const sy = makeScale(yDomain, [height - padding.b, padding.t]);
  const xtv = ticks(xDomain[0], xDomain[1], xTicks);
  const ytv = ticks(yDomain[0], yDomain[1], yTicks);
  // y=0 and x=0 axes if in range
  const y0 = (yDomain[0] <= 0 && yDomain[1] >= 0) ? sy(0) : null;
  const x0 = (xDomain[0] <= 0 && xDomain[1] >= 0) ? sx(0) : null;
  return (
    <g className="axis">
      {xtv.map(v => (
        <line key={"gx"+v} x1={sx(v)} x2={sx(v)} y1={padding.t} y2={height-padding.b} stroke={gridColor} strokeDasharray="2 3" opacity="0.5"/>
      ))}
      {ytv.map(v => (
        <line key={"gy"+v} x1={padding.l} x2={width-padding.r} y1={sy(v)} y2={sy(v)} stroke={gridColor} strokeDasharray="2 3" opacity="0.5"/>
      ))}
      {y0 !== null && <line x1={padding.l} x2={width-padding.r} y1={y0} y2={y0} stroke="#6b7480"/>}
      {x0 !== null && <line x1={x0} x2={x0} y1={padding.t} y2={height-padding.b} stroke="#6b7480"/>}
      {xtv.map(v => (
        <text key={"tx"+v} x={sx(v)} y={height-padding.b+14} textAnchor="middle">{v}</text>
      ))}
      {ytv.map(v => (
        <text key={"ty"+v} x={padding.l-6} y={sy(v)+3} textAnchor="end">{v}</text>
      ))}
    </g>
  );
}

function ticks(a, b, n) {
  const step = niceStep((b - a) / n);
  const start = Math.ceil(a / step) * step;
  const out = [];
  for (let v = start; v <= b + 1e-9; v += step) out.push(+v.toFixed(8));
  return out;
}
function niceStep(raw) {
  const exp = Math.floor(Math.log10(raw));
  const f = raw / Math.pow(10, exp);
  let nf;
  if (f < 1.5) nf = 1;
  else if (f < 3) nf = 2;
  else if (f < 7) nf = 5;
  else nf = 10;
  return nf * Math.pow(10, exp);
}

Object.assign(window, { StepPlayer, makeScale, plotPath, Axes, ease });
