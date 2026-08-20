// Mini fx-991CW-style calculator — floating widget accessible across all lessons
// Supports: +, -, *, /, ^, ( ), trig (sin/cos/tan), inverse (asin/acos/atan),
// log/ln/exp, sqrt, pi, e, abs, variables A-F + x + y, Ans, PreAns, เก็บ/เรียกตัวแปร.
// หมายเหตุ: บนเครื่องจริง fx-991CW ไม่มีปุ่ม STO/RCL — ปุ่มนี้ชื่อ VARIABLE แล้วเลือก [A=] > [Store] / [Recall]
// วิดเจ็ตนี้ย่อให้เป็นปุ่มเดียวเพื่อความเร็วในการซ้อม แต่ป้ายชื่อใช้คำเดียวกับเครื่องจริง

const { useState: useCalcS, useRef: useCalcR, useEffect: useCalcE } = React;

function evalExpr(expr, vars, angleMode) {
  // Normalize input: replace ° symbols, ÷, ×, etc
  let s = expr
    .replace(/×/g, "*").replace(/÷/g, "/")
    .replace(/π/g, "(Math.PI)")
    .replace(/√/g, "Math.sqrt")
    .replace(/\^/g, "**");

  // Variable substitution — careful with longer names first (Ans before A)
  const order = ["Ans", "PreAns", "A", "B", "C", "D", "E", "F", "x", "y"];
  for (const name of order) {
    const v = vars[name];
    if (v === undefined) continue;
    const re = new RegExp("\\b" + name + "\\b", "g");
    s = s.replace(re, "(" + v + ")");
  }
  // Implicit multiplication: number followed by (  or  ) followed by number/letter
  // Convert "2sin" -> "2*sin"; "2(" -> "2*("; ")(" -> ")*("; "2x" -> "2*x"
  // Easier: handle after var sub (vars become numbers in parens)
  s = s.replace(/(\d|\))(\(|[a-zA-Z])/g, "$1*$2");

  // Map trig functions; honour angle mode (deg = convert to rad)
  const toRad = (m) => (angleMode === "deg" ? `((${m})*Math.PI/180)` : `(${m})`);
  s = s.replace(/sin\s*\(/g, "Math.sin(").replace(/cos\s*\(/g, "Math.cos(").replace(/tan\s*\(/g, "Math.tan(");
  s = s.replace(/asin\s*\(/g, "Math.asin(").replace(/acos\s*\(/g, "Math.acos(").replace(/atan\s*\(/g, "Math.atan(");
  s = s.replace(/ln\s*\(/g, "Math.log(").replace(/log\s*\(/g, "Math.log10(").replace(/exp\s*\(/g, "Math.exp(");
  s = s.replace(/abs\s*\(/g, "Math.abs(");

  // Now if user typed bare sin/cos in degree mode, the arg inside parens needs conversion.
  // Simple post-pass: wrap arg of Math.sin/cos/tan in toRad
  if (angleMode === "deg") {
    s = s.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g, (_, fn, arg) => `Math.${fn}(${arg}*Math.PI/180)`);
    // asin/acos/atan result is in rad, convert back to deg
    s = s.replace(/Math\.(asin|acos|atan)\(([^)]+)\)/g, (_, fn, arg) => `(Math.${fn}(${arg})*180/Math.PI)`);
  }
  // eslint-disable-next-line no-new-func
  return new Function(`"use strict"; return (${s});`)();
}

function MiniCalc({ onClose }) {
  const [display, setDisplay] = useCalcS("");
  const [output, setOutput] = useCalcS("");
  const [error, setError] = useCalcS("");
  const [vars, setVars] = useCalcS(() => {
    try { return JSON.parse(localStorage.getItem("calc-vars") || "{}"); } catch { return {}; }
  });
  const [history, setHistory] = useCalcS(() => {
    try { return JSON.parse(localStorage.getItem("calc-hist") || "[]"); } catch { return []; }
  });
  const [angleMode, setAngleMode] = useCalcS(() => localStorage.getItem("calc-ang") || "rad");
  const [pendingSto, setPendingSto] = useCalcS(false);
  const [pendingRcl, setPendingRcl] = useCalcS(false);
  const [pos, setPos] = useCalcS(() => {
    const s = localStorage.getItem("calc-pos");
    if (s) try { return JSON.parse(s); } catch {}
    return { x: window.innerWidth - 360, y: window.innerHeight - 540 };
  });

  // Persist
  useCalcE(() => { localStorage.setItem("calc-vars", JSON.stringify(vars)); }, [vars]);
  useCalcE(() => { localStorage.setItem("calc-hist", JSON.stringify(history.slice(-20))); }, [history]);
  useCalcE(() => { localStorage.setItem("calc-ang", angleMode); }, [angleMode]);
  useCalcE(() => { localStorage.setItem("calc-pos", JSON.stringify(pos)); }, [pos]);

  // Drag support
  const dragRef = useCalcR(null);
  useCalcE(() => {
    const head = dragRef.current;
    if (!head) return;
    let offX, offY, dragging = false;
    const md = (e) => {
      dragging = true;
      const rect = head.parentElement.getBoundingClientRect();
      offX = e.clientX - rect.left; offY = e.clientY - rect.top;
      e.preventDefault();
    };
    const mm = (e) => {
      if (!dragging) return;
      const nx = Math.max(8, Math.min(window.innerWidth - 340, e.clientX - offX));
      const ny = Math.max(8, Math.min(window.innerHeight - 100, e.clientY - offY));
      setPos({ x: nx, y: ny });
    };
    const mu = () => dragging = false;
    head.addEventListener("mousedown", md);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    return () => { head.removeEventListener("mousedown", md); window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  }, []);

  const compute = () => {
    if (!display.trim()) return;
    try {
      const r = evalExpr(display, vars, angleMode);
      if (Number.isNaN(r) || !Number.isFinite(r)) throw new Error("Math Error");
      const rs = Number(r.toFixed(10)).toString();
      setOutput(rs);
      setError("");
      setHistory(h => [...h.slice(-19), { expr: display, result: rs }]);
      setVars(v => ({ ...v, PreAns: v.Ans, Ans: r }));
    } catch (e) {
      setError(e.message || "Error");
      setOutput("");
    }
  };

  const append = (s) => {
    setError("");
    if (pendingSto) {
      setPendingSto(false);
      if (vars.Ans !== undefined) {
        setVars(v => ({ ...v, [s]: v.Ans }));
        setOutput(`${vars.Ans} → ${s}`);
      }
      return;
    }
    if (pendingRcl) {
      setPendingRcl(false);
      setDisplay(d => d + s);
      return;
    }
    setDisplay(d => d + s);
  };

  const back = () => setDisplay(d => d.slice(0, -1));
  const clear = () => { setDisplay(""); setOutput(""); setError(""); setPendingSto(false); setPendingRcl(false); };
  const insertAns = () => { setDisplay(d => d + "Ans"); };
  const startSto = () => { setPendingSto(true); setPendingRcl(false); };
  const startRcl = () => { setPendingRcl(true); setPendingSto(false); };

  // Onclick handler factory
  const K = (label, onClick, kind = "") => (
    <button className={"mkey " + kind} onClick={onClick}>{label}</button>
  );

  return (
    <div className="minicalc" style={{ left: pos.x, top: pos.y }}>
      <div className="mc-head" ref={dragRef}>
        <span className="mc-title">fx-991<span style={{color:"var(--blue)"}}>CW</span> · Mini</span>
        <div className="mc-mode">
          <button className={"btn small " + (angleMode === "deg" ? "primary" : "")} onClick={() => setAngleMode("deg")}>DEG</button>
          <button className={"btn small " + (angleMode === "rad" ? "primary" : "")} onClick={() => setAngleMode("rad")}>RAD</button>
        </div>
        <button className="mc-close" onClick={onClose}>×</button>
      </div>

      <div className="mc-screen">
        {history.slice(-3).map((h, i) => (
          <div key={i} className="mc-history-row">
            <span className="mc-hist-exp">{h.expr}</span>
            <span className="mc-hist-res">= {h.result}</span>
          </div>
        ))}
        <div className="mc-display">
          {display || <span style={{color:"var(--text-faint)"}}>กดเลขเริ่ม...</span>}
        </div>
        <div className="mc-output">
          {error ? <span style={{color:"var(--red)"}}>{error}</span>
                 : (output ? <>= <b style={{color:"var(--yellow)"}}>{output}</b></> : <span style={{color:"var(--text-faint)"}}>—</span>)}
        </div>
        {pendingSto && <div className="mc-prompt">VARIABLE▸Store → กดตัวแปร (A-F, x, y) · บนเครื่องจริงคือ VARIABLE → [A=] → [Store]</div>}
        {pendingRcl && <div className="mc-prompt">VARIABLE▸Recall → กดตัวแปร</div>}
      </div>

      {/* Function row */}
      <div className="mc-keys">
        {K("sin", () => append("sin("), "fn")}
        {K("cos", () => append("cos("), "fn")}
        {K("tan", () => append("tan("), "fn")}
        {K("ln", () => append("ln("), "fn")}
        {K("log", () => append("log("), "fn")}

        {K("√", () => append("√("), "fn")}
        {K("xⁿ", () => append("^"), "fn")}
        {K("π", () => append("π"), "fn")}
        {K("e", () => append("Math.E"), "fn")}
        {K("exp", () => append("exp("), "fn")}

        {K("(", () => append("("), "op")}
        {K(")", () => append(")"), "op")}
        {K("VAR▸Sto", startSto, pendingSto ? "primary" : "op")}
        {K("VAR▸Rcl", startRcl, pendingRcl ? "primary" : "op")}
        {K("Ans", insertAns, "op")}

        {/* Variables */}
        {["A","B","C","D","E","F"].map(v => K(v, () => append(v), "var"))}

        {K("x", () => append("x"), "var")}
        {K("y", () => append("y"), "var")}
        {K("abs", () => append("abs("), "fn")}
        {K("⌫", back, "op")}
        {K("AC", clear, "op danger")}

        {K("7", () => append("7"))}
        {K("8", () => append("8"))}
        {K("9", () => append("9"))}
        {K("÷", () => append("/"), "op")}
        {K("×", () => append("*"), "op")}

        {K("4", () => append("4"))}
        {K("5", () => append("5"))}
        {K("6", () => append("6"))}
        {K("−", () => append("-"), "op")}
        {K("+", () => append("+"), "op")}

        {K("1", () => append("1"))}
        {K("2", () => append("2"))}
        {K("3", () => append("3"))}
        {K(".", () => append("."))}
        {K("=", compute, "primary big")}

        {K("0", () => append("0"))}
        {K("00", () => append("00"))}
        {K("π/2", () => append("π/2"), "fn small")}
        {K("π/4", () => append("π/4"), "fn small")}
        <span className="mc-spacer"></span>
      </div>

      {/* Stored variables display */}
      <div className="mc-vars-box">
        <div className="mc-vars-title">Stored:</div>
        <div className="mc-vars-grid">
          {Object.entries(vars).filter(([k]) => k !== "PreAns").slice(0, 8).map(([k, v]) => (
            <span key={k} className="mc-var-pill">
              <b>{k}</b> = {typeof v === "number" ? Number(v.toFixed(6)).toString() : v}
            </span>
          ))}
          {Object.keys(vars).length === 0 && <span className="muted" style={{fontSize:'0.722rem'}}>ว่างเปล่า — กด VAR▸Sto เพื่อเก็บค่า</span>}
        </div>
      </div>
    </div>
  );
}

// Toggle button + state
function CalcToggle() {
  const [open, setOpen] = useCalcS(false);
  return (
    <>
      {!open && (
        <button
          className="mc-launcher"
          onClick={() => setOpen(true)}
          title="เปิดเครื่องคิดเลข fx-991CW"
        >
          <span style={{fontSize:'1rem'}}>🖩</span>
          <span className="mc-launcher-label">Calc</span>
        </button>
      )}
      {open && <MiniCalc onClose={() => setOpen(false)} />}
    </>
  );
}

window.MiniCalc = MiniCalc;
window.CalcToggle = CalcToggle;
window.CalcToggle = CalcToggle;
