// รูป "ภาพในหัว" ของหน้าอ่านง่าย — เพิ่ม 23 ต.ค. 2569
// kim ขอ: รูปแบบ infographic (จุด + เส้น + ป้าย) ทุกวิธี ให้นึกภาพออกว่ากำลังทำอะไร
// รูปนิ่งทั้งหมด ไม่มีอะไรต้องกด · เส้น/จุดคำนวณจากข้อมูลจริงในหน้า ไม่ได้วาดกะเอา
// คำอธิบายยาวอยู่ใน figcaption (HTML) — บนมือถือ SVG ย่อจนตัวหนังสือในรูปเล็ก
// ⚠ ใส่สีตัวหนังสือด้วย attribute fill เสมอ (CSS ที่เลือก text จะทับ attribute) — CSS กำหนดแค่ฟอนต์

const EF = { blue: "#58c4dd", red: "#f0696b", yellow: "#ffd66b", green: "#83c167", orange: "#f6a85f",
  purple: "#a87dbe", pink: "#e879bc", text: "#e9eef4", dim: "#a7b2c0", faint: "#69727f", axis: "#8a94a3", grid: "#1f2731" };

// ---------- ข้อมูล ----------
const EF_RX = [10, 15, 20, 30, 40, 50, 60, 70, 80], EF_RY = [5, 9, 15, 18, 22, 30, 35, 38, 43];   // การบ้าน 11
const EF_IX = [0, 2, 4, 6, 8], EF_IY = [9.81, 9.7487, 9.6879, 9.6879, 9.5682];                    // การบ้าน 9 (10 = x × 10,000)
const EF_SX = [2, 4, 6, 8, 10], EF_SY = [9.5, 8, 10.5, 39.5, 72.5];                                 // ใบ SPLINE
const EF_QUAD = [[0, -0.75, 11], [1, -8.75, 27], [5.625, -64.25, 193.5], [-4.625, 99.75, -462.5]];  // a, b, c ต่อช่วง (ตารางในหน้า Spline)
const EF_MC = [0, -1.125, 10.5, -1.125, 0];                                                         // M = f'' ของ natural cubic
const EF_PX = [1, 2, 3, 4, 5], EF_PY = [1.5, 3.2, 2.5, 4.4, 4.3];                                   // ข้อมูลตัวอย่างเล็ก (รูปเปรียบเทียบเท่านั้น)
const EF_A2 = [[3, 1], [1, 2]], EF_B2 = [5, 5];                                                     // ระบบ 2 × 2 ตัวอย่าง (ชุดเดียวกับ CG หน้า ⑤) คำตอบ (1, 2)

// ---------- คณิตเล็ก ๆ ----------
function efSolve(A, b) {                       // Gauss + partial pivot
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    [M[k], M[p]] = [M[p], M[k]];
    for (let i = k + 1; i < n; i++) { const m = M[i][k] / M[k][k]; for (let j = k; j <= n; j++) M[i][j] -= m * M[k][j]; }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}
function efFit(rows, Y) {                      // least squares: rows[k] = [1, x, ...] → a
  const m = rows[0].length, A = [], b = [];
  for (let i = 0; i < m; i++) { A.push([]); b.push(rows.reduce((s, r, k) => s + r[i] * Y[k], 0));
    for (let j = 0; j < m; j++) A[i].push(rows.reduce((s, r) => s + r[i] * r[j], 0)); }
  return efSolve(A, b);
}
function efPoly(X, Y, m) { const a = efFit(X.map(x => Array.from({ length: m + 1 }, (_, i) => x ** i)), Y); return x => a.reduce((s, c, i) => s + c * x ** i, 0); }
function efLag(X, Y) { return x => X.reduce((s, xi, i) => s + Y[i] * X.reduce((L, xj, j) => j === i ? L : L * (x - xj) / (xi - xj), 1), 0); }
function efCubic(x) {                          // natural cubic spline จาก M (h = 2)
  const h = 2; let i = 0; while (i < 3 && x > EF_SX[i + 1]) i++;
  const a = EF_SX[i], b = EF_SX[i + 1], Mi = EF_MC[i], Mj = EF_MC[i + 1];
  return Mi * (b - x) ** 3 / (6 * h) + Mj * (x - a) ** 3 / (6 * h) + (EF_SY[i] / h - Mi * h / 6) * (b - x) + (EF_SY[i + 1] / h - Mj * h / 6) * (x - a);
}
const efMul = (A, v) => A.map(r => r.reduce((s, c, j) => s + c * v[j], 0));
const efDot = (u, v) => u.reduce((s, c, i) => s + c * v[i], 0);

// ---------- ชิ้นส่วนวาด ----------
function efPlot(W, H, pad, xd, yd) { return { W, H, pad, xd, yd, sx: makeScale(xd, [pad.l, W - pad.r]), sy: makeScale(yd, [H - pad.b, pad.t]) }; }

function EasyFig({ title, sub, note, children }) {
  return (
    <figure className="efig">
      <div className="efig-title">{title}</div>
      {sub && <div className="efig-sub">{sub}</div>}
      {children}
      {note && <figcaption className="efig-note">{note}</figcaption>}
    </figure>
  );
}
function EfKey({ c, dash, dot, children }) {
  return <span className="ef-key"><span className={"ef-sw" + (dot ? " dot" : "") + (dash ? " dash" : "")} style={dot ? { background: c } : { borderColor: c }}/>{children}</span>;
}
function EfT({ x, y, c = EF.dim, cls = "ef-lab", a = "start", children }) {
  return <text x={x} y={y} fill={c} className={cls} textAnchor={a}>{children}</text>;
}
function EfDot({ x, y, c = EF.blue, r = 6, o = 1 }) { return <circle cx={x} cy={y} r={r} fill={c} stroke="#06080c" strokeWidth="1.5" opacity={o}/>; }
function EfArrow({ x1, y1, x2, y2, c = EF.text, w = 2, dash, head = 9, gap = 0 }) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const ex = x2 - ux * gap, ey = y2 - uy * gap, bx = ex - ux * head, by = ey - uy * head, k = head * 0.48;
  return (
    <g>
      <line x1={x1 + ux * gap} y1={y1 + uy * gap} x2={bx} y2={by} stroke={c} strokeWidth={w} strokeDasharray={dash}/>
      <polygon points={`${ex},${ey} ${bx - uy * k},${by + ux * k} ${bx + uy * k},${by - ux * k}`} fill={c}/>
    </g>
  );
}
// แกน: xAt / yAt = ตำแหน่งที่แกนตัดกัน (ค่าเริ่ม = มุมล่างซ้าย)
function EfAxes({ p, xt = [], yt = [], xl = "x", yl = "y", xAt, yAt }) {
  const { W, H, pad, sx, sy, xd, yd } = p;
  const ay = sy(yAt != null ? yAt : yd[0]), ax = sx(xAt != null ? xAt : xd[0]);
  const xe = W - pad.r + 8, ye = pad.t - 8;
  return (
    <g>
      {yt.map(v => <line key={"g" + v} x1={pad.l} x2={W - pad.r} y1={sy(v)} y2={sy(v)} stroke={EF.grid}/>)}
      <line x1={pad.l - 4} y1={ay} x2={xe} y2={ay} stroke={EF.axis} strokeWidth="1.6"/>
      <line x1={ax} y1={H - pad.b + 4} x2={ax} y2={ye} stroke={EF.axis} strokeWidth="1.6"/>
      <polygon points={`${xe + 9},${ay} ${xe},${ay - 5} ${xe},${ay + 5}`} fill={EF.axis}/>
      <polygon points={`${ax},${ye - 9} ${ax - 5},${ye} ${ax + 5},${ye}`} fill={EF.axis}/>
      {xt.map(v => <EfT key={"x" + v} x={sx(v)} y={ay + 19} c={EF.faint} cls="ef-tick" a="middle">{v}</EfT>)}
      {yt.map(v => <EfT key={"y" + v} x={ax - 8} y={sy(v) + 4} c={EF.faint} cls="ef-tick" a="end">{v}</EfT>)}
      <EfT x={xe + 4} y={ay + 22} c={EF.dim} cls="ef-ax" a="middle">{xl}</EfT>
      <EfT x={ax + 12} y={ye + 2} c={EF.dim} cls="ef-ax">{yl}</EfT>
    </g>
  );
}

