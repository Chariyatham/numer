// Root Finding — Bisection, False Position, One-point, Newton, Secant, Graphical
// ปีนี้ = บทที่ 3 (สัปดาห์ 4) — ไม่ได้เข้าเรียน w4 และไม่มีสไลด์/เสียง
//   หลักฐานที่ใช้กำหนดขอบเขต: "การบ้าน 4 bisection and false position.pdf" (แจก 26 ก.ค. 2026)
//   → w4 สอน Graphical (ค้างมาจากการบ้าน 3) + Bisection + False Position เท่านั้น
//   ส่วน One-point / Newton / Secant / Taylor สร้างจากชีทปีที่แล้ว (root1-3.pdf) รอเลคเชอร์จริงมายืนยัน

const { useState: useStR, useMemo: useMmR, useRef: useRfR, useEffect: useEfR } = React;

// === Hand-calculation walkthrough — reveals EVERY substitution one step at a time, like a professor writing on the board ===
function HandWalkthrough({ steps }) {
  const renderStep = (s, i, isCurrent) => (
    <div key={i} style={{margin:"10px 0", paddingLeft:14,
        borderLeft: isCurrent ? "3px solid var(--blue)" : "2px solid var(--green-dim)",
        background: isCurrent ? "rgba(88,196,221,0.05)" : "transparent",
        borderRadius: isCurrent ? 6 : 0,
        opacity: isCurrent ? 1 : 0.72,
        transition: "opacity .25s ease"}}>
      <div style={{color:"var(--blue)", fontWeight:600, fontSize:'0.778rem', marginBottom:4}}>ขั้น {i+1}: {s.title}</div>
      <div style={{fontFamily:"var(--font-mono)", fontSize:'0.806rem', lineHeight:1.85, whiteSpace:"pre-wrap"}}>{s.body}</div>
      {s.calc && (
        <div style={{marginTop:6, padding:"6px 10px", background:"var(--bg-soft)", border:"1px solid var(--blue-dim)", borderRadius:6, fontSize:'0.75rem', fontFamily:"var(--font-mono)"}}>
          <span style={{color:"var(--blue)"}}>📟 fx-991CW:</span> {s.calc}
        </div>
      )}
    </div>
  );
  return (
    <div style={{background:"linear-gradient(135deg, rgba(131,193,103,0.04), rgba(88,196,221,0.04))",
                 border:"1px solid var(--green-dim)", borderRadius:10, padding:"14px 18px", margin:"14px 0"}}>
      <div className="kicker" style={{color:"var(--green)", marginBottom:8}}>✍️ เขียนมือทีละขั้น (สไตล์เฉลยอาจารย์) · กด ▶ ให้เฉลยค่อย ๆ ขึ้นทีละขั้น</div>
      <StepPlayer steps={steps.length} stepDuration={1700} height={90} label={(s) => `ขั้น ${s+1}/${steps.length}`}>
        {({ step }) => (
          <div>{steps.slice(0, step+1).map((s, i) => renderStep(s, i, i === step))}</div>
        )}
      </StepPlayer>
    </div>
  );
}

// FnPlot (function plot with iteration markers) is shared from lib/anim.jsx

// === Bisection animated visualization ===
function BisectionViz({ fn, a0, b0, exprText, root: trueRoot }) {
  const { rows } = useMmR(() => bisection(fn, a0, b0, 12), [fn, a0, b0]);
  const steps = rows.length;
  // domain widens slightly
  const margin = (b0 - a0) * 0.15;
  const xDomain = [a0 - margin, b0 + margin];
  let yMin = Infinity, yMax = -Infinity;
  for (let i = 0; i <= 30; i++) {
    const x = xDomain[0] + (xDomain[1]-xDomain[0])*i/30;
    const y = fn(x);
    if (isFinite(y)) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }
  }
  if (!isFinite(yMin)) { yMin = -10; yMax = 10; }
  const pad = (yMax - yMin) * 0.18 || 1;
  const yDomain = [yMin - pad, yMax + pad];

  return (
    <StepPlayer steps={steps} stepDuration={1500} label={(s) => `Iter ${s+1} / ${steps}`}>
      {({ step, t }) => {
        const r = rows[step];
        const markers = [
          { kind: "interval", x1: r.xl, x2: r.xr, color: "#58c4dd" },
          { kind: "vline", x: r.xl, color: "#83c167" },
          { kind: "vline", x: r.xr, color: "#f47274" },
          { kind: "vline", x: r.xm, color: "#ffd66b", dashed: true },
          { kind: "point", x: r.xl, y: r.fl, color: "#83c167", label: "a" },
          { kind: "point", x: r.xr, y: r.fr, color: "#f47274", label: "b" },
          { kind: "point", x: r.xm, y: r.fm, color: "#ffd66b", label: "m" },
        ];
        return (
          <div>
            <FnPlot fn={fn} xDomain={xDomain} yDomain={yDomain} markers={markers} height={320}/>
            <div className="grid-2" style={{marginTop:10}}>
              <div className="card tight">
                <div className="kicker">Iteration {r.iter}</div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7, color:"var(--text)"}}>
                  <div><span style={{color:"#83c167"}}>a</span> = {r.xl.toFixed(6)} &nbsp;<span style={{color:"var(--text-faint)"}}>f(a) = {r.fl.toFixed(4)}</span></div>
                  <div><span style={{color:"#f47274"}}>b</span> = {r.xr.toFixed(6)} &nbsp;<span style={{color:"var(--text-faint)"}}>f(b) = {r.fr.toFixed(4)}</span></div>
                  <div><span style={{color:"#ffd66b"}}>m</span> = (a+b)/2 = <b>{r.xm.toFixed(6)}</b></div>
                  <div><span style={{color:"var(--text-faint)"}}>f(m) =</span> {r.fm.toFixed(6)}</div>
                  <div><span style={{color:"var(--text-faint)"}}>εₐ =</span> {r.err === null ? "—" : (r.err*100).toFixed(5) + "%"}</div>
                </div>
              </div>
              <div className="card tight">
                <div className="kicker">การตัดสินใจ</div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7}}>
                  f(a)·f(m) = {(r.fl*r.fm).toFixed(4)}
                  {r.fl*r.fm < 0
                    ? <div style={{color:"var(--green)"}}>&lt; 0 → ราก<b>อยู่ซ้าย</b> → ตั้ง b ← m</div>
                    : <div style={{color:"var(--green)"}}>&gt; 0 → ราก<b>อยู่ขวา</b> → ตั้ง a ← m</div>}
                </div>
                {trueRoot && <div style={{marginTop:8, color:"var(--text-faint)", fontSize:'0.75rem'}}>
                  คำตอบจริง ≈ {trueRoot.toFixed(6)} · ความผิดพลาดจาก m = {Math.abs(r.xm - trueRoot).toFixed(6)}
                </div>}
              </div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}

