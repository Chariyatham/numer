// Shared components: Math (KaTeX), CodeBlock, PythonRunner, ProblemBox, etc.
// Globals exposed via window so other JSX files can use them.

const { useState, useEffect, useRef, useMemo, useCallback, useReducer } = React;

// ===== MATH =====
// Render LaTeX inline or block using KaTeX
// NOTE: do NOT name this `Math` — it would shadow the global Math object!
function texFromChildren(children) {
  // Children can be: string, number, React element (e.g. wrapped by editor in <span>),
  // or array. Recursively extract text.
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(texFromChildren).join("");
  if (typeof children === "object" && children.props) return texFromChildren(children.props.children);
  return "";
}

function TeX({ tex, children, display = false, className = "" }) {
  const ref = useRef(null);
  const texStr = tex != null ? (typeof tex === "string" ? tex : texFromChildren(tex)) : texFromChildren(children);
  useEffect(() => {
    if (!ref.current || !window.katex) return;
    try {
      window.katex.render(texStr, ref.current, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
        trust: true,
      });
    } catch (e) {
      ref.current.textContent = texStr;
    }
  }, [texStr, display]);
  return display
    ? <div className={"math-block " + className} ref={ref} />
    : <span className={className} ref={ref} />;
}

function M({ children }) { return <TeX tex={texFromChildren(children)} />; }
function MB({ children }) { return <TeX tex={texFromChildren(children)} display />; }

// ===== Wait for KaTeX to be ready =====
function useKaTeXReady() {
  const [ready, setReady] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) return;
    const t = setInterval(() => {
      if (window.katex) { setReady(true); clearInterval(t); }
    }, 80);
    return () => clearInterval(t);
  }, []);
  return ready;
}

