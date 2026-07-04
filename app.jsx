// Main app — sidebar + content router based on location.hash

const { useState: useStA, useEffect: useEfA, useRef: useRefA } = React;

const prefersReduced = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const smoothScrollTo = (el) => {
  if (el) el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
};

const CHAPTERS = [
  { group: "เริ่มต้น", items: [
    { id: "intro", num: "00", title: "ปฐมนิเทศ · How to use", comp: "IntroLesson" },
    { id: "map", num: "🗺", title: "แผนที่คอนเซปต์ทั้งคอร์ส", comp: "ConceptMapLesson" },
  ]},
  { group: "Part 1 · แคลคูลัส (บทแรกปีนี้)", items: [
    { id: "integ", num: "01", title: "Integration", comp: "IntegrationLesson" },
    { id: "diff", num: "02", title: "Differentiation", comp: "DifferentiationLesson" },
  ]},
  { group: "Part 2 · สมการไม่เชิงเส้น", items: [
    { id: "root", num: "03", title: "Root Finding", comp: "RootFindingLesson" },
  ]},
  { group: "Part 3 · ระบบสมการเชิงเส้น", items: [
    { id: "linear", num: "04", title: "Gauss & Iteration", comp: "LinearSystemsLesson" },
    { id: "conjugate", num: "05", title: "Conjugate Gradient", comp: "ConjugateLesson" },
  ]},
  { group: "Part 4 · การประมาณค่า", items: [
    { id: "interp", num: "06", title: "Interpolation", comp: "InterpolationLesson" },
    { id: "spline", num: "07", title: "Spline Interpolation", comp: "SplineLesson" },
    { id: "regression", num: "08", title: "Least-Squares Regression", comp: "RegressionLesson" },
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
    const saved = localStorage.getItem("numer-fs-v2");
    return saved ? +saved : 19;
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
    localStorage.setItem("numer-fs-v2", fs);
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
      <ScrollProgress />
      <CommandPalette items={ALL_ITEMS} onGo={go} />
      <aside className="sidebar" style={{ display: sidebarOpen || window.innerWidth > 900 ? "block" : "none" }}>
        <div className="sidebar-brand">
          <div className="logo">N</div>
          <div>
            <div className="title">Numer Master</div>
            <div className="sub">เรียน Numerical ตั้งแต่ 0</div>
          </div>
        </div>

        <button
          className="sidebar-search"
          onClick={() => window.dispatchEvent(new CustomEvent("open-cmdk"))}
          aria-label="ค้นหาบทหรือหัวข้อ"
        >
          <span className="ss-label">ค้นหาบท / หัวข้อ…</span>
          <kbd className="ss-kbd">⌘K</kbd>
        </button>

        {CHAPTERS.map((grp) => (
          <div className="sidebar-section" key={grp.group}>
            <div className="sidebar-section-title">{grp.group}</div>
            {grp.items.map(it => (
              <div
                key={it.id}
                className={"sidebar-item " + (current === it.id ? "active" : "")}
                onClick={() => go(it.id)}
                role="button"
                tabIndex={0}
                aria-current={current === it.id ? "page" : undefined}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(it.id); } }}
              >
                <span className="dot"/>
                <span>{it.title}</span>
                {doneMap[it.id] && <span className="done-check">✓</span>}
                <span className="num">{it.num}</span>
              </div>
            ))}
          </div>
        ))}

        <div style={{marginTop: 30, padding: "12px 10px", color: "var(--text-faint)", fontSize: '0.75rem', lineHeight: 1.5}}>
          <code>⌘K</code> ค้นหา · <code>[</code> <code>]</code> เลื่อนบท · <code>Tweaks</code> ปรับฟอนต์
          <div style={{marginTop:8, fontSize:'0.722rem'}}>
            ความคืบหน้า: <b style={{color:"var(--green)"}}>
              {Object.values(doneMap).filter(Boolean).length} / {ALL_ITEMS.length}
            </b> บท
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="main-col">
          <div style={{display:"flex", justifyContent:"flex-end", marginBottom:6}}>
            {window.LessonDoneToggle && <window.LessonDoneToggle id={current}/>}
          </div>
          <Comp />
        </div>
        <LessonNav current={current} />
      </main>

      <FontTweaks fs={fs} setFs={setFs} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {window.CalcToggle && <window.CalcToggle />}
    </div>
  );
}