// เมทริกซ์แบบช่องสี — token: a ตัวเลข · p ตัวหลัก · 0 · 1 · b ฝั่งขวา · l ช่องใน L · u ช่องใน U · i ช่องใน A⁻¹ · x คำตอบ · s1–s3 คู่สมมาตร
// เขียน "x:−1" ได้ = token x + ตัวหนังสือในช่อง · aug = จำนวนคอลัมน์หลังเส้นกั้น
const EF_CELL = {
  a: { f: "#1c2430", s: "#36414f" }, p: { f: "rgba(255,214,107,0.25)", s: "#ffd66b" },
  "0": { f: "none", s: "#232c38", t: "0", tc: "#83c167" }, "1": { f: "rgba(255,214,107,0.12)", s: "#8c6f2a", t: "1", tc: "#ffd66b" },
  b: { f: "rgba(168,125,190,0.3)", s: "#a87dbe" }, l: { f: "rgba(88,196,221,0.26)", s: "#58c4dd" },
  u: { f: "rgba(240,105,107,0.24)", s: "#f0696b" }, i: { f: "rgba(246,168,95,0.26)", s: "#f6a85f" },
  x: { f: "rgba(131,193,103,0.3)", s: "#83c167" },
  s1: { f: "rgba(88,196,221,0.32)", s: "#58c4dd" }, s2: { f: "rgba(131,193,103,0.32)", s: "#83c167" }, s3: { f: "rgba(232,121,188,0.32)", s: "#e879bc" },
};
function EfMat({ x, y, cells, aug = 0, cs = 28, label }) {
  const R = cells.length, Cn = cells[0].length, w = Cn * cs, h = R * cs;
  return (
    <g>
      {cells.map((row, i) => row.map((tok, j) => {
        const [k, txt] = tok.split(":"), st = EF_CELL[k], t = txt || st.t;
        return (
          <g key={i + "-" + j}>
            <rect x={x + j * cs + 2} y={y + i * cs + 2} width={cs - 4} height={cs - 4} rx="3" fill={st.f} stroke={st.s} strokeWidth="1.2"/>
            {t && <EfT x={x + j * cs + cs / 2} y={y + i * cs + cs / 2 + 5} c={st.tc || EF.text} cls="ef-cell" a="middle">{t}</EfT>}
          </g>
        );
      }))}
      <path d={`M${x - 1},${y} h-5 v${h} h5`} fill="none" stroke={EF.dim} strokeWidth="1.5"/>
      <path d={`M${x + w + 1},${y} h5 v${h} h-5`} fill="none" stroke={EF.dim} strokeWidth="1.5"/>
      {aug > 0 && <line x1={x + (Cn - aug) * cs} x2={x + (Cn - aug) * cs} y1={y + 1} y2={y + h - 1} stroke={EF.dim} strokeWidth="1.3" strokeDasharray="3 3"/>}
      {label && <EfT x={x + w / 2} y={y + h + 22} c={EF.dim} cls="ef-lab-s" a="middle">{label}</EfT>}
    </g>
  );
}

// ---------- รูปเล็ก (หน้าเริ่มที่นี่ + Regression vs Interpolation) ----------
function EfMini({ t, s, children }) {
  return (
    <div className="efig-mini">
      <div className="efig-mini-t">{t}{s && <span>{s}</span>}</div>
      <svg viewBox="0 0 240 150" className="efig-svg">{children}</svg>
    </div>
  );
}
const efMiniP = (xd, yd) => efPlot(240, 150, { l: 16, r: 12, t: 12, b: 14 }, xd, yd);
function EfMiniAxes({ p }) { const { W, H, pad } = p; return <path d={`M${pad.l},${pad.t - 4} L${pad.l},${H - pad.b} L${W - pad.r + 4},${H - pad.b}`} fill="none" stroke={EF.axis} strokeWidth="1.4"/>; }
function EfMiniReg() {
  const p = efMiniP([0.4, 5.6], [0.6, 5.4]), f = efPoly(EF_PX, EF_PY, 1);
  return (<>
    <EfMiniAxes p={p}/>
    {EF_PX.map((x, i) => <line key={i} x1={p.sx(x)} x2={p.sx(x)} y1={p.sy(EF_PY[i])} y2={p.sy(f(x))} stroke={EF.pink} strokeDasharray="3 3" strokeWidth="2"/>)}
    <path d={plotPath(f, 0.6, 5.4, p.sx, p.sy, 2)} stroke={EF.red} strokeWidth="2.8" fill="none"/>
    {EF_PX.map((x, i) => <EfDot key={i} x={p.sx(x)} y={p.sy(EF_PY[i])} r={5.5}/>)}
  </>);
}
function EfMiniInterp() {
  const p = efMiniP([0.4, 5.6], [0.6, 5.4]), f = efLag(EF_PX, EF_PY);
  return (<>
    <EfMiniAxes p={p}/>
    <path d={plotPath(f, 0.95, 5.05, p.sx, p.sy, 120)} stroke={EF.red} strokeWidth="2.8" fill="none"/>
    {EF_PX.map((x, i) => <EfDot key={i} x={p.sx(x)} y={p.sy(EF_PY[i])} r={5.5}/>)}
  </>);
}
function EfMiniSpline() {
  const p = efMiniP([0.4, 5.6], [0.6, 5.4]);
  return (<>
    <EfMiniAxes p={p}/>
    {EF_PX.slice(1, -1).map(x => <line key={x} x1={p.sx(x)} x2={p.sx(x)} y1={p.pad.t} y2={p.H - p.pad.b} stroke={EF.faint} strokeDasharray="2 4"/>)}
    {EF_PX.slice(0, -1).map((x, i) => <line key={i} x1={p.sx(x)} y1={p.sy(EF_PY[i])} x2={p.sx(EF_PX[i + 1])} y2={p.sy(EF_PY[i + 1])} stroke={i % 2 ? EF.orange : EF.red} strokeWidth="2.8"/>)}
    {EF_PX.map((x, i) => <EfDot key={i} x={p.sx(x)} y={p.sy(EF_PY[i])} r={5.5}/>)}
  </>);
}
function EfMiniAxb() {
  const p = efMiniP([-0.4, 2.6], [-0.4, 3.4]);
  return (<>
    <EfMiniAxes p={p}/>
    <path d={plotPath(x => 5 - 3 * x, 0.54, 1.8, p.sx, p.sy, 2)} stroke={EF.blue} strokeWidth="2.6" fill="none"/>
    <path d={plotPath(x => (5 - x) / 2, -0.35, 2.55, p.sx, p.sy, 2)} stroke={EF.green} strokeWidth="2.6" fill="none"/>
    <EfDot x={p.sx(1)} y={p.sy(2)} c={EF.yellow} r={7}/>
  </>);
}

// ================= หน้าเริ่มที่นี่ =================
function FigFourChapters() {
  return (
    <EasyFig title="4 บท = 4 ภาพ" sub="จำภาพนี้ได้ ก็แยกได้ว่าโจทย์ข้อไหนเป็นบทไหน"
      note={<>บท ① ② ③ ให้<b>ตาราง x, y</b> เหมือนกัน ต่างกันที่<b>เส้น</b>: ① ใกล้จุด (ไม่ต้องผ่าน) · ② ผ่านทุกจุด เส้นเดียว · ③ ผ่านทุกจุด แต่ต่อทีละท่อน · บท ④ ⑤ ให้<b>สมการ</b> — แต่ละสมการคือเส้นหนึ่งเส้น คำตอบคือจุดที่ทุกเส้นตัดกัน</>}>
      <div className="efig-grid">
        <EfMini t="① Regression" s="เส้น “ใกล้” ทุกจุด"><EfMiniReg/></EfMini>
        <EfMini t="② Interpolation" s="เส้น “ผ่าน” ทุกจุด"><EfMiniInterp/></EfMini>
        <EfMini t="③ Spline" s="ต่อเส้นทีละช่วง"><EfMiniSpline/></EfMini>
        <EfMini t="④ ⑤ Ax = b" s="หาจุดที่ทุกสมการเป็นจริง"><EfMiniAxb/></EfMini>
      </div>
    </EasyFig>
  );
}

