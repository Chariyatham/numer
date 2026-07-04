// Integration — บทแรกของคอร์สปีนี้ (อาจารย์ย้ายมาไว้หน้าสุด)
// เนื้อหาสร้างจาก: เลคเชอร์จริง (ถอดเสียง w1_1..w1_3) + ชีทสรุป Final + แบบฝึกหัด 1
// 4 วิธีที่อาจารย์สอน ("4 โค้ด"): Trapezoidal, Composite Trapezoidal, Simpson 1/3, Composite Simpson 1/3
// ตัวอย่างเดินหลักของอาจารย์: ∫₀²(2x³−5x²+3x+1)dx  (ค่าจริง = 8/3 ≈ 2.6667)

// ── ฟังก์ชันตัวอย่างหลักของอาจารย์ (ใช้ซ้ำในหลาย viz) ──
const PROF_G = (x) => 2*x**3 - 5*x**2 + 3*x + 1;
const PROF_A = 0, PROF_B = 2, PROF_TRUE = 8/3;

function IntegrationLesson() {
  return (
    <div>
      <Hero
        kicker="01 · Integration"
        title="Numerical Integration"
        lead="หา ∫ f(x) dx โดยไม่ต้องอินทิเกรตจริง — ประมาณ “พื้นที่ใต้กราฟ” ด้วยรูปทรงที่คำนวณง่าย (คางหมู & พาราโบลา)"
        readout={{
          label: "Trapezoidal · ∫₀²(2x³−5x²+3x+1)dx  (ค่าจริง = 8/3 ≈ 2.6667)",
          steps: [
            { x: "4.0000", w: 72 },
            { x: "3.0000", w: 44 },
            { x: "2.7500", w: 24 },
            { x: "2.6875", w: 11 },
          ],
          result: "2.6667",
          note: "ซอยช่องถี่ขึ้น (n เพิ่ม) → พื้นที่รวมลู่เข้าค่าจริง",
        }}
        meta={["Trapezoidal", "Composite Trap", "Simpson 1/3", "Composite Simpson"]}
      />

      <Callout kind="tip" title="🎙️ บทนี้มาจากเลคเชอร์จริงของอาจารย์">
        <p style={{margin:"0 0 6px"}}>ปีนี้อาจารย์<b>ย้าย Integration มาเป็นบทแรก</b>ของคอร์ส (เพราะเป็นเรื่องที่<b>เข้าใจง่าย</b> เหมาะวอร์มก่อนบทอื่น) และบอกว่า “วันนี้เราเรียนกัน <b>4 โค้ด</b>” — คือ 4 วิธีที่ต้องเขียนโปรแกรมได้ทั้งหมด:</p>
        <ol style={{margin:"0 0 6px 18px"}}>
          <li>Trapezoidal Rule (คางหมูอันเดียว)</li>
          <li>Composite Trapezoidal Rule (คางหมูหลายอัน)</li>
          <li>Simpson’s Rule (พาราโบลาอันเดียว)</li>
          <li>Composite Simpson’s Rule (พาราโบลาหลายอัน)</li>
        </ol>
        <p style={{margin:0, fontSize:'0.82rem'}}>ทุกตัวอย่าง/คำตอบในบทนี้ผม<b>คำนวณยืนยันเองด้วยโปรแกรม</b> แล้วเทียบกับโปรแกรมจริงของอาจารย์ — เพราะชีทเขียนมือมี typo อยู่หลายจุด (ผมทำเครื่องหมาย <span style={{color:"var(--yellow)"}}>⚠︎ ระวังชีท</span> ไว้ให้)</p>
      </Callout>

      {/* ═══════════════ 0 · WHY + อุปมาวัดที่ดินพ่อ ═══════════════ */}
      <Sect tag="0" title="ทำไมต้องมี Numerical Integration? — อุปมา “วัดที่ดินพ่อ”">
        <p>อาจารย์เริ่มด้วยคำถาม: บาง integral คุณ “อินทิเกรตตรง ๆ” ไม่ได้ หรือได้แต่ยากมาก เช่น</p>
        <ul>
          <li><M>{`\\int e^{-x^2}\\,dx`}</M> (กระดิ่ง Gaussian — ไม่มี elementary function)</li>
          <li><M>{`\\int \\sin(x^2)\\,dx`}</M> (Fresnel integral)</li>
          <li>หรือคุณ<b>ไม่มีสมการ</b>เลย มีแค่ “จุดข้อมูล” ที่วัดมา (เช่น เซนเซอร์เก็บค่าทุกวินาที)</li>
        </ul>

        <Callout kind="good" title="🎙️ อุปมาของอาจารย์: วัดพื้นที่ที่ดินของพ่อ">
          <p style={{margin:"0 0 6px"}}>สมมติพ่อมีที่ดินแปลงหนึ่ง ขอบด้านหนึ่ง<b>เป็นเส้นโค้งเบี้ยว ๆ</b> (ไม่ใช่สี่เหลี่ยมสวย ๆ) — จะวัดพื้นที่ยังไง?</p>
          <ul style={{margin:"0 0 6px 18px"}}>
            <li>ถ้าขอบเป็น<b>เส้นตรง</b> → ใช้สูตรเรขาคณิตวัดได้เลย</li>
            <li>แต่ขอบ<b>โค้ง</b> → วัดตรง ๆ ไม่ได้ ต้องเดินไป “<b>ปักหมุด GPS</b>” เก็บพิกัด <M>{`(x_i, y_i)`}</M> เป็นระยะ ๆ</li>
            <li>แล้ว<b>ลากเส้นเชื่อมหมุด</b> → กลายเป็นรูป<b>คางหมู</b>หลาย ๆ อันเรียงกัน</li>
            <li>รวมพื้นที่คางหมูทุกอัน = พื้นที่ที่ดิน (โดยประมาณ)</li>
            <li>ยิ่ง<b>ปักหมุดถี่</b> → เส้นตามขอบโค้งได้แนบขึ้น → พื้นที่ยิ่งแม่น</li>
          </ul>
          <p style={{margin:0}}>นี่แหละคือหัวใจของ numerical integration ทั้งบท: <b>“พื้นที่ใต้กราฟ = ผลรวมของรูปทรงย่อย ๆ”</b> — เราแค่เปลี่ยนจาก “ที่ดิน” เป็น “พื้นที่ใต้เส้น <M>f(x)</M>”</p>
        </Callout>

        <FarmlandViz/>
      </Sect>

      {/* ═══════════════ 1 · แนวคิด ∫ = ผลรวมพื้นที่ ═══════════════ */}
      <Sect tag="1" title="∫ คือ “ผลรวม” — เชื่อมนิยามกับ Riemann sum">
        <p>อาจารย์ย้ำนิยาม: เครื่องหมาย <M>\int</M> จริง ๆ คือ<b>ตัว S ที่ถูกยืดออก</b> — ย่อมาจาก <b>“Sum” (ผลรวม)</b></p>
        <Formula label="นิยาม (Riemann)">
          <MB>{`\\int_a^b f(x)\\,dx \\;=\\; \\lim_{n\\to\\infty}\\sum_{i=1}^{n} f(x_i)\\,\\Delta x`}</MB>
          <p style={{fontSize:'0.8rem', color:"var(--text-dim)", margin:"6px 0 0"}}>
            <M>{`f(x_i)`}</M> = ความ<b>สูง</b>ของแถบ · <M>{`\\Delta x`}</M> (คือ <M>dx</M>) = ความ<b>กว้าง</b>ของแถบ · <M>\int</M> = เอาแถบผอม ๆ ทุกอันมา<b>บวกกัน</b>
          </p>
        </Formula>

        <p>
          ตอนเรียนแคลคูลัส เราให้แถบ “ผอมจนเป็น 0” (<M>{`n\\to\\infty`}</M>) — ซึ่งทำได้ก็ต่อเมื่อรู้ <b>antiderivative</b> (สูตรอินทิเกรต)
          แต่ถ้าไม่รู้สูตร เราทำแบบ<b>ย้อนกลับ</b>: ใช้แถบ<b>กว้างจำกัด</b> จำนวน <M>n</M> อัน ที่จุดซึ่งเราวัดค่าได้จริง แล้วบวกกัน — นี่คือ numerical integration
        </p>

        <Callout kind="tip" title="🎙️ กรอบการคิด 5 ขั้น (อาจารย์ให้จดตาม)">
          <p style={{margin:"0 0 4px"}}><b>Given:</b> ① <M>{`I=\\int_a^b f(x)\\,dx`}</M> ② จำนวนช่อง <M>n</M></p>
          <p style={{margin:0}}><b>Step:</b> ① เขียนสูตร <M>I</M> ที่จะใช้ → ② หา <M>{`f(x_i)`}</M> ทุกจุด → ③ หา <M>h</M> → ④ แทนหา <M>I</M> → ⑤ หา <b>error</b></p>
        </Callout>

        <h3>สูตร Error — วัดว่าห่างค่าจริงแค่ไหน</h3>
        <Formula label="เทียบกับค่าจริง (แบบที่ใช้บ่อย)">
          <MB>{`\\varepsilon = \\left|\\frac{\\text{ค่าจริง} - \\text{ค่าที่หาได้}}{\\text{ค่าจริง}}\\right|\\times 100\\%`}</MB>
        </Formula>
        <Callout kind="warn" title="🎙️ ที่อาจารย์เน้นเรื่อง error">
          <ul style={{margin:0}}>
            <li>ต้องใส่ <b>absolute</b> เสมอ — เครื่องหมายลบแค่บอกว่า “ประมาณเกิน (กำไร) หรือขาด” แต่ <b>ขนาด error เท่าเดิม</b> ไม่ว่าจะวัดจากทางไหน อาจารย์เลยให้ตัดเครื่องหมายทิ้ง มองเป็น error เฉย ๆ</li>
            <li>ถ้า<b>ไม่รู้ค่าจริง</b> (โจทย์จริง ๆ ที่อินทิเกรตไม่ออก) ใช้ตัวหารเป็น “ค่าที่หาได้” แทน: <M>{`\\varepsilon = \\left|\\dfrac{\\text{ค่าที่หาได้} - \\text{ค่าจริง}}{\\text{ค่าที่หาได้}}\\right|`}</M></li>
            <li>“<b>ถูกแต่ผิด</b>” — แทนสูตรถูก แต่ค่าที่ได้ไม่ใช่ค่า integral จริง เพราะเราประมาณด้วยรูปทรง</li>
          </ul>
        </Callout>
      </Sect>

      {/* ═══════════════ 2 · Trapezoidal ═══════════════ */}
      <Sect tag="2" title="① Trapezoidal Rule — แทนเส้นโค้งด้วยเส้นตรง 1 เส้น">
        <p>วิธีที่ง่ายที่สุด: ลากเส้นตรง 1 เส้นจาก <M>{`(a, f(a))`}</M> ไป <M>{`(b, f(b))`}</M> — ได้รูป<b>คางหมู</b> 1 อัน</p>

        <Callout title="ที่มาของสูตร = พื้นที่คางหมู">
          <p style={{margin:"0 0 4px"}}>พื้นที่คางหมู = <M>{`\\tfrac{1}{2}\\times(\\text{ผลบวกด้านคู่ขนาน})\\times\\text{สูง}`}</M></p>
          <p style={{margin:0}}>ด้านคู่ขนาน = <M>{`f(x_0)`}</M> กับ <M>{`f(x_1)`}</M> (ความสูงสองข้าง) · สูง = <M>h</M> (ความกว้าง)</p>
        </Callout>

        <Formula>
          <MB>{`I \\approx \\frac{h}{2}\\big[f(x_0) + f(x_1)\\big], \\qquad h = b - a`}</MB>
        </Formula>

        <TrapezoidViz/>

        <h3>🎙️ ทำตามอาจารย์ · ตัวอย่างเดินหลัก</h3>
        <p>อาจารย์ใช้ <M>{`\\int_0^2 (2x^3 - 5x^2 + 3x + 1)\\,dx`}</M> ซึ่ง<b>อินทิเกรตตรง ๆ ได้</b> → เอาไว้เทียบว่า numerical แม่นแค่ไหน</p>
        <window.HandWalkthrough steps={[
          { title: "หาค่าจริงก่อน (ด้วยแคลคูลัสปกติ)",
            body: `∫₀²(2x³−5x²+3x+1)dx
 = [ 2x⁴/4 − 5x³/3 + 3x²/2 + x ]₀²
 = [ x⁴/2 − 5x³/3 + 3x²/2 + x ]₀²
 = (16/2 − 40/3 + 12/2 + 2) − 0
 = (8 − 40/3 + 6 + 2) = 16 − 40/3
 = (48 − 40)/3 = 8/3 ≈ 2.6667   ← ค่าจริง` },
          { title: "หา h และค่า f ที่ปลายทั้งสอง",
            body: `h = b − a = 2 − 0 = 2
f(x₀)=f(0) = 2(0)−5(0)+3(0)+1 = 1
f(x₁)=f(2) = 2(8)−5(4)+3(2)+1 = 16−20+6+1 = 3`,
            calc: "แทน x=0 และ x=2 ในฟังก์ชัน (โหมด Table ช่วยได้)" },
          { title: "แทนในสูตร Trapezoidal",
            body: `I = h/2 [f(x₀)+f(x₁)]
  = 2/2 [1 + 3]
  = 1 × 4 = 4`,
            calc: "2 ÷ 2 × ( 1 + 3 ) =" },
          { title: "หา error เทียบค่าจริง",
            body: `ε = |ค่าจริง − ค่าที่ได้| / ค่าจริง × 100
  = |8/3 − 4| / (8/3) × 100
  = |2.6667 − 4| / 2.6667 × 100
  = 50.00%   ← พลาดครึ่งหนึ่งเลย!` },
        ]}/>

        <Callout kind="warn" title="ทำไม error เยอะ?">
          <p style={{margin:0}}>เส้นตรงเส้นเดียวประมาณเส้นโค้งทั้งช่วง <M>[0,2]</M> ได้หยาบมาก (ดูจากภาพ: คางหมูสีฟ้าโป่งเกินเส้นโค้งสีเหลือง) — error ของ single trapezoidal คือ <M>{`E = -\\dfrac{(b-a)^3}{12}f''(\\xi)`}</M> ซึ่งโตเร็วมากตามความกว้างช่วง วิธีแก้คือ… ซอยช่อง</p>
        </Callout>
      </Sect>

      {/* ═══════════════ 3 · Composite Trapezoidal ═══════════════ */}
      <Sect tag="3" title="② Composite Trapezoidal — ซอยเป็นคางหมูหลายอัน">
        <p>แบ่งช่วง <M>[a,b]</M> เป็น <M>n</M> ช่องเท่า ๆ กัน ใช้คางหมูกับทุกช่อง แล้วบวกพื้นที่รวม (เหมือน “ปักหมุดถี่ขึ้น”)</p>

        <Callout title="🎙️ ที่มาของสูตร (อาจารย์ไล่ให้ดูว่าทำไมจุดกลาง ×2)">
          <p style={{margin:"0 0 4px"}}>เขียนพื้นที่ทีละช่อง แล้วบวกกัน:</p>
          <div style={{fontFamily:"var(--font-mono)", fontSize:'0.8rem', lineHeight:1.7, margin:"0 0 4px"}}>
            I = h/2(f₀+f₁) + h/2(f₁+f₂) + h/2(f₂+f₃) + … + h/2(fₙ₋₁+fₙ)
          </div>
          <p style={{margin:0}}>จุด<b>ปลาย</b> (<M>{`f_0, f_n`}</M>) โผล่แค่ <b>1 ครั้ง</b> · จุด<b>ใน</b> (<M>{`f_1..f_{n-1}`}</M>) ถูกใช้เป็นด้านขวาของช่องหนึ่ง<b>และ</b>ด้านซ้ายของช่องถัดไป → โผล่ <b>2 ครั้ง</b> → เลยได้สัมประสิทธิ์ <b>×2</b></p>
        </Callout>

        <Formula>
          <MB>{`I \\approx \\frac{h}{2}\\Big[f(x_0) + f(x_n) + 2\\sum_{i=1}^{n-1} f(x_i)\\Big], \\qquad h = \\frac{b-a}{n}`}</MB>
        </Formula>

        <Callout kind="tip" title="กฎน้ำหนัก 1 · 2 · 2 · … · 2 · 1">
          <ul style={{margin:0}}>
            <li>ปลายซ้าย/ขวา (<M>{`x_0, x_n`}</M>) → <b>×1</b></li>
            <li>จุดในทั้งหมด → <b>×2</b></li>
            <li>คูณทุกอย่างด้วย <b><M>{`h/2`}</M></b></li>
          </ul>
        </Callout>

        <CompositeViz kind="trap"/>

        <Callout kind="good" title="🎙️ ตัวอย่างเดิม ซอยเป็น n=2 → เข้าใกล้ค่าจริงทันที">
          <div style={{fontFamily:"var(--font-mono)", fontSize:'0.82rem', lineHeight:1.8}}>
            h = (2−0)/2 = 1 ;  x = 0, 1, 2<br/>
            f(0)=1,  f(1)=2−5+3+1=1,  f(2)=3<br/>
            I = h/2[f₀+f₂+2f₁] = 1/2[1+3+2(1)] = 1/2(6) = 3.0<br/>
            ε = |8/3 − 3|/(8/3)×100 = <b>12.5%</b>  (จาก 50% → 12.5% แค่ซอยครั้งเดียว!)
          </div>
        </Callout>

        <Callout kind="warn" title="🎙️⚠︎ จุดสำคัญตอนเขียนโปรแกรม: xᵢ = x₀ + i·h">
          <p style={{margin:0}}>อาจารย์เน้นว่าในโค้ด<b>ต้องมีบรรทัดนี้</b> <code>xi = a + i*h</code> ไว้ในลูป มิฉะนั้นวนหาค่า <M>{`f(x_i)`}</M> ไม่ได้ (ค่า x แต่ละจุดไม่ถูกสร้าง) — เดี๋ยวเราเขียนจริงในหัวข้อแบบฝึกหัด</p>
        </Callout>
      </Sect>

      {/* ═══════════════ 4 · Simpson ═══════════════ */}
      <Sect tag="4" title="③ Simpson’s Rule — แทนเส้นโค้งด้วย “พาราโบลา” 3 จุด">
        <p>เส้นตรงยัง error เยอะเพราะมันตรง แต่ของจริงมันโค้ง — งั้น<b>ประมาณด้วยเส้นโค้ง (พาราโบลา)</b> แทน ต้องใช้ <b>3 จุด</b>: <M>{`(x_0,f_0),(x_1,f_1),(x_2,f_2)`}</M> โดย <M>{`x_1`}</M> คือจุดกลาง</p>

        <Callout title="🎙️ h ของ Simpson = (b−a)/2 (ระวังสับสน!)">
          <p style={{margin:0}}>ใน 1 พาราโบลา ช่วง <M>[a,b]</M> ถูกแบ่งเป็น <b>2 ช่องย่อย</b> (มี <M>{`x_0, x_1, x_2`}</M>) → <M>{`h = (b-a)/2`}</M>. เลข <b>2</b> ตรงนี้<b>ไม่ใช่จำนวนพาราโบลา</b> แต่คือ “2 ช่องต่อ 1 พาราโบลา”</p>
        </Callout>

        <Callout kind="good" title="พาราโบลานี้มาจากไหน? = Lagrange polynomial">
          <p style={{margin:"0 0 4px"}}>พาราโบลาที่ลากผ่าน 3 จุดพอดี คือ <b>second-order Lagrange polynomial</b> เอามาอินทิเกรตแล้วจัดรูป จะได้น้ำหนัก <M>{`(1, 4, 1)`}</M> พอดี</p>
          <p style={{margin:0, fontSize:'0.82rem'}}>🎙️ อาจารย์บอก “ตอนนี้ให้มองว่ามันคือ<b>ของแถม/สูตรสำเร็จ</b> ไปก่อน เดี๋ยวพิสูจน์ตอนบท Interpolation” — เราก็จำสูตรไปใช้ได้เลย</p>
        </Callout>

        <Formula>
          <MB>{`I \\approx \\frac{h}{3}\\big[f(x_0) + 4f(x_1) + f(x_2)\\big], \\qquad h = \\frac{b-a}{2}`}</MB>
        </Formula>

        <SimpsonViz/>

        <Callout kind="good" title="🎙️ ตัวอย่างเดิม → Simpson ได้ 8/3 เป๊ะ! (error = 0%)">
          <div style={{fontFamily:"var(--font-mono)", fontSize:'0.82rem', lineHeight:1.8}}>
            h = (2−0)/2 = 1 ;  x₀=0, x₁=1, x₂=2<br/>
            f(0)=1,  f(1)=1,  f(2)=3<br/>
            I = h/3[f₀ + 4f₁ + f₂] = 1/3[1 + 4(1) + 3] = 8/3 = 2.6667<br/>
            ε = <b>0.00%</b> ← ตรงเป๊ะ!
          </div>
          <p style={{margin:"6px 0 0"}}>ทำไมเป๊ะ? error ของ Simpson เป็น <M>{`E=-\\dfrac{(b-a)^5}{2880}f^{(4)}(\\xi)`}</M> ซึ่งขึ้นกับ<b>อนุพันธ์อันดับ 4</b>. ฟังก์ชันนี้เป็นพหุนามดีกรี 3 → <M>{`f^{(4)}=0`}</M> → error = 0. <b>Simpson แม่นเป๊ะสำหรับพหุนามดีกรี ≤ 3</b> (แม้พาราโบลาที่วาดจะไม่ทับเส้นโค้งจริง แต่พื้นที่เท่ากันพอดี)</p>
        </Callout>
      </Sect>

      {/* ═══════════════ 5 · Composite Simpson ═══════════════ */}
      <Sect tag="5" title="④ Composite Simpson’s Rule — พาราโบลาหลายอัน">
        <p>ซอยเป็น <M>n</M> ช่อง (<b><M>n</M> ต้องเป็นเลขคู่!</b>) แล้วจับทีละ 2 ช่องเป็น 1 พาราโบลา ต่อ ๆ กันไป</p>

        <Formula>
          <MB>{`I \\approx \\frac{h}{3}\\Big[f(x_0)+f(x_n) + 4\\!\\!\\sum_{i=1,3,5,\\dots}\\!\\! f(x_i) + 2\\!\\!\\sum_{i=2,4,6,\\dots}\\!\\! f(x_i)\\Big], \\quad h=\\frac{b-a}{n}`}</MB>
        </Formula>

        <Callout kind="warn" title="กฎน้ำหนัก 1 · 4 · 2 · 4 · 2 · … · 4 · 1">
          <ul style={{margin:0}}>
            <li>ปลาย <M>{`x_0, x_n`}</M> → <b>×1</b></li>
            <li>จุด<b>คี่</b> (<M>{`i=1,3,5,\\dots`}</M> = จุดยอดพาราโบลา) → <b>×4</b></li>
            <li>จุด<b>คู่</b>ที่อยู่ข้างใน (<M>{`i=2,4,\\dots,n-2`}</M> = รอยต่อพาราโบลา) → <b>×2</b></li>
            <li><b><M>n</M> ต้องเป็นเลขคู่</b> ไม่งั้นจับคู่พาราโบลาไม่ลงตัว</li>
          </ul>
        </Callout>

        <CompositeViz kind="simpson"/>

        <Callout kind="warn" title="⚠︎ เรื่อง “n” ที่ทำคนสับสน (ผมเช็คกับโปรแกรมอาจารย์แล้ว)">
          <p style={{margin:"0 0 4px"}}>ในชีทเขียนมือ อาจารย์บางจุดเขียน <M>{`h=(b-a)/2n`}</M> (นับ <M>n</M> เป็น “จำนวนพาราโบลา”) แต่<b>โปรแกรมจริง</b>ของอาจารย์ (ไฟล์ที่รันจริง) ใช้ <code>h=(b-a)/n</code> โดย <b><M>n</M> = จำนวนช่องย่อย</b></p>
          <p style={{margin:0}}>บทนี้ผมยึด<b>ตามโปรแกรม</b> (authoritative): <M>n</M> = จำนวนช่องย่อย (ต้องคู่). เช่น <b><M>n=4</M> = 4 ช่อง = 2 พาราโบลา</b>. แบบฝึกหัด “n=2,4,6” จึงหมายถึง 2/4/6 ช่องย่อย — ตรงกับผลลัพธ์ที่โปรแกรมอาจารย์ปรินต์ออกมา</p>
        </Callout>

        <h3>เทียบ Trap vs Simpson ที่ n เดียวกัน (ตัวอย่างเดิม)</h3>
        <CompareTrapSimpson/>
      </Sect>

      {/* ═══════════════ 📟 · เครื่องคิดเลข ═══════════════ */}
      <Sect tag="📟" title="fx-991CW · กดเครื่องคิดเลขให้เร็วและไม่พลาด">
        <p>ข้อสอบให้ทำ Trapezoidal/Simpson <b>ทีละขั้น</b> เครื่องคิดเลขช่วย 2 อย่าง: (1) โหมด <b>Table</b> ดึง <M>{`f(x_i)`}</M> ทุกจุดในครั้งเดียว (2) ปุ่ม <b>∫dx</b> ไว้<u>ตรวจ</u>คำตอบ</p>

        <Callout title="1. โหมด Table — ได้ f(xᵢ) ครบทุกจุดในตารางเดียว (ตัวช่วยหลัก!)">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → เลือก <Key>Table</Key></span>,
            <span>พิมพ์ <code>f(x)</code> เช่น <code>4x⁵−3x⁴+x³−6x+2</code> → <Key>=</Key> / <Key>OK</Key></span>,
            <span>กรอก <b>Start</b> = <M>a</M>, <b>End</b> = <M>b</M>, <b>Step</b> = <M>{`h=(b-a)/n`}</M></span>,
            <span>กด <Key>=</Key> → ได้คอลัมน์ <M>{`x`}</M> กับ <M>{`f(x)`}</M> ครบทุกจุด — ลอกมาใส่สูตรได้เลย</span>,
            <span>ใส่น้ำหนัก: Trap → ปลาย ×1 ในกลาง ×2 ; Simpson → 1·4·2·4·…·1 แล้วคูณ <M>{`h/2`}</M> หรือ <M>{`h/3`}</M></span>,
          ]}/>
        </Callout>

        <Callout title="2. เก็บผลรวมถ่วงน้ำหนักด้วย STO แล้วคูณทีเดียว">
          <p style={{margin:0}}>เก็บ <M>h</M> ไว้ในตัวแปร: พิมพ์ค่า → <Key>STO</Key> → <Key>A</Key> จากนั้นพิมพ์ทั้งก้อน เช่น <code>A÷2×(f0 + f4 + 2×(f1+f2+f3))</code> กด <Key>=</Key> ครั้งเดียว — เร็วและพลาดยาก · หรือใช้โหมด <b>Spreadsheet</b> ทำคอลัมน์ <M>{`f(x_i)\\times`}</M>น้ำหนัก แล้ว Sum</p>
        </Callout>

        <Callout title="3. ปุ่ม ∫dx — หาค่าจริงไว้ตรวจ (ห้ามใช้เป็นคำตอบ)">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Calculate</Key> → กด <Key>∫dx</Key> (หรือ <Key>CATALOG</Key> → Integral)</span>,
            <span>พิมพ์ฟังก์ชัน ใส่ขอบล่าง <M>a</M> ขอบบน <M>b</M> → <Key>=</Key></span>,
            <span>ได้ค่า integral จริง (เครื่องใช้ Gauss-Kronrod ภายใน) → เอาไปเป็น “ค่าจริง” ตอนคำนวณ error</span>,
          ]}/>
          <p style={{margin:"6px 0 0", fontSize:'0.8rem'}}><b>ระวัง:</b> โจทย์ให้ “ทำ Trapezoidal/Simpson” ต้องโชว์ขั้นตอน — ปุ่ม ∫dx ใช้แค่<u>เช็คว่าคำตอบใกล้เคียงไหม</u></p>
        </Callout>
      </Sect>

      {/* ═══════════════ ✍️ · แบบฝึกหัด (ทำเต็มทุกข้อ) ═══════════════ */}
      <Sect tag="✍️" title="แบบฝึกหัด 1 · ทำเต็มทุกข้อ (มือ + เครื่องคิดเลข + โปรแกรม)">
        <p>โจทย์จริงปีนี้ 3 ข้อ (ทุกข้อ “พร้อมคำนวณ error พร้อมเขียนโปรแกรม”) — ผมทำครบทุกข้อย่อย และคำนวณยืนยันด้วยโปรแกรมแล้ว</p>

        <ExerciseOne/>
        <ExerciseTwo/>
        <ExerciseThree/>
      </Sect>

      {/* ═══════════════ 🎮 · Interactive solver ═══════════════ */}
      <Sect tag="🎮" title="ลองเล่น · Integration Solver">
        <p>พิมพ์ฟังก์ชันอะไรก็ได้ เลือกวิธี แล้วดูคำตอบทันที (ใช้ตรวจการบ้านได้)</p>
        <IntegrationSolver/>
      </Sect>

      {/* ═══════════════ 📉 · Error vs n ═══════════════ */}
      <Sect tag="📉" title="ทำไม Simpson แม่นกว่า — กราฟ error เทียบ n">
        <p>plot log-log ของ error เทียบกับ <M>n</M> — ความชันบอก “อันดับการลู่เข้า”</p>
        <ErrorVsNPlot/>
      </Sect>

      {/* ═══════════════ ∑ · Quick Ref ═══════════════ */}
      <Sect tag="∑" title="สรุปสูตร · 4 วิธีหลัก (ที่ออกสอบปีนี้)">
        <NumTable
          headers={["วิธี", "สูตร", "h", "เงื่อนไข", "Error"]}
          rows={[
            ["① Trapezoidal", "(h/2)(f₀+f₁)", "b−a", "2 จุด", "O(h³)"],
            ["② Composite Trap", "(h/2)(f₀+fₙ+2Σใน)", "(b−a)/n", "n ≥ 1", "O(h²)"],
            ["③ Simpson 1/3", "(h/3)(f₀+4f₁+f₂)", "(b−a)/2", "3 จุด", "O(h⁵)"],
            ["④ Composite Simp", "(h/3)(f₀+fₙ+4Σคี่+2Σคู่)", "(b−a)/n", "n เป็นคู่!", "O(h⁴)"],
          ]}
        />
        <Callout kind="tip" title="เลือกวิธียังไง">
          <ul style={{margin:0}}>
            <li>โจทย์บอกให้ใช้วิธีไหน ก็ใช้วิธีนั้น (แบบฝึกหัดกำหนดมาชัด)</li>
            <li>จุดข้อมูล<b>คู่</b> (5, 9 จุด → <M>n=4,8</M>) → Simpson ได้ แม่นกว่า</li>
            <li>จุด<b>คี่</b> (<M>n</M> คี่) → Simpson 1/3 ล้วนไม่ได้ ต้องใช้ Trapezoidal หรือผสม Simpson 3/8</li>
          </ul>
        </Callout>
      </Sect>

      {/* ═══════════════ 🎁 · โบนัส (เกินขอบเขตปีนี้) ═══════════════ */}
      <Sect tag="🎁" title="ของแถม (เกินขอบเขตแบบฝึกหัดปีนี้) — Romberg & Gauss-Legendre">
        <Callout kind="tip" title="อ่านเพื่อรู้ลึก ไม่ออกสอบชุดนี้">
          <p style={{margin:0}}>2 หัวข้อนี้<b>ไม่มี</b>ในชีท/แบบฝึกหัดปีนี้ (ปีนี้เอาแค่ 4 วิธีข้างบน) แต่เก็บไว้ให้เข้าใจภาพรวมของ numerical integration — ถ้าเวลาน้อย ข้ามไปได้เลย</p>
        </Callout>

        <h3>Romberg — เร่งความแม่นด้วย Richardson Extrapolation</h3>
        <p>เอาผลของ Composite Trapezoidal หลาย ๆ ระดับ (<M>{`n=1,2,4,8,\\dots`}</M>) มา “สกัด” ให้แม่นขึ้นแบบทวีคูณ</p>
        <Formula label="Richardson formula">
          <MB>{`R_{k,j} = \\frac{4^j R_{k,j-1} - R_{k-1,j-1}}{4^j - 1}`}</MB>
          <p style={{fontSize:'0.78rem', color:"var(--text-dim)", margin:"4px 0 0"}}>คอลัมน์แรก <M>{`R_{k,0}`}</M> = Composite Trap ที่ <M>{`n=2^k`}</M></p>
        </Formula>
        <RombergViz/>

        <h3 style={{marginTop:24}}>Gauss-Legendre Quadrature — แม่นด้วยจุดน้อยที่สุด</h3>
        <p>แทนที่จะใช้จุดห่างเท่ากัน Gauss <b>เลือกตำแหน่งจุด</b>ให้แม่นสุดสำหรับพหุนามดีกรีสูงสุด</p>
        <Formula label="Gauss-Legendre บน [a,b]">
          <MB>{`\\int_a^b f(x)\\,dx \\approx \\frac{b-a}{2}\\sum_{i=1}^{N} w_i\\, f\\!\\left(\\frac{a+b}{2} + \\frac{b-a}{2}\\,t_i\\right)`}</MB>
        </Formula>
        <NumTable
          headers={["N", "tᵢ (บน [−1,1])", "wᵢ", "แม่นถึงดีกรี"]}
          rows={[
            ["2", "±0.5774 (±1/√3)", "1, 1", "3"],
            ["3", "0, ±0.7746", "8/9, 5/9, 5/9", "5"],
            ["4", "±0.3399, ±0.8611", "0.6521, 0.3479", "7"],
          ]}
        />
        <GaussLegendreViz/>
      </Sect>

      {/* ═══════════════ ✸ · ข้อสอบจำลอง ═══════════════ */}
      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · เลือกวิธีให้ถูก" solution={
          <p><M>n=5</M> → เป็นเลข<b>คี่</b> → ใช้ Simpson 1/3 ล้วน<b>ไม่ได้</b>! ต้องใช้ Composite Trapezoidal หรือผสม (Simpson 1/3 กับ 4 ช่องแรก + Trapezoidal ช่องที่ 5 หรือใช้ Simpson 3/8 กับ 3 ช่อง)</p>
        }>
          คุณมี <M>f(x)</M> ที่ <M>{`x=0,0.5,1,1.5,2,2.5`}</M> (6 จุด) จะหา <M>{`\\int_0^{2.5} f(x)\\,dx`}</M> ด้วย Simpson 1/3 ได้ไหม? เพราะอะไร?
        </Problem>

        <Problem label="ข้อ 2 · Simpson เป๊ะเมื่อไหร่" solution={
          <p>Simpson 1/3 แม่น<b>เป๊ะ</b>สำหรับพหุนามดีกรี ≤ <b>3</b> (เพราะ error ขึ้นกับ <M>{`f^{(4)}`}</M> ซึ่งเป็น 0). ดังนั้น (ก) <M>{`3x^2+1`}</M> ดีกรี 2 → เป๊ะ · (ข) <M>{`x^3`}</M> ดีกรี 3 → เป๊ะ · (ค) <M>{`x^4`}</M> ดีกรี 4 → ไม่เป๊ะ</p>
        }>
          ข้อใดที่ Simpson 1/3 (single) ให้คำตอบ<b>เป๊ะ</b>? (ก) <M>{`\\int 3x^2+1`}</M> (ข) <M>{`\\int x^3`}</M> (ค) <M>{`\\int x^4`}</M>
        </Problem>

        <Problem label="ข้อ 3 · โปรแกรมเทียบ 3 วิธี" solution={
          <PythonRunner code={`import math
f = lambda x: math.sin(x)/x if x != 0 else 1.0
true_val = 0.9460830704   # Si(1)

def trap(f,a,b,n):
    h=(b-a)/n
    return h/2*(f(a)+f(b)+2*sum(f(a+i*h) for i in range(1,n)))
def simp(f,a,b,n):
    h=(b-a)/n
    return h/3*(f(a)+f(b)+sum((4 if i%2 else 2)*f(a+i*h) for i in range(1,n)))

print(f"{'n':>3} | {'Comp.Trap':>11} {'err%':>8} | {'Comp.Simp':>11} {'err%':>8}")
for n in [4,8,16]:
    t=trap(f,1e-9,1,n); s=simp(f,1e-9,1,n)
    print(f"{n:3d} | {t:11.7f} {abs(true_val-t)/true_val*100:7.4f}% | {s:11.7f} {abs(true_val-s)/true_val*100:7.4f}%")`} height={200}/>
        }>
          หา <M>{`\\int_0^1 \\frac{\\sin x}{x}\\,dx`}</M> (อินทิเกรตตรงไม่ได้!) ด้วย Composite Trap และ Composite Simpson (<M>{`n=4,8,16`}</M>) เทียบค่าจริง <M>{`\\approx 0.9460831`}</M>
        </Problem>
      </Sect>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ANIMATIONS & VIZ
   ══════════════════════════════════════════════════════════════════ */

