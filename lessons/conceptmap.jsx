// แผนที่คอนเซปต์ทั้งคอร์ส — เห็นทุก method เชื่อมกัน กดโหนดเพื่อกระโดดไปบทนั้น
// (ไอเดียมาจากหน้าแผนที่คอนเซปต์ของเว็บ wireless — kim อยากได้แบบเดียวกันที่นี่)

function ConceptMapLesson() {
  // สีตาม DATA palette ของ styles.css
  const COL = {
    root: "#ffd66b", linear: "#58c4dd", approx: "#83c167",
    calculus: "#e879bc", tools: "#f6a85f",
  };

  // [id, ป้าย, กลุ่มสี, hash บทที่ลิงก์ไป, x, y, hub?]
  const NODES = [
    ["root", "01 · Root Finding", "root", "root", 150, 80, 1],
    ["bisect", "Bisection", "root", "root", 80, 160],
    ["falsepos", "False Position", "root", "root", 225, 160],
    ["onept", "One-Point Iteration", "root", "root", 105, 240],
    ["newton", "Newton–Raphson", "root", "root", 260, 240],
    ["secant", "Secant", "root", "root", 165, 318],

    ["linear", "02 · Linear Systems", "linear", "linear", 500, 80, 1],
    ["cramer", "Cramer", "linear", "linear", 390, 155],
    ["gauss", "Gauss Elimination", "linear", "linear", 512, 155],
    ["gj", "Gauss–Jordan", "linear", "linear", 650, 155],
    ["inv", "Matrix Inverse", "linear", "linear", 390, 228],
    ["lu", "LU Decomposition", "linear", "linear", 525, 228],
    ["chol", "Cholesky", "linear", "linear", 655, 228],
    ["iter", "Jacobi / Gauss–Seidel", "linear", "linear", 445, 300],
    ["cg", "03 · Conjugate Gradient", "linear", "conjugate", 625, 305, 1],

    ["interp", "04 · Interpolation", "approx", "interp", 400, 425, 1],
    ["ndd", "Newton Divided-Diff", "approx", "interp", 300, 498],
    ["lagr", "Lagrange", "approx", "interp", 458, 498],
    ["spline", "05 · Spline", "approx", "spline", 560, 425, 1],
    ["regr", "06 · Regression (Least Squares)", "approx", "regression", 622, 500, 1],

    ["integ", "07 · Integration", "calculus", "integ", 850, 80, 1],
    ["trap", "Trapezoidal", "calculus", "integ", 775, 155],
    ["simp", "Simpson 1/3 · 3/8", "calculus", "integ", 915, 155],
    ["romb", "Romberg", "calculus", "integ", 782, 228],
    ["gl", "Gauss–Legendre", "calculus", "integ", 922, 228],
    ["diff", "08 · Differentiation", "calculus", "diff", 858, 330, 1],
    ["fd", "Finite Difference", "calculus", "diff", 782, 402],
    ["rich", "Richardson", "calculus", "diff", 925, 402],

    ["calc", "★ fx-991CW", "tools", "calc", 105, 585, 1],
    ["cheat", "⚡ Cheat Sheet", "tools", "cheat", 245, 585, 1],
    ["problems", "★ Problem Bank", "tools", "problems", 400, 585, 1],
    ["exam", "✸ Mock Final", "tools", "exam", 555, 585, 1],
  ];

  // [จาก, ไป, cross?] — cross = เส้นประ "แนวคิดเชื่อมข้ามบท"
  const EDGES = [
    ["root", "bisect"], ["root", "falsepos"], ["root", "onept"], ["root", "newton"], ["root", "secant"],
    ["linear", "cramer"], ["linear", "gauss"], ["linear", "gj"], ["linear", "inv"],
    ["linear", "lu"], ["linear", "chol"], ["linear", "iter"], ["iter", "cg"],
    ["interp", "ndd"], ["interp", "lagr"], ["interp", "spline"],
    ["integ", "trap"], ["integ", "simp"], ["integ", "romb"], ["integ", "gl"],
    ["diff", "fd"], ["diff", "rich"],
    ["newton", "diff", 1],   // Newton ต้องใช้ f'(x)
    ["secant", "fd", 1],     // Secant = ประมาณ f' จากสองจุด
    ["spline", "linear", 1], // spline สร้างระบบสมการ → แก้ด้วยบท 02
    ["regr", "linear", 1],   // normal equations ก็คือระบบสมการเชิงเส้น
    ["interp", "integ", 1],  // สูตร Newton–Cotes มาจาก interpolation
    ["romb", "rich", 1],     // Richardson extrapolation ตัวเดียวกัน
  ];

  const pos = {};
  NODES.forEach((n) => { pos[n[0]] = { x: n[4], y: n[5] }; });

  const [hover, setHover] = React.useState(null);
  const isLit = (e) => hover && (e[0] === hover || e[1] === hover);

  return (
    <div>
      <Hero
        kicker="🗺 · Concept Map"
        title="แผนที่คอนเซปต์ทั้งคอร์ส"
        lead="Numerical Methods ไม่ใช่สูตรโดดๆ 30 สูตร — มันคือเครือข่ายไอเดียไม่กี่ตัวที่ยืมกันไปมา กดที่โหนดเพื่อกระโดดไปบทนั้น เส้นประคือ 'แนวคิดที่ข้ามบท' ซึ่งเป็นจุดที่ข้อสอบชอบเอามาผูกกัน"
        meta={["8 บทหลัก", "30+ methods", "6 เส้นเชื่อมข้ามบท", "คลิกได้ทุกโหนด"]}
      />

      <Sect tag="🗺" title="แผนที่ — hover เพื่อไฮไลต์เส้นเชื่อม, คลิกเพื่อไปบทนั้น">
        <div style={{ overflowX: "auto", background: "var(--screen)", border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
          <svg viewBox="0 0 1000 640" style={{ width: "100%", minWidth: 860, display: "block" }}>
            {EDGES.map((e, i) => (
              <line key={i}
                x1={pos[e[0]].x} y1={pos[e[0]].y} x2={pos[e[1]].x} y2={pos[e[1]].y}
                stroke={isLit(e) ? "var(--signal)" : e[2] ? "var(--orange)" : "var(--border-strong)"}
                strokeWidth={isLit(e) ? 3 : e[2] ? 1.8 : 1.4}
                strokeDasharray={e[2] ? "6 5" : "none"}
                opacity={hover && !isLit(e) ? 0.25 : e[2] ? 0.8 : 1}
              />
            ))}
            {NODES.map(([id, label, grp, hash, x, y, hub]) => {
              const w = label.length * (hub ? 8.6 : 7.6) + 26;
              const h = hub ? 34 : 26;
              return (
                <a key={id} href={"#" + hash}>
                  <g
                    onMouseEnter={() => setHover(id)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={hub ? 10 : 7}
                      fill={hover === id ? "var(--bg-soft)" : "var(--bg-card)"}
                      stroke={COL[grp]} strokeWidth={hub ? 2 : 1.3} />
                    <text x={x} y={y + 4.5} textAnchor="middle"
                      fill={hub ? COL[grp] : "var(--text)"}
                      fontSize={hub ? 13.5 : 12}
                      fontWeight={hub ? 700 : 400}
                      fontFamily="var(--font-body, 'IBM Plex Sans Thai', sans-serif)">
                      {label}
                    </text>
                  </g>
                </a>
              );
            })}
          </svg>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 10, fontSize: ".85em", color: "var(--text-dim)" }}>
          {[["Part 1 · สมการไม่เชิงเส้น", COL.root], ["Part 2 · ระบบเชิงเส้น", COL.linear],
            ["Part 3 · การประมาณค่า", COL.approx], ["Part 4 · แคลคูลัส", COL.calculus],
            ["เครื่องมือ/ฝึกฝน", COL.tools]].map(([t, c]) => (
            <span key={t}><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: c, marginRight: 6, verticalAlign: "middle" }} />{t}</span>
          ))}
          <span style={{ color: "var(--orange)" }}>- - - แนวคิดเชื่อมข้ามบท</span>
        </div>
      </Sect>

      <Sect tag="🔗" title="6 เส้นเชื่อมข้ามบท — จุดที่ควรมองเห็นก่อนเข้าห้องสอบ">
        <Callout kind="info" title="ทำไมเส้นประถึงสำคัญ">
          <p>ข้อสอบชอบผูกสองบทเข้าด้วยกันตรงเส้นพวกนี้แหละ — ถ้าอธิบายแต่ละเส้นได้ว่า "ยืมอะไรไปใช้" แปลว่าเข้าใจคอร์สจริง ไม่ใช่จำสูตรเป็นเกาะๆ:</p>
        </Callout>
        <ul>
          <li><b>Newton–Raphson → Differentiation:</b> สูตร Newton ต้องรู้ <M>{"f'(x)"}</M> — ถ้าหาอนุพันธ์วิเคราะห์ไม่ได้ ก็ใช้ finite difference ประมาณเอา</li>
          <li><b>Secant → Finite Difference:</b> Secant คือ Newton ที่ "ขี้เกียจหาอนุพันธ์" — ใช้สองจุดล่าสุดประมาณความชันแทน นั่นคือ finite difference นั่นเอง</li>
          <li><b>Spline → Linear Systems:</b> การหาสัมประสิทธิ์ของ cubic spline คือการตั้งระบบสมการเชิงเส้นก้อนใหญ่ แล้วแก้ด้วยเทคนิคบท 02</li>
          <li><b>Regression → Linear Systems:</b> least squares จบที่ normal equations — ก็ระบบสมการเชิงเส้นอีกแล้ว (Gauss ช่วยได้เสมอ)</li>
          <li><b>Interpolation → Integration:</b> สูตร Trapezoid/Simpson (Newton–Cotes) มาจากการ "แทนฟังก์ชันด้วยพหุนาม interpolate แล้วอินทิเกรตพหุนามแทน"</li>
          <li><b>Romberg → Richardson:</b> สองชื่อ เทคนิคเดียวกัน — Richardson extrapolation เอาค่าประมาณสองระดับมาผสมกำจัด error ใช้ได้ทั้งกับอนุพันธ์และอินทิกรัล</li>
        </ul>
      </Sect>
    </div>
  );
}

window.ConceptMapLesson = ConceptMapLesson;