// ================= ① Regression =================
function efRegBase(p) {
  return <EfAxes p={p} xt={[0, 20, 40, 60, 80]} yt={[10, 20, 30, 40, 50]}/>;
}
function FigLinReg() {
  const p = efPlot(520, 300, { l: 46, r: 26, t: 28, b: 40 }, [0, 90], [0, 52]), { sx, sy } = p;
  const f = efPoly(EF_RX, EF_RY, 1);
  return (
    <EasyFig title="LINEAR REGRESSION" sub={<>หาเส้นตรง <M>{`f(x)=a_0+a_1x`}</M> ที่ <b>ใกล้</b> ทุกจุดที่สุด</>}
      note={<>
        <div className="ef-keys"><EfKey dot c={EF.blue}>ข้อมูลการบ้าน 11 (9 จุด)</EfKey><EfKey c={EF.red}>เส้นที่หาได้ f(x) = 1.833333 + 0.529333x</EfKey><EfKey dash c={EF.pink}>ε = ระยะจากจุดถึงเส้น</EfKey></div>
        <b>Least-Squares</b> = เลือก a₀, a₁ ที่ทำให้ <M>{`\\sum \\varepsilon^2`}</M> น้อยที่สุด · เส้น<b>ไม่ต้องผ่าน</b>จุดไหนเลย · ได้เส้นแล้วแทน x = 65 ก็ได้คำตอบ (จุดเหลือง)
      </>}>
      <svg viewBox="0 0 520 300" className="efig-svg">
        {efRegBase(p)}
        {EF_RX.map((x, i) => <line key={i} x1={sx(x)} x2={sx(x)} y1={sy(EF_RY[i])} y2={sy(f(x))} stroke={EF.pink} strokeWidth="1.8" strokeDasharray="3 3"/>)}
        <path d={plotPath(f, 3, 87, sx, sy, 2)} stroke={EF.red} strokeWidth="3.4" fill="none"/>
        <line x1={sx(65)} x2={sx(65)} y1={sy(0)} y2={sy(f(65))} stroke={EF.yellow} strokeWidth="1.3" strokeDasharray="4 4"/>
        {EF_RX.map((x, i) => <EfDot key={i} x={sx(x)} y={sy(EF_RY[i])}/>)}
        <EfDot x={sx(65)} y={sy(f(65))} c={EF.yellow} r={6.5}/>
        <EfT x={sx(65) - 8} y={sy(7)} c={EF.yellow} cls="ef-num" a="end">f(65) = 36.24</EfT>
        <EfT x={sx(20) + 9} y={(sy(EF_RY[2]) + sy(f(20))) / 2 + 6} c={EF.pink} cls="ef-ax">ε</EfT>
        <line x1={sx(13)} y1={sy(38.5)} x2={sx(29)} y2={sy(f(29)) - 4} stroke={EF.text} strokeWidth="1.2"/>
        <EfT x={sx(4)} y={sy(41)} c={EF.text}>เส้นที่ใกล้ที่สุด (best fit)</EfT>
      </svg>
    </EasyFig>
  );
}
function FigPolyReg() {
  const p = efPlot(520, 300, { l: 46, r: 26, t: 28, b: 40 }, [0, 90], [0, 52]), { sx, sy } = p;
  const f = efPoly(EF_RX, EF_RY, 2), g = efPoly(EF_RX, EF_RY, 1);
  return (
    <EasyFig title="POLYNOMIAL REGRESSION (m = 2)" sub={<>หาเส้น<b>โค้ง</b> <M>{`f(x)=a_0+a_1x+a_2x^2`}</M> ที่ใกล้ทุกจุดที่สุด</>}
      note={<>
        <div className="ef-keys"><EfKey dot c={EF.blue}>ข้อมูลชุดเดียวกับข้อ 1</EfKey><EfKey c={EF.red}>พาราโบลาที่หาได้</EfKey><EfKey dash c={EF.faint}>เส้นตรงของข้อ 1 (เทียบ)</EfKey><EfKey dash c={EF.pink}>ε</EfKey></div>
        หลักเดิมทุกอย่าง (ทำให้ <M>{`\\sum \\varepsilon^2`}</M> น้อยสุด) แค่ยอมให้เส้น<b>โค้งได้</b> ⇒ ตัวไม่รู้เพิ่มเป็น 3 ตัว (a₀ a₁ a₂) ระบบจึงเป็น 3 × 3 · ข้อมูลนี้เกือบเป็นเส้นตรงอยู่แล้ว a₂ จึงเล็กมาก (−0.0018431373) เส้นโค้งลงนิดเดียว · f(65) = 36.461176
      </>}>
      <svg viewBox="0 0 520 300" className="efig-svg">
        {efRegBase(p)}
        <path d={plotPath(g, 3, 87, sx, sy, 2)} stroke={EF.faint} strokeWidth="1.6" strokeDasharray="6 5" fill="none"/>
        {EF_RX.map((x, i) => <line key={i} x1={sx(x)} x2={sx(x)} y1={sy(EF_RY[i])} y2={sy(f(x))} stroke={EF.pink} strokeWidth="1.8" strokeDasharray="3 3"/>)}
        <path d={plotPath(f, 3, 87, sx, sy, 120)} stroke={EF.red} strokeWidth="3.4" fill="none"/>
        <line x1={sx(65)} x2={sx(65)} y1={sy(0)} y2={sy(f(65))} stroke={EF.yellow} strokeWidth="1.3" strokeDasharray="4 4"/>
        {EF_RX.map((x, i) => <EfDot key={i} x={sx(x)} y={sy(EF_RY[i])}/>)}
        <EfDot x={sx(65)} y={sy(f(65))} c={EF.yellow} r={6.5}/>
        <EfT x={sx(65) - 8} y={sy(7)} c={EF.yellow} cls="ef-num" a="end">f(65) = 36.461176</EfT>
        <line x1={sx(13)} y1={sy(38.5)} x2={sx(29)} y2={sy(f(29)) - 4} stroke={EF.text} strokeWidth="1.2"/>
        <EfT x={sx(4)} y={sy(41)} c={EF.text}>เส้นโค้งที่ใกล้ที่สุด</EfT>
      </svg>
    </EasyFig>
  );
}
// Multiple: ข้อมูลตัวอย่าง 2 ตัวแปร (การบ้านมี 3 ตัว = ต้องใช้ 4 มิติ วาดไม่ได้)
const EF_MP = [[0.5, 0.5, 2.1], [1, 3, 3.6], [2, 1, 3.5], [3, 3.5, 6.3], [3.5, 0.8, 3.1], [1.5, 2, 3.0], [2.5, 2.5, 5.0], [0.8, 3.6, 4.9], [3.2, 2, 4.0]];
function FigMultiReg() {
  const a = efFit(EF_MP.map(([u, v]) => [1, u, v]), EF_MP.map(q => q[2]));
  const pl = (u, v) => a[0] + a[1] * u + a[2] * v;
  const P = (u, v, y) => [70 + 62 * u + 36 * v, 252 + 12 * u - 26 * v - 24 * y];
  const pts = (arr) => arr.map(q => P(...q).join(",")).join(" ");
  const ln = (q1, q2, props) => { const [x1, y1] = P(...q1), [x2, y2] = P(...q2); return <line x1={x1} y1={y1} x2={x2} y2={y2} {...props}/>; };
  const grid = [1, 2, 3].flatMap(k => [ln([k, 0, 0], [k, 4, 0], { key: "u" + k, stroke: EF.grid, strokeWidth: 1.2 }), ln([0, k, 0], [4, k, 0], { key: "v" + k, stroke: EF.grid, strokeWidth: 1.2 })]);
  const [ox, oy] = P(0, 0, 0), [e1x, e1y] = P(4.5, 0, 0), [e2x, e2y] = P(0, 4.6, 0), [e3x, e3y] = P(0, 0, 7.6);
  return (
    <EasyFig title="MULTIPLE LINEAR REGRESSION" sub={<>หลายตัวแปร: เส้นกลายเป็น<b>แผ่นระนาบ</b> <M>{`f=a_0+a_1x_1+a_2x_2`}</M> ที่ใกล้ทุกจุดที่สุด</>}
      note={<>
        <div className="ef-keys"><EfKey dot c={EF.blue}>ข้อมูล (x₁, x₂, y)</EfKey><EfKey c={EF.red}>ระนาบที่หาได้</EfKey><EfKey dash c={EF.pink}>ε = ระยะจากจุดถึงระนาบ</EfKey></div>
        <b>รูปนี้ใช้ข้อมูลตัวอย่าง 2 ตัวแปร</b> — การบ้าน 11 ข้อ 3 มี x₁ x₂ x₃ (3 ตัว) ต้องใช้ 4 มิติ จึงวาดไม่ได้ · หลักเดิม: เลือก a ทุกตัวให้ <M>{`\\sum \\varepsilon^2`}</M> น้อยสุด · ตัวแปรเพิ่ม 1 ตัว = ตัวไม่รู้ a เพิ่ม 1 ตัว (การบ้านมี a₀–a₃ จึงเป็นระบบ 4 × 4) · จุดจาง = อยู่ใต้ระนาบ
      </>}>
      <svg viewBox="0 0 520 320" className="efig-svg">
        <polygon points={pts([[0, 0, 0], [4, 0, 0], [4, 4, 0], [0, 4, 0]])} fill="rgba(125,145,170,0.06)" stroke={EF.grid}/>
        {grid}
        <line x1={ox} y1={oy} x2={e1x} y2={e1y} stroke={EF.axis} strokeWidth="1.6"/>
        <line x1={ox} y1={oy} x2={e2x} y2={e2y} stroke={EF.axis} strokeWidth="1.6"/>
        <line x1={ox} y1={oy} x2={e3x} y2={e3y} stroke={EF.axis} strokeWidth="1.6"/>
        <EfT x={e1x + 6} y={e1y + 6} c={EF.dim} cls="ef-ax">x₁</EfT>
        <EfT x={e2x + 6} y={e2y + 2} c={EF.dim} cls="ef-ax">x₂</EfT>
        <EfT x={e3x - 8} y={e3y - 4} c={EF.dim} cls="ef-ax" a="end">y</EfT>
        {EF_MP.map(([u, v, y], i) => { const [fx, fy] = P(u, v, 0), [bx, by] = P(u, v, Math.min(y, pl(u, v))); return (
          <g key={i}><line x1={fx} y1={fy} x2={bx} y2={by} stroke={EF.faint} strokeWidth="1" strokeDasharray="1 3"/><circle cx={fx} cy={fy} r="2.2" fill={EF.faint}/></g>); })}
        <polygon points={pts([[0, 0, pl(0, 0)], [4, 0, pl(4, 0)], [4, 4, pl(4, 4)], [0, 4, pl(0, 4)]])} fill="rgba(240,105,107,0.16)" stroke={EF.red} strokeWidth="2.2"/>
        {EF_MP.map(([u, v, y], i) => { const [x1, y1] = P(u, v, y), [x2, y2] = P(u, v, pl(u, v)); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={EF.pink} strokeWidth="2" strokeDasharray="3 3"/>; })}
        {EF_MP.map(([u, v, y], i) => { const [x1, y1] = P(u, v, y); return <EfDot key={i} x={x1} y={y1} o={y < pl(u, v) ? 0.55 : 1}/>; })}
      </svg>
    </EasyFig>
  );
}

