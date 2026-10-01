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
        kicker="05 · Conjugate Gradient"
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

      <CodeRules/>

      <Sect tag="0" title="ทำไมต้องมี CG?">
        <p>Gauss-Seidel ลู่เข้าช้าเมื่อ matrix ใหญ่ขึ้น — สำหรับ <em>symmetric positive-definite</em> matrix ขนาด n×n, <b>Conjugate Gradient รับประกันลู่เข้าใน n iterations</b></p>
        <Callout kind="tip" title="แนวคิด — มอง Ax = b เป็นปัญหาหาค่าต่ำสุด">
          <p>สำหรับ A สมมาตรและ positive-definite, การแก้ <M>Ax=b</M> เทียบเท่าหาค่าต่ำสุดของ:</p>
          <MB>{`\\phi(x) = \\frac{1}{2}x^T A x - b^T x`}</MB>
          <p>เพราะ <M>{`\\nabla \\phi(x) = Ax - b = 0 \\Leftrightarrow Ax = b`}</M></p>
          <p>กราฟของ <M>{`\\phi`}</M> คือ "ชาม" (paraboloid) — CG ก็คือเดินลง<b>ก้นชาม</b>ด้วยทิศที่ "conjugate" กัน → ไม่เดินทางซ้ำ</p>
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

      <Sect tag="3" title="ทำมือ — ตัวอย่าง 3×3">
        <p>ระบบ 3×3 ตัวอย่าง <span className="muted">(ไม่ใช่ตัวอย่างในสไลด์ — สไลด์ใช้ระบบ 3×3 อีกชุด ดูหมวด 9)</span>, เริ่ม <M>x^{`(0)`} = (0, 0, 0)</M>:</p>
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
            <span><Key>HOME</Key> → <code>Matrix</code> → <Key>OK</Key> → <Key>TOOLS</Key> → <code>[MatA:]</code> → ใส่ขนาด n×n → <code>[Confirm]</code> (เก็บ A)</span>,
            <span>เก็บ <Key>MatB</Key> = <M>{`D^{(k)}`}</M> เป็น column vector n×1</span>,
            <span>เก็บ <Key>MatC</Key> = <M>{`R^{(k)}`}</M> เป็น column vector n×1</span>,
            <span><Key>CATALOG</Key> → <code>Matrix</code> → เลือก <code>MatA</code> แล้ว <code>MatB</code> ให้เป็น <code>MatA×MatB</code> → <Key>EXE</Key> → ผลออกมาเป็น <code>MatAns</code></span>,
            <span>คัดผลไปเก็บเป็น MatD: ตอนอยู่หน้า <code>MatAns</code> กด <Key>TOOLS</Key> → <code>[Store]</code> → <code>[MatD]</code> <span className="muted">(EN น.118)</span></span>,
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
        <div>นิยามของทิศใหม่: <MB>{`D^{(k+1)} = -R^{(k+1)} + \\alpha_k\\, D^{(k)}`}</MB></div>

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

      <HW8Section/>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · เขียนโปรแกรม + เก็บตาราง" solution={
          <div>
            <p style={{margin:"0 0 6px"}}>โค้ดเหมือนหมวด 4 ข้างบน · สิ่งที่ต้องมีให้ครบตาม<b>กฎโค้ดของอาจารย์</b>:</p>
            <ul style={{margin:"0 0 8px", paddingLeft:18}}>
              <li><b>ฮาร์ดโค้ด <M>A</M> กับ <M>b</M> ไว้บนสุด</b> — ห้ามใช้ <code>input()</code></li>
              <li>ลูปหยุดด้วย <b><M>{`\\|r\\| < 10^{-6}`}</M></b> ไม่ใช่จำนวนรอบ (<code>max_iter</code> ใส่ได้แต่เป็นแค่ตาข่าย)</li>
              <li><b>พิมพ์ทุกรอบ</b>: iteration · <M>x</M> ทุกตัว · <M>{`\\|r\\|`}</M> ของรอบนั้น</li>
              <li>ใช้ <code>n = len(A)</code> ห้ามฮาร์ดโค้ด 3</li>
            </ul>
            <p style={{margin:0}}>ตรวจคำตอบ: ระบบในหมวด 3 (<M>{`A=[[5,-1,0],[-1,5,-1],[0,-1,5]]`}</M>, <M>{`b=(12,17,14)`}</M>) ต้องจบใน <b>3 รอบ</b> ได้ <M>{`x=(3.365217,\\;4.826087,\\;3.765217)`}</M> — CG การันตีว่า<b>ลู่เข้าภายใน n รอบ</b>สำหรับเมทริกซ์ SPD ขนาด <M>{`n\\times n`}</M></p>
          </div>
        }>
          จงเขียนโปรแกรม Python แก้ระบบ <M>Ax=b</M> ขนาด <M>{`n\\times n`}</M> ด้วย Conjugate Gradient · <b>ฮาร์ดโค้ดข้อมูลไว้บนสุด (ห้ามรับ input)</b> · พิมพ์ <M>x</M> ทุก iteration จนกว่า <M>{`\\|r\\| < 10^{-6}`}</M>
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

