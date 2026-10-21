// เส้นทางเรียน — kim ขอ 20 ต.ค. 2569: "ขี้เกียจกดไปกดมา กดถัดไปเรื่อย ๆ" + หน้าแรกเป็นภาพรวม
// + แต่ละเรื่องอธิบายสั้น ๆ ว่า "คืออะไร + ใช้สูตรนี้" ไม่ลึก
// ลำดับขั้น = แผน 6 วันใน lessons/plan.jsx (อ. 20 → จ. 26 ต.ค.)
// แต่ละขั้นชี้ไปที่ของที่มีอยู่แล้วในบทเรียน (หน้า + หัวข้อ) ไม่ได้ก๊อปเนื้อหามา ⇒ แก้บทเรียนแล้วเส้นทางตามเอง
//   at: ["sect", ข้อความในหัว h2] · ["h3", ข้อความใน h3] · ["prob", ข้อความใน label ของ Problem] · null = บนสุดของหน้า
// ⚠ ถ้าเปลี่ยนชื่อหัวข้อในบทเรียน ต้องแก้ข้อความใน at ด้วย ไม่งั้นปุ่มถัดไปจะพาไปแค่หัวหน้า

const PATH_STEP_KEY = "numer-path-step";
const PATH_ON_KEY = "numer-path-on";