// ================= ② Interpolation =================
function FigRegVsInterp() {
  return (
    <EasyFig title="REGRESSION vs INTERPOLATION" sub="จุดชุดเดียวกัน — ต่างกันที่ “ต้องผ่านจุดไหม”"
      note={<>ข้อมูลวัดจริงมีคลาดเคลื่อน → ใช้ <b>Regression</b> (บท ①) ให้เส้นใกล้ ๆ ก็พอ · ข้อมูลในตารางแม่นแล้ว อยากรู้ค่า<b>ระหว่าง</b>จุด → ใช้ <b>Interpolation</b> (บทนี้) เส้นต้องผ่านทุกจุดที่ใช้พอดี · (จุดในรูปเป็นข้อมูลตัวอย่าง)</>}>
      <div className="efig-grid">
        <EfMini t="Regression" s="ใกล้ทุกจุด · ไม่ผ่าน"><EfMiniReg/></EfMini>
        <EfMini t="Interpolation" s="ผ่านทุกจุดพอดี"><EfMiniInterp/></EfMini>
      </div>
    </EasyFig>
  );
}
function FigDD() {
  const p = efPlot(520, 300, { l: 54, r: 26, t: 28, b: 40 }, [-0.4, 8.8], [9.54, 9.84]), { sx, sy } = p;
  const lin = efLag([EF_IX[0], EF_IX[4]], [EF_IY[0], EF_IY[4]]);
  const quad = efLag([EF_IX[0], EF_IX[2], EF_IX[4]], [EF_IY[0], EF_IY[2], EF_IY[4]]);
  const poly = efLag(EF_IX, EF_IY), q = 4.2;
  return (
    <EasyFig title="NEWTON'S DIVIDED-DIFFERENCE" sub="ลากเส้นพหุนามให้ผ่านจุดที่เลือก แล้วอ่านค่าที่ x ที่ไม่มีในตาราง"
      note={<>
        <div className="ef-keys"><EfKey dot c={EF.blue}>ข้อมูลการบ้าน 9 (เลขบนจุด = จุดที่)</EfKey><EfKey dash c={EF.green}>Linear จุด 1, 5 → 9.683055</EfKey><EfKey c={EF.orange}>Quadratic จุด 1, 3, 5 → 9.681858</EfKey><EfKey c={EF.red}>Polynomial ทุกจุด → 9.686255</EfKey></div>
        ทุกเส้น<b>ผ่านจุดที่มันใช้พอดี</b> (ต่างจาก Regression) · ใช้จุดเพิ่ม 1 จุด = เติมพจน์ C เพิ่ม 1 พจน์ เส้นจึงโค้งตามข้อมูลได้มากขึ้น · ค่าที่ถามอ่านบนเส้นเหลือง x = 4.2 — สามเส้นให้ค่าต่างกันนิดเดียว เพราะข้อมูลเกือบเป็นเส้นตรง (แกน y ในรูปขยายมาก · เส้น Linear กับ Quadratic แทบทับกัน)
      </>}>
      <svg viewBox="0 0 520 300" className="efig-svg">
        <EfAxes p={p} xt={[0, 2, 4, 6, 8]} yt={[9.6, 9.7, 9.8]}/>
        <line x1={sx(q)} x2={sx(q)} y1={p.pad.t} y2={sy(9.54)} stroke={EF.yellow} strokeWidth="1.5" strokeDasharray="4 4"/>
        <EfT x={sx(q) + 6} y={p.pad.t + 6} c={EF.yellow} cls="ef-num">x = 4.2</EfT>
        <path d={plotPath(poly, -0.15, 8.12, sx, sy, 160)} stroke={EF.red} strokeWidth="3" fill="none"/>
        <path d={plotPath(quad, -0.15, 8.4, sx, sy, 120)} stroke={EF.orange} strokeWidth="4" fill="none"/>
        <path d={plotPath(lin, -0.15, 8.4, sx, sy, 2)} stroke={EF.green} strokeWidth="2.2" strokeDasharray="7 5" fill="none"/>
        {EF_IX.map((x, i) => <g key={i}><EfDot x={sx(x)} y={sy(EF_IY[i])}/><EfT x={sx(x)} y={sy(EF_IY[i]) - 13} c={EF.blue} cls="ef-num" a="middle">{i + 1}</EfT></g>)}
        {[lin, quad, poly].map((f, i) => <circle key={i} cx={sx(q)} cy={sy(f(q))} r="4.5" fill={[EF.green, EF.orange, EF.red][i]} stroke="#06080c" strokeWidth="1.2"/>)}
      </svg>
    </EasyFig>
  );
}
function FigLagrange() {
  const p = efPlot(520, 300, { l: 46, r: 26, t: 30, b: 34 }, [-0.6, 8.8], [-0.5, 1.3]), { sx, sy } = p;
  const N = [0, 4, 8], cols = [EF.blue, EF.green, EF.orange], q = 4.2285;
  const L = N.map((_, i) => efLag(N, N.map((__, k) => (k === i ? 1 : 0))));
  return (
    <EasyFig title="LAGRANGE — น้ำหนักของแต่ละจุด" sub={<><M>{`f(x)=y_0L_0+y_1L_1+y_2L_2`}</M> · L แต่ละตัว = 1 ที่จุดตัวเอง และ 0 ที่จุดอื่น</>}
      note={<>
        <div className="ef-keys"><EfKey c={EF.blue}>L₀ (จุด x = 0)</EfKey><EfKey c={EF.green}>L₁ (จุด x = 4)</EfKey><EfKey c={EF.orange}>L₂ (จุด x = 8)</EfKey></div>
        การบ้าน 10 ข้อ Quadratic (x ย่อสเกล ÷ 10,000 แล้ว) · ที่ x = 4.2285 (เส้นเหลือง) อ่านค่า L ได้ L₀ = −0.026931 · L₁ = 0.996737 · L₂ = 0.030194 (รวม = 1 เสมอ) · x ที่ถามอยู่ใกล้จุด x = 4 มาก น้ำหนักเกือบทั้งหมดจึงอยู่ที่ y₁ ⇒ <M>{`f=9.81(-0.026931)+9.6879(0.996737)+9.5682(0.030194)=9.680998`}</M> · ได้เส้นเดียวกับ DD ที่ใช้จุดชุดเดียวกัน
      </>}>
      <svg viewBox="0 0 520 300" className="efig-svg">
        <EfAxes p={p} xt={[0, 4, 8]} yt={[1]} xl="x" yl="L" yAt={0}/>
        <line x1={p.pad.l} x2={p.W - p.pad.r} y1={sy(1)} y2={sy(1)} stroke={EF.faint} strokeDasharray="2 4"/>
        <EfT x={p.pad.l - 8} y={sy(0) + 4} c={EF.faint} cls="ef-tick" a="end">0</EfT>
        <line x1={sx(q)} x2={sx(q)} y1={p.pad.t} y2={p.H - p.pad.b} stroke={EF.yellow} strokeWidth="1.5" strokeDasharray="4 4"/>
        <EfT x={sx(q) + 6} y={p.H - p.pad.b - 6} c={EF.yellow} cls="ef-num">x = 4.2285</EfT>
        {L.map((f, i) => <path key={i} d={plotPath(f, -0.4, 8.6, sx, sy, 160)} stroke={cols[i]} strokeWidth="2.8" fill="none"/>)}
        {N.map((x, i) => N.map((x2, k) => k === i
          ? <EfDot key={i + "" + k} x={sx(x)} y={sy(1)} c={cols[i]} r={6.5}/>
          : <circle key={i + "" + k} cx={sx(x2)} cy={sy(0)} r="4" fill="#06080c" stroke={cols[i]} strokeWidth="1.8"/>))}
        {N.map((x, i) => <EfT key={i} x={sx(x) + (i === 2 ? -10 : 10)} y={sy(1) - 12} c={cols[i]} cls="ef-ax" a={i === 2 ? "end" : "start"}>{["L₀", "L₁", "L₂"][i]} = 1</EfT>)}
        {L.map((f, i) => <circle key={i} cx={sx(q)} cy={sy(f(q))} r="4.5" fill={cols[i]} stroke="#06080c" strokeWidth="1.2"/>)}
      </svg>
    </EasyFig>
  );
}