// Per-lesson section navigator. Scans the rendered DOM for `.sect` blocks
// (no per-lesson wiring needed), tracks the visible one, and scroll-jumps.
function LessonNav({ current }) {
  const [secs, setSecs] = useStA([]);
  const [active, setActive] = useStA(0);

  useEfA(() => {
    let obs = null;
    const wire = () => {
      const nodes = Array.from(document.querySelectorAll(".main-col .sect"));
      nodes.forEach((n, i) => { if (!n.id) n.id = "sec-" + i; });
      setSecs(nodes.map((n, i) => {
        const h2 = n.querySelector(".sect-head h2");
        return { id: n.id, title: (h2 ? h2.textContent : "ส่วนที่ " + (i + 1)).trim() };
      }));
      if (obs) obs.disconnect();
      obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = nodes.indexOf(e.target);
            if (idx >= 0) setActive(idx);
          }
        });
      }, { rootMargin: "-12% 0px -80% 0px", threshold: 0 });
      nodes.forEach((n) => obs.observe(n));
    };
    // content is transpiled/rendered async (Babel + KaTeX) — wire now and re-wire after it settles
    wire();
    const t1 = setTimeout(wire, 350);
    const t2 = setTimeout(wire, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); if (obs) obs.disconnect(); };
  }, [current]);

  if (secs.length < 2) return null;

  const go = (id) => smoothScrollTo(document.getElementById(id));
  return (
    <nav className="lesson-nav" aria-label="หัวข้อในบทนี้">
      <div className="lesson-nav-title">ในบทนี้</div>
      <ol className="lesson-nav-list">
        {secs.map((s, i) => (
          <li
            key={s.id}
            className={"lesson-nav-item " + (active === i ? "active" : "")}
            onClick={() => go(s.id)}
            role="link"
            tabIndex={0}
            aria-current={active === i ? "true" : undefined}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(s.id); } }}
            title={s.title}
          >
            {s.title}
          </li>
        ))}
      </ol>
      <button className="ln-top" onClick={() => window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" })}>↑ กลับบนสุด</button>
    </nav>
  );
}

// Thin reading-progress bar across the top of the page.
function ScrollProgress() {
  const [p, setP] = useStA(0);
  useEfA(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: p + "%" }} aria-hidden="true" />;
}

// ⌘K / "/" quick search — jump to any lesson, or any section in the current lesson.
function CommandPalette({ items, onGo }) {
  const [open, setOpen] = useStA(false);
  const [q, setQ] = useStA("");
  const [active, setActive] = useStA(0);
  const inputRef = useRefA(null);

  useEfA(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === "/" && !open) {
        const t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        e.preventDefault(); setOpen(true);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-cmdk", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-cmdk", onOpen); };
  }, [open]);

  useEfA(() => {
    if (open) { setQ(""); setActive(0); const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 30); return () => clearTimeout(t); }
  }, [open]);

  if (!open) return null;

  const sections = Array.from(document.querySelectorAll(".main-col .sect")).map((n, i) => {
    if (!n.id) n.id = "sec-" + i;
    const h = n.querySelector(".sect-head h2");
    return { type: "section", id: n.id, title: (h ? h.textContent : "").trim() };
  }).filter((s) => s.title);

  const lessons = items.map((it) => ({ type: "lesson", id: it.id, title: it.title, sub: it.group, num: it.num }));
  const ql = q.trim().toLowerCase();
  const match = (s) => !ql || s.title.toLowerCase().includes(ql) || (s.sub && s.sub.toLowerCase().includes(ql));
  const results = [...lessons.filter(match), ...sections.filter(match)];
  const act = Math.min(active, Math.max(0, results.length - 1));

  const select = (r) => {
    setOpen(false);
    if (!r) return;
    if (r.type === "lesson") onGo(r.id);
    else smoothScrollTo(document.getElementById(r.id));
  };
  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); select(results[act]); }
  };

  return (
    <div className="cmdk-overlay" onMouseDown={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="ค้นหา">
      <div className="cmdk" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="ค้นหาบท หรือหัวข้อในบทนี้…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onKeyDown={onInputKey}
        />
        <ul className="cmdk-list">
          {results.length === 0 && <li className="cmdk-empty">ไม่พบ “{q}”</li>}
          {results.map((r, i) => (
            <li
              key={r.type + r.id + i}
              className={"cmdk-item " + (i === act ? "active" : "")}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); select(r); }}
            >
              <span className={"cmdk-kind " + r.type}>{r.type === "lesson" ? (r.num || "บท") : "§"}</span>
              <span className="cmdk-title">{r.title}</span>
              {r.sub && r.type === "lesson" && <span className="cmdk-sub">{r.sub}</span>}
            </li>
          ))}
        </ul>
        <div className="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> เลือก</span><span><kbd>↵</kbd> ไป</span><span><kbd>esc</kbd> ปิด</span></div>
      </div>
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
      <input type="range" min={14} max={26} value={fs} onChange={e => setFs(+e.target.value)} style={{width:"100%"}}/>
      <div style={{display:"flex", gap:6, marginTop:8}}>
        {[16,18,20,22,24].map(v => (
          <button key={v} className={"btn small " + (fs === v ? "primary" : "")} onClick={() => setFs(v)}>{v}</button>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
