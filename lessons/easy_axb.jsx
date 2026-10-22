// ④ ระบบสมการ Ax = b แบบตรง (อ่านง่าย) — เพิ่ม 23 ต.ค. 2569
// โจทย์ = การบ้าน 6-7 ข้อ 1.2–1.6: −2x₁+3x₂+x₃=9 · 3x₁+4x₂−5x₃=0 · x₁−2x₂+x₃=−4 → (−1, 2, 1)
// เลขทุกตัวรันด้วย Fraction / float แล้ว ตรงกับหมวดการบ้าน 6-7 ใน lessons/linear_systems.jsx
// Cholesky ใช้ AᵀA เพราะ A ไม่สมมาตร (ตามชีทสรุป Final p.11 และบทเดิม)
// ปุ่ม Inverse Matrix: คู่มือไทย น.29 ข้อ 5.4 (MatA ก่อน แล้ว CATALOG → Matrix → Matrix Calc → Inverse Matrix)

function EasyAxbLesson() {
  return (
    <div>
      <Hero
        kicker="④ ระบบสมการ Ax = b · แบบตรง · อ่านง่าย"
        title="แก้ระบบสมการ — 5 วิธีแบบตรง"
        lead="โจทย์ให้สมการหลายสมการ หาค่าตัวแปร x₁, x₂, x₃ · ทั้ง 5 วิธีได้คำตอบเดียวกัน ต่างกันแค่ทางเดิน · เริ่มจาก Gauss ให้แน่นก่อน เพราะอีก 4 วิธีคือ Gauss ที่แก้นิดหน่อย"
        meta={["การบ้าน 6-7 ข้อ 1.2–1.6", "คำตอบ (−1, 2, 1) ทุกวิธี", "Gauss ⭐ ก่อน"]}
      />

      <Sect tag="0" title="ภาพรวม — อ่านก่อน">
        <p>ระบบของการบ้าน 6-7 (ใช้ทั้งหน้า):</p>
        <MB>{`\\begin{aligned} -2x_1+3x_2+x_3&=9\\\\ 3x_1+4x_2-5x_3&=0\\\\ x_1-2x_2+x_3&=-4 \\end{aligned}\\qquad\\Longrightarrow\\qquad \\underbrace{\\begin{bmatrix}-2&3&1\\\\3&4&-5\\\\1&-2&1\\end{bmatrix}}_{A}\\underbrace{\\begin{bmatrix}x_1\\\\x_2\\\\x_3\\end{bmatrix}}_{x}=\\underbrace{\\begin{bmatrix}9\\\\0\\\\-4\\end{bmatrix}}_{b}`}</MB>
        <NumTable
          headers={["วิธี", "ทำอะไร (บรรทัดเดียว)", "ข้อ"]}
          rows={[
            [<b>Gauss Elimination ⭐</b>, "ทำใต้เส้นทแยงให้เป็น 0 แล้วแทนค่าย้อนกลับ", "1.2"],
            [<b>Gauss-Jordan</b>, "ทำทั้งบนและล่างเป็น 0 + ตัวหลักเป็น 1 ⇒ อ่านคำตอบได้เลย", "1.3"],
            [<b>Matrix Inversion</b>, "Gauss-Jordan บน [A | I] ได้ A⁻¹ แล้ว x = A⁻¹b", "1.4"],
            [<b>LU Decomposition</b>, "แยก A = LU (ตัวคูณของ Gauss อยู่ใน L) แล้วแก้ 2 รอบ", "1.5"],
            [<b>Cholesky</b>, "แยก A = LLᵀ — ใช้ได้เฉพาะเมทริกซ์สมมาตร", "1.6"],
          ]}
        />
        <Callout kind="good" title="⭐ ทางลัดใหญ่ที่สุด: รู้คำตอบสุดท้ายก่อนลงมือ">
          <p style={{margin:"0 0 6px"}}>ทุกวิธีต้องได้ x ชุดเดียวกัน ⇒ ใช้เครื่องแก้ระบบก่อน แล้วค่อยทำมือ ถ้าทำมือได้ไม่ตรงแปลว่าพลาดระหว่างทาง</p>
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <code>Equation</code> → <Key>OK</Key> → เลือก <code>Simul Equation</code> → <Key>OK</Key> → เลือก <code>3 Unknowns</code> → <Key>OK</Key></span>,
            <span>กรอกค่าทีละช่อง (สัมประสิทธิ์แถวละ 3 ตัว + ฝั่งขวา) คั่นด้วย <Key>EXE</Key></span>,
            <span>กรอกครบแล้วกด <Key>EXE</Key> → ได้ x₁ · กด <Key>▼</Key> ดู x₂, x₃ ⇒ <b>(−1, 2, 1)</b></span>,
          ]}/>
        </Callout>
        <Callout kind="tip" title="เช็คก่อนลงมือ 10 วินาที: det A ≠ 0 แปลว่ามีคำตอบเดียว">
          <MB>{`\\det A=-2(4-10)-3(3+5)+1(-6-4)=12-24-10=-22\\neq 0`}</MB>
          <p style={{margin:0}}>เครื่อง: สร้าง MatA (<Key>HOME</Key> → <code>Matrix</code> → <Key>TOOLS</Key> → <code>[MatA:]</code>) แล้ว <Key>CATALOG</Key> → <code>Matrix</code> → <code>Matrix Calc</code> → <code>Determinant</code></p>
        </Callout>
      </Sect>

      {/* ============================ 1 · GAUSS ============================ */}
      <Sect tag="1" title="Gauss Elimination ⭐ (แม่ของทุกวิธี)">
        <h3>คืออะไร</h3>
        <p>ใช้การบวกลบแถว (row operation) ทำให้<b>ใต้เส้นทแยงเป็น 0 หมด</b> (เมทริกซ์สามเหลี่ยมบน) แล้วแก้จาก<b>แถวล่างขึ้นบน</b> (back substitution)</p>

        <h3>โจทย์หน้าตาแบบไหน</h3>
        <p>&ldquo;จงแก้ระบบสมการ … ด้วยวิธี Gauss Elimination Method — เขียนโปรแกรม (ต้องมีวิธีทำมาแสดงด้วย)&rdquo;</p>

        <h3>สูตร</h3>
        <Formula label="กำจัด (ทำให้ช่องใต้ตัวหลักเป็น 0) + แทนค่าย้อนกลับ">
          <MB>{`m_{ik}=\\frac{a_{ik}}{a_{kk}}\\qquad R_i\\leftarrow R_i-m_{ik}\\,R_k`}</MB>
          <MB>{`x_n=\\frac{b_n}{a_{nn}}\\qquad x_i=\\frac{b_i-\\sum_{j>i}a_{ij}x_j}{a_{ii}}`}</MB>
        </Formula>

        <h3>ขั้นตอน</h3>
        <ol className="easy-steps">
          <li>เขียนเมทริกซ์แต่งเติม <M>{`[A\\,|\\,b]`}</M></li>
          <li>คอลัมน์ 1: หาตัวคูณ m ของแต่ละแถวข้างล่าง แล้วลบ m × แถวบน</li>
          <li>คอลัมน์ 2: ทำซ้ำกับแถวที่เหลือ (3 × 3 ทำ 2 รอบ)</li>
          <li>แทนค่าย้อนกลับ: x₃ จากแถวล่างสุด → x₂ → x₁</li>
        </ol>

        <h3>ทางลัด + เช็คคำตอบ</h3>
        <ul>
          <li>Simul Equation (กล่องด้านบน) ต้องได้ (−1, 2, 1)</li>
          <li><b>ผลคูณตัวหลักทุกตัว = det A</b>: (−2)(8.5)(1.294118) = −22 ✓ ใช้ตรวจว่ากำจัดถูก</li>
        </ul>

        <h3>ทำโจทย์ด้วยกัน — การบ้าน 6-7 ข้อ 1.2</h3>
        <Paper title="วิธีทำ">
          <PStep n={1} title="เขียนเมทริกซ์แต่งเติม">
            <MB>{`\\left[\\begin{array}{ccc|c} -2&3&1&9\\\\ 3&4&-5&0\\\\ 1&-2&1&-4 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={2} title="รอบที่ 1 — คอลัมน์แรก (ตัวหลัก −2)">
            <MB>{`\\begin{aligned}
m_{21}&=\\frac{3}{-2}=-1.5 &\\quad R_2&\\leftarrow R_2-(-1.5)R_1\\\\
m_{31}&=\\frac{1}{-2}=-0.5 &\\quad R_3&\\leftarrow R_3-(-0.5)R_1
\\end{aligned}`}</MB>
            <MB>{`\\left[\\begin{array}{ccc|c} -2&3&1&9\\\\ 0&8.5&-3.5&13.5\\\\ 0&-0.5&1.5&0.5 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={3} title="รอบที่ 2 — คอลัมน์ที่สอง (ตัวหลัก 8.5)">
            <MB>{`m_{32}=\\frac{-0.5}{8.5}=-0.058824 \\qquad R_3\\leftarrow R_3-(-0.058824)R_2`}</MB>
            <MB>{`\\left[\\begin{array}{ccc|c} -2&3&1&9\\\\ 0&8.5&-3.5&13.5\\\\ 0&0&1.294118&1.294118 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={4} title="แทนค่าย้อนกลับ (ล่างขึ้นบน)">
            <MB>{`\\begin{aligned}
x_3 &= \\frac{1.294118}{1.294118}=1\\\\[4pt]
x_2 &= \\frac{13.5-(-3.5)(1)}{8.5}=\\frac{17}{8.5}=2\\\\[4pt]
x_1 &= \\frac{9-3(2)-1(1)}{-2}=\\frac{2}{-2}=-1
\\end{aligned}`}</MB>
          </PStep>
          <PAns><M>{`x_1=-1.000000,\\quad x_2=2.000000,\\quad x_3=1.000000`}</M></PAns>
        </Paper>

        <h3>ระวัง</h3>
        <ul>
          <li>ถ้าตัวหลักเป็น 0 ต้อง<b>สลับแถว</b>ก่อน (หารด้วย 0 ไม่ได้)</li>
          <li>ลบทั้งแถว<b>รวมฝั่งขวา b</b> ด้วย — ลืมคอลัมน์ขวาบ่อยที่สุด</li>
          <li>ตัวคูณเป็นทศนิยมไม่จบ (−0.058824) ให้ใช้ค่าเต็มในเครื่อง</li>
        </ul>

        <h3>โค้ด</h3>
        <CodeBlock code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]
b = [9, 0, -4]
n = len(A)
M = [A[i][:] + [b[i]] for i in range(n)]      # เมทริกซ์แต่งเติม [A | b]

for k in range(n - 1):                          # ① กำจัดใต้ตัวหลัก
    for i in range(k + 1, n):
        m = M[i][k] / M[k][k]
        for j in range(k, n + 1):
            M[i][j] -= m * M[k][j]

x = [0.0] * n                                   # ② แทนค่าย้อนกลับ
for i in range(n - 1, -1, -1):
    s = sum(M[i][j] * x[j] for j in range(i + 1, n))
    x[i] = (M[i][n] - s) / M[i][i]
print([f"{v:.6f}" for v in x])
# ผลลัพธ์: ['-1.000000', '2.000000', '1.000000']`}/>
      </Sect>

      {/* ============================ 2 · GAUSS-JORDAN ============================ */}
      <Sect tag="2" title="Gauss-Jordan">
        <h3>คืออะไร</h3>
        <p>เหมือน Gauss แต่ทำ<b>ทั้งบนและล่าง</b>ของตัวหลักให้เป็น 0 และหารแถวให้<b>ตัวหลักเป็น 1</b> ⇒ ฝั่งซ้ายกลายเป็นเมทริกซ์เอกลักษณ์ I แล้ว<b>อ่านคำตอบจากคอลัมน์ขวาได้เลย</b> ไม่ต้องแทนค่าย้อนกลับ</p>

        <h3>โจทย์หน้าตาแบบไหน</h3>
        <p>&ldquo;จงแก้ระบบสมการ … ด้วยวิธี Gauss Jordan Method&rdquo;</p>

        <h3>สูตร</h3>
        <Formula label="ทุกรอบ k · ทำกับทุกแถว i ที่ไม่ใช่แถว k">
          <MB>{`R_k\\leftarrow \\frac{R_k}{a_{kk}}\\qquad R_i\\leftarrow R_i-a_{ik}\\,R_k\\quad (i\\neq k)`}</MB>
          <MB>{`[A\\,|\\,b]\\ \\longrightarrow\\ [I\\,|\\,x]`}</MB>
        </Formula>

        <h3>ขั้นตอน</h3>
        <ol className="easy-steps">
          <li>รอบที่ k: หารแถว k ด้วยตัวหลัก ให้ตัวหลักเป็น 1</li>
          <li>ลบแถวอื่น<b>ทุกแถว</b> (ทั้งบนและล่าง) ให้คอลัมน์ k เป็น 0</li>
          <li>ทำครบทุกคอลัมน์ แล้วอ่าน x จากคอลัมน์ขวาสุด</li>
        </ol>

        <h3>ทำโจทย์ด้วยกัน — การบ้าน 6-7 ข้อ 1.3</h3>
        <Paper title="วิธีทำ">
          <PStep n={1} title="รอบที่ 1: R₁ ÷ (−2) แล้ว R₂ ← R₂ − 3R₁ · R₃ ← R₃ − 1R₁">
            <MB>{`\\left[\\begin{array}{ccc|c} 1&-1.5&-0.5&-4.5\\\\ 0&8.5&-3.5&13.5\\\\ 0&-0.5&1.5&0.5 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={2} title="รอบที่ 2: R₂ ÷ 8.5 แล้ว R₁ ← R₁ + 1.5R₂ · R₃ ← R₃ + 0.5R₂">
            <MB>{`\\left[\\begin{array}{ccc|c} 1&0&-1.117647&-2.117647\\\\ 0&1&-0.411765&1.588235\\\\ 0&0&1.294118&1.294118 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={3} title="รอบที่ 3: R₃ ÷ 1.294118 แล้ว R₁ ← R₁ + 1.117647R₃ · R₂ ← R₂ + 0.411765R₃">
            <MB>{`\\left[\\begin{array}{ccc|c} 1&0&0&-1\\\\ 0&1&0&2\\\\ 0&0&1&1 \\end{array}\\right]`}</MB>
          </PStep>
          <PAns>ฝั่งซ้ายเป็น I แล้ว อ่านคอลัมน์ขวา: <M>{`x_1=-1.000000,\\ x_2=2.000000,\\ x_3=1.000000`}</M></PAns>
        </Paper>

        <h3>ระวัง</h3>
        <ul>
          <li>ต้องกำจัด<b>แถวข้างบน</b>ด้วย (ต่างจาก Gauss) — ลืมแล้วซ้ายจะไม่เป็น I</li>
          <li>หารแถวให้ตัวหลักเป็น 1 <b>ก่อน</b>ลบแถวอื่น ตัวคูณจะเท่ากับเลขในช่องนั้นพอดี</li>
        </ul>

        <h3>โค้ด</h3>
        <CodeBlock code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]
b = [9, 0, -4]
n = len(A)
M = [A[i][:] + [b[i]] for i in range(n)]

for k in range(n):
    p = M[k][k]
    M[k] = [v / p for v in M[k]]                # ① ตัวหลักเป็น 1
    for i in range(n):
        if i != k:                              # ② ทั้งบนและล่าง
            f = M[i][k]
            M[i] = [M[i][j] - f * M[k][j] for j in range(n + 1)]
print([f"{M[i][n]:.6f}" for i in range(n)])
# ผลลัพธ์: ['-1.000000', '2.000000', '1.000000']`}/>
      </Sect>

      {/* ============================ 3 · INVERSION ============================ */}
      <Sect tag="3" title="Matrix Inversion">
        <h3>คืออะไร</h3>
        <p>หาเมทริกซ์ผกผัน <M>{`A^{-1}`}</M> ก่อน แล้วคูณ <M>{`x=A^{-1}b`}</M> · หา <M>{`A^{-1}`}</M> ด้วย Gauss-Jordan บน <M>{`[A\\,|\\,I]`}</M>: ทำซ้ายเป็น I แล้วฝั่งขวาจะกลายเป็น <M>{`A^{-1}`}</M></p>

        <h3>โจทย์หน้าตาแบบไหน</h3>
        <p>&ldquo;จงแก้ระบบสมการ … ด้วยวิธี Matrix Inversion&rdquo; หรือ &ldquo;หา A⁻¹&rdquo; · ข้อดี: ถ้าโจทย์เปลี่ยน b หลายชุด ใช้ A⁻¹ เดิมคูณได้เลย</p>

        <h3>สูตร</h3>
        <Formula label="Inversion">
          <MB>{`[A\\,|\\,I]\\ \\xrightarrow{\\text{Gauss-Jordan}}\\ [I\\,|\\,A^{-1}]\\qquad x=A^{-1}b`}</MB>
        </Formula>

        <h3>ขั้นตอน</h3>
        <ol className="easy-steps">
          <li>เขียน <M>{`[A\\,|\\,I]`}</M> (I = เมทริกซ์เอกลักษณ์ 3 × 3)</li>
          <li>ทำ Gauss-Jordan เหมือนวิธีที่ 2 แต่ทำกับ 3 คอลัมน์ขวา</li>
          <li>คูณ <M>{`A^{-1}`}</M> กับ b ทีละแถว</li>
        </ol>

        <h3>ทางลัด + เช็คคำตอบ</h3>
        <CalcSteps steps={[
          <span>สร้าง MatA: <Key>HOME</Key> → <code>Matrix</code> → <Key>OK</Key> → <Key>TOOLS</Key> → <code>[MatA:]</code> → <Key>OK</Key> → ใส่ขนาด → <code>[Confirm]</code> → กรอกสมาชิก → <Key>AC</Key></span>,
          <span><Key>CATALOG</Key> → <code>Matrix</code> → <code>MatA</code> แล้ว <Key>CATALOG</Key> → <code>Matrix</code> → <code>Matrix Calc</code> → <code>Inverse Matrix</code> → <Key>EXE</Key> (คู่มือไทย น.29 ข้อ 5.4)</span>,
          <span>ตรวจ: ทุกช่องของ A⁻¹ × 22 ต้องเป็นจำนวนเต็ม เพราะ <M>{`A^{-1}=\\frac{1}{\\det A}\\,\\text{adj}(A)`}</M> และ det A = −22</span>,
        ]}/>

        <h3>ทำโจทย์ด้วยกัน — การบ้าน 6-7 ข้อ 1.4</h3>
        <Paper title="วิธีทำ">
          <PStep n={1} title="เขียน [A | I]">
            <MB>{`\\left[\\begin{array}{ccc|ccc} -2&3&1&1&0&0\\\\ 3&4&-5&0&1&0\\\\ 1&-2&1&0&0&1 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={2} title="รอบที่ 1: R₁ ÷ (−2) · R₂ ← R₂ − 3R₁ · R₃ ← R₃ − R₁">
            <MB>{`\\left[\\begin{array}{ccc|ccc} 1&-1.5&-0.5&-0.5&0&0\\\\ 0&8.5&-3.5&1.5&1&0\\\\ 0&-0.5&1.5&0.5&0&1 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={3} title="รอบที่ 2: R₂ ÷ 8.5 · R₁ ← R₁ + 1.5R₂ · R₃ ← R₃ + 0.5R₂">
            <MB>{`\\left[\\begin{array}{ccc|ccc} 1&0&-1.117647&-0.235294&0.176471&0\\\\ 0&1&-0.411765&0.176471&0.117647&0\\\\ 0&0&1.294118&0.588235&0.058824&1 \\end{array}\\right]`}</MB>
          </PStep>
          <PStep n={4} title="รอบที่ 3: R₃ ÷ 1.294118 · R₁ ← R₁ + 1.117647R₃ · R₂ ← R₂ + 0.411765R₃">
            <MB>{`\\left[\\begin{array}{ccc|ccc} 1&0&0&0.272727&0.227273&0.863636\\\\ 0&1&0&0.363636&0.136364&0.318182\\\\ 0&0&1&0.454545&0.045455&0.772727 \\end{array}\\right]`}</MB>
            <p>ฝั่งขวาคือ <M>{`A^{-1}=\\frac{1}{22}\\begin{bmatrix}6&5&19\\\\8&3&7\\\\10&1&17\\end{bmatrix}`}</M></p>
          </PStep>
          <PStep n={5} title="x = A⁻¹b คูณทีละแถว (b = 9, 0, −4)">
            <MB>{`\\begin{aligned}
x_1 &= 0.272727(9)+0.227273(0)+0.863636(-4)\\\\ &= 2.454545-3.454545=-1\\\\[6pt]
x_2 &= 0.363636(9)+0.136364(0)+0.318182(-4)\\\\ &= 3.272727-1.272727=2\\\\[6pt]
x_3 &= 0.454545(9)+0.045455(0)+0.772727(-4)\\\\ &= 4.090909-3.090909=1
\\end{aligned}`}</MB>
          </PStep>
          <PAns><M>{`x_1=-1.000000,\\quad x_2=2.000000,\\quad x_3=1.000000`}</M></PAns>
        </Paper>

        <h3>ระวัง</h3>
        <ul>
          <li>row operation ต้องทำกับ<b>ทั้ง 6 คอลัมน์</b> (ซ้าย A + ขวา I) พร้อมกัน</li>
          <li>det A = 0 ⇒ ไม่มี A⁻¹ ใช้วิธีนี้ไม่ได้</li>
        </ul>

        <h3>โค้ด</h3>
        <CodeBlock code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]
b = [9, 0, -4]
n = len(A)
M = [A[i][:] + [1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]   # [A | I]

for k in range(n):                              # Gauss-Jordan ทั้ง 2n คอลัมน์
    p = M[k][k]
    M[k] = [v / p for v in M[k]]
    for i in range(n):
        if i != k:
            f = M[i][k]
            M[i] = [M[i][j] - f * M[k][j] for j in range(2 * n)]

Ainv = [row[n:] for row in M]                   # ฝั่งขวา = A⁻¹
x = [sum(Ainv[i][j] * b[j] for j in range(n)) for i in range(n)]
print([f"{v:.6f}" for v in x])
# ผลลัพธ์: ['-1.000000', '2.000000', '1.000000']`}/>
      </Sect>

      {/* ============================ 4 · LU ============================ */}
      <Sect tag="4" title="LU Decomposition (Doolittle)">
        <h3>คืออะไร</h3>
        <p>แยก <M>{`A=LU`}</M> — L = สามเหลี่ยมล่าง (เส้นทแยงเป็น 1) · U = สามเหลี่ยมบน · <b>U คือเมทริกซ์ตอนจบ Gauss</b> และ <b>L เก็บตัวคูณ m ของ Gauss</b> ⇒ ทำ Gauss มาแล้วแทบไม่ต้องคำนวณใหม่ · จากนั้นแก้ 2 รอบ: <M>{`Ly=b`}</M> แล้ว <M>{`Ux=y`}</M></p>

        <h3>โจทย์หน้าตาแบบไหน</h3>
        <p>&ldquo;จงแก้ระบบสมการ … ด้วยวิธี LU Decomposition&rdquo; · มักให้ b หลายชุด (แยก LU ครั้งเดียว ใช้ซ้ำได้)</p>

        <h3>สูตร (Doolittle 3 × 3)</h3>
        <Formula label="หา L, U ทีละช่อง (หรือหยิบจาก Gauss)">
          <MB>{`\\begin{aligned}
&u_{11}=a_{11},\\ u_{12}=a_{12},\\ u_{13}=a_{13} \\qquad l_{21}=\\frac{a_{21}}{u_{11}},\\ l_{31}=\\frac{a_{31}}{u_{11}}\\\\[4pt]
&u_{22}=a_{22}-l_{21}u_{12}\\qquad u_{23}=a_{23}-l_{21}u_{13}\\qquad l_{32}=\\frac{a_{32}-l_{31}u_{12}}{u_{22}}\\\\[4pt]
&u_{33}=a_{33}-l_{31}u_{13}-l_{32}u_{23}
\\end{aligned}`}</MB>
        </Formula>

        <h3>ขั้นตอน</h3>
        <ol className="easy-steps">
          <li>หา L, U (สูตรข้างบน หรือหยิบตัวคูณจาก Gauss)</li>
          <li>แก้ <M>{`Ly=b`}</M> จาก<b>บนลงล่าง</b> (forward)</li>
          <li>แก้ <M>{`Ux=y`}</M> จาก<b>ล่างขึ้นบน</b> (backward)</li>
        </ol>

        <h3>ทางลัด + เช็คคำตอบ</h3>
        <ul>
          <li>คูณ L × U ต้องได้ A คืน</li>
          <li>y ที่ได้ = คอลัมน์ขวาตอนจบ Gauss (9, 13.5, 1.294118)</li>
        </ul>

        <h3>ทำโจทย์ด้วยกัน — การบ้าน 6-7 ข้อ 1.5</h3>
        <Paper title="วิธีทำ">
          <PStep n={1} title="หา U และ L">
            <MB>{`\\begin{aligned}
&u_{11}=-2,\\ u_{12}=3,\\ u_{13}=1\\qquad l_{21}=\\frac{3}{-2}=-1.5\\qquad l_{31}=\\frac{1}{-2}=-0.5\\\\[4pt]
&u_{22}=4-(-1.5)(3)=8.5\\qquad u_{23}=-5-(-1.5)(1)=-3.5\\\\[4pt]
&l_{32}=\\frac{-2-(-0.5)(3)}{8.5}=\\frac{-0.5}{8.5}=-0.058824\\\\[4pt]
&u_{33}=1-(-0.5)(1)-(-0.058824)(-3.5)=1+0.5-0.205882=1.294118
\\end{aligned}`}</MB>
            <MB>{`L=\\begin{bmatrix}1&0&0\\\\-1.5&1&0\\\\-0.5&-0.058824&1\\end{bmatrix}\\qquad U=\\begin{bmatrix}-2&3&1\\\\0&8.5&-3.5\\\\0&0&1.294118\\end{bmatrix}`}</MB>
          </PStep>
          <PStep n={2} title="แก้ Ly = b จากบนลงล่าง">
            <MB>{`\\begin{aligned}
y_1 &= 9\\\\
y_2 &= 0-(-1.5)(9)=13.5\\\\
y_3 &= -4-(-0.5)(9)-(-0.058824)(13.5)\\\\
&= -4+4.5+0.794118=1.294118
\\end{aligned}`}</MB>
          </PStep>
          <PStep n={3} title="แก้ Ux = y จากล่างขึ้นบน">
            <MB>{`\\begin{aligned}
x_3 &= \\frac{1.294118}{1.294118}=1\\\\[4pt]
x_2 &= \\frac{13.5-(-3.5)(1)}{8.5}=2\\\\[4pt]
x_1 &= \\frac{9-3(2)-1(1)}{-2}=-1
\\end{aligned}`}</MB>
          </PStep>
          <PAns><M>{`x_1=-1.000000,\\quad x_2=2.000000,\\quad x_3=1.000000`}</M></PAns>
        </Paper>

        <h3>ระวัง</h3>
        <ul>
          <li>Doolittle: เส้นทแยงของ <b>L เป็น 1</b> (ไม่ใช่ U)</li>
          <li>forward ใช้ L จากบนลงล่าง · backward ใช้ U จากล่างขึ้นบน — อย่าสลับ</li>
        </ul>

        <h3>โค้ด</h3>
        <CodeBlock code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]
b = [9, 0, -4]
n = len(A)
L = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
U = [[0.0] * n for _ in range(n)]

for i in range(n):                              # ① Doolittle
    for j in range(i, n):
        U[i][j] = A[i][j] - sum(L[i][k] * U[k][j] for k in range(i))
    for j in range(i + 1, n):
        L[j][i] = (A[j][i] - sum(L[j][k] * U[k][i] for k in range(i))) / U[i][i]

y = [0.0] * n                                   # ② Ly = b (บนลงล่าง)
for i in range(n):
    y[i] = b[i] - sum(L[i][k] * y[k] for k in range(i))

x = [0.0] * n                                   # ③ Ux = y (ล่างขึ้นบน)
for i in range(n - 1, -1, -1):
    x[i] = (y[i] - sum(U[i][k] * x[k] for k in range(i + 1, n))) / U[i][i]
print([f"{v:.6f}" for v in x])
# ผลลัพธ์: ['-1.000000', '2.000000', '1.000000']`}/>
      </Sect>

      {/* ============================ 5 · CHOLESKY ============================ */}
      <Sect tag="5" title="Cholesky Decomposition">
        <h3>คืออะไร</h3>
        <p>แยก <M>{`A=LL^T`}</M> (L สามเหลี่ยมล่าง ใช้ตัวเดียวทั้งสองฝั่ง) · <b>ใช้ได้เฉพาะ A สมมาตร</b> (<M>{`a_{ij}=a_{ji}`}</M>) และ positive definite · จากนั้นแก้ <M>{`Ly=b`}</M> แล้ว <M>{`L^Tx=y`}</M> เหมือน LU</p>

        <h3>โจทย์หน้าตาแบบไหน</h3>
        <p>&ldquo;จงแก้ระบบสมการ … ด้วยวิธี Cholesky Decomposition&rdquo; · <b>ถ้า A ไม่สมมาตร</b> (เช่นการบ้านนี้) ให้คูณ <M>{`A^T`}</M> ทั้งสองข้างก่อน: <M>{`(A^TA)x=A^Tb`}</M> — <M>{`A^TA`}</M> สมมาตรเสมอ (ชีทสรุป Final p.11)</p>

        <h3>สูตร (3 × 3)</h3>
        <Formula label="Cholesky">
          <MB>{`\\begin{aligned}
&l_{11}=\\sqrt{a_{11}}\\qquad l_{21}=\\frac{a_{21}}{l_{11}}\\qquad l_{31}=\\frac{a_{31}}{l_{11}}\\\\[4pt]
&l_{22}=\\sqrt{a_{22}-l_{21}^2}\\qquad l_{32}=\\frac{a_{32}-l_{31}l_{21}}{l_{22}}\\qquad l_{33}=\\sqrt{a_{33}-l_{31}^2-l_{32}^2}
\\end{aligned}`}</MB>
        </Formula>

        <h3>ขั้นตอน</h3>
        <ol className="easy-steps">
          <li><b>เช็คสมมาตรทุกคู่</b> — ไม่สมมาตร ⇒ ใช้ <M>{`A^TA`}</M> และ <M>{`A^Tb`}</M> แทน</li>
          <li>หา L ด้วยสูตร (ในรากต้องเป็นบวก ถ้าติดลบแปลว่าไม่ positive definite)</li>
          <li>แก้ <M>{`Ly=b`}</M> บนลงล่าง แล้ว <M>{`L^Tx=y`}</M> ล่างขึ้นบน</li>
        </ol>

        <h3>ทำโจทย์ด้วยกัน — การบ้าน 6-7 ข้อ 1.6</h3>
        <Paper title="วิธีทำ">
          <PStep n={1} title="เช็คสมมาตร: a₂₃ = −5 แต่ a₃₂ = −2 ⇒ ไม่สมมาตร ⇒ ใช้ AᵀA x = Aᵀb">
            <MB>{`A^TA=\\begin{bmatrix}14&4&-16\\\\4&29&-19\\\\-16&-19&27\\end{bmatrix}\\qquad A^Tb=\\begin{bmatrix}-22\\\\35\\\\5\\end{bmatrix}`}</MB>
          </PStep>
          <PStep n={2} title="หา L ของ AᵀA">
            <MB>{`\\begin{aligned}
l_{11} &= \\sqrt{14}=3.741657\\\\[4pt]
l_{21} &= \\frac{4}{3.741657}=1.069045\\qquad l_{31}=\\frac{-16}{3.741657}=-4.276180\\\\[4pt]
l_{22} &= \\sqrt{29-1.069045^2}=\\sqrt{27.857143}=5.277987\\\\[4pt]
l_{32} &= \\frac{-19-(-4.276180)(1.069045)}{5.277987}=\\frac{-14.428571}{5.277987}=-2.733726\\\\[4pt]
l_{33} &= \\sqrt{27-(-4.276180)^2-(-2.733726)^2}\\\\[4pt]
&= \\sqrt{27-18.285714-7.473260}=\\sqrt{1.241026}=1.114013
\\end{aligned}`}</MB>
          </PStep>
          <PStep n={3} title="แก้ Ly = Aᵀb จากบนลงล่าง">
            <MB>{`\\begin{aligned}
y_1 &= \\frac{-22}{3.741657}=-5.879747\\\\[4pt]
y_2 &= \\frac{35-(1.069045)(-5.879747)}{5.277987}=\\frac{41.285714}{5.277987}=7.822247\\\\[4pt]
y_3 &= \\frac{5-(-4.276180)(-5.879747)-(-2.733726)(7.822247)}{1.114013}\\\\[4pt]
&= \\frac{5-25.142857+21.383883}{1.114013}=\\frac{1.241026}{1.114013}=1.114013
\\end{aligned}`}</MB>
          </PStep>
          <PStep n={4} title="แก้ Lᵀx = y จากล่างขึ้นบน">
            <MB>{`\\begin{aligned}
x_3 &= \\frac{1.114013}{1.114013}=1\\\\[4pt]
x_2 &= \\frac{7.822247-(-2.733726)(1)}{5.277987}=\\frac{10.555973}{5.277987}=2\\\\[4pt]
x_1 &= \\frac{-5.879747-1.069045(2)-(-4.276180)(1)}{3.741657}=\\frac{-3.741657}{3.741657}=-1
\\end{aligned}`}</MB>
          </PStep>
          <PAns><M>{`x_1=-1.000000,\\quad x_2=2.000000,\\quad x_3=1.000000`}</M></PAns>
        </Paper>

        <h3>ระวัง</h3>
        <ul>
          <li>เช็คสมมาตร<b>ครบทุกคู่</b> — ข้อนี้ 2 ใน 3 คู่ตรงกัน (3 = 3, 1 = 1) หลอกตามาก</li>
          <li>ขั้นแก้รอบสอง ใช้ <M>{`L^T`}</M> (สลับแถวเป็นคอลัมน์) ⇒ ในโค้ดคือ <code>L[k][i]</code> ไม่ใช่ <code>L[i][k]</code></li>
        </ul>

        <h3>โค้ด</h3>
        <CodeBlock code={`import math

A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]
b = [9, 0, -4]
n = len(A)
# A ไม่สมมาตร ⇒ ใช้ AᵀA x = Aᵀb
S = [[sum(A[k][i] * A[k][j] for k in range(n)) for j in range(n)] for i in range(n)]
c = [sum(A[k][i] * b[k] for k in range(n)) for i in range(n)]

L = [[0.0] * n for _ in range(n)]
for i in range(n):
    for j in range(i + 1):
        s = sum(L[i][k] * L[j][k] for k in range(j))
        if i == j:
            L[i][j] = math.sqrt(S[i][i] - s)
        else:
            L[i][j] = (S[i][j] - s) / L[j][j]

y = [0.0] * n                                   # Ly = c
for i in range(n):
    y[i] = (c[i] - sum(L[i][k] * y[k] for k in range(i))) / L[i][i]
x = [0.0] * n                                   # Lᵀx = y
for i in range(n - 1, -1, -1):
    x[i] = (y[i] - sum(L[k][i] * x[k] for k in range(i + 1, n))) / L[i][i]
print([f"{v:.6f}" for v in x])
# ผลลัพธ์: ['-1.000000', '2.000000', '1.000000']`}/>
      </Sect>

      <EasyNext href="#e-iter" label="⑤ Ax = b แบบวนซ้ำ (Jacobi · Gauss-Seidel · CG)" ready={false}/>
    </div>
  );
}

window.EasyAxbLesson = EasyAxbLesson;
