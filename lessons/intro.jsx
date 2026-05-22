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