// อุปมา "วัดที่ดินพ่อ" — ขอบโค้ง → ปักหมุด → ต่อคางหมู → เติมพื้นที่
function FarmlandViz() {
  // ขอบที่ดินโค้งเบี้ยว ๆ
  const boundary = (x) => 2.3 + 1.5*Math.sin(x*0.9) + 0.5*Math.cos(x*2.1) + 0.25*x;
  const a = 0.4, b = 9.6;
  const W = 580, H = 300, padding = { l: 20, r: 16, t: 16, b: 26 };
  const xMin = 0, xMax = 10, yMin = 0, yMax = 6;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const curve = plotPath(boundary, a, b, sx, sy, 200);
  const nPins = 8, h = (b - a) / nPins;
  const pins = Array.from({ length: nPins + 1 }, (_, i) => a + i * h);

  const stepInfo = [
    "ที่ดินพ่อ: ขอบด้านบน (เส้นเหลือง) โค้งเบี้ยว — วัดพื้นที่ตรง ๆ ไม่ได้",
    "เดินไป “ปักหมุด GPS” เก็บพิกัด (xᵢ, yᵢ) เป็นระยะ ๆ",
    "ลากเส้นเชื่อมหมุด → ได้คางหมูเรียงกัน (ขอบตรงแล้ว วัดได้)",
    "รวมพื้นที่คางหมูทุกอัน = พื้นที่ที่ดิน (โดยประมาณ) → นี่คือ Trapezoidal!",
  ];

  return (
    <StepPlayer steps={4} stepDuration={1900} label={(s) => `ขั้น ${s + 1}/4`}>
      {({ step }) => (
        <div>
          <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
            <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
            {/* คางหมู (ขั้น 3-4) */}
            {step >= 2 && pins.slice(0, -1).map((x1, i) => {
              const x2 = pins[i + 1];
              return (
                <polygon key={i}
                  points={`${sx(x1)},${sy(0)} ${sx(x1)},${sy(boundary(x1))} ${sx(x2)},${sy(boundary(x2))} ${sx(x2)},${sy(0)}`}
                  fill={step >= 3 ? "#83c167" : "none"} fillOpacity={step >= 3 ? 0.16 : 0}
                  stroke="#83c167" strokeWidth="1.5"/>
              );
            })}
            {/* ขอบโค้ง */}
            <path d={curve} fill="none" stroke="#ffd66b" strokeWidth="2.5"/>
            {/* หมุด (ขั้น 2+) */}
            {step >= 1 && pins.map((x, i) => (
              <g key={i}>
                <line x1={sx(x)} y1={sy(0)} x2={sx(x)} y2={sy(boundary(x))} stroke="#58c4dd" strokeWidth="1" strokeDasharray="2 3"/>
                <circle cx={sx(x)} cy={sy(boundary(x))} r="4" fill="#58c4dd" stroke="#0e1116" strokeWidth="1.5"/>
              </g>
            ))}
            <text x={W/2} y={H - 8} textAnchor="middle" fill="#9aa4b2" fontSize="11" fontFamily="JetBrains Mono">ริมที่ดิน (แกน x = ระยะเดิน)</text>
          </svg>
          <p className="muted" style={{ fontSize: '0.8rem', marginTop: 6 }}>
            <b style={{ color: "var(--blue)" }}>🏞️ {stepInfo[step]}</b>
          </p>
        </div>
      )}
    </StepPlayer>
  );
}