const PATH_STEPS = [
  { day: "เริ่ม", title: "ภาพรวมไฟนอล 1 หน้า", page: "path", at: ["sect", "ภาพรวมไฟนอล"],
    what: "ไฟนอลมี 4 คำถามใหญ่: แก้ระบบสมการ · เติมค่าระหว่างจุด · ต่อเส้นทีละช่วง · หาเส้นที่ใกล้ข้อมูลที่สุด",
    todo: "อ่านหน้านี้ให้จบ (~15 นาที) แล้วกด ถัดไป" },

  // ── อังคาร 20 ──
  { day: "อ. 20", title: "Linear Regression ทำมือ (การบ้าน 11 ข้อ 1)", page: "regression", at: ["h3", "ข้อ 1.1 · Linear"],
    what: "หาเส้นตรงที่ใกล้ทุกจุดที่สุด — ไม่ต้องผ่านจุด เพราะข้อมูลมีความคลาดเคลื่อน",
    how: `a_1=\\frac{n\\sum xy-\\sum x\\sum y}{n\\sum x^2-(\\sum x)^2},\\quad a_0=\\bar y-a_1\\bar x`,
    todo: "อ่าน 5 ขั้น → ปิดเฉลยทำเอง → เช็คด้วย Reg Results y=a+bx · ต้องได้ f(65) = 36.24" },
  { day: "อ. 20", title: "Polynomial m = 2 ทำมือ (ข้อ 2)", page: "regression", at: ["h3", "ข้อ 2.1 · Polynomial"],
    what: "เหมือนข้อ 1 แต่ให้เส้นโค้งได้ (เพิ่มเทอม x²) ⇒ ระบบ 3×3",
    how: `A_{ij}=\\sum x^{i+j},\\quad B_i=\\sum x^{i}y`,
    todo: "ตั้งระบบ 3×3 เอง → Simul Equation · เช็คด้วย y=a+bx+cx² · a₂ ต้องเก็บค่าเต็ม" },
  { day: "อ. 20", title: "Multiple Regression (ข้อ 3)", page: "regression", at: ["sect", "Multiple Linear Regression"],
    what: "x หลายตัว (x₁ x₂ x₃) — แทนที่จะเป็นเส้น กลายเป็นระนาบ",
    how: <span>คอลัมน์ <M>{`[1,x_1,x_2,x_3]`}</M> ⇒ <M>{`A_{ij}=\\sum \\mathrm{col}_i\\,\\mathrm{col}_j`}</M></span>,
    todo: "ตามเดิน 8 ขั้น · ตั้งเมทริกซ์ 4×4 ได้เอง แล้วแก้ด้วย Simul Equation 4 Unknowns" },
  { day: "อ. 20", title: "โค้ด Regression ฟังก์ชันเดียว (โครง R)", page: "regression", at: ["h3", "ข้อ 1.2 · 2.2 · 3.2 · Code"],
    what: "ทั้ง 3 ข้อใช้สูตรเดียว เปลี่ยนแค่คอลัมน์ที่ส่งเข้าไป",
    how: `A[i][j]=\\sum \\mathrm{cols}_i\\cdot\\mathrm{cols}_j,\\quad B[i]=\\sum \\mathrm{cols}_i\\cdot y`,
    todo: "อ่าน 1 รอบ → ปิดจอ → เขียนลงกระดาษ → กด Run เทียบ" },
  { day: "อ. 20", title: "โจทย์พลิก Regression", page: "regression", at: ["h3", "โจทย์พลิก"],
    what: "ข้อสอบ = การบ้านที่ถูกดัด: ย้อนกลับ · ข้อมูลหาย · ทำนายค่า",
    todo: "ทำ R-A · R-B · R-C แบบปิดเฉลย" },

  // ── พุธ 21 ──
  { day: "พ. 21", title: "เช้า: เขียนโครง R จากความจำ", page: "code", at: ["prob", "P12 ·"],
    what: "ทวนของเมื่อวานก่อนขึ้นเรื่องใหม่ — บรรทัดที่ลืมคือบรรทัดที่ต้องท่อง",
    todo: "เขียนบนกระดาษเปล่า 10 นาที แล้วเปิดเฉลยเทียบ" },
  { day: "พ. 21", title: "Interpolation ต่างจาก Regression", page: "interp", at: ["sect", "Interpolation vs Regression"],
    what: "Interpolation = เส้นผ่านทุกจุด (ข้อมูลแม่น) · Regression = เส้นที่ใกล้ที่สุด (ข้อมูลมี noise)",
    todo: "อ่าน 5 นาที — ต้องตอบได้ว่าโจทย์แบบไหนใช้อันไหน" },
  { day: "พ. 21", title: "Newton Divided-Difference", page: "interp", at: ["sect", "Newton's Divided-Difference"],
    what: "เติมค่าที่ขาดระหว่างจุดในตาราง: สร้างพหุนามผ่านทุกจุดทีละเทอม (เพิ่มจุด = เพิ่มเทอม)",
    how: `f(x)=C_0+C_1(x-x_0)+C_2(x-x_0)(x-x_1)+\\cdots`,
    todo: "ดูวิธีสร้างตารางผลต่าง — C ทุกตัวคือแถวบนสุดของตาราง" },
  { day: "พ. 21", title: "การบ้าน 9 · DD ที่ x = 4.2", page: "interp", at: ["sect", "การบ้าน 9 (ปีนี้)"],
    what: "linear = ใช้ 2 จุด · quadratic = 3 จุด · polynomial = ทุกจุด",
    todo: "ปิดเฉลยทำทั้ง 3 แบบ แล้วเทียบ" },
  { day: "พ. 21", title: "โค้ด DD 3 แบบ (การบ้าน 9)", page: "interp", at: ["h3", "โค้ด (การบ้าน 9)"],
    what: "bottom-up = เติมตารางเหมือนทำมือ (ง่ายสุด) · recursive = สูตรเรียกตัวเอง · top-down = recursive + จำค่าไว้",
    todo: "ต้องเขียนได้ครบ 3 แบบ (อาจารย์โพสต์สั่งเอง 19 ก.ย.) — bottom-up ก่อน แล้ว recursive → top-down" },
  { day: "พ. 21", title: "Lagrange", page: "interp", at: ["sect", "Lagrange Polynomial"],
    what: "เส้นเดียวกับ DD เป๊ะ (คำตอบเท่ากัน) แต่เขียนเป็นผลรวม y × น้ำหนัก Lᵢ — Lᵢ = 1 ที่จุดตัวเอง และ 0 ที่จุดอื่น",
    how: `f(x)=\\sum y_iL_i(x),\\quad L_i=\\prod_{j\\ne i}\\frac{x-x_j}{x_i-x_j}`,
    todo: "อ่านแล้วลองหา L₀ L₁ ของแบบ linear เอง" },
  { day: "พ. 21", title: "การบ้าน 10 · Lagrange ที่ x = 42,285", page: "interp", at: ["sect", "การบ้าน 10 (ปีนี้) · Lagrange"],
    what: "x หลักหมื่น → หาร x ทุกตัวด้วย 10,000 ก่อน Lᵢ ไม่เปลี่ยน (ห้ามหาร y)",
    todo: "ทำ linear / quad / poly + โค้ด n จุด · เช็คว่าตรงกับ DD" },
  { day: "พ. 21", title: "Linear Spline", page: "spline", at: ["sect", "Linear Spline — ลากเส้นตรง"],
    what: "ต่อเส้นตรงทีละช่วง ใช้แค่ 2 จุดที่คร่อม x — ไม่แกว่งเหมือนพหุนามกำลังสูง",
    how: `f(x)=y_{i-1}+m_i(x-x_{i-1}),\\quad m_i=\\frac{y_i-y_{i-1}}{x_i-x_{i-1}}`,
    todo: "จำ: หาช่วงก่อนเสมอ (ข้อเลือกช่วงตอนมิดคือเรื่องเดียวกัน)" },
  { day: "พ. 21", title: "การบ้าน 10 · Linear Spline ที่ x = 4.5", page: "spline", at: ["sect", "การบ้าน 10 (ปีนี้) · SPLINE"],
    what: "โจทย์พลิกของเรื่องนี้ = ย้อนกลับ (ให้ y หา x) และคำตอบมีหลายค่า",
    todo: "ปิดเฉลยทำ + โค้ด + พลิก S-A · S-B" },
  { day: "พ. 21", title: "Linear Systems ภาพรวม", page: "linear", at: ["sect", "เริ่มจากศูนย์"],
    what: "7 วิธีแก้ Ax = b: แบบตรง (Gauss · Jordan · Inverse · LU · Cholesky) กับแบบวนรอบ (Jacobi · GS)",
    todo: "อ่าน 15 นาทีให้เห็นแผนที่ก่อนลงทีละวิธี" },
  { day: "พ. 21", title: "Gauss Elimination ⭐ แม่ของทุกวิธี", page: "linear", at: ["sect", "Gauss Elimination — Direct"],
    what: "กำจัดตัวแปรจนเมทริกซ์เป็นสามเหลี่ยมบน แล้วแทนค่าย้อนจากล่างขึ้นบน",
    how: `f=\\frac{a_{ik}}{a_{kk}},\\quad R_i\\leftarrow R_i-f\\,R_k`,
    todo: "ทำมือตามตัวอย่าง แล้วเช็คคำตอบด้วย Simul Equation" },
  { day: "พ. 21", title: "โค้ด Gauss (โครง E)", page: "code", at: ["prob", "P5 ·"],
    what: "โครงแม่ — Jordan / Inverse / LU / Regression / Spline ต่อยอดจากโครงนี้ทั้งหมด",
    todo: "เขียนบนกระดาษเปล่า 10 นาที → เทียบเฉลย" },

  // ── พฤหัส 22 ──
  { day: "พฤ. 22", title: "เช้า: เขียน E · K1 · K2 · K4 จากความจำ", page: "code", at: ["sect", "โครงไฟนอล 5 โครง"],
    what: "Gauss · DD · Lagrange · Linear Spline — ของเมื่อวานทั้งหมด",
    todo: "เขียนให้ครบทั้ง 4 โครงก่อนเปิดดู" },
  { day: "พฤ. 22", title: "Gauss-Jordan", page: "linear", at: ["sect", "Gauss-Jordan"],
    what: "Gauss ที่กำจัดทั้งข้างบนและข้างล่างจนเหลือเมทริกซ์ I ⇒ อ่านคำตอบได้เลย ไม่ต้องแทนย้อน",
    how: <span>หาร pivot ให้เป็น 1 → กำจัดทุกแถวที่ <M>{`i\\ne k`}</M></span>,
    todo: "ทำมือ + เช็คด้วย Simul Equation" },
  { day: "พฤ. 22", title: "Matrix Inversion", page: "linear", at: ["sect", "Matrix Inversion"],
    what: "ทำ Gauss-Jordan กับ [A | I] แล้วฝั่งขวาจะกลายเป็น A⁻¹ ⇒ x = A⁻¹b (คุ้มเมื่อมี b หลายชุด)",
    how: `[A\\,|\\,I]\\rightarrow[I\\,|\\,A^{-1}],\\quad x=A^{-1}b`,
    todo: "ทำมือ + เช็ค A⁻¹ ด้วยโหมด Matrix" },
  { day: "พฤ. 22", title: "LU Decomposition", page: "linear", at: ["sect", "LU Decomposition"],
    what: "แยก A = L·U ครั้งเดียว แล้วแก้ 2 ขั้นสั้น ๆ: Ly = b → Ux = y (b เปลี่ยนก็ไม่ต้องแยกใหม่)",
    how: <span>L = ตัวคูณ f ของ Gauss (แนวทแยงเป็น 1) · U = ผลของ Gauss</span>,
    todo: "ทำมือ แล้วตรวจว่า L·U = A" },
  { day: "พฤ. 22", title: "โค้ด LU (โครง G)", page: "code", at: ["prob", "P6 ·"],
    what: "จุดตาย: เก็บ L[i][k] = f ก่อนเอา f ไปกำจัด",
    todo: "เขียนบนกระดาษเปล่า → เทียบ" },
  { day: "พฤ. 22", title: "Cholesky", page: "linear", at: ["sect", "Cholesky Decomposition"],
    what: "LU ฉบับ A สมมาตร: A = L·Lᵀ — ใช้ได้เมื่อค่าใต้รากไม่ติดลบ (positive definite)",
    how: `l_{ii}=\\sqrt{a_{ii}-\\sum_k l_{ik}^2},\\quad l_{ij}=\\frac{a_{ij}-\\sum_k l_{ik}l_{jk}}{l_{jj}}`,
    todo: "ทำมือ + ดูโครง H (substitution ชุดเดียวกับ LU แต่ต้องหาร l_ii)" },
  { day: "พฤ. 22", title: "การบ้าน 6-7 ข้อ 1.2–1.6", page: "linear", at: ["sect", "การบ้าน 6-7"],
    what: "ระบบเดียว แก้ทุกวิธี ⇒ ทุกวิธีต้องได้คำตอบเดียวกัน (ใช้ตรวจกันเอง)",
    todo: "ปิดเฉลยทำ Gauss → Jordan → Inverse → LU → Cholesky" },

  // ── ศุกร์ 23 ──
  { day: "ศ. 23", title: "เช้า: เขียน E · F · G · H จากความจำ", page: "code", at: ["sect", "โครงไฟนอล 5 โครง"],
    what: "Gauss · Jordan/Inverse · LU · Cholesky",
    todo: "เขียนให้ครบทั้ง 4 โครงก่อนเปิดดู" },
  { day: "ศ. 23", title: "Jacobi", page: "linear", at: ["sect", "Jacobi Iteration"],
    what: "เดาคำตอบ แล้วแก้ตัวแปรทีละตัวจากค่ารอบก่อน วนจนเปลี่ยนน้อยกว่า tol",
    how: `x_i=\\frac{b_i-\\sum_{j\\ne i}a_{ij}x_j}{a_{ii}},\\quad \\text{while } \\max|\\Delta x|>tol`,
    todo: "เช็ค diagonally dominant ก่อนเสมอ ไม่งั้นค่าระเบิด" },
  { day: "ศ. 23", title: "Gauss-Seidel", page: "linear", at: ["sect", "Gauss-Seidel"],
    what: "Jacobi ที่ใช้ค่าใหม่ทันทีที่คำนวณได้ ⇒ ลู่เข้าเร็วกว่า (โค้ดต่างกันบรรทัดเดียว)",
    todo: "ทำมือ 2 รอบ แล้วเทียบกับ Jacobi" },
  { day: "ศ. 23", title: "โค้ด Jacobi / GS (โครง J)", page: "code", at: ["prob", "P7 ·"],
    what: "ต้องเป็น while + tolerance ห้าม for นับรอบ (เหตุที่เคยได้ 1 เต็ม 6)",
    todo: "เขียนบนกระดาษเปล่า → เทียบ" },
  { day: "ศ. 23", title: "Conjugate Gradient", page: "conjugate", at: ["sect", "ขั้นตอน (ตามสไลด์อาจารย์)"],
    what: "เดินลงหุบเขาหาจุดต่ำสุดตามทิศที่ไม่ซ้ำกัน (A สมมาตร PD) — n×n จบภายใน n รอบ",
    how: `\\lambda=-\\frac{D^TR}{D^TAD},\\ X\\mathrel{+}=\\lambda D,\\ \\alpha=\\frac{R^TAD}{D^TAD},\\ D=-R+\\alpha D`,
    todo: "จำลำดับ: R = AX − B → D = −R → λ → X → R ใหม่ → เช็ค error → α → D" },
  { day: "ศ. 23", title: "การบ้าน 8 · CG 4×4 ε = 1e-6", page: "conjugate", at: ["sect", "การบ้าน 8 (ปีนี้) · ข้อ 1"],
    what: "ข้อ 1 คือข้อที่คุ้มสุดของการบ้าน 8 (ข้อ 2–3 contour / พิสูจน์ ตัดได้ถ้าเวลาไม่พอ)",
    todo: "เดินมือ 1–2 รอบ + ดูว่าโค้ดจบกี่รอบ" },
  { day: "ศ. 23", title: "โค้ด CG", page: "code", at: ["prob", "P11 ·"],
    what: "while True + break เมื่อ error < ε",
    todo: "เขียนบนกระดาษเปล่า → เทียบ" },
  { day: "ศ. 23", title: "Quadratic Spline", page: "spline", at: ["sect", "Quadratic Spline"],
    what: "พาราโบลาทีละช่วง บังคับ slope ให้ต่อกันที่รอยต่อ ⇒ 3n สมการ แล้วแก้ด้วย Gauss",
    how: <span>ผ่านจุด 2n สมการ + slope ต่อเนื่อง n−1 สมการ + <M>{`a_1=0`}</M></span>,
    todo: "ตั้งระบบสมการเองให้ได้ (สไลด์หน้า 17)" },
  { day: "ศ. 23", title: "Cubic Spline (ถ้าเหลือเวลา)", page: "spline", at: ["sect", "Cubic Spline"],
    what: "ลูกบาศก์ทีละช่วง ต่อเนื่องถึงความโค้ง ⇒ เนียนที่สุด (4n สมการ)",
    todo: "เข้าใจว่าเงื่อนไขมาจากไหนพอ — ตัดได้ถ้าเวลาไม่พอ" },

  // ── เสาร์ 24 ──
  { day: "ส. 24", title: "Mock A · 180 นาที", page: "exam", at: ["sect", "Mock ไฟนอล ชุด A"],
    what: "ซ้อมสอบจริง: ปิดโน้ต ใช้แค่เครื่องคิดเลข · ตรวจแค่คำตอบสุดท้าย ผิด = 0",
    todo: "กดเริ่มจับเวลา 180 นาที · หมดเวลาแล้วค่อยเปิดเฉลย" },
  { day: "ส. 24", title: "กรอกสมุดพลาด", page: "midterm", at: ["sect", "สมุดพลาด"],
    what: "จดว่าพลาด “เพราะอะไร” (ลืมสูตร · อ่านโจทย์ผิด · กดเครื่องผิด) ไม่ใช่แค่ผิดกี่ข้อ",
    todo: "กรอกทุกข้อที่พลาดจาก Mock A แล้วกลับไปทำการบ้านเรื่องนั้นซ้ำ" },
  { day: "ส. 24", title: "เย็น: เขียนทุกโครงลงกระดาษเปล่า", page: "code", at: ["sect", "ดริลกระดาษเปล่า"],
    what: "รอบใหญ่ — ทุกโครงที่เรียนมา",
    todo: "เขียน P5–P12 จากความจำ แล้วเทียบทีละข้อ" },

  // ── อาทิตย์ 25 ──
  { day: "อา. 25", title: "Mock B · 180 นาที", page: "exam", at: ["sect", "Mock ไฟนอล ชุด B"],
    what: "รอบสอง — วัดว่าที่ซ่อมจาก Mock A ได้ผลจริงไหม",
    todo: "จับเวลา 180 นาที · แล้วเทียบกับสมุดพลาด" },
  { day: "อา. 25", title: "ทวนเบา ๆ แล้วนอนเร็ว", page: "memo", at: null,
    what: "ไม่เปิดเรื่องใหม่แล้ว — นอนพอสำคัญกว่าอ่านเพิ่ม 3 ชั่วโมง",
    todo: "การ์ดท่อง 30–60 นาที · เช็คเครื่องคิดเลข (ถ่าน · Statistics · Equation · Matrix)" },

  // ── จันทร์ 26 ──
  { day: "จ. 26", title: "วันสอบ — เกมแพลน", page: "path", at: ["sect", "วันสอบ"],
    what: "ทำตามที่ซ้อมมา ไม่มีอะไรใหม่",
    todo: "อ่านเกมแพลน 5 ข้อก่อนเข้าห้อง" },
];

