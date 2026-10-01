// Cheat Sheet & Speed Tricks — สรุปสูตรทุกบท + decision tree + common mistakes

function CheatLesson() {
  return (
    <div>
      <Hero
        kicker="⚡ · Speed Tricks"
        title="Cheat Sheet & Speed Tricks"
        lead="สรุปสูตรครบทุกบทในหน้าเดียว + Decision tree เลือก method + กับดักที่ออกข้อสอบบ่อย · เรียงใหม่แล้ว — 5 บทที่ออกไฟนอลอยู่บนสุด ส่วน 3 บทที่สอบมิดไปแล้วย้ายลงไปเป็นหมวด “ทวน” ท้ายหน้า"
        meta={["5 บทไฟนอลอยู่บนสุด", "Decision tree", "Top 22 mistakes", "Print-ready"]}
      />

      <Callout kind="good" title="📍 เรียงใหม่ 9 ก.ย. — 5 บทที่ออก‍ไฟนอลอยู่บนสุด (01–05)">
        <p style={{margin:"0 0 6px"}}><b>01 Linear Systems → 02 Interpolation → 03 Spline → 04 Regression → 05 Conjugate Gradient</b> · ตามด้วยกับดัก + speed tricks + เช็คลิสต์ก่อนเข้าห้องสอบ · <b>3 บทที่สอบมิดไปแล้ว (Integration · Differentiation · Root Finding) ถูกย้ายลงไปท้ายหน้าเป็นหมวด “ทวน”</b> — ยังต้องอ่าน แต่ไม่ใช่ทางหลักแล้ว</p>
        <p style={{margin:0}}>กด <Key>Ctrl/Cmd</Key> + <Key>P</Key> เพื่อพิมพ์ออกมาทบทวนก่อนสอบ (CSS ปรับให้อ่านได้บนกระดาษ) · <span style={{color:"var(--yellow)"}}>แต่<b>เอากระดาษเข้าห้องสอบไม่ได้</b> — พิมพ์ไว้ทวนก่อนเข้าเท่านั้น</span></p>
      </Callout>


      {/* DECISION TREE */}
      <Sect tag="🌳" title="Decision Tree · เห็นโจทย์ปุ๊บ เลือก method ทันที">
        <DecisionTree/>
      </Sect>

      <Sect tag="01" title="Linear Systems · Cheat Sheet — 7 วิธีที่ออกไฟนอล">
        <Callout kind="danger" title="⚠︎ อ่านก่อน — บทนี้เปลี่ยนขอบเขตไปแล้ว 2 รอบ">
          <p style={{margin:"0 0 6px"}}>ตอนเตรียมมิดเทอมเขียนไว้ว่า &ldquo;ออกแค่ Cramer กับ Gauss · Jordan/Inversion/LU/Cholesky ตัดออก&rdquo; — <b>ตอนนี้กลับด้านหมด</b></p>
          <p style={{margin:0}}>kim ยืนยัน 9 ก.ย. ว่าข้อสอบมิดออก Linear <b>แค่ Cramer&rsquo;s Rule อย่างเดียว</b> ⇒ ตามกฎ &ldquo;ไฟนอล = เรื่องที่ไม่ออกมิด&rdquo; + <b><code>การบ้าน6-7.pdf</code> ข้อ 1.2–1.8</b> ⇒ <b>ไฟนอลออก 7 วิธี: Gauss Elimination · Gauss-Jordan · Matrix Inversion · LU · Cholesky · Jacobi · Gauss-Seidel</b> · เฉลยเต็มบนระบบเดียวกันอยู่ที่บท <a href="#linear">Linear Systems</a> หมวด 📮</p>
        </Callout>

        <div className="cheat-card">
          <h4>① Gauss Elimination <span className="tag green">⭐ ออกไฟนอล · โครงแม่ของทุกวิธี</span></h4>
          <ol>
            <li>Forward: <M>{`R_i \\leftarrow R_i - (a_{ik}/a_{kk}) R_k`}</M> ทำทุก i &gt; k → ได้ Upper Triangular</li>
            <li>Back-sub: <M>{`x_i = (b_i - \\sum_{j>i} a_{ij}x_j)/a_{ii}`}</M> ไล่จากแถวล่างขึ้นบน</li>
          </ol>
          <ul>
            <li><b>pivot = 0 ต้องสลับแถวก่อน</b> ไม่งั้นหารด้วยศูนย์</li>
            <li><M>{`\\det A=(-1)^{k}\\times`}</M> ผลคูณตัวหลัก · <M>k</M> = จำนวนครั้งที่สลับแถว — <b>ลืม <M>{`(-1)^k`}</M> = เครื่องหมายผิด</b></li>
            <li>ใช้ได้ทุกขนาด <b>และเมทริกซ์ไม่จัตุรัส</b> ต่างจาก Cramer</li>
            <li>โค้ด: จุดตายคือ <code>for j in range(k, <b>n+1</b>)</code> — ลืม +1 คอลัมน์ <M>b</M> ไม่อัปเดต</li>
          </ul>

          <h4>② Gauss-Jordan <span className="tag green">⭐ ออกไฟนอล · การบ้าน 6-7 ข้อ 1.3</span></h4>
          <ul>
            <li>= Gauss + <b>2 อย่างเพิ่ม</b>: (ก) หารแถว pivot ด้วย <M>{`a_{kk}`}</M> ให้ตัวหลักเป็น 1 (ข) กำจัด<b>ข้างบนด้วย</b> ไม่ใช่แค่ข้างล่าง</li>
            <li>ลูปเปลี่ยนจาก <code>for i in range(k+1, n)</code> เป็น <code>for i in range(n): if i != k</code></li>
            <li>จบแล้วได้ Identity ⇒ <b>อ่านคำตอบจากคอลัมน์ b ได้เลย ไม่ต้อง back-substitute</b></li>
            <li>จุดตาย: <b>ลืม normalize</b> ⇒ ได้แค่ diagonal ไม่ใช่ identity ⇒ ต้องหารทีหลัง ไม่งั้นคำตอบผิดหมด</li>
          </ul>

          <h4>③ Matrix Inversion <span className="tag green">⭐ ออกไฟนอล · การบ้าน 6-7 ข้อ 1.4</span></h4>
          <ul>
            <li>ต่อ augment <M>{`[A \\mid I]`}</M> → ทำ Gauss-Jordan ทั้งแถบ → ได้ <M>{`[I \\mid A^{-1}]`}</M> → <M>{`x = A^{-1}b`}</M></li>
            <li>2×2 มีสูตรลัด: <M>{`A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix} d & -b \\\\ -c & a\\end{bmatrix}`}</M></li>
            <li>จุดตายในโค้ด: ลูปคอลัมน์ต้องวิ่งถึง <b>2n</b> ไม่ใช่ n (ไม่งั้นครึ่งขวาไม่ถูกอัปเดต)</li>
            <li>ตรวจฟรี: <M>{`A\\cdot A^{-1} = I`}</M> · <M>{`\\det A = 0`}</M> ⇒ ไม่มี inverse ⇒ วิธีนี้ใช้ไม่ได้</li>
          </ul>

          <h4>④ LU Decomposition (Doolittle) <span className="tag green">⭐ ออกไฟนอล · การบ้าน 6-7 ข้อ 1.5</span></h4>
          <ul>
            <li><M>{`A = LU`}</M> · <b>Doolittle:</b> แนวทแยงของ <M>L</M> เป็น 1 · <b>Crout:</b> แนวทแยงของ <M>U</M> เป็น 1 (ต่างกันแค่นี้)</li>
            <li><M>U</M> = ผลลัพธ์ของ forward elimination · <M>{`L_{ik}`}</M> = <b>ตัวคูณ</b> <M>{`a_{ik}/a_{kk}`}</M> ที่ใช้กำจัด</li>
            <li>แก้ 2 ขั้น: <M>{`Ly = b`}</M> (forward sub, ไล่ลง) แล้ว <M>{`Ux = y`}</M> (back sub, ไล่ขึ้น)</li>
            <li><b>จุดตายอันดับ 1:</b> ต้อง<b>เก็บ</b> <code>L[i][k] = factor</code> <b>ก่อน</b>เอา factor ไปกำจัดแถว — เขียนสลับลำดับ = L ผิดทั้งตัว</li>
            <li>คุ้มตรงไหน: แยก LU ครั้งเดียว แล้วเปลี่ยน <M>b</M> กี่ชุดก็ใช้ซ้ำได้ ต่างจาก Gauss ที่ต้องทำใหม่ทุกครั้ง</li>
          </ul>

          <h4>⑤ Cholesky <span className="tag green">⭐ ออกไฟนอล · การบ้าน 6-7 ข้อ 1.6</span></h4>
          <ul>
            <li><M>{`A = LL^{T}`}</M> — <b>ใช้ได้เฉพาะ symmetric positive definite</b> (ต้องเช็ค <M>{`A = A^{T}`}</M> ก่อนเสมอ)</li>
            <li>แนวทแยง: <M>{`L_{jj}=\\sqrt{a_{jj}-\\sum_{k<j} L_{jk}^{2}}`}</M></li>
            <li>ใต้แนวทแยง: <M>{`L_{ij}=\\dfrac{a_{ij}-\\sum_{k<j} L_{ik}L_{jk}}{L_{jj}}`}</M></li>
            <li>แก้ 2 ขั้นเหมือน LU เป๊ะ: <M>{`Ly=b`}</M> แล้ว <M>{`L^{T}x=y`}</M> ⇒ <b>เขียนฟังก์ชัน substitution ครั้งเดียว ใช้ได้ทั้ง LU และ Cholesky</b></li>
            <li>จุดตาย: ถ้าใต้ <M>{`\\sqrt{\\ }`}</M> <b>ติดลบ</b> = ไม่ positive definite ⇒ วิธีนี้ใช้ไม่ได้ ต้องเปลี่ยนไป LU</li>
          </ul>

          <h4>⑥⑦ Jacobi &amp; Gauss-Seidel <span className="tag green">⭐ ออกไฟนอล · การบ้าน 6-7 ข้อ 1.7–1.8</span></h4>
          <MB>{`x_i^{\\text{new}}=\\frac{1}{a_{ii}}\\Big(b_i-\\sum_{j\\neq i} a_{ij}x_j\\Big)`}</MB>
          <ul>
            <li><b>ต่างกันบรรทัดเดียว:</b> <b>Jacobi</b> ใช้ <M>{`x^{\\text{old}}`}</M> ทั้งรอบ (คำนวณครบแล้วค่อยเปลี่ยน) · <b>Gauss-Seidel</b> ใช้ค่าใหม่<b>ทันที</b>ที่คำนวณได้ ⇒ ลู่เข้าเร็วกว่าราวเท่าตัว</li>
            <li>ในโค้ด Jacobi ต้องมี <code>x_new = x[:]</code> แยกลิสต์ · Gauss-Seidel เขียนทับ <code>x[i]</code> ได้เลย</li>
            <li><b>เงื่อนไขลู่เข้า:</b> diagonally dominant <M>{`|a_{ii}| > \\sum_{j\\neq i}|a_{ij}|`}</M> ทุกแถว — <b>ถ้าไม่ผ่าน ให้สลับแถวก่อน</b> ไม่งั้นลู่ออกไม่มีวันหยุด</li>
            <li>หยุดเมื่อ <M>{`\\max|x^{\\text{new}}-x^{\\text{old}}| < tol`}</M> · อาจารย์ใช้ <M>{`tol = 0.001`}</M> เป็นปกติ</li>
            <li><b>จุดตายที่เสียคะแนนจริง:</b> เขียน <code>for k in range(20)</code> แทน <code>while</code> — <b>อาจารย์หักเพราะลูปต้องหยุดด้วย tolerance ไม่ใช่จำนวนรอบ</b></li>
          </ul>

          <h4>เมทริกซ์ไม่จัตุรัส (สมการ ≠ ตัวแปร)</h4>
          <ul>
            <li><b>สมการน้อยกว่าตัวแปร</b> → คำตอบไม่จำกัด ⇒ ตอบเป็นรูป parametric (ให้ตัวแปรอิสระ)</li>
            <li><b>สมการมากกว่าตัวแปร</b> → มักไม่มีคำตอบ (ขัดกันเอง) ⇒ Gauss จะโผล่แถว <M>{`0=c`}</M> ที่ <M>{`c\\neq0`}</M></li>
            <li>หา det ไม่ได้ ⇒ <b>Cramer / LU / Cholesky ใช้ไม่ได้ทั้งหมด</b> เหลือแต่ Gauss</li>
          </ul>

          <h4>Cramer&rsquo;s Rule <span className="tag">ออกมิดไปแล้ว · ไว้ตรวจคำตอบ</span></h4>
          <MB>{`x_i=\\frac{\\det A_i}{\\det A}\\quad\\text{โดย } A_i = A \\text{ ที่แทนคอลัมน์ที่ } i \\text{ ด้วย } b`}</MB>
          <ul>
            <li>ใช้ได้แค่ 2×2 กับ 3×3 (อาจารย์บอกเอง &ldquo;4×4 ไม่ทำ · n×n ไม่ทำ&rdquo;) · เมทริกซ์ต้องจัตุรัส</li>
            <li><b>ค่าที่แท้จริงตอนนี้ = ตัวตรวจคำตอบ</b> — ทำ Gauss/LU เสร็จแล้วกด det ในเครื่องเช็คซ้ำได้เร็ว ๆ (ผิด=0 ⇒ ตรวจด้วยวิธีที่สองคุ้มเสมอ)</li>
            <li>ตรวจฟรีอีกทาง: <M>{`\\det A = `}</M> ผลคูณตัวหลักหลังทำ Gauss</li>
          </ul>
        </div>

        <Callout kind="tip" title="⭐ 7 วิธี แต่มีแค่ 4 โครงโค้ด">
          <p style={{margin:0}}><b>E</b> Gauss = โครงแม่ · <b>F</b> Jordan/Inversion = E + normalize + กำจัดข้างบน · <b>G</b> LU/Cholesky = E ที่เก็บตัวคูณไว้ แล้วใช้ substitution ชุดเดียวกัน · <b>J</b> Jacobi/Gauss-Seidel = รูปเดียวกับ open method ของบท Root · ⇒ ซ้อมที่หน้า <a href="#code">เขียนโค้ดจากหัว</a></p>
        </Callout>
      </Sect>
      <Sect tag="02" title="Interpolation · Cheat Sheet">
        <div className="cheat-card">
          <h4>Newton's Divided Difference</h4>
          <MB>{`f(x) = c_0 + c_1(x-x_0) + c_2(x-x_0)(x-x_1) + \\cdots`}</MB>
          <p>ค่าสัมประสิทธิ์ <M>c_i</M> อ่านจาก<b>คอลัมน์บนสุด</b>ของตาราง DD</p>

          <h4>Lagrange</h4>
          <MB>{`f(x) = \\sum_i L_i(x) y_i, \\quad L_i(x) = \\prod_{j \\neq i} \\frac{x - x_j}{x_i - x_j}`}</MB>
          <p><b>ทริค:</b> "ตัวบน = x ตรงข้าม, ตัวล่าง = ตัวเรา"</p>

          <h4>n+1 จุด → polynomial degree n สูงสุด</h4>
          <ul>
            <li>2 จุด → linear</li>
            <li>3 จุด → quadratic</li>
            <li>n+1 จุด → degree n (มี polynomial เดียว — Newton = Lagrange)</li>
          </ul>
        </div>
      </Sect>

      <Sect tag="03" title="Spline · Cheat Sheet">
        <div className="cheat-card">
          <h4>Linear Spline</h4>
          <MB>{`f_i(x) = y_i + m_i(x - x_i), \\quad m_i = \\frac{y_{i+1} - y_i}{x_{i+1} - x_i}`}</MB>

          <h4>Quadratic Spline (n ช่วง → 3n unknowns)</h4>
          <p>เงื่อนไข: ผ่านจุด (2n) + slope ต่อเนื่อง (n−1) + ปิด a₁ = 0 (1) = 3n สมการ</p>

          <h4>Cubic Spline (n ช่วง → 4n unknowns)</h4>
          <p>เงื่อนไข: ผ่านจุด (2n) + slope (n−1) + curvature (n−1) + Natural f''(x₀) = f''(xₙ) = 0 (2) = 4n สมการ</p>

          <Callout title="ทริคจำ continuity">
            <ul>
              <li>Linear: C⁰ (ต่อเนื่องค่าเท่านั้น)</li>
              <li>Quadratic: C¹ (ค่า + slope)</li>
              <li>Cubic: C² (ค่า + slope + curvature)</li>
            </ul>
          </Callout>
        </div>
      </Sect>

      <Sect tag="04" title="Regression · Cheat Sheet">
        <div className="cheat-card">
          <h4>Linear: <M>{`y = a_0 + a_1 x`}</M></h4>
          <MB>{`a_1 = \\frac{n\\sum xy - \\sum x \\sum y}{n\\sum x^2 - (\\sum x)^2}, \\quad a_0 = \\frac{\\sum y - a_1 \\sum x}{n}`}</MB>

          <h4>Polynomial degree m</h4>
          <p>Normal Equations: matrix (m+1)×(m+1)</p>
          <MB>{`A_{ij} = \\sum x^{i+j-2},\\quad b_i = \\sum x^{i-1} y`}</MB>

          <h4>R² (coefficient of determination)</h4>
          <MB>{`R^2 = 1 - \\frac{SS_{\\text{res}}}{SS_{\\text{tot}}} = 1 - \\frac{\\sum(y_i - \\hat y_i)^2}{\\sum(y_i - \\bar y)^2}`}</MB>
          <p>R² ใกล้ 1 → fit ดี, ใกล้ 0 → fit แย่</p>

          <h4>Linearization tricks</h4>
          <ul>
            <li><M>{`y = a e^{bx}`}</M> → <M>{`\\ln y = \\ln a + bx`}</M> (linear in (x, ln y))</li>
            <li><M>{`y = a x^b`}</M> → <M>{`\\ln y = \\ln a + b \\ln x`}</M> (linear in (ln x, ln y))</li>
            <li><M>{`y = 1/(a + bx)`}</M> → <M>{`1/y = a + bx`}</M></li>
          </ul>
        </div>
      </Sect>

      <Sect tag="05" title="Conjugate Gradient · Cheat Sheet">
        <div className="cheat-card">
          <h4>Initial (k = 0)</h4>
          <MB>{`r^{(0)} = Ax^{(0)} - b, \\quad d^{(0)} = -r^{(0)}`}</MB>

          <h4>วน loop</h4>
          <MB>{`\\alpha_k = -\\frac{r^T d}{d^T A d}, \\quad x^{(k+1)} = x^{(k)} + \\alpha_k d^{(k)}`}</MB>
          <MB>{`r^{(k+1)} = Ax^{(k+1)} - b, \\quad \\beta_k = \\frac{r^{(k+1) T} A d^{(k)}}{d^{(k) T} A d^{(k)}}`}</MB>
          <MB>{`d^{(k+1)} = -r^{(k+1)} + \\beta_k d^{(k)}`}</MB>

          <p><b>ต้องการ:</b> A สมมาตร + positive definite | <b>หยุดเมื่อ:</b> <M>{`\\|r\\| < \\text{tol}`}</M> | <b>ลู่เข้าใน:</b> n iterations</p>
        </div>
      </Sect>

      <Sect tag="❌" title="Top 22 พลาดบ่อย — อย่าทำซ้ำ!">
        <div className="grid-2">
          <Callout kind="danger" title="Root Finding">
            <ol>
              <li>ใช้ <M>{`(x_{new} - x_{old})/x_{old}`}</M> เป็น error → ผิด! ต้อง <M>{`/x_{new}`}</M></li>
              <li>Newton ลืม diff สูตร = x − f(x)·f'(x) (แทน x − f/f')</li>
              <li>Bisection ตั้ง b ← m แล้วลืมอัพเดท f(b) → คำนวณรอบถัดไปผิด</li>
              <li>One-point ไม่เช็ค <M>{`|g'|<1`}</M> → ลู่ออก</li>
            </ol>
          </Callout>
          <Callout kind="danger" title="Linear Systems">
            <ol start={5}>
              <li>Gauss ลืม update column ของ b (เก็บแค่ matrix A)</li>
              <li>Gauss-Seidel ใช้ค่าเก่าหมด (= ทำ Jacobi)</li>
              <li>Jacobi กับ matrix ไม่ diagonal dominant → ลู่ออก</li>
              <li>ลืม pivot ตอนเจอ <M>a_{`kk`}</M> = 0 → หารด้วย 0</li>
            </ol>
          </Callout>
          <Callout kind="danger" title="Interpolation / Spline">
            <ol start={9}>
              <li>Lagrange Lᵢ สลับตัวบน/ล่าง (เครื่องหมายผิด)</li>
              <li>Newton DD ใช้ค่า cᵢ จากแถวกลาง แทนแถวบนสุด</li>
              <li>Linear Spline ใช้ <M>m_i</M> ของช่วงผิด</li>
              <li>Quadratic Spline ลืมเขียนสมการ "slope ต่อเนื่อง"</li>
            </ol>
          </Callout>
          <Callout kind="danger" title="Regression">
            <ol start={13}>
              <li>Normal Equation matrix สมมาตร แต่กรอกไม่ตรง (สลับ row/col)</li>
              <li>เครื่องคิดเลข a, b ตรงข้ามกับสไลด์ <M>a_0, a_1</M> → ตอบสลับ</li>
              <li>Linearize <M>{`y = ae^{bx}`}</M> ลืม <M>\ln</M> y ก่อน fit</li>
            </ol>
          </Callout>
          <Callout kind="danger" title="Integration">
            <ol start={16}>
              <li>Composite Simpson: จำนวน<em>ช่องย่อยเป็นคี่</em> → ใช้ไม่ได้! (จับพาราโบลาไม่ลงตัว — ต้องจุดข้อมูลเป็นเลขคี่)</li>
              <li>Simpson น้ำหนักผิด pattern (1, 4, 2, 4, ..., 4, 1)</li>
              <li>คำนวณ h ผิด — สำหรับ Simpson single, h = (b−a)/2</li>
            </ol>
          </Callout>
          <Callout kind="danger" title="Differentiation">
            <ol start={19}>
              <li>Central สูตรลืมหารด้วย <em>2h</em> (เผลอหารด้วย h)</li>
              <li>h เล็กไป (10⁻¹⁰) → round-off error ใหญ่กว่า truncation</li>
              <li>โจทย์สั่ง O(h²) แต่ใช้สูตรชุดธรรมดา O(h) → ผิดทั้งข้อ (ดู Big-O ในโจทย์!)</li>
              <li>สูตร error สลับตัวหาร — “เทียบค่าจริง” ต้องหารด้วย<em>ค่าจริง</em> ไม่ใช่ค่าที่หาได้</li>
            </ol>
          </Callout>
        </div>
      </Sect>

      {/* SPEED TRICKS */}
      <Sect tag="⚡" title="Speed Tricks · ทำเร็วกว่าเดิม 3 เท่า">
        <Callout kind="tip" title="🎯 Trick 1 — Iteration ในเครื่อง Calculator">
          <p>หลังพิมพ์สูตรแล้วได้คำตอบ — กด <Key>◀</Key> <Key>EXE</Key> ซ้ำ ๆ เพื่อทำ iter ถัดไปทันที</p>
          <p>เช่น Newton: <code>Ans − (Ans² − 7)/(2·Ans)</code> → <Key>EXE</Key> ครั้งแรกได้ x₁ จากนั้น <Key>◀</Key> <Key>EXE</Key> อีก 3 รอบ = 4 iterations</p>
        </Callout>

        <Callout kind="tip" title="🎯 Trick 2 — Bisection Phase">
          <p>ใช้ Table mode 3 phase: Step 1, 0.1, 0.01 → ได้ทศนิยม 2 หลักใน 30 วินาที (เทียบกับทำมือ 10 iter = 5 นาที)</p>
        </Callout>

        <Callout kind="tip" title="🎯 Trick 3 — Lagrange Lᵢ ใน 5 วินาที">
          <p>ตัวล่าง = ใช้ <M>x_i</M> แทน x ในสูตรของ Lᵢ → ได้ <em>ค่าคงที่</em></p>
          <p>คำนวณตัวล่างก่อนทั้งหมด → แค่หา (x − xⱼ) ตอนต้องการ — เร็วกว่าคำนวณ Lᵢ ทั้งสูตรทุกครั้ง</p>
        </Callout>

        <Callout kind="tip" title="🎯 Trick 4 — Regression ใช้เครื่องเสมอ">
          <p>โจทย์ Linear/Quad/Cubic Regression — กรอก stats mode ใช้เวลา 1 นาทีได้คำตอบ — เทียบกับตั้ง Normal Equation + Gauss = 10 นาที</p>
        </Callout>

        <Callout kind="tip" title="🎯 Trick 5 — Simpson Pattern">
          <p>ใช้ Spreadsheet mode เก็บ weight (1, 4, 2, 4, ..., 4, 1) ใน col A และ f(xᵢ) ใน col B → <code>=SUM(A·B)·h/3</code> = คำตอบ</p>
        </Callout>

        <Callout kind="tip" title="🎯 Trick 6 — Memory ช่วยจำ">
          <ul>
            <li>"<b>BFC</b>" — Bisection / False Position / Central need <b>2 จุด</b></li>
            <li>"<b>NTI</b>" — Newton / Taylor / Iteration need <b>1 จุด</b></li>
            <li>"<b>1421</b>" — Simpson น้ำหนัก: 1, 4, 2, 1 (ที่ปลาย)</li>
            <li>"<b>cubic = C²</b>" — Cubic Spline ต่อเนื่องถึง 2nd derivative</li>
          </ul>
        </Callout>
      </Sect>

      {/* TIME PLAN */}
      <Sect tag="⏱" title="Time Plan · 3 ชั่วโมงในห้องสอบ">
        <NumTable
          headers={["เวลา (นาที)","ทำอะไร", "ทำไม"]}
          rows={[
            ["0-5", "อ่านทุกข้อ จัดลำดับ", "หาข้อง่าย ๆ ทำก่อน"],
            ["5-30", "ข้อง่ายที่จำสูตรได้ (Bisection, Trapezoidal)", "เก็บคะแนนแน่ ๆ"],
            ["30-70", "ข้อปานกลาง (Newton, Gauss, Interp)", "ใช้เครื่องคิดเลขให้คุ้ม"],
            ["70-120", "ข้อยาก (Regression, Spline, CG)", "แสดงสูตรก่อน อย่างน้อยได้คะแนนเขียนสูตร"],
            ["120-150", "ข้อ Programming + พิสูจน์", "เขียน pseudo-code ก่อนแล้วค่อยขัด Python"],
            ["150-170", "ตรวจคำตอบ + ดู error %", "อย่างน้อย 2 ข้อก่อนหมดเวลา"],
            ["170-180", "เขียน buffer + ดูข้อที่ทิ้งไว้", "เผื่อข้อสุดท้าย"],
          ]}
        />
      </Sect>

      {/* FINAL ENCOURAGEMENT */}
      <Sect tag="🏆" title="ก่อนเข้าห้องสอบ">
        <Callout kind="good">
          <p style={{fontSize:'0.889rem', marginTop:0}}>เช็คลิสต์สุดท้าย:</p>
          <ul>
            <li>เครื่องคิดเลข <b>fx-991CW</b> เปิดเครื่องดู battery + Reset Memory</li>
            <li>ตั้ง <code>Angle Unit = Radian</code> และ <code>Fix 6</code> ทศนิยม</li>
            <li>พกดินสอ 2 แท่ง + ยางลบ + ปากกาเขียนคำตอบสุดท้าย</li>
            <li>ทบทวน Decision Tree + Top 20 mistakes ในใจ</li>
            <li>นอนเต็มที่คืนก่อนสอบ — สมอง<em>คิดได้</em>ตอนเช้า</li>
          </ul>
          <p style={{fontSize:'0.889rem', marginBottom:0}}>ขอให้สอบผ่านสบายเลยครับ 🎓✨</p>
        </Callout>
      </Sect>

      <Callout kind="tip" title="⬇︎ ข้างล่างนี้คือ 3 บทที่สอบมิดไปแล้ว — ไว้ทวน ไม่ใช่ทางหลัก">
        <p style={{margin:0}}>Integration · Differentiation · Root Finding ออกมิดเทอมไปแล้ว 21 ส.ค. ⇒ <b>ตามกฎ “ไฟนอล = เรื่องที่ไม่ออกมิด” จึงไม่ใช่ขอบเขตหลัก</b> · <b>แต่ห้ามลืมสนิท</b> — ข้อสอบมิดพิสูจน์แล้วว่าอาจารย์ชอบ<b>ต่อสองบท</b>เข้าด้วยกัน (ข้อที่ให้ผลลัพธ์ Trap/Simpson มาแล้วหา x ย้อนกลับ จริง ๆ คือ Root Finding) ⇒ กวาดสัปดาห์ละครั้ง สัปดาห์สุดท้ายอ่านอีกรอบ</p>
      </Callout>


      <Sect tag="ทวน" title="Integration · Cheat Sheet">
        <div className="cheat-card">
          <h4>Trapezoidal (single)</h4>
          <MB>{`I = \\frac{h}{2}[f(a) + f(b)], \\quad h = b - a`}</MB>

          <h4>Composite Trapezoidal (n ช่วง)</h4>
          <MB>{`I = \\frac{h}{2}\\left[f(x_0) + f(x_n) + 2\\sum_{i=1}^{n-1} f(x_i)\\right], \\quad h = \\frac{b-a}{n}`}</MB>

          <h4>Simpson 1/3 (single, 3 จุด)</h4>
          <MB>{`I = \\frac{h}{3}[f(a) + 4f(m) + f(b)], \\quad h = \\frac{b-a}{2}`}</MB>

          <h4>Composite Simpson 1/3 (n พาราโบลา → 2n ช่วง)</h4>
          <MB>{`I = \\frac{h}{3}\\left[f(x_0) + f(x_{2n}) + 4\\sum_{i \\text{ คี่}} f(x_i) + 2\\sum_{i \\text{ คู่}} f(x_i)\\right], \\quad h = \\frac{b-a}{2n}`}</MB>
          <p>Pattern น้ำหนัก: <b>1, 4, 2, 4, 2, 4, ..., 4, 1</b> · <M>n</M> = จำนวนพาราโบลา (ช่องย่อย = 2n เป็นคู่เสมอ)</p>

          <Callout title="Error">
            <ul>
              <li>Trapezoidal: O(h³) per interval, O(h²) composite</li>
              <li>Simpson: O(h⁵) per interval, O(h⁴) composite → แม่นกว่า Trap ~64× ที่ n เดียวกัน</li>
            </ul>
          </Callout>
        </div>
      </Sect>

      <Sect tag="ทวน" title="Differentiation · Cheat Sheet">
        <div className="cheat-card">
          <h4>First Derivative · ชุดธรรมดา</h4>
          <table className="tbl mono">
            <thead><tr><th>Method</th><th>สูตร</th><th>Error</th></tr></thead>
            <tbody>
              <tr><td>Forward</td><td>[f(x+h) − f(x)]/h</td><td>O(h)</td></tr>
              <tr><td>Backward</td><td>[f(x) − f(x−h)]/h</td><td>O(h)</td></tr>
              <tr><td>Central</td><td>[f(x+h) − f(x−h)]/(2h)</td><td>O(h²)</td></tr>
            </tbody>
          </table>

          <h4>First Derivative · ชุดละเอียด (โจทย์ระบุ Big-O สูง)</h4>
          <table className="tbl mono">
            <thead><tr><th>Method</th><th>สูตร</th><th>Error</th></tr></thead>
            <tbody>
              <tr><td>Forward</td><td>[−f(x+2h) + 4f(x+h) − 3f(x)]/(2h)</td><td>O(h²)</td></tr>
              <tr><td>Backward</td><td>[3f(x) − 4f(x−h) + f(x−2h)]/(2h)</td><td>O(h²)</td></tr>
              <tr><td>Central 5-point</td><td>[−f(x+2h) + 8f(x+h) − 8f(x−h) + f(x−2h)]/(12h)</td><td>O(h⁴)</td></tr>
            </tbody>
          </table>

          <h4>Second Derivative</h4>
          <table className="tbl mono">
            <thead><tr><th>Method</th><th>สูตร</th><th>Error</th></tr></thead>
            <tbody>
              <tr><td>Forward</td><td>[f(x+2h) − 2f(x+h) + f(x)]/h²</td><td>O(h)</td></tr>
              <tr><td>Backward</td><td>[f(x) − 2f(x−h) + f(x−2h)]/h²</td><td>O(h)</td></tr>
              <tr><td>Central</td><td>[f(x+h) − 2f(x) + f(x−h)]/h²</td><td>O(h²)</td></tr>
              <tr><td>Forward ละเอียด</td><td>[−f(x+3h) + 4f(x+2h) − 5f(x+h) + 2f(x)]/h²</td><td>O(h²)</td></tr>
              <tr><td>Backward ละเอียด</td><td>[2f(x) − 5f(x−h) + 4f(x−2h) − f(x−3h)]/h²</td><td>O(h²)</td></tr>
              <tr><td>Central 5-point</td><td>[−f(x+2h) + 16f(x+h) − 30f(x) + 16f(x−h) − f(x−2h)]/(12h²)</td><td>O(h⁴)</td></tr>
            </tbody>
          </table>

          <Callout kind="warn" title="Big-O ในโจทย์ = คำสั่งเลือกชุดสูตร">
            โจทย์เขียน “forward O(h)” → ชุดธรรมดา · “forward O(h²)” → ชุดละเอียด (ใช้ชุดธรรมดาแล้วอ้าง O(h²) = ผิดทั้งข้อ) · <b>เช็กเร็ว:</b> ผลรวมสัมประสิทธิ์ทุกสูตรต้องเป็น 0 (เช่น −1+4−3 = 0 ✓)
          </Callout>
          <Callout kind="tip">เลือก central เมื่อมีข้อมูลทั้งสองข้าง — แม่นกว่า ~10× · ต้น/ท้ายตารางเท่านั้นที่จำเป็นต้องใช้ forward/backward</Callout>
        </div>
      </Sect>

      <Sect tag="ทวน" title="Root Finding · Cheat Sheet">
        <div className="cheat-card">
          <h4>สูตรหลัก</h4>
          <NumTable headers={["Method","สูตร", "Convergence"]} rows={[
            ["Bisection", "xₘ = (xₗ + xᵣ)/2", "Linear (1/2)"],
            ["False Position", "xₘ = xᵣ − f(xᵣ)(xₗ−xᵣ)/(f(xₗ)−f(xᵣ))", "Super-linear"],
            ["One-point", "x_{n+1} = g(x_n)", "Linear ถ้า |g'|<1"],
            ["Newton", "x_{n+1} = x_n − f(x_n)/f'(x_n)", "Quadratic ≈ 2x"],
            ["Secant", "x_{n+1} = x_n − f(x_n)(x_{n-1}−x_n)/(f(x_{n-1})−f(x_n))", "Super-linear ≈ 1.618"],
          ]}/>
          <h4>Error สำหรับทุก method</h4>
          <MB>{`\\varepsilon_a = \\left|\\frac{x_{\\text{new}} - x_{\\text{old}}}{x_{\\text{new}}}\\right| \\times 100\\%`}</MB>
          <h4>เลือก method</h4>
          <ul>
            <li>โจทย์ให้ <b>ช่วง [a, b]</b> + <code>f(a)·f(b) &lt; 0</code> → Bisection / False Position</li>
            <li>โจทย์ให้ <b>x₀ + f'(x)</b> → Newton</li>
            <li>โจทย์ให้ <b>x₀, x₁</b> สองจุด → Secant</li>
            <li>โจทย์ให้ <b>x = g(x)</b> → One-point</li>
            <li>โจทย์ <b>scan ทีละ...</b> → Graphical</li>
          </ul>
        </div>
      </Sect>


      <style>{`
        .cheat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--blue);
          border-radius: 0 10px 10px 0;
          padding: 18px 24px;
          margin: 14px 0;
        }
        .cheat-card h4 { color: var(--yellow); margin-top: 14px; }
        .cheat-card h4:first-child { margin-top: 0; }
        @media print {
          .sidebar, .tweaks-panel, .anim-controls, .py-cell, .hero, .sect-head .step-tag { display: none !important; }
          body { background: white; color: black; }
          .main { max-width: 100%; padding: 20px; }
          .cheat-card, .callout, .card { background: white !important; color: black; border-color: #999 !important; page-break-inside: avoid; }
          .katex { color: black !important; }
          .tbl { background: white; }
          .tbl th, .tbl td { color: black; border-color: #ccc; }
        }
      `}</style>
    </div>
  );
}

