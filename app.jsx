// Main app — sidebar + content router based on location.hash

const { useState: useStA, useEffect: useEfA } = React;

const CHAPTERS = [
  { group: "เริ่มต้น", items: [
    { id: "intro", num: "00", title: "ปฐมนิเทศ · How to use", comp: "IntroLesson" },
  ]},
  { group: "Part 1 · สมการไม่เชิงเส้น", items: [
    { id: "root", num: "01", title: "Root Finding", comp: "RootFindingLesson" },
  ]},
  { group: "Part 2 · ระบบสมการเชิงเส้น", items: [
    { id: "linear", num: "02", title: "Gauss & Iteration", comp: "LinearSystemsLesson" },
    { id: "conjugate", num: "03", title: "Conjugate Gradient", comp: "ConjugateLesson" },
  ]},
  { group: "Part 3 · การประมาณค่า", items: [
    { id: "interp", num: "04", title: "Interpolation", comp: "InterpolationLesson" },
    { id: "spline", num: "05", title: "Spline Interpolation", comp: "SplineLesson" },
    { id: "regression", num: "06", title: "Least-Squares Regression", comp: "RegressionLesson" },
  ]},
  { group: "Part 4 · แคลคูลัส", items: [
    { id: "integ", num: "07", title: "Integration", comp: "IntegrationLesson" },
    { id: "diff", num: "08", title: "Differentiation", comp: "DifferentiationLesson" },
  ]},
  { group: "เครื่องมือ", items: [
    { id: "calc", num: "★", title: "Calculator Master · fx-991CW", comp: "CalculatorLesson" },
    { id: "cheat", num: "⚡", title: "Cheat Sheet & Speed Tricks", comp: "CheatLesson" },
  ]},
  { group: "ฝึกฝน", items: [
    { id: "problems", num: "★", title: "Problem Bank · 40+ ข้อ", comp: "ProblemsLesson" },
    { id: "exam", num: "✸", title: "Mock Final Exam", comp: "ExamLesson" },
  ]},
];

const ALL_ITEMS = CHAPTERS.flatMap(g => g.items);

function getCurrentId() {
  const h = location.hash.replace(/^#/, "");
  return ALL_ITEMS.find(it => it.id === h)?.id || "intro";
}

function App() {
  const [current, setCurrent] = useStA(getCurrentId());
  const [fs, setFs] = useStA(() => {
    const saved = localStorage.getItem("numer-fs");
    return saved ? +saved : 16;
  });
  const [sidebarOpen, setSidebarOpen] = useStA(false);
  const [doneMap, setDoneMap] = useStA(() => window.getLessonDoneMap ? window.getLessonDoneMap() : {});

  useEfA(() => {
    const onHash = () => setCurrent(getCurrentId());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Keyboard nav: [ = prev chapter, ] = next chapter, / = focus search (future)
  useEfA(() => {
    const handler = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      const idx = ALL_ITEMS.findIndex(it => it.id === current);
      if (e.key === "[" && idx > 0) location.hash = ALL_ITEMS[idx - 1].id;
      else if (e.key === "]" && idx < ALL_ITEMS.length - 1) location.hash = ALL_ITEMS[idx + 1].id;
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  // Refresh done map when localStorage changes (cross-tab + this-tab via storage event)
  useEfA(() => {
    const refresh = () => setDoneMap(window.getLessonDoneMap ? window.getLessonDoneMap() : {});
    window.addEventListener("storage", refresh);
    // Also poll once per second (cheap) for in-tab updates from LessonDoneToggle
    const t = setInterval(refresh, 1000);
    return () => { window.removeEventListener("storage", refresh); clearInterval(t); };
  }, []);

  useEfA(() => {
    document.documentElement.style.setProperty("--fs-base", fs + "px");
    localStorage.setItem("numer-fs", fs);
  }, [fs]);

  // Save scroll per chapter
  useEfA(() => {
    const k = "scroll-" + current;
    const y = +(localStorage.getItem(k) || 0);
    setTimeout(() => window.scrollTo(0, y), 30);
    const onScroll = () => localStorage.setItem(k, window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [current]);

  const currentItem = ALL_ITEMS.find(it => it.id === current);
  const Comp = window[currentItem.comp] || (() => <div className="card">ยังไม่ได้สร้างบทนี้</div>);

  const go = (id) => { location.hash = id; setSidebarOpen(false); };

  return (
    <div className="app">
      <aside className="sidebar" style={{ display: sidebarOpen || window.innerWidth > 900 ? "block" : "none" }}>
        <div className="sidebar-brand">
          <div className="logo">N</div>
          <div>
            <div className="title">Numer Master</div>
            <div className="sub">เรียน Numerical ตั้งแต่ 0</div>
          </div>
        </div>

        {CHAPTERS.map((grp) => (
          <div className="sidebar-section" key={grp.group}>
            <div className="sidebar-section-title">{grp.group}</div>
            {grp.items.map(it => (
              <div
                key={it.id}
                className={"sidebar-item " + (current === it.id ? "active" : "")}
                onClick={() => go(it.id)}
              >
                <span className="dot"/>
                <span>{it.title}</span>
                {doneMap[it.id] && <span className="done-check">✓</span>}
                <span className="num">{it.num}</span>
              </div>
            ))}
          </div>
        ))}

        <div style={{marginTop: 30, padding: "12px 10px", color: "var(--text-faint)", fontSize: 12, lineHeight: 1.5}}>
          กด <code>Tweaks</code> ปรับขนาดตัวอักษร · <code>[</code> <code>]</code> เลื่อนบท
          <div style={{marginTop:8, fontSize:11}}>
            ความคืบหน้า: <b style={{color:"var(--green)"}}>
              {Object.values(doneMap).filter(Boolean).length} / {ALL_ITEMS.length}
            </b> บท
          </div>
        </div>
      </aside>

      <main className="main">
        <div style={{display:"flex", justifyContent:"flex-end", marginBottom:6}}>
          {window.LessonDoneToggle && <window.LessonDoneToggle id={current}/>}
        </div>
        <Comp />
      </main>

      <FontTweaks fs={fs} setFs={setFs} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {window.CalcToggle && <window.CalcToggle />}
    </div>
  );
}

function FontTweaks({ fs, setFs, sidebarOpen, setSidebarOpen }) {
  const [open, setOpen] = useStA(false);
  useEfA(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setOpen(true);
      if (d.type === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  if (!open) return null;
  return (
    <div className="tweaks-panel">
      <button className="close" onClick={() => { setOpen(false); window.parent.postMessage({type:"__edit_mode_dismissed"},"*"); }}>×</button>
      <h5>Tweaks</h5>
      <label>ขนาดตัวอักษร: <b>{fs}px</b></label>
      <input type="range" min={13} max={22} value={fs} onChange={e => setFs(+e.target.value)} style={{width:"100%"}}/>
      <div style={{display:"flex", gap:6, marginTop:8}}>
        {[14,15,16,18,20].map(v => (
          <button key={v} className={"btn small " + (fs === v ? "primary" : "")} onClick={() => setFs(v)}>{v}</button>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