function pathLoad() {
  let i = 0, on = false;
  try {
    i = parseInt(localStorage.getItem(PATH_STEP_KEY) || "0", 10) || 0;
    on = localStorage.getItem(PATH_ON_KEY) === "1";
  } catch {}
  return { i: Math.min(Math.max(i, 0), PATH_STEPS.length - 1), on };
}
function pathSave(i, on) {
  try {
    localStorage.setItem(PATH_STEP_KEY, String(i));
    localStorage.setItem(PATH_ON_KEY, on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new CustomEvent("path-updated", { detail: { i, on } }));
}

// หา element เป้าหมายในหน้าที่ render อยู่ (หน้าเปลี่ยนแล้วแต่ Babel/KaTeX อาจยังวาดไม่เสร็จ ⇒ ต้อง poll)
function pathFindTarget(at) {
  const root = document.querySelector(".main-col");
  if (!root) return null;
  if (!at) return root;
  const [kind, text] = at;
  if (kind === "sect")
    return Array.from(root.querySelectorAll(".sect")).find(n => {
      const h = n.querySelector(".sect-head h2");
      return h && h.textContent.includes(text);
    }) || null;
  if (kind === "h3")
    return Array.from(root.querySelectorAll("h3")).find(n => n.textContent.includes(text)) || null;
  if (kind === "prob")
    return Array.from(root.querySelectorAll(".problem")).find(n => {
      const l = n.querySelector(".label");
      return l && l.textContent.includes(text);
    }) || null;
  return root;
}

function pathGoto(i) {
  const s = PATH_STEPS[i];
  pathSave(i, true);
  if (location.hash !== "#" + s.page) location.hash = s.page;
  let tries = 0;
  const tick = () => {
    const el = location.hash === "#" + s.page ? pathFindTarget(s.at) : null;
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      // KaTeX/โค้ดด้านบนอาจดันเนื้อหาลงหลังวาดเสร็จ ⇒ เลื่อนซ้ำอีกครั้ง
      setTimeout(() => el.scrollIntoView({ behavior: "auto", block: "start" }), 600);
      if (s.at) {
        el.classList.add("path-flash");
        setTimeout(() => el.classList.remove("path-flash"), 2200);
      }
      return;
    }
    if (++tries < 40) setTimeout(tick, 150);
  };
  // รอให้ตัวคืนตำแหน่ง scroll ของ app.jsx (30ms) ทำงานก่อน แล้วค่อยเลื่อนทับ
  setTimeout(tick, 120);
}

