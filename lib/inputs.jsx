// Reusable input primitives for interactive solvers across all lessons.
// All exposed on window so lesson files can use them.

const { useState: useInpS, useEffect: useInpE, useMemo: useInpM } = React;

// ===== Matrix input (n × m editable) =====
function MatrixInput({ value, onChange, rows, cols, prefix = "a" }) {
  // value is array of arrays of strings (kept as strings for editability)
  const setCell = (i, j, v) => {
    const next = value.map(r => r.slice());
    next[i][j] = v;
    onChange(next);
  };
  return (
    <div className="matrix-input">
      <table>
        <tbody>
          {Array.from({length: rows}).map((_, i) => (
            <tr key={i}>
              {Array.from({length: cols}).map((_, j) => (
                <td key={j}>
                  <input
                    type="text"
                    value={value[i]?.[j] ?? ""}
                    onChange={(e) => setCell(i, j, e.target.value)}
                    title={`${prefix}${i+1}${j+1}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper: build initial string matrix from numeric
function strMat(M) { return M.map(r => r.map(v => String(v))); }
function strVec(v) { return v.map(x => String(x)); }
function parseMat(SM, rows, cols) {
  const M = [];
  for (let i = 0; i < rows; i++) {
    const r = [];
    for (let j = 0; j < cols; j++) {
      const v = parseFloat(SM[i]?.[j]);
      if (isNaN(v)) return null;
      r.push(v);
    }
    M.push(r);
  }
  return M;
}
function parseVec(SV, n) {
  const v = [];
  for (let i = 0; i < n; i++) {
    const x = parseFloat(SV[i]);
    if (isNaN(x)) return null;
    v.push(x);
  }
  return v;
}

// ===== Vector input (horizontal row) =====
function VectorInput({ value, onChange, n, label }) {
  const setCell = (i, v) => {
    const next = value.slice();
    next[i] = v;
    onChange(next);
  };
  return (
    <div className="matrix-input" style={{display:"inline-block"}}>
      {label && <div style={{fontSize:'0.722rem', color:"var(--text-faint)", marginBottom:4}}>{label}</div>}
      <table>
        <tbody>
          <tr>
            {Array.from({length: n}).map((_, i) => (
              <td key={i}>
                <input type="text" value={value[i] ?? ""} onChange={(e) => setCell(i, e.target.value)}/>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ===== Points input (xs, ys) =====
function PointsInput({ xs, ys, onChange, label = "จุดข้อมูล" }) {
  const setX = (i, v) => { const nx = xs.slice(); nx[i] = v; onChange(nx, ys); };
  const setY = (i, v) => { const ny = ys.slice(); ny[i] = v; onChange(xs, ny); };
  const addPoint = () => onChange([...xs, ""], [...ys, ""]);
  const delPoint = (i) => onChange(xs.filter((_,k) => k !== i), ys.filter((_,k) => k !== i));
  return (
    <div style={{margin:"8px 0"}}>
      <div style={{fontSize:'0.722rem', color:"var(--text-faint)", marginBottom:4}}>{label} (n = {xs.length})</div>
      <div className="matrix-input">
        <table>
          <thead>
            <tr><td style={{fontSize:'0.722rem', color:"var(--text-faint)"}}>x</td>
              {xs.map((_, i) => <td key={i}><input type="text" value={xs[i]} onChange={(e) => setX(i, e.target.value)}/></td>)}
              <td></td>
            </tr>
            <tr><td style={{fontSize:'0.722rem', color:"var(--text-faint)"}}>y</td>
              {ys.map((_, i) => <td key={i}>
                <input type="text" value={ys[i]} onChange={(e) => setY(i, e.target.value)}/>
              </td>)}
              <td></td>
            </tr>
          </thead>
        </table>
      </div>
      <div className="matrix-tools">
        <button className="btn small" onClick={addPoint}>+ จุด</button>
        <button className="btn small ghost" onClick={() => delPoint(xs.length-1)} disabled={xs.length <= 2}>− จุด</button>
      </div>
    </div>
  );
}

// ===== Function input (free-text math) =====
function FnInput({ value, onChange, label = "f(x) =", width = 240 }) {
  return (
    <span className="input-row" style={{display:"inline-flex"}}>
      <label>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{width, fontFamily:"var(--font-mono)"}}/>
    </span>
  );
}

// ===== Solver shell — input panel + run button + result area =====
function SolverShell({ title, inputs, onRun, output, error, runLabel = "▸ คำนวณ" }) {
  return (
    <div className="solver-shell">
      {title && <h4>{title}</h4>}
      <div>{inputs}</div>
      <div className="solver-controls">
        <button className="btn primary" onClick={onRun}>{runLabel}</button>
      </div>
      {error && <Callout kind="danger">{error}</Callout>}
      {output && <div style={{marginTop:8}}>{output}</div>}
    </div>
  );
}

// ===== Number formatting helper =====
function fmt(v, p = 6) {
  if (v == null || isNaN(v)) return "—";
  if (!isFinite(v)) return v > 0 ? "∞" : "−∞";
  const a = Math.abs(v);
  if (a < 1e-4 && a !== 0) return v.toExponential(3);
  if (a >= 1e6) return v.toExponential(3);
  return (+v).toFixed(p).replace(/\.?0+$/, "");
}

Object.assign(window, {
  MatrixInput, VectorInput, PointsInput, FnInput, SolverShell,
  strMat, strVec, parseMat, parseVec, fmt,
});