function TrapezoidViz() {
  const f = PROF_G, a = PROF_A, b = PROF_B;
  const W = 580, H = 280, padding = { l: 38, r: 12, t: 14, b: 26 };
  const xMin = -0.3, xMax = 2.3, yMin = -0.3, yMax = 4;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const fnPath = plotPath(f, xMin, xMax, sx, sy, 200);
  const I = trapezoid(f, a, b);
  return (
    <div>
      <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
        <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
        <polygon points={`${sx(a)},${sy(0)} ${sx(a)},${sy(f(a))} ${sx(b)},${sy(f(b))} ${sx(b)},${sy(0)}`}
          fill="#58c4dd" opacity="0.18" stroke="#58c4dd" strokeWidth="2"/>
        <path d={fnPath} fill="none" stroke="#ffd66b" strokeWidth="2.5"/>
        <circle cx={sx(a)} cy={sy(f(a))} r="4" fill="#83c167"/>
        <circle cx={sx(b)} cy={sy(f(b))} r="4" fill="#83c167"/>
        <text x={W-padding.r-10} y={padding.t+18} textAnchor="end" fontFamily="JetBrains Mono" fontSize="12" fill="#58c4dd">
          Trap: {I.toFixed(4)} · จริง: {PROF_TRUE.toFixed(4)} · err: {(Math.abs(PROF_TRUE-I)/PROF_TRUE*100).toFixed(2)}%
        </text>
      </svg>
      <p className="muted" style={{fontSize:'0.8rem', marginTop:6}}>
        <M>{`\\int_0^2 (2x^3-5x^2+3x+1)\\,dx`}</M> — เส้นเหลือง = ฟังก์ชันจริง, สีฟ้า = คางหมูที่ประมาณ (โป่งเกินตรงกลางที่เส้นโค้งแอ่นลง → ได้ 4 แทนที่จะเป็น 2.667)
      </p>
    </div>
  );
}

