// Root Finding — Bisection, False Position, One-point, Newton, Secant, Graphical

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

        <h3 style={{marginTop:24}}>โปรแกรมตรงสเปคชีท · root1.pdf ข้อ 1 (43x − 180 = 0)</h3>
        <Callout title="โจทย์ของอาจารย์เป๊ะ (ออกซ้ำใน midterm)">
          <p>หา root ของ <b>43x − 180 = 0</b> ในช่วง <M>{`0 \\le x \\le 10`}</M></p>
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>Phase 1:</b> scan ทีละ 1 → หาช่วงที่ <M>{`f(x_i)\\cdot f(x_{i+1}) < 0`}</M></li>
            <li><b>Phase 2:</b> scan ทีละ 0.000001 ในช่วงนั้น → หา x ที่ <M>{`|f(x)|`}</M> น้อยที่สุด</li>
            <li>คำตอบที่ควรได้: <M>{`x = 180/43 \\approx 4.186047`}</M></li>
          </ul>
          <p style={{margin:"6px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>⚠ เป็นโจทย์ที่ <b>ชีท root1.pdf บังคับ</b> — Phase 2 จะวน ~186,000 รอบ (รอ ~2 วินาที)</p>
        </Callout>
        <PythonRunner code={`# โจทย์ root1.pdf ข้อ 1 — Modified Graphical Method
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

        <h3>ตัวอย่างทำมือ — หา <M>{`\\sqrt[4]{13}`}</M> · แบบละเอียดยิบ</h3>
        <p>โจทย์จริงจาก root1.pdf: หา <M>{`\\sqrt[4]{13}`}</M> โดยใช้ Bisection ในช่วง <M>{`[1.5, 2.0]`}</M></p>

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
f(xm₁) = (1.75)⁴ − 13 = 9.3789 − 13 = −3.6211  (ลบ)
f(a)·f(m) = (−7.9375)(−3.6211) = +28.74 > 0  → ราก<b>ไม่</b>อยู่ซ้าย → a ← m
ดังนั้น: a = 1.75, b = 2.0`,
            calc: "(1.5 + 2) ÷ 2 = → STO C   |   C^4 − 13 = (ดูเครื่องหมาย ลบ) → C → STO A" },
          { title: "Iteration 2",
            body: `xm₂ = (1.75 + 2.0) / 2 = 1.875
f(xm₂) = (1.875)⁴ − 13 = 12.3596 − 13 = −0.6404  (ลบ)
f(a)·f(m) = (−3.6211)(−0.6404) = +2.32 > 0  → a ← m
a = 1.875, b = 2.0`,
            calc: "(A + B) ÷ 2 = → STO C   |   C^4 − 13 =  ลบ → C → STO A" },
          { title: "Iteration 3",
            body: `xm₃ = (1.875 + 2.0) / 2 = 1.9375
f(xm₃) = (1.9375)⁴ − 13 = 14.0991 − 13 = +1.0991  (บวก)
f(a)·f(m) = (−0.6404)(1.0991) = −0.704 < 0  → ราก<b>อยู่ซ้าย</b> → b ← m
a = 1.875, b = 1.9375`,
            calc: "(A + B) ÷ 2 = → STO C   |   C^4 − 13 = บวก → C → STO B" },
          { title: "Iteration 4 + คำนวณ error",
            body: `xm₄ = (1.875 + 1.9375) / 2 = 1.90625
f(xm₄) = (1.90625)⁴ − 13 = 13.2056 − 13 = +0.2056  (บวก)
b ← m → a = 1.875, b = 1.90625
εₐ = |xm₄ − xm₃| / |xm₄| = |1.90625 − 1.9375| / 1.90625 = 0.03125 / 1.90625 ≈ 0.0164 = 1.64%`,
            calc: "(C − D) ÷ C · 100 =  (โดย D คือ xm รอบก่อน)" },
          { title: "สรุป",
            body: `หลัง 4 iterations: ⁴√13 ≈ 1.90625  (ค่าจริง = 1.898829...)
ถ้าต้องการแม่นทศนิยม 6 ตำแหน่ง ต้อง iterate ต่อจนกว่า εₐ < 10⁻⁶ ≈ ~20 รอบ` },
        ]}/>
        <Callout title="แปลงโจทย์เป็น f(x) = 0">
          ถ้า <M>{`x = \\sqrt[4]{13}`}</M> แล้ว <M>{`x^4 = 13`}</M> ดังนั้น <M>{`f(x) = x^4 - 13 = 0`}</M>
        </Callout>

        <NumTable
          headers={["i", "xₗ", "xᵣ", "xₘ", "f(xₘ)", "การตัดสินใจ"]}
          rows={[
            [1, 1.500000, 2.000000, 1.750000, -3.6211, "f(a)·f(m)<0 → b←m"],
            [2, 1.500000, 1.750000, 1.625000, -6.0273, "f(a)·f(m)>0 → a←m"],
            [3, 1.625000, 1.750000, 1.687500, -4.9501, "f(a)·f(m)>0 → a←m"],
            [4, 1.687500, 1.750000, 1.718750, -4.3499, "f(a)·f(m)>0 → a←m"],
          ]}
        />
        <p>หลัง 4 iterations: <M>{`x \\approx 1.71875`}</M>, คำตอบจริง = <M>{`1.898829\\ldots`}</M> (ยังต้อง iterate ต่ออีกหลายรอบ)</p>

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

        <h3>Python code (Bisection จนทศนิยม 6 ตำแหน่งไม่เปลี่ยน)</h3>
        <PythonRunner code={`def bisection(f, a, b, tol=1e-6, max_iter=100):
    if f(a) * f(b) > 0:
        return None, []
    table = []
    prev = None
    for i in range(max_iter):
        m = (a + b) / 2
        fm = f(m)
        err = None if prev is None else abs((m - prev) / m)
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

print(f"{'i':>3} {'a':>10} {'b':>10} {'m':>10} {'f(m)':>10} {'ε_a':>10}")
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

        <h3 style={{marginTop:24}}>โปรแกรมที่อาจารย์ขอ — โจทย์ root1.pdf ข้อ 3</h3>
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
          <p style={{margin:"8px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>⚠ โจทย์โปรแกรมที่ <b>ชีท root1.pdf บังคับ</b> — แนวสอบยอดนิยม</p>
        </Callout>
        <PythonRunner code={`# โจทย์ root1.pdf ข้อ 3 — ถอดรากที่ n ด้วย Bisection
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

        <Formula label="สูตร False Position">
          <MB>{`x_m = x_r - \\frac{f(x_r)\\cdot(x_l - x_r)}{f(x_l) - f(x_r)}`}</MB>
          <p className="muted" style={{margin:"6px 0 0", fontSize:'0.75rem'}}>มาจากการเขียนสมการเส้นตรงผ่าน 2 จุด แล้วให้ y = 0</p>
        </Formula>

        <Callout title="พิสูจน์สูตร (ที่ออกในข้อสอบจริง)">
          <p>เส้นตรงผ่าน 2 จุด: <M>{`(x_l, f_l)`}</M> และ <M>{`(x_r, f_r)`}</M></p>
          <MB>{`y - f_r = \\frac{f_l - f_r}{x_l - x_r}(x - x_r)`}</MB>
          <p>ให้ <M>{`y = 0`}</M> เพราะอยากได้จุดตัดแกน x:</p>
          <MB>{`-f_r = \\frac{f_l - f_r}{x_l - x_r}(x_m - x_r)`}</MB>
          <MB>{`x_m - x_r = \\frac{-f_r(x_l - x_r)}{f_l - f_r}`}</MB>
          <MB>{`\\boxed{\\; x_m = x_r - \\frac{f_r(x_l - x_r)}{f_l - f_r} \\;}`}</MB>
        </Callout>

        <h3>ทำเหมือน Bisection ที่เหลือ</h3>
        <p>ตัดสินใจเหมือนกัน: ถ้า <M>{`f(x_l)\\cdot f(x_m) < 0`}</M> → <M>{`x_r \\leftarrow x_m`}</M>, ไม่งั้น <M>{`x_l \\leftarrow x_m`}</M></p>

        <PythonRunner code={`def false_position(f, a, b, tol=1e-6, max_iter=100):
    if f(a) * f(b) > 0: return None
    prev = None
    for i in range(max_iter):
        fa, fb = f(a), f(b)
        m = b - fb*(a - b)/(fa - fb)
        fm = f(m)
        err = None if prev is None else abs((m - prev)/m)
        print(f"i={i+1:2d}  a={a:.6f}  b={b:.6f}  m={m:.6f}  f(m)={fm:+.4e}  err={err}")
        if err is not None and err < tol: return m
        if fa * fm < 0: b = m
        else: a = m
        prev = m

# โจทย์: หา 4√13
f = lambda x: x**4 - 13
ans = false_position(f, 1.5, 2.0)
print(f"\\n4√13 ≈ {ans:.6f}")`} height={240}/>

        <Callout kind="warn" title="ระวัง · False Position ไม่ได้เร็วกว่า Bisection เสมอ">
          ถ้าฟังก์ชันโค้งมาก ๆ ปลายข้างหนึ่งจะ "ติด" อยู่นาน — error จะลดช้า (one-sided convergence)
          อาจารย์ชอบออกโจทย์ให้พิสูจน์ที่มา ดังนั้นจำสูตรพร้อมเข้าใจที่มา
        </Callout>

        <h3>Animation · ดูเส้น chord ตัดแกน x</h3>
        <FalsePosViz fn={fEx} a0={1} b0={2}/>

        <h3>Interactive</h3>
        <RootSolver method="falsepos"/>

        <h3 style={{marginTop:24}}>โปรแกรมที่อาจารย์ขอ — โจทย์ root1.pdf ข้อ 6</h3>
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
          <p style={{margin:"8px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>⚠ โจทย์โปรแกรมที่ <b>ชีท root1.pdf บังคับ</b> — แนวสอบยอดนิยม (คู่กับ Bisection)</p>
        </Callout>
        <PythonRunner code={`# โจทย์ root1.pdf ข้อ 6 — ถอดรากที่ n ด้วย False Position
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

        <h3>ตัวอย่าง · หา <M>{`\\sqrt{7}`}</M></h3>
        <p>เริ่มจาก <M>{`x^2 = 7`}</M> เราจัดได้หลายแบบ:</p>
        <div className="grid-3">
          <div className="card tight"><h4 style={{margin:"0 0 4px"}}>รูป A</h4><M>{`x = 7/x`}</M> <span className="tag" style={{marginLeft:6}}>วน loop ไม่ลู่</span></div>
          <div className="card tight"><h4 style={{margin:"0 0 4px"}}>รูป B</h4><M>{`x = \\sqrt{7}`}</M> <span className="tag" style={{marginLeft:6}}>ไม่นับ</span></div>
          <div className="card tight"><h4 style={{margin:"0 0 4px"}}>รูป C</h4><M>{`x = \\tfrac{1}{2}(x + 7/x)`}</M> <span className="tag green" style={{marginLeft:6}}>ลู่เร็วสุด</span></div>
        </div>

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

        <h3>Animation · Cobweb diagram</h3>
        <p>เส้นทาง <M>{`x_0 \\to g(x_0) \\to x_1 = g(x_0) \\to g(x_1)`}</M> เห็นเป็น "แมงมุมไต่ใย" สลับแนวตั้ง-แนวนอนระหว่างเส้น <M>{`y=g(x)`}</M> กับเส้น <M>{`y=x`}</M></p>
        <CobwebViz g={x => 0.5*(x + 7/x)} x0={5} exprText="g(x) = 0.5(x + 7/x)"/>

        <h3>Interactive · ทดลองรูป g(x) ต่าง ๆ</h3>
        <RootSolver method="onepoint"/>

        <h3>โจทย์ทำมือ — Taylor Series</h3>
        <Problem
          label="โจทย์ root2.pdf · ข้อ 2"
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
            body: `f(2.75) = 7.5625 − 7 = 0.5625
f'(2.75) = 5.5
x₂ = 2.75 − 0.5625/5.5 = 2.75 − 0.1023 = 2.6477
εₐ = |2.6477 − 2.75| / 2.6477 = 0.1023/2.6477 ≈ 3.86%`,
            calc: "กดลูกศรขึ้น (↑) เพื่อเรียกสูตรเดิม → = (จะใช้ค่า x ใหม่ที่เก็บไว้)" },
          { title: "Iteration 3",
            body: `f(2.6477) = 7.0103 − 7 = 0.0103
f'(2.6477) = 5.2954
x₃ = 2.6477 − 0.0103/5.2954 = 2.6477 − 0.00195 = 2.6458
εₐ ≈ 0.074%`,
            calc: "↑ = ซ้ำ (ตอนนี้ x = 2.6477 อยู่แล้ว)" },
          { title: "Iteration 4",
            body: `f(2.6458) ≈ 0.0000038
f'(2.6458) = 5.2916
x₄ = 2.6458 − 0.0000038/5.2916 = 2.6457513
εₐ ≈ 0.00003%  ✓ หยุดได้`,
            calc: "↑ = → ดูว่าค่าไม่เปลี่ยนใน 6 ทศนิยมแล้ว = stop" },
          { title: "สรุป + เปรียบเทียบ",
            body: `√7 ≈ 2.6457513  (ค่าจริง = 2.6457513110...)
สังเกต quadratic convergence: error ลด ~ยกกำลัง 2 ทุกรอบ
27% → 3.86% → 0.074% → 0.00003%
Newton ใช้ 4 iter ได้ความแม่น 6 ทศนิยม — Bisection ต้องการ ~20 iter!` },
        ]}/>

        <h3>ตัวอย่างทำมือ — root3.pdf</h3>
        <Problem label="โจทย์ root3.pdf · ข้อ 1" solution={
          <div>
            <p><M>{`f(x) = x^2 - 7, f'(x) = 2x`}</M></p>
            <NumTable
              headers={["i", "xᵢ", "f(xᵢ)", "f'(xᵢ)", "xᵢ₊₁", "εₐ %"]}
              rows={[
                [1, 2.0000000, -3.000000, 4.000000, 2.7500000, 27.273],
                [2, 2.7500000, 0.562500, 5.500000, 2.6477273, 3.863],
                [3, 2.6477273, 0.010422, 5.295455, 2.6457603, 0.0743],
                [4, 2.6457603, 0.0000038, 5.291521, 2.6457513, 0.000028],
              ]}
            />
            <p>4 iterations → <M>{`\\sqrt{7} \\approx 2.6457513`}</M> ตรงกับค่าจริง <M>{`2.6457513110...`}</M> แล้ว ✓</p>
            <p className="muted" style={{fontSize:'0.778rem'}}>สังเกตว่า error <em>quadratic convergence</em> — ลดลงประมาณ "ยกกำลังสอง" ทุกรอบ: 27% → 4% → 0.07% → 0.00003%</p>
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

        <Problem label="โจทย์ root3.pdf · ข้อ 2" solution={
          <div>
            <p>หา <M>{`\\sqrt{7}`}</M> โดย <M>{`x_0 = 2.0, x_1 = 3.0`}</M></p>
            <NumTable
              headers={["i", "x_{i-1}", "xᵢ", "f(x_{i-1})", "f(xᵢ)", "x_{i+1}", "εₐ %"]}
              rows={[
                [1, 2.0000, 3.0000, -3.0000, 2.0000, 2.6000, 15.385],
                [2, 3.0000, 2.6000, 2.0000, -0.2400, 2.6429, 1.622],
                [3, 2.6000, 2.6429, -0.2400, -0.0099, 2.6458, 0.110],
                [4, 2.6429, 2.6458, -0.0099, 0.00006, 2.6458, 0.000663],
              ]}
            />
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

        <h3>ตัวอย่าง · หา ln 4 จาก x₀ = 2 (โจทย์ root2.pdf)</h3>
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