// แถบลอยล่างจอ — แสดงทุกหน้าเมื่อเปิดเส้นทาง
function PathBar() {
  const [st, setSt] = React.useState(pathLoad);
  React.useEffect(() => {
    const on = (e) => setSt(e.detail);
    window.addEventListener("path-updated", on);
    return () => window.removeEventListener("path-updated", on);
  }, []);
  React.useEffect(() => {
    document.body.classList.toggle("path-on", st.on);
  }, [st.on]);
  if (!st.on) return null;
  const s = PATH_STEPS[st.i];
  const n = PATH_STEPS.length;
  return (
    <div className="path-bar" role="region" aria-label="เส้นทางเรียน">
      <div className="path-bar-top">
        <span className="path-bar-count">ขั้น {st.i + 1}/{n} · {s.day}</span>
        <b className="path-bar-title">{s.title}</b>
        <button className="path-bar-x" onClick={() => pathSave(st.i, false)} title="ซ่อนแถบ (กลับมาเปิดได้ที่หน้า เส้นทางเรียน)">✕</button>
      </div>
      <div className="path-bar-what">💡 {s.what}</div>
      {s.how && <div className="path-bar-how">สูตร: {typeof s.how === "string" ? <M>{s.how}</M> : s.how}</div>}
      <div className="path-bar-row">
        <span className="path-bar-todo">✍️ {s.todo}</span>
        <button className="btn small" disabled={st.i === 0} onClick={() => pathGoto(st.i - 1)}>◀ ก่อนหน้า</button>
        <button className="btn small" onClick={() => pathGoto(st.i)} title="กลับไปที่หัวข้อของขั้นนี้">⟲</button>
        <button className="btn small primary" disabled={st.i === n - 1} onClick={() => pathGoto(st.i + 1)}>ถัดไป ▶</button>
      </div>
      <div className="path-bar-progress"><span style={{width: `${((st.i + 1) / n) * 100}%`}}/></div>
    </div>
  );
}

