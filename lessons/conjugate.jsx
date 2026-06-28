// Conjugate Gradient — ภาพสุดยอดของ iterative methods สำหรับ symmetric PD systems

function ConjugateLesson() {
  const A = [[4, 1], [1, 3]];
  const b = [1, 2];
  const x0 = [2, 1];
  const { rows: cgRows } = conjugateGradient(A, b, x0, 5);

  // 2D visualization of conjugate gradient path
  // Plot level sets of f(x) = 0.5 x^T A x - b^T x
  function levelF(x, y) {
    const v = [x, y];
    const Av = matvec(A, v);
    return 0.5 * dot(v, Av) - dot(b, v);
  }
  // generate contour by sampling — simple approach: draw ellipses analytically
  const cgPath = cgRows.map(r => r.x);
  const minX = Math.min(...cgPath.map(p=>p[0])) - 1;
  const maxX = Math.max(...cgPath.map(p=>p[0])) + 1;
  const minY = Math.min(...cgPath.map(p=>p[1])) - 1;
  const maxY = Math.max(...cgPath.map(p=>p[1])) + 1;

  return (
    <div>
      <Hero
        kicker="03 · Conjugate Gradient"
        title="Conjugate Gradient Method"
        lead="วิธี iterative ที่ฉลาดที่สุดสำหรับ symmetric positive-definite matrix — รับประกันลู่เข้าใน n iterations"
        readout={{
          label: "Conjugate Gradient · ‖rₖ‖ (residual) ต่อรอบ",
          steps: [
            { x: "1.0", w: 72 },
            { x: "0.31", w: 24 },
            { x: "0.04", w: 9 },
            { x: "1e−6", w: 3 },
          ],
          result: "→ 0",
          note: "SPD ขนาด n × n → รับประกันลู่เข้าใน ≤ n รอบ (จริงมักเร็วกว่านั้น)",
        }}
        meta={["Symmetric PD", "n-step convergence", "Quadratic form", "Krylov subspace"]}
      />

      <Sect tag="0" title="ทำไมต้องมี CG?">
        <p>Gauss-Seidel ลู่เข้าช้าเมื่อ matrix ใหญ่ขึ้น — สำหรับ <em>symmetric positive-definite</em> matrix ขนาด n×n, <b>Conjugate Gradient รับประกันลู่เข้าใน n iterations</b></p>
        <Callout kind="tip" title="แนวคิด — มอง Ax = b เป็นปัญหาหาค่าต่ำสุด">
          <p>สำหรับ A สมมาตรและ positive-definite, การแก้ <M>Ax=b</M> เทียบเท่าหาค่าต่ำสุดของ:</p>
          <MB>{`\\phi(x) = \\frac{1}{2}x^T A x - b^T x`}</MB>
          <p>เพราะ <M>{`\\nabla \\phi(x) = Ax - b = 0 \\Leftrightarrow Ax = b`}</M></p>
          <p>กราฟของ <M>\\phi</M> คือ "ชาม" (paraboloid) — CG ก็คือเดินลง<b>ก้นชาม</b>ด้วยทิศที่ "conjugate" กัน → ไม่เดินทางซ้ำ</p>
        </Callout>
      </Sect>

      <Sect tag="1" title="ขั้นตอน (ตามสไลด์อาจารย์)">
        <Formula label="รอบแรก K=0 เท่านั้น">
          <MB>{`r^{(0)} = Ax^{(0)} - b`}</MB>
          <MB>{`d^{(0)} = -r^{(0)}`}</MB>
        </Formula>

        <Formula label="รอบต่อ ๆ ไป (K = 0, 1, 2, ...)">
          <MB>{`\\alpha_k = -\\frac{(r^{(k)})^T d^{(k)}}{(d^{(k)})^T A d^{(k)}}`}</MB>
          <MB>{`x^{(k+1)} = x^{(k)} + \\alpha_k\\, d^{(k)}`}</MB>
          <MB>{`r^{(k+1)} = A x^{(k+1)} - b`}</MB>
          <MB>{`\\beta_k = \\frac{(r^{(k+1)})^T A d^{(k)}}{(d^{(k)})^T A d^{(k)}}`}</MB>
          <MB>{`d^{(k+1)} = -r^{(k+1)} + \\beta_k\\, d^{(k)}`}</MB>
          <MB>{`\\text{Error} = \\sqrt{(r^{(k+1)})^T r^{(k+1)}}`}</MB>
        </Formula>

        <Callout kind="tip" title="ความหมายของแต่ละตัว">
          <ul>
            <li><M>r^{`(k)`}</M> = residual (ความผิดพลาด) = Ax - b ที่จุดปัจจุบัน</li>
            <li><M>d^{`(k)`}</M> = direction (ทิศเดิน) → ทิศ <em>conjugate</em> ไม่ใช่แค่ตรงข้าม gradient</li>
            <li><M>\alpha_k</M> = step size (เดินไปไกลแค่ไหนในทิศ d)</li>
            <li><M>\beta_k</M> = "ผสม" ทิศใหม่กับทิศเก่าให้ conjugate กัน</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="2" title="เห็นภาพ — 2D Quadratic Form">
        <p>ระบบ <M>{`\\begin{pmatrix} 4 & 1 \\\\ 1 & 3 \\end{pmatrix} x = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}`}</M>, เริ่มที่ <M>{`x^{(0)} = (2, 1)`}</M></p>

        <CGPath2D rows={cgRows} A={A} b={b}/>
        <p className="muted" style={{fontSize:'0.778rem'}}>เส้นโค้งสีฟ้าคือ "level sets" ของ <M>\phi(x)</M> เส้นเหลืองคือเส้นทางที่ CG เดิน — สังเกตว่าเดิน 2 ครั้งก็ถึงคำตอบเป๊ะ (n=2 dimensions, 2 steps)</p>
      </Sect>

      <Sect tag="3" title="ทำมือ — ตัวอย่างจากสไลด์">
        <p>ระบบ 3×3 จากสไลด์อาจารย์, เริ่ม <M>x^{`(0)`} = (0, 0, 0)</M>:</p>
        <MB>{`A = \\begin{pmatrix} 5 & -1 & 0 \\\\ -1 & 5 & -1 \\\\ 0 & -1 & 5 \\end{pmatrix}, \\quad b = \\begin{pmatrix} 12 \\\\ 17 \\\\ 14 \\end{pmatrix}`}</MB>

        <h4>รอบ 1 (K = 0)</h4>
        <p><b>Step 1:</b> หา <M>r^{`(0)`}</M></p>
        <MB>{`r^{(0)} = A x^{(0)} - b = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\end{pmatrix} - \\begin{pmatrix} 12 \\\\ 17 \\\\ 14 \\end{pmatrix} = \\begin{pmatrix} -12 \\\\ -17 \\\\ -14 \\end{pmatrix}`}</MB>
        <p><b>Step 2:</b> หา <M>d^{`(0)`} = -r^{`(0)`} = (12, 17, 14)</M></p>
        <p><b>Step 3:</b> หา <M>\alpha_0</M> ต้องใช้ <M>Ad^{`(0)`}</M> ก่อน:</p>
        <MB>{`A d^{(0)} = \\begin{pmatrix} 5(12)-1(17) \\\\ -1(12)+5(17)-1(14) \\\\ -1(17)+5(14) \\end{pmatrix} = \\begin{pmatrix} 43 \\\\ 59 \\\\ 53 \\end{pmatrix}`}</MB>
        <MB>{`(d^{(0)})^T A d^{(0)} = 12(43) + 17(59) + 14(53) = 2261`}</MB>
        <MB>{`(r^{(0)})^T d^{(0)} = (-12)(12)+(-17)(17)+(-14)(14) = -629`}</MB>
        <MB>{`\\alpha_0 = -\\frac{-629}{2261} \\approx 0.2782`}</MB>
        <p><b>Step 4:</b> Update x:</p>
        <MB>{`x^{(1)} = x^{(0)} + 0.2782 \\cdot d^{(0)} \\approx (3.338, 4.729, 3.895)`}</MB>

        <Callout kind="warn" title="คำเตือน">
          การคำนวณ CG ทำมือเป็นไปได้แต่ <em>ยุ่งมาก</em> สำหรับ matrix &gt; 3×3 ในสอบจริง อาจารย์มักให้ทำ 1-2 iter แค่นั้น หรือให้คำนวณตัวเลขแค่ <M>\alpha_0, \beta_0</M> เพื่อเช็คความเข้าใจ
        </Callout>
      </Sect>

      <Sect tag="4" title="Python · CG เต็มสูตร">
        <PythonRunner code={`import numpy as np

def conjugate_gradient(A, b, x0, max_iter=50, tol=1e-8):
    A, b, x = np.array(A, float), np.array(b, float), np.array(x0, float)
    r = A @ x - b              # residual r^(0)
    d = -r                     # direction d^(0)
    print(f"{'k':>3} {'x':>30} {'||r||':>12}")
    print(f"{'0':>3} {str(x.round(4)):>30} {np.linalg.norm(r):12.6e}")
    
    for k in range(max_iter):
        Ad = A @ d
        alpha = -(r @ d) / (d @ Ad)
        x = x + alpha * d
        r_new = A @ x - b
        beta = (r_new @ Ad) / (d @ Ad)
        d = -r_new + beta * d
        print(f"{k+1:3d} {str(x.round(4)):>30} {np.linalg.norm(r_new):12.6e}")
        if np.linalg.norm(r_new) < tol:
            return x
        r = r_new
    return x

A = [[5,-1,0],[-1,5,-1],[0,-1,5]]
b = [12,17,14]
x = conjugate_gradient(A, b, [0,0,0])
print(f"\\nคำตอบ x = {x.round(6)}")`} height={300}/>
      </Sect>

      <Sect tag="4.5" title="fx-991CW · ใช้ Matrix mode เช็คคำนวณ A·D และ DᵀAD">
        <Callout title="CG ต้องคำนวณ matrix-vector หลายครั้งต่อ iter — เครื่องช่วย">
          <p>ทุกรอบ CG ใช้ค่า 3 ตัวต่อ iteration:</p>
          <ul style={{margin:"0 0 8px", paddingLeft:18}}>
            <li><M>{`A D^{(k)}`}</M> (vector ขนาด n) — ใช้ใน λₖ และ αₖ</li>
            <li><M>{`(D^{(k)})^T A D^{(k)}`}</M> (scalar) — ตัวส่วนของทั้ง λₖ และ αₖ</li>
            <li><M>{`(D^{(k)})^T R^{(k)}`}</M> หรือ <M>{`(R^{(k+1)})^T A D^{(k)}`}</M> (scalar) — ตัวเศษ</li>
          </ul>
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Matrix</Key> → <Key>Define Matrix</Key> → <Key>MatA</Key> (เก็บ A, ขนาด n×n)</span>,
            <span>เก็บ <Key>MatB</Key> = <M>{`D^{(k)}`}</M> เป็น column vector n×1</span>,
            <span>เก็บ <Key>MatC</Key> = <M>{`R^{(k)}`}</M> เป็น column vector n×1</span>,
            <span><Key>OPTN</Key> → <Key>Matrix Calc</Key> → พิมพ์ <code>MatA × MatB</code> → ได้ AD (เก็บ <Key>MatD</Key>)</span>,
            <span>พิมพ์ <code>Trn(MatB) × MatD</code> → ได้ scalar DᵀAD</span>,
            <span>พิมพ์ <code>Trn(MatB) × MatC</code> → ได้ scalar DᵀR → ตัวเศษ λₖ</span>,
            <span>กดสูตร <M>{`\\lambda_k = -D^T R / D^T A D`}</M> ใน Calculate mode ทันที</span>,
          ]}/>
          <p style={{margin:"6px 0 0", fontSize:'0.778rem'}}>การวน iteration ใช้เวลา ~30s ต่อรอบเมื่อคล่อง — เร็วกว่าคูณ matrix-vector ทีละช่องด้วยมือ</p>
          <p style={{margin:"4px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>ระวัง: fx-991CW เก็บ matrix ได้สูงสุด <b>4×4</b> ต่อตัว — โจทย์ CG ในชีท (4×4) พอดี</p>
        </Callout>
      </Sect>

      <Sect tag="5" title="Residual norm chart · ดู ‖r‖ ลดเป็น quasi-exponential">
        <CGResidualPlot/>
        <Callout kind="tip" title="ทฤษฎี">
          <p>สำหรับ matrix SPD ขนาด n×n: CG ลู่เข้าใน <b>n iterations เป็นอย่างมาก</b> (ในเลขจริง — เลขจุดทศนิยมอาจ "ลื่น" เล็กน้อย)</p>
          <p style={{margin:0}}>ในทางปฏิบัติ — ‖r‖ ลดเร็วกว่า Jacobi/GS มาก โดยเฉพาะเมื่อ matrix ใหญ่ + sparse</p>
        </Callout>
      </Sect>

      <Sect tag="6" title="Interactive · CG Solver">
        <CGSolver/>
      </Sect>

      <Sect tag="7" title="พิสูจน์สูตร λₖ และ αₖ (ตามชีท conjugate.pdf ข้อ 3)">
        <p>ในข้อสอบ Final อาจารย์อาจบังคับให้ <b>พิสูจน์</b> สูตรใน box "CONJUGATE GRADIENT PROCEDURE". สูตรไม่ได้เกิดมาลอย ๆ — มาจาก 2 หลักการเท่านั้น:</p>
        <ul>
          <li><b>λₖ</b> = step size → มาจาก minimize <M>{`f(x^{(k)} + \\lambda D^{(k)})`}</M> เทียบ λ</li>
          <li><b>αₖ</b> = mixing factor → มาจากเงื่อนไข <em>A-conjugacy</em>: <M>{`(D^{(k+1)})^T A\\, D^{(k)} = 0`}</M></li>
        </ul>

        <Callout kind="warn" title="ระวังเรื่องสัญลักษณ์ — ชีท vs โค้ดสากล">
          <p>อาจารย์ในชีทใช้สัญลักษณ์ต่างจากตำราต่างประเทศ. ความหมายเหมือนกัน — แค่ตัวอักษรต่างกัน:</p>
          <NumTable
            headers={["บทบาท", "ชีทอาจารย์", "ตำราสากล / โค้ดใน Sect 1, 4"]}
            rows={[
              ["Step size (ก้าวยาวเท่าไหร่)", "λₖ", "αₖ"],
              ["Mixing factor (ผสมทิศเก่า)", "αₖ", "βₖ"],
            ]}
          />
          <p style={{margin:"6px 0 0", fontSize:'0.75rem'}}>เพื่อให้พิสูจน์ตรงกับข้อสอบ ใน Sect 7 นี้ใช้ <b>สัญลักษณ์ชีท</b> (λₖ, αₖ)</p>
        </Callout>

        <h3>พิสูจน์ที่ 1 · สูตร λₖ จาก <M>∂f/∂λ = 0</M></h3>
        <p>ฟังก์ชันที่ CG ลดลง (จาก Sect 0):</p>
        <Formula><MB>{`f(x) = \\tfrac{1}{2}\\, x^T A x - b^T x \\quad (A \\text{ สมมาตร})`}</MB></Formula>
        <p>การ update แต่ละรอบ: <M>{`x^{(k+1)} = x^{(k)} + \\lambda\\, D^{(k)}`}</M>. อยากเลือก λ ที่ทำให้ <M>{`f(x^{(k+1)})`}</M> ต่ำสุด → diff เทียบ λ แล้วเซตเป็น 0</p>

        <window.HandWalkthrough steps={[
          { title: "Step 1 · เขียน f(x^(k+1)) ในรูป λ",
            body: `f(x^(k) + λD^(k)) = ½(x^(k) + λD^(k))ᵀ A (x^(k) + λD^(k))
                   − bᵀ(x^(k) + λD^(k))` },
          { title: "Step 2 · กระจาย (x + λD)ᵀ A (x + λD)",
            body: `(x + λD)ᵀ A (x + λD)
  = xᵀAx  +  xᵀA(λD)  +  (λD)ᵀAx  +  (λD)ᵀA(λD)
  = xᵀAx  +  2λ · xᵀAD  +  λ² · DᵀAD

ทำไม 2λ·xᵀAD?  เพราะ A สมมาตร → xᵀAD = (xᵀAD)ᵀ = DᵀAᵀx = DᵀAx
รวม 2 ตัว xᵀAλD + λDᵀAx = 2λ·xᵀAD` },
          { title: "Step 3 · รวมเข้ากับ −bᵀ(x + λD)",
            body: `f(x + λD) = ½·xᵀAx  +  λ·xᵀAD  +  ½λ²·DᵀAD
                  − bᵀx  −  λ·bᵀD` },
          { title: "Step 4 · diff เทียบ λ",
            body: `∂f/∂λ = xᵀAD  +  λ·DᵀAD  −  bᵀD
       = (Ax − b)ᵀ D  +  λ·DᵀAD
       = Rᵀ D  +  λ·DᵀAD             (กำหนด R = Ax − b = residual)` },
          { title: "Step 5 · เซต ∂f/∂λ = 0 → ได้ λₖ",
            body: `Rᵀ D + λ·DᵀAD = 0

     λₖ = −Rᵀ D / (Dᵀ A D)

หรือเขียนในสัญลักษณ์ที่ชีทใช้:

     λₖ = − ⌊D⌋ᵏ {R}ᵏ / ( ⌊D⌋ᵏ [A] {D}ᵏ )    ✓ จบ` },
        ]}/>

        <h3 style={{marginTop:18}}>พิสูจน์ที่ 2 · สูตร αₖ จากเงื่อนไข A-conjugacy</h3>
        <p>ทิศใหม่ <M>{`D^{(k+1)}`}</M> ต้อง <em>A-conjugate</em> กับทิศเก่า <M>{`D^{(k)}`}</M> — แปลว่า "ไม่เดินซ้ำทิศเดิม":</p>
        <Formula><MB>{`(D^{(k+1)})^T \\, A \\, D^{(k)} = 0`}</MB></Formula>
        <p>นิยามของทิศใหม่: <MB>{`D^{(k+1)} = -R^{(k+1)} + \\alpha_k\\, D^{(k)}`}</MB></p>

        <window.HandWalkthrough steps={[
          { title: "Step 1 · แทน D^(k+1) ในเงื่อนไข conjugacy",
            body: `(−R^(k+1) + αₖ D^(k))ᵀ A D^(k) = 0` },
          { title: "Step 2 · กระจาย transpose ของ sum",
            body: `−(R^(k+1))ᵀ A D^(k)  +  αₖ (D^(k))ᵀ A D^(k)  =  0` },
          { title: "Step 3 · แก้หา αₖ",
            body: `αₖ (D^(k))ᵀ A D^(k) = (R^(k+1))ᵀ A D^(k)

      αₖ = (R^(k+1))ᵀ A D^(k) / ( (D^(k))ᵀ A D^(k) )

แบบสัญลักษณ์ที่ชีทใช้:

      αₖ = ⌊R⌋^(k+1) [A] {D}ᵏ / ( ⌊D⌋ᵏ [A] {D}ᵏ )    ✓ จบ` },
        ]}/>

        <Callout kind="tip" title="ความหมายเชิงเรขาคณิต (ภาพ contour อยู่ที่ Sect 2 ด้านบน)">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>λₖ</b> = "เดินลงเขาในทิศ D ไกลเท่าไหร่ก่อนชนทิศตั้งฉาก" — ที่ contour, จุดถัดไปอยู่ ณ ที่ tangent ของ level set ขนานกับ D</li>
            <li><b>αₖ</b> = ปรับทิศใหม่ให้ <em>A-conjugate</em> กับทิศเก่า → ใน metric ของ A, ทิศใหม่ตั้งฉากกับทิศเก่า → ไม่เดินทับทางเดิม</li>
            <li>เพราะ A-conjugate กัน → ในมิติ n, CG รับประกันลู่เข้าใน n รอบเป๊ะ (ดู Sect 2: 2×2 → 2 รอบถึงคำตอบ)</li>
          </ul>
        </Callout>

        <h3 style={{marginTop:18}}>ตรวจสอบสูตรด้วยตัวเลข — ระบบ 2×2 จาก Sect 2</h3>
        <p>ระบบเดียวกับ contour: <M>{`A = \\begin{pmatrix}4 & 1 \\\\ 1 & 3\\end{pmatrix}, \\; b = \\begin{pmatrix}1 \\\\ 2\\end{pmatrix}`}</M>, เริ่มที่ <M>{`x^{(0)} = (2, 1)`}</M></p>
        <PythonRunner code={`import numpy as np

A = np.array([[4,1],[1,3]], float)
b = np.array([1,2], float)
x0 = np.array([2,1], float)

R0 = A @ x0 - b           # residual เริ่มต้น
D0 = -R0                  # ทิศเริ่มต้น = -R⁽⁰⁾
print(f"R⁽⁰⁾ = {R0}")
print(f"D⁽⁰⁾ = {D0}")

# พิสูจน์ที่ 1: λ₀ = -Dᵀ R / (Dᵀ A D)
DTR  = D0 @ R0
DTAD = D0 @ (A @ D0)
lam0 = -DTR / DTAD
print(f"\\nλ₀ = -DᵀR / (DᵀAD) = -({DTR}) / {DTAD} = {lam0:.6f}")

# Update
x1 = x0 + lam0 * D0
R1 = A @ x1 - b
print(f"\\nx⁽¹⁾ = {x1.round(6)}")
print(f"R⁽¹⁾ = {R1.round(6)}")

# พิสูจน์ที่ 2: α₀ = R⁽¹⁾ᵀ A D⁽⁰⁾ / (D⁽⁰⁾ᵀ A D⁽⁰⁾)
RTAD = R1 @ (A @ D0)
alp0 = RTAD / DTAD
print(f"\\nα₀ = RᵀAD / (DᵀAD) = {RTAD:.6f} / {DTAD} = {alp0:.6f}")

# ตรวจสอบ A-conjugacy ของ D⁽¹⁾
D1 = -R1 + alp0 * D0
print(f"\\nD⁽¹⁾ = {D1.round(6)}")
print(f"D⁽¹⁾ᵀ A D⁽⁰⁾ = {D1 @ (A @ D0):.2e}   (ควรเป็น ~0 — A-conjugate ✓)")`} height={320}/>
      </Sect>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · เขียนโปรแกรม + เก็บตาราง" solution={
          <p>โค้ดเหมือนข้างบน — สังเกตว่าโจทย์มักให้ "เก็บค่า x ของทุก iteration ในตาราง" แล้วบอกว่าหยุดเมื่อ <M>{`\\|r\\| < 10^{-6}`}</M></p>
        }>
          จงเขียนโปรแกรม Python แก้ระบบ <M>Ax=b</M> ขนาด n×n ด้วย Conjugate Gradient โดยรับ input matrix และ vector b เป็น input และพิมพ์ x ทุก iteration จนกว่า <M>\|r\| &lt; 10^{`-6`}</M>
        </Problem>
      </Sect>
    </div>
  );
}