// ================= ③ Spline =================
function FigSpline({ kind }) {
  const p = efPlot(520, 300, { l: 46, r: 26, t: 28, b: 40 }, [1, 11], [0, 80]), { sx, sy } = p;
  const seg = (i) => {
    const a = EF_SX[i], b = EF_SX[i + 1];
    if (kind === "lin") return x => EF_SY[i] + (EF_SY[i + 1] - EF_SY[i]) / (b - a) * (x - a);
    if (kind === "quad") { const [A, B, C] = EF_QUAD[i]; return x => A * x * x + B * x + C; }
    return efCubic;
  };
  const f = seg(1), q = 4.5, fq = f(q);
  const meta = {
    lin: { t: "LINEAR SPLINE", s: "ลากเส้นตรงต่อจุดทีละคู่ — ค่าที่ x ไหน ใช้เส้นของช่วงนั้น", v: "8.625",
      n: <>แต่ละช่วงเป็น<b>เส้นตรงคนละเส้น</b> หักมุมที่รอยต่อ · x = 4.5 อยู่ในช่วงที่ 2 (ระหว่าง x = 4 กับ 6) ⇒ ใช้แค่ 2 จุดนั้น: <M>{`f(4.5)=8+\\frac{10.5-8}{6-4}(4.5-4)=8.625`}</M></> },
    quad: { t: "QUADRATIC SPLINE", s: "แต่ละช่วงเป็นพาราโบลา ต่อกันที่รอยต่อโดยความชันเท่ากัน", v: "7.875",
      n: <>รอยต่อไม่หักมุมแล้ว เพราะบังคับให้<b>ความชันซ้าย = ขวา</b> (เส้นประขาวที่ x = 8 คือเส้นสัมผัสร่วม ความชัน 25.75 ทั้งสองข้าง) · ช่วงแรกเป็นเส้นตรงเพราะตั้ง a₁ = 0 · x = 4.5 ใช้พาราโบลาช่วงที่ 2: <M>{`f(4.5)=(4.5)^2-8.75(4.5)+27=7.875`}</M></> },
    cub: { t: "CUBIC SPLINE (natural)", s: "แต่ละช่วงเป็นกำลัง 3 ต่อกันเรียบสุด: ความชันและความโค้งเท่ากัน", v: "7.230469",
      n: <>รอยต่อเรียบทั้ง<b>ความชัน (f′)</b> และ<b>ความโค้ง (f″)</b> · ปลายสองข้างตั้ง f″ = 0 (natural) · ความโค้งที่จุด M = 0, −1.125, 10.5, −1.125, 0 · x = 4.5 ใช้เส้นของช่วงที่ 2 ได้ 7.230469</> },
  }[kind];
  const tan = kind === "quad" ? (x => 39.5 + 25.75 * (x - 8)) : null;
  return (
    <EasyFig title={meta.t} sub={meta.s}
      note={<><div className="ef-keys"><EfKey dot c={EF.blue}>ข้อมูลใบ SPLINE (5 จุด)</EfKey><EfKey c={EF.red}>เส้นของแต่ละช่วง</EfKey><EfKey c={EF.yellow}>ช่วงที่ใช้ตอบ f(4.5)</EfKey></div>{meta.n}</>}>
      <svg viewBox="0 0 520 300" className="efig-svg">
        <EfAxes p={p} xt={[2, 4, 6, 8, 10]} yt={[20, 40, 60, 80]}/>
        {EF_SX.slice(1, -1).map(x => <line key={x} x1={sx(x)} x2={sx(x)} y1={p.pad.t} y2={sy(0)} stroke={EF.faint} strokeDasharray="2 5"/>)}
        {[0, 1, 2, 3].map(i => <EfT key={i} x={sx(EF_SX[i] + 1)} y={sy(0) + 19} c={EF.dim} cls="ef-lab-s" a="middle">ช่วง {i + 1}</EfT>)}
        {[0, 1, 2, 3].map(i => <path key={i} d={plotPath(seg(i), EF_SX[i], EF_SX[i + 1], sx, sy, kind === "lin" ? 2 : 80)}
          stroke={i === 1 ? EF.yellow : EF.red} strokeWidth={i === 1 ? 3.6 : 3} fill="none"/>)}
        {tan && <path d={plotPath(tan, 7.1, 8.9, sx, sy, 2)} stroke={EF.text} strokeWidth="1.6" strokeDasharray="5 4" fill="none"/>}
        {EF_SX.map((x, i) => <EfDot key={i} x={sx(x)} y={sy(EF_SY[i])}/>)}
        <line x1={sx(q)} y1={sy(fq) - 6} x2={sx(3.2)} y2={sy(27)} stroke={EF.yellow} strokeWidth="1.2"/>
        <EfDot x={sx(q)} y={sy(fq)} c={EF.yellow} r={5.5}/>
        <EfT x={sx(1.3)} y={sy(31)} c={EF.yellow} cls="ef-num">f(4.5) = {meta.v}</EfT>
      </svg>
    </EasyFig>
  );
}