function SimpsonViz() {
  const f = PROF_G, a = PROF_A, b = PROF_B, m = (a+b)/2;
  const W = 580, H = 280, padding = { l: 38, r: 12, t: 14, b: 26 };
  const xMin = -0.3, xMax = 2.3, yMin = -0.3, yMax = 4;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const fnPath = plotPath(f, xMin, xMax, sx, sy, 200);
  const x0=a, x1=m, x2=b, y0=f(a), y1=f(m), y2=f(b);
  const parab = (x) => {
    const L0 = (x-x1)*(x-x2)/((x0-x1)*(x0-x2));
    const L1 = (x-x0)*(x-x2)/((x1-x0)*(x1-x2));
    const L2 = (x-x0)*(x-x1)/((x2-x0)*(x2-x1));
    return y0*L0 + y1*L1 + y2*L2;
  };
  const parabPath = plotPath(parab, a, b, sx, sy, 100);
  let areaD = `M ${sx(a)} ${sy(0)} `;
  for (let i = 0; i <= 60; i++) { const x = a + (b-a)*i/60; areaD += `L ${sx(x)} ${sy(parab(x))} `; }
  areaD += `L ${sx(b)} ${sy(0)} Z`;
  const I = simpson(f, a, b);
  return (
    <div>
      <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
        <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
        <path d={areaD} fill="#a87dbe" opacity="0.20"/>
        <path d={fnPath} fill="none" stroke="#ffd66b" strokeWidth="2.5"/>
        <path d={parabPath} fill="none" stroke="#a87dbe" strokeWidth="2" strokeDasharray="5 3"/>
        {[a, m, b].map((x, i) => <circle key={i} cx={sx(x)} cy={sy(f(x))} r="4" fill="#83c167"/>)}
        <text x={W-padding.r-10} y={padding.t+18} textAnchor="end" fontFamily="JetBrains Mono" fontSize="12" fill="#a87dbe">
          Simp: {I.toFixed(4)} · จริง: {PROF_TRUE.toFixed(4)} · err: {(Math.abs(PROF_TRUE-I)/PROF_TRUE*100).toFixed(3)}%
        </text>
      </svg>
      <p className="muted" style={{fontSize:'0.8rem', marginTop:6}}>
        เส้นม่วง = พาราโบลาผ่าน 3 จุด (ไม่ทับเส้นโค้งจริงที่เป็น cubic เป๊ะ) แต่<b>พื้นที่ใต้เท่ากันพอดี</b> → Simpson ได้ 2.6667 เป๊ะ (err 0%)
      </p>
    </div>
  );
}

