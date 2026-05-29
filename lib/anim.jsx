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

// === Function plot with iteration markers (shared across lessons) ===
// markers kinds: vline | point | label | line | interval | poly | curve
//   poly  = { pts: [[x,y],…], fill, stroke, width }   filled area in data coords
//   curve = { fn, x0, x1, color, width, dashed }       extra overlaid curve
function FnPlot({ fn, xDomain, yDomain, width = 640, height = 320, markers = [], extras = null }) {
  const padding = { l: 38, r: 12, t: 14, b: 26 };
  const sx = makeScale(xDomain, [padding.l, width - padding.r]);
  const sy = makeScale(yDomain, [height - padding.b, padding.t]);
  return (
    <svg className="svg-stage" viewBox={`0 0 ${width} ${height}`}>
      <Axes width={width} height={height} padding={padding} xDomain={xDomain} yDomain={yDomain}/>
      {fn && <path d={plotPath(fn, xDomain[0], xDomain[1], sx, sy)} fill="none" stroke="#58c4dd" strokeWidth="2.2"/>}
      {extras}
      {markers.map((m, i) => (
        <g key={i}>
          {m.kind === "poly" && (
            <polygon points={m.pts.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ")}
              fill={m.fill || "rgba(88,196,221,0.16)"} stroke={m.stroke || "#58c4dd"} strokeWidth={m.width || 1}/>
          )}
          {m.kind === "curve" && (
            <path d={plotPath(m.fn, m.x0 != null ? m.x0 : xDomain[0], m.x1 != null ? m.x1 : xDomain[1], sx, sy)}
              fill="none" stroke={m.color || "#a87dbe"} strokeWidth={m.width || 2} strokeDasharray={m.dashed ? "4 3" : null}/>
          )}
          {m.kind === "vline" && <line x1={sx(m.x)} x2={sx(m.x)} y1={padding.t} y2={height-padding.b} stroke={m.color || "#ffd66b"} strokeWidth="1.5" strokeDasharray={m.dashed ? "3 3" : null}/>}
          {m.kind === "point" && (
            <>
              <circle cx={sx(m.x)} cy={sy(m.y)} r={m.r || 5} fill={m.color || "#ffd66b"} stroke="#0e1116" strokeWidth="1.5"/>
              {m.label && <text x={sx(m.x)+9} y={sy(m.y)-6} fill={m.color || "#ffd66b"} fontFamily="JetBrains Mono" fontSize="11">{m.label}</text>}
            </>
          )}
          {m.kind === "label" && <text x={sx(m.x)} y={sy(m.y)} fill={m.color || "#e6edf3"} fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle">{m.text}</text>}
          {m.kind === "line" && <line x1={sx(m.x1)} y1={sy(m.y1)} x2={sx(m.x2)} y2={sy(m.y2)} stroke={m.color || "#ffd66b"} strokeWidth={m.width||1.5} strokeDasharray={m.dashed ? "3 3" : null}/>}
          {m.kind === "interval" && (
            <rect x={sx(m.x1)} y={padding.t} width={sx(m.x2)-sx(m.x1)} height={height-padding.t-padding.b} fill={m.color || "#58c4dd"} opacity="0.08"/>
          )}
        </g>
      ))}
    </svg>
  );
}

// === StepTable — same data as NumTable, but reveals rows one at a time (animated worked solution) ===
// Drop-in replacement for NumTable inside problem solutions: press ▶ to watch each iteration appear.
function StepTable({ headers, rows, caption }) {
  const fmtCell = (c) => typeof c === "number" ? (Number.isInteger(c) ? c : c.toFixed(4)) : c;
  return (
    <StepPlayer steps={rows.length} stepDuration={900} height={40} label={(s) => `แถว ${s+1}/${rows.length}`}>
      {({ step }) => (
        <div style={{overflowX:"auto"}}>
          {caption && <div className="muted" style={{fontSize:12, marginBottom:4}}>{caption}</div>}
          <table className="tbl">
            <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.slice(0, step+1).map((r, i) => (
                <tr key={i} className={i === step ? "hi" : ""}>
                  {r.map((c, j) => <td key={j} className={typeof c === "number" ? "num" : ""}>{fmtCell(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StepPlayer>
  );
}

Object.assign(window, { StepPlayer, makeScale, plotPath, Axes, ease, FnPlot, StepTable });