// ================= ④ Ax = b แบบตรง =================
function FigIntersect() {
  const p = efPlot(520, 300, { l: 46, r: 30, t: 28, b: 40 }, [-0.5, 3.2], [-0.5, 3.6]), { sx, sy } = p;
  return (
    <EasyFig title="Ax = b คือการหาจุดตัด" sub="1 สมการ = 1 เส้น · คำตอบ = จุดที่อยู่บนทุกเส้นพร้อมกัน"
      note={<>ระบบในรูปเป็นตัวอย่าง 2 ตัวแปร (ชุดเดียวกับตัวอย่าง CG หน้า ⑤) · ระบบการบ้าน 6-7 มี 3 ตัวแปร = <b>3 แผ่นระนาบตัดกันที่จุดเดียว</b> (−1, 2, 1) · ทุกวิธีในหน้านี้ได้จุดเดียวกัน ต่างกันแค่<b>ทางเดิน</b> · ถ้า det A = 0 เส้นจะขนานหรือทับกัน ไม่มีจุดตัดจุดเดียว</>}>
      <svg viewBox="0 0 520 300" className="efig-svg">
        <EfAxes p={p} xt={[1, 2, 3]} yt={[1, 2, 3]} xl="x₁" yl="x₂" xAt={0} yAt={0}/>
        <path d={plotPath(x => 5 - 3 * x, 0.47, 1.83, sx, sy, 2)} stroke={EF.blue} strokeWidth="3" fill="none"/>
        <path d={plotPath(x => (5 - x) / 2, -0.45, 3.15, sx, sy, 2)} stroke={EF.green} strokeWidth="3" fill="none"/>
        <line x1={sx(1)} x2={sx(1)} y1={sy(0)} y2={sy(2)} stroke={EF.yellow} strokeDasharray="3 4"/>
        <line x1={sx(0)} x2={sx(1)} y1={sy(2)} y2={sy(2)} stroke={EF.yellow} strokeDasharray="3 4"/>
        <EfDot x={sx(1)} y={sy(2)} c={EF.yellow} r={8}/>
        <EfT x={sx(1) + 14} y={sy(2) - 14} c={EF.yellow} cls="ef-num">(1, 2) = คำตอบ</EfT>
        <EfT x={sx(1.72) + 8} y={sy(0.1)} c={EF.blue} cls="ef-lab">3x₁ + x₂ = 5</EfT>
        <EfT x={sx(2.0)} y={sy(1.5) - 14} c={EF.green} cls="ef-lab">x₁ + 2x₂ = 5</EfT>
      </svg>
    </EasyFig>
  );
}
const EF_AB = [["a", "a", "a", "b"], ["a", "a", "a", "b"], ["a", "a", "a", "b"]];
function FigGauss() {
  return (
    <EasyFig title="GAUSS ELIMINATION" sub="ทำใต้เส้นทแยงเป็น 0 → แก้จากแถวล่างขึ้นบน"
      note={<><div className="ef-keys"><EfKey dot c={EF.yellow}>ตัวหลัก (pivot)</EfKey><EfKey dot c={EF.purple}>ฝั่งขวา b</EfKey><EfKey dot c={EF.green}>ช่องที่ทำให้เป็น 0</EfKey></div>
        แถวล่างสุดเหลือตัวแปรเดียว ⇒ ได้ x₃ ทันที · เอา x₃ ไปแทนแถวกลางได้ x₂ · เอาทั้งคู่ไปแทนแถวบนได้ x₁ (การบ้าน: x₃ = 1 → x₂ = 2 → x₁ = −1)</>}>
      <svg viewBox="0 0 520 190" className="efig-svg">
        <EfMat x={14} y={44} cells={EF_AB} cs={26} aug={1} label="[A | b]"/>
        <EfArrow x1={132} y1={83} x2={196} y2={83} c={EF.dim}/>
        <EfT x={164} y={56} c={EF.text} cls="ef-lab-s" a="middle">① ทำล่าง</EfT>
        <EfT x={164} y={73} c={EF.text} cls="ef-lab-s" a="middle">เป็น 0</EfT>
        <EfMat x={208} y={44} cells={[["p", "a", "a", "b"], ["0", "p", "a", "b"], ["0", "0", "p", "b"]]} cs={26} aug={1} label="สามเหลี่ยมบน"/>
        <EfArrow x1={326} y1={83} x2={388} y2={83} c={EF.dim}/>
        <EfT x={357} y={56} c={EF.text} cls="ef-lab-s" a="middle">② แทนค่า</EfT>
        <EfT x={357} y={73} c={EF.text} cls="ef-lab-s" a="middle">ย้อนกลับ</EfT>
        {[["x₁ = −1", "③"], ["x₂ = 2", "②"], ["x₃ = 1", "①"]].map(([t, o], i) => <g key={i}>
          <EfT x={398} y={62 + i * 26} c={EF.green} cls="ef-num">{t}</EfT><EfT x={478} y={62 + i * 26} c={EF.yellow} cls="ef-lab-s">{o}</EfT></g>)}
        <EfArrow x1={505} y1={118} x2={505} y2={46} c={EF.yellow} w={1.8} head={8}/>
        <EfT x={448} y={144} c={EF.dim} cls="ef-lab-s" a="middle">หาจากล่างขึ้นบน</EfT>
      </svg>
    </EasyFig>
  );
}
function FigJordan() {
  return (
    <EasyFig title="GAUSS-JORDAN" sub="ทำทั้งบนและล่างเป็น 0 + ตัวหลักเป็น 1 → อ่านคำตอบได้เลย"
      note={<>ต่างจาก Gauss แค่ทำต่ออีกครึ่ง: ล้างช่อง<b>เหนือ</b>ทแยงด้วย และหารแถวให้ตัวหลักเป็น 1 ⇒ ด้านซ้ายกลายเป็น I (เมทริกซ์เอกลักษณ์) · คอลัมน์ขวาคือคำตอบทันที <b>ไม่ต้องแทนย้อนกลับ</b></>}>
      <svg viewBox="0 0 520 190" className="efig-svg">
        <EfMat x={14} y={44} cells={EF_AB} aug={1} label="[A | b]"/>
        <EfArrow x1={138} y1={86} x2={232} y2={86} c={EF.dim}/>
        <EfT x={185} y={58} c={EF.text} cls="ef-lab-s" a="middle">บน+ล่าง = 0</EfT>
        <EfT x={185} y={75} c={EF.text} cls="ef-lab-s" a="middle">ตัวหลัก = 1</EfT>
        <EfMat x={244} y={44} cells={[["1", "0", "0", "x:−1"], ["0", "1", "0", "x:2"], ["0", "0", "1", "x:1"]]} aug={1} label="[I | x]"/>
        <EfArrow x1={366} y1={86} x2={392} y2={86} c={EF.dim}/>
        <EfT x={400} y={74} c={EF.green} cls="ef-lab">คอลัมน์ขวา</EfT>
        <EfT x={400} y={96} c={EF.green} cls="ef-lab">= คำตอบเลย</EfT>
        <EfT x={400} y={120} c={EF.dim} cls="ef-lab-s">x = (−1, 2, 1)</EfT>
      </svg>
    </EasyFig>
  );
}
function FigInverse() {
  const I3 = [["a", "a", "a", "1", "0", "0"], ["a", "a", "a", "0", "1", "0"], ["a", "a", "a", "0", "0", "1"]];
  const R3 = [["1", "0", "0", "i", "i", "i"], ["0", "1", "0", "i", "i", "i"], ["0", "0", "1", "i", "i", "i"]];
  return (
    <EasyFig title="MATRIX INVERSION" sub="ต่อ I ไว้ข้างขวา ทำ Gauss-Jordan → ฝั่งขวากลายเป็น A⁻¹ → x = A⁻¹b"
      note={<><div className="ef-keys"><EfKey dot c={EF.orange}>ช่องของ A⁻¹</EfKey><EfKey dot c={EF.purple}>b</EfKey><EfKey dot c={EF.green}>คำตอบ x</EfKey></div>
        ทำแถวเหมือน Gauss-Jordan ทุกอย่าง แต่ฝั่งขวาเป็น I แทน b ⇒ ซ้ายกลายเป็น I เมื่อไร ขวาคือ A⁻¹ · จากนั้น<b>คูณเมทริกซ์</b> A⁻¹ กับ b ได้ x (การบ้าน: A⁻¹ = (1/22)[[6,5,19],[8,3,7],[10,1,17]])</>}>
      <svg viewBox="0 0 520 270" className="efig-svg">
        <EfMat x={12} y={30} cells={I3} cs={24} aug={3} label="[A | I]"/>
        <EfArrow x1={172} y1={66} x2={290} y2={66} c={EF.dim}/>
        <EfT x={231} y={52} c={EF.text} cls="ef-lab-s" a="middle">Gauss-Jordan</EfT>
        <EfMat x={302} y={30} cells={R3} cs={24} aug={3} label="[I | A⁻¹]"/>
        <EfT x={70} y={202} c={EF.text} cls="ef-lab" a="middle">แล้ว</EfT>
        <EfMat x={118} y={162} cells={[["x:−1"], ["x:2"], ["x:1"]]} cs={26} label="x"/>
        <EfT x={162} y={207} c={EF.text} cls="ef-ax" a="middle">=</EfT>
        <EfMat x={184} y={162} cells={[["i", "i", "i"], ["i", "i", "i"], ["i", "i", "i"]]} cs={26} label="A⁻¹"/>
        <EfMat x={278} y={162} cells={[["b:9"], ["b:0"], ["b:−4"]]} cs={26} label="b"/>
        <EfT x={330} y={196} c={EF.dim} cls="ef-lab-s">แถว A⁻¹ · b</EfT>
        <EfT x={330} y={216} c={EF.dim} cls="ef-lab-s">= คำตอบทีละตัว</EfT>
      </svg>
    </EasyFig>
  );
}
function FigLU() {
  return (
    <EasyFig title="LU DECOMPOSITION" sub="แยก A เป็น L (สามเหลี่ยมล่าง) × U (สามเหลี่ยมบน) แล้วแก้ 2 รอบ"
      note={<><div className="ef-keys"><EfKey dot c={EF.blue}>ℓ ใน L = ตัวคูณ m ของ Gauss</EfKey><EfKey dot c={EF.red}>u ใน U = แถวหลังกำจัดแล้ว</EfKey></div>
        U คือเมทริกซ์สามเหลี่ยมบนที่ Gauss ได้ และ L เก็บตัวคูณที่ใช้กำจัด (ทแยงเป็น 1 แบบ Doolittle) · แก้ 2 รอบ: <b>① Ly = b</b> หา y จากบนลงล่าง (forward) · <b>② Ux = y</b> หา x จากล่างขึ้นบน (back) · ข้อดี: b เปลี่ยนกี่ครั้งก็ใช้ L, U เดิมได้</>}>
      <svg viewBox="0 0 520 200" className="efig-svg">
        <EfMat x={16} y={36} cells={[["a", "a", "a"], ["a", "a", "a"], ["a", "a", "a"]]} label="A"/>
        <EfT x={122} y={84} c={EF.text} cls="ef-ax" a="middle">=</EfT>
        <EfMat x={142} y={36} cells={[["1", "0", "0"], ["l:ℓ", "1", "0"], ["l:ℓ", "l:ℓ", "1"]]} label="L"/>
        <EfT x={248} y={84} c={EF.text} cls="ef-ax" a="middle">×</EfT>
        <EfMat x={268} y={36} cells={[["u:u", "u:u", "u:u"], ["0", "u:u", "u:u"], ["0", "0", "u:u"]]} label="U"/>
        <EfArrow x1={392} y1={40} x2={392} y2={116} c={EF.blue} w={2} head={8}/>
        <EfT x={404} y={62} c={EF.blue} cls="ef-lab">① Ly = b</EfT>
        <EfT x={404} y={82} c={EF.dim} cls="ef-lab-s">บน → ล่าง</EfT>
        <EfArrow x1={392} y1={186} x2={392} y2={128} c={EF.red} w={2} head={8}/>
        <EfT x={404} y={150} c={EF.red} cls="ef-lab">② Ux = y</EfT>
        <EfT x={404} y={170} c={EF.dim} cls="ef-lab-s">ล่าง → บน</EfT>
      </svg>
    </EasyFig>
  );
}
function FigCholesky() {
  return (
    <EasyFig title="CHOLESKY DECOMPOSITION" sub="A สมมาตร → แยกเป็น L × Lᵀ (Lᵀ = L พลิกตามเส้นทแยง)"
      note={<>ช่องสีเดียวกันใน A คือ<b>คู่กระจกที่เท่ากัน</b> (a₁₂ = a₂₁ …) = สมมาตร · ใช้ได้เมื่อ A สมมาตรและ positive definite · ระบบการบ้าน<b>ไม่สมมาตร</b> จึงคูณ Aᵀ ทั้งสองข้างก่อน: <M>{`A^TA\\,x=A^Tb`}</M> (AᵀA สมมาตรเสมอ) · ได้ L แล้วแก้ 2 รอบเหมือน LU: Ly = Aᵀb (บนลงล่าง) → Lᵀx = y (ล่างขึ้นบน)</>}>
      <svg viewBox="0 0 520 170" className="efig-svg">
        <EfMat x={16} y={36} cells={[["p", "s1", "s2"], ["s1", "p", "s3"], ["s2", "s3", "p"]]} label="A = Aᵀ"/>
        <EfT x={122} y={84} c={EF.text} cls="ef-ax" a="middle">=</EfT>
        <EfMat x={142} y={36} cells={[["l", "0", "0"], ["l", "l", "0"], ["l", "l", "l"]]} label="L"/>
        <EfT x={248} y={84} c={EF.text} cls="ef-ax" a="middle">×</EfT>
        <EfMat x={268} y={36} cells={[["l", "l", "l"], ["0", "l", "l"], ["0", "0", "l"]]} label="Lᵀ"/>
        <EfT x={380} y={70} c={EF.text} cls="ef-lab-s">L กับ Lᵀ</EfT>
        <EfT x={380} y={90} c={EF.text} cls="ef-lab-s">คือตัวเดียวกัน</EfT>
        <EfT x={380} y={110} c={EF.dim} cls="ef-lab-s">⇒ หาแค่ L ตัวเดียว</EfT>
      </svg>
    </EasyFig>
  );
}