// === Newton-Raphson animated visualization ===
function NewtonViz({ fn, fprime, x0, exprText }) {
  const { rows } = useMmR(() => newtonRaphson(fn, x0, 10, 1e-8, fprime), [fn, fprime, x0]);
  const steps = rows.length;
  // domain
  let xs = rows.map(r => r.x).concat(rows.map(r => r.xnew));
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const span = Math.max(2, (xmax - xmin) * 1.6);
  const xDomain = [xmin - span*0.3, xmax + span*0.3];
  let yMin = Infinity, yMax = -Infinity;
  for (let i = 0; i <= 40; i++) {
    const x = xDomain[0] + (xDomain[1]-xDomain[0])*i/40;
    const y = fn(x);
    if (isFinite(y)) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }
  }
  const pad = (yMax - yMin) * 0.2 || 1;
  const yDomain = [yMin - pad, yMax + pad];

  return (
    <StepPlayer steps={steps} stepDuration={1700} label={(s) => `Iter ${s+1}`}>
      {({ step, t }) => {
        const r = rows[step];
        // tangent line at x: y = f(x) + f'(x)(X - x); crosses x-axis at xnew
        const slope = r.fpx;
        const xMin = xDomain[0], xMax = xDomain[1];
        const yAtMin = r.fx + slope * (xMin - r.x);
        const yAtMax = r.fx + slope * (xMax - r.x);
        const markers = [
          { kind: "line", x1: xMin, y1: yAtMin, x2: xMax, y2: yAtMax, color: "#ffd66b", dashed: true, width: 1.2 },
          { kind: "point", x: r.x, y: r.fx, color: "#58c4dd", label: `x${step}` },
          { kind: "point", x: r.xnew, y: 0, color: "#83c167", label: `x${step+1}` },
          { kind: "line", x1: r.x, y1: r.fx, x2: r.x, y2: 0, color: "#58c4dd", dashed: true, width: 1 },
        ];
        return (
          <div>
            <FnPlot fn={fn} xDomain={xDomain} yDomain={yDomain} markers={markers} height={320}/>
            <div className="card tight" style={{marginTop:10}}>
              <div className="kicker">Iteration {r.iter}</div>
              <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7}}>
                <span style={{color:"#58c4dd"}}>xᵢ</span> = {r.x.toFixed(6)} &nbsp;
                f(xᵢ) = {r.fx.toFixed(6)} &nbsp; f'(xᵢ) = {r.fpx.toFixed(6)}
                <div><span style={{color:"#83c167"}}>xᵢ₊₁</span> = xᵢ − f(xᵢ)/f'(xᵢ) = <b>{r.xnew.toFixed(6)}</b></div>
                <div><span style={{color:"var(--text-faint)"}}>εₐ =</span> {(r.err*100).toFixed(5)}%</div>
              </div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}

// === Secant animated visualization ===
function SecantViz({ fn, x0, x1 }) {
  const { rows } = useMmR(() => secant(fn, x0, x1, 10), [fn, x0, x1]);
  const steps = rows.length;
  let xs = rows.map(r => r.xa).concat(rows.map(r => r.xb), rows.map(r => r.xnew));
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const span = Math.max(2, (xmax - xmin) * 1.4);
  const xDomain = [xmin - span*0.2, xmax + span*0.2];
  let yMin = Infinity, yMax = -Infinity;
  for (let i = 0; i <= 40; i++) {
    const x = xDomain[0] + (xDomain[1]-xDomain[0])*i/40;
    const y = fn(x);
    if (isFinite(y)) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }
  }
  const pad = (yMax - yMin) * 0.2 || 1;
  const yDomain = [yMin - pad, yMax + pad];

  return (
    <StepPlayer steps={steps} stepDuration={1600} label={(s) => `Iter ${s+1}`}>
      {({ step }) => {
        const r = rows[step];
        // secant line through (xa, fa) and (xb, fb)
        const xMin = xDomain[0], xMax = xDomain[1];
        const slope = (r.fb - r.fa) / (r.xb - r.xa);
        const yAtMin = r.fa + slope * (xMin - r.xa);
        const yAtMax = r.fa + slope * (xMax - r.xa);
        const markers = [
          { kind: "line", x1: xMin, y1: yAtMin, x2: xMax, y2: yAtMax, color: "#ffd66b", dashed: true, width: 1.2 },
          { kind: "point", x: r.xa, y: r.fa, color: "#58c4dd", label: "x₀" },
          { kind: "point", x: r.xb, y: r.fb, color: "#a87dbe", label: "x₁" },
          { kind: "point", x: r.xnew, y: 0, color: "#83c167", label: "x₂" },
        ];
        return (
          <div>
            <FnPlot fn={fn} xDomain={xDomain} yDomain={yDomain} markers={markers} height={320}/>
            <div className="card tight" style={{marginTop:10}}>
              <div className="kicker">Iteration {r.iter}</div>
              <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7}}>
                x₀ = {r.xa.toFixed(6)}, f(x₀) = {r.fa.toFixed(4)}<br/>
                x₁ = {r.xb.toFixed(6)}, f(x₁) = {r.fb.toFixed(4)}<br/>
                <span style={{color:"#83c167"}}>x₂</span> = x₁ − f(x₁)(x₀−x₁)/(f(x₀)−f(x₁)) = <b>{r.xnew.toFixed(6)}</b><br/>
                <span style={{color:"var(--text-faint)"}}>εₐ =</span> {(r.err*100).toFixed(5)}%
              </div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}

// === False Position animated visualization ===
function FalsePosViz({ fn, a0, b0 }) {
  const { rows } = useMmR(() => falsePosition(fn, a0, b0, 10), [fn, a0, b0]);
  const steps = rows.length;
  const margin = (b0 - a0) * 0.15;
  const xDomain = [a0 - margin, b0 + margin];
  let yMin = Infinity, yMax = -Infinity;
  for (let i = 0; i <= 40; i++) {
    const x = xDomain[0] + (xDomain[1]-xDomain[0])*i/40;
    const y = fn(x);
    if (isFinite(y)) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }
  }
  const pad = (yMax - yMin) * 0.2 || 1;
  const yDomain = [yMin - pad, yMax + pad];

  return (
    <StepPlayer steps={steps} stepDuration={1600} label={(s) => `Iter ${s+1}/${steps}`}>
      {({ step }) => {
        const r = rows[step];
        const markers = [
          { kind: "line", x1: r.xl, y1: r.fl, x2: r.xr, y2: r.fr, color: "#ffd66b", dashed: true, width: 1.4 },
          { kind: "point", x: r.xl, y: r.fl, color: "#83c167", label: "xₗ" },
          { kind: "point", x: r.xr, y: r.fr, color: "#f47274", label: "xᵣ" },
          { kind: "point", x: r.xm, y: 0, color: "#ffd66b", label: "xₘ" },
          { kind: "vline", x: r.xm, color: "#ffd66b", dashed: true },
        ];
        return (
          <div>
            <FnPlot fn={fn} xDomain={xDomain} yDomain={yDomain} markers={markers} height={320}/>
            <div className="card tight" style={{marginTop:10}}>
              <div className="kicker">Iteration {r.iter}</div>
              <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7}}>
                <span style={{color:"#83c167"}}>xₗ</span> = {r.xl.toFixed(6)}, f = {r.fl.toFixed(4)}<br/>
                <span style={{color:"#f47274"}}>xᵣ</span> = {r.xr.toFixed(6)}, f = {r.fr.toFixed(4)}<br/>
                <span style={{color:"#ffd66b"}}>xₘ</span> = xᵣ − f(xᵣ)(xₗ−xᵣ)/(f(xₗ)−f(xᵣ)) = <b>{r.xm.toFixed(6)}</b><br/>
                f(xₘ) = {r.fm.toExponential(3)}, εₐ = {r.err === null ? "—" : (r.err*100).toFixed(4) + "%"}
              </div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}

// === One-Point Cobweb visualization ===
function CobwebViz({ g, x0, exprText }) {
  const { rows } = useMmR(() => onePoint(g, x0, 8), [g, x0]);
  const steps = rows.length;
  // domain choice based on iterates
  const xs = rows.map(r => r.x).concat(rows.map(r => r.xnew));
  const xmin = Math.min(...xs, x0), xmax = Math.max(...xs, x0);
  const span = Math.max(2, (xmax - xmin) * 1.6);
  const xDomain = [xmin - span*0.3, xmax + span*0.3];
  const yDomain = xDomain.slice();
  const sx = makeScale(xDomain, [38, 638 - 12]);
  const sy = makeScale(yDomain, [320 - 26, 14]);

  return (
    <StepPlayer steps={steps} stepDuration={1500} label={(s) => `Iter ${s+1}`}>
      {({ step }) => {
        const r = rows[step];
        // Build cobweb segments up to current step
        const segments = [];
        for (let k = 0; k <= step; k++) {
          const rk = rows[k];
          // vertical: (x, x) → (x, g(x))
          segments.push({ x1: rk.x, y1: rk.x, x2: rk.x, y2: rk.xnew });
          // horizontal: (x, g(x)) → (g(x), g(x))
          segments.push({ x1: rk.x, y1: rk.xnew, x2: rk.xnew, y2: rk.xnew });
        }
        return (
          <div>
            <svg className="svg-stage" viewBox="0 0 640 320">
              <Axes width={640} height={320} padding={{l:38, r:12, t:14, b:26}} xDomain={xDomain} yDomain={yDomain}/>
              {/* y = x identity line */}
              <line x1={sx(xDomain[0])} y1={sy(xDomain[0])} x2={sx(xDomain[1])} y2={sy(xDomain[1])} stroke="#83c167" strokeDasharray="4 4" strokeWidth="1"/>
              {/* g(x) curve */}
              <path d={plotPath(g, xDomain[0], xDomain[1], sx, sy)} fill="none" stroke="#58c4dd" strokeWidth="2.2"/>
              {/* cobweb */}
              {segments.map((s, i) => (
                <line key={i} x1={sx(s.x1)} y1={sy(s.y1)} x2={sx(s.x2)} y2={sy(s.y2)} stroke="#ffd66b" strokeWidth="1.3" opacity={0.4 + 0.6 * (i / (segments.length || 1))}/>
              ))}
              {/* current point */}
              <circle cx={sx(r.x)} cy={sy(r.x)} r="4" fill="#f47274"/>
              <circle cx={sx(r.xnew)} cy={sy(r.xnew)} r="4" fill="#83c167"/>
              <text x={10} y={28} fontSize="12" fontFamily="JetBrains Mono" fill="#83c167">y = x</text>
              <text x={10} y={46} fontSize="12" fontFamily="JetBrains Mono" fill="#58c4dd">y = g(x)</text>
              {exprText && <text x={10} y={64} fontSize="12" fontFamily="JetBrains Mono" fill="#a87dbe">{exprText}</text>}
            </svg>
            <div className="card tight" style={{marginTop:10}}>
              <div className="kicker">Iteration {r.iter}</div>
              <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7}}>
                xₙ = {r.x.toFixed(8)}<br/>
                xₙ₊₁ = g(xₙ) = <b>{r.xnew.toFixed(8)}</b><br/>
                εₐ = {(r.err*100).toFixed(5)}%
              </div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}

// === Taylor Series visualization ===
// Animated: step the Taylor order n = 0,1,2,… and watch Tₙ(x) hug f(x) over a wider range
function TaylorViz({ f, derivs, x0, xRange, trueLabel }) {
  const [xMin, xMax] = xRange;
  // y-range fixed across all n (use the true function) so the curve doesn't jump while animating
  let yMin = Infinity, yMax = -Infinity;
  for (let i = 0; i <= 60; i++) {
    const y = f(xMin + (xMax-xMin)*i/60);
    if (isFinite(y)) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); }
  }
  const pad = (yMax - yMin) * 0.4 || 1;
  const yDomain = [yMin - pad, yMax + pad];
  const sx = makeScale([xMin, xMax], [38, 638 - 12]);
  const sy = makeScale(yDomain, [320 - 26, 14]);

  return (
    <StepPlayer steps={derivs.length} stepDuration={1300} label={(s) => `Order n = ${s}`}>
      {({ step: n }) => {
        const Tn = (x) => {
          let s = 0, fact = 1, dx = 1;
          for (let k = 0; k <= n; k++) {
            if (k > 0) { fact *= k; dx *= (x - x0); }
            s += derivs[k](x0) * dx / fact;
          }
          return s;
        };
        return (
          <svg className="svg-stage" viewBox="0 0 640 320">
            <Axes width={640} height={320} padding={{l:38, r:12, t:14, b:26}} xDomain={[xMin,xMax]} yDomain={yDomain}/>
            <path d={plotPath(f, xMin, xMax, sx, sy)} fill="none" stroke="#58c4dd" strokeWidth="2.2"/>
            <path d={plotPath(Tn, xMin, xMax, sx, sy)} fill="none" stroke="#ffd66b" strokeWidth="2.2" strokeDasharray="4 3"/>
            <circle cx={sx(x0)} cy={sy(f(x0))} r="5" fill="#83c167"/>
            <text x={sx(x0)+8} y={sy(f(x0))-8} fontFamily="JetBrains Mono" fontSize="11" fill="#83c167">x₀ = {x0}</text>
            <text x={10} y={28} fontFamily="JetBrains Mono" fontSize="12" fill="#58c4dd">{trueLabel || "f(x)"}</text>
            <text x={10} y={46} fontFamily="JetBrains Mono" fontSize="12" fill="#ffd66b">Tₙ(x) order {n}</text>
          </svg>
        );
      }}
    </StepPlayer>
  );
}

// === Generic iteration solver (Newton/Secant/FalsePos/OnePoint) ===
function RootSolver({ method = "newton" }) {
  const [expr, setExpr] = useStR(method === "onepoint" ? "0.5*(x + 7/x)" : "x^2 - 7");
  const [x0, setX0] = useStR("2");
  const [x1, setX1] = useStR("3");
  const [a, setA] = useStR("1.5");
  const [b, setB] = useStR("2.5");
  const [tol, setTol] = useStR("0.000001");

  const { rows, error } = useMmR(() => {
    try {
      const f = parseExpr(expr);
      if (method === "newton") return newtonRaphson(f, +x0, 60, +tol);
      if (method === "secant") return secant(f, +x0, +x1, 60, +tol);
      if (method === "falsepos") return falsePosition(f, +a, +b, 60, +tol);
      if (method === "onepoint") return onePoint(f, +x0, 60, +tol);
    } catch (e) { return { rows: [], error: e.message }; }
  }, [expr, x0, x1, a, b, tol, method]);

  const cols = method === "newton" ? ["i","x","f(x)","f'(x)","x_new","εₐ%"]
              : method === "secant" ? ["i","x₀","x₁","f(x₀)","f(x₁)","x_new","εₐ%"]
              : method === "falsepos" ? ["i","xₗ","xᵣ","xₘ","f(xₘ)","εₐ%"]
              : ["i","x","x_new","εₐ%"];
  const renderRow = (r, i) => {
    if (method === "newton") return [r.iter, r.x.toFixed(6), r.fx.toExponential(3), r.fpx.toFixed(4), r.xnew.toFixed(6), (r.err*100).toFixed(5)];
    if (method === "secant") return [r.iter, r.xa.toFixed(6), r.xb.toFixed(6), r.fa.toExponential(3), r.fb.toExponential(3), r.xnew.toFixed(6), (r.err*100).toFixed(5)];
    if (method === "falsepos") return [r.iter, r.xl.toFixed(6), r.xr.toFixed(6), r.xm.toFixed(6), r.fm.toExponential(3), r.err === null ? "—" : (r.err*100).toFixed(5)];
    return [r.iter, r.x.toFixed(8), r.xnew.toFixed(8), (r.err*100).toFixed(5)];
  };

  return (
    <div className="card">
      <div className="field-row">
        <div className="field" style={{flex:2}}><label>{method === "onepoint" ? "g(x) =" : "f(x) ="}</label><input type="text" value={expr} onChange={e => setExpr(e.target.value)}/></div>
        {(method === "newton" || method === "secant" || method === "onepoint") && <div className="field"><label>x₀</label><input type="number" value={x0} onChange={e => setX0(e.target.value)} step="0.1"/></div>}
        {method === "secant" && <div className="field"><label>x₁</label><input type="number" value={x1} onChange={e => setX1(e.target.value)} step="0.1"/></div>}
        {method === "falsepos" && <>
          <div className="field"><label>a</label><input type="number" value={a} onChange={e => setA(e.target.value)} step="0.1"/></div>
          <div className="field"><label>b</label><input type="number" value={b} onChange={e => setB(e.target.value)} step="0.1"/></div>
        </>}
        <div className="field"><label>tol</label><input type="number" value={tol} onChange={e => setTol(e.target.value)} step="0.000001"/></div>
      </div>
      {error && <Callout kind="danger">{error}</Callout>}
      {rows && rows.length > 0 && (
        <div style={{marginTop:14, overflowX:"auto", maxHeight:340, overflowY:"auto"}}>
          <table className="tbl">
            <thead><tr>{cols.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i === rows.length-1 ? "hi" : ""}>
                  {renderRow(r, i).map((c, j) => <td key={j} className="num">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows && rows.length > 0 && !error && (
        <div className="callout good" style={{marginTop:10}}>
          คำตอบ ≈ <b style={{fontFamily:"var(--font-mono)"}}>
            {method === "newton" ? rows[rows.length-1].xnew.toFixed(8)
            : method === "secant" ? rows[rows.length-1].xnew.toFixed(8)
            : method === "falsepos" ? rows[rows.length-1].xm.toFixed(8)
            : rows[rows.length-1].xnew.toFixed(8)}
          </b> ใช้ {rows.length} iterations
        </div>
      )}
    </div>
  );
}

// === Interactive bisection solver ===
function BisectionSolver() {
  const [expr, setExpr] = useStR("x^3 - x - 2");
  const [a, setA] = useStR("1");
  const [b, setB] = useStR("2");
  const [tol, setTol] = useStR("0.000001");

  const { rows, error } = useMmR(() => {
    try {
      const f = parseExpr(expr);
      return bisection(f, +a, +b, 60, +tol);
    } catch (e) { return { rows: [], error: e.message }; }
  }, [expr, a, b, tol]);

  return (
    <div className="card">
      <div className="field-row">
        <div className="field" style={{flex:2}}>
          <label>f(x) =</label>
          <input type="text" value={expr} onChange={e => setExpr(e.target.value)}/>
        </div>
        <div className="field"><label>a</label><input type="number" value={a} onChange={e => setA(e.target.value)} step="0.1"/></div>
        <div className="field"><label>b</label><input type="number" value={b} onChange={e => setB(e.target.value)} step="0.1"/></div>
        <div className="field"><label>tolerance</label><input type="number" value={tol} onChange={e => setTol(e.target.value)} step="0.000001"/></div>
      </div>
      {error && <Callout kind="danger">{error}</Callout>}
      {rows.length > 0 && (
        <div style={{marginTop:14, overflowX:"auto", maxHeight:340, overflowY:"auto"}}>
          <table className="tbl">
            <thead><tr>
              <th>i</th><th>xₗ</th><th>xᵣ</th><th>xₘ</th><th>f(xₘ)</th><th>εₐ %</th>
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i === rows.length-1 ? "hi" : ""}>
                  <td className="num">{r.iter}</td>
                  <td className="num">{r.xl.toFixed(6)}</td>
                  <td className="num">{r.xr.toFixed(6)}</td>
                  <td className="num">{r.xm.toFixed(6)}</td>
                  <td className="num">{r.fm.toExponential(3)}</td>
                  <td className="num">{r.err === null ? "—" : (r.err*100).toFixed(5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length > 0 && !error && (
        <div className="callout good" style={{marginTop:10}}>
          คำตอบ ≈ <b style={{fontFamily:"var(--font-mono)"}}>{rows[rows.length-1].xm.toFixed(8)}</b> ใช้ {rows.length} iterations
        </div>
      )}
    </div>
  );
}

// === Lesson body ===
function RootFindingLesson() {
  // Setup our example f(x) = x^3 - x - 2 with root ≈ 1.5213...
  const fEx = useMmR(() => x => Math.pow(x,3) - x - 2, []);
  const fpEx = useMmR(() => x => 3*x*x - 1, []);
  // For Newton √13⁴? Actually exercise: √₄ 13 means 4th root of 13
  // Newton example will use √7 → solve x^2 - 7 = 0
  const f7 = useMmR(() => x => x*x - 7, []);
  const fp7 = useMmR(() => x => 2*x, []);

  return (
    <div>
      <Hero
        kicker="03 · Root Finding"
        title="หาราก f(x) = 0"
        lead="วิธีเชิงตัวเลขสำหรับสมการที่แก้แบบ analytical ไม่ได้ — ตั้งแต่ Graphical, Bisection จนถึง Newton-Raphson"
        readout={{
          label: "Newton–Raphson · x³−x−2 = 0",
          steps: [
            { x: "1.500", w: 72 },
            { x: "1.5217", w: 24 },
            { x: "1.52138", w: 7 },
          ],
          result: "1.521380",
          note: "แต่ละรอบจำนวนหลักที่ถูกต้องเพิ่มเป็นเท่าตัว — ลู่เข้าเร็วมาก (quadratic)",
        }}
        meta={["6 methods", "Animation ทุก method", "fx-991CW SOLVE", "Python complete"]}
      />

      <Callout kind="warn" title="📮 การบ้าน 4 · เช็กลิสต์ 5 ข้อ (เฉลย + โปรแกรมอยู่ครบในหน้านี้)">
        <NumTable
          headers={["ข้อ", "โจทย์", "ต้องส่งอะไร", "อยู่หัวข้อ"]}
          rows={[
            ["1", "Bisection หา ⁴√13 ช่วง [1.5, 2.0]", "ทำมือ 4 รอบ + โปรแกรมจนนิ่ง 6 ทศนิยม", "2 · Bisection"],
            ["2", "โปรแกรมถอดรากที่ n ด้วย Bisection", "รับ x n / xl xr → ตอบ 4 ทศนิยม", "2 · Bisection"],
            ["3", "พิสูจน์สูตร False Position จากรูป", "เขียนพิสูจน์ tan θ = tan β", "3 · False Position"],
            ["4", "False Position หา ⁴√13 ช่วง [1.5, 2.0]", "ทำมือ 4 รอบ + โปรแกรมจนนิ่ง 6 ทศนิยม", "3 · False Position"],
            ["5", "โปรแกรมถอดรากที่ n ด้วย False Position", "สเปคเดียวกับข้อ 2", "3 · False Position"],
          ]}
        />
        <p style={{margin:"8px 0 0", fontSize:'0.82rem'}}>ข้อ 1 กับ 4 เป็น<b>โจทย์เดียวกัน</b> — ตั้งใจให้เทียบว่าวิธีไหนเข้าเป้าเร็วกว่า. ข้อ 2 กับ 5 ก็โจทย์เดียวกัน ต่างแค่วิธี ⇒ <b>เขียนโครงเดียว สลับบรรทัดคำนวณ</b> จบ 2 ข้อ. ส่วน <b>การบ้าน 3 ข้อ 1</b> (graphical 43x−180) อยู่ในหัวข้อ 1 ด้านล่าง. หมายเหตุ: ในใบงานจริง ข้อย่อยของข้อ 1 พิมพ์เลขหลงเป็น “2.1 / 2.2” — หน้านี้เรียกเป็น 1.1 / 1.2 เพื่อไม่ให้ชนกับข้อ 2</p>
      </Callout>

      <Callout kind="warn" title="📮 การบ้าน 5 · Iteration — เช็กลิสต์ 3 ข้อ (แจกในคาบ 5 ส.ค. · เฉลยครบในหน้านี้)">
        <NumTable
          headers={["ข้อ", "วิธี", "จุดเริ่ม", "ต้องส่งอะไร", "อยู่หัวข้อ"]}
          rows={[
            ["1", "One-point Iteration", "x₀ = 0", "ทำมือ 4 รอบ + โปรแกรมจนนิ่ง 6 ทศนิยม", "4 · One-point"],
            ["2", "Newton-Raphson", "x₀ = 2.0", "ทำมือ 4 รอบ + โปรแกรมจนคลาดเคลื่อน < 0.000001 + กราฟ f, f′", "5 · Newton"],
            ["3", "Secant", "x₀ = 2.0", "ทำมือ 4 รอบ + โปรแกรมจนคลาดเคลื่อน < 0.000001 + กราฟ f, f′", "6 · Secant"],
          ]}
        />
        <p style={{margin:"8px 0 0", fontSize:'0.82rem'}}>ทั้งใบเป็น<b>โจทย์เดียวกันหมด — หา <M>{`\\sqrt{7}`}</M></b> ⇒ เขียน <M>{`f(x)=x^2-7`}</M> กับ <M>{`f'(x)=2x`}</M> ครั้งเดียวใช้ได้ทั้ง 3 ข้อ ต่างกันแค่ <b>iteration form</b> กับจำนวน initial value ⇒ <b>โครงโปรแกรมเดียว สลับแค่บรรทัดคำนวณ</b> จบทั้งใบ (เหมือนการบ้าน 4 ข้อ 2 กับ 5)</p>
        <ul style={{margin:"8px 0 0", paddingLeft:18, fontSize:'0.82rem'}}>
          <li><b>ข้อ 1 เกณฑ์หยุดคนละตัวกับข้อ 2/3</b> — ข้อ 1 คือ “ทศนิยม 6 ตำแหน่งไม่เปลี่ยน” (เทียบค่าที่<b>ปัดแล้ว</b>) ส่วนข้อ 2/3 คือ “คลาดเคลื่อน &lt; 0.000001” (เทียบ <M>{`|\\Delta x|`}</M>) — ในโจทย์นี้ต่างกันจริง 2 รอบ (23 กับ 21 รอบ) ดูเทียบกันที่ข้อ 1.2</li>
          <li>⚠︎ <b>ข้อ 3 ให้มาแค่ <M>{`x_0 = 2.0`}</M> แต่ Secant ต้องมีจุดเริ่ม 2 จุด</b> (อาจารย์ย้ำเองในคาบ) ⇒ เลือก <M>{`x_1`}</M> เอง · ข่าวดีคือ<b>ไม่กระทบคำตอบ</b>: <M>{`x_1=3`}</M> → 2.645751, คู่ที่อาจารย์ให้ในคาบ <M>{`x_0=3,x_1=2`}</M> → 2.645751, คู่ในเอกสารติว <M>{`x_1=2.5`}</M> → 2.645751 <b>เท่ากันหมดที่รอบ 4 (6 ทศนิยม)</b> — หน้านี้ใช้ <M>{`x_1 = 3.0`}</M> เป็นหลัก</li>
          <li>📄 ใบงานพิมพ์เลขข้อย่อยของ<b>ข้อ 3 หลงเป็น “2.1 / 2.2 / 2.3”</b> (ควรเป็น 3.1/3.2/3.3) — typo แบบเดียวกับการบ้าน 4 เป๊ะ หน้านี้เรียก 3.1/3.2/3.3 เพื่อไม่ให้ชนกับข้อ 2</li>
          <li>🖼 <b>ข้อ 2.3 / 3.3 ให้วาดกราฟ</b> <M>{`f(x)`}</M> กับ <M>{`f'(x)`}</M> — ในใบงานมีรูปตัวอย่างเป็นกราฟ <M>{`f`}</M> ที่มีเส้นไต่ลงมาหา root · ใช้ matplotlib กดรันได้ในหน้านี้เลย</li>
        </ul>
      </Callout>

      <Callout kind="danger" title="⭐ กติกาเดินตารางของอาจารย์ (จากเอกสารติวก่อนสอบ) — จำ 4 ข้อนี้ก่อนทำข้อสอบ">
        <NumTable
          headers={["วิธี", "มี “รอบทำทิ้ง” ไหม", "เริ่มคิด error รอบไหน", "สูตร error"]}
          rows={[
            ["Bisection", "✅ มี — รอบ 0 ทำทิ้ง ไม่หา error", "รอบ 1", "ε = |xm ใหม่ − xm เก่า| / xm ใหม่"],
            ["False Position", "✅ มี — รอบ 0 ทำทิ้ง", "รอบ 1", "ε = |x₁ ใหม่ − x₁ เก่า| / x₁ ใหม่"],
            ["One-point", "❌ ไม่มี", "รอบ 1", "ε = |xᵢ₊₁ − xᵢ| / xᵢ₊₁"],
            ["Newton-Raphson", "❌ ไม่มี", "รอบ 1", "ε = |xᵢ₊₁ − xᵢ| / xᵢ₊₁"],
            ["Secant", "❌ ไม่มี", "รอบ 1", "ε = |xᵢ₊₁ − xᵢ| / xᵢ₊₁"],
            ["Taylor Series", "— (ไม่ใช่ iteration)", "ทุก N", "ε = |ค่าจริง − ค่าประมาณ| (สัมบูรณ์)"],
          ]}
        />
        <ul style={{margin:"8px 0 0", paddingLeft:18}}>
          <li><b>ทุกวิธีวนซ้ำใช้ error แบบ “เทียบกับค่าใหม่”</b> (relative ต่อ <M>{`x`}</M> รอบล่าสุด) ไม่ใช่เทียบค่าจริง — เพราะโจทย์จริงเราไม่รู้ค่าจริง</li>
          <li>อาจารย์เขียน ε เป็น<b>สัดส่วนดิบ</b> (เช่น 0.066667) บ่อยกว่าเปอร์เซ็นต์ — จะตอบเป็น % ก็ได้ แต่<b>ต้องบอกหน่วยให้ชัด</b> อย่าสลับไปมาในตารางเดียว</li>
          <li><b>“ใช้เศษส่วนดีกว่า ถ้าทศนิยมลงตัวก็ใช้ได้”</b> — คำสั่งตรงจากคาบติว เพราะปัดกลางทางแล้วเลขรอบหลังเพี้ยนหมด (ดูตัวอย่างจริงในหัวข้อ Newton)</li>
          <li><b>“เอาทศนิยมให้ได้มากสุดมาคิด”</b> — กำกับไว้ที่หัวข้อ False Position โดยเฉพาะ</li>
        </ul>
      </Callout>

      <Sect tag="0" title="ทำไมต้องเรียน">
        <p>ลองดูสมการนี้: <M>{`x^3 - x - 2 = 0`}</M> — คุณรู้ไหมว่า x เท่ากับเท่าไหร่?</p>
        <p>มันไม่มีสูตรลัดเหมือนสมการกำลังสอง ที่มี <M>{`x = \\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}`}</M> สมการกำลัง 3, 4, 5 หรือสมการที่มี <M>{`\\sin, \\cos, e^x, \\ln`}</M> ผสมกัน — ส่วนใหญ่ <em>แก้ด้วยมือไม่ได้</em></p>
        <p>วิธีเชิงตัวเลข = <b style={{color:"var(--blue)"}}>เดาคำตอบให้ใกล้เคียงเข้าไปเรื่อย ๆ จนเหลือ error น้อยที่สุด</b></p>

        <FnPlot
          fn={fEx}
          xDomain={[-1, 3]}
          yDomain={[-4, 8]}
          height={260}
          markers={[
            { kind: "point", x: 1.5214, y: 0, color: "#ffd66b", label: "ราก ≈ 1.5214" },
          ]}
        />
        <p className="muted" style={{fontSize:'0.778rem'}}>กราฟของ <M>{`f(x) = x^3 - x - 2`}</M> จุดที่กราฟตัดแกน x คือ "ราก" ที่เราหา</p>
      </Sect>

      {/* ============= METHOD 1: GRAPHICAL ============= */}
      <Sect tag="1" title="Method 1 · Graphical Method">
        <p>วิธีแรกสุดง่ายมาก: <b>วาดกราฟ แล้วดูตา ๆ ว่าตัดแกน x ตรงไหน</b></p>

        <Callout title="วิธี modified Graphical (ที่ใช้จริงในข้อสอบ)">
          <ol>
            <li>Scan ทีละ 1 ใน <M>{`[a, b]`}</M> → คำนวณ <M>{`f(x_i)`}</M> และ <M>{`f(x_{i+1})`}</M></li>
            <li>ถ้า <M>{`f(x_i) \\cdot f(x_{i+1}) < 0`}</M> → ราก<em>อยู่ในช่วงนี้</em></li>
            <li>เปลี่ยน step เป็น 0.000001 แล้ว scan ในช่วงนั้นอีกที</li>
            <li>เจอที่ <M>{`|f(x)|`}</M> น้อยที่สุด → นั่นคือคำตอบ</li>
          </ol>
        </Callout>

        <h4>โค้ด Python ที่รันได้</h4>
        <PythonRunner code={`def f(x):
    return 4*x**3 - 180

# Modified Graphical Method
a, b = 0, 10
# Phase 1: scan step = 1
x = a
y, z = None, None
while x < b:
    if f(x) * f(x + 1) < 0:
        y, z = x, x + 1
        break
    x += 1
print(f"Phase 1: root in [{y}, {z}]")

# Phase 2: scan step = 0.000001 inside [y, z]
x = y
best = (abs(f(x)), x)
while x < z:
    if abs(f(x)) < best[0]:
        best = (abs(f(x)), x)
    x += 0.000001

print(f"Root ≈ {best[1]:.6f}")
print(f"f(root) = {f(best[1]):.6f}")`} height={220}/>

        <Callout kind="tip" title="fx-991CW · ใช้โหมด Table">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → เลือก <Key>Table</Key></span>,
            <span>พิมพ์ <code>4x³ − 180</code> → <Key>OK</Key></span>,
            <span>Start = 0, End = 10, Step = 1</span>,
            <span>ดูที่ค่า f(x) เปลี่ยนเครื่องหมาย → ระหว่าง <b>x = 3 (f=−72)</b> และ <b>x = 4 (f=76)</b></span>,
            <span>กลับมาตั้ง Start = 3.5, End = 3.6, Step = 0.01 → ดูช่วงใหม่ → ตั้ง Step เล็กลงเรื่อย ๆ</span>,
          ]}/>
        </Callout>

        <h3 style={{marginTop:24}}>✍️ การบ้าน 3 ข้อ 1 · โปรแกรมตรงสเปค (43x − 180 = 0)</h3>
        <Callout title="โจทย์ของอาจารย์เป๊ะ (สั่งมากับการบ้านชุด Differentiation · ออกซ้ำใน midterm)">
          <p>หา root ของ <b>43x − 180 = 0</b> ในช่วง <M>{`0 \\le x \\le 10`}</M></p>
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>Phase 1:</b> scan ทีละ 1 → หาช่วงที่ <M>{`f(x_i)\\cdot f(x_{i+1}) < 0`}</M></li>
            <li><b>Phase 2:</b> scan ทีละ 0.000001 ในช่วงนั้น → หยุดเมื่อ f เปลี่ยนเครื่องหมาย (ข้ามแกน x)</li>
            <li>โปรแกรมควรหยุดที่ <M>{`x \\approx 4.186046`}</M> (ค่าจริง <M>{`180/43 = 4.186047`}</M> — scan จากซ้ายเลยหยุดก่อนถึงเป๊ะ)</li>
          </ul>
          <p style={{margin:"6px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>⚠ ออกซ้ำจากชีทปีที่แล้ว (root1.pdf ข้อ 1) — Phase 2 จะวน ~186,000 รอบ (รอ ~2 วินาที)</p>
        </Callout>
        <PythonRunner code={`# การบ้าน 3 ข้อ 1 — Modified Graphical Method
# สมการ: 43x - 180 = 0  →  root จริง = 180/43 ≈ 4.186047

def f(x):
    return 43*x - 180

xl, xr = 0, 10

# === Phase 1: scan ทีละ 1 — หาช่วงที่ f เปลี่ยนเครื่องหมาย ===
y, z = None, None
x = xl
while x <= xr:
    if f(x) * f(x + 1) <= 0:
        y, z = x, x + 1
        break
    x += 1
print(f"Phase 1 (step=1):    root อยู่ในช่วง [{y}, {z}]")

# === Phase 2: scan ทีละ 0.000001 ในช่วง [y, z] ===
step = 0.000001
x = y
best_x, best_abs = x, abs(f(x))
while x <= z:
    if abs(f(x)) < best_abs:
        best_x, best_abs = x, abs(f(x))
    if f(x) * f(x + step) <= 0:     # หยุดทันทีเมื่อข้ามแกน
        break
    x += step

print(f"Phase 2 (step=1e-6): root ≈ {best_x:.6f}")
print(f"                     f(root) = {f(best_x):.2e}")
print(f"\\nตรวจ: 180/43 = {180/43:.6f}")`} height={300}/>
      </Sect>

      {/* ============= METHOD 2: BISECTION ============= */}
      <Sect tag="2" title="Method 2 · Bisection Method">
        <h3>แนวคิด</h3>
        <p>คล้าย Graphical แต่ฉลาดกว่า: แทนที่จะ scan ทีละนิด เรา<b>หารครึ่งช่วง</b>แล้วเลือกครึ่งที่มีราก เรื่อย ๆ จนช่วงเล็กพอ</p>

        <Formula label="สูตร">
          <MB>{`x_m = \\frac{x_l + x_r}{2}`}</MB>
          <MB>{`\\text{ถ้า } f(x_l)\\cdot f(x_m) < 0 : x_r \\leftarrow x_m, \\text{ไม่งั้น } x_l \\leftarrow x_m`}</MB>
        </Formula>

        <h3>เห็นภาพการทำงาน</h3>
        <p>ตัวอย่าง: หาราก <M>{`f(x) = x^3 - x - 2`}</M> ในช่วง <M>{`[1, 2]`}</M></p>
        <BisectionViz fn={fEx} a0={1} b0={2} root={1.5213797}/>

        <h3>✍️ การบ้าน 4 ข้อ 1.1 · ทำมือ 4 iterations — หา <M>{`\\sqrt[4]{13}`}</M> · แบบละเอียดยิบ</h3>
        <p>โจทย์จริงปีนี้: หา <M>{`\\sqrt[4]{13}`}</M> ด้วย Bisection ช่วงเริ่มต้น <M>{`[1.5, 2.0]`}</M> — “ทำด้วยมือ 4 iterations”</p>

        <HandWalkthrough steps={[
          { title: "แปลงโจทย์เป็น f(x) = 0",
            body: `สมมุติ x = ⁴√13 → ยกกำลัง 4 ทั้งสองข้าง:
x⁴ = 13
x⁴ − 13 = 0  ← นี่คือ f(x)
ดังนั้น  f(x) = x⁴ − 13` },
          { title: "ตรวจช่วงเริ่มต้น f(a)·f(b) < 0",
            body: `f(1.5) = (1.5)⁴ − 13 = 5.0625 − 13 = −7.9375  (ลบ)
f(2.0) = (2.0)⁴ − 13 = 16 − 13 = +3  (บวก)
f(1.5)·f(2.0) = (−7.9375)(3) = −23.81 < 0  ✓ มีรากในช่วง`,
            calc: "1.5  x^y  4  −  13  =  → STO A  (ได้ −7.9375 → เก็บใน A)" },
          { title: "Iteration 1 · หา xm = (a + b)/2",
            body: `xm₁ = (1.5 + 2.0) / 2 = 3.5 / 2 = 1.75
f(xm₁) = (1.75)⁴ − 13 = 9.378906 − 13 = −3.621094  (ลบ)
f(a)·f(m) = (−7.937500)(−3.621094) = +28.74 > 0  → ราก<b>ไม่</b>อยู่ซ้าย → a ← m
ดังนั้น: a = 1.75, b = 2.0`,
            calc: "(1.5 + 2) ÷ 2 = → STO C   |   C^4 − 13 = (ดูเครื่องหมาย ลบ) → C → STO A" },
          { title: "Iteration 2",
            body: `xm₂ = (1.75 + 2.0) / 2 = 1.875
f(xm₂) = (1.875)⁴ − 13 = 12.359619 − 13 = −0.640381  (ลบ)
f(a)·f(m) = (−3.621094)(−0.640381) = +2.32 > 0  → a ← m
a = 1.875, b = 2.0`,
            calc: "(A + B) ÷ 2 = → STO C   |   C^4 − 13 =  ลบ → C → STO A" },
          { title: "Iteration 3",
            body: `xm₃ = (1.875 + 2.0) / 2 = 1.9375
f(xm₃) = (1.9375)⁴ − 13 = 14.091812 − 13 = +1.091812  (บวก)
f(a)·f(m) = (−0.640381)(1.091812) = −0.699 < 0  → ราก<b>อยู่ซ้าย</b> → b ← m
a = 1.875, b = 1.9375`,
            calc: "(A + B) ÷ 2 = → STO C   |   C^4 − 13 = บวก → C → STO B" },
          { title: "Iteration 4 + คำนวณ error",
            body: `xm₄ = (1.875 + 1.9375) / 2 = 1.90625
f(xm₄) = (1.90625)⁴ − 13 = 13.204423 − 13 = +0.204423  (บวก)
f(a)·f(m) = (−0.640381)(0.204423) < 0 → b ← m → a = 1.875, b = 1.90625
εₐ = |xm₄ − xm₃| / |xm₄| = |1.90625 − 1.9375| / 1.90625 = 0.03125 / 1.90625 ≈ 0.0164 = 1.64%`,
            calc: "(C − D) ÷ C · 100 =  (โดย D คือ xm รอบก่อน)" },
          { title: "สรุป",
            body: `หลัง 4 iterations: ⁴√13 ≈ 1.90625  (ค่าจริง = 1.898829...)
ถ้าต้องการนิ่งทศนิยม 6 ตำแหน่ง ต้อง iterate ต่อจนกว่า xm สองรอบติดกันต่างกัน < 10⁻⁶ ≈ 19–20 รอบ (ดูโปรแกรมข้อ 1.2)` },
        ]}/>
        <Callout title="แปลงโจทย์เป็น f(x) = 0">
          ถ้า <M>{`x = \\sqrt[4]{13}`}</M> แล้ว <M>{`x^4 = 13`}</M> ดังนั้น <M>{`f(x) = x^4 - 13 = 0`}</M>
        </Callout>

        <NumTable
          headers={["i", "xₗ", "xᵣ", "xₘ", "f(xₘ)", "การตัดสินใจ", "εₐ"]}
          rows={[
            [1, "1.500000", "2.000000", "1.750000", "−3.621094", "f(xₗ)·f(xₘ) > 0 → xₗ←xₘ", "—"],
            [2, "1.750000", "2.000000", "1.875000", "−0.640381", "f(xₗ)·f(xₘ) > 0 → xₗ←xₘ", "6.667 %"],
            [3, "1.875000", "2.000000", "1.937500", "+1.091812", "f(xₗ)·f(xₘ) < 0 → xᵣ←xₘ", "3.226 %"],
            [4, "1.875000", "1.937500", "1.906250", "+0.204423", "f(xₗ)·f(xₘ) < 0 → xᵣ←xₘ", "1.639 %"],
          ]}
        />
        <p>หลัง 4 iterations: <M>{`\\sqrt[4]{13} \\approx 1.906250`}</M>, ค่าจริง = <M>{`1.898829\\ldots`}</M> (ยังต้อง iterate ต่ออีกหลายรอบ — ดูโปรแกรมด้านล่าง)</p>
        <Callout kind="tip" title="กฎเหล็กของการตัดสินใจ (ที่ทำให้ตารางไม่หลุด)">
          <p style={{margin:0}}>เทียบเครื่องหมายกับ <b><M>{`f(x_l)`}</M> ฝั่งซ้ายเสมอ</b>: ผลคูณ <b>ลบ</b> = รากอยู่ครึ่งซ้าย → ขยับ <M>{`x_r`}</M> ลงมา · ผลคูณ <b>บวก</b> = รากอยู่ครึ่งขวา → ขยับ <M>{`x_l`}</M> ขึ้นไป. รอบนี้ f(1.5) กับ f(1.75) <b>ลบทั้งคู่</b> (ผลคูณบวก) ⇒ ต้องดัน <M>{`x_l`}</M> ขึ้นเป็น 1.75 — <b>ไม่ใช่</b>ดึง <M>{`x_r`}</M> ลง. สลับตรงนี้ทีเดียว ตารางที่เหลือผิดยกแถว</p>
        </Callout>

        <h3>Interactive · ลองเอง</h3>
        <BisectionSolver/>

        <h3>fx-991CW · กดเครื่อง</h3>
        <Callout title="วิธีกดเครื่องคิดเลขแบบไว ใช้ตัวแปร A, B, C">
          <CalcSteps steps={[
            <span>เก็บค่าเริ่มต้น: <Key>1.5</Key> <Key>→</Key> <Key>STO</Key> <Key>A</Key> (a=1.5)</span>,
            <span><Key>2</Key> <Key>→</Key> <Key>STO</Key> <Key>B</Key> (b=2)</span>,
            <span>คำนวณ m: <Key>(</Key><Key>A</Key><Key>+</Key><Key>B</Key><Key>)</Key><Key>÷</Key><Key>2</Key> <Key>→</Key> <Key>STO</Key> <Key>C</Key></span>,
            <span>หา f(m): <Key>C</Key><Key>^</Key><Key>4</Key><Key>−</Key><Key>13</Key> <Key>=</Key> ดูเครื่องหมาย</span>,
            <span>เป็นลบ → ราก<b>อยู่ขวา</b> → <Key>C</Key> <Key>→</Key> <Key>STO</Key> <Key>A</Key> (a←m)</span>,
            <span>เป็นบวก → ราก<b>อยู่ซ้าย</b> → <Key>C</Key> <Key>→</Key> <Key>STO</Key> <Key>B</Key> (b←m)</span>,
            <span>วน step 3-5 จนกว่าค่า C จะไม่เปลี่ยนใน 6 ตำแหน่ง</span>,
          ]}/>
        </Callout>

        <h3>✍️ การบ้าน 4 ข้อ 1.2 · โปรแกรม “จนทศนิยม 6 ตำแหน่งไม่เปลี่ยน”</h3>
        <Callout kind="tip" title="อ่านเงื่อนไขหยุดให้ตรงคำสั่ง">
          <p style={{margin:0}}>โจทย์เขียนว่า “ผลลัพธ์ที่ได้<b>ไม่มีการเปลี่ยนแปลงจุดทศนิยม 6 ตำแหน่ง</b>” = หยุดเมื่อ <M>{`|x_m^{(i)} - x_m^{(i-1)}| < 10^{-6}`}</M> (เทียบ<b>ค่าที่ได้สองรอบติดกัน</b>) — ไม่ใช่ <M>{`|f(x_m)| < 10^{-6}`}</M> และไม่ใช่จำนวนรอบตายตัว</p>
        </Callout>
        <PythonRunner code={`def bisection(f, a, b, tol=1e-6, max_iter=100):
    if f(a) * f(b) > 0:
        return None, []
    table = []
    prev = None
    for i in range(max_iter):
        m = (a + b) / 2
        fm = f(m)
        err = None if prev is None else abs(m - prev)   # ผลต่างสัมบูรณ์สองรอบติดกัน (ตามโจทย์)
        table.append((i+1, a, b, m, fm, err))
        if err is not None and err < tol:
            return m, table
        if f(a) * fm < 0:
            b = m
        else:
            a = m
        prev = m
    return m, table

# โจทย์: หา 4√13
f = lambda x: x**4 - 13
root, tbl = bisection(f, 1.5, 2.0)

print(f"{'i':>3} {'a':>10} {'b':>10} {'m':>10} {'f(m)':>10} {'Δx':>10}")
for row in tbl[:10] + ([tbl[-1]] if len(tbl) > 10 else []):
    i, a, b, m, fm, err = row
    err_s = f"{err:.2e}" if err else "—"
    print(f"{i:3d} {a:10.6f} {b:10.6f} {m:10.6f} {fm:10.4f} {err_s:>10}")
print(f"\\n4√13 ≈ {root:.6f}")`} height={280}/>

        <h3>ข้อดี / ข้อเสีย</h3>
        <div className="grid-2">
          <Callout kind="good" title="ข้อดี">
            <ul style={{margin:0, paddingLeft:18}}>
              <li>ลู่เข้าแน่นอน 100% ถ้าตั้งช่วงถูก</li>
              <li>ง่าย ทำมือได้</li>
              <li>error ครึ่งหนึ่งทุกรอบ ทำนายได้</li>
            </ul>
          </Callout>
          <Callout kind="warn" title="ข้อเสีย">
            <ul style={{margin:0, paddingLeft:18}}>
              <li>ช้า (linear convergence) — ต้องใช้หลายรอบ</li>
              <li>ต้องรู้ช่วงที่มีรากก่อน</li>
              <li>หาได้แค่รากเดียวต่อรอบ</li>
            </ul>
          </Callout>
        </div>

        <h3 style={{marginTop:24}}>✍️ การบ้าน 4 ข้อ 2 · โปรแกรมถอดรากที่ n (Bisection)</h3>
        <Callout title="สเปคโจทย์ (ออกข้อสอบแน่)">
          <p style={{margin:"0 0 8px"}}>
            <b>โปรแกรมถอดรากที่ n ของจำนวนเต็ม x</b> — ใช้ Bisection หา t ที่ <M>{`t^n = x`}</M>
          </p>
          <ul style={{margin:0, paddingLeft:18}}>
            <li>บรรทัดที่ 1: <code>x n</code> &nbsp;(<M>{`2 \\le n \\le x \\le 2{,}000{,}000`}</M>)</li>
            <li>บรรทัดที่ 2: <code>xl xr</code> &nbsp;ขอบเขตเริ่มต้น (<M>{`0 \\le xl, xr \\le 1{,}000{,}000`}</M>)</li>
            <li>Output: t ที่ <b>ทศนิยม 4 ตำแหน่ง</b></li>
            <li>เทส: <code>38 2</code> → <code>6.1644</code> &nbsp;·&nbsp; <code>1265256 12</code> → <code>3.2249</code></li>
          </ul>
          <p style={{margin:"8px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>⚠ <b>ข้อ 5 ของการบ้านชุดเดียวกันคือโจทย์นี้เป๊ะ แต่ให้ใช้ False Position</b> — เขียนฟังก์ชันแยกไว้ สลับแค่บรรทัดคำนวณ m ก็ส่งได้ทั้งสองข้อ</p>
        </Callout>
        <PythonRunner code={`# การบ้าน 4 ข้อ 2 — ถอดรากที่ n ด้วย Bisection
# Input: บรรทัดที่ 1 = "x n", บรรทัดที่ 2 = "xl xr"
# Output: ผลลัพธ์ t ที่ t^n = x (ทศนิยม 4 ตำแหน่ง)

# ── สลับเทสได้ที่นี่ (ลบ # หน้าบรรทัดที่อยากใช้) ──
INPUT = "38 2\\n6 7"            # เคส 1 → ควรได้ 6.1644
# INPUT = "1265256 12\\n3 4"    # เคส 2 → ควรได้ 3.2249
# ────────────────────────────────────────────────

lines = INPUT.strip().split("\\n")
x, n = map(int, lines[0].split())
xl, xr = map(float, lines[1].split())

f = lambda t: t**n - x
assert f(xl) * f(xr) <= 0, "f(xl) และ f(xr) ต้องเครื่องหมายตรงข้าม"

tol = 1e-7         # "ไม่เปลี่ยน 6 ทศนิยม" → ใช้ 1e-7 เผื่อ
prev = None
iters = 0
for _ in range(500):
    m = (xl + xr) / 2
    iters += 1
    if prev is not None and abs(m - prev) < tol:
        break
    if f(xl) * f(m) < 0: xr = m
    else:                xl = m
    prev = m

print(f"{m:.4f}    (Bisection · {iters} iterations)")`} height={300}/>
      </Sect>

      {/* ============= METHOD 3: FALSE POSITION ============= */}
      <Sect tag="3" title="Method 3 · False Position (Regula Falsi)">
        <p>คล้าย Bisection แต่แทนที่จะหารครึ่งช่วง เราใช้ "เส้นตรง" ลากผ่าน <M>{`(x_l, f(x_l))`}</M> และ <M>{`(x_r, f(x_r))`}</M> แล้วหาจุดที่มันตัดแกน x</p>

        <Formula label="สูตร False Position — รูปที่อาจารย์ให้ (การบ้าน 4 ข้อ 3)">
          <MB>{`x_1 = \\frac{x_L\\,f(x_R) - x_R\\,f(x_L)}{f(x_R) - f(x_L)}`}</MB>
          <p className="muted" style={{margin:"6px 0 0", fontSize:'0.75rem'}}>จำง่าย: “ไขว้กัน แล้วหารด้วยผลต่างของ f” — ตัวตั้งเอา x ฝั่งหนึ่งคูณ f อีกฝั่ง</p>
        </Formula>

        <Callout title="✍️ การบ้าน 4 ข้อ 3 · จงพิสูจน์สูตรนี้จากรูป (tan θ = tan β) — เขียนแบบนี้ส่งได้เลย">
          <p style={{marginTop:0}}><b>อ่านรูปก่อน:</b> จุด <M>{`x_L`}</M> อยู่ใต้แกน (<M>{`f(x_L)<0`}</M>) จุด <M>{`x_R`}</M> อยู่เหนือแกน (<M>{`f(x_R)>0`}</M>) ลาก<b>คอร์ด</b>เชื่อม 2 จุด ตัดแกน x ที่ <M>{`x_1`}</M> — เกิดสามเหลี่ยมมุมฉาก <b>2 รูปที่คล้ายกัน</b> โดยมีคอร์ดเป็นด้านตรงข้ามมุมฉากร่วมกัน</p>
          <p style={{margin:"8px 0 4px"}}><b>① สามเหลี่ยมซ้าย</b> (ฐาน <M>{`x_1 - x_L`}</M>, สูง <M>{`|f(x_L)| = -f(x_L)`}</M>):</p>
          <MB>{`\\tan\\beta = \\frac{-f(x_L)}{x_1 - x_L}`}</MB>
          <p style={{margin:"8px 0 4px"}}><b>② สามเหลี่ยมขวา</b> (ฐาน <M>{`x_R - x_1`}</M>, สูง <M>{`f(x_R)`}</M>):</p>
          <MB>{`\\tan\\theta = \\frac{f(x_R)}{x_R - x_1}`}</MB>
          <p style={{margin:"8px 0 4px"}}><b>③ มุมเท่ากัน</b> (มุมแย้ง/มุมที่สมนัยกันบนเส้นตรงเดียวกัน) ⇒ <M>{`\\tan\\theta = \\tan\\beta`}</M>:</p>
          <MB>{`\\frac{f(x_R)}{x_R - x_1} = \\frac{-f(x_L)}{x_1 - x_L}`}</MB>
          <p style={{margin:"8px 0 4px"}}><b>④ คูณไขว้</b>:</p>
          <MB>{`f(x_R)\\,(x_1 - x_L) = -f(x_L)\\,(x_R - x_1)`}</MB>
          <MB>{`x_1 f(x_R) - x_L f(x_R) = -x_R f(x_L) + x_1 f(x_L)`}</MB>
          <p style={{margin:"8px 0 4px"}}><b>⑤ ย้าย <M>{`x_1`}</M> ไปข้างเดียวกัน แล้วดึงตัวร่วม</b>:</p>
          <MB>{`x_1\\,[\\,f(x_R) - f(x_L)\\,] = x_L f(x_R) - x_R f(x_L)`}</MB>
          <MB>{`\\boxed{\\; x_1 = \\frac{x_L f(x_R) - x_R f(x_L)}{f(x_R) - f(x_L)} \\;}\\quad \\blacksquare`}</MB>
        </Callout>

        <Callout kind="tip" title="อีกรูปหนึ่งที่เจอในตำรา — เป็นสูตรเดียวกัน (อย่าตกใจถ้าข้อสอบเขียนคนละหน้าตา)">
          <p style={{marginTop:0}}>เขียนสมการเส้นตรงผ่าน 2 จุดแล้วให้ <M>{`y=0`}</M> จะได้:</p>
          <MB>{`x_1 = x_R - \\frac{f(x_R)\\,(x_L - x_R)}{f(x_L) - f(x_R)}`}</MB>
          <p style={{margin:"6px 0 0"}}>กระจายดู: <M>{`x_R - \\frac{x_L f_R - x_R f_R}{f_L - f_R} = \\frac{x_R f_L - x_R f_R - x_L f_R + x_R f_R}{f_L - f_R} = \\frac{x_R f_L - x_L f_R}{f_L - f_R}`}</M> — คูณทั้งเศษและส่วนด้วย <M>{`-1`}</M> ก็ได้รูปของอาจารย์เป๊ะ ✓</p>
        </Callout>

        <h3>ทำเหมือน Bisection ที่เหลือ</h3>
        <p>ตัดสินใจเหมือนกัน: ถ้า <M>{`f(x_l)\\cdot f(x_m) < 0`}</M> → <M>{`x_r \\leftarrow x_m`}</M>, ไม่งั้น <M>{`x_l \\leftarrow x_m`}</M></p>

        <h3>✍️ การบ้าน 4 ข้อ 4.1 · ทำมือ 4 iterations — หา <M>{`\\sqrt[4]{13}`}</M> ช่วง [1.5, 2.0]</h3>
        <p>โจทย์เดียวกับ Bisection เป๊ะ (อาจารย์ตั้งใจให้<b>เทียบกันตรง ๆ</b>) — <M>{`f(x)=x^4-13`}</M>, <M>{`f(1.5)=-7.937500`}</M>, <M>{`f(2.0)=+3`}</M></p>
        <HandWalkthrough steps={[
          { title: "Iteration 1 · แทนสูตรตรง ๆ",
            body: `x₁ = [xL·f(xR) − xR·f(xL)] / [f(xR) − f(xL)]
   = [1.5(3) − 2(−7.937500)] / [3 − (−7.937500)]
   = (4.500000 + 15.875000) / 10.937500
   = 20.375000 / 10.937500 = 1.862857
f(x₁) = 1.862857⁴ − 13 = −0.957457  (ลบ — เครื่องหมายเดียวกับ f(xL))
→ xL ← 1.862857   (xR ยังเป็น 2.0)`,
            calc: "( 1.5×3 − 2×(−7.9375) ) ÷ ( 3 + 7.9375 ) =   → STO A" },
          { title: "Iteration 2",
            body: `x₁ = [1.862857(3) − 2(−0.957457)] / [3 + 0.957457]
   = (5.588571 + 1.914914) / 3.957457
   = 7.503485 / 3.957457 = 1.896037
f(x₁) = −0.076286  (ลบ) → xL ← 1.896037
εₐ = |1.896037 − 1.862857| / 1.896037 × 100 = 1.750 %` },
          { title: "Iteration 3",
            body: `x₁ = [1.896037(3) − 2(−0.076286)] / [3 + 0.076286]
   = (5.688111 + 0.152571) / 3.076286
   = 5.840682 / 3.076286 = 1.898615
f(x₁) = −0.005852  (ลบ) → xL ← 1.898615
εₐ = |1.898615 − 1.896037| / 1.898615 × 100 = 0.136 %` },
          { title: "Iteration 4 + สรุป",
            body: `x₁ = [1.898615(3) − 2(−0.005852)] / [3 + 0.005852]
   = (5.695845 + 0.011704) / 3.005852
   = 5.707549 / 3.005852 = 1.898813
f(x₁) = −0.000448  (ลบ) → xL ← 1.898813
εₐ = |1.898813 − 1.898615| / 1.898813 × 100 = 0.0104 %

หลัง 4 รอบ: ⁴√13 ≈ 1.898813   (ค่าจริง 1.898829…)` },
        ]}/>
        <NumTable
          headers={["i", "xₗ", "xᵣ", "x₁", "f(x₁)", "การตัดสินใจ", "εₐ"]}
          rows={[
            [1, "1.500000", "2.000000", "1.862857", "−0.957457", "f(xₗ)·f(x₁) > 0 → xₗ←x₁", "—"],
            [2, "1.862857", "2.000000", "1.896037", "−0.076286", "f(xₗ)·f(x₁) > 0 → xₗ←x₁", "1.750 %"],
            [3, "1.896037", "2.000000", "1.898615", "−0.005852", "f(xₗ)·f(x₁) > 0 → xₗ←x₁", "0.136 %"],
            [4, "1.898615", "2.000000", "1.898813", "−0.000448", "f(xₗ)·f(x₁) > 0 → xₗ←x₁", "0.0104 %"],
          ]}
        />
        <Callout kind="tip" title="📄 เทียบกับเอกสารติวของอาจารย์ — โจทย์เดียวกันเป๊ะ (⁴√13, [1.5, 2])">
          <p style={{margin:"0 0 4px"}}>เอกสารติวเดินโจทย์นี้เหมือนกันทุกบรรทัด รอบ 0 ได้ <M>{`x_0=\\frac{326}{175}=1.862857`}</M> ตรงกับตารางข้างบน ✓ แต่รอบถัดไปเอกสารเขียน <b>1.89605</b> และ <M>{`f=-0.076040`}</M></p>
          <p style={{margin:0}}>ค่าเต็มความละเอียดคือ <b>1.896037</b> และ <M>{`f=-0.076286`}</M> — เอกสารปัด <M>{`f(x_0)`}</M> เหลือ 6 ตำแหน่งก่อนคำนวณต่อ เลยเพี้ยนที่ทศนิยมตำแหน่งที่ 5. <b>ยึดตารางในหน้านี้</b> (ยืนยันด้วยเศษส่วนเต็มแล้ว) และนี่คือเหตุผลที่อาจารย์เขียนกำกับหัวข้อนี้เองว่า “<b>เอาทศนิยมให้ได้มากสุดมาคิด / เอาเศษส่วน</b>”</p>
        </Callout>
        <Callout kind="good" title="เทียบกับ Bisection โจทย์เดียวกัน 4 รอบเท่ากัน (ประเด็นที่อาจารย์อยากให้เห็น)">
          <NumTable
            headers={["วิธี", "คำตอบหลัง 4 รอบ", "error จริงเทียบ 1.898829", "พฤติกรรม"]}
            rows={[
              ["Bisection", "1.906250", "0.39 %", "ช่วงหดครึ่งหนึ่งทุกรอบ สม่ำเสมอ"],
              ["False Position", "1.898813", "0.00086 %", "พุ่งเข้าเป้าเร็วกว่า ~450 เท่า"],
            ]}
          />
          <p style={{margin:"6px 0 0"}}>แต่ดูคอลัมน์ <M>{`x_r`}</M> ให้ดี — มัน<b>ค้างที่ 2.0 ทั้ง 4 รอบ</b> นี่คือ <b>one-sided convergence</b>: ปลายข้างที่ f โค้งชันจะไม่ขยับเลย ⇒ ความกว้างช่วงไม่ลดลง ใช้ <M>{`|x_r-x_l|`}</M> เป็นเกณฑ์หยุด<b>ไม่ได้</b> ต้องใช้ <M>{`\\varepsilon_a`}</M> จาก <M>{`x_1`}</M> สองรอบติดกันเท่านั้น</p>
        </Callout>

        <h3>✍️ การบ้าน 4 ข้อ 4.2 · โปรแกรม “จนทศนิยม 6 ตำแหน่งไม่เปลี่ยน”</h3>
        <PythonRunner code={`# การบ้าน 4 ข้อ 4 — False Position หา 4√13 ในช่วง [1.5, 2.0]
# หยุดเมื่อค่า x1 สองรอบติดกันต่างกันน้อยกว่า 1e-6 (= ทศนิยม 6 ตำแหน่งนิ่ง)

def false_position(f, xl, xr, tol=1e-6, max_iter=200):
    assert f(xl) * f(xr) < 0, "ช่วงเริ่มต้นต้องคร่อมราก"
    prev = None
    print(f"{'i':>3} {'xl':>10} {'xr':>10} {'x1':>10} {'f(x1)':>13} {'ea %':>10}")
    for i in range(1, max_iter + 1):
        fl, fr = f(xl), f(xr)
        x1 = (xl*fr - xr*fl) / (fr - fl)      # สูตรของอาจารย์
        f1 = f(x1)
        ea = None if prev is None else abs((x1 - prev) / x1) * 100
        print(f"{i:3d} {xl:10.6f} {xr:10.6f} {x1:10.6f} {f1:+13.8f}"
              f" {(f'{ea:.6f}' if ea is not None else '—'):>10}")
        if prev is not None and abs(x1 - prev) < tol:
            return x1, i
        if fl * f1 < 0: xr = x1     # รากอยู่ซ้าย
        else:           xl = x1     # รากอยู่ขวา
        prev = x1
    return x1, max_iter

f = lambda x: x**4 - 13
root, iters = false_position(f, 1.5, 2.0)
print(f"\\n4√13 ≈ {root:.6f}   (ใช้ {iters} รอบ)")
print(f"ค่าจริง      = {13 ** 0.25:.6f}")`} height={340}/>
        <Callout kind="tip" title="สังเกตตอนรัน — 4 บรรทัดแรกต้องตรงกับที่ทำมือ">
          <p style={{margin:0}}>1.862857 → 1.896037 → 1.898615 → 1.898813 ✓ ถ้าโปรแกรมออกไม่ตรง แปลว่า<b>เงื่อนไขเลือกฝั่งกลับด้าน</b> (สลับ <M>{`x_l`}</M> กับ <M>{`x_r`}</M>) — เช็กบรรทัด <code>if fl * f1 &lt; 0</code> ก่อนเลย</p>
        </Callout>

        <Callout kind="warn" title="ระวัง · False Position ไม่ได้เร็วกว่า Bisection เสมอ">
          ถ้าฟังก์ชันโค้งมาก ๆ ปลายข้างหนึ่งจะ "ติด" อยู่นาน — error จะลดช้า (one-sided convergence)
          อาจารย์ชอบออกโจทย์ให้พิสูจน์ที่มา ดังนั้นจำสูตรพร้อมเข้าใจที่มา
        </Callout>

        <h3>Animation · ดูเส้น chord ตัดแกน x</h3>
        <FalsePosViz fn={fEx} a0={1} b0={2}/>

        <h3>Interactive</h3>
        <RootSolver method="falsepos"/>

        <h3 style={{marginTop:24}}>✍️ การบ้าน 4 ข้อ 5 · โปรแกรมถอดรากที่ n (False Position)</h3>
        <Callout title="สเปคโจทย์ (ออกข้อสอบแน่)">
          <p style={{margin:"0 0 8px"}}>
            <b>โปรแกรมถอดรากที่ n ของจำนวนเต็ม x</b> — ใช้ False Position หา t ที่ <M>{`t^n = x`}</M>
          </p>
          <ul style={{margin:0, paddingLeft:18}}>
            <li>บรรทัดที่ 1: <code>x n</code> &nbsp;(<M>{`2 \\le n \\le x \\le 2{,}000{,}000`}</M>)</li>
            <li>บรรทัดที่ 2: <code>xl xr</code> &nbsp;ขอบเขตเริ่มต้น (<M>{`0 \\le xl, xr \\le 1{,}000{,}000`}</M>)</li>
            <li>Output: t ที่ <b>ทศนิยม 4 ตำแหน่ง</b></li>
            <li>เทส: <code>38 2</code> → <code>6.1644</code> &nbsp;·&nbsp; <code>1265256 12</code> → <code>3.2249</code></li>
          </ul>
          <p style={{margin:"8px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>⚠ โจทย์<b>เหมือนข้อ 2 ทุกตัวอักษร</b> ต่างแค่วิธี — ตัวอย่างเทสก็ชุดเดียวกัน (38 2 → 6.1644 · 1265256 12 → 3.2249)</p>
        </Callout>
        <PythonRunner code={`# การบ้าน 4 ข้อ 5 — ถอดรากที่ n ด้วย False Position
# Input: บรรทัดที่ 1 = "x n", บรรทัดที่ 2 = "xl xr"
# Output: ผลลัพธ์ t ที่ t^n = x (ทศนิยม 4 ตำแหน่ง)

# ── สลับเทสได้ที่นี่ (ลบ # หน้าบรรทัดที่อยากใช้) ──
INPUT = "38 2\\n6 7"            # เคส 1 → ควรได้ 6.1644
# INPUT = "1265256 12\\n3 4"    # เคส 2 → ควรได้ 3.2249
# ────────────────────────────────────────────────

lines = INPUT.strip().split("\\n")
x, n = map(int, lines[0].split())
xl, xr = map(float, lines[1].split())

f = lambda t: t**n - x
assert f(xl) * f(xr) <= 0, "f(xl) และ f(xr) ต้องเครื่องหมายตรงข้าม"

tol = 1e-7
prev = None
iters = 0
for _ in range(2000):
    fl, fr = f(xl), f(xr)
    m = (xl * fr - xr * fl) / (fr - fl)
    iters += 1
    if prev is not None and abs(m - prev) < tol:
        break
    if fl * f(m) < 0: xr = m
    else:             xl = m
    prev = m

print(f"{m:.4f}    (False Position · {iters} iterations)")`} height={300}/>
      </Sect>

      {/* ============= METHOD 4: ONE-POINT ============= */}
      <Sect tag="4" title="Method 4 · One-point Iteration (Fixed Point)">
        <p>แทนที่จะเขียน <M>{`f(x) = 0`}</M> ให้ <em>จัดรูปเป็น</em> <M>{`x = g(x)`}</M> แล้วเริ่มจากค่าหนึ่งใส่เข้าไปเรื่อย ๆ</p>

        <Formula>
          <MB>{`x_{n+1} = g(x_n)`}</MB>
        </Formula>

        <Callout kind="warn" title="🎙️ 3 ข้อที่อาจารย์เขียนกำกับหัวข้อนี้ตอนติว">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>“error แกว่ง”</b> — ε ของวิธีนี้<b>ไม่ลดเรียบ</b> รอบแรก ๆ อาจกระโดดขึ้น (เดี๋ยวเห็นในตัวอย่าง: 1 → 3 → 0.45)</li>
            <li><b>“ไม่มีรอบทำทิ้ง”</b> — ต่างจาก Bisection/False Position ที่รอบ 0 ทิ้งไม่คิด error · One-point <b>คิด error ตั้งแต่รอบ 1</b></li>
            <li><b>“มี x 2 ข้าง”</b> — หัวใจคือจัดสมการให้เหลือ <M>x</M> ตัวเดียวโดด ๆ ฝั่งซ้าย และ <M>x</M> ที่เหลืออยู่ฝั่งขวา</li>
          </ul>
        </Callout>

        <Callout kind="danger" title="🎙️ วิธีคิดที่อาจารย์สอนในคาบ 5 ส.ค. 2569 — “แยก f(x) ออกเป็น 2 ก้อน”">
          <p style={{margin:"0 0 6px"}}>อาจารย์ไม่ได้ให้จำสูตรลอย ๆ แต่ให้<b>แยกสมการเป็นสองฟังก์ชัน</b> แล้ววาดกราฟทั้งคู่:</p>
          <NumTable
            headers={["ก้อน", "คืออะไร", "หน้าตากราฟ"]}
            rows={[
              [<M>{`f_1(x)`}</M>, <span><b>เป็น <M>x</M> เสมอ</b> (อาจารย์ย้ำคำว่า “เสมอ”)</span>, "เส้นตรงเอียง 45° ผ่านจุดกำเนิด — ถ้า x=1 ก็ y=1, x=2 ก็ y=2, x=3 ก็ y=3"],
              [<M>{`f_2(x)`}</M>, "ส่วนที่เหลือทั้งหมด", "เส้นโค้งตามหน้าตาของสมการ"],
            ]}
          />
          <p style={{margin:"8px 0 0"}}><b>จุดที่กราฟสองเส้นตัดกัน = ราก</b> — เพราะตรงนั้น <M>{`f_1(x)=f_2(x)`}</M> คือ <M>{`x=g(x)`}</M> พอดี · นี่คือเหตุผลว่าทำไม One-point ถึงใช้ได้ และเป็นที่มาของภาพ “แมงมุมไต่ใย” (cobweb) ที่เดินสลับแนวตั้ง-แนวนอนระหว่างสองเส้น</p>
        </Callout>

        <h3>🎙️ ตัวอย่างที่อาจารย์เดินให้ดูในคาบ · <M>{`e^{-x} - x = 0`}</M></h3>
        <p>เป็นสมการที่<b>แก้ด้วยพีชคณิตไม่ได้เลย</b> (ตัวไม่รู้ติดอยู่ทั้งใน <M>{`e^{-x}`}</M> และนอกวงเล็บ) — ต้องใช้วิธีเชิงตัวเลขเท่านั้น</p>
        <window.HandWalkthrough steps={[
          { title: "แยกเป็น 2 ก้อน แล้วจัดเป็น isolation form",
            body: `f(x) = e^(−x) − x = 0

แยกก้อน:  f₁(x) = x            ← "เป็น x เสมอ"
          f₂(x) = e^(−x)       ← ที่เหลือ

ย้ายข้าง:  x = e^(−x)
isolation form:  x_(i+1) = e^(−x_i)` },
          { title: "วาดกราฟสองเส้นเพื่อดูว่ารากอยู่ราวไหน",
            body: `เส้นที่ 1: y = x        (เส้นตรง 45°)
เส้นที่ 2: y = e^(−x)   (เริ่มที่ 1 แล้วลดลงเข้าหา 0)

ที่ x=0 : เส้นตรงได้ 0    · เส้นโค้งได้ 1   → เส้นโค้งอยู่บน
ที่ x=1 : เส้นตรงได้ 1    · เส้นโค้งได้ 0.3679 → เส้นโค้งอยู่ล่าง
⇒ ตัดกันระหว่าง 0 กับ 1` },
          { title: "รอบ 1–4 (เริ่มที่ x₀ = 0)",
            body: `x₁ = e^(−0)        = 1.0000000    |Δx| = 1.0000000
x₂ = e^(−1)        = 0.3678794    |Δx| = 0.6321206
x₃ = e^(−0.3678794) = 0.6922006    |Δx| = 0.3243212
x₄ = e^(−0.6922006) = 0.5004735    |Δx| = 0.1917271

สังเกต: ค่าเด้งสลับ สูง-ต่ำ-สูง-ต่ำ คร่อมรากไปเรื่อย ๆ`,
            calc: "กด 0 = แล้วพิมพ์ e^(−Ans) = จากนั้นกด = รัว ๆ (Ans-loop)" },
          { title: "เดินต่อจนเข้าเกณฑ์ |Δx| < 0.001 ของอาจารย์",
            body: `x₅  = 0.6062435   x₆  = 0.5453958   x₇  = 0.5796123
x₈  = 0.5601155   x₉  = 0.5711431   x₁₀ = 0.5648793
x₁₁ = 0.5684287   x₁₂ = 0.5664147   x₁₃ = 0.5675566
x₁₄ = 0.5669089   ← |Δx| = 0.0006477 < 0.001  ✓ หยุด

ตอบ x ≈ 0.5669089   (ค่าจริง 0.5671432904 → คลาดเคลื่อน 0.0413%)` },
        ]}/>

        <Callout kind="warn" title="ทำไมถึงใช้ตั้ง 14 รอบ — และข้อสอบจะถามอะไร">
          <p style={{margin:"0 0 4px"}}><M>{`g(x)=e^{-x} \\Rightarrow g'(x)=-e^{-x}`}</M> · ที่ราก <M>{`|g'| = e^{-0.5671} = 0.5671 < 1`}</M> ⇒ <b>ลู่เข้าแน่</b> แต่ลดทีละ ~57% ต่อรอบเท่านั้น = <b>linear convergence</b> (Newton เป็น quadratic จึงเร็วกว่ามาก)</p>
          <p style={{margin:0}}>และเพราะ <M>{`g'<0`}</M> ค่าจึง<b>สลับข้างทุกรอบ</b> — ตรงกับที่อาจารย์เขียนว่า “<b>error แกว่ง</b>” · ถ้าข้อสอบให้ทำ 4 รอบแล้วถามค่า อย่าตกใจว่ายังห่างราก มันเป็นธรรมชาติของวิธีนี้</p>
        </Callout>

        <PythonRunner code={`import math
# ตัวอย่างที่อาจารย์เดินในคาบ 5 ส.ค. — e^(-x) - x = 0
# f1(x) = x  ·  f2(x) = e^(-x)  ->  isolation form: x_(i+1) = e^(-x_i)

g   = lambda x: math.exp(-x)
x   = 0.0          # ① Initial Value
tol = 0.001        #    เกณฑ์ที่อาจารย์ตั้งเป็นปกติ

for i in range(50):
    xn = g(x)                                    # ② Iteration Form
    print(f"รอบ {i+1:2d}: x={x:.7f} -> {xn:.7f}   |dx|={abs(xn-x):.7f}")
    if abs(xn - x) < tol:                        # ③ เงื่อนไขหยุด (absolute)
        break
    x = xn

print(f"\\nตอบ x = {xn:.7f}   (หยุดที่รอบ {i+1})")
print(f"ค่าจริง = 0.5671432904   คลาดเคลื่อน = {abs(xn-0.5671432904)/0.5671432904*100:.4f}%")
print(f"เช็คลู่เข้า |g'(ราก)| = {math.exp(-0.5671432904):.7f} < 1  -> ลู่เข้า")`} height={330}/>

        <h3 style={{marginTop:22}}>🎙️ อีกตัวอย่างของอาจารย์ (จากเอกสารติว) · หา <M>{`\\sqrt{7}`}</M> จาก <M>{`x_0 = 0`}</M></h3>
        <p>อาจารย์ไม่ได้หยิบ <M>{`g(x)`}</M> มาลอย ๆ แต่<b>จัดสมการให้ดู</b> — เทคนิคคือ “<b>บวก <M>x</M> ทั้งสองข้างเพื่อให้ดึงตัวร่วมได้</b>”:</p>
        <window.HandWalkthrough steps={[
          { title: "ตั้ง f(x) แล้วจัดรูปเป็น x = g(x)",
            body: `f(x) = x² − 7          ← โจทย์: หา √7
x² = 7
x² + x = 7 + x         ← บวก x ทั้งสองข้าง (เพื่อให้ซ้ายดึงตัวร่วมได้)
x(x + 1) = 7 + x
        x = (7 + x)/(x + 1)      ← ได้รูป xᵢ₊₁ = g(xᵢ)` },
          { title: "รอบ 1 (x₀ = 0)",
            body: `x₁ = (7 + x₀)/(x₀ + 1) = (7 + 0)/(0 + 1) = 7
ε = |x₁ − x₀| / x₁ = |7 − 0| / 7 = 1`,
            calc: "( 7 + 0 ) ÷ ( 0 + 1 ) =" },
          { title: "รอบ 2",
            body: `x₂ = (7 + x₁)/(x₁ + 1) = (7 + 7)/(7 + 1) = 14/8 = 1.75
ε = |x₂ − x₁| / x₂ = |1.75 − 7| / 1.75 = 3        ← error โตขึ้น! (นี่แหละ “แกว่ง”)`,
            calc: "( 7 + Ans ) ÷ ( Ans + 1 ) = แล้วกด = ซ้ำได้เลย" },
          { title: "รอบ 3–8 (เดินต่อจนเห็นว่าลู่เข้าจริง)",
            body: `x₃ = 3.1818182   ε = 0.4500000
x₄ = 2.4347826   ε = 0.3068182
x₅ = 2.7468354   ε = 0.1136045
x₆ = 2.6013514   ε = 0.0559264
x₇ = 2.6660413   ε = 0.0242644
x₈ = 2.6366428   ε = 0.0111500
→ ค่อย ๆ บีบเข้าหา √7 = 2.6457513 แบบสลับซ้าย-ขวา (ε ลดลงราวครึ่งหนึ่งทุกรอบ)` },
        ]}/>

        <Callout kind="tip" title="ทำไมรูปนี้ลู่เข้า (แต่ช้า) — เช็คด้วย |g′|">
          <p style={{margin:"0 0 4px"}}><M>{`g(x)=\\dfrac{7+x}{x+1} \\Rightarrow g'(x) = \\dfrac{(x+1)-(7+x)}{(x+1)^2} = \\dfrac{-6}{(x+1)^2}`}</M></p>
          <p style={{margin:0}}>ที่ราก <M>{`x^*=\\sqrt7`}</M>: <M>{`|g'(\\sqrt7)| = \\dfrac{6}{(\\sqrt7+1)^2} \\approx 0.4514 < 1`}</M> ⇒ <b>ลู่เข้า</b> และเพราะ <M>{`g'<0`}</M> ค่าจึง<b>สลับข้าง</b>รอบเว้นรอบ · ลดทีละ ~45% ต่อรอบ = <b>linear convergence</b> (ช้ากว่า Newton ที่เป็น quadratic มาก)</p>
        </Callout>

        <h3 style={{marginTop:20}}>จัดรูปแบบอื่นก็ได้ — แต่ไม่ใช่ทุกแบบใช้ได้</h3>
        <div className="grid-3">
          <div className="card tight"><h4 style={{margin:"0 0 4px"}}>รูป A</h4><M>{`x = 7/x`}</M> <span className="tag" style={{marginLeft:6}}>วน loop ไม่ลู่</span></div>
          <div className="card tight"><h4 style={{margin:"0 0 4px"}}>รูป B <span style={{fontSize:'0.7rem', color:"var(--green)"}}>(อาจารย์ใช้)</span></h4><M>{`x = \\tfrac{7+x}{x+1}`}</M> <span className="tag green" style={{marginLeft:6}}>ลู่เข้า ช้า</span></div>
          <div className="card tight"><h4 style={{margin:"0 0 4px"}}>รูป C</h4><M>{`x = \\tfrac{1}{2}(x + 7/x)`}</M> <span className="tag green" style={{marginLeft:6}}>ลู่เร็วสุด</span></div>
        </div>
        <p style={{margin:"6px 0 0", fontSize:'0.82rem', color:"var(--text-dim)"}}>หมายเหตุ: รูป C เร็วผิดปกติเพราะมันคือ <b>Newton-Raphson ของ <M>{`x^2-7`}</M> พอดี</b> (<M>{`g'(\\sqrt7)=0`}</M>) — ข้อสอบ One-point ปกติจะจัดได้รูปแบบ B มากกว่า</p>

        <Callout kind="tip" title="เงื่อนไขลู่เข้า (Convergence)">
          ที่จุดราก <M>{`x^*`}</M>: ถ้า <M>{`|g'(x^*)| < 1`}</M> → ลู่เข้า, ถ้า <M>{`|g'(x^*)| > 1`}</M> → ลู่ออก
        </Callout>

        <h3 style={{marginTop:20}}>ตัวอย่างเตือน · เลือก g(x) ผิด → ลู่ออก (ตามชีท Mid p.4)</h3>
        <Callout kind="danger" title="กรณีคลาสสิก — g(x) = 7/x กับ x₀ = 1 → oscillate ไม่จบ">
          <p>เริ่มจาก <M>{`x^2 = 7`}</M> ถ้าจัดเป็น <M>{`x = 7/x`}</M> แล้วเริ่มที่ <M>{`x_0 = 1`}</M>:</p>
          <NumTable
            headers={["i", "xᵢ", "xᵢ₊₁ = 7/xᵢ", "ε% = |Δx/xᵢ₊₁|"]}
            rows={[
              ["0", "1", "7 / 1 = 7",      "—"],
              ["1", "7", "7 / 7 = 1",      "|1−7|/1 = 600%"],
              ["2", "1", "7 / 1 = 7",      "|7−1|/7 ≈ 85.7%"],
              ["3", "7", "7 / 7 = 1",      "|1−7|/1 = 600%"],
              ["4", "1", "7 / 1 = 7",      "|7−1|/7 ≈ 85.7%"],
              ["…", "…", "วน 7 ↔ 1 ไปเรื่อย ๆ", "ไม่ลด"],
            ]}
          />
          <p style={{margin:"10px 0 4px"}}><b>วิเคราะห์ทำไม:</b></p>
          <p style={{margin:"0 0 8px"}}><M>{`g(x) = 7/x \\Rightarrow g'(x) = -7/x^2`}</M>. ที่จุดราก <M>{`x^* = \\sqrt{7} \\approx 2.6458`}</M>:</p>
          <MB>{`|g'(\\sqrt{7})| = |-7/7| = 1 \\;\\;\\not<\\; 1 \\quad \\Rightarrow \\quad \\text{ไม่ลู่เข้า}`}</MB>
          <p style={{margin:"8px 0 0"}}>เนื่องจาก <M>{`|g'(x^*)| = 1`}</M> พอดี — มัน <b>oscillate</b> (สลับค่าไปกลับ) ไม่ลู่และไม่ระเบิด</p>
          <p style={{margin:"8px 0 0", fontSize:'0.778rem', color:"var(--text-faint)"}}>ทางออก: เลือก g(x) ใหม่ที่ <M>{`|g'(x^*)| < 1`}</M> เช่นรูป C: <M>{`g(x) = (x + 7/x)/2`}</M> มี <M>{`g'(\\sqrt{7}) = 0`}</M> → ลู่เข้าเร็วมาก (quadratic — เพราะนี่คือ Newton-Raphson นั่นเอง)</p>
        </Callout>
        <PythonRunner code={`# One-point Iteration · เปรียบเทียบ g(x) ที่ดีกับที่ลู่ออก
# จากชีท Mid p.4 — เลือก g(x) ผิดทำให้คำตอบวนไม่หยุด

def one_point(g, x0, label, max_iter=8):
    print(f"=== {label} ===")
    x = x0
    for i in range(max_iter):
        xn = g(x)
        err = abs((xn - x) / xn) * 100 if xn != 0 else float('inf')
        print(f"  i={i+1}: x={x:8.4f} → g(x)={xn:8.4f}   ε%={err:8.4f}")
        x = xn
    print()

# รูป A — ลู่ออก (oscillate)
one_point(lambda x: 7/x,            x0=1.0, label="A: g(x) = 7/x  (x₀=1)  → oscillate")
# รูป C — ลู่เข้าเร็ว (quadratic)
one_point(lambda x: 0.5*(x + 7/x),  x0=1.0, label="C: g(x) = (x + 7/x)/2  → ลู่เข้าเร็ว")`} height={260}/>

        <h3 style={{marginTop:18}}>Python · One-point หา √7 (รูป C — ลู่เข้า)</h3>
        <PythonRunner code={`# One-point Iteration หา √7
import math

def one_point(g, x0, tol=1e-6, max_iter=50):
    x = x0
    for i in range(max_iter):
        xn = g(x)
        err = abs((xn - x) / xn) if xn != 0 else abs(xn - x)
        print(f"i={i+1:2d}  x_old={x:.8f}  x_new={xn:.8f}  err={err:.2e}")
        if err < tol:
            return xn
        x = xn

# รูป C — เร็วที่สุด: x = 0.5*(x + 7/x)  (จริง ๆ คือ Newton สำหรับ x²−7)
ans = one_point(lambda x: 0.5 * (x + 7/x), x0=2.0)
print(f"\\n√7 ≈ {ans:.8f}  (จริง = {math.sqrt(7):.8f})")`} height={220}/>

        <h3 style={{marginTop:24}}>✍️ การบ้าน 5 ข้อ 1.1 · ทำมือ 4 iterations — หา <M>{`\\sqrt{7}`}</M> จาก <M>{`x_0 = 0`}</M></h3>
        <Callout kind="danger" title="ทำไม x₀ = 0 ถึงบังคับว่าต้องใช้รูป B — ไม่ใช่เรื่องบังเอิญ">
          <p style={{margin:"0 0 6px"}}>ลองเอา <M>{`x_0=0`}</M> ใส่รูปอื่นดู:</p>
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>รูป A</b> <M>{`g(x)=7/x`}</M> → <M>{`7/0`}</M> = <b>หารด้วยศูนย์ ตายตั้งแต่รอบแรก</b></li>
            <li><b>รูป C</b> <M>{`g(x)=\\tfrac12(x+7/x)`}</M> → มี <M>{`7/x`}</M> อยู่ข้างใน <b>ตายเหมือนกัน</b></li>
            <li><b>รูป B</b> <M>{`g(x)=\\dfrac{7+x}{x+1}`}</M> → <M>{`(7+0)/(0+1)=7`}</M> ✓ <b>รอดรูปเดียว</b></li>
          </ul>
          <p style={{margin:"6px 0 0"}}>⇒ การที่โจทย์กำหนด <M>{`x_0=0`}</M> มาให้ คือการ<b>บอกใบ้ว่าต้องจัดสมการเป็นรูป B</b> (รูปที่อาจารย์จัดให้ดูในเอกสารติวพอดี — ที่มาของสูตรอยู่ในหัวข้อด้านบน) · <b>ในข้อสอบถ้าเจอ <M>{`x_0`}</M> แปลก ๆ ให้เช็คก่อนว่ารูป <M>{`g`}</M> ที่จะใช้หารศูนย์มั้ย</b></p>
        </Callout>
        <NumTable
          headers={["i", "xᵢ", "xᵢ₊₁ = (7 + xᵢ)/(xᵢ + 1)", "|Δx|", "ε = |Δx| / xᵢ₊₁"]}
          rows={[
            [1, "0.000000", "(7 + 0)/(0 + 1) = 7.000000", "7.000000", "1.000000"],
            [2, "7.000000", "(7 + 7)/(7 + 1) = 1.750000", "5.250000", "3.000000"],
            [3, "1.750000", "(7 + 1.75)/(1.75 + 1) = 3.181818", "1.431818", "0.450000"],
            [4, "3.181818", "(7 + 3.181818)/(3.181818 + 1) = 2.434783", "0.747036", "0.306818"],
          ]}
        />
        <Callout kind="warn" title="คำตอบที่ต้องส่งคือ 2.434783 — ไม่ใช่ 2.645751">
          <p style={{margin:0}}>โจทย์สั่ง “ทำด้วยมือ <b>4 iterations</b>” ⇒ ตอบ<b>ค่าที่ได้ ณ รอบที่ 4</b> คือ <M>{`x_4 = 2.434783`}</M> (ยังห่างจาก <M>{`\\sqrt7=2.645751`}</M> อยู่ 8%) — <b>ห้ามไปเอาค่าจริงจากปุ่ม √ มาตอบ</b> เพราะนี่คือจุดที่อาจารย์ตั้งใจวัดว่าเดินตารางเป็นมั้ย. One-point รูปนี้ <M>{`|g'|\\approx 0.45`}</M> ⇒ ลดทีละ ~45% ต่อรอบ 4 รอบยังไม่พอ (ต่างจาก Newton ที่ 4 รอบจบ)</p>
        </Callout>

        <h3 style={{marginTop:22}}>✍️ การบ้าน 5 ข้อ 1.2 · โปรแกรม “จนทศนิยม 6 ตำแหน่งไม่เปลี่ยน”</h3>
        <Callout kind="tip" title="อ่านเงื่อนไขหยุดให้ตรงคำสั่ง — ข้อนี้ไม่เหมือนข้อ 2/3">
          <p style={{margin:0}}>ข้อ 1.2 เขียนว่า “ผลลัพธ์<b>ไม่มีการเปลี่ยนแปลงจุดทศนิยม 6 ตำแหน่ง</b>” ⇒ เทียบ<b>ค่าที่ปัด 6 ตำแหน่งแล้ว</b> ว่าเท่ากันสองรอบติดกัน (<code>round(xn,6) == round(x,6)</code>) · ส่วนข้อ 2/3 เขียนว่า “ค่าคลาดเคลื่อนน้อยกว่า 0.000001” ⇒ เทียบ <M>{`|\\Delta x| < 10^{-6}`}</M> — <b>คนละเกณฑ์กัน อย่าสลับ</b></p>
        </Callout>
        <PythonRunner code={`# การบ้าน 5 ข้อ 1.2 — One-point Iteration หา √7 จนทศนิยม 6 ตำแหน่งไม่เปลี่ยน
# กรอบ 3 ขั้นที่อาจารย์สั่งให้จด: ① Initial Value ② Iteration Form ③ เงื่อนไขหยุด

g = lambda x: (7 + x) / (x + 1)      # ② Iteration Form  (จาก x² = 7 → x(x+1) = 7+x)
x = 0.0                              # ① Initial Value   (โจทย์กำหนด)

for i in range(1, 101):
    xn = g(x)
    print(f"i={i:2d}  x_old={x:.8f}  x_new={xn:.8f}  |dx|={abs(xn-x):.2e}")
    if round(xn, 6) == round(x, 6):  # ③ เงื่อนไขหยุด: 6 ทศนิยมไม่เปลี่ยน
        break
    x = xn

print(f"\\n√7 ≈ {xn:.6f}   (หยุดที่รอบ {i})")`} height={300}/>
        <Callout kind="danger" title="⚠︎ จุดที่ทำให้ตอบผิดทั้งข้อ — สองเกณฑ์นี้ให้คำตอบ “คนละตัว”">
          <NumTable
            headers={["เกณฑ์หยุด", "หยุดรอบที่", "ค่าที่ได้ (เต็ม)", "ตอบ 6 ทศนิยม"]}
            rows={[
              ["round 6 ตำแหน่งไม่เปลี่ยน (ตามโจทย์ข้อ 1.2)", "23", "2.6457513712", "2.645751 ✓"],
              ["|Δx| < 10⁻⁶ (เกณฑ์ของข้อ 2/3)", "21", "2.6457516060", "2.645752 ✗"],
            ]}
          />
          <p style={{margin:"8px 0 0"}}>ค่าจริง <M>{`\\sqrt7 = 2.6457513111`}</M> ⇒ เกณฑ์ตามโจทย์ให้ <b>2.645751 ถูกเป๊ะ</b> ส่วนอีกเกณฑ์หยุดเร็วไป 2 รอบแล้วปัดขึ้นเป็น <b>2.645752</b>. <b>อาจารย์ตรวจแค่คำตอบ ผิด = 0</b> ⇒ ตำแหน่งสุดท้ายเพี้ยนตัวเดียวก็เสียทั้งข้อ — อ่านเงื่อนไขหยุดให้ตรงคำสั่งเสมอ</p>
        </Callout>

        <h3>Animation · Cobweb diagram</h3>
        <p>เส้นทาง <M>{`x_0 \\to g(x_0) \\to x_1 = g(x_0) \\to g(x_1)`}</M> เห็นเป็น "แมงมุมไต่ใย" สลับแนวตั้ง-แนวนอนระหว่างเส้น <M>{`y=g(x)`}</M> กับเส้น <M>{`y=x`}</M></p>
        <CobwebViz g={x => 0.5*(x + 7/x)} x0={5} exprText="g(x) = 0.5(x + 7/x)"/>

        <h3>Interactive · ทดลองรูป g(x) ต่าง ๆ</h3>
        <RootSolver method="onepoint"/>

        <h3>โจทย์ทำมือ — Taylor Series</h3>
        <Problem
          label="ติว Midterm หน้า Taylor · ln 4 จาก x₀ = 2 (N = 0–3)"
          solution={
            <div>
              <p>Taylor series รอบ <M>{`x_0 = 2`}</M>: <M>{`f(x) = f(x_0) + f'(x_0)(x-x_0) + \\frac{f''(x_0)}{2!}(x-x_0)^2 + \\ldots`}</M></p>
              <p><M>{`f(x)=\\ln x \\Rightarrow f'(x)=1/x,\\; f''(x)=-1/x^2,\\; f'''(x)=2/x^3`}</M></p>
              <p>ที่ <M>{`x_0=2`}</M>: <M>{`f(2)=\\ln 2 \\approx 0.6931,\\; f'(2)=0.5,\\; f''(2)=-0.25,\\; f'''(2)=0.25`}</M></p>
              <p>ที่ <M>{`x=4`}</M>, <M>{`(x-x_0)=2`}</M>:</p>
              <NumTable
                headers={["n", "Tn(4)", "ค่าจริง ln 4", "error %"]}
                rows={[
                  [0, 0.6931, 1.3863, 50.00],
                  [1, 1.6931, 1.3863, 22.13],
                  [2, 1.1931, 1.3863, 13.93],
                  [3, 1.5265, 1.3863, 10.11],
                ]}
              />
              <p className="muted">หมายเหตุ: <M>{`x-x_0 = 2`}</M> ใกล้รัศมีลู่เข้าของ <M>{`\\ln`}</M> ที่ <M>{`x_0=2`}</M> → ลู่ช้ามาก ต้องใช้หลาย term</p>
            </div>
          }
        >
          ใช้ Taylor series คำนวณ <M>{`f(x)=\\ln x`}</M> ที่ <M>{`x=4`}</M> โดย <M>{`x_0=2`}</M> สำหรับ <M>{`n=0,1,2,3`}</M> พร้อมหา error
        </Problem>
      </Sect>

      {/* ============= METHOD 5: NEWTON-RAPHSON ============= */}
      <Sect tag="5" title="Method 5 · Newton-Raphson">
        <p>วิธีที่<b>เร็วที่สุด</b>ในบทนี้ — ใช้เส้นสัมผัส (tangent) ของกราฟแทนเส้น secant</p>

        <Formula>
          <MB>{`x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}`}</MB>
        </Formula>

        <Callout title="ที่มา (Taylor 1st order)">
          <p>Taylor expansion: <M>{`f(x_{n+1}) \\approx f(x_n) + f'(x_n)(x_{n+1} - x_n)`}</M></p>
          <p>ตั้ง <M>{`f(x_{n+1}) = 0`}</M> (อยากให้ x ถัดไปเป็นราก):</p>
          <MB>{`0 = f(x_n) + f'(x_n)(x_{n+1} - x_n)`}</MB>
          <MB>{`x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)} \\;\\checkmark`}</MB>
        </Callout>

        <h3>เห็นภาพการทำงาน</h3>
        <p>ลากเส้นสัมผัสที่จุด <M>{`(x_n, f(x_n))`}</M> → เส้นนั้นตัดแกน x ที่ <M>{`x_{n+1}`}</M></p>
        <p>หา <M>{`\\sqrt{7}`}</M> โดยใช้ <M>{`f(x) = x^2 - 7`}</M>, เริ่มที่ <M>{`x_0 = 2.0`}</M>:</p>
        <NewtonViz fn={f7} fprime={fp7} x0={2.0}/>

        <h3>ตัวอย่างทำมือ — หา √7 · ทุก step + กดเครื่อง</h3>
        <HandWalkthrough steps={[
          { title: "ตั้งสูตร + derivative",
            body: `f(x) = x² − 7
f'(x) = 2x
Newton: x_{n+1} = x_n − f(x_n) / f'(x_n)
ค่าเริ่ม: x₀ = 2.0` },
          { title: "Iteration 1",
            body: `f(2) = 2² − 7 = 4 − 7 = −3
f'(2) = 2(2) = 4
x₁ = 2 − (−3) / 4 = 2 + 0.75 = 2.75
εₐ = |2.75 − 2| / 2.75 = 0.75/2.75 ≈ 0.2727 = 27.27%`,
            calc: "ตั้ง: 2 → STO x   |   พิมพ์สูตร: x − (x² − 7) ÷ (2x) =   |   ผลเก็บ → STO x   (กด ↑ = ↑ = ↑ = ซ้ำ)" },
          { title: "Iteration 2",
            body: `f(2.75) = 7.5625 − 7 = 0.5625        (= 9/16)
f'(2.75) = 5.5
x₂ = 2.75 − 0.5625/5.5 = 2.75 − 0.1022727 = 2.6477273     (= 233/88)
εₐ = |2.6477273 − 2.75| / 2.6477273 = 0.1022727/2.6477273 ≈ 3.862661%   (= 9/233)`,
            calc: "กดลูกศรขึ้น (↑) เพื่อเรียกสูตรเดิม → = (จะใช้ค่า x ใหม่ที่เก็บไว้)" },
          { title: "Iteration 3",
            body: `f(2.6477273) = 7.0104597 − 7 = 0.0104597      (= 81/7744 — อย่าใช้ 2.6477 ตัวปัด!)
f'(2.6477273) = 5.2954545
x₃ = 2.6477273 − 0.0104597/5.2954545 = 2.6477273 − 0.0019752 = 2.6457520   (= 108497/41008)
εₐ = 0.0019752/2.6457520 ≈ 0.074656%   (= 81/108497)`,
            calc: "↑ = ซ้ำ (ตอนนี้ x = 2.6477273 อยู่แล้ว — เก็บทศนิยมให้ครบ อย่าจดแค่ 4 ตำแหน่ง)" },
          { title: "Iteration 4",
            body: `f(2.6457520) = 0.0000039
f'(2.6457520) = 5.2915041
x₄ = 2.6457520 − 0.0000039/5.2915041 = 2.6457513
εₐ ≈ 0.000028%  ✓ หยุดได้`,
            calc: "↑ = → ดูว่าค่าไม่เปลี่ยนใน 6 ทศนิยมแล้ว = stop" },
          { title: "สรุป + เปรียบเทียบ",
            body: `√7 ≈ 2.6457513  (ค่าจริง = 2.6457513110...)
สังเกต quadratic convergence: error ลด ~ยกกำลัง 2 ทุกรอบ
27.27% → 3.86% → 0.0747% → 0.000028%
Newton ใช้ 4 iter ได้ความแม่น 6 ทศนิยม — Bisection ต้องการ ~20 iter!` },
        ]}/>

        <h3>ตัวอย่างทำมือ — โจทย์เดียวกับที่อาจารย์ติวก่อนสอบ</h3>
        <Problem label="ติว Midterm หน้า Newton · หา √7 (x₀ = 2)" solution={
          <div>
            <p><M>{`f(x) = x^2 - 7, f'(x) = 2x`}</M></p>
            <NumTable
              headers={["i", "xᵢ", "f(xᵢ)", "f'(xᵢ)", "xᵢ₊₁", "εₐ %"]}
              rows={[
                [1, 2.0000000, -3.000000, 4.000000, 2.7500000, 27.272727],
                [2, 2.7500000, 0.562500, 5.500000, 2.6477273, 3.862661],
                [3, 2.6477273, 0.010460, 5.295455, 2.6457520, 0.074656],
                [4, 2.6457520, 0.0000039, 5.291504, 2.6457513, 0.000028],
              ]}
            />
            <Callout kind="tip" title="🎙️ อาจารย์สั่งไว้ในคาบติว: “ใช้เศษส่วนดีกว่า ถ้าทศนิยมลงตัวก็ใช้ได้”">
              <p style={{margin:"0 0 4px"}}>ถ้าเดินด้วย<b>เศษส่วน</b> ตัวเลขจะไม่เพี้ยนสะสมเลย — โซ่ของโจทย์นี้คือ</p>
              <MB>{`x_1=\\frac{11}{4}\\;\\to\\;x_2=\\frac{233}{88}\\;\\to\\;x_3=\\frac{108497}{41008}\\approx 2.645752048`}</MB>
              <p style={{margin:"4px 0 0"}}>และ error ก็เป็นเศษส่วนสวย ๆ: <M>{`\\varepsilon_1=\\frac{3}{11}`}</M>, <M>{`\\varepsilon_2=\\frac{9}{233}`}</M>, <M>{`\\varepsilon_3=\\frac{81}{108497}\\approx 0.00074656`}</M></p>
              <p style={{margin:"6px 0 0", fontSize:'0.8rem', color:"var(--text-dim)"}}>⚠︎ ถ้าคิดต่อจากเลขที่<b>ปัดแล้ว</b> (เช่น ใช้ f(2.6477) = 0.0103 แทนค่าจริง 81/7744 = 0.010460) <M>{`x_3`}</M> จะเพี้ยนเป็น 2.64576 — ผิดตั้งแต่ทศนิยมตำแหน่งที่ 5</p>
            </Callout>
            <p>4 iterations → <M>{`\\sqrt{7} \\approx 2.6457513`}</M> ตรงกับค่าจริง <M>{`2.6457513110...`}</M> แล้ว ✓</p>
            <p className="muted" style={{fontSize:'0.778rem'}}>สังเกตว่า error <em>quadratic convergence</em> — ลดลงประมาณ "ยกกำลังสอง" ทุกรอบ: 27% → 3.9% → 0.075% → 0.000028%</p>
          </div>
        }>
          ใช้วิธี Newton-Raphson หา <M>{`\\sqrt{7}`}</M> โดย <M>{`x_0 = 2.0`}</M> 4 iterations พร้อม error
        </Problem>

        <h3>fx-991CW · ใช้ตัวแปร X</h3>
        <Callout title="กดเครื่อง — Newton ใช้ 1 บรรทัด">
          <CalcSteps steps={[
            <span>เก็บค่าเริ่ม: <Key>2</Key> <Key>→</Key> <Key>STO</Key> <Key>x</Key></span>,
            <span>พิมพ์สูตร Newton: <code>x − (x² − 7) ÷ (2x)</code></span>,
            <span>กด <Key>=</Key> → ได้ x₁ = 2.75</span>,
            <span>กด <Key>→</Key> <Key>STO</Key> <Key>x</Key> (เก็บกลับใส่ x)</span>,
            <span>กด <Key>↑</Key> <Key>=</Key> (เรียกคำสั่งเก่า + คำนวณ) → ได้ x₂</span>,
            <span>กดซ้ำ ๆ จนเลขไม่เปลี่ยน</span>,
          ]}/>
        </Callout>

        <h3>Python — Newton-Raphson ครบเครื่อง</h3>
        <PythonRunner code={`import math

def newton(f, fp, x0, tol=1e-6, max_iter=50):
    x = x0
    for i in range(max_iter):
        fx, fpx = f(x), fp(x)
        if fpx == 0:
            print("f'(x) = 0 → method ล้มเหลว")
            return None
        xn = x - fx/fpx
        err = abs((xn - x)/xn) if xn != 0 else abs(xn - x)
        print(f"i={i+1:2d}  x={x:.8f}  f(x)={fx:+.4e}  f'(x)={fpx:.4f}  x_new={xn:.8f}  err={err:.2e}")
        if err < tol:
            return xn
        x = xn

# ข้อสอบ: หา √7
f  = lambda x: x**2 - 7
fp = lambda x: 2*x
ans = newton(f, fp, 2.0)
print(f"\\n√7 ≈ {ans:.10f}  (จริง = {math.sqrt(7):.10f})")`} height={260}/>

        <h3 style={{marginTop:24}}>✍️ การบ้าน 5 ข้อ 2.1 · ทำมือ 4 iterations — <M>{`x_0 = 2.0`}</M></h3>
        <p>โจทย์ตรงกับ walkthrough ด้านบนเป๊ะ — ตารางนี้คือ<b>รูปที่เขียนส่ง</b> (ε เป็น % ให้ตรงกับที่อาจารย์เดินในคาบติว ส่วน <M>{`|\\Delta x|`}</M> คือตัวที่โปรแกรมข้อ 2.2 ใช้)</p>
        <NumTable
          headers={["i", "xᵢ", "f(xᵢ)", "f′(xᵢ)", "xᵢ₊₁", "|Δx|", "εₐ %"]}
          rows={[
            [1, "2.0000000", "−3.000000", "4.000000", "2.7500000", "0.750000", "27.272727"],
            [2, "2.7500000", "+0.562500", "5.500000", "2.6477273", "0.102273", "3.862661"],
            [3, "2.6477273", "+0.010460", "5.295455", "2.6457520", "0.001975", "0.074656"],
            [4, "2.6457520", "+0.0000039", "5.291504", "2.6457513", "7.37×10⁻⁷", "0.000028"],
          ]}
        />
        <p>ตอบ: <M>{`\\sqrt7 \\approx 2.645751`}</M> — <b>4 รอบพอดี</b> (ต่างจาก One-point ข้อ 1 ที่ 4 รอบยังได้แค่ 2.434783) เพราะ Newton เป็น quadratic convergence: จำนวนหลักที่ถูกเพิ่มเป็นเท่าตัวทุกรอบ</p>

        <h3 style={{marginTop:22}}>✍️ การบ้าน 5 ข้อ 2.2 · โปรแกรม “คลาดเคลื่อนน้อยกว่า 0.000001”</h3>
        <PythonRunner code={`# การบ้าน 5 ข้อ 2.2 — Newton-Raphson หา √7 จนคลาดเคลื่อน < 0.000001
import math

f  = lambda x: x**2 - 7      # หา √7 → x² = 7 → f(x) = x² − 7
fp = lambda x: 2*x           # f'(x) = 2x

x   = 2.0                    # ① Initial Value (โจทย์กำหนด)
tol = 1e-6                   # ③ เงื่อนไขหยุด: |Δx| < 0.000001

for i in range(1, 51):
    xn = x - f(x) / fp(x)                    # ② Iteration Form
    dx = abs(xn - x)
    print(f"i={i}  x={x:.10f}  f(x)={f(x):+.3e}  x_new={xn:.10f}  |dx|={dx:.2e}")
    if dx < tol:
        break
    x = xn

print(f"\\n√7 ≈ {xn:.6f}   (หยุดที่รอบ {i})")
print(f"ค่าจริง = {math.sqrt(7):.10f}")`} height={320}/>

        <h3 style={{marginTop:22}}>✍️ การบ้าน 5 ข้อ 2.3 · วาดกราฟ <M>{`f(x)`}</M> และ <M>{`f'(x)`}</M></h3>
        <Callout kind="tip" title="อ่านโจทย์ให้ครบ — “f(x) ได้จากสมการที่นักศึกษาสร้างขึ้นมา”">
          <p style={{margin:0}}>ใบงานเขียนว่ากราฟที่วาดต้องมาจาก <M>{`f(x)`}</M> ที่<b>เราแปลงมาเอง</b> (โจทย์บอกแค่ “หา <M>{`\\sqrt7`}</M>” ไม่ได้ให้ <M>{`f`}</M> มา) ⇒ ต้องโชว์ให้เห็นว่า <M>{`x=\\sqrt7 \\Rightarrow x^2=7 \\Rightarrow f(x)=x^2-7`}</M> แล้วค่อยวาด · รูปตัวอย่างในใบงานมีเส้นไต่ลงมาหา root ด้วย — โค้ดข้างล่างเลยวาด<b>เส้นสัมผัสของแต่ละรอบ</b>ไว้ให้ ตรงกับรูปนั้น</p>
        </Callout>
        <Callout kind="warn" title="3 เรื่องที่ทำให้กราฟพัง (เจอบ่อยตอนส่งจริง)">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>ห้ามใส่ภาษาไทยใน label/title</b> — ฟอนต์ default ของ matplotlib ไม่มีตัวไทย จะออกมาเป็นสี่เหลี่ยม □□□ ⇒ ใช้อังกฤษล้วน</li>
            <li>กด Run ในหน้านี้<b>ครั้งแรกจะช้า</b> เพราะต้องโหลด numpy + matplotlib (~10–15 MB) — ครั้งต่อไปเร็วปกติ</li>
            <li>เวลาส่งอาจารย์ให้ปิดท้ายด้วย <code>plt.show()</code> ตามปกติ (ในหน้านี้รูปจะเด้งออกมาให้เองอยู่แล้ว)</li>
          </ul>
        </Callout>
        <PythonRunner code={`# การบ้าน 5 ข้อ 2.3 — วาดกราฟ f(x), f'(x) + เส้นสัมผัสของ Newton
import numpy as np
import matplotlib.pyplot as plt

f  = lambda x: x**2 - 7      # สมการที่เราสร้างเอง: x = √7 → x² − 7 = 0
fp = lambda x: 2*x
root = np.sqrt(7)

x = np.linspace(0, 4, 400)
fig, ax = plt.subplots(figsize=(7, 4.5))
ax.plot(x, f(x),  color="C0", label="f(x) = x^2 - 7")
ax.plot(x, fp(x), color="C1", linestyle="--", label="f'(x) = 2x")
ax.axhline(0, color="black", linewidth=0.8)

# เส้นสัมผัสแต่ละรอบ: ลากจาก (xi, f(xi)) ลงมาตัดแกน x ที่ x_{i+1}
xi = 2.0
for k in range(3):
    xn = xi - f(xi) / fp(xi)
    ax.plot([xi, xi], [0, f(xi)], color="green", linewidth=0.8, linestyle=":")
    ax.plot([xi, xn], [f(xi), 0], color="green", linewidth=1.2)
    ax.plot(xi, f(xi), "g.", markersize=9)
    ax.annotate(f"x{k} = {xi:.4f}", xy=(xi, 0), xytext=(0.35, 0.9 + k*1.1),
                color="green", fontsize=8)
    xi = xn

ax.plot(root, 0, "ro", zorder=5)
ax.annotate("root = sqrt(7) = 2.645751", xy=(root, 0), xytext=(2.15, -5.2),
            arrowprops=dict(arrowstyle="->", color="red"), color="red", fontsize=9)
ax.set_xlabel("x"); ax.set_ylabel("y")
ax.set_title("Newton-Raphson on f(x) = x^2 - 7  (x0 = 2)")
ax.grid(alpha=0.3); ax.legend(loc="upper left")
plt.tight_layout()
plt.show()`} height={420}/>

        <h3>Interactive · ใส่ฟังก์ชันเอง (auto numeric derivative)</h3>
        <RootSolver method="newton"/>

        <Callout kind="warn" title="ข้อจำกัดของ Newton">
          <ul style={{margin:0, paddingLeft:18}}>
            <li>ต้องรู้ <M>{`f'(x)`}</M> ก่อน — บางที diff ยาก</li>
            <li>ถ้า <M>{`f'(x_n) = 0`}</M> → หารด้วย 0 พัง</li>
            <li>ถ้าเลือก x₀ ไม่ดี อาจ <em>ลู่ออก</em> หรือกระโดดไปรากอื่น</li>
            <li>ถ้าราก<b>ซ้ำ</b> (double root) → ลู่ช้าลงเป็น linear convergence</li>
          </ul>
        </Callout>
      </Sect>

      {/* ============= METHOD 6: SECANT ============= */}
      <Sect tag="6" title="Method 6 · Secant Method">
        <p>เหมือน Newton แต่ <b>ไม่ต้องรู้ <M>{`f'(x)`}</M></b> — ใช้เส้น secant ผ่าน 2 จุดก่อนหน้าแทน tangent</p>

        <Formula>
          <MB>{`x_{n+1} = x_n - \\frac{f(x_n)\\,(x_{n-1} - x_n)}{f(x_{n-1}) - f(x_n)}`}</MB>
        </Formula>

        <Callout title="สังเกต">
          <p>สูตรเหมือน False Position เป๊ะ! แต่ต่างกันที่:</p>
          <ul>
            <li><b>Secant:</b> ใช้ 2 จุดล่าสุด ไม่สนเครื่องหมาย → เร็วกว่าแต่อาจลู่ออก</li>
            <li><b>False Position:</b> รักษาให้ <M>{`f(x_l)\\cdot f(x_r) < 0`}</M> ตลอด → ลู่เข้าแน่แต่ช้ากว่า</li>
          </ul>
        </Callout>

        <h3>เห็นภาพ</h3>
        <SecantViz fn={f7} x0={2.0} x1={3.0}/>

        <Callout kind="tip" title="🎙️ รูปสูตรที่อาจารย์เขียนบนกระดานตอนติว (จำอันนี้)">
          <MB>{`x_{i+1} = x_i - \\frac{f(x_i)\\,(x_{i-1} - x_i)}{f(x_{i-1}) - f(x_i)}`}</MB>
          <p style={{margin:"4px 0 0"}}>ที่มา: <M>{`f'(x_i)\\approx\\text{slope}=\\tan\\theta=\\dfrac{f(x_{i-1})-f(x_i)}{x_{i-1}-x_i}`}</M> แล้วแทนลงในสูตร Newton <M>{`x_{i+1}=x_i-\\frac{f(x_i)}{f'(x_i)}`}</M> — <b>Secant = Newton ที่แก้ปัญหา “diff ไม่เป็น/diff ยาก”</b></p>
          <p style={{margin:"6px 0 0", fontSize:'0.82rem'}}>อาจารย์ย้ำ 2 อย่าง: <b>ถ้าโจทย์ไม่กำหนด <M>{`x_0,x_1`}</M> มาให้ ก็เดาขึ้นมาเองได้เลย</b> · และ <b>error ดีดขึ้น ๆ ลง ๆ</b> ได้ (ไม่ลดเรียบเหมือน Newton)</p>
        </Callout>

        <Callout kind="danger" title="🎙️ คาบ 5 ส.ค. 2569 — อาจารย์สอน Secant แบบเร็วมาก แล้วให้ลองทำทันที">
          <p style={{margin:"0 0 6px"}}>อาจารย์ไล่ที่มาของสูตรจาก Newton ให้ดูสั้น ๆ: <b>ปัญหาของ Newton คือต้องมี <M>{`f'(x_1)`}</M></b> ⇒ แทนด้วย<b>สโลปเฉลี่ยระหว่างสองจุด</b> (เส้นสีแดงบนกระดาน)</p>
          <MB>{`f'(x_1)\\;\\approx\\;\\frac{\\Delta y}{\\Delta x}=\\frac{f(x_0)-f(x_1)}{x_0-x_1} \\quad\\Longrightarrow\\quad x_2=x_1-\\frac{f(x_1)\\,(x_0-x_1)}{f(x_0)-f(x_1)}`}</MB>
          <p style={{margin:"6px 0 0"}}>แล้วย้ำว่า <b>“initial value ของ Secant มี 2 ตัว คือ <M>{`x_0`}</M> กับ <M>{`x_1`}</M>”</b> ต่างจาก Newton/One-point ที่มีตัวเดียว</p>
        </Callout>

        <Callout kind="warn" title="⭐ จุดที่อาจารย์ใช้เวลาอธิบายนานที่สุด — การเลื่อนตัวแปรในลูป (ออกสอบแน่ เพราะครึ่งข้อสอบเป็นโค้ด)">
          <p style={{margin:"0 0 6px"}}>อาจารย์ให้ “ซิมูเลตในหัว” ว่าแต่ละรอบใช้จุดคู่ไหน:</p>
          <div style={{fontFamily:"var(--font-mono)", fontSize:'0.84rem', lineHeight:1.8, margin:"0 0 8px", padding:"8px 12px", background:"var(--bg-soft)", borderRadius:6, whiteSpace:"pre", overflowX:"auto"}}>{`รอบ 1:  x0 , x1  →  x2
รอบ 2:  x1 , x2  →  x3
รอบ 3:  x2 , x3  →  x4
รอบ 4:  x3 , x4  →  x5     ← คู่จุดเลื่อนไปข้างหน้าทีละ 1 ทุกรอบ`}</div>
          <p style={{margin:"0 0 6px"}}>แต่ในโค้ดเรามีตัวแปรแค่ <code>x0</code> กับ <code>x1</code> (เพราะสูตรรับ input แค่ 2 ตัว) ⇒ <b>ก่อนวนรอบถัดไปต้อง assign ค่ากลับ</b> ตามที่อาจารย์พูดคำต่อคำ:</p>
          <div style={{fontFamily:"var(--font-mono)", fontSize:'0.84rem', lineHeight:1.8, padding:"8px 12px", background:"var(--bg-soft)", borderRadius:6}}>
            “x1 มันจะกลายเป็น x0 ปะ · และ x2 มันจะกลายเป็น x1 ปะ<br/>
            &nbsp;<span style={{color:"var(--green)"}}>คุณต้อง assign ค่า x1 เป็น x0 · assign ค่า x2 เป็น x1</span>”
          </div>
          <p style={{margin:"8px 0 0"}}><b>ใน Python เขียนบรรทัดเดียวจบ:</b> <code>x0, x1 = x1, x2</code> — ถ้าเขียนแยกสองบรรทัดโดยไม่ระวังลำดับ (<code>x0 = x1</code> แล้ว <code>x1 = x2</code>) ก็ยังถูก แต่ถ้าสลับลำดับเมื่อไหร่ค่าจะทับกันและตารางพังทั้งใบ</p>
          <p style={{margin:"6px 0 0", fontSize:'0.82rem', color:"var(--text-dim)"}}>อาจารย์ยังเตือนเรื่องหา error ด้วยว่า ต้องเทียบ <M>{`x_2`}</M> <b>รอบนี้กับรอบก่อนหน้า</b> — ไม่ใช่เทียบกับ <M>{`x_2`}</M> ตัวที่เพิ่งคำนวณเสร็จในบรรทัดเดียวกัน</p>
        </Callout>

        <Problem label="✍️ โจทย์ที่อาจารย์ให้ทำในคาบ (5 ส.ค. · ให้เวลา 10–15 นาที)" solution={
          <div>
            <p style={{marginTop:0}}><M>{`f(x)=x^2-7`}</M> · <M>{`f'(x)=2x`}</M> · ค่าจริง <M>{`\\sqrt7=2.6457513111`}</M></p>

            <h4 style={{margin:"10px 0 6px"}}>ส่วนที่ 1 · Newton-Raphson จาก <M>{`x_0=2`}</M></h4>
            <NumTable
              headers={["รอบ", "xᵢ", "xᵢ₊₁", "|Δx|", "εₐ %"]}
              rows={[
                ["1", "2.0000000", "2.7500000", "0.7500000", "27.272727"],
                ["2", "2.7500000", "2.6477273", "0.1022727", "3.862661"],
                ["3", "2.6477273", "2.6457520", "0.0019752", "0.074656"],
                ["4", "2.6457520", "2.6457513", "0.0000007", "0.000028"],
              ]}
            />
            <p style={{fontSize:'0.84rem'}}>ใช้เกณฑ์ <M>{`|\\Delta x|<0.001`}</M> ของอาจารย์ ⇒ <b>หยุดที่รอบ 4</b> ได้ <b>2.6457513</b></p>

            <h4 style={{margin:"14px 0 6px"}}>ส่วนที่ 2 · Secant จาก <M>{`x_0=3,\\ x_1=2`}</M></h4>
            <NumTable
              headers={["รอบ", "x₀", "f(x₀)", "x₁", "f(x₁)", "x₂ ที่ได้", "|Δx|", "εₐ %"]}
              rows={[
                ["1", "3.0000000", "+2.0000000", "2.0000000", "−3.0000000", "2.6000000", "0.6000000", "23.076923"],
                ["2", "2.0000000", "−3.0000000", "2.6000000", "−0.2400000", "2.6521739", "0.0521739", "1.967213"],
                ["3", "2.6000000", "−0.2400000", "2.6521739", "+0.0340265", "2.6456954", "0.0064785", "0.244871"],
                ["4", "2.6521739", "+0.0340265", "2.6456954", "−0.0002960", "2.6457512", "0.0000559", "0.002112"],
              ]}
            />
            <p style={{fontSize:'0.84rem'}}>ใช้เกณฑ์ <M>{`|\\Delta x|<0.001`}</M> ⇒ <b>หยุดที่รอบ 4</b> ได้ <b>2.6457512</b></p>

            <Callout kind="good" title="สังเกตคอลัมน์ x₀ กับ x₁ ให้ดี — นี่คือการเลื่อนตัวแปรที่อาจารย์อธิบาย">
              <p style={{margin:0}}>แถวที่ 2 เอา <M>{`x_1`}</M> ของแถวที่ 1 (คือ 2.0) มาเป็น <M>{`x_0`}</M> และเอา <M>{`x_2`}</M> ที่เพิ่งได้ (2.6) มาเป็น <M>{`x_1`}</M> — เลื่อนแบบนี้ทุกแถว. <b>ถ้าเผลอเก็บ <M>{`x_0=3`}</M> ไว้ตลอด มันจะกลายเป็น False Position ไปเลย</b> (คนละวิธี คนละคำตอบ)</p>
            </Callout>

            <Callout kind="tip" title="เทียบสองวิธี — คำตอบที่ควรเขียนถ้าโจทย์ถามต่อ">
              <p style={{margin:0}}>ทั้งคู่หยุดที่รอบ 4 เหมือนกัน แต่ Newton ลงลึกกว่า (<M>{`|\\Delta x|=7\\times10^{-7}`}</M> เทียบกับ Secant <M>{`5.6\\times10^{-5}`}</M>) เพราะ Newton ใช้<b>สโลปจริง</b> ส่วน Secant ใช้<b>สโลปประมาณ</b> · แลกมากับการที่ Secant <b>ไม่ต้องรู้ <M>{`f'`}</M> เลย</b></p>
            </Callout>

            <PythonRunner code={`# โจทย์ในคาบ 5 ส.ค. — หา √7 ด้วย Newton และ Secant
# เขียนตามกรอบ 3 ขั้นของอาจารย์ + เงื่อนไขหยุด absolute 0.001
f  = lambda x: x**2 - 7
fp = lambda x: 2*x
tol = 0.001

print("=== NEWTON  x0 = 2 ===")
x = 2.0                                   # ① Initial Value (ตัวเดียว)
for i in range(20):
    xn = x - f(x)/fp(x)                   # ② Iteration Form
    print(f"  รอบ {i+1}: x={x:.7f} -> {xn:.7f}  |dx|={abs(xn-x):.7f}")
    if abs(xn - x) < tol:                 # ③ เงื่อนไขหยุด
        x = xn; break
    x = xn
print(f"  ตอบ: {x:.7f}\\n")

print("=== SECANT  x0 = 3, x1 = 2 ===")
x0, x1 = 3.0, 2.0                         # ① Initial Value ต้องมี 2 ตัว
for i in range(20):
    x2 = x1 - f(x1)*(x0 - x1)/(f(x0) - f(x1))     # ② Iteration Form
    print(f"  รอบ {i+1}: x0={x0:.7f} x1={x1:.7f} -> x2={x2:.7f}  |dx|={abs(x2-x1):.7f}")
    if abs(x2 - x1) < tol:                        # ③ เงื่อนไขหยุด
        break
    x0, x1 = x1, x2        # ★ เลื่อนตัวแปร: x1→x0 , x2→x1  (จุดที่อาจารย์ย้ำ)
print(f"  ตอบ: {x2:.7f}")

import math
print(f"\\nค่าจริง √7 = {math.sqrt(7):.10f}")`} height={400}/>
          </div>
        }>
          จงหา <M>{`\\sqrt{7}`}</M> ด้วย <b>(ก)</b> Newton-Raphson โดย <M>{`x_0=2`}</M> และ <b>(ข)</b> Secant โดย <M>{`x_0=3,\\ x_1=2`}</M> — ทำจนเข้าเกณฑ์ <M>{`|\\Delta x|<0.001`}</M> แล้วเทียบว่าวิธีไหนเข้าเป้าลึกกว่ากัน
        </Problem>

        <Problem label="ติว Midterm หน้า Secant · หา √7 (x₀ = 2, x₁ = 2.5)" solution={
          <div>
            <p><M>{`f(x)=x^2-7`}</M> · <M>{`x_0=2 \\Rightarrow f(x_0)=-3`}</M> · <M>{`x_1=2.5 \\Rightarrow f(x_1)=-0.75`}</M></p>
            <window.HandWalkthrough steps={[
              { title: "รอบ 1 — หา x₂",
                body: `x₂ = x₁ − f(x₁)(x₀ − x₁) / (f(x₀) − f(x₁))
   = 2.5 − (−0.75)(2 − 2.5) / (−3 − (−0.75))
   = 2.5 − (0.375) / (−2.25)
   = 2.5 + 0.1666667 = 2.6666667      (= 8/3 พอดี)
ε = |x₂ − x₁| / x₂ = |8/3 − 2.5| / (8/3) = 1/16 = 0.0625`,
                calc: "2.5 − (−0.75)×(2−2.5) ÷ (−3−(−0.75)) =" },
              { title: "รอบ 2 — หา x₃ (เลื่อนคู่จุดไปข้างหน้า)",
                body: `ใช้คู่ใหม่: x₁ = 2.5, x₂ = 8/3
f(8/3) = 64/9 − 7 = 1/9 = 0.1111111
x₃ = 8/3 − (1/9)(2.5 − 8/3) / (−0.75 − 1/9)
   = 8/3 − (1/9)(−1/6) / (−31/36)
   = 8/3 − 2/93 = 82/31 = 2.6451613
ε = |x₃ − x₂| / x₃ = (2/93) ÷ (82/31) = 1/123 ≈ 0.0081301`,
                calc: "เก็บ 8/3 ไว้ในตัวแปร A แล้วพิมพ์ทั้งก้อนทีเดียว" },
            ]}/>
            <Callout kind="warn" title="⚠︎ ระวังเอกสารติว — ε รอบ 2 พิมพ์ผิด">
              <p style={{margin:0}}>ในเอกสารติวเขียน <M>{`\\varepsilon = \\frac{1}{128}`}</M> แต่คำนวณจริงได้ <M>{`\\frac{2}{93}\\div\\frac{82}{31} = \\frac{62}{7626} = \\frac{1}{123}`}</M> (≈ 0.0081301 ไม่ใช่ 0.0078125) — <b>ยึด 1/123</b> ยืนยันด้วยโปรแกรมแล้ว (เลข <M>{`x_2, x_3`}</M> ในเอกสารถูกหมด ผิดแค่ตัวหารของ ε)</p>
            </Callout>
            <p style={{margin:"8px 0 0"}}>สังเกต: <M>{`x_2 = 2.6666667`}</M> เลย <M>{`\\sqrt7`}</M> ไปทางขวา แล้ว <M>{`x_3 = 2.6451613`}</M> ย้อนกลับมาทางซ้าย — <b>นี่คือ “error ดีดขึ้น ๆ ลง ๆ” ที่อาจารย์พูดถึง</b> ต่างจาก Newton ที่ไต่เข้าหารากทางเดียว</p>
          </div>
        }>
          ใช้ Secant method หา <M>{`\\sqrt{7}`}</M> โดย <M>{`x_0 = 2`}</M>, <M>{`x_1 = 2.5`}</M> 2 รอบ พร้อม error
        </Problem>

        <Problem label="เพิ่มเติม · เริ่มคนละจุด (x₀ = 2, x₁ = 3) 4 รอบ" solution={
          <div>
            <p>เปลี่ยนจุดเริ่มเป็น <M>{`x_0 = 2.0, x_1 = 3.0`}</M> — คำตอบลงที่เดิม แต่เส้นทางต่างกัน (ยืนยันด้วยโปรแกรมทุกแถว)</p>
            <NumTable
              headers={["i", "xᵢ₋₁", "xᵢ", "f(xᵢ₋₁)", "f(xᵢ)", "xᵢ₊₁", "εₐ %"]}
              rows={[
                [1, 2.0000000, 3.0000000, -3.000000, 2.000000, 2.6000000, 15.384615],
                [2, 3.0000000, 2.6000000, 2.000000, -0.240000, 2.6428571, 1.621622],
                [3, 2.6000000, 2.6428571, -0.240000, -0.015306, 2.6457766, 0.110343],
                [4, 2.6428571, 2.6457766, -0.015306, 0.000134, 2.6457513, 0.000955],
              ]}
            />
            <p className="muted" style={{fontSize:'0.778rem'}}>เทียบกับ Newton (4 รอบเท่ากัน) — Secant ช้ากว่านิดหน่อยเพราะใช้ slope ประมาณ ไม่ใช่ tangent จริง แต่<b>ไม่ต้อง diff</b></p>
          </div>
        }>
          ใช้ Secant method หา <M>{`\\sqrt{7}`}</M> โดย <M>{`x_0 = 2.0`}</M>, <M>{`x_1 = 3.0`}</M> 4 iterations
        </Problem>

        <PythonRunner code={`def secant(f, x0, x1, tol=1e-6, max_iter=50):
    for i in range(max_iter):
        f0, f1 = f(x0), f(x1)
        x2 = x1 - f1*(x0 - x1)/(f0 - f1)
        err = abs((x2 - x1)/x2)
        print(f"i={i+1:2d}  x0={x0:.6f}  x1={x1:.6f}  x2={x2:.6f}  err={err:.2e}")
        if err < tol: return x2
        x0, x1 = x1, x2

f = lambda x: x**2 - 7
ans = secant(f, 2.0, 3.0)
print(f"\\n√7 ≈ {ans:.10f}")`} height={200}/>

        <h3 style={{marginTop:24}}>✍️ การบ้าน 5 ข้อ 3.1 · ทำมือ 4 iterations — <M>{`x_0 = 2.0`}</M> (แล้ว <M>{`x_1`}</M> ล่ะ?)</h3>
        <Callout kind="danger" title="ใบงานให้มาจุดเดียว แต่ Secant ต้องมี 2 จุด — เลือกเองได้ ไม่กระทบคำตอบ">
          <p style={{margin:"0 0 6px"}}>อาจารย์ย้ำในคาบเองว่า <b>“initial value ของ Secant มี 2 ตัว คือ <M>{`x_0`}</M> กับ <M>{`x_1`}</M>”</b> แต่ใบงานข้อ 3 พิมพ์มาแค่ <M>{`x_0 = 2.0`}</M> ⇒ <M>{`x_1`}</M> เลือกเอง. ผลลัพธ์รอบที่ 4 ของทุกคู่ที่สมเหตุสมผล:</p>
          <NumTable
            headers={["คู่จุดเริ่ม", "ที่มา", "x₄ (เต็ม)", "ตอบ 6 ทศนิยม", "โปรแกรมหยุดรอบ"]}
            rows={[
              ["x₀ = 2.0, x₁ = 3.0", "หน้านี้ใช้เป็นหลัก", "2.6457512972", "2.645751", "5"],
              ["x₀ = 3, x₁ = 2", "โจทย์ที่อาจารย์ให้ทำในคาบ 5 ส.ค.", "2.6457512432", "2.645751", "5"],
              ["x₀ = 2, x₁ = 2.5", "เอกสารติวก่อนสอบ", "2.6457513113", "2.645751", "5"],
            ]}
          />
          <p style={{margin:"8px 0 0"}}>⇒ <b>ตอบ 2.645751 เหมือนกันหมด</b> และโปรแกรมหยุดรอบ 5 เท่ากันหมด — เลือกคู่ไหนก็ได้ <b>แต่ต้องเขียนกำกับไว้ว่าเลือก <M>{`x_1`}</M> เท่าไร</b> ไม่งั้นตารางจะอ่านไม่รู้เรื่อง. <b>ข้อควรระวัง:</b> ถ้าเลือกห่างเกินไป (เช่น <M>{`x_1 = 1`}</M>) รอบ 4 จะได้ 2.646018 — <b>ผิดตำแหน่งที่ 4</b> ⇒ เลือก <M>{`x_1`}</M> ที่<b>คร่อมหรือใกล้ราก</b>ไว้ก่อน</p>
        </Callout>
        <NumTable
          headers={["i", "xᵢ₋₁", "xᵢ", "f(xᵢ₋₁)", "f(xᵢ)", "xᵢ₊₁", "|Δx|", "εₐ %"]}
          rows={[
            [1, "2.0000000", "3.0000000", "−3.000000", "+2.000000", "2.6000000", "0.400000", "15.384615"],
            [2, "3.0000000", "2.6000000", "+2.000000", "−0.240000", "2.6428571", "0.042857", "1.621622"],
            [3, "2.6000000", "2.6428571", "−0.240000", "−0.015306", "2.6457766", "0.002919", "0.110343"],
            [4, "2.6428571", "2.6457766", "−0.015306", "+0.000134", "2.6457513", "2.53×10⁻⁵", "0.000955"],
          ]}
        />
        <Callout kind="tip" title="🎙️ จุดที่อาจารย์ใช้เวลาอธิบายนานที่สุดในคาบ — การเลื่อนตัวแปร">
          <p style={{margin:0}}>“<b><M>{`x_1`}</M> กลายเป็น <M>{`x_0`}</M>, <M>{`x_2`}</M> กลายเป็น <M>{`x_1`}</M></b>” = <code>x0, x1 = x1, x2</code> บรรทัดเดียวจบ · ในตารางข้างบนคือการที่<b>คอลัมน์ <M>{`x_i`}</M> ของรอบก่อน เลื่อนมาเป็น <M>{`x_{i-1}`}</M> ของรอบถัดไป</b> — ครึ่งหนึ่งของข้อสอบเป็นโค้ด และนี่คือบรรทัดที่พลาดกันมากที่สุด (ถ้าเขียน <code>x0 = x1</code> ก่อนแล้วค่อย <code>x1 = x2</code> ยังถูก แต่ถ้าสลับลำดับเป็น <code>x1 = x2</code> ก่อน จะพัง)</p>
        </Callout>

        <h3 style={{marginTop:22}}>✍️ การบ้าน 5 ข้อ 3.2 · โปรแกรม “คลาดเคลื่อนน้อยกว่า 0.000001”</h3>
        <PythonRunner code={`# การบ้าน 5 ข้อ 3.2 — Secant method หา √7 จนคลาดเคลื่อน < 0.000001
import math

f = lambda x: x**2 - 7       # หา √7 → f(x) = x² − 7   (Secant ไม่ต้องใช้ f' เลย)

x0, x1 = 2.0, 3.0            # ① Initial Value 2 ตัว (โจทย์ให้ x0 = 2.0, x1 เลือกเอง)
tol = 1e-6                   # ③ เงื่อนไขหยุด: |Δx| < 0.000001

for i in range(1, 51):
    f0, f1 = f(x0), f(x1)
    x2 = x1 - f1 * (x0 - x1) / (f0 - f1)     # ② Iteration Form
    dx = abs(x2 - x1)
    print(f"i={i}  x0={x0:.8f}  x1={x1:.8f}  x2={x2:.10f}  |dx|={dx:.2e}")
    if dx < tol:
        break
    x0, x1 = x1, x2          # ⭐ เลื่อนตัวแปร — บรรทัดที่อาจารย์เน้นที่สุด

print(f"\\n√7 ≈ {x2:.6f}   (หยุดที่รอบ {i})")
print(f"ค่าจริง = {math.sqrt(7):.10f}")`} height={340}/>

        <h3 style={{marginTop:22}}>✍️ การบ้าน 5 ข้อ 3.3 · วาดกราฟ <M>{`f(x)`}</M> และ <M>{`f'(x)`}</M></h3>
        <p>โครงเดียวกับข้อ 2.3 เปลี่ยนแค่เส้นที่ลาก — Newton ลาก<b>เส้นสัมผัส 1 จุด</b> ส่วน Secant ลาก<b>เส้นตรงผ่าน 2 จุด</b> · สังเกตในรูปว่าเส้นม่วงพาดผ่านจุดสองจุดแล้วตัดแกน x ที่ <M>{`x_{i+1}`}</M></p>
        <Callout kind="tip" title="ทำไมยังต้องวาด f′(x) ทั้งที่ Secant ไม่ได้ใช้">
          <p style={{margin:0}}>ใบงานสั่งให้วาดทั้งคู่ — <b>ประเด็นคือให้เห็นว่าเส้น secant มีความชันเข้าใกล้ <M>{`f'`}</M> ขึ้นเรื่อย ๆ</b> เมื่อสองจุดขยับเข้าหากัน นั่นคือเหตุผลที่ Secant ทำงานได้โดยไม่ต้อง diff (และเป็นคำตอบสำหรับข้อสอบที่ diff ไม่เป็น)</p>
        </Callout>
        <PythonRunner code={`# การบ้าน 5 ข้อ 3.3 — วาดกราฟ f(x), f'(x) + เส้น secant ของแต่ละรอบ
import numpy as np
import matplotlib.pyplot as plt

f = lambda x: x**2 - 7       # สมการที่เราสร้างเอง: x = √7 → x² − 7 = 0
root = np.sqrt(7)

x = np.linspace(0, 4, 400)
fig, ax = plt.subplots(figsize=(7, 4.5))
ax.plot(x, f(x), color="C0", label="f(x) = x^2 - 7")
ax.plot(x, 2*x,  color="C1", linestyle="--", label="f'(x) = 2x")
ax.axhline(0, color="black", linewidth=0.8)

x0, x1 = 2.0, 3.0
ax.plot([x0, x1], [f(x0), f(x1)], "m.", markersize=10)
ax.annotate(f"x0 = {x0:.1f}", xy=(x0, f(x0)), xytext=(x0-0.35, f(x0)-1.2), color="purple", fontsize=8)
ax.annotate(f"x1 = {x1:.1f}", xy=(x1, f(x1)), xytext=(x1-0.15, f(x1)+0.8), color="purple", fontsize=8)

for k in range(3):
    x2 = x1 - f(x1)*(x1 - x0)/(f(x1) - f(x0))
    m  = (f(x1) - f(x0)) / (x1 - x0)          # ความชันของเส้น secant
    xs = np.array([min(x0, x1, x2) - 0.05, max(x0, x1, x2) + 0.05])
    ax.plot(xs, f(x1) + m*(xs - x1), color="purple", linewidth=1.0, alpha=0.75)
    ax.plot(x2, 0, "m*", markersize=10)
    ax.annotate(f"x{k+2} = {x2:.6f}", xy=(x2, 0), xytext=(0.3, 5.5 - k*1.1),
                color="purple", fontsize=8)
    x0, x1 = x1, x2                            # เลื่อนตัวแปรเหมือนในลูปคำนวณ

ax.plot(root, 0, "ro", zorder=5)
ax.annotate("root = sqrt(7) = 2.645751", xy=(root, 0), xytext=(2.1, -5.4),
            arrowprops=dict(arrowstyle="->", color="red"), color="red", fontsize=9)
ax.set_xlabel("x"); ax.set_ylabel("y"); ax.set_ylim(-8, 10)
ax.set_title("Secant method on f(x) = x^2 - 7  (x0 = 2, x1 = 3)")
ax.grid(alpha=0.3); ax.legend(loc="upper left")
plt.tight_layout()
plt.show()`} height={440}/>

        <h3>Interactive</h3>
        <RootSolver method="secant"/>
      </Sect>

      {/* ============= TAYLOR SERIES ============= */}
      <Sect tag="7" title="Method 7 · Taylor Series (Approximation)">
        <p>Taylor series ใช้<b>ประมาณค่าฟังก์ชัน</b>โดยใช้พหุนาม ที่จุดอ้างอิง <M>{`x_0`}</M></p>

        <Formula label="Taylor expansion around x₀">
          <MB>{`f(x) \\approx \\sum_{k=0}^{n} \\frac{f^{(k)}(x_0)}{k!}\\,(x-x_0)^k = f(x_0) + f'(x_0)(x-x_0) + \\frac{f''(x_0)}{2!}(x-x_0)^2 + \\ldots`}</MB>
        </Formula>

        <Callout kind="tip" title="ที่เกี่ยวกับ Root Finding">
          <p>Newton-Raphson <em>มาจาก</em> Taylor expansion อันดับ 1: <M>{`f(x_{n+1}) \\approx f(x_n) + f'(x_n)(x_{n+1}-x_n) = 0`}</M> → <M>{`x_{n+1} = x_n - f(x_n)/f'(x_n)`}</M></p>
          <p style={{margin:0}}>การประมาณค่าฟังก์ชันแม่นขึ้นเรื่อย ๆ เมื่อ <M>n</M> โต — เป็นรากฐานของทุก numerical method ในวิชานี้</p>
        </Callout>

        <h3>ตัวอย่าง · หา ln 4 จาก x₀ = 2 (ตัวอย่างเดียวกับที่อาจารย์ติว)</h3>

        <Callout kind="warn" title="🎙️ error ของ Taylor ใช้คนละนิยามกับวิธีวนซ้ำ — จุดที่พลาดง่ายมาก">
          <p style={{margin:"0 0 4px"}}>ในเอกสารติวอาจารย์เขียนกรอบไว้ชัด:</p>
          <MB>{`\\varepsilon = \\big|\\,f(x) - f_{\\text{Taylor}}(x)\\,\\big|`}</MB>
          <p style={{margin:0}}>คือ <b>ผลต่างสัมบูรณ์</b> ระหว่างค่าจริงกับค่าที่ประมาณได้ — <b>ไม่ได้หารด้วยอะไร</b> ต่างจาก Bisection/Newton/Secant ที่หารด้วยค่าใหม่. ตัวอย่างที่ติว: <M>{`N=0`}</M> ได้ <M>{`\\varepsilon = |\\ln 4 - \\ln 2| = 0.693147`}</M></p>
          <p style={{margin:"6px 0 0", fontSize:'0.82rem'}}>ตารางข้างล่างใส่ให้ทั้ง 2 คอลัมน์ (<b>|error|</b> = แบบอาจารย์ · <b>error %</b> = เผื่อโจทย์สั่งเป็นเปอร์เซ็นต์) — ตอบตามที่โจทย์ถามเท่านั้น</p>
        </Callout>

        <p>ฟังก์ชัน <M>{`f(x) = \\ln x`}</M> มี derivatives:</p>
        <Formula>
          <MB>{`f(x_0) = \\ln 2, \\quad f'(x) = \\frac{1}{x}, \\quad f''(x) = -\\frac{1}{x^2}, \\quad f'''(x) = \\frac{2}{x^3}`}</MB>
        </Formula>

        <p>ลาก slider เลื่อนค่า <M>n</M> เพื่อดูพหุนาม <M>{`T_n`}</M> เคลื่อนเข้าหา <M>{`\\ln x`}</M> ที่แท้จริง:</p>
        <TaylorViz
          f={x => Math.log(x)}
          derivs={[
            x => Math.log(x),
            x => 1/x,
            x => -1/(x*x),
            x => 2/(x*x*x),
            x => -6/Math.pow(x,4),
            x => 24/Math.pow(x,5),
          ]}
          x0={2}
          xRange={[0.5, 5]}
          trueLabel="f(x) = ln x"
        />

        <NumTable
          headers={["n", "Tₙ(4)", "ค่าจริง ln 4", "|error|", "error %"]}
          rows={[
            [0, 0.693147, 1.386294, 0.693147, 50.00],
            [1, 1.693147, 1.386294, 0.306853, 22.13],
            [2, 1.193147, 1.386294, 0.193147, 13.93],
            [3, 1.526481, 1.386294, 0.140186, 10.11],
            [4, 1.276481, 1.386294, 0.109814, 7.92],
          ]}
        />

        <Callout kind="warn" title="ลู่ช้าเพราะ |x − x₀| ใหญ่">
          <p>รัศมีลู่เข้าของ <M>{`\\ln(x)`}</M> ที่ <M>{`x_0=2`}</M> คือ <M>{`|x-2|<2`}</M> — ที่ <M>{`x=4`}</M> เราอยู่ขอบเขตพอดี ลู่ช้ามาก</p>
          <p style={{margin:0}}>วิธีแก้: เลือก <M>{`x_0`}</M> ใกล้กับ <M>x</M> มากขึ้น</p>
        </Callout>

        <h3>Python — Taylor พร้อม error per order</h3>
        <PythonRunner code={`import math

def taylor_ln(x, x0, n):
    """ln(x) ≈ Σ f^(k)(x0)/k! · (x-x0)^k จาก k=0 ถึง n"""
    # derivatives of ln at x0: f^(k)(x0) = (-1)^(k-1)·(k-1)!/x0^k  (k>=1)
    dx = x - x0
    s = math.log(x0)              # k=0 term
    for k in range(1, n+1):
        # (-1)^(k-1) * (k-1)! / x0^k
        deriv = ((-1)**(k-1)) * math.factorial(k-1) / (x0**k)
        s += deriv * (dx**k) / math.factorial(k)
    return s

true_val = math.log(4)
print(f"True ln(4) = {true_val:.6f}\\n")
print(f"{'n':>2} {'Tn(4)':>12} {'error':>12} {'error %':>10}")
for n in range(0, 6):
    approx = taylor_ln(4, 2, n)
    err = abs(approx - true_val)
    print(f"{n:2d} {approx:12.6f} {err:12.6f} {100*err/true_val:9.3f}%")`} height={240}/>

        <Callout kind="good" title="ทริค · Taylor remainder = error bound">
          <p>Error ของ Tₙ(x) เขียนได้:</p>
          <MB>{`R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x-x_0)^{n+1}, \\quad \\xi \\in (x_0, x)`}</MB>
          <p style={{margin:0}}>ใช้หา upper bound ของ error โดยแทน <M>\xi</M> ที่ทำให้ <M>{`|f^{(n+1)}(\\xi)|`}</M> มากสุดในช่วง</p>
        </Callout>

        <Callout kind="tip" title="fx-991CW · เก็บ derivatives ใน A–D แล้วประกอบสูตร">
          <p>วิธีเร็วในห้องสอบ — สำหรับ Taylor n=3 รอบ <M>{`x_0`}</M>:</p>
          <CalcSteps steps={[
            <span>คำนวณ <M>{`f(x_0)`}</M> → <Key>STO</Key> <Key>A</Key></span>,
            <span>คำนวณ <M>{`f'(x_0)`}</M> (ใช้ <code>d/dx</code> ในเครื่อง) → <Key>STO</Key> <Key>B</Key></span>,
            <span>คำนวณ <M>{`f''(x_0)`}</M> (ทำ d/dx ของ d/dx หรือคำนวณด้วยสูตรเอง) → <Key>STO</Key> <Key>C</Key></span>,
            <span>คำนวณ <M>{`f'''(x_0)`}</M> → <Key>STO</Key> <Key>D</Key></span>,
            <span>ประกอบสูตร: <code>A + B(X−x₀) + C÷2·(X−x₀)² + D÷6·(X−x₀)³</code></span>,
            <span>กำหนด <Key>X</Key> = ค่า x ที่อยากหา → กด <Key>=</Key> → ได้ T₃(x) ทันที</span>,
          ]}/>
          <p style={{margin:"8px 0 4px"}}><b>ตัวอย่างกับ <M>{`f(x) = \\ln x`}</M>, <M>{`x_0 = 2`}</M>:</b></p>
          <NumTable
            headers={["ตัวแปร", "ค่า", "วิธีคิด"]}
            rows={[
              ["A = f(2)",     "ln 2 ≈ 0.6931",  "พิมพ์ ln(2)"],
              ["B = f'(2)",    "1/2 = 0.5",      "f'(x) = 1/x"],
              ["C = f''(2)",   "-1/4 = -0.25",   "f''(x) = -1/x²"],
              ["D = f'''(2)",  "2/8 = 0.25",     "f'''(x) = 2/x³"],
            ]}
          />
          <p style={{margin:"8px 0 0"}}>ที่ <M>x = 4</M>, <M>{`(x - x_0) = 2`}</M>:</p>
          <MB>{`T_3(4) = 0.6931 + 0.5(2) + \\tfrac{-0.25}{2}(4) + \\tfrac{0.25}{6}(8) = 0.6931 + 1 - 0.5 + 0.3333 \\approx 1.5264`}</MB>
          <p style={{margin:"4px 0 0", fontSize:'0.778rem'}}>(เทียบ <M>{`\\ln 4 \\approx 1.3863`}</M> — error ~10% เพราะ <M>{`|x-x_0|=2`}</M> ใหญ่ ใกล้รัศมีลู่เข้า)</p>
          <p style={{margin:"6px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>⚠ เครื่องคิดเลข fx-991CW ทำ d/dx ได้ลำดับเดียว (Central diff) — สำหรับ <M>f''</M> ขึ้นไปต้องคำนวณสูตรเอง หรือใช้ <code>d/dx(d/dx(f(x))|x=x₀)|x=x₀</code> ซ้อนกัน (ช้ากว่า แต่ทำได้)</p>
        </Callout>
      </Sect>

      {/* ============= โจทย์ประยุกต์ ============= */}
      <Sect tag="🏗️" title="โจทย์ประยุกต์ — แบบที่ข้อสอบชอบออก">
        <Callout kind="warn" title="ขั้นที่ยากที่สุดคือขั้นแรก">
          <p style={{margin:0}}>การบ้านให้ <M>{`f(x)`}</M> มาแล้ว แต่<b>ข้อสอบเล่าเป็นสถานการณ์</b> — สิ่งที่ต้องทำเป็นอย่างแรกเสมอคือ <b>ย้ายทุกอย่างไปข้างเดียวให้เหลือ <M>{`f(x)=0`}</M></b> แล้วสแกนหาช่วงที่คร่อมราก · 2 ข้อนี้มีทั้งส่วนทำมือและส่วนโปรแกรม ตามสัดส่วนข้อสอบจริงที่อาจารย์บอกว่า “มีโค้ดครึ่งหนึ่ง มีคำนวณครึ่งหนึ่ง”</p>
        </Callout>

        <Problem label="ประยุกต์ 1 · ถังทรงกระบอกวางนอน (ทำมือ + โปรแกรม)" solution={
          <div>
            <p style={{marginTop:0}}><b>ขั้นที่ 1 — ตั้งสมการ</b> (ขั้นนี้คือหัวใจ อย่าข้าม)</p>
            <Formula>
              <MB>{`f(h)=L\\left[R^2\\cos^{-1}\\!\\left(\\frac{R-h}{R}\\right)-(R-h)\\sqrt{2Rh-h^2}\\right]-15=0`}</MB>
            </Formula>
            <p>แทน <M>{`R=1.5,\\ L=6`}</M> ⇒ เหลือ <M>h</M> ตัวเดียว</p>
            <Callout kind="danger" title="⚠︎ 2 กับดักของข้อนี้">
              <ul style={{margin:0, paddingLeft:18}}>
                <li><M>{`\\cos^{-1}`}</M> ต้องอ่านผลเป็น <b>เรเดียน</b> — ตั้งเครื่องเป็น Deg แล้วพื้นที่จะผิดทั้งหมด</li>
                <li>โดเมน: ต้องมี <M>{`0\\le h\\le 2R=3`}</M> ไม่งั้น <M>{`\\sqrt{2Rh-h^2}`}</M> ติดลบ → Math ERROR ⇒ <b>เลือกช่วงเริ่มให้อยู่ในนี้</b></li>
              </ul>
            </Callout>
            <p><b>ขั้นที่ 2 — สแกนหาช่วง</b></p>
            <NumTable
              headers={["h (m)", "0.5", "1.0", "1.5", "2.0", "2.5"]}
              rows={[["f(h)", "−10.353777", "−2.624689", "+6.205750", "+15.036189", "+22.765278"]]}
            />
            <p>เครื่องหมายเปลี่ยนระหว่าง <M>{`h=1.0`}</M> กับ <M>{`h=1.5`}</M> · ใช้ช่วง <M>{`[0.5,\\,2.5]`}</M></p>
            <p><b>ขั้นที่ 3 — Bisection 4 รอบ</b> (รอบ 0 ทำทิ้ง ตามกติกาอาจารย์)</p>
            <NumTable
              headers={["รอบ", "hₗ", "hᵣ", "hₘ", "f(hₘ)", "การตัดสินใจ", "ε"]}
              rows={[
                ["0", "0.500000", "2.500000", "1.500000", "+6.205750", "f(hₗ)·f(hₘ) < 0 → hᵣ←hₘ", "— (ทำทิ้ง)"],
                ["1", "0.500000", "1.500000", "1.000000", "−2.624689", "f(hₗ)·f(hₘ) > 0 → hₗ←hₘ", "50.0000%"],
                ["2", "1.000000", "1.500000", "1.250000", "+1.726671", "f(hₗ)·f(hₘ) < 0 → hᵣ←hₘ", "20.0000%"],
                ["3", "1.000000", "1.250000", "1.125000", "−0.473263", "f(hₗ)·f(hₘ) > 0 → hₗ←hₘ", "11.1111%"],
                ["4", "1.125000", "1.250000", "1.187500", "+0.621710", "f(hₗ)·f(hₘ) < 0 → hᵣ←hₘ", "5.2632%"],
              ]}
            />
            <Callout kind="good" title="ประโยคสรุป">
              <p style={{margin:0}}>หลัง 4 รอบได้ <b>h ≈ 1.1875 m</b> · ค่าที่ลู่เข้าจริงคือ <b>1.1520911 m</b> — ยังห่างอยู่ 3% เพราะ Bisection หดช่วงทีละครึ่งเท่านั้น ถ้าโจทย์ต้องการความแม่นกว่านี้ต้องเพิ่มรอบหรือเปลี่ยนไปใช้ Newton</p>
            </Callout>
            <PythonRunner code={`import math
R, L, Vtar = 1.5, 6.0, 15.0

def V(h):
    return L*(R*R*math.acos((R-h)/R) - (R-h)*math.sqrt(2*R*h - h*h))

f = lambda h: V(h) - Vtar

print("สแกนหาช่วง:")
for h in [0.5, 1.0, 1.5, 2.0, 2.5]:
    print(f"  f({h}) = {f(h):+.6f}")

print("\\nBisection [0.5, 2.5]  (รอบ 0 ทำทิ้ง):")
a, b, prev = 0.5, 2.5, None
for i in range(5):
    m = (a + b)/2
    eps = "—" if prev is None else f"{abs((m-prev)/m)*100:.4f}%"
    print(f"  รอบ {i}: hl={a:.6f} hr={b:.6f} hm={m:.6f} f={f(m):+.6f} eps={eps}")
    if f(a)*f(m) > 0: a = m
    else: b = m
    prev = m

# เดินต่อจนนิ่ง — เงื่อนไขหยุดแบบ absolute ตามที่อาจารย์สอน
a, b, prev, k = 0.5, 2.5, None, 0
while True:
    m = (a + b)/2; k += 1
    if prev is not None and abs(m - prev) < 0.001: break
    if f(a)*f(m) > 0: a = m
    else: b = m
    prev = m
print(f"\\nหยุดเมื่อ |dh| < 0.001 ที่รอบ {k}: h = {m:.7f} m")`} height={340}/>
          </div>
        }>
          ถังน้ำ<b>ทรงกระบอกวางนอน</b> รัศมี <M>{`R=1.5`}</M> เมตร ยาว <M>{`L=6`}</M> เมตร ปริมาตรน้ำที่ระดับความลึก <M>h</M> คือ
          <MB>{`V=L\\left[R^2\\cos^{-1}\\!\\left(\\frac{R-h}{R}\\right)-(R-h)\\sqrt{2Rh-h^2}\\right]`}</MB>
          จงหาความลึกที่ทำให้มีน้ำ 15 ลูกบาศก์เมตร โดย <b>(ก)</b> ตั้งเป็น <M>{`f(h)=0`}</M> และสแกนหาช่วง <b>(ข)</b> Bisection 4 รอบ <b>(ค)</b> เขียนโปรแกรมที่หยุดเมื่อ <M>{`|\\Delta h|<0.001`}</M>
        </Problem>

        <Problem label="ประยุกต์ 2 · หาอัตราดอกเบี้ย (โจทย์ที่ diff ยาก → ใช้ Secant)" solution={
          <div>
            <p style={{marginTop:0}}><b>ขั้นที่ 1 — ตั้งสมการ</b></p>
            <Formula>
              <MB>{`f(i)=\\frac{P\\,i\\,(1+i)^n}{(1+i)^n-1}-A=0,\\qquad P=100000,\\ n=24,\\ A=5000`}</MB>
            </Formula>
            <Callout kind="good" title="💡 จุดที่ข้อนี้สอน — diff ยากมาก แล้วทำยังไง">
              <p style={{margin:"0 0 4px"}}>อนุพันธ์ของ <M>{`f(i)`}</M> ต้องใช้กฎผลหารซ้อนกฎผลคูณ ยาวมากและพลาดง่าย ⇒ มี <b>2 ทางออกที่ถูกต้องทั้งคู่</b>:</p>
              <ul style={{margin:0, paddingLeft:18}}>
                <li><b>ใช้ Secant</b> — ไม่ต้อง diff เลย ใช้แค่ค่า <M>{`f`}</M> สองจุด (อาจารย์เขียนไว้เองว่า Secant มีไว้แก้ปัญหา “diff ไม่เป็น”)</li>
                <li><b>ใช้ Newton ที่หา <M>{`f'`}</M> ด้วยวิธีเชิงตัวเลข</b>: <M>{`f'(i)\\approx\\frac{f(i+h)-f(i-h)}{2h}`}</M> ด้วย <M>{`h`}</M> เล็ก ๆ — นี่คือการเอาบท Differentiation มาช่วยบท Root Finding</li>
              </ul>
            </Callout>
            <p><b>ขั้นที่ 2 — สแกน</b></p>
            <NumTable
              headers={["i (ต่อเดือน)", "0.005", "0.01", "0.02", "0.03"]}
              rows={[["f(i)", "−567.938975", "−292.652778", "+287.109725", "+904.741595"]]}
            />
            <p>เครื่องหมายเปลี่ยนระหว่าง <M>{`i=0.01`}</M> กับ <M>{`i=0.02`}</M></p>
            <p><b>ขั้นที่ 3 — Newton (อนุพันธ์เชิงตัวเลข) จาก <M>{`i_0=0.02`}</M></b></p>
            <NumTable
              headers={["รอบ", "iᵢ", "iᵢ₊₁", "|Δi|", "หยุดหรือยัง (tol = 0.001)"]}
              rows={[
                ["1", "0.02000000", "0.01520629", "4.79×10⁻³", "ยัง"],
                ["2", "0.01520629", "0.01513086", "7.54×10⁻⁵", "หยุด ✓"],
                ["3", "0.01513086", "0.01513084", "1.89×10⁻⁸", "(เดินต่อเพื่อดูความแม่น)"],
              ]}
            />
            <Callout kind="good" title="ประโยคตอบ">
              <p style={{margin:0}}>∴ อัตราดอกเบี้ย <M>{`i \\approx 0.0151308`}</M> ต่อเดือน = <b>1.5131% ต่อเดือน</b> (ราว 18.16% ต่อปี) · <b>ตอบเป็นทศนิยม ห้ามเศษส่วน</b></p>
            </Callout>
            <PythonRunner code={`P, n, A = 100000.0, 24, 5000.0
f = lambda i: P*i*(1+i)**n / ((1+i)**n - 1) - A

print("สแกนหาช่วง:")
for i in [0.005, 0.01, 0.02, 0.03]:
    print(f"  f({i}) = {f(i):+.6f}")

# --- Newton โดยหา f' ด้วยวิธีเชิงตัวเลข (central difference) ---
def fprime(f, x, h=1e-7):
    return (f(x + h) - f(x - h)) / (2*h)

print("\\nNewton (อนุพันธ์เชิงตัวเลข) จาก i0 = 0.02, tol = 0.001:")
x, tol = 0.02, 0.001                       # ① Initial Value
for k in range(50):
    xn = x - f(x)/fprime(f, x)             # ② Iteration Form
    print(f"  รอบ {k+1}: i={x:.8f} -> {xn:.8f}  |di|={abs(xn-x):.2e}")
    if abs(xn - x) < tol:                  # ③ เงื่อนไขหยุด (absolute)
        x = xn; break
    x = xn

# --- Secant: ได้คำตอบเดียวกันโดยไม่ต้องมี f' เลย ---
x0, x1 = 0.01, 0.02
for k in range(50):
    x2 = x1 - f(x1)*(x0 - x1)/(f(x0) - f(x1))
    if abs(x2 - x1) < 1e-12: break
    x0, x1 = x1, x2

print(f"\\nNewton  -> i = {x:.8f}  = {x*100:.5f}% ต่อเดือน")
print(f"Secant  -> i = {x2:.8f}  = {x2*100:.5f}% ต่อเดือน")`} height={360}/>
          </div>
        }>
          กู้เงิน <M>{`P=100{,}000`}</M> บาท ผ่อน <M>{`n=24`}</M> งวด งวดละ <M>{`A=5{,}000`}</M> บาท โดยความสัมพันธ์คือ
          <MB>{`A=\\frac{P\\,i\\,(1+i)^n}{(1+i)^n-1}`}</MB>
          จงหา<b>อัตราดอกเบี้ยต่อเดือน <M>i</M></b> · สังเกตว่า <M>{`f'(i)`}</M> หาด้วยมือยากมาก — จงอธิบายว่ามีทางเลือกอะไรบ้าง แล้วเขียนโปรแกรมหาคำตอบ (หยุดเมื่อ <M>{`|\\Delta i|<0.001`}</M>)
        </Problem>
      </Sect>

      {/* ============= QUICK REF ============= */}
      <Sect tag="∑" title="Quick Reference · เปรียบเทียบทุก method">
        <NumTable
          headers={["Method", "ต้องการ", "Convergence", "เร็ว", "เสี่ยงพัง"]}
          rows={[
            ["Graphical", "ช่วง [a,b]", "—", "ช้ามาก", "ไม่เคยพัง"],
            ["Bisection", "f(a)f(b)<0", "Linear", "ช้า", "ไม่พัง"],
            ["False Position", "f(a)f(b)<0", "Super-linear", "ปานกลาง", "ติดข้างเดียว"],
            ["One-point", "x = g(x)", "Linear (ถ้า |g'|<1)", "ขึ้นกับ g", "ลู่ออกได้ถ้า g ผิด"],
            ["Newton", "x₀ + f'(x)", "Quadratic", "เร็วมาก", "พังถ้า f'=0"],
            ["Secant", "x₀, x₁", "Super-linear (~1.618)", "เร็ว", "ลู่ออกได้"],
          ]}
        />

        <Callout kind="tip" title="วิธีจำ — เลือก method ในข้อสอบ">
          <ul>
            <li>โจทย์ให้ "ช่วง [a, b]" → Bisection หรือ False Position</li>
            <li>โจทย์ให้ "x₀" จุดเดียว + รู้ f'(x) → Newton</li>
            <li>โจทย์ให้ "x₀, x₁" 2 จุด → Secant</li>
            <li>โจทย์ให้ "x = g(x)" หรือบอก "fixed-point" → One-point</li>
            <li>โจทย์ให้ "scan ทีละ ..." → Graphical</li>
          </ul>
        </Callout>
      </Sect>

      {/* ============= MOCK EXAM ============= */}
      <Sect tag="✸" title="ข้อสอบจำลอง · ระดับ Final">
        <Problem label="ข้อ 1 · 12 คะแนน" solution={
          <div>
            <p><b>1.1</b> ใช้ Bisection ในช่วง <M>{`[2, 3]`}</M> 4 รอบ:</p>
            <NumTable
              headers={["i", "a", "b", "m", "f(m)", "decision"]}
              rows={[
                [1, 2.0000, 3.0000, 2.5000, -0.6065, "a←m"],
                [2, 2.5000, 3.0000, 2.7500, 5.5872, "b←m"],
                [3, 2.5000, 2.7500, 2.6250, 2.0703, "b←m"],
                [4, 2.5000, 2.6250, 2.5625, 0.6519, "b←m"],
              ]}
            />
            <p>คำตอบหลัง 4 รอบ: <M>{`x_m \\approx 2.5625`}</M></p>
            <p><b>1.2</b> Newton-Raphson ที่ <M>{`x_0 = 3.0`}</M>:</p>
            <p><M>{`f(x) = e^x \\ln x - 50, \\quad f'(x) = e^x \\ln x + \\frac{e^x}{x}`}</M></p>
            <p>หลัง 3 iter จะได้ <M>{`x \\approx 2.5395`}</M></p>
          </div>
        }>
          <p>กำหนด <M>{`f(x) = e^x \\ln x - 50 = 0`}</M></p>
          <p><b>1.1</b> ใช้วิธี <b>Bisection</b> ในช่วง <M>{`[2, 3]`}</M> 4 iterations แสดงตารางและสรุปคำตอบ</p>
          <p><b>1.2</b> ใช้วิธี <b>Newton-Raphson</b> เริ่มที่ <M>{`x_0 = 3.0`}</M> 3 iterations</p>
          <p><b>1.3</b> เขียน pseudo-code สำหรับวิธี <b>Secant</b> ที่หยุดเมื่อ <M>{`|\\varepsilon_a| < 10^{-6}`}</M></p>
        </Problem>

        <Problem label="ข้อ 2 · พิสูจน์" solution={
          <div>
            <p>เส้นตรงผ่าน <M>{`(x_l, f_l)`}</M> และ <M>{`(x_r, f_r)`}</M>:</p>
            <MB>{`y = f_r + \\frac{f_l - f_r}{x_l - x_r}(x - x_r)`}</MB>
            <p>ตั้ง y = 0 หา x ที่ตัดแกน:</p>
            <MB>{`x = x_r - \\frac{f_r(x_l - x_r)}{f_l - f_r}`}</MB>
            <p>หรือเขียนรูปสมมาตร:</p>
            <MB>{`x = \\frac{x_l f_r - x_r f_l}{f_r - f_l}`}</MB>
          </div>
        }>
          จงพิสูจน์สูตร False Position <M>{`x_m = x_r - \\dfrac{f(x_r)(x_l - x_r)}{f(x_l) - f(x_r)}`}</M> โดยอาศัยรูปทรงเรขาคณิตของเส้นตรงผ่าน 2 จุดที่ตัดแกน x
        </Problem>

        <Problem label="ข้อ 3 · เขียนโปรแกรม (10 คะแนน)" solution={
          <PythonRunner code={`def nth_root(x, n, xl, xr, tol=1e-6):
    """หา n√x โดยใช้ Bisection — f(t) = t^n - x"""
    f = lambda t: t**n - x
    if f(xl) * f(xr) > 0:
        return None
    prev = None
    for i in range(200):
        m = (xl + xr) / 2
        if prev is not None and abs(m - prev) < tol:
            return m
        if f(xl) * f(m) < 0:
            xr = m
        else:
            xl = m
        prev = m
    return m

# ทดสอบ
print(f"{nth_root(38, 2, 0, 100):.4f}")     # 6.1644
print(f"{nth_root(1265256, 12, 0, 1000):.4f}")  # 3.2249`} height={220}/>
        }>
          เขียนโปรแกรม Python: หา n-th root ของจำนวนเต็ม x โดยใช้ Bisection<br/>
          Input: บรรทัด 1 = x n เว้นด้วยช่องว่าง, บรรทัด 2 = xₗ xᵣ<br/>
          Output: คำตอบทศนิยม 4 ตำแหน่ง<br/>
          <span className="muted">(โจทย์จริงจาก root1.pdf ข้อ 3)</span>
        </Problem>
      </Sect>

      <Callout kind="good" title="✓ บทนี้จบแล้ว — บทถัดไป">
        <p>ไป <a href="#linear">Linear Systems → Gauss & Iteration</a> เพื่อเรียนวิธีแก้ระบบสมการเชิงเส้น Ax = b</p>
      </Callout>
    </div>
  );
}

window.RootFindingLesson = RootFindingLesson;
window.HandWalkthrough = HandWalkthrough;
