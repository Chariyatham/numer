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
  // We'll do a few passes via replace with markers
  let s = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/(#.*$|\/\/.*$)/g, '<span class="code-tok-com">$1</span>');
  s = s.replace(/(["'])((?:\\.|(?!\1).)*)\1/g, '<span class="code-tok-str">$1$2$1</span>');
  s = s.replace(/\b(\d+\.?\d*(?:e[-+]?\d+)?)\b/gi, '<span class="code-tok-num">$1</span>');
  s = s.replace(kws, '<span class="code-tok-kw">$1</span>');
  s = s.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="code-tok-fn">$1</span>');
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

function PythonRunner({ code: initialCode, autoRun = false, height = 160 }) {
  const [code, setCode] = useState(initialCode || "");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("idle");
  const [pyReady, setPyReady] = useState(false);

  const run = async () => {
    setStatus("loading");
    setOutput("");
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
        <button className="btn small ghost" onClick={() => { setCode(initialCode); setOutput(""); setStatus("idle"); }}>↺ รีเซ็ต</button>
      </div>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        style={{ minHeight: height }}
        spellCheck={false}
      />
      {output && <pre className={"py-output " + (status === "error" ? "error" : "")}>{output}</pre>}
    </div>
  );
}

// ===== PROBLEM BOX with toggleable solution =====
function Problem({ label = "ข้อสอบจำลอง", children, solution }) {
  const [show, setShow] = useState(false);
  return (
    <div className="problem">
      <div className="label">{label}</div>
      <div>{children}</div>
      {solution && (
        <>
          <span className="solution-toggle" onClick={() => setShow(s => !s)}>
            {show ? "▼ ซ่อนเฉลย" : "▶ แสดงเฉลย"}
          </span>
          {show && <div className="solution">{solution}</div>}
        </>
      )}
    </div>
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
function Hero({ kicker, title, lead, meta }) {
  return (
    <div className="hero">
      {kicker && <div className="kicker">{kicker}</div>}
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {meta && <div className="meta">{meta.map((m,i) => <span key={i}>{m}</span>)}</div>}
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
      {label && <div style={{fontFamily:"var(--font-mono)", fontSize:11, color:"var(--blue)", textTransform:"uppercase", letterSpacing:1.2, marginBottom:8}}>{label}</div>}
      {children}
    </div>
  );
}

Object.assign(window, {
  TeX, M, MB, useKaTeXReady,
  CodeBlock, PythonRunner, loadPyodide,
  Problem, Sect, Callout, Hero, NumTable, Formula,
  Key, CalcSteps,
});