// ================= ⑤ Ax = b แบบวนซ้ำ =================
function efJacobi(n) { const out = [[0, 0]]; for (let k = 0; k < n; k++) { const [x, y] = out[k]; out.push([(5 - y) / 3, (5 - x) / 2]); } return out; }
function efGS(n) { const out = [[0, 0]]; let x = 0, y = 0; for (let k = 0; k < n; k++) { x = (5 - y) / 3; out.push([x, y]); y = (5 - x) / 2; out.push([x, y]); } return out; }
function FigIter({ kind }) {
  const p = efPlot(520, 320, { l: 46, r: 30, t: 28, b: 40 }, [-0.25, 2.2], [-0.3, 2.95]), { sx, sy } = p;
  const J = efJacobi(6), G = efGS(4);
  const path = (P, c, w, dash, head) => P.slice(0, -1).map((a, i) => {
    const b = P[i + 1], L = Math.hypot(sx(b[0]) - sx(a[0]), sy(b[1]) - sy(a[1]));
    return L > 14 ? <EfArrow key={i} x1={sx(a[0])} y1={sy(a[1])} x2={sx(b[0])} y2={sy(b[1])} c={c} w={w} dash={dash} head={head} gap={3}/> : null;
  });
  const isJ = kind === "jacobi";
  return (
    <EasyFig title={isJ ? "JACOBI ITERATION" : "GAUSS-SEIDEL"} sub={isJ ? "เดาค่าเริ่ม แล้ววนแทนค่าซ้ำ เดินเข้าหาจุดตัดทีละรอบ" : "เหมือน Jacobi แต่ได้ค่าใหม่ใช้ทันที → เดินเป็นขั้นบันได เข้าเร็วกว่า"}
      note={<><div className="ef-keys"><EfKey c={EF.blue}>สมการ 1: 3x₁ + x₂ = 5</EfKey><EfKey c={EF.green}>สมการ 2: x₁ + 2x₂ = 5</EfKey><EfKey c={EF.red}>ทางเดินของ {isJ ? "Jacobi" : "Gauss-Seidel"}</EfKey>{!isJ && <EfKey dash c={EF.faint}>Jacobi (เทียบ)</EfKey>}</div>{isJ
        ? <>ระบบตัวอย่าง 2 × 2 (ชุดเดียวกับ CG): <M>{`x_1=\\frac{5-x_2}{3},\\ x_2=\\frac{5-x_1}{2}`}</M> · เริ่มเดา (0, 0) · แต่ละรอบหา x₁, x₂ ใหม่จาก<b>ค่ารอบก่อนพร้อมกัน</b> ⇒ กระโดดเฉียงวนเข้าหาจุดตัด (1, 2) · ระยะกระโดดหดลงเรื่อย ๆ เพราะระบบ <b>diagonally dominant</b> (|3| &gt; |1| และ |2| &gt; |1|) — ถ้าไม่ dominant อาจเดินออกไม่กลับ · หยุดเมื่อระยะกระโดดเล็กกว่า ε</>
        : <>ได้ x₁ ใหม่ปุ๊บ เอาไปใช้หา x₂ ในรอบเดียวกันทันที ⇒ เดิน<b>แนวนอน</b>ไปชนเส้นสีฟ้า (สมการ 1) แล้วเดิน<b>แนวตั้ง</b>ไปชนเส้นสีเขียว (สมการ 2) สลับกัน · ถึงจุดตัดเร็วกว่า Jacobi (เส้นประจาง) · การบ้าน 6-7: Gauss-Seidel 9 รอบ · Jacobi 22 รอบ</>}</>}>
      <svg viewBox="0 0 520 320" className="efig-svg">
        <EfAxes p={p} xt={[1, 2]} yt={[1, 2]} xl="x₁" yl="x₂" xAt={0} yAt={0}/>
        <path d={plotPath(x => 5 - 3 * x, 0.68, 1.76, sx, sy, 2)} stroke={EF.blue} strokeWidth="2.6" fill="none"/>
        <path d={plotPath(x => (5 - x) / 2, -0.2, 2.15, sx, sy, 2)} stroke={EF.green} strokeWidth="2.6" fill="none"/>
        {!isJ && path(J, EF.faint, 1.4, "5 4", 7)}
        {isJ ? path(J, EF.red, 2.4, null, 10) : path(G, EF.red, 2.4, null, 10)}
        {(isJ ? J.slice(1, 5) : G.slice(1, 5)).map(([x, y], i) => <circle key={i} cx={sx(x)} cy={sy(y)} r="3.6" fill={EF.red}/>)}
        <EfDot x={sx(0)} y={sy(0)} c={EF.text} r={5}/>
        <EfT x={sx(0) + 10} y={sy(0) + 22} c={EF.text} cls="ef-lab-s">เริ่ม (0, 0)</EfT>
        {isJ && <EfT x={sx(J[1][0]) + 10} y={sy(J[1][1]) + 4} c={EF.red} cls="ef-num">x⁽¹⁾</EfT>}
        {isJ && <EfT x={sx(J[2][0]) - 12} y={sy(J[2][1]) + 4} c={EF.red} cls="ef-num" a="end">x⁽²⁾</EfT>}
        <EfDot x={sx(1)} y={sy(2)} c={EF.yellow} r={7}/>
        <EfT x={sx(1) - 10} y={sy(2.6)} c={EF.yellow} cls="ef-num" a="end">คำตอบ (1, 2)</EfT>
      </svg>
    </EasyFig>
  );
}
function FigCG() {
  const xs = [1, 2], unit = 64;                 // สเกลเท่ากันทั้งสองแกน วงรีจึงไม่เบี้ยว
  const W = 520, H = 400, pad = { l: 30, r: 20, t: 24, b: 30 };
  const xd = [-1.7, -1.7 + (W - pad.l - pad.r) / unit], yd = [2 - (H - pad.t - pad.b) / unit / 2, 2 + (H - pad.t - pad.b) / unit / 2];
  const p = efPlot(W, H, pad, xd, yd), { sx, sy } = p;
  // CG ตามสูตร: R = AX − B · D₀ = −R₀ · λ = −DᵀR / DᵀAD · α = RᵀAD / DᵀAD · D = −R + αD
  const cg = [[0, 0]]; { let X = [0, 0], R = efMul(EF_A2, X).map((v, i) => v - EF_B2[i]), D = R.map(v => -v);
    for (let k = 0; k < 2; k++) { const AD = efMul(EF_A2, D), lam = -efDot(D, R) / efDot(D, AD);
      X = X.map((v, i) => v + lam * D[i]); cg.push(X); R = efMul(EF_A2, X).map((v, i) => v - EF_B2[i]);
      const al = efDot(R, efMul(EF_A2, D)) / efDot(D, efMul(EF_A2, D)); D = R.map((v, i) => -v + al * D[i]); } }
  const ell = (c) => { let d = ""; for (let k = 0; k <= 180; k++) { const t = 2 * Math.PI * k / 180, u = [Math.cos(t), Math.sin(t)];
      const r = Math.sqrt(2 * c / efDot(u, efMul(EF_A2, u))); d += (k ? "L" : "M") + sx(xs[0] + r * u[0]).toFixed(1) + "," + sy(xs[1] + r * u[1]).toFixed(1); } return d + "Z"; };
  const levels = [0.357143, 1.4, 3.2, 5.3, 7.5];
  return (
    <EasyFig title="CONJUGATE GRADIENT" sub={<>มอง <M>{`f(X)=\\tfrac12X^TAX-B^TX`}</M> เป็นชามวงรี — ก้นชามคือคำตอบของ AX = B</>}
      note={<><div className="ef-keys"><EfKey c={EF.blue}>เส้นระดับของชาม</EfKey><EfKey c={EF.red}>CG: X₀ → X₁ → X₂ (2 รอบ)</EfKey></div>
        ระบบตัวอย่าง 2 × 2: A = [[3,1],[1,2]], B = (5, 5) · รอบแรกเดินทิศ D₀ = −R₀ (ลงชันที่สุด) ไกล λ₀ = 0.285714 · รอบสองผสมทิศใหม่ด้วย α₀ = 0.020408 ให้<b>ไม่ทำลายงานรอบก่อน</b> แล้วเดิน λ₁ = 0.7 ถึงก้นชาม (1, 2) พอดี · กฎ: <b>n ตัวแปร ถึงก้นชามภายใน n รอบ</b> (การบ้าน 8 เป็น 4 × 4 → 4 รอบ) · ใช้ได้เมื่อ A สมมาตรและ positive definite (ชามจึงเป็นวงรีหงายขึ้น)</>}>
      <svg viewBox={`0 0 ${W} ${H}`} className="efig-svg">
        <defs><clipPath id="ef-cg-clip"><rect x={pad.l} y={pad.t} width={W - pad.l - pad.r} height={H - pad.t - pad.b}/></clipPath></defs>
        <line x1={pad.l} x2={W - pad.r} y1={sy(0)} y2={sy(0)} stroke={EF.axis} strokeWidth="1.2"/>
        <line x1={sx(0)} x2={sx(0)} y1={pad.t} y2={H - pad.b} stroke={EF.axis} strokeWidth="1.2"/>
        <EfT x={W - pad.r - 4} y={sy(0) + 20} c={EF.dim} cls="ef-ax" a="end">x₁</EfT>
        <EfT x={sx(0) + 8} y={pad.t + 14} c={EF.dim} cls="ef-ax">x₂</EfT>
        <g clipPath="url(#ef-cg-clip)">{levels.map((c, i) => <path key={i} d={ell(c)} fill="none" stroke={EF.blue} strokeWidth="1.5" opacity={1 - i * 0.15}/>)}</g>
        {cg.slice(0, -1).map((a, i) => <EfArrow key={i} x1={sx(a[0])} y1={sy(a[1])} x2={sx(cg[i + 1][0])} y2={sy(cg[i + 1][1])} c={EF.red} w={3} head={11} gap={5}/>)}
        <EfDot x={sx(0)} y={sy(0)} c={EF.text} r={5.5}/>
        <EfT x={sx(0) - 10} y={sy(0) + 20} c={EF.text} cls="ef-num" a="end">X₀</EfT>
        <EfDot x={sx(cg[1][0])} y={sy(cg[1][1])} c={EF.red} r={5.5}/>
        <EfT x={sx(cg[1][0]) + 12} y={sy(cg[1][1]) + 6} c={EF.red} cls="ef-num">X₁</EfT>
        <EfDot x={sx(1)} y={sy(2)} c={EF.yellow} r={7}/>
        <EfT x={sx(1) - 12} y={sy(2) - 12} c={EF.yellow} cls="ef-num" a="end">X₂ = (1, 2)</EfT>
        <EfT x={sx(0.71) + 12} y={sy(0.71) + 18} c={EF.red} cls="ef-num">D₀ (ไกล λ₀)</EfT>
        <EfT x={sx(1.21) + 14} y={sy(1.71) - 6} c={EF.red} cls="ef-num">D₁ (ไกล λ₁)</EfT>
        <EfT x={W - pad.r - 8} y={pad.t + 34} c={EF.text} cls="ef-lab" a="end">2 ตัวแปร → 2 รอบ</EfT>
        <EfT x={W - pad.r - 8} y={pad.t + 56} c={EF.dim} cls="ef-lab-s" a="end">ก้นชาม = คำตอบ</EfT>
      </svg>
    </EasyFig>
  );
}

Object.assign(window, {
  EasyFig, FigFourChapters, FigLinReg, FigPolyReg, FigMultiReg, FigRegVsInterp, FigDD, FigLagrange,
  FigSpline, FigIntersect, FigGauss, FigJordan, FigInverse, FigLU, FigCholesky, FigIter, FigCG,
});