// ซอย n ถี่ขึ้น → แถบแคบลง → พื้นที่ลู่เข้าค่าจริง
function CompositeViz({ kind }) {
  const f = PROF_G, a = PROF_A, b = PROF_B;
  const W = 580, H = 280, padding = { l: 38, r: 12, t: 14, b: 26 };
  const xMin = -0.3, xMax = 2.3, yMin = -0.3, yMax = 4;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const fnPath = plotPath(f, xMin, xMax, sx, sy, 200);
  const nValues = kind === "trap" ? [1, 2, 4, 6, 8, 12] : [2, 4, 6, 8, 10, 12];
  const accent = kind === "trap" ? "#58c4dd" : "#a87dbe";
  return (
    <StepPlayer steps={nValues.length} stepDuration={1300} label={(s) => `n = ${nValues[s]}`}>
      {({ step }) => {
        const n = nValues[step], h = (b-a)/n;
        let I, shapes = [];
        if (kind === "trap") {
          I = n === 1 ? trapezoid(f,a,b) : compositeTrap(f, a, b, n);
          for (let i = 0; i < n; i++) {
            const x1 = a + i*h, x2 = a + (i+1)*h;
            shapes.push(<polygon key={i} points={`${sx(x1)},${sy(0)} ${sx(x1)},${sy(f(x1))} ${sx(x2)},${sy(f(x2))} ${sx(x2)},${sy(0)}`} fill={accent} opacity="0.16" stroke={accent} strokeWidth="1.5"/>);
          }
        } else {
          I = compositeSimpson(f, a, b, n);
          for (let i = 0; i < n; i += 2) {
            const x0 = a+i*h, x1 = a+(i+1)*h, x2 = a+(i+2)*h, y0=f(x0), y1=f(x1), y2=f(x2);
            const par = x => {
              const L0 = (x-x1)*(x-x2)/((x0-x1)*(x0-x2));
              const L1 = (x-x0)*(x-x2)/((x1-x0)*(x1-x2));
              const L2 = (x-x0)*(x-x1)/((x2-x0)*(x2-x1));
              return y0*L0 + y1*L1 + y2*L2;
            };
            let d = `M ${sx(x0)} ${sy(0)} `;
            for (let k = 0; k <= 30; k++) { const x = x0 + (x2-x0)*k/30; d += `L ${sx(x)} ${sy(par(x))} `; }
            d += `L ${sx(x2)} ${sy(0)} Z`;
            shapes.push(<path key={i} d={d} fill={accent} opacity="0.18" stroke={accent} strokeWidth="1.5"/>);
          }
        }
        return (
          <div>
            <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
              <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
              {shapes}
              <path d={fnPath} fill="none" stroke="#ffd66b" strokeWidth="2.5"/>
              <text x={W-padding.r-10} y={padding.t+18} textAnchor="end" fontFamily="JetBrains Mono" fontSize="12" fill={accent}>
                n={n} → I = {I.toFixed(6)} · err = {(Math.abs(PROF_TRUE-I)/PROF_TRUE*100).toFixed(4)}%
              </text>
            </svg>
            <p className="muted" style={{fontSize:'0.8rem', marginTop:6}}>
              ▶ กดเล่น: ยิ่งซอยถี่ (n ใหญ่) แถบยิ่งแคบ → พื้นที่รวมลู่เข้าค่าจริง <b>{PROF_TRUE.toFixed(4)}</b>
            </p>
          </div>
        );
      }}
    </StepPlayer>
  );
}

