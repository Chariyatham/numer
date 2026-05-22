// Intro lesson — welcome + roadmap + how-to-use + calculator basics

function IntroLesson() {
  return (
    <div>
      <Hero
        kicker="Numerical Methods · เริ่มจาก 0"
        title="ยินดีต้อนรับสู่ Numer Master"
        lead="เว็บนี้สอนวิธีเชิงตัวเลขแบบครบทุกบท ตั้งแต่แนวคิด → ทำมือ → กดเครื่องคิดเลข fx-991CW → เขียนโค้ด Python → ทำข้อสอบจำลองยากระดับ Final"
        meta={["8 บทเรียน", "Animation ทุกบท", "Python รันได้ในเว็บ", "Mock exam"]}
      />

      <Sect tag="00" title="โรดแมป — เริ่มจากไหนดี?">
        <p>เรียงตามลำดับจากซ้ายไปขวา ถ้าใหม่จริง ๆ แนะนำให้เริ่มจาก <b>Root Finding</b> เลยครับ บทแรกจะปูแนวคิด "iteration" และ "error" ที่ใช้ซ้ำในทุกบทถัดไป</p>
        <div className="grid-3" style={{marginTop:14}}>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--green)"}}>Foundation</div>
            <h4 style={{marginTop:2}}>Root Finding</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>Bisection, Newton, Secant, False Position — หาราก f(x)=0</p>
          </div>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--yellow)"}}>Core</div>
            <h4 style={{marginTop:2}}>Linear Systems</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>Gauss · Jacobi · Gauss-Seidel · Conjugate Gradient</p>
          </div>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--purple)"}}>Curve Fitting</div>
            <h4 style={{marginTop:2}}>Interp · Spline · Regression</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>วาดเส้นโค้งผ่าน/ใกล้จุดข้อมูล</p>
          </div>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--pink)"}}>Calculus</div>
            <h4 style={{marginTop:2}}>Integration</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>Trapezoidal · Simpson · Composite</p>
          </div>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--orange)"}}>Calculus</div>
            <h4 style={{marginTop:2}}>Differentiation</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>Forward · Backward · Central</p>
          </div>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--red)"}}>Boss Fight</div>
            <h4 style={{marginTop:2}}>Mock Final</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>ข้อสอบจำลองสไตล์อาจารย์ออก (ยากกว่าแบบฝึก)</p>
          </div>
        </div>
      </Sect>

      <Sect tag="01" title="หน้าตาของแต่ละบท">
        <p>ทุกบทจะมีโครงสร้างเดียวกัน เพื่อให้คุณเรียนเองได้สบาย ๆ:</p>
        <ol>
          <li><b style={{color:"var(--blue)"}}>Why & Intuition</b> — ทำไมต้องเรียน + เห็นภาพรวม</li>
          <li><b style={{color:"var(--blue)"}}>Theory</b> — ที่มาของสูตร (เขียนเรียงสมการเป็นขั้น ๆ)</li>
          <li><b style={{color:"var(--blue)"}}>Algorithm Animation</b> — ดูทีละ step ผ่าน visualization</li>
          <li><b style={{color:"var(--blue)"}}>Worked Example (ทำมือ)</b> — โจทย์ตัวอย่างที่ทำตามได้</li>
          <li><b style={{color:"var(--blue)"}}>Interactive Solver</b> — ใส่ค่าเอง ดูคำตอบเป็นตาราง</li>
          <li><b style={{color:"var(--blue)"}}>fx-991CW Keystrokes</b> — กดทีละปุ่ม</li>
          <li><b style={{color:"var(--blue)"}}>Python Code (รันได้)</b> — โค้ดที่รันได้ในเว็บนี้เลย</li>
          <li><b style={{color:"var(--blue)"}}>Mock Exam Problem</b> — โจทย์ระดับสอบจริง พร้อมเฉลย</li>
          <li><b style={{color:"var(--blue)"}}>Quick Reference</b> — สูตร + วิธีจำ</li>
        </ol>
      </Sect>

      <Sect tag="🧮" title="ปูคณิตก่อนเริ่ม · Prerequisites (ถ้าไม่มีพื้น อ่านก่อน!)">
        <Callout kind="tip" title="ใครต้องอ่าน Sect นี้">
          <p>ถ้าคำสั่งใดข้างล่างนี้คุณ <em>ไม่มั่นใจ</em> — อ่าน sect นี้ทั้งหมดก่อนไปบท Root Finding:</p>
          <ul style={{margin:0, paddingLeft:18}}>
            <li>หา <M>{`f'(x)`}</M> ของ <M>{`f(x) = x^2 - 7`}</M> ได้ทันที (ใช้ใน Newton-Raphson)</li>
            <li>หา <M>{`\\int_0^2 x^2\\, dx`}</M> ได้ทันที (ใช้ใน Integration)</li>
            <li>คูณ matrix 2×2 กับ vector 2×1 ได้ (ใช้ใน Linear Systems)</li>
            <li>เข้าใจ <M>{`\\sum_{i=1}^{n} x_i^2`}</M> ว่าหมายถึงอะไร (ใช้ใน Regression)</li>
          </ul>
          <p style={{margin:"6px 0 0", fontSize:13}}>ถ้าทั้ง 4 ข้อทำได้สบาย → ข้ามไปอ่าน Error (Sect 02) ได้เลย</p>
        </Callout>

        <h3>🔹 1. Derivative · อนุพันธ์ (slope ของฟังก์ชัน)</h3>
        <p><M>{`f'(x)`}</M> = ความชันของกราฟ <M>f(x)</M> ณ จุด <M>x</M> นั้น. นิยามจาก limit:</p>
        <Formula><MB>{`f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}`}</MB></Formula>
        <p>เห็นภาพ: ถ้าซูมเข้าไปที่จุด x มาก ๆ กราฟ <M>f</M> เริ่มดูเป็น<b>เส้นตรง</b> — slope ของเส้นตรงนั้นคือ <M>{`f'(x)`}</M></p>

        <h4>กฎที่ใช้บ่อย (จำให้แม่น)</h4>
        <NumTable
          headers={["f(x)", "f'(x)", "ตัวอย่าง"]}
          rows={[
            ["c (ค่าคงที่)",       "0",                    "f=7 → f'=0"],
            ["xⁿ",                "n·xⁿ⁻¹ (Power rule)",  "f=x³ → f'=3x²"],
            ["eˣ",                "eˣ",                   "f=e²ˣ → ใช้ chain"],
            ["ln x",              "1/x",                  "f=ln(x²) → ใช้ chain"],
            ["sin x",             "cos x",                "—"],
            ["cos x",             "-sin x",               "—"],
            ["a·f(x) + b·g(x)",   "a·f'(x) + b·g'(x)",   "linearity"],
            ["f(g(x)) chain rule","f'(g(x))·g'(x)",       "f=sin(x²) → cos(x²)·2x"],
            ["f(x)·g(x) product", "f'g + fg'",            "f=x·eˣ → eˣ + x·eˣ"],
            ["f(x)/g(x) quotient","(f'g − fg')/g²",       "f=x/(x+1) → 1/(x+1)²"],
          ]}
        />

        <Callout title="ตัวอย่างที่ใช้ในวิชานี้บ่อยมาก">
          <p>• <M>{`f(x) = x^2 - 7`}</M> → <M>{`f'(x) = 2x`}</M> (ใช้ Newton-Raphson หา √7)</p>
          <p>• <M>{`f(x) = x^3 - 5`}</M> → <M>{`f'(x) = 3x^2`}</M></p>
          <p>• <M>{`f(x) = \\ln x`}</M> → <M>{`f'(x) = 1/x`}</M>, <M>{`f''(x) = -1/x^2`}</M> (ใช้ Taylor series)</p>
          <p>• <M>{`f(x) = e^x`}</M> → <M>{`f'(x) = e^x`}</M> (เป็นตัวเอง — ใช้ใน Differentiation)</p>
          <p style={{margin:"6px 0 0", fontSize:13, color:"var(--text-faint)"}}>⚡ fx-991CW มีปุ่ม <code>d/dx</code> คำนวณ <M>{`f'(x)`}</M> ที่ค่า x ที่ระบุได้เลย — แต่ต้องเขียนสูตร analytic เป็น</p>
        </Callout>

        <h3 style={{marginTop:24}}>🔹 2. Integral · อินทิเกรต (พื้นที่ใต้กราฟ)</h3>
        <p><M>{`\\int_a^b f(x)\\, dx`}</M> = <b>พื้นที่</b>ใต้กราฟ <M>f</M> ตั้งแต่ <M>{`x=a`}</M> ถึง <M>{`x=b`}</M> (ถ้า <M>{`f>0`}</M>)</p>

        <Formula label="Antiderivative (กลับด้านของ derivative)">
          <MB>{`\\text{ถ้า } F'(x) = f(x), \\text{ แล้ว } \\int f(x)\\, dx = F(x) + C`}</MB>
        </Formula>
        <Formula label="Fundamental Theorem of Calculus">
          <MB>{`\\int_a^b f(x)\\, dx = F(b) - F(a)`}</MB>
        </Formula>

        <h4>กฎที่ใช้บ่อย</h4>
        <NumTable
          headers={["f(x)", "∫ f(x) dx", "ตัวอย่างคำนวณ"]}
          rows={[
            ["xⁿ (n ≠ −1)",  "xⁿ⁺¹/(n+1) + C",        "∫x² dx = x³/3 + C"],
            ["1/x",           "ln|x| + C",              "—"],
            ["eˣ",            "eˣ + C",                 "—"],
            ["sin x",         "−cos x + C",             "—"],
            ["cos x",         "sin x + C",              "—"],
            ["a·f + b·g",     "a∫f + b∫g (linearity)", "—"],
          ]}
        />

        <Callout title="ตัวอย่าง ∫₂⁸ (4x⁵ − 3x⁴ + x³ − 6x + 2) dx (จริงในชีท)">
          <p>หา antiderivative ทีละ term:</p>
          <MB>{`F(x) = \\tfrac{4x^6}{6} - \\tfrac{3x^5}{5} + \\tfrac{x^4}{4} - 3x^2 + 2x`}</MB>
          <p>คำตอบ exact: <M>{`F(8) - F(2) \\approx 155{,}930.4`}</M></p>
          <p style={{margin:"6px 0 0", fontSize:13}}>ใน Numerical Methods เราใช้ Trap/Simpson <em>ประมาณ</em> ค่านี้โดยไม่ต้องหา antiderivative — เหมาะกับฟังก์ชันที่ integrate analytical ยาก เช่น <M>{`e^{-x^2}`}</M></p>
        </Callout>

        <h3 style={{marginTop:24}}>🔹 3. Σ summation (สัญลักษณ์รวมเลข)</h3>
        <Formula><MB>{`\\sum_{i=1}^{n} x_i = x_1 + x_2 + x_3 + \\ldots + x_n`}</MB></Formula>
        <p>อ่านว่า "summa, i = 1 ถึง n, x sub i"</p>

        <Callout title="กฎที่ใช้ใน Regression">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><M>{`\\sum c \\cdot x_i = c \\cdot \\sum x_i`}</M> (ดึงค่าคงที่ออก)</li>
            <li><M>{`\\sum (x_i + y_i) = \\sum x_i + \\sum y_i`}</M> (กระจาย)</li>
            <li><M>{`\\sum_{i=1}^{n} c = n \\cdot c`}</M> (รวมค่าคงที่ n ครั้ง)</li>
            <li><b>ระวัง:</b> <M>{`\\sum x_i y_i \\neq (\\sum x_i)(\\sum y_i)`}</M> — ต้องคูณก่อนแล้วค่อยรวม</li>
          </ul>
        </Callout>

        <h3 style={{marginTop:24}}>🔹 4. Matrix · เมทริกซ์ (ตารางตัวเลข)</h3>
        <p>Matrix ขนาด m×n คือตารางตัวเลข m แถว n คอลัมน์. Vector คือ matrix ที่มี 1 คอลัมน์ (column vector) หรือ 1 แถว (row vector)</p>

        <Formula label="ตัวอย่าง matrix 2×3">
          <MB>{`A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}, \\quad a_{12} = 2,\\; a_{23} = 6`}</MB>
        </Formula>

        <h4>การคูณ Matrix · Matrix (m×p) · (p×n) = (m×n)</h4>
        <p>ช่อง <M>{`(AB)_{ij}`}</M> = dot product ของ <b>แถว i ของ A</b> กับ <b>คอลัมน์ j ของ B</b></p>
        <Formula>
          <MB>{`(AB)_{ij} = \\sum_{k=1}^{p} a_{ik}\\, b_{kj}`}</MB>
        </Formula>

        <Callout title="ตัวอย่างง่าย — คูณ matrix-vector 2×2 กับ 2×1">
          <MB>{`\\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix} \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 2(5) + 3(6) \\\\ 1(5) + 4(6) \\end{pmatrix} = \\begin{pmatrix} 28 \\\\ 29 \\end{pmatrix}`}</MB>
          <p style={{margin:"6px 0 0", fontSize:13}}>คำว่า "ระบบสมการเชิงเส้น <M>{`Ax = b`}</M>" คือเขียนหลายสมการในรูป matrix นี่เอง</p>
        </Callout>

        <h4>Transpose (Aᵀ) · สลับแถว ↔ คอลัมน์</h4>
        <Formula>
          <MB>{`A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix} \\Rightarrow A^T = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}`}</MB>
        </Formula>

        <h4>Identity (I), Inverse (A⁻¹), Determinant (det A)</h4>
        <ul>
          <li><b>Identity:</b> <M>{`I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}`}</M> — คูณกับใครก็ได้ตัวเดิม</li>
          <li><b>Inverse:</b> <M>{`A \\cdot A^{-1} = I`}</M> — ถ้ามี <M>{`A^{-1}`}</M> แล้ว <M>{`Ax = b \\Rightarrow x = A^{-1} b`}</M></li>
          <li><b>Determinant 2×2:</b> <M>{`\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc`}</M></li>
          <li><b>Determinant 3×3:</b> ใช้สูตร <em>cofactor expansion</em> หรือ <em>Sarrus</em> (ดู Cramer's Rule ในบท 02)</li>
        </ul>

        <Callout kind="tip" title="ทำไมต้องสนใจ det?">
          <p>ถ้า <M>{`\\det A = 0`}</M> → A <b>singular</b> → ไม่มี <M>{`A^{-1}`}</M> → ระบบ <M>{`Ax = b`}</M> อาจไม่มีคำตอบ <em>หรือ</em> มีคำตอบไม่จำกัด</p>
          <p style={{margin:0}}>เป็น <b>ทดสอบเร็ว</b> ว่า Linear System ที่เจอแก้ได้หรือเปล่า</p>
        </Callout>

        <h3 style={{marginTop:24}}>🔹 5. Floating-point error · ทำไมเลขคอมไม่ตรง 100%</h3>
        <p>คอมพิวเตอร์เก็บเลขทศนิยมเป็น <b>binary approximation</b> 64-bit (IEEE 754) — บางเลขเก็บไม่ลงตัว</p>
        <Callout kind="warn" title="ตัวอย่างคลาสสิก">
          <p>ใน Python:</p>
          <pre style={{margin:"6px 0", padding:"8px 12px", background:"var(--bg-card)", borderRadius:6, fontFamily:"var(--font-mono)", fontSize:14}}>{`>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False`}</pre>
          <p style={{margin:"6px 0 0"}}>เหตุผล: 0.1 ใน binary เป็นทศนิยมไม่รู้จบ — ปัดได้ใกล้ ๆ แต่ไม่เป๊ะ</p>
        </Callout>

        <h4>ผลกระทบในวิชานี้</h4>
        <ul>
          <li><b>เกณฑ์หยุด iteration:</b> ใช้ <M>{`|x_{n+1} - x_n| / |x_{n+1}| < \\varepsilon`}</M> (relative) ไม่ใช่ equal</li>
          <li><b>ลำดับ O(h):</b> error ของ <em>Forward diff</em> เป็น <M>{`O(h)`}</M>, ของ <em>Central</em> เป็น <M>{`O(h^2)`}</M> — h เล็กลงครึ่งหนึ่ง error ของ Central ลด 4 เท่า (ของ Forward ลดแค่ 2 เท่า)</li>
          <li><b>"Error U-shape" ใน Differentiation:</b> ถ้า h เล็กเกินไป → roundoff error ของลบเลขใกล้กันชนะ → error <em>กลับเพิ่ม</em> (ดูใน Sect 7 ของ Differentiation)</li>
        </ul>

        <Callout kind="good" title="สรุป — Mindset เริ่ม Numerical Methods">
          <p style={{margin:"0 0 6px"}}>คณิตศาสตร์ analytical: หาคำตอบ <b>เป๊ะ</b> — เช่น <M>{`\\sqrt{7}`}</M></p>
          <p style={{margin:"0 0 6px"}}>คณิตศาสตร์ Numerical: หาคำตอบ <b>ใกล้เคียง</b> ที่<em>error เล็กพอ</em> — เช่น 2.6457513</p>
          <p style={{margin:0}}>ทุกบทจะเล่าว่า: (1) ทำยังไงให้ใกล้คำตอบ + (2) error เล็กแค่ไหน + (3) เร็วแค่ไหน</p>
        </Callout>
      </Sect>

      <Sect tag="02" title="แนวคิดพื้นฐาน — Error">
        <p>ก่อนเริ่ม ขอปูเรื่อง <em>error</em> ที่จะใช้ในทุกบท เพราะ Numerical Methods มันคือ "การประมาณ" ไม่ใช่ "คำตอบเป๊ะ"</p>

        <Formula label="True Error vs Approximate Error">
          <MB>{`\\varepsilon_{\\text{true}} = \\left|\\frac{x_{\\text{true}} - x_{\\text{approx}}}{x_{\\text{true}}}\\right|\\times 100\\%`}</MB>
          <MB>{`\\varepsilon_a = \\left|\\frac{x_{\\text{new}} - x_{\\text{old}}}{x_{\\text{new}}}\\right|\\times 100\\%`}</MB>
        </Formula>

        <Callout kind="tip" title="ทำไมต้องใช้ค่าสัมบูรณ์?">
          เพราะเราสนใจ "ขนาดของความผิดพลาด" ไม่สนเครื่องหมาย ลบกัน + ดูว่าห่างกี่เปอร์เซ็นต์
        </Callout>

        <Callout kind="warn" title="เกณฑ์หยุด iteration ที่อาจารย์ชอบใช้">
          วน loop จนกว่า <M>{`\\varepsilon_a < 0.000001`}</M> (6 ตำแหน่งทศนิยมไม่เปลี่ยน) — ดูข้อสอบจริงจาก root1.pdf
        </Callout>
      </Sect>

      <Sect tag="03" title="คู่มือเครื่องคิดเลข fx-991CW">
        <p>เครื่อง fx-991CW คือเครื่องคิดเลขรุ่นใหม่ที่อาจารย์อนุญาต มีฟีเจอร์ที่จะช่วยคุณเยอะมาก รู้จักไว้ก่อน:</p>

        <h4>โหมดหลักที่ต้องเปิดเป็น (กด <Key>HOME</Key>):</h4>
        <ul>
          <li><b>Calculate</b> — คำนวณทั่วไป + ใช้ตัวแปร A, B, C, x, y</li>
          <li><b>Table</b> — สร้างตาราง f(x) สำหรับ x ตั้งแต่ a ถึง b (ใช้กับ Bisection / Graphical / Interpolation)</li>
          <li><b>Statistics</b> — Linear Regression (a+bx), Quadratic (a+bx+cx²), … — ตอบ Regression ได้ทันที</li>
          <li><b>Equation</b> — แก้สมการ 2-4 ตัวแปร, แก้พหุนาม Degree 2-4 — ใช้ตอน Gauss Elimination</li>
          <li><b>Distribution</b> — ไม่ค่อยใช้ในวิชานี้</li>
          <li><b>Spreadsheet</b> — ทำตาราง iteration เอง</li>
        </ul>

        <h4>Trick ที่จะใช้บ่อย:</h4>

        <Callout title="1. SOLVE หาคำตอบสมการ">
          พิมพ์สมการ เช่น <code>x^3-x-2=0</code> → <Key>OK</Key> → <Key>SHIFT</Key> <Key>CALC</Key> (SOLVE) → ใส่ค่าเริ่มต้น เครื่องจะหา root ให้
          <br/><b>หมายเหตุ:</b> SOLVE ใช้ Newton-Raphson ในเครื่อง ดังนั้นใช้เช็คคำตอบที่ทำมือได้
        </Callout>

        <Callout title="2. TABLE ใช้ทำ Bisection / Graphical method">
          <CalcSteps steps={[
            <span><Key>HOME</Key> เลือก <Key>Table</Key></span>,
            <span>พิมพ์ <code>f(x)</code> → <Key>OK</Key></span>,
            <span>กรอก Start = a, End = b, Step = h</span>,
            <span>กด <Key>=</Key> → ได้ตาราง x, f(x) ทันที</span>,
            <span>ดูว่า <b>f(x)</b> เปลี่ยนเครื่องหมายที่ช่วงไหน → ช่วงนั้นมีราก</span>,
          ]}/>
        </Callout>

        <Callout title="3. STAT ใช้กับ Linear/Polynomial Regression">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Statistics</Key></span>,
            <span>เลือก <code>y = a + bx</code> สำหรับ Linear, หรือ <code>y = a + bx + cx²</code> สำหรับ Quadratic</span>,
            <span>ใส่ตาราง x, y</span>,
            <span><Key>OK</Key> → ดูค่า <code>a, b, c</code> ในเมนู Regression Calc</span>,
            <span>ระวัง: เครื่องนี้ใช้ <b>a</b> เป็น intercept และ <b>b</b> เป็นความชัน (ตรงข้ามกับสไลด์อาจารย์บางสไลด์ที่ใช้ a₀, a₁)</span>,
          ]}/>
        </Callout>

        <Callout title="4. ตัวแปร A–F, x, y ช่วยตอน iteration">
          เก็บค่าใส่ตัวแปร: พิมพ์ค่า → <Key>STO</Key> → กดตัวแปรที่อยากเก็บ (เช่น A)<br/>
          เรียกค่า: กดตัวแปรเลย เช่น <Key>A</Key> = ใช้แทนค่า A
          <br/><b>ตัวอย่างใช้ Newton:</b> เก็บ x₀ ใน A → พิมพ์สูตร <code>A - f(A)/f'(A)</code> → กด = → เก็บผลลัพธ์ใส่ A → กด = ซ้ำ ๆ เป็น iteration
        </Callout>
      </Sect>

      <Sect tag="04" title="กลยุทธ์การสอบ">
        <Callout kind="good" title="✓ ทำอะไรก่อน">
          <ol>
            <li>อ่านข้อสอบทุกข้อก่อน 5 นาที — ดูว่ามีกี่บทเรียน คิดคะแนนคร่าว ๆ</li>
            <li>ทำข้อที่มั่นใจที่สุดก่อน เก็บคะแนนง่าย ๆ ก่อน</li>
            <li>ข้อที่ต้องทำ iteration เยอะ → เก็บค่าใส่ตัวแปรในเครื่องคิดเลข อย่าจดมือเปล่า</li>
            <li>เขียนสูตรก่อนเสมอ แม้คำนวณผิด อาจารย์ให้คะแนนสูตรได้</li>
          </ol>
        </Callout>

        <Callout kind="danger" title="✗ ระวัง">
          <ul>
            <li><b>error formula:</b> ใช้ <M>{`(x_{\\text{new}} - x_{\\text{old}})/x_{\\text{new}}`}</M> ไม่ใช่ <M>{`/x_{\\text{old}}`}</M></li>
            <li><b>Composite Simpson:</b> n ต้อง <em>เลขคู่</em> เท่านั้น</li>
            <li><b>Gauss-Seidel:</b> ใช้ค่า x ใหม่ที่อัพเดทแล้วในรอบเดียวกัน (ต่างจาก Jacobi)</li>
            <li><b>Newton-Raphson:</b> ต้องระวังกรณีหารด้วย 0 (f'(x) = 0)</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="05" title="พร้อมแล้วหรือยัง?">
        <p>มี 3 เส้นทางให้เลือกเริ่ม:</p>
        <div className="grid-3">
          <div className="card tight">
            <div className="kicker" style={{color:"var(--green)"}}>🟢 เริ่มจาก 0</div>
            <h4 style={{marginTop:2}}>เรียนตามลำดับ</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>เริ่ม Root Finding → ทุกบทตามลำดับ</p>
            <p style={{margin:"8px 0 0"}}><a href="#root" className="btn small primary">เริ่มเรียน →</a></p>
          </div>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--yellow)"}}>⚡ ก่อนสอบ</div>
            <h4 style={{marginTop:2}}>Cheat Sheet</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>สรุปทุกสูตร + Decision tree</p>
            <p style={{margin:"8px 0 0"}}><a href="#cheat" className="btn small">เปิดดู →</a></p>
          </div>
          <div className="card tight">
            <div className="kicker" style={{color:"var(--pink)"}}>📚 ฝึกโจทย์</div>
            <h4 style={{marginTop:2}}>Problem Bank</h4>
            <p className="muted" style={{fontSize:13, margin:0}}>40+ ข้อ พร้อมเฉลย</p>
            <p style={{margin:"8px 0 0"}}><a href="#problems" className="btn small">ลองทำ →</a></p>
          </div>
        </div>
      </Sect>
    </div>
  );
}

window.IntroLesson = IntroLesson;