function PathLesson() {
  const [st, setSt] = React.useState(pathLoad);
  React.useEffect(() => {
    const on = (e) => setSt(e.detail);
    window.addEventListener("path-updated", on);
    return () => window.removeEventListener("path-updated", on);
  }, []);
  const started = st.on || st.i > 0;
  const days = [];
  PATH_STEPS.forEach((s, i) => {
    if (!days.length || days[days.length - 1].day !== s.day) days.push({ day: s.day, items: [] });
    days[days.length - 1].items.push([s, i]);
  });

  return (
    <div>
      <Hero
        kicker="▶ เส้นทางเรียน · กด ถัดไป อย่างเดียว"
        title="อ่านภาพรวมหน้านี้ แล้วกดถัดไปเรื่อย ๆ"
        lead={`${PATH_STEPS.length} ขั้น เรียงตามแผน 6 วัน (อ. 20 → จ. 26 ต.ค.) · กดแล้วพาไปหน้าและหัวข้อที่ต้องอ่านเอง · ทุกขั้นบอก “คืออะไร” สั้น ๆ + สูตรที่ใช้ + สิ่งที่ต้องทำ · จำขั้นล่าสุดไว้ ปิดเว็บแล้วกลับมาต่อได้`}
        meta={["แถบลอยล่างจอทุกหน้า", "ภาพรวม → ทำมือ → โค้ด → พลิก", "Mock A/B เสาร์–อาทิตย์"]}
      />

      <div style={{display:"flex", gap:10, flexWrap:"wrap", margin:"0 0 22px"}}>
        <button className="btn primary" onClick={() => pathGoto(started ? st.i : 1)}>
          {started ? `▶ ไปต่อที่ขั้น ${st.i + 1}: ${PATH_STEPS[st.i].title}` : "▶ เริ่มเส้นทาง (ขั้นที่ 2)"}
        </button>
        {!st.on && <button className="btn" onClick={() => pathSave(st.i, true)}>เปิดแถบล่างจอ</button>}
        {started && <button className="btn" onClick={() => pathSave(0, false)}>↺ เริ่มนับใหม่</button>}
      </div>

      <Callout kind="good" title="📊 มิดเทอมของทั้งห้อง — คุณอยู่เหนือค่าเฉลี่ย">
        <p style={{margin:"0 0 6px"}}>อาจารย์โพสต์สถิติมิด (เต็ม 40) เมื่อ 9 ก.ย.: ค่าเฉลี่ย <b>13.46</b> (33.65%) · SD 9.17 · ต่ำสุด 0 · สูงสุด 38.22 — <b>คุณได้ 17.33 (43.3%) สูงกว่าค่าเฉลี่ยห้อง</b> ⇒ ข้อสอบวิชานี้ยากกับทุกคน · เจอข้อที่ทำไม่ได้ในห้องสอบคือเรื่องปกติ ข้ามไปทำข้อที่มั่นใจก่อน</p>
        <p style={{margin:0}}>เส้นผ่าน — อาจารย์เขียนเอง (โพสต์ 24 มิ.ย.): <i>&ldquo;F score &lt; 40 (39, 39.2, 39.5)&rdquo;</i> ⇒ <b>39.5 ก็ยัง F ไม่ปัดขึ้น</b> ⇒ ไฟนอลต้องได้ ≥ 22.67/50 (45.3%) จริง ๆ · แผนจึงเล็ง 55% เผื่อพลาด (<a href="#plan">#plan</a>)</p>
      </Callout>

      <Sect tag="1" title="ภาพรวมไฟนอล 1 หน้า — 4 คำถามใหญ่ + ใช้สูตรไหน">
        <p>ทุกเรื่องในไฟนอลตอบคำถามแค่ 4 แบบ · อ่านคอลัมน์ “เห็นโจทย์แบบนี้” ให้ขึ้นใจ เพราะตอนมิดพลาดเพราะ<b>ดูไม่ออกว่าต้องใช้วิธีไหน</b> ไม่ใช่เพราะคิดเลขไม่เป็น</p>

        <h3>① แก้ระบบสมการ Ax = b <span className="muted" style={{fontSize:'0.8rem'}}>· การบ้าน 6-7 + 8</span></h3>
        <NumTable
          headers={["วิธี", "คืออะไร (สั้น ๆ)", "สูตร / ท่าหลัก", "เห็นโจทย์แบบนี้"]}
          rows={[
            [<b>Gauss ⭐</b>, "กำจัดให้เป็นสามเหลี่ยมบน แล้วแทนย้อนจากล่างขึ้นบน", <M>{`R_i\\leftarrow R_i-\\tfrac{a_{ik}}{a_{kk}}R_k`}</M>, "แม่ของทุกวิธี · สั่ง “Gauss Elimination”"],
            ["Gauss-Jordan", "กำจัดทั้งบนและล่างจนเหลือ I ⇒ อ่านคำตอบได้เลย", "หาร pivot เป็น 1 → กำจัดทุกแถว", "ไม่ต้องแทนย้อน"],
            ["Matrix Inversion", "Gauss-Jordan บน [A|I] ได้ A⁻¹ แล้วคูณ b", <M>{`x=A^{-1}b`}</M>, "ถามหา A⁻¹ · มี b หลายชุด"],
            ["LU", "แยก A = LU ครั้งเดียว แก้ Ly = b แล้ว Ux = y", "L = ตัวคูณของ Gauss (ทแยง 1)", "b เปลี่ยนแต่ A เดิม"],
            ["Cholesky", "LU ฉบับ A สมมาตร: A = LLᵀ", <M>{`l_{ii}=\\sqrt{a_{ii}-\\sum l^2}`}</M>, "A สมมาตร · ใต้รากติดลบ = ใช้ไม่ได้"],
            [<b>Jacobi</b>, "เดาค่า แล้ววนแก้ทีละตัวจากค่ารอบก่อนจนนิ่ง", <M>{`x_i=\\frac{b_i-\\sum_{j\\ne i}a_{ij}x_j}{a_{ii}}`}</M>, "ถาม “กี่รอบ” · มี tol · ต้อง dominant"],
            [<b>Gauss-Seidel</b>, "Jacobi ที่ใช้ค่าใหม่ทันที ⇒ เร็วกว่า", "บรรทัดเดียวต่าง", "เหมือน Jacobi"],
            ["Conjugate Gradient", "เดินลงหุบตามทิศที่ไม่ซ้ำกัน n×n จบ ≤ n รอบ", <M>{`\\lambda=-\\tfrac{D^TR}{D^TAD}`}</M>, "A สมมาตร PD · ε เล็ก ๆ · นับรอบ"],
            [<span className="muted">Cramer</span>, <span className="muted">ออกมิดไปแล้ว</span>, <M>{`x_i=\\tfrac{\\det A_i}{\\det A}`}</M>, <span className="muted">ใช้แค่เช็ค 2×2</span>],
          ]}
        />

        <h3>② มีตาราง (ข้อมูลแม่น) อยากรู้ค่าระหว่างจุด — Interpolation <span className="muted" style={{fontSize:'0.8rem'}}>· การบ้าน 9–10</span></h3>
        <NumTable
          headers={["วิธี", "คืออะไร (สั้น ๆ)", "สูตร", "เห็นโจทย์แบบนี้"]}
          rows={[
            [<b>Newton DD</b>, "เติมค่าที่ขาด: สร้างพหุนามผ่านทุกจุดจากตารางผลต่าง (เพิ่มจุด = เพิ่มเทอม)", <M>{`C_0+C_1(x-x_0)+C_2(x-x_0)(x-x_1)`}</M>, "“divided difference” · จุดห่างไม่เท่ากันได้"],
            [<b>Lagrange</b>, "เส้นเดียวกับ DD เป๊ะ เขียนเป็นผลรวม y × น้ำหนัก", <M>{`\\sum y_iL_i,\\ L_i=\\prod_{j\\ne i}\\tfrac{x-x_j}{x_i-x_j}`}</M>, "สั่ง Lagrange · ใช้ตรวจ DD"],
          ]}
        />
        <Callout kind="tip" title="DD กับ Lagrange ไม่ได้ทำคนละอย่าง">
          <p style={{margin:0}}>ทั้งคู่ “เติมค่าที่ขาด” ด้วย<b>เส้นเดียวกัน</b>ที่ผ่านทุกจุด ⇒ ได้คำตอบเท่ากันเป๊ะ · ต่างแค่วิธีเขียน · linear / quadratic / polynomial = ใช้ 2 / 3 / ทุกจุด</p>
        </Callout>

        <h3>③ จุดเยอะ ไม่อยากให้เส้นแกว่ง — Spline (ต่อเส้นทีละช่วง) <span className="muted" style={{fontSize:'0.8rem'}}>· การบ้าน 10 + สไลด์</span></h3>
        <NumTable
          headers={["วิธี", "คืออะไร (สั้น ๆ)", "สูตร / ท่าหลัก", "เห็นโจทย์แบบนี้"]}
          rows={[
            [<b>Linear</b>, "ลากเส้นตรงเฉพาะ 2 จุดที่คร่อม x", <M>{`y_{i-1}+m_i(x-x_{i-1})`}</M>, "หาช่วงก่อนเสมอ"],
            ["Quadratic", "พาราโบลาทีละช่วง slope ต่อกันที่รอยต่อ", <span>3n สมการ · <M>{`a_1=0`}</M></span>, "ตั้งระบบแล้ว Gauss"],
            [<span className="muted">Cubic</span>, "ลูกบาศก์ทีละช่วง เนียนถึงความโค้ง", "4n สมการ", <span className="muted">ถ้าเหลือเวลา</span>],
          ]}
        />

        <h3>④ ข้อมูลมี noise ขอเส้นที่ใกล้ที่สุด — Regression (ไม่ต้องผ่านจุด) <span className="muted" style={{fontSize:'0.8rem'}}>· การบ้าน 11</span></h3>
        <NumTable
          headers={["วิธี", "คืออะไร (สั้น ๆ)", "สูตร", "เห็นโจทย์แบบนี้"]}
          rows={[
            [<b>Linear</b>, "เส้นตรงที่ผลรวม error² น้อยสุด", <M>{`a_1=\\tfrac{n\\sum xy-\\sum x\\sum y}{n\\sum x^2-(\\sum x)^2}`}</M>, "“least squares” · “ใกล้ที่สุด” · “มีความคลาดเคลื่อน”"],
            [<b>Polynomial</b>, "เหมือนกันแต่โค้งได้ (มี x², x³ …)", <M>{`A_{ij}=\\sum x^{i+j}`}</M>, "order m = 2"],
            ["Multiple", "x หลายตัว ⇒ ระนาบ", <span>คอลัมน์ <M>{`[1,x_1,x_2,x_3]`}</M></span>, "ตารางมีหลายคอลัมน์ x"],
          ]}
        />

        <Callout kind="good" title="⚡ เห็นโจทย์ → ใช้วิธีไหน (ภายใน 30 วินาที)">
          <ol style={{margin:0, paddingLeft:20}}>
            <li>ให้<b>สมการหลายตัวแปร / เมทริกซ์</b> → ① · ถาม “กี่รอบ” หรือมี tolerance → Jacobi / GS / CG · ไม่งั้นดูว่าโจทย์สั่งวิธีไหน</li>
            <li>ให้<b>ตาราง x, y แล้วถามค่าที่ x</b> → มีคำว่า spline → ③ · มีคำว่า least squares / ใกล้ที่สุด / ข้อมูลคลาดเคลื่อน → ④ · นอกนั้น (ผ่านทุกจุด) → ②</li>
            <li>ให้ <b>y มาแล้วถาม x</b> → โจทย์ย้อนกลับ: ใช้สูตรเดิมแต่ตั้งสมการแก้หา x</li>
          </ol>
        </Callout>

        <Callout kind="danger" title="🩺 กับดักจากมิด → ไฟนอลจะมาในรูปไหน">
          <NumTable
            headers={["พลาดตอนมิด", "ในไฟนอลจะมาแบบ", "กันยังไง"]}
            rows={[
              [<span>ลืมว่า <b>h คือระยะห่าง</b> (ข้อจรวด)</span>, "ตารางที่ x ห่างไม่เท่ากัน · x หลักหมื่น · หน่วยแปลก (หน่วยละ 10 ตร.ม.)", "ระยะห่าง = ผลต่างของ x ในตารางเสมอ · อ่านหน่วยก่อนแทน"],
              [<span>โจทย์<b>ย้อนกลับ</b> (Trap/Simpson ให้ผลมาแล้วหา x)</span>, "ให้ y หา x (inverse interpolation) · ให้เส้นที่ fit มาแล้วหาข้อมูลที่หาย", "ใช้สูตรเดิม ตั้งเป็นสมการแล้วแก้หาตัวที่ไม่รู้"],
              [<span><b>เลือกช่วง</b>เอง (bisection 3 ช่วง)</span>, "Spline ต้องเลือกช่วงที่ x อยู่ · ย้อนกลับแล้วได้หลายคำตอบ", "ไล่ทุกช่วง อย่าหยุดที่ตัวแรก · รากที่ตกนอกช่วงให้ทิ้ง"],
              [<span><b>ลืมสูตร</b> (False Position · One-point · Diff)</span>, "ทุกเรื่อง", "ทุกเช้าเขียนโค้ด/สูตรของเมื่อวานจากความจำ (มีในเส้นทางแล้ว)"],
              [<span>ข้อ<b>มือ + โค้ดต่อยาว</b> (Secant · Trap/Simpson)</span>, "ทำมือแล้วเขียนโค้ดของวิธีเดียวกัน", "ทุกขั้นในเส้นทาง = ทำมือ → โค้ด"],
              [<span>✅ <b>Cramer ได้คะแนนฟรี</b></span>, "—", "เพราะซ้อมทั้งมือและโค้ด ⇒ ทำแบบเดียวกันทุกเรื่อง"],
            ]}
          />
        </Callout>
      </Sect>

      <Sect tag="2" title={`ทุกขั้นในเส้นทาง (${PATH_STEPS.length} ขั้น) — กดชื่อเพื่อกระโดดไปขั้นนั้น`}>
        {days.map(d => (
          <div key={d.day} style={{margin:"0 0 14px"}}>
            <div style={{fontFamily:"var(--font-mono)", fontSize:'0.78rem', color:"var(--signal)", margin:"0 0 4px"}}>{d.day}</div>
            {d.items.map(([s, i]) => (
              <div key={i} onClick={() => pathGoto(i)} role="button" tabIndex={0}
                   onKeyDown={(e) => { if (e.key === "Enter") pathGoto(i); }}
                   style={{display:"flex", gap:10, padding:"5px 8px", borderRadius:6, cursor:"pointer",
                           background: i === st.i && started ? "var(--bg-soft)" : "transparent",
                           opacity: started && i < st.i ? 0.5 : 1, fontSize:'0.88rem'}}>
                <span style={{fontFamily:"var(--font-mono)", color:"var(--text-faint)", minWidth:28}}>{i + 1}</span>
                <span>{started && i < st.i ? "✓ " : ""}{s.title}</span>
              </div>
            ))}
          </div>
        ))}
      </Sect>

      <Sect tag="3" title="วันสอบ (จันทร์ 26) — เกมแพลน 5 ข้อ">
        <ol style={{margin:0, paddingLeft:20, lineHeight:1.9}}>
          <li>5 นาทีแรก อ่านโจทย์ให้ครบทุกข้อ แล้วเรียงว่าข้อไหนมั่นใจสุด</li>
          <li>ทำข้อที่มั่นใจก่อน · ข้อที่ตันให้ข้ามทันที อย่าฝืน</li>
          <li>ข้อที่เขียนว่า “แสดงวิธีทำ” ต้องเขียนวิธีให้เห็น ไม่ใช่แค่คำตอบ</li>
          <li>ทุกคำตอบเช็คด้วยเครื่องอีกวิธี · ตอบเป็นทศนิยมเท่านั้น ห้ามเศษส่วน</li>
          <li>เวลาที่เหลือใช้ตรวจซ้ำข้อที่ทำแล้ว ไม่ใช่เริ่มข้อที่ยังไม่ได้แตะ</li>
        </ol>
      </Sect>
    </div>
  );
}

window.PathLesson = PathLesson;
window.PathBar = PathBar;