function CompareTrapSimpson() {
  return (
    <NumTable
      headers={["n", "Comp. Trap", "Trap err %", "Comp. Simpson", "Simp err %"]}
      rows={[2,4,6,8,12].map(n => {
        const t = compositeTrap(PROF_G, PROF_A, PROF_B, n);
        const s = compositeSimpson(PROF_G, PROF_A, PROF_B, n);
        return [n, t.toFixed(6), (Math.abs(PROF_TRUE-t)/PROF_TRUE*100).toFixed(4), s.toFixed(6), (Math.abs(PROF_TRUE-s)/PROF_TRUE*100).toFixed(6)];
      })}
    />
  );
}

/* ══════════════════════════════════════════════════════════════════
   แบบฝึกหัด — ทำเต็มทุกข้อ
   ══════════════════════════════════════════════════════════════════ */

// ตารางน้ำหนักช่วยแสดง f(xᵢ) พร้อมสัมประสิทธิ์
function WeightTable({ xs, fs, weights }) {
  return (
    <NumTable
      headers={["i", "xᵢ", "f(xᵢ)", "น้ำหนัก", "น้ำหนัก × f(xᵢ)"]}
      rows={xs.map((x, i) => [i, (+x).toFixed(4), (+fs[i]).toFixed(5), "×" + weights[i], (weights[i]*fs[i]).toFixed(5)])}
    />
  );
}

function trapWeights(n) { return Array.from({length:n+1}, (_, i) => (i===0||i===n) ? 1 : 2); }
function simpWeights(n) { return Array.from({length:n+1}, (_, i) => (i===0||i===n) ? 1 : (i%2 ? 4 : 2)); }
function nodes(a, b, n) { const h=(b-a)/n; return Array.from({length:n+1}, (_, i)=>a+i*h); }

function ExerciseOne() {
  const f = (x) => 4*x**5 - 3*x**4 + x**3 - 6*x + 2;
  const a = 2, b = 8, TRUE = 155930.4;
  const err = (v) => Math.abs((TRUE - v)/TRUE)*100;
  return (
    <div className="card" style={{marginTop:14, borderLeft:"3px solid var(--blue)"}}>
      <h3 style={{marginTop:0}}>ข้อ 1 · <M>{`\\displaystyle I=\\int_2^8 (4x^5 - 3x^4 + x^3 - 6x + 2)\\,dx`}</M></h3>
      <p className="muted" style={{fontSize:'0.82rem'}}>ค่าจริง (อินทิเกรตตรง) = <b className="mono">155930.4</b> · โจทย์: 1.1 Single Trapezoidal · 1.2 Composite Trapezoidal <M>{`n=2,4,6`}</M></p>

      <h4>1.1 Single Trapezoidal Rule</h4>
      <window.HandWalkthrough steps={[
        { title: "หา h และค่าปลายทั้งสอง",
          body: `h = b − a = 8 − 2 = 6
f(2) = 4(2⁵) − 3(2⁴) + 2³ − 6(2) + 2
     = 4(32) − 3(16) + 8 − 12 + 2
     = 128 − 48 + 8 − 12 + 2 = 78
f(8) = 4(8⁵) − 3(8⁴) + 8³ − 6(8) + 2
     = 131072 − 12288 + 512 − 48 + 2 = 119250`,
          calc: "ใช้โหมด Table: Start=2 End=8 Step=6 → ได้ f(2), f(8)" },
        { title: "แทนในสูตร",
          body: `I = h/2 [f(2) + f(8)]
  = 6/2 [78 + 119250]
  = 3 × 119328 = 357984`,
          calc: "6 ÷ 2 × ( 78 + 119250 ) =" },
        { title: "หา error",
          body: `ε = |155930.4 − 357984| / 155930.4 × 100
  = 202053.6 / 155930.4 × 100
  = 129.58%   (ช่วง [2,8] กว้างมาก เส้นตรงเส้นเดียวพลาดหนัก)` },
      ]}/>

      <h4>1.2 Composite Trapezoidal · n = 2, 4, 6</h4>
      <p style={{margin:"0 0 8px", fontSize:'0.85rem'}}>สูตร: <M>{`I=\\frac{h}{2}\\big[f(x_0)+f(x_n)+2\\sum f(x_i)\\big],\\ h=\\frac{b-a}{n}`}</M></p>

      {[2,4,6].map(n => {
        const xs = nodes(a,b,n), fs = xs.map(f), w = trapWeights(n);
        const val = compositeTrap(f,a,b,n), h=(b-a)/n;
        const wsum = fs.reduce((s,v,i)=>s+w[i]*v,0);
        return (
          <div key={n} style={{margin:"10px 0"}}>
            <p style={{margin:"0 0 4px", fontWeight:600, color:"var(--blue)"}}>▸ n = {n} &nbsp;(h = {h})</p>
            <WeightTable xs={xs} fs={fs} weights={w}/>
            <div style={{fontFamily:"var(--font-mono)", fontSize:'0.8rem', lineHeight:1.7, margin:"4px 0 0", padding:"6px 10px", background:"var(--bg-soft)", borderRadius:6}}>
              I = (h/2) × Σ(น้ำหนัก×f) = ({h}/2) × {wsum.toFixed(4)} = <b style={{color:"var(--green)"}}>{val.toFixed(4)}</b><br/>
              ε = |155930.4 − {val.toFixed(4)}| / 155930.4 × 100 = <b style={{color:"var(--yellow)"}}>{err(val).toFixed(4)}%</b>
            </div>
          </div>
        );
      })}

      <Callout kind="good" style={{marginTop:8}}>
        <b>สรุปข้อ 1:</b> single = 357984 (err 129.58%) → n=2: 211158 (35.42%) → n=4: 170031.94 (9.04%) → n=6: 162222 (4.03%). ยิ่งซอยถี่ error ยิ่งลด ✓
      </Callout>

      <h4>โปรแกรม</h4>
      <p style={{margin:"0 0 6px", fontSize:'0.82rem'}}>🎙️ โค้ด JavaScript จริงของอาจารย์ (ที่เอาไปส่งได้):</p>
      <CodeBlock code={`// ─── Trapezoidal (JavaScript สไตล์อาจารย์) ───
function f(x){
    return 4*Math.pow(x,5) - 3*Math.pow(x,4) + Math.pow(x,3) - 6*x + 2;
}
function Trapezoidal(a, b, n){
    let h;
    if (n != 1) h = (b - a) / n;   // composite
    else        h = b - a;         // single
    let sum = 0;
    for (let i = 1; i < n; i++){
        let xi = a + i*h;          // ⚠︎ บรรทัดที่อาจารย์เน้น!
        sum += f(xi);
    }
    return (h/2) * ( f(a) + f(b) + 2*sum );
}
function Error(I, exact){ return Math.abs((exact - I) / exact) * 100; }

let exact = Trapezoidal(2, 8, 100000);   // ประมาณค่าจริง
for (const n of [1, 2, 4, 6]){
    let ans = Trapezoidal(2, 8, n);
    console.log("n="+n, ans, Error(ans, exact).toFixed(4)+"%");
}`}/>
      <p style={{margin:"8px 0 6px", fontSize:'0.82rem'}}>เวอร์ชัน Python (กด ▸ Run ดูผลจริง — ตรงกับที่คิดมือ):</p>
      <PythonRunner code={`def f(x): return 4*x**5 - 3*x**4 + x**3 - 6*x + 2
def trapezoid(a, b, n):
    h = (b-a)/n if n != 1 else (b-a)
    s = sum(f(a + i*h) for i in range(1, n))   # xi = a + i*h
    return h/2 * (f(a) + f(b) + 2*s)

exact = 155930.4
print(f"{'method':<16}{'value':>14}{'error %':>12}")
for name, n in [("single", 1), ("n=2", 2), ("n=4", 4), ("n=6", 6)]:
    v = trapezoid(2, 8, n)
    print(f"{name:<16}{v:>14.4f}{abs(exact-v)/exact*100:>11.4f}%")`} height={200}/>
    </div>
  );
}

