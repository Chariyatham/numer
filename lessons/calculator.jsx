// Calculator Master — fx-991CW (ClassWiz รุ่น 2)
// ทุก sequence ในไฟล์นี้ตรวจกับคู่มือ 2 เล่มแล้ว:
//   [TH] คู่มือ CASIO CLASSWIZ fx-991CW ภาษาไทย (Jeena Suthanya, 2568) — ไฟล์ ~/Downloads/fx-991cw-manual.pdf
//   [EN] fx-570CW/fx-991CW User's Guide (CASIO global, EN) — casio.com/.../fx-570CW_991CW_EN.pdf
// อ้างอิงกำกับไว้ทุกหมวดในหน้าเว็บ ห้ามแก้ sequence โดยไม่เปิดคู่มือเทียบ

function CalculatorLesson() {
  return (
    <div>
      <Hero
        kicker="★★ · Calculator Master"
        title="fx-991CW · คู่มือกดจริง"
        lead="ทุกลำดับปุ่มในหน้านี้ตรวจกับคู่มือ CASIO ฉบับไทย + ฉบับอังกฤษแล้วทีละขั้น — กดตามได้เลยโดยไม่ต้องเดา"
        meta={["ตรวจกับคู่มือ 2 เล่ม", "ไม่มีปุ่ม OPTN / STO / ∫dx", "Table · Equation · Solver", "แผนใช้ต่อบท"]}
      />

      <Callout kind="warn" title="⚠︎ หน้านี้เคยเขียนผิด — แก้แล้ว 17 ส.ค. 2569">
        <p style={{margin:"0 0 6px"}}>เวอร์ชันก่อนหน้าลอกลำดับปุ่มของ <b>fx-991EX/ES PLUS (รุ่นเก่า)</b> มาใส่ ซึ่งกดบน fx-991CW ไม่ได้เลย จุดที่ผิดและแก้แล้ว:</p>
        <NumTable
          headers={["เคยเขียนว่า", "ความจริงบน fx-991CW", "ที่มา"]}
          rows={[
            [<span>ปุ่ม <code>OPTN</code></span>, <span><b>ไม่มีปุ่มนี้</b> — งานของมันถูกแยกไป <Key>CATALOG</Key> (คำสั่ง/ฟังก์ชัน) กับ <Key>TOOLS</Key> (ตั้งค่าของโหมด)</span>, "TH บทที่ 1"],
            [<span>ปุ่ม <code>STO</code></span>, <span><b>ไม่มีปุ่มนี้</b> — ปุ่มเก็บตัวแปรชื่อ <Key>VARIABLE</Key> และต้องเลือก <code>[Store]</code> จากเมนู</span>, "TH บทที่ 1 · EN น.36"],
            [<span>ปุ่ม <code>∫dx</code> บนแป้น</span>, <span><b>ไม่มีปุ่มนี้</b> — เข้าทางเดียวคือ <Key>CATALOG</Key> → Func Analysis → Integration</span>, "TH §2.7 · EN น.49"],
            [<span><code>SHIFT</code> + <code>CALC</code> = SOLVE</span>, <span>SOLVE อยู่ในแอป <b>Equation → Solver</b> ไม่ใช่ปุ่มลัด</span>, "EN น.105–107"],
            [<span>Table: “พิมพ์ f(x) ได้เลย”</span>, <span>ต้องกด <Key>FUNCTION</Key> → <code>Define f(x)</code> ก่อน แล้วช่วง x ต้องเข้าทาง <Key>TOOLS</Key> → <code>Table Range</code></span>, "TH บทที่ 4"],
            [<span>“เครื่องใช้ Gauss-Kronrod”</span>, <span><b>ตัดทิ้ง</b> — คู่มือทั้งสองเล่มไม่ได้บอกอัลกอริทึมภายใน ยืนยันไม่ได้</span>, "—"],
          ]}
        />
      </Callout>

      {/* ═════════ 0 · ปุ่ม ═════════ */}
      <Sect tag="0" title="6 ปุ่มที่เป็นทางเข้าของทุกอย่าง" read="must" min={4}>
        <p>fx-991CW เลิกใช้ระบบ “ปุ่มลัดเต็มแป้น” ของรุ่นเก่า แล้วย้ายทุกอย่างไปอยู่หลังปุ่ม 6 ปุ่มนี้แทน จำ 6 ปุ่มนี้ได้ = ใช้เครื่องเป็นทั้งเครื่อง</p>
        <NumTable
          headers={["ปุ่ม", "หน้าที่ (ตามคู่มือไทย บทที่ 1)", "ตัวอย่างที่จะใช้ในวิชานี้"]}
          rows={[
            [<Key>HOME</Key>, "ออกไปเลือกแอป/โหมด — กดได้ตลอดเวลา", "สลับ Calculate ↔ Table ↔ Equation"],
            [<Key>CATALOG</Key>, "คลังคำสั่ง สัญลักษณ์ และฟังก์ชันทั้งหมด", <span>∫ , <M>{`d/dx`}</M> , Σ , det , Sum(</span>],
            [<Key>TOOLS</Key>, "ตั้งค่าเฉพาะของโหมดที่เปิดอยู่", "Table Range, Fill Formula, สร้าง MatA"],
            [<Key>VARIABLE</Key>, "เก็บ/เรียกค่าตัวแปร A–F, x, y, z", "เก็บ xᵢ ระหว่างวนซ้ำ"],
            [<Key>FUNCTION</Key>, "เก็บฟังก์ชัน f(x), g(x) ไว้ใช้ซ้ำ", "นิยาม f(x) ให้โหมด Table"],
            [<Key>SETTINGS</Key>, "ตั้งค่าเครื่อง (มุม, ทศนิยม, รีเซ็ต)", "ตั้ง Fix 6 / Radian ก่อนสอบ"],
          ]}
        />
        <Callout kind="tip" title="ปุ่มยืนยันมี 2 ปุ่ม และมันไม่เหมือนกันเป๊ะ">
          <p style={{margin:"0 0 4px"}}><Key>OK</Key> = ปุ่มกลางแป้นลูกศร ใช้<b>เลือกเมนู</b> · <Key>EXE</Key> = ปุ่มล่างขวา ใช้<b>คำนวณ/ยืนยันค่า</b></p>
          <p style={{margin:0}}>คู่มือไทยหมายเหตุไว้ว่าสองปุ่มนี้ทำงานเหมือนกัน (บทที่ 1 หน้า 4) แต่มีจุดที่คู่มือสองเล่ม<b>เขียนไม่ตรงกัน</b>: หน้าจบการกรอกข้อมูลในโหมด Statistics คู่มืออังกฤษเขียน <Key>OK</Key> (น.72) ส่วนคู่มือไทยเขียน <Key>EXE</Key> (หน้า 33) — <b>ถ้ากดอันหนึ่งแล้วเมนูผลลัพธ์ไม่ขึ้น ให้ลองอีกอัน</b> อย่าเสียเวลาคิดว่าทำอะไรผิด</p>
        </Callout>
        <Callout kind="warn" title="ปุ่มที่ “ไม่มี” บนเครื่องนี้ — อย่าไปหา">
          <p style={{margin:0}}><code>OPTN</code> · <code>STO</code> · <code>RCL</code> · <code>∫dx</code> · <code>d/dx</code> · <code>CALC</code> · <code>MODE</code> — ทั้งหมดนี้เป็นปุ่มของ fx-991EX/ES PLUS ถ้าคู่มือ/คลิปไหนบอกให้กดปุ่มพวกนี้ แปลว่ากำลังสอนคนละรุ่น</p>
        </Callout>
      </Sect>

      {/* ═════════ 1 · ตัวแปร ═════════ */}
      <Sect tag="1" title="ตัวแปร A B C D E F x y z — หัวใจของการวนซ้ำ" read="must" min={8}>
        <p>เครื่องเก็บได้ <b>9 ตัวแปร</b>: <code>A, B, C, D, E, F, x, y, z</code> <span className="muted">(EN น.36)</span> — กฎห้ามคำนวณต่อจากเลขที่ปัดแล้วอยู่รอดได้เพราะตัวแปรพวกนี้</p>

        <h3>1.1 เก็บ “ผลลัพธ์ที่เพิ่งคำนวณ” ลงตัวแปร</h3>
        <Callout title="ทางหลัก — ใช้ได้กับทุกอย่างที่คำนวณออกมา">
          <CalcSteps steps={[
            <span>คำนวณให้ได้ผลก่อน เช่นพิมพ์ <code>3+5</code> → <Key>EXE</Key> (จอล่างขึ้น 8)</span>,
            <span>กด <Key>VARIABLE</Key> → จอโชว์รายการตัวแปรทั้ง 9 ตัวพร้อมค่าปัจจุบัน</span>,
            <span>เลื่อนแถบดำไปที่ <code>[A=]</code> → กด <Key>OK</Key> → เลือก <code>[Store]</code> → <Key>OK</Key></span>,
            <span>กด <Key>AC</Key> ออกมา — ตอนนี้ <code>A = 8</code></span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>EN น.36 Example 1 (“Press VARIABLE, and then select [A=] &gt; [Store]”)</p>
        </Callout>

        <Callout kind="good" title="ทางลัด — ถ้าค่าที่จะเก็บเป็น “ตัวเลขที่พิมพ์เอง”">
          <CalcSteps steps={[
            <span>กด <Key>VARIABLE</Key></span>,
            <span>เลื่อนแถบดำไปตัวแปรที่ต้องการ (เช่น <code>[B=]</code>)</span>,
            <span><b>พิมพ์เลขลงไปตรง ๆ</b> เช่น <code>4</code> → จอเปลี่ยนเป็นหน้าแก้ไข <code>B=4</code></span>,
            <span><Key>EXE</Key> — จบ ไม่ต้องเข้าเมนู Store</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>EN น.37 Example 2 + น.106 ขั้นที่ 3 — เร็วกว่าทางหลัก 2 จังหวะ ใช้ตอนตั้งค่าเริ่มต้น <M>{`x_0`}</M></p>
        </Callout>

        <h3>1.2 พิมพ์ตัวแปรลงในสูตร</h3>
        <Callout title="กด SHIFT แล้วกดปุ่มที่มีตัวอักษรนั้นพิมพ์อยู่ข้างบน">
          <NumTable
            headers={["อยากได้", "กด", "สถานะ"]}
            rows={[
              [<code>A</code>, <span><Key>SHIFT</Key> <Key>4</Key></span>, "ยืนยันจากคู่มือ (EN น.37, TH บทที่ 7)"],
              [<code>B</code>, <span><Key>SHIFT</Key> <Key>5</Key></span>, "ยืนยันจากคู่มือ (EN น.106)"],
              [<code>x</code>, <span><Key>SHIFT</Key> <Key>0</Key> หรือปุ่ม <Key>x</Key> โดยตรง</span>, "ยืนยันจากคู่มือ (EN น.37)"],
              [<span><code>C D E F y z</code></span>, <span><Key>SHIFT</Key> + ปุ่มที่มีตัวอักษรนั้นพิมพ์อยู่</span>, "คู่มือบอกกฎ แต่ไม่ได้ไล่ทีละตัว — ดูตัวอักษรบนปุ่มจริง"],
            ]}
          />
          <p style={{margin:"6px 0 0"}}>อีกทาง (ช้ากว่าแต่ไม่ต้องจำแป้น): <Key>VARIABLE</Key> → เลือกตัวแปร → <code>[Recall]</code> → เครื่องจะแทรกตัวอักษรนั้นลงในสูตรให้</p>
        </Callout>

        <h3>1.3 การรันสูตรเดิมซ้ำ ← ท่าที่ใช้บ่อยที่สุดในห้องสอบ</h3>
        <Callout kind="good" title="ท่าที่ 1 (แนะนำ) — ลูป Ans: ไม่ต้องแตะเมนูเลย กด ◀ EXE รัวได้">
          <p style={{margin:"0 0 6px"}}><code>Ans</code> = ผลลัพธ์ล่าสุด มีปุ่มของตัวเองบนแป้น <span className="muted">(EN น.35)</span></p>
          <CalcSteps steps={[
            <span>พิมพ์ค่าเริ่ม เช่น <code>2</code> → <Key>EXE</Key> (ตอนนี้ <code>Ans</code> = 2)</span>,
            <span>พิมพ์สูตรรอบเดียว: <code>Ans − (Ans⁴ − 13) ÷ (4 Ans³)</code> → <Key>EXE</Key> → ได้ <M>{`x_1`}</M></span>,
            <span>กด <Key>◀</Key> (Replay — สูตรเดิมกลับมาทั้งบรรทัด) → <Key>EXE</Key> → ได้ <M>{`x_2`}</M></span>,
            <span>วน ③ ซ้ำจนครบรอบที่โจทย์สั่ง — <b>ไม่มีการปัดเลขระหว่างทางเลย</b></span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>Replay: EN น.35 — “While a calculation result is on the display, you can press ◀, ▶ or ↩ to edit the expression you used for the previous calculation” ⇒ ท่านี้ผลลัพธ์ค้างบนจอตลอด Replay จึงใช้ได้ทุกรอบ</p>
          <p style={{margin:"6px 0 0", fontSize:'0.82rem'}}><b>ข้อจำกัด:</b> ใช้ได้เฉพาะสูตรที่อ้างค่ารอบก่อน<b>ตัวเดียว</b> (Newton, One-point) — Secant ต้องใช้ 2 ค่าย้อนหลัง ให้ไปใช้ท่าที่ 2</p>
        </Callout>
        <Callout title="ท่าที่ 2 — เก็บลงตัวแปร (ใช้กับ Secant / Bisection ที่ต้องจำหลายค่า)">
          <CalcSteps steps={[
            <span>ตั้งค่าเริ่ม: <Key>VARIABLE</Key> → <code>[x=]</code> → พิมพ์ <code>2</code> → <Key>EXE</Key></span>,
            <span>พิมพ์สูตร <code>x − (x⁴ − 13) ÷ (4x³)</code> → <Key>EXE</Key> → ได้ <M>{`x_1`}</M></span>,
            <span>เก็บกลับ: <Key>VARIABLE</Key> → <code>[x=]</code> → <code>[Store]</code></span>,
            <span>กลับมาหน้าคำนวณแล้ว<b>เรียกสูตรเดิม</b>: ถ้าผลลัพธ์ยังค้างบนจอใช้ <Key>◀</Key> ได้เลย · ถ้าจอโล่งไปแล้วให้กด <Key>▲</Key> เลื่อนประวัติขึ้นไปหาสูตรเดิม → <Key>EXE</Key></span>,
          ]}/>
          <p style={{margin:"6px 0 0", fontSize:'0.82rem'}}><b>ทำไมต้องมี 2 ทาง:</b> Replay (<Key>◀</Key>) คู่มือระบุว่าใช้ได้ “ตอนที่ผลลัพธ์อยู่บนจอ” — หลังเข้าเมนู VARIABLE อาจไม่เข้าเงื่อนไขนั้น แต่<b>ประวัติการคำนวณไม่ถูกล้าง</b>จนกว่าจะกด <Key>HOME</Key> ⇒ <Key>▲</Key> เอาสูตรกลับมาได้เสมอ <span className="muted">(EN น.34–35)</span></p>
        </Callout>
        <Callout kind="tip" title="สรุปหน้าที่ปุ่มลูกศร (สับสนกันบ่อย)">
          <p style={{margin:0}}><Key>▲</Key> <Key>▼</Key> = เลื่อนดู<b>ประวัติการคำนวณ</b> (มีเฉพาะแอป Calculate, Complex, Base-N) · <Key>◀</Key> <Key>▶</Key> = <b>Replay</b> ดึงสูตรที่เพิ่งคำนวณกลับมาแก้ · ประวัติถูกล้างทันทีที่กด <Key>HOME</Key> หรือปิดเครื่อง ⇒ <b>อย่าสลับโหมดกลางข้อ</b></p>
        </Callout>
      </Sect>

      {/* ═════════ 2 · CALCULATE ═════════ */}
      <Sect tag="2" title="โหมด Calculate · ∫ , d/dx , Σ อยู่ใน CATALOG ทั้งหมด" read="must" min={8}>
        <p>สามคำสั่งนี้<b>ไม่มีปุ่มลัดบนแป้น</b> ต้องเข้าทาง <Key>CATALOG</Key> → <code>Func Analysis</code> เหมือนกันหมด เมนูย่อยเรียงแบบนี้เป๊ะ <span className="muted">(TH §2.7 หน้า 9)</span>:</p>
        <p className="mono" style={{margin:"0 0 10px", padding:"8px 12px", background:"var(--bg-soft)", borderRadius:6}}>
          Derivative(d/dx) &nbsp;·&nbsp; Integration(∫) &nbsp;·&nbsp; Summation(Σ) &nbsp;·&nbsp; Logarithm(log□b)
        </p>

        <h3>2.1 ∫ — หา “ค่าจริง” ไว้เทียบ error</h3>
        <Callout title="ลำดับปุ่มเต็ม (ตัวอย่างคู่มือ: ∫₀⁴ 9x² dx = 192)">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <code>Calculate</code> → <Key>OK</Key></span>,
            <span><Key>CATALOG</Key> → <code>Func Analysis</code> (บรรทัดแรก) → <Key>OK</Key></span>,
            <span><Key>▼</Key> ลงมาที่ <code>Integration(∫)</code> (บรรทัดที่ 2) → <Key>OK</Key> → เครื่องแทรกแม่แบบ <M>{`\\int_\\square^\\square \\square\\,dx`}</M></span>,
            <span><Key>▼</Key> → พิมพ์<b>ขอบล่าง</b> <code>0</code> → <Key>▲</Key> → พิมพ์<b>ขอบบน</b> <code>4</code></span>,
            <span><Key>▶</Key> ออกมาที่ตัวฟังก์ชัน → พิมพ์ <code>9x²</code> → <Key>EXE</Key> → ได้ <code>192</code></span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>TH หน้า 9 ลำดับปุ่มจริง: CATALOG · OK · ▼ · OK · ▼ · 0 · ▲ · 4 · ▶ · 9 · x · x² · EXE</p>
        </Callout>
        <Callout kind="warn" title="ห้ามลอกค่านี้ไปตอบ">
          <p style={{margin:0}}>โจทย์ถาม “ค่าจาก Trapezoidal/Simpson ที่ n = …” ซึ่งเป็น<b>ค่าประมาณ</b> ส่วน ∫ ให้<b>ค่าจริง</b> — คนละเลข ใช้มันเป็นตัวตั้งตอนคำนวณ <M>{`\\varepsilon_t`}</M> และเช็คว่าคำตอบเราไม่หลุดโลกเท่านั้น</p>
        </Callout>

        <h3>2.2 d/dx — ตรวจ Numerical Differentiation</h3>
        <Callout title="ลำดับปุ่มเต็ม (ตัวอย่างคู่มือ: d/dx(x²−3x) ที่ x=5 = 7)">
          <CalcSteps steps={[
            <span><Key>CATALOG</Key> → <code>Func Analysis</code> → <Key>OK</Key></span>,
            <span><code>Derivative(d/dx)</code> เป็นบรรทัดแรกอยู่แล้ว → <Key>OK</Key></span>,
            <span>พิมพ์ฟังก์ชัน <code>x²−3x</code></span>,
            <span><Key>▶</Key> ออกมาที่ช่อง <M>{`|_{x=}`}</M> → พิมพ์ <code>5</code> → <Key>EXE</Key> → ได้ <code>7</code></span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>TH หน้า 9 · เอาไว้เทียบว่า forward/backward/central ของเราเบี่ยงไปเท่าไร (ไม่ใช่คำตอบข้อสอบ)</p>
        </Callout>

        <h3>2.3 Σ — ท่าลับของ Trapezoidal / Simpson</h3>
        <Callout kind="good" title="พิมพ์สูตรทั้งก้อนครั้งเดียว ไม่ต้องบวก f(xᵢ) ทีละตัว">
          <p style={{margin:"0 0 6px"}}>Trapezoidal คือ</p>
          <MB>{`I \\approx \\frac{h}{2}\\left[f(a)+f(b)+2\\sum_{i=1}^{n-1} f(a+ih)\\right]`}</MB>
          <p style={{margin:"0 0 6px"}}>ก้อน <M>{`\\sum`}</M> พิมพ์ลงเครื่องได้ตรง ๆ: <Key>CATALOG</Key> → <code>Func Analysis</code> → <code>Summation(Σ)</code> → ใส่นิพจน์, ตัวล่าง, ตัวบน</p>
          <p style={{margin:0}}>เช่น <M>{`a=0, b=4, n=4 \\Rightarrow h=1`}</M> ของ <M>{`f(x)=9x^2`}</M> พิมพ์ <code>1÷2×( f(0) + f(4) + 2Σ(9x², 1, 3) )</code> กด <Key>EXE</Key> ครั้งเดียวจบ</p>
          <p style={{margin:"6px 0 0", fontSize:'0.82rem'}}><b>ข้อจำกัด:</b> ตัวล่าง/ตัวบนของ Σ ต้องเป็น<b>จำนวนเต็ม</b> <span className="muted">(EN น.49)</span> ⇒ ต้องเขียนพจน์ในรูป <M>{`f(a+ih)`}</M> โดยให้ <M>i</M> เป็นตัววิ่ง ไม่ใช่ <M>x</M> เอง</p>
        </Callout>
        <Callout kind="tip" title="Simpson 1/3 ก็ทำได้ แต่ต้องแยก Σ สองก้อน">
          <p style={{margin:0}}>น้ำหนัก 4 ตกที่ <M>i</M> คี่ และ 2 ตกที่ <M>i</M> คู่ ⇒ <M>{`\\frac{h}{3}[f(a)+f(b)+4\\sum_{\\text{odd}}+2\\sum_{\\text{even}}]`}</M> เขียนเป็น <code>Σ(f(a+(2i−1)h), 1, n)</code> กับ <code>Σ(f(a+2ih), 1, n−1)</code> — ถ้าคิดในหัวไม่ทัน ใช้โหมด Table ลอกค่าแล้วบวกมือปลอดภัยกว่า</p>
        </Callout>
      </Sect>

      {/* ═════════ 3 · TABLE ═════════ */}
      <Sect tag="3" title="โหมด Table · ดึง f(xᵢ) ทุกจุดในตารางเดียว" read="must" min={8}>
        <p>โหมดที่คุ้มที่สุดสำหรับบท Integration และ Bisection — แต่เป็นโหมดที่ลำดับปุ่มพลาดง่ายที่สุดเช่นกัน เพราะ<b>พิมพ์ f(x) ลงไปตรง ๆ ไม่ได้</b></p>

        <Callout title="ลำดับปุ่มเต็ม — ตัวอย่างคู่มือ: f(x)=x²−6x+8 บนช่วง [−5, 5] step 1">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → เลื่อนไปไอคอน <code>Table</code> → <Key>OK</Key></span>,
            <span>กด <Key>FUNCTION</Key> → เมนู 4 บรรทัดเด้งขึ้น: <code>f(x)</code> / <code>g(x)</code> / <b><code>Define f(x)</code></b> / <code>Define g(x)</code></span>,
            <span>เลื่อนแถบดำไปที่ <code>Define f(x)</code> → <Key>OK</Key> → จอขึ้น <code>f(x)=</code></span>,
            <span>พิมพ์ <code>x²−6x+8</code> → <Key>EXE</Key> (กลับมาหน้าตาราง)</span>,
            <span>กด <Key>TOOLS</Key> → เลือก <code>Table Range</code> → <Key>OK</Key></span>,
            <span>พิมพ์ <b>Start</b> <code>−5</code> → <Key>EXE</Key> → <b>End</b> <code>5</code> → <Key>EXE</Key> → <b>Step</b> <code>1</code> → <Key>EXE</Key></span>,
            <span>แถบดำจะไปหยุดที่ <code>▸Execute</code> → <Key>EXE</Key> → ตารางคอลัมน์ <code>x</code> กับ <code>f(x)</code> ขึ้นครบทุกจุด</span>,
            <span>เลื่อนอ่านด้วย <Key>▲</Key> <Key>▼</Key> — ลอกค่าไปใส่สูตร Trap/Simpson ได้เลย</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>TH บทที่ 4 หน้า 20–21 (ภาพเมนู TOOLS ในคู่มือคือ Table Range / Define f(x)/g(x) / Table Type / Edit)</p>
        </Callout>

        <Callout kind="good" title="ตั้ง Table Type = f(x) ทุกครั้ง — ได้ 45 แถวแทน 30 และไม่มีคอลัมน์ ERROR">
          <p style={{margin:"0 0 4px"}}>ค่าเริ่มต้นคือ <code>f(x)/g(x)</code> ซึ่ง (ก) โชว์คอลัมน์ <code>g(x)</code> ที่ขึ้น <code>ERROR</code> รกจอเมื่อเราไม่ได้นิยาม g(x) และ (ข) จำกัดตารางไว้ที่ <b>30 แถว</b></p>
          <p style={{margin:0}}>แก้: <Key>TOOLS</Key> → <code>Table Type</code> → <code>f(x)</code> → <Key>OK</Key> ⇒ ได้ <b>45 แถว</b> <span className="muted">(EN น.96)</span></p>
        </Callout>

        <Callout kind="tip" title="เลข Step ต้องคิดให้ตรงวิธี">
          <NumTable
            headers={["วิธี", "Step ที่ต้องกรอก", "จำนวนแถวที่ได้"]}
            rows={[
              [<span>Trapezoidal <M>n</M> ช่อง</span>, <M>{`h=(b-a)/n`}</M>, <span><M>{`n+1`}</M> จุด</span>],
              [<span>Simpson 1/3 <M>n</M> พาราโบลา</span>, <M>{`h=(b-a)/2n`}</M>, <span><M>{`2n+1`}</M> จุด</span>],
              [<span>ไล่หาช่วงที่มีราก</span>, "1 → 0.1 → 0.01 ไล่ลง", "ดูจุดที่ f เปลี่ยนเครื่องหมาย"],
            ]}
          />
        </Callout>

        <Callout kind="warn" title="สิ่งที่หายเมื่อกด HOME">
          <p style={{margin:0}}>ออกไปแอปอื่นแล้วกลับมา: <b>ข้อมูลตารางหาย + ค่า Table Range หาย</b> (แต่สูตร f(x) ยังอยู่) <span className="muted">(EN น.98)</span> ⇒ ในห้องสอบ อย่าสลับโหมดกลางคันถ้ายังลอกค่าไม่ครบ</p>
        </Callout>
      </Sect>

      {/* ═════════ 4 · EQUATION ═════════ */}
      <Sect tag="4" title="โหมด Equation · Simul / Polynomial / Solver" read="must" min={7}>
        <p>กด <Key>HOME</Key> → <code>Equation</code> → <Key>OK</Key> จะเจอเมนู 3 บรรทัดนี้เท่านั้น <span className="muted">(EN น.100)</span>:</p>
        <p className="mono" style={{margin:"0 0 10px", padding:"8px 12px", background:"var(--bg-soft)", borderRadius:6}}>
          Simul Equation &nbsp;·&nbsp; Polynomial &nbsp;·&nbsp; Solver
        </p>

        <h3>4.1 Simul Equation — ตรวจคำตอบ Gauss / Cramer</h3>
        <Callout title="ลำดับปุ่มเต็ม">
          <CalcSteps steps={[
            <span><code>Simul Equation</code> → <Key>OK</Key></span>,
            <span>เลือก <code>2 Unknowns</code> / <code>3 Unknowns</code> / <code>4 Unknowns</code> → <Key>OK</Key></span>,
            <span>Coefficient Editor เด้งขึ้นเป็นตาราง — กรอกไล่ทีละช่องแล้ว <Key>EXE</Key> ทุกช่อง (แถวละ <M>{`a_1 \\; a_2 \\; a_3 \\; b`}</M>)</span>,
            <span>กรอกครบแล้วกด <Key>EXE</Key> → จอขึ้น <code>x=</code> ค่าแรก</span>,
            <span>กด <Key>▼</Key> (หรือ <Key>EXE</Key>) ดูค่าถัดไป <code>y=</code>, <code>z=</code></span>,
            <span>อยากล้างค่าทั้งตาราง: กด <Key>AC</Key> ตอนอยู่หน้า Coefficient Editor</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>EN น.100 · TH บทที่ 3 หน้า 14–15 · ได้สูงสุด 4 ตัวแปร</p>
        </Callout>
        <Callout kind="warn" title="ข้อสอบสั่ง “จงแสดงวิธีทำ” = ต้องกาง Gauss เอง">
          <p style={{margin:0}}>เครื่องให้แต่คำตอบสุดท้าย ไม่โชว์ขั้นกำจัด ⇒ ใช้มันเป็น<b>ตัวตรวจ</b>หลังทำมือเสร็จ จะได้รู้ทันทีว่าเลขหลุดตรงไหน — ไม่ใช่ใช้แทนการทำ</p>
        </Callout>

        <h3>4.2 Solver — “SOLVE” ตัวจริงของรุ่นนี้</h3>
        <Callout title="ลำดับปุ่มเต็ม (ตัวอย่างคู่มือ: แก้ x² − B/2 = 0 เมื่อ B = 4)">
          <CalcSteps steps={[
            <span><code>Solver</code> → <Key>OK</Key> → จอรับสมการ</span>,
            <span>ถ้าสมการมีตัวแปรอื่น ให้เก็บค่ามันก่อน (<Key>VARIABLE</Key> → เลือก → พิมพ์เลข → <Key>EXE</Key>) แล้วกด <Key>↩</Key> กลับมา</span>,
            <span>พิมพ์สมการ — เครื่องหมาย <code>=</code> กดที่ <Key>CATALOG</Key> → <code>Equation</code> → <code>[=]</code> (หรือปุ่มลัด SHIFT ที่มี = พิมพ์อยู่)</span>,
            <span><Key>EXE</Key> เพื่อลงทะเบียนสมการ</span>,
            <span>หน้า <code>Solve Target</code> ยืนยันว่าเลือก <code>[x]</code> → <Key>OK</Key></span>,
            <span>พิมพ์<b>ค่าเริ่มต้น</b> เช่น <code>1</code> → <Key>EXE</Key> → เลื่อนไป <code>▸Execute</code> → <Key>EXE</Key></span>,
            <span>อ่านผล 3 บรรทัด: ตัวแปรที่แก้ · คำตอบ · <code>L−R</code> (ยิ่งใกล้ 0 ยิ่งแม่น)</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>EN น.105–107</p>
        </Callout>
        <Callout kind="warn" title="Solver ใช้ Newton's method — คู่มือบอกไว้เอง">
          <p style={{margin:"0 0 4px"}}>ผลตามมา 3 ข้อ (EN น.107): มีหลายรากก็คืน<b>ตัวเดียว</b> · ค่าเริ่มต้นไม่ดี = ไม่ลู่เข้า (เปลี่ยนค่าเริ่มแล้วลองใหม่) · สมการทรง <M>{`y=\\sin x`}</M>, <M>{`y=e^x`}</M>, <M>{`y=\\sqrt{x}`}</M> หารากยากเป็นพิเศษ</p>
          <p style={{margin:0}}><b>และมันไม่ใช่คำตอบข้อสอบ</b> — โจทย์ถามค่าที่รอบที่กำหนด Solver ให้รากจริง เช่น <M>{`\\sqrt[4]{13}`}</M>: Bisection 4 รอบได้ 1.906250 แต่ Solver ได้ 1.898829</p>
        </Callout>

        <h3>4.3 Polynomial — รากของพหุนามดีกรี 2–4</h3>
        <Callout title="เร็วกว่า Solver ถ้า f(x) เป็นพหุนามล้วน">
          <CalcSteps steps={[
            <span><code>Polynomial</code> → <Key>OK</Key> → เลือกรูป <code>ax²+bx+c</code> / <code>ax³+…</code> / <code>ax⁴+…</code></span>,
            <span>กรอกสัมประสิทธิ์ทีละตัว → <Key>EXE</Key> ทุกตัว</span>,
            <span><Key>EXE</Key> → ได้รากทุกตัว (รวมรากเชิงซ้อน) กด <Key>▼</Key> ไล่ดู</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>TH บทที่ 3 หน้า 16 — ใช้ตรวจว่ารากที่ Newton/Bisection ของเราวิ่งไปหานั้นถูกตัวไหม</p>
        </Callout>
      </Sect>

      {/* ═════════ 5 · STATISTICS ═════════ */}
      <Sect tag="5" title="โหมด Statistics · Regression" read="later" why="Regression ไม่อยู่ในขอบเขต midterm">
        <Callout title="ลำดับปุ่มเต็ม — Linear Regression">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <code>Statistics</code> → <Key>OK</Key> → เลือก <code>2-Variable</code> → <Key>OK</Key></span>,
            <span>กรอกคอลัมน์ <code>x</code> ทีละค่า คั่นด้วย <Key>EXE</Key></span>,
            <span>เลื่อนไปหัวคอลัมน์ <code>y</code> ด้วย <Key>▼</Key> <Key>▶</Key> แล้วกรอก <code>y</code> ทีละค่า คั่นด้วย <Key>EXE</Key></span>,
            <span>กรอกครบกด <Key>OK</Key> → เมนูเด้ง: <code>2-Var Results</code> / <code>Reg Results</code> / <code>Statistics Calc</code></span>,
            <span>เลือก <code>Reg Results</code> → <Key>OK</Key> → เลือกทรงสมการ <code>y=a+bx</code> → <Key>OK</Key></span>,
            <span>อ่าน <code>a</code> (จุดตัดแกน), <code>b</code> (ความชัน), <code>r</code> (สหสัมพันธ์)</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>EN น.72–73 · TH บทที่ 6 หน้า 35–36 · กรอกได้สูงสุด 45 ค่า (EN น.70)</p>
        </Callout>
        <Callout kind="warn" title="สัญลักษณ์เครื่อง ≠ สัญลักษณ์อาจารย์">
          <p style={{margin:0}}>เครื่อง <code>a</code> = อาจารย์ <M>{`a_0`}</M> (ค่าคงที่) · เครื่อง <code>b</code> = อาจารย์ <M>{`a_1`}</M> (ความชัน) — กลับหัวกับสไลด์บางหน้า ตรวจก่อนลอกลงกระดาษทุกครั้ง</p>
        </Callout>
        <Callout kind="tip" title="ทรง regression อื่นที่เครื่องมีให้">
          <p style={{margin:0}}>เลือกได้จากหน้า <code>Reg Results</code> เดียวกัน: <M>{`y=a+bx`}</M> · <M>{`y=a+bx+cx^2`}</M> · <M>{`y=a+b\\ln x`}</M> · <M>{`y=ae^{bx}`}</M> · <M>{`y=ax^b`}</M> ฯลฯ <span className="muted">(TH หน้า 36)</span> ⇒ Polynomial Regression ดีกรี 2 ไม่ต้องตั้งสมการ normal equations เอง</p>
        </Callout>
      </Sect>

      {/* ═════════ 6 · MATRIX ═════════ */}
      <Sect tag="6" title="โหมด Matrix · det สำหรับ Cramer" read="must" min={6}>
        <p>สร้างได้ 4 เมทริกซ์ (<code>MatA</code>–<code>MatD</code>) ขนาด<b>สูงสุด 4×4</b> <span className="muted">(EN น.114 · TH บทที่ 5)</span> — พอดีกับระบบสมการที่ข้อสอบให้</p>

        <Callout title="สร้างเมทริกซ์">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <code>Matrix</code> → <Key>OK</Key></span>,
            <span>กด <Key>TOOLS</Key> → รายการ <code>[MatA:None]</code> … <code>[MatD:None]</code> ขึ้นมา</span>,
            <span>เลือก <code>[MatA:]</code> → <Key>OK</Key> → ใส่ <code>Row</code> และ <code>Columns</code></span>,
            <span>เลื่อนลงไปที่ <code>[Confirm]</code> → <Key>OK</Key> → เข้าหน้ากรอกสมาชิก</span>,
            <span>กรอกทีละช่อง คั่นด้วย <Key>OK</Key> จนครบ → <Key>AC</Key> กลับหน้าคำนวณ</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>TH หน้า 27 · <b>ไม่ใช่</b> “OPTN → Define Matrix” อย่างที่หน้านี้เคยเขียน</p>
        </Callout>

        <Callout kind="good" title="หา det — หัวใจของ Cramer's rule">
          <CalcSteps steps={[
            <span><Key>CATALOG</Key> → <code>Matrix</code> → <code>Matrix Calc</code> → <code>Determinant</code> → <Key>OK</Key> (จอขึ้น <code>Det(</code>)</span>,
            <span><Key>CATALOG</Key> → <code>Matrix</code> → <code>MatA</code> → <Key>OK</Key></span>,
            <span>ปิดวงเล็บ <code>)</code> → <Key>EXE</Key></span>,
            <span>เก็บผลไว้: <Key>VARIABLE</Key> → <code>[A=]</code> → <code>[Store]</code> ⇒ ใช้เป็นตัวหารของทุก <M>{`x_i`}</M> ได้เลย</span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>TH หน้า 28 · เมนูเดียวกันนี้มี <code>Transposition</code> และ <code>Inverse Matrix</code> อยู่ด้วย</p>
        </Callout>

        <Callout kind="tip" title="เดิน Cramer ให้จบใน 4 นาที">
          <p style={{margin:0}}>สร้าง <code>MatA</code> = เมทริกซ์ต้นฉบับ → หา <M>{`\\det A`}</M> → เก็บลง <code>A</code> · แล้วกลับไปที่ <Key>TOOLS</Key> แก้เฉพาะ<b>คอลัมน์ที่ต้องแทน</b>ด้วยเวกเตอร์ <M>b</M> → หา det ใหม่ → หารด้วย <code>A</code> ⇒ ได้ <M>{`x_1`}</M> · ทำซ้ำทีละคอลัมน์ ไม่ต้องสร้างเมทริกซ์ใหม่ทั้งใบ</p>
        </Callout>
      </Sect>

      {/* ═════════ 7 · SPREADSHEET ═════════ */}
      <Sect tag="7" title="โหมด Spreadsheet · ตาราง iteration" read="later" why="ใช้ได้แต่ช้ากว่าลูป Ans ในห้องสอบ">
        <p>ตารางขนาด <b>5 คอลัมน์ (A–E) × 45 แถว</b> คือ <code>A1</code> ถึง <code>E45</code> <span className="muted">(EN น.87)</span></p>

        <Callout kind="warn" title="ข้อจำกัด 2 ข้อที่ต้องรู้ก่อนพึ่งมัน">
          <ul style={{margin:0}}>
            <li><b>สูตรถูกลบอัตโนมัติเมื่อปิดเครื่องหรือออกจากเมนู</b> — เซฟข้ามรอบไม่ได้ <span className="muted">(TH บทที่ 7 หน้า 39)</span></li>
            <li>สูงสุด 45 แถวต่อคอลัมน์ — n ใหญ่กว่านี้ต้องหั่นทำสองรอบ</li>
          </ul>
        </Callout>

        <Callout title="คำสั่งที่ใช้จริง">
          <CalcSteps steps={[
            <span>กรอกค่าลงช่อง: เลื่อนแถบดำไปช่องนั้น → พิมพ์เลข → <Key>EXE</Key></span>,
            <span>ใส่สูตร: ขึ้นต้นด้วย <code>=</code> เช่น <code>=2A1−3</code></span>,
            <span>คัดสูตรลงหลายช่อง: <Key>TOOLS</Key> → <code>Fill Formula</code> → กรอกช่อง <code>Form</code> (สูตร) และ <code>Range</code> (เช่น <code>B1:B10</code>) → <Key>EXE</Key></span>,
            <span>ผลรวม: <Key>CATALOG</Key> → <code>Spreadsheet</code> → <code>Sum</code> → พิมพ์ช่วง <code>A1:A3</code> → <Key>EXE</Key> · เมนูเดียวกันมี <code>Min(</code> <code>Max(</code> <code>Mean(</code></span>,
          ]}/>
          <p className="muted" style={{fontSize:'0.78rem', margin:"6px 0 0"}}>EN น.92–93 · TH บทที่ 7 · <b>ไม่ใช่</b> “OPTN → Fill Formula”</p>
        </Callout>
        <Callout kind="tip" title="ใช้ทำอะไรคุ้มที่สุด">
          <p style={{margin:0}}>คอลัมน์ A = <M>{`f(x_i)`}</M> ที่ลอกมาจากโหมด Table, คอลัมน์ B = น้ำหนัก (1,2,2,…,1 หรือ 1,4,2,4,…,1), คอลัมน์ C = <code>=A1×B1</code> แล้ว <code>Sum(C1:C…)</code> ⇒ ได้ก้อนในวงเล็บของ Trap/Simpson โดยไม่ต้องบวกมือ</p>
        </Callout>
      </Sect>

      {/* ═════════ 8 · ตั้งค่า ═════════ */}
      <Sect tag="8" title="ตั้งค่าเครื่องก่อนเข้าห้องสอบ" read="must" min={3}>
        <Callout kind="good" title="ทำ 3 อย่างนี้ตอนเช้าวันสอบ">
          <CalcSteps steps={[
            <span><b>หน่วยมุม:</b> <Key>SETTINGS</Key> → <code>Calc Settings</code> → <code>Angle Unit</code> → <code>Radian</code> → <Key>OK</Key> <Key>AC</Key> — จอจะขึ้นตัว <code>R</code> มุมบน <span className="muted">(TH §2.5)</span></span>,
            <span><b>ทศนิยม:</b> <Key>SETTINGS</Key> → <code>Calc Settings</code> → <code>Number Format</code> → <code>Fix</code> → <code>6</code> <span className="muted">(EN น.21)</span></span>,
            <span><b>ล้างของเก่า:</b> <Key>SETTINGS</Key> → <code>Reset</code> → <code>Initialize All</code> → <Key>OK</Key> <span className="muted">(TH §1.5)</span> — แล้วตั้ง Radian/Fix ใหม่</span>,
          ]}/>
        </Callout>
        <Callout kind="tip" title="Fix 6 ปัดแค่ “ที่โชว์” ข้างในยังเต็มความละเอียด">
          <p style={{margin:0}}>คู่มืออังกฤษ น.21: “Calculation results are rounded off to the specified digit <b>before being displayed</b>” ⇒ ตั้ง Fix 6 แล้ววนซ้ำต่อในเครื่องได้เลย ไม่ทำให้ค่าเพี้ยน · แต่ถ้าเรา<b>จดลงกระดาษแล้วพิมพ์กลับเข้าไป</b> ต่างหากที่ค่าจะเพี้ยน — นั่นคือเหตุผลของกฎ “ห้ามคำนวณต่อจากเลขที่ปัดแล้ว”</p>
        </Callout>
        <Callout kind="warn" title="เครื่องดับเอง">
          <p style={{margin:0}}>ไม่แตะ 10 หรือ 60 นาที เครื่องปิดเอง <span className="muted">(TH §1.2)</span> — ตัวแปรกับ Ans ยังอยู่ แต่<b>สูตร Spreadsheet หาย</b> ⇒ ถ้าใช้ Spreadsheet ต้องทำจนจบข้อรวดเดียว</p>
        </Callout>
      </Sect>

      {/* ═════════ ✸ · แผนใช้ต่อบท ═════════ */}
      <Sect tag="✸" title="แผนใช้เครื่องต่อบท (ตามขอบเขต midterm)" read="must" min={5}>
        <NumTable
          headers={["โจทย์ให้ทำ", "ใช้โหมดไหน", "ท่ากด", "ตรวจด้วย"]}
          rows={[
            ["Trapezoidal / Simpson",
             "Table",
             <span>FUNCTION→Define f(x) → TOOLS→Table Range → ลอก <M>{`f(x_i)`}</M></span>,
             <span>CATALOG→∫ (ค่าจริง → คิด <M>{`\\varepsilon_t`}</M>)</span>],
            ["Numerical Differentiation",
             "Calculate",
             <span>เก็บ <M>{`f(x_{i-1}), f(x_i), f(x_{i+1})`}</M> ลง A/B/C แล้วพิมพ์สูตรทีเดียว</span>,
             <span>CATALOG→d/dx</span>],
            ["Bisection / False Position",
             "Table + Calculate",
             <span>Table หาช่วงที่ f เปลี่ยนเครื่องหมาย → แล้วเก็บ a,b ลง A,B วนมือ</span>,
             "Equation→Solver หรือ Polynomial"],
            ["Newton-Raphson / Secant / One-point",
             "Calculate",
             <span>เก็บ <M>{`x_0`}</M> ลง x → พิมพ์สูตร → <Key>◀</Key> <Key>EXE</Key> วน</span>,
             "Equation→Solver"],
            ["Cramer's rule",
             "Matrix",
             <span>TOOLS→MatA → CATALOG→Matrix Calc→Determinant</span>,
             "Equation→Simul Equation"],
            ["Gauss elimination",
             "Calculate",
             <span>เก็บตัวคูณ <M>{`m_{ij}`}</M> ลงตัวแปร อย่าจดเลขที่ปัดแล้ว</span>,
             "Equation→Simul Equation"],
          ]}
        />
        <Callout kind="warn" title="กฎเหล็กข้อเดียวที่ต้องจำ">
          <p style={{margin:0}}>ทุกอย่างในคอลัมน์ “ตรวจด้วย” ให้ <b>ค่าจริง / คำตอบสุดท้าย</b> ส่วนข้อสอบถาม <b>ค่าประมาณ ณ รอบที่กำหนด</b> — ลอกไปตอบ = ผิด เพราะตรวจแค่คำตอบ ผิดคือ 0 · ใช้มันดูว่าเรา<b>เดินเข้าหา</b>ค่าจริงหรือวิ่งออกห่างเท่านั้น</p>
        </Callout>
      </Sect>

      {/* ═════════ ∑ · QUICK REF ═════════ */}
      <Sect tag="∑" title="Quick Reference — เปิดหน้านี้หน้าเดียวก็พอ" read="must" min={2}>
        <NumTable
          headers={["อยากทำ", "กดตามนี้"]}
          rows={[
            ["เก็บผลลัพธ์ลง A", <span><Key>EXE</Key> → <Key>VARIABLE</Key> → [A=] → [Store]</span>],
            ["เก็บตัวเลขลง A (เร็ว)", <span><Key>VARIABLE</Key> → เลื่อนไป [A=] → พิมพ์เลข → <Key>EXE</Key></span>],
            ["พิมพ์ A ในสูตร", <span><Key>SHIFT</Key> <Key>4</Key></span>],
            ["รันสูตรเดิมซ้ำ", <span><Key>◀</Key> → <Key>EXE</Key></span>],
            ["∫ ค่าจริง", <span><Key>CATALOG</Key> → Func Analysis → Integration(∫)</span>],
            ["d/dx", <span><Key>CATALOG</Key> → Func Analysis → Derivative(d/dx)</span>],
            ["Σ", <span><Key>CATALOG</Key> → Func Analysis → Summation(Σ)</span>],
            ["ตาราง f(x)", <span><Key>FUNCTION</Key> → Define f(x) · แล้ว <Key>TOOLS</Key> → Table Range</span>],
            ["ตาราง 45 แถว", <span><Key>TOOLS</Key> → Table Type → f(x)</span>],
            ["แก้ระบบสมการ", <span><Key>HOME</Key> → Equation → Simul Equation</span>],
            ["หาราก (Newton ในเครื่อง)", <span><Key>HOME</Key> → Equation → Solver</span>],
            ["รากพหุนาม", <span><Key>HOME</Key> → Equation → Polynomial</span>],
            ["det(MatA)", <span><Key>CATALOG</Key> → Matrix → Matrix Calc → Determinant</span>],
            ["สร้าง MatA", <span><Key>TOOLS</Key> → [MatA:] → ขนาด → Confirm</span>],
            ["Sum ในสเปรดชีท", <span><Key>CATALOG</Key> → Spreadsheet → Sum</span>],
            ["คัดสูตรลงหลายช่อง", <span><Key>TOOLS</Key> → Fill Formula</span>],
            ["ทศนิยม 6 ตำแหน่ง", <span><Key>SETTINGS</Key> → Calc Settings → Number Format → Fix → 6</span>],
            ["เปลี่ยนหน่วยมุม", <span><Key>SETTINGS</Key> → Calc Settings → Angle Unit</span>],
            ["สลับเศษส่วน ↔ ทศนิยม", <span><Key>FORMAT</Key> → Decimal / Standard</span>],
          ]}
        />
        <Callout kind="tip" title="ที่มาของทุกบรรทัดในหน้านี้">
          <p style={{margin:0}}>
            <b>[TH]</b> คู่มือ CASIO CLASSWIZ fx-991CW ภาษาไทย (13 บท 74 หน้า) — <code>~/Downloads/fx-991cw-manual.pdf</code><br/>
            <b>[EN]</b> fx-570CW/fx-991CW User&rsquo;s Guide ฉบับ CASIO global (151 หน้า)<br/>
            อะไรที่คู่มือทั้งสองเล่มไม่ได้เขียน ถูกตัดออกจากหน้านี้แล้ว (เช่นอัลกอริทึมภายในของปุ่ม ∫) — ถ้าจะเพิ่มอะไรกลับเข้ามา ต้องอ้างหน้าคู่มือได้
          </p>
        </Callout>
      </Sect>
    </div>
  );
}

window.CalculatorLesson = CalculatorLesson;