function CGPath2D({ rows, A, b }) {
  const W = 480, H = 360;
  const padding = { l: 30, r: 12, t: 14, b: 24 };
  // Domain
  const pts = rows.map(r => r.x);
  const xs = pts.map(p=>p[0]);
  const ys = pts.map(p=>p[1]);
  const xD = [Math.min(...xs)-1.5, Math.max(...xs)+1.5];
  const yD = [Math.min(...ys)-1.5, Math.max(...ys)+1.5];
  const sx = makeScale(xD, [padding.l, W - padding.r]);
  const sy = makeScale(yD, [H - padding.b, padding.t]);

  // True solution
  const det = A[0][0]*A[1][1] - A[0][1]*A[1][0];
  const xt = (b[0]*A[1][1] - b[1]*A[0][1]) / det;
  const yt = (A[0][0]*b[1] - A[1][0]*b[0]) / det;

  // Quadratic form: phi(x,y) = 0.5*(a*x^2 + 2*b*x*y + c*y^2) - bx*x - by*y
  // (assuming A is symmetric)
  function phi(x, y) {
    return 0.5*(A[0][0]*x*x + 2*A[0][1]*x*y + A[1][1]*y*y) - b[0]*x - b[1]*y;
  }
  const phiMin = phi(xt, yt);

  // Level set values
  const levels = [phiMin + 0.2, phiMin + 1, phiMin + 3, phiMin + 6, phiMin + 10];

  // March-y: sample grid + threshold per level → polyline
  // Easier: use 'contour' via marching squares. Implement minimal.
  function getContours(level) {
    const N = 70;
    const path = [];
    const gx = new Array(N+1), gy = new Array(N+1);
    for (let i = 0; i <= N; i++) gx[i] = xD[0] + (xD[1]-xD[0])*i/N;
    for (let j = 0; j <= N; j++) gy[j] = yD[0] + (yD[1]-yD[0])*j/N;
    const f = [];
    for (let i = 0; i <= N; i++) {
      f[i] = [];
      for (let j = 0; j <= N; j++) f[i][j] = phi(gx[i], gy[j]) - level;
    }
    // Marching squares — output line segments
    const segs = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const a = f[i][j], bb = f[i+1][j], c = f[i+1][j+1], dd = f[i][j+1];
        const sign = (v) => v >= 0 ? 1 : 0;
        const code = sign(a) | (sign(bb)<<1) | (sign(c)<<2) | (sign(dd)<<3);
        const interp = (v1, v2, p1, p2) => {
          const t = -v1 / (v2 - v1);
          return [p1[0] + (p2[0]-p1[0])*t, p1[1] + (p2[1]-p1[1])*t];
        };
        const p00 = [gx[i], gy[j]], p10 = [gx[i+1], gy[j]], p11 = [gx[i+1], gy[j+1]], p01 = [gx[i], gy[j+1]];
        const seg = [];
        if (code === 1 || code === 14) { seg.push(interp(a, bb, p00, p10), interp(a, dd, p00, p01)); }
        else if (code === 2 || code === 13) { seg.push(interp(a, bb, p00, p10), interp(bb, c, p10, p11)); }
        else if (code === 3 || code === 12) { seg.push(interp(a, dd, p00, p01), interp(bb, c, p10, p11)); }
        else if (code === 4 || code === 11) { seg.push(interp(bb, c, p10, p11), interp(dd, c, p01, p11)); }
        else if (code === 6 || code === 9)  { seg.push(interp(a, bb, p00, p10), interp(dd, c, p01, p11)); }
        else if (code === 7 || code === 8)  { seg.push(interp(a, dd, p00, p01), interp(dd, c, p01, p11)); }
        if (seg.length === 2) segs.push(seg);
      }
    }
    return segs;
  }

  const contours = levels.map(l => ({ level: l, segs: getContours(l) }));

  return (
    <StepPlayer steps={rows.length} stepDuration={1500} label={s => `Iter ${s}/${rows.length-1}`}>
      {({ step }) => (
        <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
          <Axes width={W} height={H} padding={padding} xDomain={xD} yDomain={yD}/>
          {contours.map((c, ci) => c.segs.map((s, si) => (
            <line key={ci+"-"+si} x1={sx(s[0][0])} y1={sy(s[0][1])} x2={sx(s[1][0])} y2={sy(s[1][1])}
              stroke="#58c4dd" strokeWidth="1" opacity="0.5"/>
          )))}
          {rows.slice(0, step+1).map((r, i) => {
            if (i === 0) return null;
            const p1 = rows[i-1].x, p2 = r.x;
            return <line key={i} x1={sx(p1[0])} y1={sy(p1[1])} x2={sx(p2[0])} y2={sy(p2[1])} stroke="#ffd66b" strokeWidth="2"/>;
          })}
          {rows.slice(0, step+1).map((r, i) => (
            <circle key={i} cx={sx(r.x[0])} cy={sy(r.x[1])} r={i === step ? 6 : 4} fill={i === step ? "#ffd66b" : "#83c167"} stroke="#0e1116" strokeWidth="1.5"/>
          ))}
          <circle cx={sx(xt)} cy={sy(yt)} r="6" fill="#e879bc" stroke="#0e1116" strokeWidth="2"/>
          <text x={sx(xt)+10} y={sy(yt)+4} fill="#e879bc" fontFamily="JetBrains Mono" fontSize="11">x* (จริง)</text>
        </svg>
      )}
    </StepPlayer>
  );
}