function DecisionTree() {
  return (
    <svg className="svg-stage" viewBox="0 0 900 540" style={{width: "100%", height: "auto"}}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L0,8 L8,4 z" fill="#58c4dd"/>
        </marker>
      </defs>
      {/* Root node */}
      <g>
        <rect x="350" y="20" width="200" height="50" rx="10" fill="#1c2128" stroke="#58c4dd" strokeWidth="2"/>
        <text x="450" y="50" textAnchor="middle" fill="#e6edf3" fontFamily="Inter" fontWeight="600" fontSize="14">เห็นโจทย์ → ดูอะไรก่อน?</text>
      </g>

      {/* Category nodes */}
      {[
        { x: 80, y: 130, label: "หาราก f(x)=0", color: "#83c167" },
        { x: 300, y: 130, label: "Ax = b", color: "#ffd66b" },
        { x: 520, y: 130, label: "Curve fit / data", color: "#a87dbe" },
        { x: 740, y: 130, label: "∫ หรือ d/dx", color: "#f47274" },
      ].map((c, i) => (
        <g key={i}>
          <line x1="450" y1="70" x2={c.x + 80} y2={c.y} stroke="#58c4dd" strokeWidth="1.5" markerEnd="url(#arrow)"/>
          <rect x={c.x} y={c.y} width="160" height="40" rx="8" fill="#1c2128" stroke={c.color} strokeWidth="2"/>
          <text x={c.x + 80} y={c.y + 25} textAnchor="middle" fill={c.color} fontFamily="Inter" fontWeight="600" fontSize="13">{c.label}</text>
        </g>
      ))}

      {/* Root finding sub */}
      {[
        { x: 20, y: 230, label: "ช่วง [a,b]", method: "Bisection / False Position" },
        { x: 20, y: 300, label: "x₀ + f'(x)", method: "Newton" },
        { x: 20, y: 370, label: "x₀ และ x₁", method: "Secant" },
        { x: 20, y: 440, label: "x = g(x)", method: "One-point" },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width="220" height="46" rx="6" fill="#0e1116" stroke="#83c167" strokeWidth="1"/>
          <text x={c.x + 8} y={c.y + 18} fill="#83c167" fontFamily="Inter" fontSize="11">if: {c.label}</text>
          <text x={c.x + 8} y={c.y + 36} fill="#e6edf3" fontFamily="Inter" fontWeight="600" fontSize="12.5">→ {c.method}</text>
        </g>
      ))}

      {/* Linear systems sub */}
      {[
        { x: 250, y: 230, label: "n ≤ 4, dense", method: "Gauss Elim" },
        { x: 250, y: 300, label: "diag. dominant", method: "Jacobi" },
        { x: 250, y: 370, label: "diag. dom + เร็ว", method: "Gauss-Seidel" },
        { x: 250, y: 440, label: "SPD + ใหญ่ + sparse", method: "Conjugate Gradient" },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width="220" height="46" rx="6" fill="#0e1116" stroke="#ffd66b" strokeWidth="1"/>
          <text x={c.x + 8} y={c.y + 18} fill="#ffd66b" fontFamily="Inter" fontSize="11">if: {c.label}</text>
          <text x={c.x + 8} y={c.y + 36} fill="#e6edf3" fontFamily="Inter" fontWeight="600" fontSize="12.5">→ {c.method}</text>
        </g>
      ))}

      {/* Curve fitting */}
      {[
        { x: 480, y: 230, label: "ผ่านทุกจุด · 2-5 จุด", method: "Newton DD / Lagrange" },
        { x: 480, y: 300, label: "ผ่านทุกจุด · >5 จุด", method: "Spline (Linear/Cubic)" },
        { x: 480, y: 370, label: "data มี noise", method: "Linear Regression" },
        { x: 480, y: 440, label: "data โค้ง + noise", method: "Polynomial Regression" },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width="220" height="46" rx="6" fill="#0e1116" stroke="#a87dbe" strokeWidth="1"/>
          <text x={c.x + 8} y={c.y + 18} fill="#a87dbe" fontFamily="Inter" fontSize="11">if: {c.label}</text>
          <text x={c.x + 8} y={c.y + 36} fill="#e6edf3" fontFamily="Inter" fontWeight="600" fontSize="12.5">→ {c.method}</text>
        </g>
      ))}

      {/* Integ/Diff */}
      {[
        { x: 700, y: 230, label: "∫ + ช่องย่อยคี่", method: "Composite Trap" },
        { x: 700, y: 300, label: "∫ + ช่องย่อยคู่", method: "Composite Simpson 1/3" },
        { x: 700, y: 370, label: "d/dx มีจุดทั้ง 2 ด้าน", method: "Central O(h²) หรือ O(h⁴)" },
        { x: 700, y: 440, label: "d/dx มีปลายข้างเดียว", method: "Forward / Backward O(h)" },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width="190" height="46" rx="6" fill="#0e1116" stroke="#f47274" strokeWidth="1"/>
          <text x={c.x + 8} y={c.y + 18} fill="#f47274" fontFamily="Inter" fontSize="11">if: {c.label}</text>
          <text x={c.x + 8} y={c.y + 36} fill="#e6edf3" fontFamily="Inter" fontWeight="600" fontSize="11.5">→ {c.method}</text>
        </g>
      ))}

      {/* Connecting lines from category to sub */}
      {[80, 300, 520, 740].map((cx, i) => (
        <line key={i} x1={cx + 80} y1="170" x2={cx + 80} y2="225" stroke="#3b4452" strokeWidth="1" strokeDasharray="2 3"/>
      ))}
    </svg>
  );
}

window.CheatLesson = CheatLesson;