function ExerciseTwo() {
  const f = (x) => x**7 + 2*x**3 - 1;
  const a = -1, b = 2, TRUE = 36.375;
  const err = (v) => Math.abs((TRUE - v)/TRUE)*100;
  return (
    <div className="card" style={{marginTop:14, borderLeft:"3px solid var(--purple, #a87dbe)"}}>
      <h3 style={{marginTop:0}}>ข้อ 2 · <M>{`\\displaystyle I=\\int_{-1}^{2} (x^7 + 2x^3 - 1)\\,dx`}</M></h3>
      <p className="muted" style={{fontSize:'0.82rem'}}>ค่าจริง = <b className="mono">36.375</b> · โจทย์: 2.1 Simpson’s Rule · 2.2 Composite Simpson <M>{`n=2,4,6`}</M></p>

      <h4>2.1 Simpson’s Rule (single = พาราโบลาอันเดียว)</h4>
      <window.HandWalkthrough steps={[
        { title: "หา h และ 3 จุด",
          body: `h = (b − a)/2 = (2 − (−1))/2 = 1.5
x₀ = −1,  x₁ = 0.5,  x₂ = 2
f(−1) = (−1)⁷ + 2(−1)³ − 1 = −1 − 2 − 1 = −4
f(0.5) = 0.5⁷ + 2(0.5³) − 1 = 0.0078125 + 0.25 − 1 = −0.7421875
f(2)  = 2⁷ + 2(2³) − 1 = 128 + 16 − 1 = 143`,
          calc: "Table: Start=−1 End=2 Step=1.5 → ได้ f ทั้ง 3 จุด" },
        { title: "แทนในสูตร (น้ำหนัก 1·4·1)",
          body: `I = h/3 [f(x₀) + 4f(x₁) + f(x₂)]
  = 1.5/3 [−4 + 4(−0.7421875) + 143]
  = 0.5 [−4 − 2.96875 + 143]
  = 0.5 × 136.03125 = 68.015625`,
          calc: "1.5 ÷ 3 × ( −4 + 4×(−0.7421875) + 143 ) =" },
        { title: "หา error",
          body: `ε = |36.375 − 68.015625| / 36.375 × 100 = 86.98%
⚠︎ ระวังชีท: ชีทเขียนมือพิมพ์ 69.015625 / 96.98% (ผิด)
   ค่าถูกคือ 68.015625 / 86.98% — ตรงกับโปรแกรมอาจารย์
เหตุผล error เยอะ: x⁷ โค้งชันมาก พาราโบลาอันเดียวตามไม่ทัน` },
      ]}/>

      <h4>2.2 Composite Simpson · n = 2, 4, 6</h4>
      <p style={{margin:"0 0 8px", fontSize:'0.85rem'}}>สูตร: <M>{`I=\\frac{h}{3}\\big[f_0+f_n+4\\sum_{คี่}f_i+2\\sum_{คู่}f_i\\big],\\ h=\\frac{b-a}{n}`}</M> · <M>n</M> = ช่องย่อย (ต้องคู่)</p>

      {[2,4,6].map(n => {
        const xs = nodes(a,b,n), fs = xs.map(f), w = simpWeights(n);
        const val = compositeSimpson(f,a,b,n), h=(b-a)/n;
        const wsum = fs.reduce((s,v,i)=>s+w[i]*v,0);
        return (
          <div key={n} style={{margin:"10px 0"}}>
            <p style={{margin:"0 0 4px", fontWeight:600, color:"var(--purple, #a87dbe)"}}>▸ n = {n} &nbsp;(h = {h}){n===2 && " — เท่ากับ Simpson single ข้อ 2.1"}</p>
            <WeightTable xs={xs} fs={fs} weights={w}/>
            <div style={{fontFamily:"var(--font-mono)", fontSize:'0.8rem', lineHeight:1.7, margin:"4px 0 0", padding:"6px 10px", background:"var(--bg-soft)", borderRadius:6}}>
              I = (h/3) × Σ(น้ำหนัก×f) = ({h}/3) × {wsum.toFixed(5)} = <b style={{color:"var(--green)"}}>{val.toFixed(6)}</b><br/>
              ε = |36.375 − {val.toFixed(4)}| / 36.375 × 100 = <b style={{color:"var(--yellow)"}}>{err(val).toFixed(4)}%</b>
            </div>
          </div>
        );
      })}

      <Callout kind="warn" style={{marginTop:8}}>
        <b>⚠︎ ระวังชีท:</b> ชีทเขียนมือข้อ 2.2 (n ที่ให้ h=0.75) พิมพ์ผลเป็น 33.72 ซึ่ง<b>ผิด</b> — ค่าถูกของ 4 ช่องย่อยคือ <b>41.022217</b> (err 12.78%) ตรงกับที่โปรแกรมอาจารย์ปรินต์ (“Simpson N=4”). สรุป: n=2 → 68.02 (86.98%) → n=4 → 41.02 (12.78%) → n=6 → 37.39 (2.79%)
      </Callout>

      <h4>โปรแกรม</h4>
      <p style={{margin:"0 0 6px", fontSize:'0.82rem'}}>🎙️ โค้ด JavaScript จริงของอาจารย์:</p>
      <CodeBlock code={`// ─── Simpson 1/3 (JavaScript สไตล์อาจารย์) ───
function f(x){ return Math.pow(x,7) + 2*Math.pow(x,3) - 1; }
function Simpson(a, b, n){          // n = จำนวนช่องย่อย (ต้องคู่)
    let h = (b - a) / n;
    let sumOdd = 0, sumEven = 0;
    for (let i = 1; i < n; i++){
        let xi = a + i*h;
        if (i % 2 == 0) sumEven += f(xi);   // จุดคู่ → ×2
        else            sumOdd  += f(xi);   // จุดคี่ → ×4
    }
    return (h/3) * ( f(a) + f(b) + 4*sumOdd + 2*sumEven );
}
function Error(I, exact){ return Math.abs((exact - I) / exact) * 100; }

let exact = Simpson(-1, 2, 10000);
for (const n of [2, 4, 6]){
    let ans = Simpson(-1, 2, n);
    console.log("n="+n, ans, Error(ans, exact).toFixed(4)+"%");
}`}/>
      <p style={{margin:"8px 0 6px", fontSize:'0.82rem'}}>เวอร์ชัน Python (รันได้):</p>
      <PythonRunner code={`def f(x): return x**7 + 2*x**3 - 1
def simpson(a, b, n):
    h = (b-a)/n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i*h)
    return h/3 * s

exact = 36.375
print(f"{'n':<8}{'value':>14}{'error %':>12}")
for n in [2, 4, 6]:
    v = simpson(-1, 2, n)
    print(f"n={n:<6}{v:>14.6f}{abs(exact-v)/exact*100:>11.4f}%")`} height={180}/>
    </div>
  );
}

