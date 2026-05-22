// Calculator Master — fx-991CW (ClassWiz) ครบทุกโหมดที่ใช้ในวิชา Numerical

function CalculatorLesson() {
  return (
    <div>
      <Hero
        kicker="★★ · Calculator Master"
        title="fx-991CW · เครื่องคิดเลขเทพ"
        lead="คู่มือฉบับสมบูรณ์ของ Casio fx-991CW (ClassWiz รุ่นใหม่) — เน้นใช้สอบ Numerical ทุกบทเร็วกว่าทำมือ 5 เท่า"
        meta={["8 mode", "STO/RCL tricks", "SOLVE / TABLE / STAT / EQN", "Exam strategy"]}
      />

      <Sect tag="0" title="ทำไมเครื่อง fx-991CW ถึงแรงกว่ารุ่นเก่า">
        <p>fx-991CW คือ ClassWiz รุ่นล่าสุด (ออกปี 2022) ที่อัพเกรดจาก fx-991EX/ES PLUS โดยเพิ่ม:</p>
        <ul>
          <li><b>HOME menu</b> สลับโหมดเร็วขึ้นมาก (ไม่ต้องจำเลขโหมด)</li>
          <li><b>Spreadsheet mode</b> — สร้าง iteration table 5 คอลัมน์ × 45 แถว (ใช้ทำ Bisection/Newton ง่ายมาก)</li>
          <li><b>Statistics ครบ 7 regression</b>: Linear, Quadratic, Cubic, Power, Exponential, Log, Inverse Exp</li>
          <li><b>Equation</b> Simul 2-4 ตัวแปร + Polynomial degree 2-4</li>
          <li>หน้าจอ HD ใหญ่ขึ้น แสดง output แบบ "Math" สวยขึ้น</li>
        </ul>

        <Callout kind="tip" title="ปุ่มที่ต้องรู้จัก">
          <table className="tbl">
            <thead><tr><th>ปุ่ม</th><th>หน้าที่</th></tr></thead>
            <tbody>
              <tr><td><Key>HOME</Key></td><td>กลับเมนู mode (กดได้ตลอดเวลา)</td></tr>
              <tr><td><Key>OK</Key> / <Key>=</Key></td><td>ยืนยัน / คำนวณ</td></tr>
              <tr><td><Key>AC</Key></td><td>ล้างจอปัจจุบัน (ไม่ลบ memory)</td></tr>
              <tr><td><Key>OPTN</Key></td><td>เมนู option ของโหมดปัจจุบัน (สูตรเสริม เช่น d/dx)</td></tr>
              <tr><td><Key>TOOLS</Key></td><td>ตั้งค่าทศนิยม, มุม (DEG/RAD), อื่น ๆ</td></tr>
              <tr><td><Key>FORMAT</Key></td><td>สลับ S↔D (decimal ↔ surd)</td></tr>
              <tr><td><Key>STO</Key></td><td>เก็บค่าใส่ตัวแปร (กดหลังพิมพ์เลข)</td></tr>
              <tr><td><Key>VAR</Key></td><td>เรียกตัวแปร A, B, C, D, E, F, x, y</td></tr>
              <tr><td><Key>ANS</Key></td><td>ค่าคำตอบล่าสุด</td></tr>
            </tbody>
          </table>
        </Callout>
      </Sect>

      {/* MODE 1 — CALCULATE */}
      <Sect tag="1" title="โหมด Calculate · พื้นฐานสุด">
        <p>โหมดที่จะใช้บ่อยที่สุดในวิชา Numerical — ทำได้แทบทุกอย่าง</p>

        <h3>1.1 ตัวแปร — แกนหลักของ Iteration</h3>
        <Callout title="วิธีเก็บค่าใส่ตัวแปร">
          <CalcSteps steps={[
            <span>พิมพ์ค่า เช่น <code>1.5</code></span>,
            <span>กด <Key>STO</Key> (เครื่องจะรอให้เลือกตัวแปร)</span>,
            <span>กด <Key>VAR</Key> (หรือกดตัวแปรโดยตรง เช่น <Key>A</Key>)</span>,
            <span>เลือก <code>A</code> → กด <Key>OK</Key> → จอแสดง <code>1.5 → A</code></span>,
          ]}/>
          <p>เครื่องเก็บตัวแปร 8 ตัว: <code>A, B, C, D, E, F, x, y</code></p>
        </Callout>

        <Callout title="เรียกค่ากลับมา">
          <CalcSteps steps={[
            <span>กด <Key>VAR</Key></span>,
            <span>เลือกตัวแปรที่ต้องการ → <Key>OK</Key></span>,
            <span>หรือพิมพ์ลงในสูตรได้เลย: <code>x² − 7</code> ตอนคำนวณจะใช้ค่า x ที่เก็บอยู่</span>,
          ]}/>
        </Callout>

        <h3>1.2 ANS · PreAns</h3>
        <Callout kind="tip" title="ใช้ทำ iteration เร็วมาก">
          <p><code>Ans</code> = คำตอบล่าสุด (กด <Key>ANS</Key>)</p>
          <p>วิธีใช้: พิมพ์สูตรที่ใช้ <code>Ans</code> เช่น</p>
          <p className="mono">Ans − (Ans² − 7) ÷ (2·Ans)</p>
          <p>กด <Key>=</Key> ครั้งแรกได้ <code>x₁</code> → กด <Key>=</Key> ซ้ำ ๆ → ได้ <code>x₂, x₃, …</code> โดยอัตโนมัติ!</p>
        </Callout>

        <h3>1.3 d/dx — diff ในเครื่อง</h3>
        <Callout title="กดยังไง">
          <CalcSteps steps={[
            <span><Key>OPTN</Key> → เลือก <code>d/dx</code></span>,
            <span>พิมพ์ฟังก์ชัน, ค่า x ที่ต้องการ</span>,
            <span>เช่น <code>d/dx( x² ln(x) , x=2 )</code> → <Key>=</Key></span>,
            <span>ได้ <code>1.693147...</code> = ln 2 + 1</span>,
          ]}/>
          <p className="muted" style={{fontSize:12}}>เครื่องใช้ Central difference อัตโนมัติ — แม่นยำมาก ใช้เช็คคำตอบ Numerical Diff ได้</p>
        </Callout>

        <h3>1.4 ∫ — Integration ในเครื่อง</h3>
        <Callout title="กดยังไง">
          <CalcSteps steps={[
            <span><Key>OPTN</Key> → เลือก <code>∫ dx</code></span>,
            <span>พิมพ์ฟังก์ชัน + ขอบเขต</span>,
            <span>เช่น <code>∫ ( e^x , 0 , 2 )</code> → <Key>=</Key></span>,
            <span>ได้ <code>6.389056...</code> (= e² − 1)</span>,
          ]}/>
          <p className="muted" style={{fontSize:12}}>ใช้เช็คคำตอบ Trapezoidal / Simpson ในการบ้าน</p>
        </Callout>

        <h3>1.5 SOLVE — หาคำตอบสมการ</h3>
        <Callout title="ใช้แทน Newton-Raphson ในข้อสอบ (ถ้าโจทย์ไม่บังคับวิธี)">
          <CalcSteps steps={[
            <span>พิมพ์สมการ เช่น <code>x³ − x − 2 = 0</code></span>,
            <span><Key>SHIFT</Key> <Key>CALC</Key> (SOLVE)</span>,
            <span>เครื่องถาม "Solve for X" — ใส่ค่าเริ่ม เช่น <code>1.5</code> → <Key>=</Key></span>,
            <span>ได้คำตอบ + L-R (= 0 หมายความว่าสมการสมดุล)</span>,
          ]}/>
          <Callout kind="warn" title="ระวัง! SOLVE ใช้ Newton ในเครื่อง — ถ้าค่าเริ่มไม่ดีอาจไปคำตอบอื่น">
            <p>เปลี่ยน initial value แล้วลองใหม่ จะได้รากตัวอื่น</p>
          </Callout>
        </Callout>
      </Sect>

      {/* MODE 2 — TABLE */}
      <Sect tag="2" title="โหมด Table · สำหรับ Bisection / Graphical / Interpolation">
        <p>สร้างตาราง f(x) ที่ x = a, a+h, a+2h, ... โดยอัตโนมัติ</p>

        <Callout title="วิธีใช้ทั่วไป">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → เลือก <Key>Table</Key></span>,
            <span>"f(x) = ?" — พิมพ์ฟังก์ชัน เช่น <code>x³ − x − 2</code> → <Key>OK</Key></span>,
            <span>ถามต่อ "g(x) = ?" — ข้ามได้ <Key>OK</Key> (หรือใส่ฟังก์ชันที่ 2 เพื่อเทียบ)</span>,
            <span>ตั้ง Start, End, Step:</span>,
            <ul style={{margin:"4px 0", paddingLeft:18}}>
              <li>Start = ค่า x เริ่มต้น (เช่น 0)</li>
              <li>End = ค่า x สิ้นสุด (เช่น 10)</li>
              <li>Step = h (เช่น 1)</li>
            </ul>,
            <span>กด <Key>=</Key> → ได้ตาราง x, f(x) ทันที</span>,
            <span><b>ทิป:</b> ดูที่ f(x) เปลี่ยนเครื่องหมาย → ราก<em>อยู่ในช่วงนั้น</em></span>,
          ]}/>
        </Callout>

        <Callout kind="good" title="ใช้กับ Bisection ยังไงให้เร็ว">
          <p><b>Phase 1:</b> Start=0, End=10, Step=1 → หาช่วงที่ f เปลี่ยนเครื่องหมาย</p>
          <p><b>Phase 2:</b> Start=ช่วงเล็กลง, Step=0.1 → ขยับช่วงเข้าใกล้</p>
          <p><b>Phase 3:</b> Start=..., Step=0.01 → ทศนิยม 2 ตำแหน่ง</p>
          <p>ทำซ้ำจนได้ทศนิยมที่ต้องการ — เร็วกว่าทำ Bisection มือเป็นสิบเท่า!</p>
        </Callout>

        <Callout kind="tip" title="โบนัส: ใช้ทำ Interpolation">
          <p>สร้างตาราง x, y → แล้วใช้ Newton's DD หรือ Lagrange manually โดยอ่านค่าจากตาราง</p>
          <p>หรือใช้ <code>g(x)</code> เปรียบเทียบ — เช่น f(x) คือ Newton interpolation polynomial, g(x) คือ Lagrange → ดูว่าเท่ากันไหม</p>
        </Callout>
      </Sect>

      {/* MODE 3 — STATISTICS */}
      <Sect tag="3" title="โหมด Statistics · Regression สุดยอด">
        <p>โหมดที่ทำ Regression ได้ "ในใจ" — แค่กรอกข้อมูลแล้วเครื่องหา a, b ให้</p>

        <h3>3.1 ประเภท Regression ที่เครื่องทำได้</h3>
        <NumTable
          headers={["Model", "สูตร", "เมื่อไหร่ใช้"]}
          rows={[
            ["y = a + bx", "Linear", "ข้อมูลเส้นตรง"],
            ["y = a + bx + cx²", "Quadratic", "โค้งเปลี่ยน 1 จุด"],
            ["y = a + bx + cx² + dx³", "Cubic", "โค้งเปลี่ยน 2 จุด"],
            ["y = a · x^b", "Power", "แบบ scaling y ∝ x^n"],
            ["y = a · e^(bx)", "Exp", "แบบเติบโตเลขชี้กำลัง"],
            ["y = a + b ln(x)", "Logarithmic", "ค่อย ๆ ชนแบบ saturate"],
            ["y = a + b/x", "Inverse", "1/x relation"],
          ]}
        />

        <h3>3.2 วิธีใช้ — Linear Regression</h3>
        <Callout title="step-by-step">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Statistics</Key></span>,
            <span>เลือก <code>y = a + bx</code></span>,
            <span>เครื่องโชว์ตารางว่าง — กรอกข้อมูล:</span>,
            <ul style={{margin:"4px 0", paddingLeft:18}}>
              <li>คอลัมน์ x: กรอกค่า x ทีละจุด กด <Key>=</Key> เพื่อขึ้นแถวใหม่</li>
              <li>คอลัมน์ y: กรอกค่า y ทีละจุด</li>
            </ul>,
            <span>กรอกครบ → <Key>OK</Key></span>,
            <span><Key>OPTN</Key> → <code>Regression Calc</code> → <Key>OK</Key></span>,
            <span>เครื่องแสดง: a = ..., b = ..., r = ... (correlation)</span>,
            <span><b>ระวัง:</b> เครื่องใช้ a เป็น intercept (= a₀), b เป็น slope (= a₁) — ตรงข้ามกับสไลด์อาจารย์บางหน้า!</span>,
          ]}/>
        </Callout>

        <Callout kind="good" title="ทำนายค่า — ใช้ x̂, ŷ">
          <CalcSteps steps={[
            <span>หลังได้ a, b แล้ว กลับมาที่ Calculate mode (<Key>HOME</Key> → <Key>Calculate</Key>)</span>,
            <span>พิมพ์ค่า x ที่อยากทำนาย แล้วกด <Key>SHIFT</Key> <Key>STAT</Key> → <code>ŷ</code></span>,
            <span>หรือพิมพ์ค่า y ที่อยากหา x — กด <code>x̂</code></span>,
            <span>เครื่องคำนวณตามสมการ regression ให้ทันที</span>,
          ]}/>
        </Callout>

        <h3>3.3 Polynomial Regression — Quadratic / Cubic</h3>
        <p>ใช้วิธีเดียวกัน แค่เลือก <code>y = a + bx + cx²</code> หรือ <code>y = a + bx + cx² + dx³</code> ตอน HOME → Statistics</p>
        <Callout title="หมายเหตุสำคัญ">
          <p>เครื่องเทียบสูตร <M>{`y = a + bx + cx^2 + dx^3`}</M> กับ <M>{`y = a_0 + a_1 x + a_2 x^2 + a_3 x^3`}</M> ของอาจารย์ ดังนั้น:</p>
          <ul>
            <li>เครื่อง <code>a</code> = อาจารย์ <M>a_0</M></li>
            <li>เครื่อง <code>b</code> = อาจารย์ <M>a_1</M></li>
            <li>เครื่อง <code>c</code> = อาจารย์ <M>a_2</M></li>
            <li>เครื่อง <code>d</code> = อาจารย์ <M>a_3</M></li>
          </ul>
        </Callout>
      </Sect>

      {/* MODE 4 — EQUATION */}
      <Sect tag="4" title="โหมด Equation · แก้สมการเชิงเส้น + พหุนาม">
        <h3>4.1 Simultaneous Equations (Ax = b)</h3>
        <Callout title="วิธีใช้">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Equation</Key></span>,
            <span>เลือก <code>Simul Equation</code></span>,
            <span>เลือกจำนวนตัวแปร: 2, 3, หรือ 4</span>,
            <span>กรอกค่าสัมประสิทธิ์ + ค่า b ในแต่ละแถว:</span>,
            <span className="mono">| 3   −0.1   −0.2  | 7.85  |<br/>| 0.1   7    −0.3  | −19.3 |<br/>| 0.3  −0.2   10   | 71.4  |</span>,
            <span>กด <Key>=</Key> → เครื่องแสดง <code>x₁ = 3, x₂ = −2.5, x₃ = 7</code> ทันที</span>,
          ]}/>
          <p className="muted" style={{fontSize:12}}>เครื่องใช้ Cramer's rule ในเชิงคำนวณ — แม่นกว่า Gauss ที่ทำมือ (กลิ้ง round-off ไม่ขึ้น)</p>
        </Callout>

        <Callout kind="warn" title="ระวัง! ข้อสอบมักให้แสดงขั้นตอน">
          <p>เครื่องตอบคำตอบ แต่ <em>ไม่แสดงขั้นกำจัด</em> — ในข้อสอบให้แสดง Gauss step ๆ ใช้เครื่องเช็คคำตอบสุดท้ายเท่านั้น</p>
        </Callout>

        <h3>4.2 Polynomial Equation</h3>
        <Callout title="หาคำตอบของ ax^n + ... = 0">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Equation</Key> → <code>Polynomial</code></span>,
            <span>เลือก degree: 2, 3, หรือ 4</span>,
            <span>กรอกสัมประสิทธิ์ a, b, c (สำหรับ degree 2)</span>,
            <span>กด <Key>=</Key> → เครื่องโชว์ x₁, x₂ (รวม complex roots ถ้ามี)</span>,
          ]}/>
          <p>ใช้กับ Newton-Raphson ตรวจคำตอบของ <M>{`f(x) = 0`}</M> ที่เป็น polynomial</p>
        </Callout>
      </Sect>

      {/* MODE 5 — SPREADSHEET */}
      <Sect tag="5" title="โหมด Spreadsheet · ทำ Iteration เป็นโต๊ะ">
        <p>โหมดที่ underrated มาก — แต่ทำ Bisection / Newton / Iteration ครบในจอเดียว</p>

        <Callout title="วิธีใช้พื้นฐาน">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Spreadsheet</Key></span>,
            <span>เครื่องโชว์ตาราง A1, B1, C1, ... (5 คอลัมน์ × 45 แถว)</span>,
            <span>กรอกค่าใน cell: เลื่อนไปที่ cell → พิมพ์ค่า → <Key>=</Key></span>,
            <span>ใส่สูตร: เริ่มด้วย <code>=</code> เช่น <code>=A1+B1</code> ใน C1</span>,
            <span>คัดลอกสูตรลง: <Key>OPTN</Key> → <code>Fill Formula</code></span>,
          ]}/>
        </Callout>

        <h3>ตัวอย่าง — Newton-Raphson ใน Spreadsheet</h3>
        <Callout title="หา √7 — เริ่ม x₀ = 2.0">
          <CalcSteps steps={[
            <span>A1: <code>2</code> (= x₀) → <Key>=</Key></span>,
            <span>A2: <code>=A1−(A1²−7)÷(2A1)</code> → ได้ x₁ = 2.75</span>,
            <span>เลือก A2 → <Key>OPTN</Key> → <code>Fill Formula</code> → range <code>A2:A10</code></span>,
            <span>เครื่องคำนวณ x₂, x₃, ..., x₉ ให้ทันที</span>,
            <span>ดูค่าสุดท้ายจนเลขไม่เปลี่ยน — ได้ √7 ≈ 2.6457513</span>,
          ]}/>
        </Callout>

        <Callout kind="good" title="ใช้กับ Bisection — 2 คอลัมน์">
          <CalcSteps steps={[
            <span>A: x_l, B: x_r, C: x_m (=(A+B)÷2), D: f(C), E: tag (a←m หรือ b←m)</span>,
            <span>A2 / B2 ใช้ logical: <code>=IF(D1·f(A1)&lt;0, A1, C1)</code></span>,
            <span>วน Fill Formula → ได้ตารางครบ</span>,
            <span>ใช้เวลา 30 วินาทีเท่านั้น — เทียบกับทำมือ 5 นาที!</span>,
          ]}/>
        </Callout>
      </Sect>

      {/* MODE 6 — MATRIX */}
      <Sect tag="6" title="โหมด Matrix · เช็คคำตอบ Gauss / Conjugate">
        <Callout title="วิธีกำหนด matrix">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Matrix</Key></span>,
            <span><Key>OPTN</Key> → <code>Define Matrix</code> → เลือก MatA, MatB, MatC, MatD</span>,
            <span>กำหนดขนาด (rows × cols) สูงสุด 4×4</span>,
            <span>กรอกค่าทุก cell → <Key>OK</Key></span>,
            <span>ทำซ้ำกับ MatB</span>,
          ]}/>
        </Callout>

        <Callout title="คำสั่งที่ใช้บ่อย">
          <CalcSteps steps={[
            <span><code>MatA × MatB</code> — คูณ matrix</span>,
            <span><code>MatA^(−1)</code> — Inverse</span>,
            <span><code>det(MatA)</code> — Determinant</span>,
            <span><code>Trn(MatA)</code> — Transpose</span>,
            <span><b>แก้ Ax = b:</b> <code>MatA^(−1) × MatB</code> เมื่อ MatB คือ column vector b</span>,
          ]}/>
        </Callout>

        <Callout kind="tip">
          ใช้เช็คคำตอบ Gauss/Gauss-Jordan/Conjugate Gradient ในข้อสอบได้รวดเร็ว แต่ <em>ห้าม</em>เขียน "ใช้เครื่อง" ในกระดาษ ต้องแสดงขั้นทำมือ
        </Callout>
      </Sect>

      {/* EXAM STRATEGY */}
      <Sect tag="✸" title="กลยุทธ์ใช้เครื่องในห้องสอบ">
        <Callout kind="good" title="✓ Method → Mode ที่ใช้">
          <NumTable
            headers={["ถ้าโจทย์ให้ทำ", "ใช้ Mode", "ทำมือหรือเครื่อง"]}
            rows={[
              ["Bisection", "Calculate (STO A,B,C) + Table", "ทำมือ แสดงตาราง"],
              ["False Position", "Calculate (STO A,B)", "ทำมือ แสดงตาราง"],
              ["One-point", "Calculate (Ans + sustain =)", "ทำมือ แสดง iteration"],
              ["Newton-Raphson", "Calculate (Ans − f/f')", "ทำมือ แสดง 3-4 iter"],
              ["Secant", "Calculate (STO A,B แล้วสลับ)", "ทำมือ แสดงตาราง"],
              ["Gauss Elim", "Equation (Simul) เช็คคำตอบ", "ทำมือ แสดง elimination"],
              ["Gauss-Seidel", "Spreadsheet หรือ Calculate (STO)", "ทำมือ แสดง iter"],
              ["Newton DD", "Statistics (เช็คผ่าน Linear)", "ทำมือ แสดงตาราง DD"],
              ["Lagrange", "ไม่มี shortcut", "ทำมือ ใช้ Table ช่วยคำนวณ Lᵢ"],
              ["Linear Spline", "Calculate ตรง ๆ", "ทำมือ แสดง m และเลือกช่วง"],
              ["Quad/Cubic Spline", "Equation (Simul 4×4)", "ทำมือ ตั้งสมการ + ใช้เครื่องแก้"],
              ["Linear Regression", "Statistics (y=a+bx)", "ใช้เครื่องเร็วสุด"],
              ["Poly Regression", "Statistics (y=a+bx+cx²+dx³)", "ใช้เครื่องเร็วสุด"],
              ["Trapezoidal", "Calculate (f(x₀)+f(xₙ)+2Σ)", "ทำมือ แสดง h, จุด"],
              ["Simpson 1/3", "Calculate (1, 4, 2, 4, ..., 4, 1)", "ทำมือ แสดง pattern"],
              ["Numerical Diff", "Calculate + d/dx เช็ค", "ทำมือ แสดง forward/central"],
            ]}
          />
        </Callout>

        <Callout kind="warn" title="✗ สิ่งที่ทำไม่ได้ในข้อสอบ">
          <ul>
            <li>เขียนว่า "ใช้เครื่อง Simul Equation" → 0 คะแนน ต้องแสดง Gauss step ๆ</li>
            <li>เขียนเลขทศนิยมไม่ตรงตามที่โจทย์ขอ (เช่น 6 หลัก แต่ตอบ 3 หลัก)</li>
            <li>ใช้ Mode Statistics กับโจทย์ Interpolation — ผลต่างกัน (Stats = least-squares, Interp = ผ่านทุกจุด)</li>
          </ul>
        </Callout>

        <Callout kind="tip" title="ทริคก่อนสอบ — ตั้งค่าเครื่อง">
          <ol>
            <li><Key>TOOLS</Key> → <code>Calc Settings</code> → ตั้ง <code>Display Digits</code> เป็น <code>Fix 6</code> (ทศนิยม 6 ตำแหน่ง)</li>
            <li><Key>TOOLS</Key> → <code>Calc Settings</code> → <code>Angle Unit</code> = <code>Radian</code> (default ของวิชา Numerical)</li>
            <li><Key>TOOLS</Key> → <code>Reset</code> → <code>Memory</code> ก่อนเข้าสอบ — เคลียร์ตัวแปรเก่า</li>
          </ol>
        </Callout>
      </Sect>

      {/* SHORTCUTS REFERENCE */}
      <Sect tag="∑" title="Quick Reference · ปุ่มลัดที่ต้องจำ">
        <NumTable
          headers={["ปุ่ม", "ทำอะไร"]}
          rows={[
            ["SHIFT + CALC", "SOLVE — หาคำตอบสมการ"],
            ["SHIFT + ENG", "Engineering notation (× 10ⁿ)"],
            ["SHIFT + . (DRG)", "แปลง deg ↔ rad ↔ grad"],
            ["SHIFT + 0 (RanInt)", "Random integer"],
            ["SHIFT + Ans", "PreAns (ค่าคำตอบก่อนหน้า Ans)"],
            ["ALPHA + ลูกศร", "สลับคอลัมน์ใน Statistics/Spreadsheet"],
            ["OPTN", "เปิดเมนูของโหมดปัจจุบัน"],
            ["CTLG", "Catalog — ดูสูตร/ค่าคงที่ทั้งหมด"],
            ["FORMAT", "S↔D สลับ decimal/surd"],
          ]}
        />
      </Sect>
    </div>
  );
}

window.CalculatorLesson = CalculatorLesson;