// ===== การบ้าน 8 (ปีนี้) — Conjugate Gradient · ทุกตัวเลขมาจาก python full precision แล้วปัด 6 ตำแหน่ง =====
function HW8Section() {
  const HW8_SCALARS = [
    ["0", "−678.000000", "5550.000000", "0.122162", "0.996832", "ไม่ → ทำต่อ", "8.134054", "0.001466"],
    ["1", "−0.993674", "6.219767", "0.159761", "0.036867", "ไม่ → ทำต่อ", "0.008508", "0.001368"],
    ["2", "−0.001359", "0.003253", "0.417782", "0.014302", "ไม่ → ทำต่อ", "0.000490", "0.150494"],
    ["3", "−0.000205", "0.000569", "0.359658", "4.351168 × 10⁻¹⁵", "✓ หยุด", "—", "—"],
  ];
  const HW8_VECTORS = [
    ["0", "(12.000000, 17.000000, 14.000000, 7.000000)", "(94.000000, 137.000000, 118.000000, 63.000000)", "(1.465946, 2.076757, 1.710270, 0.855135)", "(−0.516757, −0.263784, 0.415135, 0.696216)", "(0.534344, 0.288699, −0.394617, −0.685957)"],
    ["1", "(0.534344, 0.288699, −0.394617, −0.685957)", "(3.249117, 1.722949, −2.767600, −4.219019)", "(1.551313, 2.122879, 1.647226, 0.745546)", "(0.002324, 0.011476, −0.027018, 0.022183)", "(−0.001593, −0.011081, 0.026479, −0.023122)"],
    ["2", "(−0.001593, −0.011081, 0.026479, −0.023122)", "(−0.030128, −0.005633, 0.063988, −0.062651)", "(1.550647, 2.118250, 1.658288, 0.735886)", "(−0.010263, 0.009122, −0.000285, −0.003991)", "(0.010023, −0.010790, 0.004270, 0.000511)"],
    ["3", "(0.010023, −0.010790, 0.004270, 0.000511)", "(0.028534, −0.025364, 0.000793, 0.011097)", "(1.554252, 2.114370, 1.659824, 0.736070)", "≈ 10⁻¹⁵ ทุกช่อง", "— (หยุดแล้ว)"],
  ];
  return (
    <>
      {/* ───────────── ข้อ 1 ───────────── */}
      <Sect tag="8" title="การบ้าน 8 (ปีนี้) · ข้อ 1 — CG ระบบ 4×4 + นับรอบที่ ε = 0.000001">
        <Callout kind="tip" title="โจทย์ (ใบการบ้าน 8 ข้อ 1.1)">
          <MB>{`\\begin{bmatrix} 5 & 2 & 0 & 0 \\\\ 2 & 5 & 2 & 0 \\\\ 0 & 2 & 5 & 2 \\\\ 0 & 0 & 2 & 5 \\end{bmatrix} \\begin{Bmatrix} x_1 \\\\ x_2 \\\\ x_3 \\\\ x_4 \\end{Bmatrix} = \\begin{Bmatrix} 12 \\\\ 17 \\\\ 14 \\\\ 7 \\end{Bmatrix}`}</MB>
          <p style={{margin:0}}>ใช้ Conjugate Gradient เริ่ม <M>{`x_1=x_2=x_3=x_4=0`}</M> · แสดงวิธีทำ · และถ้า <M>{`\\varepsilon = 0.000001`}</M> ต้องทำกี่รอบ (เขียนโปรแกรม)</p>
        </Callout>

        <h3>ขั้น 0 · เช็คก่อนว่าใช้ CG ได้ไหม (A ต้องสมมาตร + positive definite)</h3>
        <ul>
          <li><b>สมมาตร</b>: <M>{`a_{ij}=a_{ji}`}</M> ทุกคู่ ✓ (2 อยู่คู่กันเหนือ-ใต้แนวทแยง)</li>
          <li><b>Positive definite</b> (วิธีในสไลด์ "POSITIVE DEFINITE MATRIX" = determinant มุมซ้ายบนทุกขนาดต้อง &gt; 0):
            <M>{`D_1 = 5`}</M>, <M>{`D_2 = 25-4 = 21`}</M>, <M>{`D_3 = 5(21)-2(10) = 85`}</M>, <M>{`D_4 = \\det A = 341`}</M> — บวกหมด ✓</li>
          <li>ทำไมต้องเช็ค: สูตร λₖ มาจากการหา <b>ต่ำสุด</b>ของ f ตามเส้นตรง — ต่ำสุดมีจริงก็ต่อเมื่อ <M>{`D^TAD>0`}</M> ซึ่งรับประกันโดย positive definite (ดูข้อ 2 ว่าถ้าไม่ใช่จะเกิดอะไร)</li>
        </ul>

        <h3>ขั้น 1–2 · เริ่มต้น (Step 1, 2 ของสไลด์)</h3>
        <MB>{`\\{R\\}^0 = [A]\\{X\\}^0 - \\{B\\} = \\{0\\} - \\{B\\} = \\begin{Bmatrix} -12 \\\\ -17 \\\\ -14 \\\\ -7 \\end{Bmatrix}`}</MB>
        <MB>{`\\{D\\}^0 = -\\{R\\}^0 = \\begin{Bmatrix} 12 \\\\ 17 \\\\ 14 \\\\ 7 \\end{Bmatrix}`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>ทำไม D⁰ = −R⁰: R = AX − B คือ gradient ของ f (ข้อ 3) → −R คือทิศที่ f ลดเร็วที่สุด รอบแรกยังไม่มีทิศเก่าให้ "ผสม" จึงใช้ steepest descent ตรง ๆ</p>

        <h3>รอบ k = 0 · ทำมือเต็มขั้น</h3>
        <MB>{`[A]\\{D\\}^0 = \\begin{Bmatrix} 5(12)+2(17) \\\\ 2(12)+5(17)+2(14) \\\\ 2(17)+5(14)+2(7) \\\\ 2(14)+5(7) \\end{Bmatrix} = \\begin{Bmatrix} 94 \\\\ 137 \\\\ 118 \\\\ 63 \\end{Bmatrix}`}</MB>
        <MB>{`\\lfloor D\\rfloor^0\\{R\\}^0 = -(12^2+17^2+14^2+7^2) = -678`}</MB>
        <MB>{`\\lfloor D\\rfloor^0[A]\\{D\\}^0 = 12(94)+17(137)+14(118)+7(63) = 5550`}</MB>
        <MB>{`\\lambda_0 = -\\frac{-678}{5550} = \\frac{113}{925} = 0.122162`}</MB>
        <MB>{`\\{X\\}^1 = \\{X\\}^0 + \\lambda_0\\{D\\}^0 = \\begin{Bmatrix} 1.465946 \\\\ 2.076757 \\\\ 1.710270 \\\\ 0.855135 \\end{Bmatrix}`}</MB>
        <MB>{`\\{R\\}^1 = [A]\\{X\\}^1 - \\{B\\} = \\begin{Bmatrix} -0.516757 \\\\ -0.263784 \\\\ 0.415135 \\\\ 0.696216 \\end{Bmatrix}`}</MB>
        <MB>{`\\text{Error} = \\sqrt{\\lfloor R\\rfloor^1\\{R\\}^1} = 0.996832 \\; > \\; 0.000001 \\;\\Rightarrow\\; \\text{ทำต่อ}`}</MB>
        <MB>{`\\alpha_0 = \\frac{\\lfloor R\\rfloor^1[A]\\{D\\}^0}{\\lfloor D\\rfloor^0[A]\\{D\\}^0} = \\frac{8.134054}{5550} = 0.001466`}</MB>
        <MB>{`\\{D\\}^1 = -\\{R\\}^1 + \\alpha_0\\{D\\}^0 = \\begin{Bmatrix} 0.534344 \\\\ 0.288699 \\\\ -0.394617 \\\\ -0.685957 \\end{Bmatrix}`}</MB>
        <Callout kind="tip" title="ทางลัดคำนวณ R ใหม่ (ได้ค่าเดียวกับสไลด์เป๊ะ)">
          <p style={{margin:0}}>เพราะ <M>{`X^{k+1} = X^k + \\lambda_k D^k`}</M> → <M>{`R^{k+1} = AX^{k+1}-B = (AX^k - B) + \\lambda_k AD^k = R^k + \\lambda_k\\,AD^k`}</M> · ใช้ <M>{`AD^k`}</M> ที่คำนวณไว้แล้วซ้ำได้ ไม่ต้องคูณเมทริกซ์ใหม่ เช่น <M>{`R^1_1 = -12 + 0.122162(94) = -0.516757`}</M> (คิดด้วย λ₀ เต็มทศนิยม)</p>
        </Callout>

        <h3>ตารางทุกรอบ (จากโปรแกรมข้างล่าง · ปัด 6 ตำแหน่ง)</h3>
        <NumTable headers={["k", "⌊D⌋ᵏ{R}ᵏ", "⌊D⌋ᵏ[A]{D}ᵏ", "λₖ", "Error = ‖R⁽ᵏ⁺¹⁾‖", "< ε ?", "⌊R⌋ᵏ⁺¹[A]{D}ᵏ", "αₖ"]} rows={HW8_SCALARS}/>
        <NumTable headers={["k", "{D}ᵏ", "[A]{D}ᵏ", "{X}ᵏ⁺¹", "{R}ᵏ⁺¹", "{D}ᵏ⁺¹"]} rows={HW8_VECTORS}/>
        <Callout kind="good" title="คำตอบข้อ 1">
          <p style={{margin:"0 0 6px"}}><M>{`x_1 = 1.554252,\\; x_2 = 2.114370,\\; x_3 = 1.659824,\\; x_4 = 0.736070`}</M> <span className="muted">(ค่าจริงเป็นเศษส่วน 530/341, 721/341, 566/341, 251/341 — ตรงกับโปรแกรมทุกหลัก)</span></p>
          <p style={{margin:0}}>ที่ <M>{`\\varepsilon = 0.000001`}</M> ต้องทำ <b>4 รอบ</b> (โปรแกรมพิมพ์ Error รอบ 4 = 4.351168×10⁻¹⁵ แบบ numpy · 1.776357×10⁻¹⁵ แบบ list ล้วน)</p>
        </Callout>
        <Callout kind="warn" title="ทำมือต้องถือทศนิยมเต็ม — อย่าปัดกลางทาง">
          <p style={{margin:0}}>ดูตารางแถว k = 2, 3: <M>{`D^TR`}</M> และ <M>{`D^TAD`}</M> เล็กระดับ 10⁻³–10⁻⁴ ถ้าปัดเหลือ 6 ตำแหน่งแล้วเอาไปหารต่อ λ จะเพี้ยนตั้งแต่หลักที่ 3 — ตารางนี้แค่<b>แสดง</b> 6 ตำแหน่ง แต่ทุกค่าคำนวณต่อจากค่าเต็มของโปรแกรม · ในห้องสอบให้เก็บค่าลงตัวแปรเครื่องคิดเลข (ดูหมวด 4.5) แทนการจดแล้วพิมพ์ใหม่</p>
        </Callout>

        <h3>ทฤษฎีบอก ≤ 4 รอบ — แล้วเลขทศนิยมของคอมพิวเตอร์ถึง 10⁻⁶ ที่รอบ 4 จริงไหม?</h3>
        <ul>
          <li><b>ในเลขคณิตแม่นยำ</b> (เศษส่วน): ทิศ D⁰…D³ A-conjugate กันทั้ง 4 ทิศ = เป็นฐานของปริภูมิ 4 มิติ → หลังเดินครบ 4 ทิศ R⁴ = 0 <b>เป๊ะ</b> (เช็คด้วย Fraction แล้ว: λ₃ = 28063/78027 ให้ X⁴ = คำตอบเศษส่วนตรงตัว)</li>
          <li><b>ใน floating point</b>: R⁴ ไม่เป็น 0 เป๊ะ แต่เหลือ ~10⁻¹⁵ = ความละเอียดของ double (≈2.2×10⁻¹⁶) คูณขนาดตัวเลขในระบบ (~10) — <b>ต่ำกว่า 10⁻⁶ มหาศาล จึงหยุดที่รอบ 4 พอดี</b> ตามทฤษฎี</li>
          <li>เลขท้าย (4.35 vs 1.78 ×10⁻¹⁵) ต่างกันตามลำดับการบวกของแต่ละวิธี — <b>ไม่ต้องจำเลขนี้</b> จำแค่ว่า "ระดับ 10⁻¹⁵ = ศูนย์ของคอมพิวเตอร์"</li>
          <li>ที่รอดเพราะ A นี้ "ดี": eigenvalue อยู่ช่วง 1.763932–8.236068 → condition number ≈ 4.669 ถ้าเมทริกซ์ใหญ่และ condition แย่ ความคลาดจากการปัดจะทำให้ทิศเสีย conjugacy ทีละน้อย และอาจต้องใช้<b>เกิน n รอบ</b> — นี่คือเหตุผลที่โปรแกรมต้องหยุดด้วย ε ไม่ใช่วนตายตัว n รอบ</li>
          <li>สังเกต Error รอบ 2→3 ลดแค่ 0.036867 → 0.014302 แล้วรอบ 4 ดิ่งลงศูนย์ — CG ไม่ได้การันตีว่า ‖R‖ ลดเท่า ๆ กันทุกรอบ สิ่งที่การันตีคือ <b>จบภายใน n รอบ</b></li>
        </ul>

        <h3>โปรแกรม (หยุดด้วย tolerance ตามกฎอาจารย์)</h3>
        <p>ลูป <code>while True</code> เช็ค <code>error &lt; eps</code> ทุกรอบ · <code>MAX_ITER</code> เป็นแค่ตาข่ายกันค้าง ไม่ใช่ตัวกำหนดจำนวนรอบ · ใช้สัญลักษณ์เดียวกับสไลด์ (λ = ก้าว, α = ผสมทิศ)</p>
        <PythonRunner code={`# การบ้าน 8 ข้อ 1 — Conjugate Gradient (numpy) · หยุดด้วย tolerance
import numpy as np

A = np.array([[5, 2, 0, 0],
              [2, 5, 2, 0],
              [0, 2, 5, 2],
              [0, 0, 2, 5]], dtype=float)
B = np.array([12, 17, 14, 7], dtype=float)
X = np.zeros(len(B))          # X0 = (0, 0, 0, 0)
eps = 0.000001
MAX_ITER = 100                # ตาข่ายกันลูปไม่รู้จบ — ไม่ใช่เงื่อนไขหยุดหลัก

R = A @ X - B                 # R0 = A X0 - B
D = -R                        # D0 = -R0
k = 0
while True:
    AD = A @ D
    lam = -(D @ R) / (D @ AD)             # lambda_k = -(D^T R)/(D^T A D)
    X = X + lam * D                       # X(k+1)
    R_new = A @ X - B                     # R(k+1)
    error = np.sqrt(R_new @ R_new)        # sqrt(R^T R)
    print(f"iter {k+1}: lambda = {lam:.6f}  X = {np.round(X, 6)}  Error = {error:.6e}")
    if error < eps:
        break
    alpha = (R_new @ AD) / (D @ AD)       # alpha_k = (R(k+1)^T A D)/(D^T A D)
    D = -R_new + alpha * D                # D(k+1)
    print(f"         alpha  = {alpha:.6f}  D = {np.round(D, 6)}")
    R = R_new
    k += 1
    if k >= MAX_ITER:
        print("ไม่ลู่เข้าภายใน MAX_ITER รอบ")
        break

print(f"\\nจำนวนรอบ = {k+1}")
print(f"X = {np.round(X, 6)}")`} height={440}/>
        <p style={{marginTop:14}}>เวอร์ชันไม่ใช้ numpy (เผื่อห้องสอบไม่ให้ import) — ผลเหมือนกันถึง 6 ตำแหน่ง:</p>
        <PythonRunner code={`# การบ้าน 8 ข้อ 1 — Conjugate Gradient แบบไม่ใช้ numpy (list ล้วน)
A = [[5, 2, 0, 0],
     [2, 5, 2, 0],
     [0, 2, 5, 2],
     [0, 0, 2, 5]]
B = [12, 17, 14, 7]
n = len(B)
X = [0.0] * n
eps = 0.000001
MAX_ITER = 100

def matvec(M, v):
    return [sum(M[i][j] * v[j] for j in range(n)) for i in range(n)]

def dot(u, v):
    return sum(u[i] * v[i] for i in range(n))

AX = matvec(A, X)
R = [AX[i] - B[i] for i in range(n)]      # R0 = A X0 - B
D = [-R[i] for i in range(n)]             # D0 = -R0
k = 0
while True:
    AD = matvec(A, D)
    lam = -dot(D, R) / dot(D, AD)
    X = [X[i] + lam * D[i] for i in range(n)]
    AX = matvec(A, X)
    R_new = [AX[i] - B[i] for i in range(n)]
    error = dot(R_new, R_new) ** 0.5
    print(f"iter {k+1}: lambda = {lam:.6f}  X = {[round(v, 6) for v in X]}  Error = {error:.6e}")
    if error < eps:
        break
    alpha = dot(R_new, AD) / dot(D, AD)
    D = [-R_new[i] + alpha * D[i] for i in range(n)]
    R = R_new
    k += 1
    if k >= MAX_ITER:
        print("ไม่ลู่เข้าภายใน MAX_ITER รอบ")
        break

print(f"\\nจำนวนรอบ = {k+1}")
print("X =", [round(v, 6) for v in X])`} height={440}/>

        <Problem label="Exam twist A · เปลี่ยน ε แล้วนับรอบใหม่ (ระบบเดิมของข้อ 1)" solution={
          <div>
            <p style={{margin:"0 0 6px"}}>ไม่ต้องรันใหม่ — อ่านคอลัมน์ Error จากตาราง แล้วหา<b>รอบแรก</b>ที่ Error &lt; ε (Error รอบ 1–4 = 0.996832, 0.036867, 0.014302, 4.351168×10⁻¹⁵)</p>
            <NumTable headers={["ε", "รอบแรกที่ Error < ε", "จำนวนรอบ"]} rows={[
              ["1", "รอบ 1 (0.996832)", "1"],
              ["0.1", "รอบ 2 (0.036867)", "2"],
              ["0.02", "รอบ 3 (0.014302)", "3"],
              ["0.01", "รอบ 4 (0.014302 ยังไม่ผ่าน)", "4"],
              ["0.000001", "รอบ 4", "4"],
            ]}/>
            <p style={{margin:"6px 0 0"}}>กับดัก: ε = 0.01 คนมักตอบ 3 เพราะ 0.014302 "ดูใกล้" — แต่ 0.014302 &gt; 0.01 จึงยังไม่หยุด · และอย่าตั้ง ε ต่ำกว่าระดับ ~10⁻¹² เพราะ Error ติดพื้นที่ความละเอียดของ double (~10⁻¹⁵) ลูปอาจไม่เคยผ่านเงื่อนไข</p>
          </div>
        }>
          ระบบเดียวกับข้อ 1 เริ่มที่ 0 · ถ้าเปลี่ยน ε เป็น 1, 0.1, 0.02, 0.01 ต้องทำกี่รอบตามลำดับ?
        </Problem>

        <Problem label="Exam twist B · A ไม่สมมาตร → คูณ Aᵀ ก่อน (ตามสไลด์หน้าสุดท้าย)" solution={
          <div>
            <p style={{margin:"0 0 6px"}}>A ไม่สมมาตร (a₁₂ = 1 ≠ a₂₁ = 2) → สไลด์ให้คูณ <M>{`[A]^T`}</M> ทั้งสองข้าง: <M>{`[A]^T[A]\\{X\\} = [A]^T\\{B\\}`}</M> ได้เมทริกซ์ใหม่ที่สมมาตรเสมอ (<M>{`(A^TA)^T = A^TA`}</M>) และ positive definite ถ้า A ไม่ singular (<M>{`x^TA^TAx = \\|Ax\\|^2 > 0`}</M>)</p>
            <MB>{`\\bar A = A^TA = \\begin{bmatrix} 20 & 10 \\\\ 10 & 10 \\end{bmatrix}, \\qquad \\bar B = A^TB = \\begin{Bmatrix} 40 \\\\ 30 \\end{Bmatrix}`}</MB>
            <NumTable headers={["k", "λₖ", "{X}ᵏ⁺¹", "{R}ᵏ⁺¹", "Error", "αₖ", "{D}ᵏ⁺¹"]} rows={[
              ["0", "0.038462", "(1.538462, 1.153846)", "(2.307692, −3.076923)", "3.846154", "0.005917", "(−2.071006, 3.254438)"],
              ["1", "0.260000", "(1.000000, 2.000000)", "(0, 0)", "0.000000", "—", "—"],
            ]}/>
            <p style={{margin:"6px 0 0"}}>คำตอบ <M>{`X = (1, 2)`}</M> ใน <b>2 รอบ</b> (= n) · ถ้าฝืนรัน CG กับ A เดิมที่ไม่สมมาตรตรง ๆ โปรแกรมใช้ <b>14 รอบ</b> กว่า Error &lt; 10⁻⁶ — ไม่มีการันตี n รอบอีกต่อไป</p>
          </div>
        }>
          แก้ <M>{`\\begin{bmatrix} 4 & 1 \\\\ 2 & 3 \\end{bmatrix}\\{X\\} = \\begin{Bmatrix} 6 \\\\ 8 \\end{Bmatrix}`}</M> ด้วย CG เริ่ม X⁰ = 0, ε = 0.000001 · ทำได้ตรง ๆ ไหม ถ้าไม่ได้ต้องแปลงอย่างไร แล้วใช้กี่รอบ?
        </Problem>
      </Sect>

      {/* ───────────── ข้อ 2 ───────────── */}
      <Sect tag="9" title="การบ้าน 8 (ปีนี้) · ข้อ 2 — หา f(x₁,x₂) + contour · กับดัก: A ไม่ positive definite">
        <Callout kind="tip" title="โจทย์ (ใบการบ้าน 8 ข้อ 2)">
          <p style={{margin:0}}><M>{`A = \\begin{bmatrix} 2 & 5 \\\\ 5 & 1 \\end{bmatrix},\\; B = \\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix}`}</M> และ <M>{`f(x_1,x_2) = \\tfrac12\\lfloor X\\rfloor[A]\\{X\\} - \\lfloor B\\rfloor\\{X\\}`}</M> · จงหา f พร้อมวาดกราฟ contour</p>
        </Callout>

        <h3>กระจาย f ทีละขั้น (แบบเดียวกับสไลด์หน้า 2)</h3>
        <MB>{`[A]\\{X\\} = \\begin{bmatrix} 2 & 5 \\\\ 5 & 1 \\end{bmatrix}\\begin{Bmatrix} x_1 \\\\ x_2 \\end{Bmatrix} = \\begin{Bmatrix} 2x_1 + 5x_2 \\\\ 5x_1 + x_2 \\end{Bmatrix}`}</MB>
        <MB>{`\\lfloor X\\rfloor[A]\\{X\\} = x_1(2x_1+5x_2) + x_2(5x_1+x_2)`}</MB>
        <MB>{`\\phantom{\\lfloor X\\rfloor[A]\\{X\\}} = 2x_1^2 + 10x_1x_2 + x_2^2`}</MB>
        <MB>{`\\lfloor B\\rfloor\\{X\\} = 3x_1 + 2x_2`}</MB>
        <Formula label="คำตอบข้อ 2 (ส่วนสมการ)">
          <MB>{`f(x_1,x_2) = \\tfrac12(2x_1^2 + 10x_1x_2 + x_2^2) - 3x_1 - 2x_2`}</MB>
          <MB>{`\\boxed{f(x_1,x_2) = x_1^2 + 5x_1x_2 + \\tfrac12 x_2^2 - 3x_1 - 2x_2}`}</MB>
        </Formula>
        <p className="muted" style={{fontSize:'0.8rem'}}>ทำไมพจน์ไขว้เป็น 10x₁x₂ ไม่ใช่ 5x₁x₂: a₁₂ = 5 กับ a₂₁ = 5 ต่างก็ให้ 5x₁x₂ คนละครั้ง รวมเป็น 10 — แล้ว ½ ข้างหน้าหารเหลือ 5 (เช็คด้วย sympy แล้ว)</p>

        <h3>จุดที่ gradient = 0</h3>
        <MB>{`\\frac{\\partial f}{\\partial x_1} = 2x_1 + 5x_2 - 3 = 0, \\qquad \\frac{\\partial f}{\\partial x_2} = 5x_1 + x_2 - 2 = 0`}</MB>
        <p>ก็คือระบบ <M>{`[A]\\{X\\}=\\{B\\}`}</M> เดิมนั่นเอง (สไลด์: <M>{`\\partial f/\\partial\\{X\\} = [A]\\{X\\}-\\{B\\}`}</M>) · แก้ด้วย Cramer (<M>{`\\det A = 2(1)-5(5) = -23`}</M>):</p>
        <MB>{`x_1^* = \\frac{3(1)-5(2)}{-23} = \\frac{7}{23} = 0.304348`}</MB>
        <MB>{`x_2^* = \\frac{2(2)-5(3)}{-23} = \\frac{11}{23} = 0.478261`}</MB>
        <MB>{`f(X^*) = -\\frac{43}{46} = -0.934783`}</MB>

        <Callout kind="danger" title="⚠ กับดักใหญ่: จุดนี้ไม่ใช่จุดต่ำสุด — เป็น 'จุดอานม้า' (saddle)">
          <p style={{margin:"0 0 6px"}}>ใช้เกณฑ์ในสไลด์ "POSITIVE DEFINITE MATRIX": <M>{`D_1 = 2 > 0`}</M> แต่ <M>{`D_2 = \\det A = -23 < 0`}</M> ✗ → <b>A ไม่ positive definite</b> (eigenvalue = 6.524938 และ −3.524938 — บวกหนึ่ง ลบหนึ่ง)</p>
          <p style={{margin:"0 0 6px"}}><b>ทำไมถึงเป็นอานม้า</b> — เพราะ <M>{`AX^*=B`}</M> ทำให้เขียน f รอบจุด X* ได้เป๊ะ ๆ (พหุนามดีกรี 2 ไม่มีพจน์ที่เหลือ):</p>
          <MB>{`f(X^* + d) = f(X^*) + \\tfrac12\\, d^T A\\, d`}</MB>
          <ul style={{margin:"0 0 6px", paddingLeft:18}}>
            <li>ถ้า A positive definite → <M>{`d^TAd>0`}</M> ทุกทิศ → ขยับไปทางไหน f ก็<b>เพิ่ม</b> → X* คือก้นชาม (contour = วงรี)</li>
            <li>ที่นี่ ทิศ <M>{`d=(1,0)`}</M>: <M>{`d^TAd = 2 > 0`}</M> (ขึ้น) · ทิศ <M>{`d=(1,-1)`}</M>: <M>{`d^TAd = 2-10+1 = -7 < 0`}</M> (ลง) → บางทิศขึ้น บางทิศลง = อานม้า · f <b>ไม่มีค่าต่ำสุด</b> (ลงไปได้ถึง −∞)</li>
            <li>Contour จึงเป็น<b>ไฮเพอร์โบลา</b> ไม่ใช่วงรี · เส้นระดับ f = f(X*) พอดีกลายเป็นเส้นตรง 2 เส้นตัดกันที่ X* (ทิศที่ <M>{`d^TAd = 0`}</M>: <M>{`d=(1,t),\\; t^2+10t+2=0 \\Rightarrow t = -5\\pm\\sqrt{23}`}</M> = −0.204168 และ −9.795832)</li>
          </ul>
          <p style={{margin:0}}>เทียบกับตัวอย่างในสไลด์ <M>{`\\begin{bmatrix} 2 & 1 \\\\ 1 & 3 \\end{bmatrix}`}</M>: D₁ = 2, D₂ = 5 บวกหมด → ชาม วงรีซ้อนกัน ก้นชามที่ (3, −2) — กดสลับดูในภาพข้างล่าง</p>
        </Callout>

        <h3>เห็นภาพ · สลับชาม ↔ อานม้า แล้วดู CG เดิน</h3>
        <HW8Contour/>

        <Callout kind="warn" title="แล้ว CG ใช้กับข้อ 2 ได้ไหม? — ทำไมทฤษฎีต้องการ SPD">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>สูตร λ</b> มาจาก g(λ) = f(X + λD) = f(X) + λDᵀR + ½λ²DᵀAD (ข้อ 3) — เป็นพาราโบลาหงายก็ต่อเมื่อ <M>{`D^TAD>0`}</M> ถ้า <M>{`D^TAD<0`}</M> สูตรเดิมพาไปที่<b>จุดสูงสุด</b>ตามเส้น · ถ้า <M>{`D^TAD=0`}</M> หารด้วยศูนย์ → โปรแกรมพัง (breakdown)</li>
            <li>รันจริงกับข้อ 2 (X⁰ = 0): รอบ 1 <M>{`D^TAD = 82`}</M>, λ₀ = 0.158537, α₀ = 0.053688 · รอบ 2 <M>{`D^TAD = -2.544955`}</M> <b>ติดลบ</b> → λ₁ = −0.274247 (<b>เดินถอยหลัง</b>) แต่ก็ไปตกที่ X* = (0.304348, 0.478261) ใน 2 รอบ เพราะพีชคณิตยังแก้ AX = B ได้ถ้าไม่เจอตัวหารศูนย์ — <b>แค่ไม่มีอะไรการันตี</b> และสิ่งที่ได้คือจุดอานม้า ไม่ใช่ค่าต่ำสุด</li>
            <li>ตัวอย่าง 3×3 ในสไลด์ (<M>{`[[4,-4,0],[-4,4,-2],[0,-2,4]]`}</M>) ก็<b>ไม่ใช่</b> positive definite (eigenvalue −0.472136, 4, 8.472136) — λ₁ ในสไลด์ = −1.9836 (โปรแกรม: −1.983607) ติดลบคือลายนิ้วมือเดียวกัน · ถ้าเจอ λ ติดลบในข้อสอบ ให้สงสัยว่า A ไม่ SPD</li>
          </ul>
        </Callout>

        <h3>โปรแกรมวาด contour (matplotlib · label ภาษาอังกฤษเพราะ Pyodide ไม่มีฟอนต์ไทย)</h3>
        <PythonRunner code={`# การบ้าน 8 ข้อ 2 — f(x1,x2) = 1/2 X^T A X - B^T X  และ contour
import numpy as np
import matplotlib.pyplot as plt

A = np.array([[2, 5], [5, 1]], dtype=float)
B = np.array([3, 2], dtype=float)

def f(x1, x2):
    # กระจายแล้ว: x1^2 + 5 x1 x2 + 0.5 x2^2 - 3 x1 - 2 x2
    return x1**2 + 5*x1*x2 + 0.5*x2**2 - 3*x1 - 2*x2

# เช็คว่าสูตรกระจายตรงกับรูปเมทริกซ์ (ที่จุดสุ่ม)
X = np.array([1.3, -0.7])
print("matrix form :", 0.5 * X @ A @ X - B @ X)
print("expanded    :", f(*X))

Xs = np.linalg.solve(A, B)                       # จุดที่ grad f = AX - B = 0
print("det(A)      =", np.linalg.det(A))
print("eigenvalues =", np.linalg.eigvalsh(A))
print("stationary X* =", np.round(Xs, 6), " f(X*) =", round(f(*Xs), 6))

x1 = np.linspace(Xs[0] - 3, Xs[0] + 3, 300)
x2 = np.linspace(Xs[1] - 3, Xs[1] + 3, 300)
G1, G2 = np.meshgrid(x1, x2)
Z = f(G1, G2)

fig, ax = plt.subplots(figsize=(6, 5))
cs = ax.contour(G1, G2, Z, levels=np.linspace(-12, 12, 25), cmap="coolwarm")
ax.clabel(cs, inline=True, fontsize=7)
ax.contour(G1, G2, Z, levels=[f(*Xs)], colors="k", linewidths=1.5, linestyles="--")
ax.plot(*Xs, "ko")
ax.annotate("saddle X*", Xs, textcoords="offset points", xytext=(8, 8))
ax.set_xlabel("x1"); ax.set_ylabel("x2")
ax.set_title("f = x1^2 + 5x1x2 + 0.5x2^2 - 3x1 - 2x2  (saddle)")
ax.set_aspect("equal")
plt.show()`} height={520}/>
      </Sect>

      {/* ───────────── ข้อ 3 ───────────── */}
      <Sect tag="10" title="การบ้าน 8 (ปีนี้) · ข้อ 3 — พิสูจน์ λₖ และ αₖ (KaTeX เต็มขั้น + เหตุผลทุกบรรทัด)">
        <p>หมวด 7 มีโครงพิสูจน์แบบข้อความแล้ว — หมวดนี้เขียนเป็นสมการเต็มแบบที่ควรเขียนลงกระดาษคำตอบ โดยใช้สัญลักษณ์ใบการบ้าน (λ = ก้าว, α = ผสมทิศ) · กำหนด A สมมาตร, <M>{`\\{R\\}^k = [A]\\{X\\}^k - \\{B\\}`}</M></p>

        <h3>พิสูจน์ 1 · <M>{`\\lambda_k = -\\dfrac{\\lfloor D\\rfloor^k\\{R\\}^k}{\\lfloor D\\rfloor^k[A]\\{D\\}^k}`}</M></h3>
        <p><b>แนวคิด:</b> ทิศ Dᵏ ถูกเลือกไว้แล้ว เหลือตัวแปรเดียวคือเดินไกลแค่ไหน → เลือก λ ที่ทำให้ f ต่ำสุดตามเส้นตรง <M>{`X^k + \\lambda D^k`}</M> (line search แบบแม่นยำ)</p>
        <MB>{`\\begin{aligned} g(\\lambda) &\\equiv f(X^k + \\lambda D^k) \\\\ &= \\tfrac12 (X^k+\\lambda D^k)^T A\\,(X^k+\\lambda D^k) - B^T(X^k+\\lambda D^k) \\end{aligned}`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>① แทน X ด้วยจุดบนเส้น — f กลายเป็นฟังก์ชันตัวแปรเดียว λ</p>
        <MB>{`\\begin{aligned} &= \\tfrac12 X^TAX + \\tfrac12\\lambda\\, X^TAD + \\tfrac12\\lambda\\, D^TAX \\\\ &\\quad + \\tfrac12\\lambda^2 D^TAD - B^TX - \\lambda B^TD \\end{aligned}`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>② กระจายวงเล็บ (ละตัวยก k เพื่อให้อ่านง่าย)</p>
        <MB>{`D^TAX = (D^TAX)^T = X^TA^TD = X^TAD`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>③ <b>จุดที่ใช้ A สมมาตร</b> — scalar (1×1) เท่ากับ transpose ของตัวเอง และ Aᵀ = A → พจน์ไขว้สองตัวเท่ากัน รวมเป็น λXᵀAD</p>
        <MB>{`g(\\lambda) = \\underbrace{\\tfrac12 X^TAX - B^TX}_{f(X^k)} + \\lambda\\, D^T\\underbrace{(AX - B)}_{R^k} + \\tfrac12\\lambda^2\\, D^TAD`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>④ จัดกลุ่ม: <M>{`X^TAD - B^TD = (AX-B)^TD = D^TR`}</M> (ใช้สมมาตรอีกครั้ง) → g(λ) เป็น<b>พาราโบลา</b>ใน λ</p>
        <MB>{`\\frac{dg}{d\\lambda} = D^TR^k + \\lambda\\, D^TAD = 0`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>⑤ ค่าต่ำสุดของพาราโบลาอยู่ที่อนุพันธ์ = 0</p>
        <Formula label="∴ ได้สูตรในใบการบ้าน">
          <MB>{`\\lambda_k = -\\frac{\\lfloor D\\rfloor^k\\{R\\}^k}{\\lfloor D\\rfloor^k[A]\\{D\\}^k}`}</MB>
        </Formula>
        <p className="muted" style={{fontSize:'0.8rem'}}>⑥ เป็น<b>ต่ำสุด</b>จริงเพราะ <M>{`\\frac{d^2g}{d\\lambda^2} = D^TAD > 0`}</M> เมื่อ A positive definite (นี่คือจุดที่ข้อ 2 พัง) · ผลพลอยได้: แทน λₖ กลับจะได้ <M>{`D^{kT}R^{k+1} = D^{kT}(R^k + \\lambda_k AD^k) = 0`}</M> — residual ใหม่<b>ตั้งฉาก</b>กับทิศที่เพิ่งเดิน (เดินจนเส้นสัมผัส contour พอดี)</p>

        <h3 style={{marginTop:18}}>พิสูจน์ 2 · <M>{`\\alpha_k = \\dfrac{\\lfloor R\\rfloor^{k+1}[A]\\{D\\}^k}{\\lfloor D\\rfloor^k[A]\\{D\\}^k}`}</M></h3>
        <p><b>แนวคิด:</b> อยากให้ทิศใหม่ "ไม่ทำลายงานเก่า" — หลังเดินทิศ D^(k+1) แล้ว จุดใหม่ต้องยังต่ำสุดตามทิศ Dᵏ อยู่ เงื่อนไขนั้นคือ A-conjugacy:</p>
        <MB>{`\\begin{aligned} D^{kT}R^{k+2} &= D^{kT}\\big(R^{k+1} + \\lambda_{k+1}AD^{k+1}\\big) \\\\ &= \\underbrace{D^{kT}R^{k+1}}_{=0 \\text{ (ผลพลอยได้ข้างบน)}} + \\lambda_{k+1}\\,D^{kT}AD^{k+1} \\end{aligned}`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>① อยากให้ก้อนนี้ = 0 (ยังต่ำสุดตามทิศเก่า) → ต้องการ <M>{`D^{(k+1)T}AD^k = 0`}</M> (A สมมาตร → ลำดับสลับได้) — นี่คือนิยาม "conjugate" · ถ้าใช้แค่ −R (steepest descent) จะเสียเงื่อนไขนี้แล้วเดินซิกแซก</p>
        <MB>{`\\big(-R^{k+1} + \\alpha_k D^k\\big)^T A\\, D^k = 0`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>② แทนนิยามทิศใหม่ <M>{`D^{k+1} = -R^{k+1} + \\alpha_k D^k`}</M> ซึ่งมี α เป็นตัวแปรเดียวที่ยังเลือกได้</p>
        <MB>{`-R^{(k+1)T}AD^k + \\alpha_k\\, D^{kT}AD^k = 0`}</MB>
        <p className="muted" style={{fontSize:'0.8rem'}}>③ transpose กระจายเข้าผลบวก <M>{`(u+v)^T = u^T+v^T`}</M> และ α เป็นสเกลาร์ดึงออกได้</p>
        <Formula label="∴ ได้สูตรในใบการบ้าน">
          <MB>{`\\alpha_k = \\frac{\\lfloor R\\rfloor^{k+1}[A]\\{D\\}^k}{\\lfloor D\\rfloor^k[A]\\{D\\}^k}`}</MB>
        </Formula>
        <p className="muted" style={{fontSize:'0.8rem'}}>④ ตัวส่วนไม่เป็นศูนย์เพราะ A positive definite และ Dᵏ ≠ 0 · ผลที่ตามมา (พิสูจน์ในตำราด้วย induction): Dᵏ ทุกตัว A-conjugate กันหมด → เป็นอิสระเชิงเส้น n ตัว → จบภายใน n รอบ</p>

        <h3>เช็คผลพิสูจน์ด้วยตัวเลขของข้อ 1</h3>
        <p>ทั้งสองค่าควรเป็นศูนย์ (ระดับ 10⁻¹⁴ ลงไป = ศูนย์ของคอมพิวเตอร์) และตาราง <M>{`D_i^TAD_j`}</M> นอกแนวทแยงต้องเป็น 0 — ยืนยันว่า conjugate กับ<b>ทุก</b>ทิศก่อนหน้า ไม่ใช่แค่ทิศติดกัน</p>
        <PythonRunner code={`# การบ้าน 8 ข้อ 3 — เช็คผลพิสูจน์ด้วยตัวเลขของข้อ 1
import numpy as np
A = np.array([[5,2,0,0],[2,5,2,0],[0,2,5,2],[0,0,2,5]], float)
B = np.array([12,17,14,7], float)
X = np.zeros(4); R = A @ X - B; D = -R
Ds = [D]
for k in range(3):
    AD = A @ D
    lam = -(D @ R) / (D @ AD)
    X = X + lam * D
    R_new = A @ X - B
    # (1) ผลพลอยได้ของ lambda: residual ใหม่ตั้งฉากกับทิศเดิม
    print(f"k={k}: D^T R(k+1)   = {D @ R_new: .3e}   (ควรเป็น 0)")
    alpha = (R_new @ AD) / (D @ AD)
    D_new = -R_new + alpha * D
    # (2) เงื่อนไขที่ใช้หา alpha: ทิศใหม่ A-conjugate กับทิศเดิม
    print(f"      D(k+1)^T A D = {D_new @ AD: .3e}   (ควรเป็น 0)")
    R, D = R_new, D_new
    Ds.append(D)
# A-conjugate กับ "ทุก" ทิศก่อนหน้า ไม่ใช่แค่ทิศติดกัน
print("\\nตาราง D_i^T A D_j (นอกแนวทแยงควรเป็น ~0):")
print(np.array([[Di @ A @ Dj for Dj in Ds] for Di in Ds]).round(10))`} height={400}/>
      </Sect>
    </>
  );
}

// marching squares — คืน line segments ของเส้นระดับ fn(x,y) = level
function hw8ContourSegs(fn, xD, yD, level, N) {
  const gx = [], gy = [], f = [];
  for (let i = 0; i <= N; i++) { gx[i] = xD[0] + (xD[1]-xD[0])*i/N; gy[i] = yD[0] + (yD[1]-yD[0])*i/N; }
  for (let i = 0; i <= N; i++) { f[i] = []; for (let j = 0; j <= N; j++) f[i][j] = fn(gx[i], gy[j]) - level; }
  const segs = [];
  const ip = (v1, v2, p1, p2) => { const t = -v1/(v2-v1); return [p1[0]+(p2[0]-p1[0])*t, p1[1]+(p2[1]-p1[1])*t]; };
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const a = f[i][j], b = f[i+1][j], c = f[i+1][j+1], d = f[i][j+1];
    const code = (a>=0?1:0) | (b>=0?2:0) | (c>=0?4:0) | (d>=0?8:0);
    const p00 = [gx[i],gy[j]], p10 = [gx[i+1],gy[j]], p11 = [gx[i+1],gy[j+1]], p01 = [gx[i],gy[j+1]];
    const eB = () => ip(a,b,p00,p10), eR = () => ip(b,c,p10,p11), eT = () => ip(d,c,p01,p11), eL = () => ip(a,d,p00,p01);
    if (code===1||code===14) segs.push([eB(),eL()]);
    else if (code===2||code===13) segs.push([eB(),eR()]);
    else if (code===3||code===12) segs.push([eL(),eR()]);
    else if (code===4||code===11) segs.push([eR(),eT()]);
    else if (code===6||code===9) segs.push([eB(),eT()]);
    else if (code===7||code===8) segs.push([eL(),eT()]);
    else if (code===5||code===10) { segs.push([eB(),eL()]); segs.push([eR(),eT()]); }
  }
  return segs;
}

function HW8Contour() {
  const CASES = {
    hw:    { A: [[2,5],[5,1]], b: [3,2],  name: "การบ้าน 8 ข้อ 2 · det = −23 → อานม้า" },
    slide: { A: [[2,1],[1,3]], b: [4,-3], name: "ตัวอย่างสไลด์ · det = 5 → ชาม" },
  };
  const [which, setWhich] = React.useState("hw");
  const { A, b, name } = CASES[which];
  const W = 480, H = 400, pad = { l: 34, r: 12, t: 14, b: 26 };
  const det = A[0][0]*A[1][1] - A[0][1]*A[1][0];
  const xs = [(b[0]*A[1][1] - A[0][1]*b[1])/det, (A[0][0]*b[1] - A[1][0]*b[0])/det];
  const fn = (x, y) => 0.5*(A[0][0]*x*x + 2*A[0][1]*x*y + A[1][1]*y*y) - b[0]*x - b[1]*y;
  const fs = fn(xs[0], xs[1]);
  const { rows } = conjugateGradient(A, b, [0,0], 10, 1e-9);
  const pts = rows.map(r => r.x).concat([xs]);
  const cx = (Math.min(...pts.map(p=>p[0])) + Math.max(...pts.map(p=>p[0]))) / 2;
  const cy = (Math.min(...pts.map(p=>p[1])) + Math.max(...pts.map(p=>p[1]))) / 2;
  const half = Math.max(2.2, Math.max(...pts.map(p=>Math.max(Math.abs(p[0]-cx), Math.abs(p[1]-cy)))) + 1.4);
  const xD = [cx - half, cx + half], yD = [cy - half*(H-pad.t-pad.b)/(W-pad.l-pad.r), cy + half*(H-pad.t-pad.b)/(W-pad.l-pad.r)];
  const sx = makeScale(xD, [pad.l, W - pad.r]), sy = makeScale(yD, [H - pad.b, pad.t]);
  const offs = [-12, -6, -3, -1, 1, 3, 6, 12, 20];
  const contours = React.useMemo(() => offs.map(o => ({ o, segs: hw8ContourSegs(fn, xD, yD, fs + o, 90) })), [which]);
  const zero = React.useMemo(() => hw8ContourSegs(fn, xD, yD, fs, 90), [which]);
  return (
    <div>
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:8}}>
        {Object.entries(CASES).map(([k, c]) => (
          <button key={k} className={"btn" + (which === k ? " primary" : "")} onClick={() => setWhich(k)}>{c.name}</button>
        ))}
      </div>
      <StepPlayer key={which} steps={rows.length} stepDuration={1500} label={s => s === 0 ? "X⁰ = (0, 0)" : `รอบ ${s} · λ${String.fromCharCode(0x2080 + s - 1)} = ${rows[s].alpha.toFixed(6)} · X = (${rows[s].x.map(v => v.toFixed(6)).join(", ")})`}>
        {({ step }) => (
          <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
            <Axes width={W} height={H} padding={pad} xDomain={xD} yDomain={yD}/>
            {contours.map(c => c.segs.map((s, i) => (
              <line key={c.o + "-" + i} x1={sx(s[0][0])} y1={sy(s[0][1])} x2={sx(s[1][0])} y2={sy(s[1][1])}
                stroke={c.o > 0 ? "#58c4dd" : "#e879bc"} strokeWidth="1" opacity="0.6"/>
            )))}
            {zero.map((s, i) => (
              <line key={"z" + i} x1={sx(s[0][0])} y1={sy(s[0][1])} x2={sx(s[1][0])} y2={sy(s[1][1])}
                stroke="#e6e6e6" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.8"/>
            ))}
            {rows.slice(1, step + 1).map((r, i) => (
              <line key={"p" + i} x1={sx(rows[i].x[0])} y1={sy(rows[i].x[1])} x2={sx(r.x[0])} y2={sy(r.x[1])} stroke="#ffd66b" strokeWidth="2.2"/>
            ))}
            {rows.slice(0, step + 1).map((r, i) => (
              <circle key={"c" + i} cx={sx(r.x[0])} cy={sy(r.x[1])} r={i === step ? 6 : 4} fill={i === step ? "#ffd66b" : "#83c167"} stroke="#0e1116" strokeWidth="1.5"/>
            ))}
            <circle cx={sx(xs[0])} cy={sy(xs[1])} r="5" fill="none" stroke="#e6e6e6" strokeWidth="2"/>
            <text x={sx(xs[0]) + 9} y={sy(xs[1]) - 8} fill="#e6e6e6" fontFamily="JetBrains Mono" fontSize="11">{det < 0 ? "X* saddle" : "X* min"}</text>
          </svg>
        )}
      </StepPlayer>
      <p className="muted" style={{fontSize:'0.778rem'}}>
        ฟ้า = ระดับ <b>สูงกว่า</b> f(X*) · ชมพู = <b>ต่ำกว่า</b> f(X*) · เส้นประ = ระดับ f(X*) พอดี · เส้นเหลือง = ทาง CG จาก (0, 0) ·
        {det < 0
          ? " อานม้า: มีทั้งฟ้าและชมพูล้อม X* (ขึ้นบางทิศ ลงบางทิศ) และเส้นประเป็นเส้นตรงไขว้กัน — รอบ 2 เดินถอยหลัง (λ ติดลบ)"
          : " ชาม: มีแต่ฟ้า (ทุกทิศสูงกว่าก้นชาม) เส้นประยุบเหลือจุดเดียว — CG ถึงก้นชามใน 2 รอบ λ บวกทั้งคู่"}
      </p>
    </div>
  );
}

window.ConjugateLesson = ConjugateLesson;