function ExerciseThree() {
  const f = (x) => Math.log(x);
  const a = 1, b = 2, TRUE = 2*Math.log(2) - 1;   // [x ln x − x]₁²
  const err = (v) => Math.abs((TRUE - v)/TRUE)*100;
  return (
    <div className="card" style={{marginTop:14, borderLeft:"3px solid var(--green)"}}>
      <h3 style={{marginTop:0}}>ข้อ 3 · <M>{`\\displaystyle I=\\int_1^2 \\ln x\\,dx`}</M></h3>
      <p className="muted" style={{fontSize:'0.82rem'}}>ค่าจริง = <M>{`2\\ln 2 - 1`}</M> = <b className="mono">{TRUE.toFixed(6)}</b> · โจทย์: 3.1 Composite Trapezoidal · 3.2 Composite Simpson (ทั้งคู่ <M>{`n=2,4,6`}</M>)</p>

      <Callout kind="tip" style={{margin:"0 0 10px"}}>
        <b>ค่าจริงมาจากไหน:</b> <M>{`\\int \\ln x\\,dx = x\\ln x - x`}</M> (อินทิเกรตทีละส่วน) → <M>{`[x\\ln x - x]_1^2 = (2\\ln2 - 2) - (0 - 1) = 2\\ln2 - 1 \\approx 0.386294`}</M>
      </Callout>

      <h4>3.1 Composite Trapezoidal · n = 2, 4, 6</h4>
      {[2,4,6].map(n => {
        const xs = nodes(a,b,n), fs = xs.map(f), w = trapWeights(n);
        const val = compositeTrap(f,a,b,n), h=(b-a)/n;
        const wsum = fs.reduce((s,v,i)=>s+w[i]*v,0);
        return (
          <div key={n} style={{margin:"10px 0"}}>
            <p style={{margin:"0 0 4px", fontWeight:600, color:"var(--green)"}}>▸ n = {n} &nbsp;(h = {h.toFixed(5)})</p>
            <WeightTable xs={xs} fs={fs} weights={w}/>
            <div style={{fontFamily:"var(--font-mono)", fontSize:'0.8rem', lineHeight:1.7, margin:"4px 0 0", padding:"6px 10px", background:"var(--bg-soft)", borderRadius:6}}>
              I = (h/2) × {wsum.toFixed(5)} = <b style={{color:"var(--green)"}}>{val.toFixed(6)}</b> · ε = <b style={{color:"var(--yellow)"}}>{err(val).toFixed(4)}%</b>
            </div>
          </div>
        );
      })}

      <h4>3.2 Composite Simpson · n = 2, 4, 6</h4>
      {[2,4,6].map(n => {
        const xs = nodes(a,b,n), fs = xs.map(f), w = simpWeights(n);
        const val = compositeSimpson(f,a,b,n), h=(b-a)/n;
        const wsum = fs.reduce((s,v,i)=>s+w[i]*v,0);
        return (
          <div key={n} style={{margin:"10px 0"}}>
            <p style={{margin:"0 0 4px", fontWeight:600, color:"var(--purple, #a87dbe)"}}>▸ n = {n} &nbsp;(h = {h.toFixed(5)})</p>
            <WeightTable xs={xs} fs={fs} weights={w}/>
            <div style={{fontFamily:"var(--font-mono)", fontSize:'0.8rem', lineHeight:1.7, margin:"4px 0 0", padding:"6px 10px", background:"var(--bg-soft)", borderRadius:6}}>
              I = (h/3) × {wsum.toFixed(5)} = <b style={{color:"var(--green)"}}>{val.toFixed(6)}</b> · ε = <b style={{color:"var(--yellow)"}}>{err(val).toFixed(4)}%</b>
            </div>
          </div>
        );
      })}

      <Callout kind="good" style={{marginTop:8}}>
        <b>สังเกต:</b> <M>{`\\ln x`}</M> เรียบ (smooth) มาก ทั้งสองวิธีจึงแม่นเร็ว — Simpson n=6 error แค่ ~0.002% ส่วน Trapezoidal n=6 ~0.30% (Simpson แม่นกว่าที่ n เดียวกันเสมอสำหรับฟังก์ชันเรียบ)
      </Callout>

      <h4>โปรแกรม (รวมทั้ง 2 วิธี)</h4>
      <PythonRunner code={`import math
f = lambda x: math.log(x)
a, b = 1, 2
exact = 2*math.log(2) - 1

def comp_trap(n):
    h = (b-a)/n
    return h/2 * (f(a)+f(b) + 2*sum(f(a+i*h) for i in range(1,n)))
def comp_simp(n):
    h = (b-a)/n
    return h/3 * (f(a)+f(b) + sum((4 if i%2 else 2)*f(a+i*h) for i in range(1,n)))

print(f"exact = {exact:.6f}\\n")
print(f"{'n':>3} | {'Trap':>10} {'err%':>8} | {'Simpson':>10} {'err%':>8}")
for n in [2,4,6]:
    t, s = comp_trap(n), comp_simp(n)
    print(f"{n:3d} | {t:10.6f} {abs(exact-t)/exact*100:7.4f}% | {s:10.6f} {abs(exact-s)/exact*100:7.4f}%")`} height={200}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Solver · Error plot · โบนัส
   ══════════════════════════════════════════════════════════════════ */

function IntegrationSolver() {
  const [expr, setExpr] = React.useState("2x^3-5x^2+3x+1");
  const [a, setA] = React.useState("0");
  const [b, setB] = React.useState("2");
  const [n, setN] = React.useState("4");
  const [method, setMethod] = React.useState("simpson");
  const [result, setResult] = React.useState(null);
  const [err, setErr] = React.useState("");
  const run = () => {
    try {
      const f = parseExpr(expr);
      const av = +a, bv = +b, nv = +n;
      let val;
      if (method === "trap") val = compositeTrap(f, av, bv, nv);
      else if (method === "simpson") val = compositeSimpson(f, av, bv, nv);
      else if (method === "romberg") val = romberg(f, av, bv, Math.min(7, nv)).value;
      else if (method === "gauss2") val = gaussLegendre(f, av, bv, 2).value;
      else if (method === "gauss3") val = gaussLegendre(f, av, bv, 3).value;
      setResult(val); setErr("");
    } catch (e) { setErr(e.message); setResult(null); }
  };
  return (
    <div className="solver-shell">
      <h4>Integration Solver</h4>
      <div className="input-row">
        <FnInput value={expr} onChange={setExpr} label="f(x) ="/>
        <label>a =</label><input type="text" value={a} onChange={e => setA(e.target.value)} style={{width:80}}/>
        <label>b =</label><input type="text" value={b} onChange={e => setB(e.target.value)} style={{width:80}}/>
        <label>n =</label><input type="number" value={n} onChange={e => setN(e.target.value)} style={{width:60}}/>
      </div>
      <div className="chip-row">
        {[["trap","Comp.Trap"],["simpson","Comp.Simp"],["romberg","Romberg"],["gauss2","Gauss 2-pt"],["gauss3","Gauss 3-pt"]].map(([k, l]) => (
          <button key={k} className={"btn small " + (method === k ? "primary" : "")} onClick={() => setMethod(k)}>{l}</button>
        ))}
      </div>
      <button className="btn primary" onClick={run}>▸ คำนวณ</button>
      {err && <Callout kind="danger">{err}</Callout>}
      {result != null && (
        <Callout kind="good">∫ ≈ <b className="mono">{result.toFixed(10)}</b></Callout>
      )}
    </div>
  );
}

function ErrorVsNPlot() {
  const f = x => Math.exp(x);
  const trueVal = Math.E - 1;
  const ns = [2, 4, 8, 16, 32, 64, 128];
  const data = ns.map(n => ({
    n,
    trap: Math.abs(compositeTrap(f, 0, 1, n) - trueVal),
    simp: Math.abs(compositeSimpson(f, 0, 1, n) - trueVal),
  }));
  const W = 580, H = 320, padding = { l: 50, r: 12, t: 14, b: 30 };
  const logN = data.map(d => Math.log10(d.n));
  const allErr = data.flatMap(d => [d.trap, d.simp]).filter(v => v > 0).map(v => Math.log10(v));
  const xDomain = [Math.min(...logN) - 0.3, Math.max(...logN) + 0.3];
  const yDomain = [Math.min(...allErr) - 0.5, Math.max(...allErr) + 0.5];
  const sx = makeScale(xDomain, [padding.l, W - padding.r]);
  const sy = makeScale(yDomain, [H - padding.b, padding.t]);
  const mkPath = (arr, key) => arr.map((d, i) => `${i === 0 ? "M" : "L"}${sx(logN[i]).toFixed(1)},${sy(Math.log10(Math.max(d[key], 1e-16))).toFixed(1)}`).join(" ");
  return (
    <div className="error-plot">
      <StepPlayer steps={data.length} stepDuration={650} label={(s) => `n = ${ns[s]}`}>
        {({ step }) => {
          const shown = data.slice(0, step+1);
          return (
            <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
              <Axes width={W} height={H} padding={padding} xDomain={xDomain} yDomain={yDomain}/>
              <path d={mkPath(shown, "trap")} fill="none" stroke="#58c4dd" strokeWidth="2"/>
              <path d={mkPath(shown, "simp")} fill="none" stroke="#ffd66b" strokeWidth="2"/>
              {shown.map((d, i) => (
                <g key={i}>
                  <circle cx={sx(logN[i])} cy={sy(Math.log10(Math.max(d.trap, 1e-16)))} r={i === step ? 6 : 4} fill="#58c4dd"/>
                  <circle cx={sx(logN[i])} cy={sy(Math.log10(Math.max(d.simp, 1e-16)))} r={i === step ? 6 : 4} fill="#ffd66b"/>
                </g>
              ))}
              <text x={padding.l+10} y={padding.t+18} fill="#58c4dd" fontFamily="JetBrains Mono" fontSize="12">— Trap (slope ≈ −2)</text>
              <text x={padding.l+10} y={padding.t+36} fill="#ffd66b" fontFamily="JetBrains Mono" fontSize="12">— Simpson (slope ≈ −4)</text>
              <text x={(W)/2} y={H-6} fill="#9aa4b2" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">log₁₀ n →</text>
              <text x={14} y={H/2} fill="#9aa4b2" fontSize="11" transform={`rotate(-90 14 ${H/2})`} textAnchor="middle" fontFamily="JetBrains Mono">log₁₀ |error|</text>
            </svg>
          );
        }}
      </StepPlayer>
      <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>
        (ตัวอย่าง <M>{`\\int_0^1 e^x dx`}</M>) slope −2 → error ∝ n⁻² (Trap, O(h²)); slope −4 → error ∝ n⁻⁴ (Simpson, O(h⁴)) → Simpson แม่นกว่ามาก
      </p>
    </div>
  );
}

function RombergViz() {
  const [levels, setLevels] = React.useState(5);
  const f = x => Math.sin(x);
  const { table } = romberg(f, 0, Math.PI / 2, levels);
  return (
    <div>
      <div className="input-row">
        <label>Levels:</label>
        <input type="range" min="2" max="7" value={levels} onChange={e => setLevels(+e.target.value)} style={{flex:1, maxWidth:280}}/>
        <span className="mono" style={{color:"var(--yellow)"}}>k = {levels}</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <table className="tbl" style={{fontFamily:"var(--font-mono)", fontSize:'0.75rem'}}>
          <thead><tr><th>k\\j</th>{Array.from({length: levels}, (_, j) => <th key={j}>R[k,{j}]</th>)}</tr></thead>
          <tbody>
            {table.map((row, k) => (
              <tr key={k} className={k === levels-1 ? "hi" : ""}>
                <td>{k}</td>
                {row.map((v, j) => j <= k
                  ? <td key={j} className="num" style={{color: j === k && k === levels-1 ? "var(--green)" : undefined}}>{(+v).toFixed(10)}</td>
                  : <td key={j}></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout kind="good" style={{marginTop:8}}>
        <M>{`\\int_0^{\\pi/2}\\sin x\\,dx`}</M> · ค่าที่แม่นสุด (มุมขวาล่าง) = <b className="mono">{table[levels-1][levels-1].toFixed(12)}</b> · ค่าจริง = 1
      </Callout>
    </div>
  );
}

function GaussLegendreViz() {
  const f = x => Math.exp(x);
  const a = 0, b = 1, trueVal = Math.E - 1;
  const W = 580, H = 280, padding = { l: 38, r: 12, t: 14, b: 26 };
  const sx = makeScale([-0.1, 1.1], [padding.l, W - padding.r]);
  const sy = makeScale([0, 3.0], [H - padding.b, padding.t]);
  const Nvalues = [2, 3, 4];
  return (
    <StepPlayer steps={Nvalues.length} stepDuration={1500} label={(s) => `N = ${Nvalues[s]} points`}>
      {({ step }) => {
        const N = Nvalues[step];
        const { value, rows } = gaussLegendre(f, a, b, N);
        return (
          <div>
            <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
              <Axes width={W} height={H} padding={padding} xDomain={[-0.1, 1.1]} yDomain={[0, 3.0]}/>
              <path d={plotPath(f, -0.1, 1.1, sx, sy, 200)} fill="none" stroke="#58c4dd" strokeWidth="2"/>
              {rows.map((r, i) => (
                <g key={i}>
                  <line x1={sx(r.x)} y1={sy(0)} x2={sx(r.x)} y2={sy(r.fx)} stroke="#ffd66b" strokeWidth="1.5" strokeDasharray="2 3"/>
                  <circle cx={sx(r.x)} cy={sy(r.fx)} r="5" fill="#ffd66b" stroke="#0e1116" strokeWidth="1.5"/>
                  <text x={sx(r.x)+6} y={sy(r.fx)-6} fill="#ffd66b" fontFamily="JetBrains Mono" fontSize="10">w={r.w.toFixed(3)}</text>
                </g>
              ))}
            </svg>
            <NumTable
              headers={["i","tᵢ","wᵢ","xᵢ","f(xᵢ)","wᵢ·f(xᵢ)·(b−a)/2"]}
              rows={rows.map(r => [r.i, r.t.toFixed(4), r.w.toFixed(4), r.x.toFixed(4), r.fx.toFixed(4), r.term.toFixed(6)])}
            />
            <Callout kind="good">
              N = {N} จุด → ∫ ≈ <b className="mono">{value.toFixed(10)}</b> · จริง = <b className="mono">{trueVal.toFixed(10)}</b> · error = {Math.abs(value - trueVal).toExponential(3)}
            </Callout>
          </div>
        );
      }}
    </StepPlayer>
  );
}

window.IntegrationLesson = IntegrationLesson;