// ===== CODE BLOCK with simple syntax highlight (Python/JS) =====
function tokenizeLine(line, lang) {
  // very lightweight tokenizer; good enough for teaching purposes
  const kws = lang === "python"
    ? /\b(def|return|if|elif|else|while|for|in|import|from|as|print|True|False|None|and|or|not|lambda|class|try|except|raise|with|pass|break|continue|yield)\b/g
    : /\b(function|return|if|else|while|for|let|const|var|true|false|null|undefined|new|class|import|export|from|as|try|catch|throw)\b/g;
  // Each pass stashes its markup behind a placeholder built from private-use
  // codepoints. Without this, a later pass matches the quotes and word chars of
  // an earlier pass's own <span class="..."> and shreds it — the string pass eats
  // class="code-tok-com", the keyword pass eats the word `class`.
  let s = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const slots = [];
  const stash = (cls, text) => {
    slots.push('<span class="code-tok-' + cls + '">' + text + '</span>');
    return String.fromCharCode(0xE000 + slots.length - 1);
  };
  s = s.replace(/(#.*$|\/\/.*$)/g, (m) => stash("com", m));
  s = s.replace(/(["'])((?:\\.|(?!\1).)*)\1/g, (m) => stash("str", m));
  s = s.replace(/\b(\d+\.?\d*(?:e[-+]?\d+)?)\b/gi, (m) => stash("num", m));
  s = s.replace(kws, (m) => stash("kw", m));
  s = s.replace(/\b([a-zA-Z_]\w*)(?=\()/g, (m) => stash("fn", m));
  // A later pass can swallow an earlier placeholder into its own match (e.g. a
  // string that contains a `#`), so a slot's text may itself hold a placeholder.
  // Unwrap until none are left; the bound just guards against a pathological line.
  const ph = /[\uE000-\uF8FF]/g;
  for (let i = 0; i < 6 && ph.test(s); i++) {
    ph.lastIndex = 0;
    s = s.replace(ph, (c) => slots[c.charCodeAt(0) - 0xE000] ?? c);
  }
  return s;
}

function CodeBlock({ code, lang = "python", title }) {
  const lines = code.split("\n");
  const html = lines.map(l => tokenizeLine(l, lang)).join("\n");
  return (
    <>
      {title && <div className="code-header"><span>{title}</span><span>{lang}</span></div>}
      <pre className="code-block" dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
}

// ===== PYODIDE RUNNER =====
// Singleton loader for pyodide
let pyodidePromise = null;
function loadPyodide() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    s.onload = async () => {
      try {
        const py = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
        resolve(py);
      } catch (e) { reject(e); }
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return pyodidePromise;
}

// Python harness: run the user's code under sys.settrace and capture (lineno, simple locals) per line.
// USER_CODE is injected from JS via py.globals.set. Result is JSON in _trace_json.
const PY_TRACE_HARNESS = `
import sys as _sys, json as _json, math as _math
_events = []
_g = {}
_co = compile(USER_CODE, '<user>', 'exec')
def _snap(fr):
    d = {}
    for k, v in list(fr.f_locals.items()):
        if k.startswith('_'):
            continue
        try:
            if v is None or isinstance(v, bool) or isinstance(v, str):
                d[k] = v
            elif isinstance(v, int):
                d[k] = v
            elif isinstance(v, float):
                d[k] = round(v, 6) if _math.isfinite(v) else str(v)
            elif isinstance(v, (list, tuple)) and len(v) <= 12 and all(isinstance(e, (bool, int, float, str)) for e in v):
                d[k] = [round(e, 6) if (isinstance(e, float) and _math.isfinite(e)) else e for e in v]
        except Exception:
            pass
    return d
def _tr(frame, event, arg):
    if len(_events) >= 400:
        return None
    if event == 'line' and frame.f_code.co_filename == '<user>':
        _events.append([frame.f_lineno, _snap(frame)])
    return _tr
_sys.settrace(_tr)
try:
    exec(_co, _g)
except Exception as _e:
    _events.append([0, {'error': str(_e)}])
finally:
    _sys.settrace(None)
_trace_json = _json.dumps({'events': _events})
`;

// Step through a captured execution trace: highlight the running line + show variable values.
function CodeStepView({ code, events, onClose }) {
  const lines = code.split("\n");
  const fmt = (v) => Array.isArray(v) ? "[" + v.join(", ") + "]" : String(v);
  return (
    <div className="py-trace" style={{marginTop:8, border:"1px solid var(--blue-dim)", borderRadius:8, padding:"8px 10px"}}>
      <div className="py-toolbar" style={{marginBottom:4}}>
        <span style={{color:"var(--blue)"}}>▸ เดินโค้ดทีละบรรทัด (รันจริงด้วย Pyodide)</span>
        <div style={{flex:1}}/>
        <button className="btn small ghost" onClick={onClose}>✕ ปิด</button>
      </div>
      <StepPlayer steps={events.length} stepDuration={650} height={40} label={(s) => `บรรทัด ${events[s][0]} · step ${s+1}/${events.length}`}>
        {({ step }) => {
          const [lineNo, vars] = events[step];
          const prev = step > 0 ? events[step-1][1] : {};
          return (
            <div style={{display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap"}}>
              <pre className="code-block" style={{flex:"1 1 320px", margin:0, lineHeight:1.65}}>
                {lines.map((ln, i) => (
                  <div key={i} style={{
                    background: (i+1) === lineNo ? "rgba(255,214,107,0.16)" : "transparent",
                    borderLeft: (i+1) === lineNo ? "3px solid #ffd66b" : "3px solid transparent",
                    paddingLeft: 6, whiteSpace: "pre",
                  }}>
                    <span style={{color:"#5b6472"}}>{String(i+1).padStart(2, " ")}</span>  {ln || " "}
                  </div>
                ))}
              </pre>
              <div className="card tight" style={{flex:"0 0 190px", minWidth:160}}>
                <div className="kicker">ค่าตัวแปรตอนนี้</div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.8}}>
                  {Object.keys(vars).length === 0
                    ? <span className="muted">— ยังไม่มีตัวแปร</span>
                    : Object.entries(vars).map(([k, v]) => {
                        const changed = JSON.stringify(prev[k]) !== JSON.stringify(v);
                        return (
                          <div key={k} style={{color: changed ? "#ffd66b" : "var(--text)"}}>
                            {k} = {fmt(v)}{changed && <span style={{color:"var(--text-faint)", fontSize:'0.722rem'}}> ←</span>}
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          );
        }}
      </StepPlayer>
    </div>
  );
}

function PythonRunner({ code: initialCode, autoRun = false, height = 160 }) {
  const [code, setCode] = useState(initialCode || "");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("idle");
  const [pyReady, setPyReady] = useState(false);
  const [trace, setTrace] = useState(null);

  const run = async () => {
    setStatus("loading");
    setOutput("");
    setTrace(null);
    let py;
    try {
      py = await loadPyodide();
      setPyReady(true);
    } catch (e) {
      setStatus("error");
      setOutput("โหลด Pyodide ไม่สำเร็จ: " + e.message);
      return;
    }
    setStatus("running");
    try {
      py.setStdout({ batched: (s) => setOutput(o => o + s + "\n") });
      py.setStderr({ batched: (s) => setOutput(o => o + "[err] " + s + "\n") });
      const result = await py.runPythonAsync(code);
      if (result !== undefined && result !== null) {
        setOutput(o => o + String(result));
      }
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setOutput(o => o + "\n" + e.toString());
    }
  };

  // Run under a tracer and capture per-line execution for the step-through animation.
  const animate = async () => {
    setStatus("loading");
    setOutput("");
    setTrace(null);
    let py;
    try {
      py = await loadPyodide();
      setPyReady(true);
    } catch (e) {
      setStatus("error");
      setOutput("โหลด Pyodide ไม่สำเร็จ: " + e.message);
      return;
    }
    setStatus("running");
    try {
      try { await py.loadPackagesFromImports(code); } catch (e) { /* package autoload best-effort */ }
      py.globals.set("USER_CODE", code);
      await py.runPythonAsync(PY_TRACE_HARNESS);
      const raw = py.globals.get("_trace_json");
      const parsed = JSON.parse(raw);
      try { py.globals.delete("USER_CODE"); py.globals.delete("_trace_json"); } catch (e) {}
      if (!parsed.events || !parsed.events.length) {
        setStatus("error");
        setOutput("ไม่มีบรรทัดให้เดิน — โค้ดนี้อาจเป็นการนิยามฟังก์ชันล้วน ๆ ลองเพิ่มบรรทัดเรียกใช้หรือ print");
        return;
      }
      setTrace(parsed.events);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setOutput(e.toString());
    }
  };

  useEffect(() => {
    if (autoRun) run();

  }, []);

  return (
    <div className="py-cell">
      <div className="py-toolbar">
        <span>▸ Python</span>
        <span className="py-status">{
          status === "idle" ? "พร้อมรัน" :
          status === "loading" ? "กำลังโหลด Pyodide…" :
          status === "running" ? "กำลังรัน…" :
          status === "done" ? "เสร็จแล้ว ✓" :
          "ผิดพลาด"
        }</span>
        <div style={{flex:1}}/>
        <button className="btn small primary" onClick={run} disabled={status === "running" || status === "loading"}>
          ▸ Run
        </button>
        <button className="btn small" onClick={animate} disabled={status === "running" || status === "loading"} title="รันจริงแล้วเดินทีละบรรทัด">
          ▸ ทีละบรรทัด
        </button>
        <button className="btn small ghost" onClick={() => { setCode(initialCode); setOutput(""); setStatus("idle"); setTrace(null); }}>↺ รีเซ็ต</button>
      </div>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ minHeight: height }}
        spellCheck={false}
      />
      {trace && <CodeStepView code={code} events={trace} onClose={() => setTrace(null)} />}
      {output && <pre className={"py-output " + (status === "error" ? "error" : "")}>{output}</pre>}
    </div>
  );
}

// ===== PROBLEM BOX with toggleable solution =====
// ถ้าอยู่ใน <TimedExam> ที่กำลังจับเวลา เฉลยจะถูกล็อกจนหมดเวลา/ยอมแพ้
const ExamLockCtx = React.createContext(null);

function Problem({ label = "ข้อสอบจำลอง", children, solution }) {
  const [show, setShow] = useState(false);
  const lock = React.useContext(ExamLockCtx);
  const locked = !!(lock && lock.locked);
  useEffect(() => { if (locked) setShow(false); }, [locked]);
  return (
    <div className="problem">
      <div className="label">{label}</div>
      <div>{children}</div>
      {solution && (locked
        ? <span className="solution-toggle" style={{opacity:0.55, cursor:"not-allowed"}}>
            🔒 เฉลยล็อกระหว่างจับเวลา (เหลือ {lock.mmss})
          </span>
        : <>
            <span className="solution-toggle" onClick={() => setShow(s => !s)}>
              {show ? "▼ ซ่อนเฉลย" : "▶ แสดงเฉลย"}
            </span>
            {show && <div className="solution">{solution}</div>}
          </>
      )}
    </div>
  );
}

// ===== TIMED EXAM — จับเวลาข้อสอบจำลอง + ล็อกเฉลยจนหมดเวลา =====
function fmtMMSS(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function TimedExam({ presets = [15, 25, 36], label, children }) {
  const [total, setTotal] = useState(presets[presets.length - 1] * 60);
  const [remaining, setRemaining] = useState(0);
  const [status, setStatus] = useState("idle");   // idle | running | done | surrendered
  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setStatus("done"); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);
  const start = (min) => { setTotal(min * 60); setRemaining(min * 60); setStatus("running"); };
  const mmss = fmtMMSS(remaining);
  const running = status === "running";
  const lowTime = running && remaining <= 60;
  const ctx = { locked: running, mmss };
  return (
    <ExamLockCtx.Provider value={ctx}>
      <div className="card" style={{
        margin: "0 0 14px",
        borderLeft: `3px solid ${lowTime ? "var(--red, #e06c75)" : running ? "var(--yellow)" : status === "done" ? "var(--green)" : "var(--blue)"}`,
      }}>
        <div style={{display:"flex", alignItems:"center", gap:14, flexWrap:"wrap"}}>
          <div style={{fontFamily:"var(--font-mono)", fontSize:"1.9rem", fontWeight:700, letterSpacing:2,
            color: lowTime ? "var(--red, #e06c75)" : running ? "var(--yellow)" : "var(--text-dim)"}}>
            ⏱ {running || status === "done" ? mmss : fmtMMSS(total)}
          </div>
          <div style={{flex:1, minWidth:180}}>
            {status === "idle" && <span className="muted" style={{fontSize:"0.82rem"}}>{label || "เลือกเวลาแล้วกดเริ่ม — ระหว่างจับเวลา เฉลยทุกข้อจะถูกล็อก"}</span>}
            {running && <span style={{fontSize:"0.82rem", color:"var(--yellow)"}}>กำลังจับเวลา — เฉลยล็อกอยู่ ทำเหมือนสอบจริง ✍️</span>}
            {status === "done" && <span style={{fontSize:"0.82rem", color:"var(--green)"}}>⏰ หมดเวลา! เฉลยเปิดแล้ว — ตรวจคำตอบเลย</span>}
            {status === "surrendered" && <span className="muted" style={{fontSize:"0.82rem"}}>เปิดเฉลยก่อนหมดเวลา — รอบหน้าลองอึดอีกนิด 💪</span>}
            {(running || status === "done") && (
              <div style={{height:6, background:"var(--bg-soft)", borderRadius:3, marginTop:6, overflow:"hidden"}}>
                <div style={{height:"100%", width:`${total ? (remaining/total)*100 : 0}%`, borderRadius:3,
                  background: lowTime ? "var(--red, #e06c75)" : "var(--yellow)", transition:"width 1s linear"}}/>
              </div>
            )}
          </div>
          <div className="chip-row" style={{margin:0}}>
            {!running && presets.map(min => (
              <button key={min} className="btn small" onClick={() => start(min)}>▸ {min} นาที</button>
            ))}
            {running && <button className="btn small" onClick={() => setStatus("surrendered")}>ยอมแพ้ · เปิดเฉลย</button>}
            {(status === "done" || status === "surrendered") && (
              <button className="btn small" onClick={() => setStatus("idle")}>↺ จับเวลาใหม่</button>
            )}
          </div>
        </div>
      </div>
      {children}
    </ExamLockCtx.Provider>
  );
}

// ===== CALCULATOR KEYSTROKES =====
function Key({ children }) { return <span className="calc-key">{children}</span>; }

function CalcSteps({ steps }) {
  return (
    <div className="calc-steps">
      {steps.map((s, i) => (
        <div className="calc-step" key={i}>
          <span className="step-num">{i+1}</span>
          <div>{s}</div>
        </div>
      ))}
    </div>
  );
}

// ===== SECTION HEADER =====
function Sect({ tag, title, children }) {
  return (
    <section className="sect">
      <div className="sect-head">
        {tag && <span className="step-tag">{tag}</span>}
        <h2 style={{margin:0}}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ===== CALLOUTS =====
function Callout({ kind = "info", title, children }) {
  return (
    <div className={"callout " + (kind === "info" ? "" : kind)}>
      {title && <div className="callout-title">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

// ===== HERO =====
function Hero({ kicker, title, lead, meta, readout }) {
  return (
    <div className="hero">
      {kicker && <div className="kicker">{kicker}</div>}
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {readout && <ConvergenceStrip {...readout} />}
      {meta && <div className="meta">{meta.map((m,i) => <span key={i}>{m}</span>)}</div>}
    </div>
  );
}

// ===== Signature: convergence readout =====
// Shows a method's iterates homing in on the answer, with a shrinking error bar.
// steps: [{ x: "2.500", w: 70 }, ...]  (w = error-bar width in px, optional)
function ConvergenceStrip({ label, steps = [], result, note }) {
  const hasBars = steps.some(s => s.w != null);
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !ref.current) { setShown(true); return; }
    const o = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { setShown(true); o.disconnect(); } });
    }, { threshold: 0.35 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div className="cstrip" ref={ref}>
      {label && <div className="cstrip-label">{label}</div>}
      <div className="cstrip-vals">
        {steps.map((s, i) => (
          <span className="cstrip-val" key={i}>{s.x}<em>→</em></span>
        ))}
        {result != null && (
          <span className="cstrip-val result">{result}<span className="cstrip-check">✓</span></span>
        )}
      </div>
      {hasBars && (
        <div className="cstrip-bars">
          <span className="cstrip-barlabel">error</span>
          {steps.map((s, i) => (
            <i className="cstrip-bar" key={i}
               style={{ width: shown ? (s.w || 8) : 0, transitionDelay: (i * 90) + "ms" }} />
          ))}
        </div>
      )}
      {note && <div className="cstrip-note">{note}</div>}
    </div>
  );
}

// ===== Number table helper =====
function NumTable({ headers, rows, highlight }) {
  return (
    <div style={{overflowX:"auto"}}>
      <table className="tbl">
        <thead><tr>{headers.map((h,i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={highlight === i ? "hi" : ""}>
              {r.map((c, j) => <td key={j} className={typeof c === "number" ? "num" : ""}>{
                typeof c === "number" ? (Number.isInteger(c) ? c : c.toFixed(4)) : c
              }</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== Formula card (highlighted formula) =====
function Formula({ children, label }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(88,196,221,0.06), rgba(168,125,190,0.05))",
      border: "1px solid var(--blue-dim)",
      borderRadius: 10,
      padding: "16px 20px",
      margin: "16px 0"
    }}>
      {label && <div style={{fontFamily:"var(--font-mono)", fontSize:'0.722rem', color:"var(--signal)", textTransform:"uppercase", letterSpacing:1.2, marginBottom:8}}>{label}</div>}
      {children}
    </div>
  );
}

Object.assign(window, {
  TeX, M, MB, useKaTeXReady,
  CodeBlock, PythonRunner, loadPyodide,
  Problem, TimedExam, Sect, Callout, Hero, ConvergenceStrip, NumTable, Formula,
  Key, CalcSteps,
});