function CGResidualPlot() {
  // SPD 4x4 sample
  const A = [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]];
  const b = [12, 17, 14, 7];
  const { rows } = conjugateGradient(A, b, [0,0,0,0], 20);
  const data = rows.map(r => Math.max(r.err, 1e-16));
  const W = 580, H = 280, padding = { l: 50, r: 12, t: 14, b: 26 };
  const ks = data.map((_, i) => i);
  const ys = data.map(v => Math.log10(v));
  const xDomain = [-0.3, ks.length - 0.7];
  const yDomain = [Math.min(...ys) - 0.5, Math.max(...ys) + 0.5];
  const sx = makeScale(xDomain, [padding.l, W - padding.r]);
  const sy = makeScale(yDomain, [H - padding.b, padding.t]);
  // Animated: trace ‖r‖ dropping iteration by iteration
  return (
    <div className="error-plot">
      <StepPlayer steps={ks.length} stepDuration={800} label={(s) => `iteration k = ${s} · ‖r‖ = ${data[s].toExponential(2)}`}>
        {({ step }) => {
          const path = ks.slice(0, step+1).map((k, i) => `${i === 0 ? "M" : "L"}${sx(k).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(" ");
          return (
            <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
              <Axes width={W} height={H} padding={padding} xDomain={xDomain} yDomain={yDomain} xTicks={ks.length} yTicks={5}/>
              <path d={path} fill="none" stroke="#83c167" strokeWidth="2"/>
              {ks.slice(0, step+1).map((k, i) => (
                <circle key={i} cx={sx(k)} cy={sy(ys[i])} r={i === step ? 6 : 4} fill="#83c167"/>
              ))}
              <text x={W/2} y={H-4} fill="#9aa4b2" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">iteration k</text>
              <text x={14} y={H/2} fill="#9aa4b2" fontSize="11" transform={`rotate(-90 14 ${H/2})`} textAnchor="middle" fontFamily="JetBrains Mono">log₁₀ ‖r‖</text>
            </svg>
          );
        }}
      </StepPlayer>
    </div>
  );
}

function CGSolver() {
  const defaultA = [["5","-1","0","0"],["-1","5","-1","0"],["0","-1","5","-1"],["0","0","-1","5"]];
  const defaultB = ["12","17","14","7"];
  const [A, setA] = React.useState(defaultA);
  const [b, setB] = React.useState(defaultB);
  const [result, setResult] = React.useState(null);
  const [err, setErr] = React.useState("");
  const run = () => {
    const An = parseMat(A, 4, 4); const bn = parseVec(b, 4);
    if (!An || !bn) { setErr("กรอกตัวเลขให้ครบ"); return; }
    setErr("");
    setResult(conjugateGradient(An, bn, [0,0,0,0], 30));
  };
  return (
    <div className="solver-shell">
      <h4>CG Solver (4×4 SPD)</h4>
      <div className="input-row">
        <div><div style={{fontSize:'0.722rem', color:"var(--text-faint)", marginBottom:4}}>A</div><MatrixInput value={A} onChange={setA} rows={4} cols={4}/></div>
        <div><div style={{fontSize:'0.722rem', color:"var(--text-faint)", marginBottom:4}}>b</div><MatrixInput value={b.map(x=>[x])} onChange={M => setB(M.map(r=>r[0]))} rows={4} cols={1}/></div>
      </div>
      <button className="btn primary" onClick={run}>▸ คำนวณ</button>
      {err && <Callout kind="danger">{err}</Callout>}
      {result && (
        <>
          <Callout kind="good">
            <b>x =</b> {result.x.map((v,i) => <span key={i} style={{marginRight:14, fontFamily:"var(--font-mono)"}}>x{i+1} = {fmt(v,8)}</span>)}
          </Callout>
          <NumTable
            headers={["k", "x₁", "x₂", "x₃", "x₄", "α", "β", "‖r‖"]}
            rows={result.rows.map(r => [r.iter, ...r.x.map(v => fmt(v,4)), r.alpha != null ? fmt(r.alpha,4) : "—", r.beta != null ? fmt(r.beta,4) : "—", fmt(r.err, 4)])}
          />
        </>
      )}
    </div>
  );
}

window.ConjugateLesson = ConjugateLesson;
