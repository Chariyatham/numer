// เขียนโค้ดจากหัว — ฝึกเขียนโปรแกรมบนกระดาษโดยไม่เปิดโพย
// เหตุผลที่มีหน้านี้: อาจารย์บอกว่าข้อสอบ "มีโค้ดครึ่งหนึ่ง" = ~45 จาก 90 คะแนน
// และ "ห้ามเอากระดาษเข้า" ⇒ ต้องเขียนจากความจำล้วน ๆ
// แอปมี Python cell สำเร็จรูป 65 เซลล์ให้อ่าน แต่ไม่มีที่ไหนให้เขียนเอง — หน้านี้ปิดช่องนั้น

function CodeDrillLesson() {
  return (
    <div>
      <Hero
        kicker="⌨ เขียนโค้ดจากหัว"
        title="Code from Memory"
        lead="ครึ่งหนึ่งของข้อสอบคือข้อเขียนโปรแกรม และห้ามเปิดโพย — หน้านี้ฝึกให้เขียนออกมาได้เองบนกระดาษเปล่า · หมวด 1★ คือโครงของไฟนอล (Linear 7 วิธี + Interp/Spline/Regression)"
        readout={{
          label: "โปรแกรมของไฟนอล ย่อเหลือ 4 โครง (+ K สำหรับ 3 บทหลัง)",
          steps: [
            { x: "E · Gauss", w: 30 },
            { x: "F · Jordan/Inversion", w: 24 },
            { x: "G+H · LU/Cholesky", w: 20 },
            { x: "J · Jacobi/Seidel", w: 14 },
          ],
          result: "4",
          note: "Linear 7 วิธีที่ออกไฟนอล ใช้แค่ 4 โครงนี้ — ที่เหลือคือเปลี่ยนไม่กี่บรรทัด",
        }}
        meta={["6 โครงมิด + 5 โครงไฟนอล", "เติมช่องว่าง 18 ข้อ", "กระดาษเปล่า 9 ข้อ", "ตาราง JS ↔ Python"]}
      />

      <CodeRules/>

      <Callout kind="danger" title="ทำไมหน้านี้ถึงคุ้มที่สุดตอนนี้">
        <NumTable
          headers={["ข้อเท็จจริง", "ผลที่ตามมา"]}
          rows={[
            ["อาจารย์บอกเอง: “มีโค้ดครึ่งหนึ่ง มีคำนวณครึ่งหนึ่ง”", "ราว 45 จาก 90 คะแนนคือข้อเขียนโปรแกรม"],
            ["“ห้ามเอากระดาษเข้า” ใช้ได้แค่เครื่องคิดเลข", "ต้องเขียนโปรแกรมจากความจำ ไม่มีโพยให้ลอก"],
            ["ข้อโค้ดไม่ต้องกดเครื่อง ไม่ต้องปัดเลข", <span>เป็นส่วนที่<b>คุมได้ที่สุด</b>ในข้อสอบทั้งฉบับ — ไม่มีความเสี่ยงกดผิดปุ่ม</span>],
            ["อ่านโค้ดเข้าใจ ≠ เขียนโค้ดออกมาได้", "ต้องฝึกเขียนจริง อ่านเฉย ๆ ไม่พอ"],
          ]}
        />
        <p style={{margin:"8px 0 0"}}><b>ข่าวดี:</b> โปรแกรมทุกตัวที่ออกสอบย่อเหลือ <b>6 โครง</b> ที่แชร์กันได้ — ไม่ต้องท่อง 12 โปรแกรมแยกกัน</p>
      </Callout>

      {/* ═══════════ 1 · 6 โครง ═══════════ */}
      <Sect tag="1" title="6 โครงพื้นฐาน — เขียนตอนติวมิด แต่ยังใช้ต่อในไฟนอล (E คือโครงแม่)">
        <Callout kind="good" title="🎙️ เขียนตามกรอบ 3 ขั้นของอาจารย์เสมอ">
          <p style={{margin:0}}>ทุกโครงข้างล่างวางตาม ① <b>Initial Value</b> ② <b>Iteration Form</b> ③ <b>เงื่อนไขหยุด</b> · เงื่อนไขหยุดใช้ <b>absolute</b> <code>abs(ค่าใหม่ − ค่าเก่า) &lt; tol</code> โดยอาจารย์ตั้ง <code>tol = 0.001</code> เว้นแต่โจทย์สั่งเอง</p>
        </Callout>

        <h3>โครง A · <span style={{color:"var(--signal)"}}>[บท Root Finding]</span> Bracketing — Bisection &amp; False Position</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>สองวิธีนี้<b>ต่างกันแค่บรรทัดเดียว</b> คือบรรทัดที่คำนวณ <M>{`x_m`}</M> — ที่เหลือเหมือนกันเป๊ะ</p>
        <CodeBlock code={`def f(x):
    return x**4 - 13                 # ★ เปลี่ยนตามโจทย์

xl, xr = 1.5, 2.0                    # ① Initial Value (ต้องคร่อมราก)
tol = 0.001
prev = None

while True:
    xm = (xl + xr) / 2                                    # ② Bisection
    # xm = (xl*f(xr) - xr*f(xl)) / (f(xr) - f(xl))        # ② False Position

    if prev is not None and abs(xm - prev) < tol:         # ③ เงื่อนไขหยุด
        break

    if f(xl) * f(xm) > 0:            # เครื่องหมายเดียวกัน → รากอยู่ฝั่งขวา
        xl = xm
    else:                            # คนละเครื่องหมาย → รากอยู่ฝั่งซ้าย
        xr = xm
    prev = xm

print(round(xm, 6))                  # ตอบเป็นทศนิยม`}/>
        <Callout kind="warn" title="3 จุดที่คนพลาดในโครง A">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b><code>prev</code> ต้องมี</b> — เพราะรอบแรกยังไม่มีค่าเก่าให้เทียบ (นี่คือ “รอบทำทิ้ง” ที่อาจารย์พูดถึง แปลงเป็นโค้ด)</li>
            <li><b>เทียบเครื่องหมายกับ <code>f(xl)</code> เสมอ</b> — ถ้าเผลอเทียบกับ <code>f(xr)</code> เงื่อนไขจะกลับด้าน ตารางผิดยกใบ</li>
            <li><b><code>prev = xm</code> ต้องอยู่ท้ายลูป</b> ถ้าวางก่อน <code>if</code> จะเทียบค่าตัวเองกับตัวเอง = หยุดทันที</li>
          </ul>
        </Callout>

        <h3 style={{marginTop:22}}>โครง B · <span style={{color:"var(--signal)"}}>[บท Root Finding]</span> Open Method — One-point &amp; Newton</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>ใช้ค่าเริ่มตัวเดียว · ต่างกันแค่<b>บรรทัด Iteration Form</b></p>
        <CodeBlock code={`import math

def f(x):  return x**2 - 7           # ★ สำหรับ Newton
def fp(x): return 2*x                # ★ อนุพันธ์ (Newton ต้องมี)
def g(x):  return math.exp(-x)       # ★ สำหรับ One-point (isolation form)

x = 2.0                              # ① Initial Value (ตัวเดียว)
tol = 0.001

while True:
    xn = x - f(x)/fp(x)              # ② Newton
    # xn = g(x)                      # ② One-point

    if abs(xn - x) < tol:            # ③ เงื่อนไขหยุด
        break
    x = xn

print(round(xn, 6))`}/>

        <h3 style={{marginTop:22}}>โครง B′ · <span style={{color:"var(--signal)"}}>[บท Root Finding]</span> Secant — เหมือน B แต่มีค่าเริ่ม 2 ตัว</h3>
        <Callout kind="danger" title="⭐ บรรทัดที่อาจารย์ใช้เวลาอธิบายนานที่สุดอยู่ในโครงนี้">
          <p style={{margin:0}}>คือบรรทัด <code>x0, x1 = x1, x2</code> — ที่อาจารย์พูดว่า “x1 มันจะกลายเป็น x0 ปะ · x2 มันจะกลายเป็น x1 ปะ” · <b>ถ้าลืมบรรทัดนี้ โปรแกรมจะวนค่าเดิมไม่รู้จบ · ถ้าเลื่อนผิดจะกลายเป็น False Position</b></p>
        </Callout>
        <CodeBlock code={`def f(x): return x**2 - 7

x0, x1 = 3.0, 2.0                    # ① Initial Value ต้องมี 2 ตัว
tol = 0.001

while True:
    x2 = x1 - f(x1)*(x0 - x1) / (f(x0) - f(x1))    # ② Iteration Form

    if abs(x2 - x1) < tol:           # ③ เงื่อนไขหยุด
        break
    x0, x1 = x1, x2                  # ★ เลื่อนตัวแปร — บรรทัดที่ลืมบ่อยที่สุด

print(round(x2, 6))`}/>

        <h3 style={{marginTop:22}}>โครง C · <span style={{color:"var(--signal)"}}>[บท Integration]</span> Composite Trapezoidal &amp; Simpson</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>ไม่มีเงื่อนไขหยุด (ไม่ใช่วิธีวนซ้ำ) — วนตามจำนวนช่องที่โจทย์กำหนด · ต่างกัน <b>2 จุด</b>: น้ำหนักในลูป กับตัวคูณข้างนอก</p>
        <CodeBlock code={`def f(x):
    return 2*x**3 - 5*x**2 + 3*x + 1      # ★ เปลี่ยนตามโจทย์

a, b = 0, 2
n = 6                     # Trapezoidal: n = จำนวนช่องย่อย
                          # Simpson: ถ้าโจทย์ให้ n = จำนวนพาราโบลา ให้ใช้ n = 2*n ก่อน
h = (b - a) / n

s = f(a) + f(b)                       # ปลายสองข้าง น้ำหนัก ×1
for i in range(1, n):
    s += 2 * f(a + i*h)                          # Trapezoidal: จุดในทั้งหมด ×2
    # s += (4 if i % 2 else 2) * f(a + i*h)      # Simpson: คี่ ×4 · คู่ ×2

I = h/2 * s                           # Trapezoidal
# I = h/3 * s                         # Simpson

print(round(I, 6))`}/>
        <Callout kind="tip" title="จำน้ำหนักยังไงไม่ให้สับสน">
          <div style={{fontFamily:"var(--font-mono)", fontSize:'0.84rem', lineHeight:1.9}}>
            Trapezoidal : 1 · 2 · 2 · 2 · … · 2 · 1  → คูณ h/2<br/>
            Simpson&nbsp;&nbsp;&nbsp;&nbsp; : 1 · 4 · 2 · 4 · … · 4 · 1  → คูณ h/3
          </div>
          <p style={{margin:"6px 0 0"}}>ตัวหาร (2 หรือ 3) <b>ตรงกับตัวเลขที่ใหญ่ที่สุดลบหนึ่ง</b> ในรูปแบบน้ำหนัก — Trap มี 2 → หาร 2 · Simpson มี 4 → หาร 3 (จำเป็นคู่ไว้ก็ได้)</p>
        </Callout>

        <h3 style={{marginTop:22}}>โครง D · <span style={{color:"var(--signal)"}}>[บท Differentiation]</span> Finite Difference — ไม่มีลูปเลย</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>ข้อ Differentiation คือการ<b>แทนค่าลงสูตรตรง ๆ</b> — สั้นที่สุดในสี่โครง แต่ต้องจำสัมประสิทธิ์ให้แม่น</p>
        <CodeBlock code={`import math

def f(x):
    return x * math.exp(-x)           # ★ เปลี่ยนตามโจทย์

x0 = 1.5
h  = 0.25

# อนุพันธ์อันดับ 1
d1_h2 = (f(x0+h) - f(x0-h)) / (2*h)
d1_h4 = (-f(x0+2*h) + 8*f(x0+h) - 8*f(x0-h) + f(x0-2*h)) / (12*h)

# อนุพันธ์อันดับ 2
d2_h2 = (f(x0+h) - 2*f(x0) + f(x0-h)) / h**2
d2_h4 = (-f(x0+2*h) + 16*f(x0+h) - 30*f(x0) + 16*f(x0-h) - f(x0-2*h)) / (12*h**2)

print(round(d1_h2, 7), round(d1_h4, 7))
print(round(d2_h2, 7), round(d2_h4, 7))`}/>
        <Callout kind="tip" title="เช็คว่าจำสัมประสิทธิ์ถูกไหมใน 2 วินาที">
          <p style={{margin:0}}><b>บวกสัมประสิทธิ์ทั้งหมดต้องได้ 0 เสมอ</b> — <M>{`1-2+1=0`}</M> ✓ · <M>{`-1+8-8+1=0`}</M> ✓ · <M>{`-1+16-30+16-1=0`}</M> ✓ · ถ้าบวกแล้วไม่เป็นศูนย์แสดงว่าจำผิด อย่าเพิ่งเขียนลงกระดาษ</p>
        </Callout>

        <h3 style={{marginTop:22}}>โครง E · <span style={{color:"var(--signal)"}}>[บท Linear Systems]</span> Gauss Elimination &amp; Cramer</h3>
        <Callout kind="danger" title="⭐ โครงนี้เพิ่งเพิ่ม — บท Linear อยู่ในขอบเขตแต่เดิมไม่มีโครงให้ท่อง">
          <p style={{margin:0}}>อาจารย์บอกเองว่าข้อสอบออกถึงแค่ <b>Cramer</b> กับ <b>Gauss Elimination</b> ⇒ โค้ดของบทนี้มีแค่ 2 ตัว · <b>Gauss เป็นโครงหลัก</b> เพราะทำได้ทุกขนาด ส่วน Cramer สั้นกว่าแต่ติดที่ต้องเขียน <code>det</code> เอง และใช้ได้แค่ 2×2 / 3×3</p>
        </Callout>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>Gauss = <b>2 ลูปซ้อน forward elimination</b> แล้ว <b>1 ลูปถอยหลัง back substitution</b> — จำเป็น 2 ก้อนแยกกัน อย่าพยายามจำเป็นก้อนเดียว</p>
        <CodeBlock code={`A = [[-2,  3,  1],                # ★ เปลี่ยนตามโจทย์
     [ 3,  4, -5],
     [ 1, -2,  1]]
b = [9, 0, -4]
n = len(A)

M = [A[i][:] + [b[i]] for i in range(n)]     # ① augmented matrix [A|b]

# ② Forward elimination — ทำให้ใต้ pivot เป็น 0
for k in range(n):
    if M[k][k] == 0:                          # pivot = 0 -> สลับแถว (ห้ามลืม)
        for r in range(k+1, n):
            if M[r][k] != 0:
                M[k], M[r] = M[r], M[k]
                break
    for i in range(k+1, n):
        factor = M[i][k] / M[k][k]
        for j in range(k, n+1):               # j เริ่มที่ k และไปถึง n (คอลัมน์ b)
            M[i][j] -= factor * M[k][j]

# ③ Back substitution — ไล่จากแถวล่างขึ้นบน
x = [0] * n
for i in range(n-1, -1, -1):
    s = M[i][n]
    for j in range(i+1, n):
        s -= M[i][j] * x[j]
    x[i] = s / M[i][i]

for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")             # ตอบเป็นทศนิยม`}/>
        <Callout kind="warn" title="4 จุดที่คนพลาดในโครง E">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b><code>range(k, n+1)</code> ต้องมี <code>+1</code></b> — ถ้าเขียน <code>range(k, n)</code> คอลัมน์ <M>b</M> จะไม่ถูกอัปเดต ⇒ ได้ <M>U</M> ถูกแต่คำตอบผิดทั้งหมด (นี่คือกับดักอันดับ 1 ของบทนี้)</li>
            <li><b>back substitution ต้องวนถอยหลัง</b> <code>range(n-1, -1, -1)</code> — เพราะ <M>{`x_n`}</M> เท่านั้นที่หาได้ก่อนโดยไม่ต้องรู้ตัวอื่น</li>
            <li><b>เช็ค <code>M[k][k] == 0</code> ก่อน eliminate</b> — ถ้า pivot เป็น 0 จะหารด้วยศูนย์ทันที ⇒ ต้องสลับแถว</li>
            <li><b><code>x[i] = s / M[i][i]</code> อย่าลืมหารด้วย pivot</b> ตอนท้าย — ลืมบ่อยเพราะแถวสุดท้ายมักดูเหมือนได้คำตอบแล้ว</li>
          </ul>
        </Callout>

        <p style={{margin:"14px 0 6px", fontSize:'0.86rem'}}><b>ตัวย่อย E′ · Cramer</b> — สั้นกว่ามาก แต่ต้องเขียนฟังก์ชัน <code>det</code> ของ 3×3 เอง</p>
        <CodeBlock code={`def det3(M):                      # กระจายแถวแรก เครื่องหมาย + - +
    return (M[0][0]*(M[1][1]*M[2][2] - M[1][2]*M[2][1])
          - M[0][1]*(M[1][0]*M[2][2] - M[1][2]*M[2][0])
          + M[0][2]*(M[1][0]*M[2][1] - M[1][1]*M[2][0]))

A = [[2, -1, 0], [-1, 2, -1], [0, -1, 3]]     # ★ เปลี่ยนตามโจทย์
b = [150, 0, 250]

dA = det3(A)
if dA == 0:
    print("det A = 0 -> Cramer ใช้ไม่ได้")     # ต้องเช็คก่อนเสมอ
else:
    for k in range(3):
        Ak = [row[:] for row in A]             # ★ copy ทีละแถว ไม่งั้นแก้ A ตัวจริง
        for r in range(3):
            Ak[r][k] = b[r]                    # แทนคอลัมน์ที่ k ด้วย b
        print(f"x{k+1} = {det3(Ak)/dA:.6f}")`}/>
        <Callout kind="danger" title="⚠︎ บรรทัดที่พังเงียบ ๆ: การ copy เมทริกซ์">
          <p style={{margin:0}}><code>Ak = A</code> หรือ <code>Ak = A[:]</code> <b>ไม่พอ</b> — มันยังชี้ไปที่แถวเดิม พอแทนคอลัมน์ก็จะไปแก้ <code>A</code> ตัวจริง ⇒ รอบถัดไปคำนวณจากเมทริกซ์ที่เพี้ยนแล้ว · ต้อง <code>[row[:] for row in A]</code> เท่านั้น · <b>โปรแกรมจะรันผ่านโดยไม่ error แต่ได้เลขผิด</b> — พังแบบที่จับยากที่สุด</p>
        </Callout>
        <Callout kind="good" title="ของแถมที่ได้ฟรีจาก Gauss — det A">
          <p style={{margin:0}}><b>ผลคูณของตัวหลัก (pivot) หลังทำ forward elimination เสร็จ = det A</b> ⇒ ทำ Gauss แล้วได้ det มาฟรีสำหรับตรวจ Cramer · <span style={{color:"var(--yellow)"}}><b>แต่ถ้าสลับแถวไป <M>k</M> ครั้ง ต้องคูณ <M>{`(-1)^k`}</M> ด้วย</b> — สลับ 1 ครั้งเครื่องหมายกลับ</span></p>
        </Callout>
      </Sect>

      {/* ═══════════ 1★ · โครงไฟนอล ═══════════ */}
      <Sect tag="1★" title="โครงไฟนอล 5 โครง — F · G · H · J · K (ต่อยอดจากโครง E ทั้งหมด)">
        <Callout kind="good" title="⭐ 7 วิธี Linear ที่ออกไฟนอล ยุบเหลือ 4 โครงจริง ๆ">
          <NumTable
            headers={["โครง", "ใช้กับ", "ต่อยอดจากอะไร"]}
            rows={[
              [<b>E</b>, "Gauss Elimination (ข้อ 1.2)", "โครงแม่ — อยู่หมวดข้างบนแล้ว"],
              [<b>F</b>, "Gauss-Jordan (1.3) · Matrix Inversion (1.4)", "E + normalize แถว pivot + กำจัดข้างบนด้วย"],
              [<b>G</b>, "LU Decomposition (1.5)", "E แต่เก็บตัวคูณไว้ใน L แทนที่จะทิ้ง"],
              [<b>H</b>, "Cholesky (1.6)", "G — ใช้ forward/back substitution ชุดเดียวกันเป๊ะ"],
              [<b>J</b>, "Jacobi (1.7) · Gauss-Seidel (1.8)", "รูปเดียวกับ open method ของบท Root (โครง B)"],
              [<b>K</b>, "Interpolation · Regression · Spline", "C (summation) + E (แก้ระบบ normal equations)"],
            ]}
          />
          <p style={{margin:"8px 0 0"}}>ทุกโครงข้างล่างรันจริงแล้ว — ระบบตัวอย่างคือ<b>ระบบเดียวกับการบ้าน 6-7</b> คำตอบต้องได้ <M>{`x=(-1,\\;2,\\;1)`}</M> ทุกวิธี (ยกเว้น Cholesky ที่ต้องใช้ระบบ symmetric)</p>
        </Callout>

        <h3>โครง F · <span style={{color:"var(--signal)"}}>[Linear 1.3–1.4]</span> Gauss-Jordan &amp; Matrix Inversion</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>ต่างจากโครง E แค่ <b>2 อย่าง</b>: (ก) หารแถว pivot ให้ตัวหลักเป็น 1 (ข) ลูป <code>i</code> วิ่งทุกแถวที่ <code>i != k</code> ไม่ใช่แค่ <code>i &gt; k</code> ⇒ จบแล้วได้ Identity <b>อ่านคำตอบจากคอลัมน์ b ได้เลย ไม่ต้อง back-substitute</b></p>
        <CodeBlock code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]   # ★ เปลี่ยนตามโจทย์
b = [9, 0, -4]
n = len(A)                                 # ห้ามฮาร์ดโค้ด 3
M = [A[i][:] + [b[i]] for i in range(n)]   # ① augment [A|b] · copy ทีละแถว

for k in range(n):
    if M[k][k] == 0:                       # pivot = 0 -> สลับแถวก่อน
        for r in range(k+1, n):
            if M[r][k] != 0:
                M[k], M[r] = M[r], M[k]
                break
    p = M[k][k]
    for j in range(k, n+1):                # ② normalize: ทำตัวหลักให้เป็น 1
        M[k][j] /= p
    for i in range(n):                     # ③ กำจัด "ทุกแถว" ยกเว้นแถว pivot เอง
        if i != k:
            f = M[i][k]
            for j in range(k, n+1):
                M[i][j] -= f * M[k][j]
    print(f"k={k+1}:", [f"{M[r][n]:8.4f}" for r in range(n)])

for i in range(n):
    print(f"x{i+1} = {M[i][n]:.6f}")       # อ่านจากคอลัมน์ b ตรง ๆ`}/>
        <p style={{margin:"12px 0 6px", fontSize:'0.86rem'}}><b>ตัวย่อย F′ · Matrix Inversion</b> — โครงเดิมเป๊ะ เปลี่ยนแค่ <b>ต่อ <M>I</M> แทน <M>b</M></b> แล้วลูปคอลัมน์วิ่งถึง <code>2*n</code></p>
        <CodeBlock code={`M = [A[i][:] + [1.0 if i == j else 0.0 for j in range(n)]    # ① augment [A|I]
     for i in range(n)]

for k in range(n):                          # ② Gauss-Jordan เหมือนเดิม
    p = M[k][k]
    for j in range(k, 2*n):                 # ★ ถึง 2n ไม่ใช่ n
        M[k][j] /= p
    for i in range(n):
        if i != k:
            f = M[i][k]
            for j in range(k, 2*n):         # ★ ถึง 2n
                M[i][j] -= f * M[k][j]

Ainv = [row[n:] for row in M]               # ③ ครึ่งขวา = A^-1
x = [sum(Ainv[i][j]*b[j] for j in range(n)) for i in range(n)]   # ④ x = A^-1 b
for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")`}/>
        <Callout kind="warn" title="3 จุดตายของโครง F">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>ลืม normalize</b> (ข้าม <code>M[k][j] /= p</code>) ⇒ ได้ diagonal ไม่ใช่ identity ⇒ คำตอบผิดทุกตัวเพราะยังไม่ได้หารด้วยตัวหลัก</li>
            <li><b><code>if i != k</code> ไม่ใช่ <code>range(k+1, n)</code></b> — ถ้าเขียนแบบ E ก็ได้แค่ Gauss ธรรมดา ข้างบนเส้นทแยงไม่ถูกกำจัด</li>
            <li><b>Inversion: ลูปคอลัมน์ต้องถึง <code>2*n</code></b> — เขียน <code>n</code> ครึ่งขวาจะไม่ถูกอัปเดต ได้ <M>{`A^{-1}`}</M> เป็นเมทริกซ์เอกลักษณ์เดิม (พังเงียบ ๆ ไม่ error)</li>
          </ul>
        </Callout>

        <h3>โครง G · <span style={{color:"var(--signal)"}}>[Linear 1.5]</span> LU Decomposition (Doolittle)</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>โครง E ทุกประการ <b>ยกเว้นบรรทัดเดียว</b>: ตัวคูณ <code>f</code> ที่ E ใช้แล้วทิ้ง — G เก็บไว้ใน <code>L[i][k]</code></p>
        <CodeBlock code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]   # ★ เปลี่ยนตามโจทย์
b = [9, 0, -4]
n = len(A)

L = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]   # Doolittle: diag L = 1
U = [row[:] for row in A]                  # ★ copy ทีละแถว ไม่งั้นแก้ A ตัวจริง

for k in range(n):                         # ① แยก A = L·U
    for i in range(k+1, n):
        f = U[i][k] / U[k][k]
        L[i][k] = f                        # ★★ เก็บ "ก่อน" เอา f ไปกำจัด — จุดตายอันดับ 1
        for j in range(k, n):
            U[i][j] -= f * U[k][j]

y = [0.0] * n                              # ② Ly = b  (forward substitution, ไล่ลง)
for i in range(n):
    y[i] = b[i] - sum(L[i][k]*y[k] for k in range(i))     # diag L = 1 จึงไม่ต้องหาร

x = [0.0] * n                              # ③ Ux = y  (back substitution, ไล่ขึ้น)
for i in range(n-1, -1, -1):
    x[i] = (y[i] - sum(U[i][j]*x[j] for j in range(i+1, n))) / U[i][i]

for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")`}/>
        <Callout kind="danger" title="⚠︎ บรรทัดที่สลับลำดับแล้วพังทั้งตัว">
          <p style={{margin:0}}>ถ้าเขียน <code>for j: U[i][j] -= f*U[k][j]</code> ก่อนแล้วค่อย <code>L[i][k] = U[i][k]/U[k][k]</code> — ตอนนั้น <code>U[i][k]</code> กลายเป็น 0 ไปแล้ว ⇒ <b><M>L</M> จะเป็นเมทริกซ์เอกลักษณ์ทั้งตัว</b> · <code>L·U</code> ก็ยังคูณได้ไม่ error แต่ <M>{`LU \\neq A`}</M> ⇒ ตรวจเสมอด้วย <b>คูณ L·U กลับ ต้องได้ A</b></p>
        </Callout>

        <h3>โครง H · <span style={{color:"var(--signal)"}}>[Linear 1.6]</span> Cholesky</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}><b>ครึ่งหลังเหมือนโครง G เป๊ะ</b> — ต่างแค่หา <M>L</M> ด้วยสูตรราก แล้วใช้ <M>{`L^{T}`}</M> แทน <M>U</M> ⇒ เขียน substitution ครั้งเดียว ใช้ได้ทั้ง 1.5 และ 1.6</p>
        <CodeBlock code={`import math

A = [[4, 2, -2], [2, 10, 2], [-2, 2, 5]]   # ★ ต้อง symmetric positive definite เท่านั้น
b = [2, 20, 5]
n = len(A)

sym = all(A[i][j] == A[j][i] for i in range(n) for j in range(n))
print("symmetric?", sym)                   # ① เช็คก่อนเสมอ ไม่ผ่าน = ใช้วิธีนี้ไม่ได้

L = [[0.0]*n for _ in range(n)]
for i in range(n):                         # ② A = L·L^T
    for j in range(i+1):
        s = sum(L[i][k]*L[j][k] for k in range(j))
        if i == j:
            L[i][j] = math.sqrt(A[i][i] - s)      # ★ ติดลบใต้ราก = ไม่ SPD
        else:
            L[i][j] = (A[i][j] - s) / L[j][j]

y = [0.0] * n                              # ③ Ly = b
for i in range(n):
    y[i] = (b[i] - sum(L[i][k]*y[k] for k in range(i))) / L[i][i]

x = [0.0] * n                              # ④ L^T x = y  → L[k][i] คือ L^T[i][k]
for i in range(n-1, -1, -1):
    x[i] = (y[i] - sum(L[k][i]*x[k] for k in range(i+1, n))) / L[i][i]

for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")           # -0.629630  2.148148  -0.111111`}/>
        <Callout kind="warn" title="2 จุดตายของโครง H">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>ต่างจาก LU: forward substitution ต้องหารด้วย <code>L[i][i]</code></b> — เพราะแนวทแยงของ Cholesky ไม่ใช่ 1 (ของ Doolittle เป็น 1 เลยไม่ต้องหาร) ⇒ ลอกโค้ด LU มาตรง ๆ แล้วลืมหาร = ผิด</li>
            <li><b>ขั้น back substitution ใช้ <code>L[k][i]</code> ไม่ใช่ <code>L[i][k]</code></b> — เพราะ <M>{`L^{T}_{ik}=L_{ki}`}</M> · เขียนสลับ index แล้วรันผ่านแต่ได้เลขผิด</li>
          </ul>
        </Callout>

        <h3>โครง J · <span style={{color:"var(--signal)"}}>[Linear 1.7–1.8]</span> Jacobi &amp; Gauss-Seidel</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}>สองวิธีนี้<b>ต่างกันบรรทัดเดียว</b> — Jacobi อ่านจาก <code>old</code> · Gauss-Seidel อ่านจาก <code>x</code> ที่เพิ่งเขียนทับไป · และนี่คือ 2 ข้อที่ <b>ต้องใช้ <code>while</code> จริง ๆ</b> ไม่ใช่แค่ตามกฎ</p>
        <CodeBlock code={`# ★★ เช็คก่อนเสมอ: diagonally dominant ไหม ถ้าไม่ ต้องผสมแถวให้ dominant ก่อน
#    ระบบการบ้าน 6-7 ตัวเดิม "ลู่ออก" — ตัวข้างล่างคือระบบสมมูลที่แปลงแล้ว
A = [[5, 0, -3], [-3, 5, 0], [0, -1, 3]]   # E1'=R2+2R3 · E2'=R1-R3 · E3'=R1+2R3
b = [-8, 13, 1]
n = len(A)

dom = all(abs(A[i][i]) > sum(abs(A[i][j]) for j in range(n) if j != i) for i in range(n))
print("diagonally dominant?", dom)         # ① ไม่ผ่าน = ลู่ออก ไม่มีวันหยุด

tol = 0.001                                # ② อาจารย์ใช้ค่านี้เป็นปกติ
x = [0.0] * n                              # ③ Initial Value
k, err = 0, 1.0

while err > tol:                           # ★ ห้าม for k in range(N) — อาจารย์หัก
    k += 1
    old = x[:]                             # ★ Jacobi ต้องเก็บค่าเก่าไว้ทั้งชุด
    for i in range(n):
        s = sum(A[i][j]*old[j] for j in range(n) if j != i)   # Jacobi   : ใช้ old
        # s = sum(A[i][j]*x[j] for j in range(n) if j != i)   # G-Seidel : ใช้ x ค่าใหม่
        x[i] = (b[i] - s) / A[i][i]                           # ④ Iteration Form
    err = max(abs(x[i] - old[i]) for i in range(n))           # ⑤ เงื่อนไขหยุด
    print(f"k={k:2d}", [f"{v:9.6f}" for v in x], f"err={err:.6f}")

for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")           # -1.000000  2.000000  1.000000`}/>
        <Callout kind="danger" title="⚠︎ 3 จุดตายของโครง J — และตัวเลขที่ควรรู้ล่วงหน้า">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>ลืม <code>old = x[:]</code></b> ⇒ Jacobi กลายเป็น Gauss-Seidel ทันที (ตอบข้อ 1.7 ด้วยวิธีข้อ 1.8 = ผิด) · ต้อง <code>x[:]</code> เท่านั้น <code>old = x</code> ชี้ลิสต์เดียวกัน</li>
            <li><b>เขียน <code>for k in range(20)</code>แทน <code>while</code></b> — นี่คือจุดที่อาจารย์หักคะแนนจริง (สอบท้ายคาบเคยได้ 1 เต็ม 6 เพราะข้อนี้)</li>
            <li><b>ไม่เช็ค dominance ก่อน</b> ⇒ ระบบการบ้าน 6-7 ตัวเดิมจะลู่ออก · <code>err</code> โตขึ้นเรื่อย ๆ ลูปไม่มีวันจบ</li>
          </ul>
          <p style={{margin:"8px 0 0"}}>รันจริงบนระบบข้างบนที่ <M>{`tol=0.001`}</M> เริ่ม <M>{`x^{(0)}=(0,0,0)`}</M>: <b>Jacobi จบรอบที่ 12</b> · <b>Gauss-Seidel จบรอบที่ 5</b> — ถ้าเขียนถูก ตัวเลขต้องออกมาแบบนี้</p>
        </Callout>

        <h3>โครง K · <span style={{color:"var(--signal)"}}>[Interpolation · Regression · Spline]</span> 4 ตัวย่อย</h3>
        <p style={{margin:"0 0 6px", fontSize:'0.86rem'}}><b>K1 Newton DD</b> — ตารางสามเหลี่ยม · ต้องวน <code>i</code> <b>ถอยหลัง</b> ไม่งั้นเขียนทับค่าที่ยังต้องใช้</p>
        <CodeBlock code={`xs = [1, 4, 6, 5]                          # ★ ไม่ต้องเรียง ไม่ต้องห่างเท่ากัน
ys = [0, 1.386294, 1.791759, 1.609438]
xq = 2                                     # จุดที่โจทย์ถาม
n = len(xs)

c = ys[:]                                  # ① แถวแรกของตาราง = ys
for j in range(1, n):                      # ② ไล่ทีละ order
    for i in range(n-1, j-1, -1):          # ★ ถอยหลัง! ไม่งั้นทับค่าที่ยังต้องใช้
        c[i] = (c[i] - c[i-1]) / (xs[i] - xs[i-j])
    print(f"order {j}: c{j} = {c[j]:.6f}")

p, term = c[0], 1.0                        # ③ f = c0 + c1(x-x0) + c2(x-x0)(x-x1) + ...
for k in range(1, n):
    term *= (xq - xs[k-1])
    p += c[k] * term
print(f"f({xq}) = {p:.6f}")                # 0.628767`}/>
        <p style={{margin:"12px 0 6px", fontSize:'0.86rem'}}><b>K2 Lagrange</b> — สั้นกว่ามาก แต่คำนวณใหม่ทั้งหมดทุกครั้งที่เปลี่ยน <M>{`x_q`}</M> · <b>ต้องได้เลขเท่ากับ K1 เป๊ะ</b> ⇒ ใช้ตรวจกันเองได้ (กติกา &ldquo;ตรวจด้วยวิธีที่สอง&rdquo;)</p>
        <CodeBlock code={`p = 0.0
for i in range(n):
    Li = 1.0
    for j in range(n):
        if j != i:                         # ★★ บรรทัดที่ลืมบ่อยที่สุด — ไม่ใส่ = หารด้วย 0
            Li *= (xq - xs[j]) / (xs[i] - xs[j])
    p += ys[i] * Li
    print(f"L{i}({xq}) = {Li:.6f}")
print(f"f({xq}) = {p:.6f}")                # 0.628767 — ต้องตรงกับ Newton DD`}/>
        <p style={{margin:"12px 0 6px", fontSize:'0.86rem'}}><b>K3 Linear Regression</b> — ไม่มีลูปซ้อน มีแค่ <b>4 ผลรวม</b> · Polynomial ก็สร้าง normal equations แบบเดียวกัน แล้ว<b>โยนเข้าโครง E</b></p>
        <CodeBlock code={`xs = [1, 2, 3, 4, 5, 6, 7]                 # ★ เปลี่ยนตามโจทย์
ys = [0.5, 2.5, 2.0, 4.0, 3.5, 6.0, 5.5]
n = len(xs)

Sx  = sum(xs)                              # ① 4 ผลรวมที่ต้องมี
Sy  = sum(ys)
Sxy = sum(xs[i]*ys[i] for i in range(n))
Sxx = sum(v*v for v in xs)

a1 = (n*Sxy - Sx*Sy) / (n*Sxx - Sx*Sx)     # ② ความชัน
a0 = Sy/n - a1*Sx/n                        # ③ จุดตัดแกน y (ใช้ค่าเฉลี่ย)
print(f"y = {a0:.6f} + {a1:.6f} x")        # y = 0.071429 + 0.839286 x

Sr = sum((ys[i] - (a0 + a1*xs[i]))**2 for i in range(n))       # ④ วัดความพอดี
St = sum((y - Sy/n)**2 for y in ys)
print(f"r2 = {1 - Sr/St:.6f}")`}/>
        <p style={{margin:"12px 0 6px", fontSize:'0.86rem'}}><b>K4 Spline</b> — <b>หา segment ก่อนเสมอ</b> แล้วค่อยแทนสูตร · นี่คือตระกูลเดียวกับข้อ &ldquo;เลือกช่วง bisection&rdquo; ที่พลาดในมิด</p>
        <CodeBlock code={`xs = [1, 2, 4, 7]                          # ★ ต้องเรียงจากน้อยไปมาก
ys = [3, 5, 4, 8]
xq = 3.5

def segment(xs, xq):                       # ① หาว่า xq ตกอยู่ช่วงไหน
    for i in range(len(xs) - 1):
        if xs[i] <= xq <= xs[i+1]:
            return i
    raise ValueError("xq อยู่นอกช่วงข้อมูล -> เป็น extrapolation ไม่ใช่ spline")

i = segment(xs, xq)
print(f"xq อยู่ช่วงที่ {i+1}: [{xs[i]}, {xs[i+1]}]")

m = (ys[i+1] - ys[i]) / (xs[i+1] - xs[i])  # ② Linear spline = ลากเส้นตรงในช่วงนั้น
y = ys[i] + m * (xq - xs[i])
print(f"S({xq}) = {y:.6f}")                # 4.250000`}/>
        <Callout kind="warn" title="จุดตายของโครง K">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>Newton DD: ลูป <code>i</code> ต้องถอยหลัง</b> <code>range(n-1, j-1, -1)</code> — วนไปหน้าจะเขียนทับ <code>c[i-1]</code> ที่รอบถัดไปยังต้องใช้ ⇒ ตารางเพี้ยนตั้งแต่ order 2</li>
            <li><b>Lagrange: ลืม <code>if j != i</code></b> ⇒ <code>(xs[i]-xs[i])</code> = หารด้วยศูนย์ ⇒ ZeroDivisionError ทันที (อันนี้ยังดี เพราะ error ให้เห็น)</li>
            <li><b>Regression: <code>a0</code> ต้องใช้ค่าเฉลี่ย</b> <code>Sy/n - a1*Sx/n</code> ไม่ใช่ <code>Sy - a1*Sx</code></li>
            <li><b>Spline: ไม่หา segment ก่อน</b> แล้วแทนสูตรของช่วงแรกเสมอ — พังเงียบ ๆ ได้เลขที่ดูสมเหตุสมผลแต่ผิด</li>
          </ul>
        </Callout>
      </Sect>

      {/* ═══════════ 2 · เติมช่องว่าง ═══════════ */}
      <Sect tag="2" title="ดริลเติมช่องว่าง · 18 ข้อ — เจาะบรรทัดที่ลืมบ่อยที่สุด (C11–C18 = ของไฟนอล)">
        <p>อ่านโค้ดแล้วเติมบรรทัดที่หายไป <b>โดยไม่เลื่อนกลับไปดูโครงข้างบน</b> — ถ้าเติมไม่ได้แปลว่ายังไม่พร้อมเขียนบนกระดาษ</p>

        <TimedExam presets={[36, 20, 12]} label="18 ข้อ · แนะนำ 36 นาที (ข้อละ 2 นาที)">

        <Problem label="C1 · Bisection — บรรทัดตัดสินใจ" solution={
          <div>
            <CodeBlock code={`    if f(xl) * f(xm) > 0:
        xl = xm
    else:
        xr = xm`}/>
            <p style={{margin:"6px 0 0"}}><b>เหตุผล:</b> ผลคูณ<b>บวก</b> = <M>{`f(x_l)`}</M> กับ <M>{`f(x_m)`}</M> เครื่องหมายเดียวกัน ⇒ รากไม่ได้อยู่ครึ่งซ้าย ⇒ ดัน <M>{`x_l`}</M> ขึ้นมา · <span style={{color:"var(--yellow)"}}>ห้ามเทียบกับ <code>f(xr)</code> เพราะเงื่อนไขจะกลับด้าน</span></p>
          </div>
        }>
          <CodeBlock code={`while True:
    xm = (xl + xr) / 2
    if prev is not None and abs(xm - prev) < tol:
        break

    # ▁▁▁▁▁ เติม 4 บรรทัด: ตัดสินใจว่าจะขยับ xl หรือ xr ▁▁▁▁▁

    prev = xm`}/>
        </Problem>

        <Problem label="C2 · False Position — สูตร xm" solution={
          <div>
            <CodeBlock code={`    xm = (xl*f(xr) - xr*f(xl)) / (f(xr) - f(xl))`}/>
            <p style={{margin:"6px 0 0"}}><b>วิธีจำ:</b> ตัวเศษคือ “<b>ไขว้กัน</b>” — <M>{`x_l`}</M> คู่กับ <M>{`f(x_r)`}</M> และ <M>{`x_r`}</M> คู่กับ <M>{`f(x_l)`}</M> · ตัวส่วนคือ <M>{`f`}</M> ลบกันตามลำดับเดียวกับตัวเศษ (<M>{`f(x_r)-f(x_l)`}</M>)</p>
            <Callout kind="tip" title="⚠︎ เห็นสูตรนี้เขียนคนละหน้าตาในหน้าอื่น — อย่าตกใจ มันตัวเดียวกัน">
              <p style={{margin:"0 0 4px"}}>หน้าท่อง (#memo) กับเอกสารอาจารย์เขียนรูป “ลบออกจากปลาย”:</p>
              <MB>{`x_r=x_u-\\frac{f(x_u)\\,(x_l-x_u)}{f(x_l)-f(x_u)}\\qquad\\Longleftrightarrow\\qquad x_r=\\frac{x_l\\,f(x_u)-x_u\\,f(x_l)}{f(x_u)-f(x_l)}`}</MB>
              <p style={{margin:0}}>กระจายวงเล็บฝั่งซ้ายแล้วจะยุบเป็นฝั่งขวาพอดี — <b>ให้ผลลัพธ์เท่ากันทุกหลักทศนิยม</b> (ตรวจด้วยโปรแกรมแล้ว) · <b>ใช้รูปไหนก็ได้ในข้อสอบ</b> เลือกอันที่จำแม่นกว่า · รูปขวาสั้นกว่าเลยเหมาะกับเขียนโค้ด รูปซ้ายเห็นชัดกว่าว่า “ขยับจากปลายเข้ามาเท่าไร”</p>
            </Callout>
          </div>
        }>
          <CodeBlock code={`# เปลี่ยน Bisection เป็น False Position — แก้บรรทัดเดียว
while True:
    xm = # ▁▁▁▁▁ เติมสูตร False Position ▁▁▁▁▁
    ...`}/>
        </Problem>

        <Problem label="C3 · Newton — Iteration Form + สิ่งที่ต้องเตรียม" solution={
          <div>
            <CodeBlock code={`def fp(x): return 2*x          # ต้องเตรียมอนุพันธ์ไว้ด้วย

    xn = x - f(x)/fp(x)`}/>
            <p style={{margin:"6px 0 0"}}>Newton เป็นวิธี<b>เดียว</b>ในบทนี้ที่ต้องมี <M>{`f'`}</M> · <span style={{color:"var(--yellow)"}}>ถ้าโจทย์ให้ฟังก์ชันที่ diff ยาก ให้เปลี่ยนไปใช้ Secant หรือหา <M>{`f'`}</M> ด้วย <code>(f(x+h)-f(x-h))/(2*h)</code></span></p>
          </div>
        }>
          <CodeBlock code={`def f(x): return x**2 - 7
# ▁▁▁ ต้องเตรียมอะไรเพิ่มอีก 1 บรรทัด? ▁▁▁

x, tol = 2.0, 0.001
while True:
    xn = # ▁▁▁ เติม Iteration Form ▁▁▁
    if abs(xn - x) < tol:
        break
    x = xn`}/>
        </Problem>

        <Problem label="C4 · Secant — บรรทัดที่ลืมบ่อยที่สุด" solution={
          <div>
            <CodeBlock code={`    x0, x1 = x1, x2`}/>
            <p style={{margin:"6px 0 0"}}>ตรงกับที่อาจารย์พูด: “assign ค่า x1 เป็น x0 · assign ค่า x2 เป็น x1” · <b>ถ้าลืม</b> โปรแกรมจะคำนวณค่าเดิมซ้ำไม่รู้จบ · <b>ถ้าเขียนเป็น <code>x1 = x2</code> อย่างเดียว</b> (ตรึง <code>x0</code> ไว้) มันจะกลายเป็น False Position คนละวิธีเลย</p>
          </div>
        }>
          <CodeBlock code={`x0, x1 = 3.0, 2.0
while True:
    x2 = x1 - f(x1)*(x0 - x1) / (f(x0) - f(x1))
    if abs(x2 - x1) < tol:
        break
    # ▁▁▁ เติม 1 บรรทัด ▁▁▁`}/>
        </Problem>

        <Problem label="C5 · One-point — isolation form ของ e⁻ˣ" solution={
          <div>
            <CodeBlock code={`def g(x): return math.exp(-x)

    xn = g(x)`}/>
            <p style={{margin:"6px 0 0"}}>จาก <M>{`e^{-x}-x=0`}</M> ⇒ ย้ายข้างได้ <M>{`x=e^{-x}`}</M> ⇒ <M>{`x_{i+1}=e^{-x_i}`}</M> · <b>วิธีคิดของอาจารย์:</b> แยก <M>{`f_1(x)=x`}</M> (เสมอ) กับ <M>{`f_2(x)=`}</M> ที่เหลือ แล้ว isolation form คือ <M>{`x=f_2(x)`}</M></p>
          </div>
        }>
          จากสมการ <M>{`e^{-x}-x=0`}</M> จงเขียน 2 บรรทัดนี้: (ก) นิยาม <code>g(x)</code> (ข) บรรทัด Iteration Form ในลูป
        </Problem>

        <Problem label="C6 · Composite Simpson — น้ำหนักในลูป" solution={
          <div>
            <CodeBlock code={`    s += (4 if i % 2 else 2) * f(a + i*h)

I = h/3 * s`}/>
            <p style={{margin:"6px 0 0"}}><code>i % 2</code> เป็นจริงเมื่อ <M>i</M> เป็น<b>เลขคี่</b> → ได้ 4 · เป็นเท็จเมื่อคู่ → ได้ 2 · <span style={{color:"var(--yellow)"}}>อย่าลืมเปลี่ยนตัวคูณข้างนอกจาก <code>h/2</code> เป็น <code>h/3</code> ด้วย — เปลี่ยนแค่จุดเดียวคือผิด</span></p>
          </div>
        }>
          <CodeBlock code={`s = f(a) + f(b)
for i in range(1, n):
    # ▁▁▁ เติมบรรทัดสะสมแบบ Simpson ▁▁▁

I = # ▁▁▁ เติมตัวคูณข้างนอก ▁▁▁`}/>
        </Problem>

        <Problem label="C7 · Finite difference — f″ ชุดละเอียด" solution={
          <div>
            <CodeBlock code={`d2 = (-f(x0+2*h) + 16*f(x0+h) - 30*f(x0) + 16*f(x0-h) - f(x0-2*h)) / (12*h**2)`}/>
            <p style={{margin:"6px 0 0"}}><b>เช็คทันที:</b> <M>{`-1+16-30+16-1=0`}</M> ✓ · สัมประสิทธิ์<b>สมมาตร</b>รอบจุดกลางเสมอสำหรับสูตร central · ตัวหารเป็น <M>{`12h^2`}</M> (มี <M>{`h^2`}</M> เพราะเป็นอนุพันธ์อันดับ 2)</p>
          </div>
        }>
          เขียนบรรทัดคำนวณ <M>{`f''(x_0)`}</M> ด้วย <b>central difference <M>{`O(h^4)`}</M></b> (ใช้ 5 จุด)
        </Problem>

        <Problem label="C8 · เงื่อนไขหยุด — แบบที่อาจารย์ใช้" solution={
          <div>
            <CodeBlock code={`    if abs(xn - x) < tol:      # tol = 0.001
        break`}/>
            <p style={{margin:"6px 0 0"}}><b>absolute</b> — เอาผลต่างดิบ <b>ไม่หาร</b>ด้วยอะไร · <span style={{color:"var(--yellow)"}}>ต่างจาก <M>{`\\varepsilon`}</M> ที่ใช้<b>รายงานในตาราง</b> ซึ่งเป็น <M>{`\\left|\\frac{x_{i+1}-x_i}{x_{i+1}}\\right|`}</M> (relative) — สลับกันเมื่อไหร่จำนวนรอบจะไม่เท่ากัน</span></p>
            <p style={{margin:"6px 0 0", fontSize:'0.82rem', color:"var(--text-dim)"}}>ยกเว้นโจทย์สั่งเอง เช่น “จนทศนิยม 6 ตำแหน่งไม่เปลี่ยน” → ใช้ <code>tol = 1e-6</code></p>
          </div>
        }>
          เขียนเงื่อนไขหยุดที่อาจารย์ใช้เป็นปกติ พร้อมบอกค่า <code>tol</code> ที่เขาตั้ง และบอกว่าต่างจาก <M>{`\\varepsilon`}</M> ในตารางยังไง
        </Problem>

        <Problem label="C9 · Gauss — ลูป forward elimination ⭐" solution={
          <div>
            <CodeBlock code={`    for i in range(k+1, n):
        factor = M[i][k] / M[k][k]
        for j in range(k, n+1):
            M[i][j] -= factor * M[k][j]`}/>
            <p style={{margin:"6px 0 0"}}><b>จุดตาย 2 จุดในสี่บรรทัดนี้:</b> <span style={{color:"var(--yellow)"}}>(1) <code>range(k, n+1)</code> ต้องมี <b>+1</b> เพื่อกินคอลัมน์ <M>b</M> ด้วย — ถ้าลืม <M>U</M> ถูกแต่คำตอบผิดทั้งหมด</span> (2) <code>factor</code> ต้องคำนวณ<b>ก่อน</b>เข้าลูป <code>j</code> — ถ้าคำนวณข้างในลูป <code>M[i][k]</code> จะกลายเป็น 0 ตั้งแต่รอบแรกแล้ว factor เป็น 0 หมด</p>
          </div>
        }>
          <CodeBlock code={`M = [A[i][:] + [b[i]] for i in range(n)]

for k in range(n):
    # ▁▁▁▁▁ เติม 4 บรรทัด: ทำให้ใต้ pivot ของคอลัมน์ k เป็น 0 ▁▁▁▁▁

# (back substitution อยู่ข้างล่าง)`}/>
        </Problem>

        <Problem label="C10 · Gauss — back substitution + Cramer copy เมทริกซ์" solution={
          <div>
            <CodeBlock code={`x = [0] * n
for i in range(n-1, -1, -1):
    s = M[i][n]
    for j in range(i+1, n):
        s -= M[i][j] * x[j]
    x[i] = s / M[i][i]

# Cramer: คัดลอกเมทริกซ์ก่อนแทนคอลัมน์
Ak = [row[:] for row in A]`}/>
            <p style={{margin:"6px 0 0"}}><b>back substitution:</b> วน <b>ถอยหลัง</b> เพราะรู้ <M>{`x_n`}</M> ก่อนเป็นตัวแรก · <code>s</code> เริ่มจาก <code>M[i][n]</code> (ค่า <M>b</M> ของแถวนั้น) แล้วลบพจน์ที่รู้แล้วออก · <span style={{color:"var(--yellow)"}}>ห้ามลืม <code>/ M[i][i]</code> บรรทัดสุดท้าย</span></p>
            <p style={{margin:"6px 0 0"}}><b>Cramer:</b> <code>Ak = A</code> กับ <code>A[:]</code> ยังชี้แถวเดิม ⇒ แทนคอลัมน์แล้วไปแก้ <M>A</M> ตัวจริง · โปรแกรม<b>ไม่ error แต่เลขผิด</b></p>
          </div>
        }>
          เขียน 2 ก้อนนี้: (ก) <b>back substitution</b> ของ Gauss ครบทั้งลูป (ข) บรรทัด<b>คัดลอกเมทริกซ์</b>ของ Cramer ก่อนแทนคอลัมน์ด้วย <M>b</M>
        </Problem>


        <Problem label="C11 · Gauss-Jordan — 2 บรรทัดที่ทำให้มันไม่ใช่ Gauss ธรรมดา" solution={
          <div>
            <CodeBlock code={`    p = M[k][k]
    for j in range(k, n+1):        # ① normalize แถว pivot ให้ตัวหลัก = 1
        M[k][j] /= p
    for i in range(n):             # ② กำจัด "ทุกแถว" ไม่ใช่แค่ข้างล่าง
        if i != k:`}/>
            <p style={{margin:"6px 0 0"}}>ขาด ① ⇒ ได้แค่ diagonal matrix ต้องหารทีหลัง · ขาด ② (เขียน <code>range(k+1, n)</code>) ⇒ ได้ Gauss ธรรมดา ต้อง back-substitute ⇒ <b>คำตอบในคอลัมน์ b ยังผิดอยู่</b></p>
          </div>
        }>
          <CodeBlock code={`for k in range(n):
    # ▁▁▁▁▁ เติม: ทำตัวหลักให้เป็น 1 ▁▁▁▁▁
    # ▁▁▁▁▁ เติม: หัวลูปที่กำจัดทุกแถวยกเว้นแถว pivot ▁▁▁▁▁
            f = M[i][k]
            for j in range(k, n+1):
                M[i][j] -= f * M[k][j]`}/>
        </Problem>

        <Problem label="C12 · Matrix Inversion — ตัวเลขในลูปที่ต่างจาก Gauss-Jordan" solution={
          <div>
            <CodeBlock code={`M = [A[i][:] + [1.0 if i == j else 0.0 for j in range(n)]
     for i in range(n)]            # augment [A|I]
# ...
    for j in range(k, 2*n):        # ★ 2*n ไม่ใช่ n  (ทั้งสองลูป j)
Ainv = [row[n:] for row in M]      # ครึ่งขวาคือ A^-1`}/>
            <p style={{margin:"6px 0 0"}}>ถ้าเขียน <code>range(k, n)</code> ครึ่งขวาไม่ถูกแตะเลย ⇒ <code>Ainv</code> ออกมาเป็น <M>I</M> เดิม ⇒ <M>{`x = I\\cdot b = b`}</M> · <b>รันผ่านไม่ error แต่ได้ b คืนมาเฉย ๆ</b></p>
          </div>
        }>
          เติม 3 จุด: (ก) บรรทัด <b>augment</b> <M>{`[A\\mid I]`}</M> (ข) <b>ขอบเขตลูป j</b> ทั้งสองที่ (ค) บรรทัดดึง <M>{`A^{-1}`}</M> ออกมาหลังจบ
        </Problem>

        <Problem label="C13 · LU — บรรทัดที่ต้องอยู่ก่อน ไม่ใช่หลัง ⭐" solution={
          <div>
            <CodeBlock code={`        f = U[i][k] / U[k][k]
        L[i][k] = f                # ★ เก็บก่อน
        for j in range(k, n):      # แล้วค่อยกำจัด
            U[i][j] -= f * U[k][j]`}/>
            <p style={{margin:"6px 0 0"}}>สลับลำดับ (กำจัดก่อนแล้วค่อยเก็บ <code>L[i][k] = U[i][k]/U[k][k]</code>) ⇒ ตอนนั้น <code>U[i][k]</code> เป็น 0 ไปแล้ว ⇒ <b><M>L</M> กลายเป็นเมทริกซ์เอกลักษณ์</b> · ตรวจได้ด้วย <b>คูณ L·U กลับ ต้องได้ A</b></p>
          </div>
        }>
          <CodeBlock code={`for k in range(n):
    for i in range(k+1, n):
        # ▁▁▁▁▁ เติม 4 บรรทัด: หา f, เก็บลง L, แล้วกำจัดแถว i ▁▁▁▁▁`}/>
        </Problem>

        <Problem label="C14 · LU — forward substitution ต่างจาก Cholesky ตรงไหน" solution={
          <div>
            <CodeBlock code={`# LU (Doolittle) — diag L = 1 จึงไม่ต้องหาร
for i in range(n):
    y[i] = b[i] - sum(L[i][k]*y[k] for k in range(i))

# Cholesky — diag L ไม่ใช่ 1 ต้องหาร
for i in range(n):
    y[i] = (b[i] - sum(L[i][k]*y[k] for k in range(i))) / L[i][i]`}/>
            <p style={{margin:"6px 0 0"}}><b>นี่คือจุดที่พลาดตอนลอกโค้ด LU มาทำ Cholesky</b> — ลืมใส่ <code>/ L[i][i]</code> · โปรแกรมรันผ่าน แต่ <M>y</M> ผิดตั้งแต่ตัวแรก</p>
          </div>
        }>
          เขียน <b>forward substitution</b> ของทั้ง 2 วิธี แล้วบอกว่า<b>ต่างกันตรงไหน</b> และ<b>ทำไม</b>
        </Problem>

        <Problem label="C15 · Cholesky — สูตร 2 บรรทัดในลูป" solution={
          <div>
            <CodeBlock code={`        s = sum(L[i][k]*L[j][k] for k in range(j))
        if i == j:
            L[i][j] = math.sqrt(A[i][i] - s)
        else:
            L[i][j] = (A[i][j] - s) / L[j][j]`}/>
            <p style={{margin:"6px 0 0"}}>ผลรวม <code>s</code> วิ่งถึง <code>range(j)</code> เท่านั้น (ไม่ใช่ <code>range(i)</code>) — คือช่องที่คำนวณเสร็จแล้วทางซ้ายของคอลัมน์ <M>j</M> · <span style={{color:"var(--yellow)"}}>ถ้า <M>{`A_{ii}-s<0`}</M> แปลว่าไม่ใช่ SPD ⇒ ต้องเปลี่ยนไปใช้ LU</span></p>
          </div>
        }>
          <CodeBlock code={`for i in range(n):
    for j in range(i+1):
        # ▁▁▁▁▁ เติม 5 บรรทัด: หา s แล้วแยกกรณีแนวทแยง / ใต้แนวทแยง ▁▁▁▁▁`}/>
        </Problem>

        <Problem label="C16 · Jacobi vs Gauss-Seidel — บรรทัดเดียวที่ต่างกัน ⭐" solution={
          <div>
            <CodeBlock code={`    old = x[:]                                             # ★ ต้องมีทั้งสองวิธี (ใช้วัด err)
    for i in range(n):
        s = sum(A[i][j]*old[j] for j in range(n) if j != i)   # Jacobi   → old
        # s = sum(A[i][j]*x[j] for j in range(n) if j != i)   # G-Seidel → x
        x[i] = (b[i] - s) / A[i][i]
    err = max(abs(x[i] - old[i]) for i in range(n))`}/>
            <p style={{margin:"6px 0 0"}}><b>Jacobi อ่านจาก <code>old</code></b> (ค่าทั้งชุดของรอบก่อน) · <b>Gauss-Seidel อ่านจาก <code>x</code></b> ที่เพิ่งเขียนทับไปในรอบเดียวกัน · <span style={{color:"var(--yellow)"}}><code>old = x</code> เฉย ๆ ไม่พอ ต้อง <code>x[:]</code> ไม่งั้นชี้ลิสต์เดียวกัน ⇒ Jacobi กลายเป็น Gauss-Seidel เงียบ ๆ</span></p>
          </div>
        }>
          เขียนตัวลูปด้านในให้ครบ แล้วชี้ว่า<b>บรรทัดไหนตัวเดียว</b>ที่เปลี่ยน Jacobi เป็น Gauss-Seidel
        </Problem>

        <Problem label="C17 · Newton Divided-Difference — ทิศทางของลูป" solution={
          <div>
            <CodeBlock code={`c = ys[:]
for j in range(1, n):
    for i in range(n-1, j-1, -1):          # ★ ถอยหลัง
        c[i] = (c[i] - c[i-1]) / (xs[i] - xs[i-j])`}/>
            <p style={{margin:"6px 0 0"}}>ถ้าวนไปหน้า (<code>range(j, n)</code>) จะเขียนทับ <code>c[i-1]</code> ที่รอบถัดไปยังต้องใช้ ⇒ <b>ตารางเพี้ยนตั้งแต่ order 2</b> · ตัวหารคือ <code>xs[i] - xs[i-j]</code> — ระยะ <b>j ช่อง</b> ไม่ใช่ช่องเดียว</p>
          </div>
        }>
          <CodeBlock code={`c = ys[:]
for j in range(1, n):
    # ▁▁▁▁▁ เติม 2 บรรทัด: ลูป i และสูตร divided difference ▁▁▁▁▁`}/>
        </Problem>

        <Problem label="C18 · Lagrange + Regression — 2 บรรทัดที่ลืมบ่อยสุดของ 2 บท" solution={
          <div>
            <CodeBlock code={`# Lagrange — ข้ามตัวเอง
    for j in range(n):
        if j != i:
            Li *= (xq - xs[j]) / (xs[i] - xs[j])

# Linear Regression — a0 ใช้ "ค่าเฉลี่ย"
a1 = (n*Sxy - Sx*Sy) / (n*Sxx - Sx*Sx)
a0 = Sy/n - a1*Sx/n`}/>
            <p style={{margin:"6px 0 0"}}>ลืม <code>if j != i</code> ⇒ <code>(xs[i]-xs[i]) = 0</code> ⇒ ZeroDivisionError (โชคดีที่ error ให้เห็น) · <code>a0</code> เขียน <code>Sy - a1*Sx</code> ⇒ ลืมหาร <M>n</M> ⇒ เส้นเลื่อนขึ้นทั้งเส้น <b>ไม่ error แต่ผิด</b></p>
          </div>
        }>
          เติม (ก) บรรทัดกันหารศูนย์ของ <b>Lagrange</b> (ข) สูตร <M>{`a_1`}</M> และ <M>{`a_0`}</M> ของ <b>Linear Regression</b>
        </Problem>
        </TimedExam>
      </Sect>

      {/* ═══════════ 3 · กระดาษเปล่า ═══════════ */}
      <Sect tag="3" title="ดริลกระดาษเปล่า · 11 ข้อ — เขียนทั้งโปรแกรมโดยไม่ดูอะไรเลย (P6–P11 = ของไฟนอล)">
        <Callout kind="danger" title="กติกาของดริลนี้ — ทำแบบนี้เท่านั้นถึงจะได้ผล">
          <ol style={{margin:0, paddingLeft:20}}>
            <li>ปิดหน้าจอ หยิบ<b>กระดาษเปล่ากับปากกา</b> (เขียนบนคอมไม่นับ เพราะในห้องสอบไม่มี autocomplete)</li>
            <li>เขียนให้จบทั้งโปรแกรมโดย<b>ไม่เปิดดูอะไรเลย</b> จับเวลาข้อละ 10 นาที</li>
            <li>เขียนเสร็จค่อยกดดูเฉลย แล้วเทียบว่าขาดบรรทัดไหน</li>
            <li>บรรทัดที่ขาด <b>จดไว้ในสมุดแยก</b> แล้ววันรุ่งขึ้นเขียนข้อเดิมใหม่</li>
          </ol>
        </Callout>

        <TimedExam presets={[110, 60, 30]} label="11 ข้อ · แนะนำ 110 นาที (ข้อละ 10 นาที)">

        <Problem label="P1 · Bisection เต็มรูปแบบ" solution={
          <div>
            <PythonRunner code={`def f(x):
    return x**4 - 13

xl, xr = 1.5, 2.0
tol = 0.001
prev = None
i = 0

while True:
    xm = (xl + xr) / 2
    i += 1
    if prev is not None and abs(xm - prev) < tol:
        break
    if f(xl) * f(xm) > 0:
        xl = xm
    else:
        xr = xm
    prev = xm
    print(f"รอบ {i}: xl={xl:.6f} xr={xr:.6f} xm={xm:.6f} f={f(xm):+.6f}")

print(f"\\nคำตอบ: {round(xm, 6)}   (ใช้ {i} รอบ)")
print("ค่าจริง ⁴√13 = 1.898829")`} height={330}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (5 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li>มี <code>def f(x)</code> และ return ถูกฟังก์ชัน</li>
                <li>มี <code>xl, xr, tol</code> ครบ (① Initial Value)</li>
                <li>สูตร <code>xm = (xl+xr)/2</code> ถูก (② Iteration Form)</li>
                <li>เงื่อนไขหยุดเป็น <b>absolute</b> และมี <code>prev</code> กันรอบแรก (③)</li>
                <li>บรรทัดตัดสินใจเทียบกับ <code>f(xl)</code> และ <code>prev = xm</code> อยู่ท้ายลูป</li>
              </ul>
            </Callout>
          </div>
        }>
          เขียนโปรแกรมหา <M>{`\\sqrt[4]{13}`}</M> ด้วย <b>Bisection</b> บนช่วง <M>{`[1.5,\\,2.0]`}</M> หยุดเมื่อ <M>{`|\\Delta x_m|<0.001`}</M> และพิมพ์คำตอบเป็นทศนิยม 6 ตำแหน่ง
        </Problem>

        <Problem label="P2 · Secant เต็มรูปแบบ (ระวังบรรทัดเลื่อนตัวแปร)" solution={
          <div>
            <PythonRunner code={`def f(x):
    return x**2 - 7

x0, x1 = 3.0, 2.0
tol = 0.001
i = 0

while True:
    x2 = x1 - f(x1)*(x0 - x1) / (f(x0) - f(x1))
    i += 1
    print(f"รอบ {i}: x0={x0:.7f} x1={x1:.7f} -> x2={x2:.7f}  |dx|={abs(x2-x1):.7f}")
    if abs(x2 - x1) < tol:
        break
    x0, x1 = x1, x2          # ★ บรรทัดที่ลืมบ่อยที่สุด

import math
print(f"\\nคำตอบ: {round(x2, 6)}   (ใช้ {i} รอบ)")
print(f"ค่าจริง √7 = {math.sqrt(7):.7f}")`} height={310}/>
            <Callout kind="warn" title="ถ้าลืมบรรทัด x0, x1 = x1, x2 จะเกิดอะไร">
              <p style={{margin:0}}>โปรแกรมจะคำนวณ <M>{`x_2`}</M> จากคู่จุดเดิมทุกรอบ ⇒ ได้ค่าเดิมซ้ำไปเรื่อย ๆ ⇒ <code>abs(x2-x1)</code> ไม่ลด ⇒ <b>ลูปไม่มีวันจบ</b> · ถ้าในห้องสอบเขียนแล้วรู้สึกว่า “ทำไมมันไม่หยุด” ให้เช็คบรรทัดนี้เป็นอันดับแรก</p>
            </Callout>
          </div>
        }>
          เขียนโปรแกรมหา <M>{`\\sqrt{7}`}</M> ด้วย <b>Secant</b> โดย <M>{`x_0=3,\\ x_1=2`}</M> หยุดเมื่อ <M>{`|\\Delta x|<0.001`}</M> — นี่คือโจทย์ที่อาจารย์ให้ทำในคาบ 5 ส.ค.
        </Problem>

        <Problem label="P3 · Composite Simpson เต็มรูปแบบ" solution={
          <div>
            <PythonRunner code={`import math

def f(x):
    return math.log(x)

a, b = 1, 2
n = 3                    # n = จำนวนพาราโบลา
m = 2 * n                # ช่องย่อย = 2n
h = (b - a) / m

s = f(a) + f(b)
for i in range(1, m):
    s += (4 if i % 2 else 2) * f(a + i*h)

I = h/3 * s
exact = 2*math.log(2) - 1

print(f"h = {h}")
print(f"I = {round(I, 6)}")
print(f"exact = {exact:.6f}   error = {abs(exact-I)/exact*100:.4f}%")`} height={300}/>
            <Callout kind="tip" title="จุดที่พลาดง่ายที่สุดในข้อนี้">
              <p style={{margin:0}}>โจทย์บอก <M>{`n=3`}</M> <b>พาราโบลา</b> ⇒ ต้องแปลงเป็นช่องย่อย <M>{`m=2n=6`}</M> ก่อนคำนวณ <M>h</M> · ถ้าใช้ <M>{`h=(b-a)/3`}</M> ตรง ๆ จะได้จำนวนช่องเป็นเลขคี่ ซึ่ง Simpson ใช้ไม่ได้</p>
            </Callout>
          </div>
        }>
          เขียนโปรแกรมหา <M>{`\\int_1^2 \\ln x\\,dx`}</M> ด้วย <b>Composite Simpson</b> โดยใช้ <M>{`n=3`}</M> พาราโบลา แล้วเทียบกับค่าจริง <M>{`2\\ln 2-1`}</M>
        </Problem>

        <Problem label="P4 · Newton ที่ต้องหา f′ เอง (ข้อ “วัดมันสมอง”)" solution={
          <div>
            <PythonRunner code={`import math

def f(x):
    return math.exp(-x) - x          # โจทย์

def fp(x, h=1e-6):                   # หา f' ด้วย central difference
    return (f(x + h) - f(x - h)) / (2*h)

x = 0.5
tol = 0.001
i = 0

while True:
    xn = x - f(x)/fp(x)
    i += 1
    print(f"รอบ {i}: x={x:.7f} -> {xn:.7f}   |dx|={abs(xn-x):.7f}")
    if abs(xn - x) < tol:
        break
    x = xn

print(f"\\nคำตอบ: {round(xn, 6)}   (ใช้ {i} รอบ)")
print("ค่าจริง = 0.567143")
print("\\n(ถ้า diff เองได้: f'(x) = -e^(-x) - 1 -> ผลลัพธ์เท่ากัน)")`} height={330}/>
            <Callout kind="good" title="ทำไมข้อนี้ถึงเป็น “วัดมันสมอง”">
              <p style={{margin:0}}>เพราะมันวัดว่าคุณรู้ไหมว่า <b>Newton ต้องมี <M>{`f'`}</M></b> และรู้ไหมว่า<b>ถ้าไม่อยาก diff ก็หามันด้วยวิธีเชิงตัวเลขได้</b> — เป็นการเอาบท Differentiation มาต่อกับบท Root Finding ซึ่งเป็นแนวที่อาจารย์ชอบออก · จะเลือกใช้ Secant แทนก็ได้ ตอบถูกเหมือนกัน</p>
            </Callout>
          </div>
        }>
          เขียนโปรแกรมหารากของ <M>{`e^{-x}-x=0`}</M> ด้วย <b>Newton-Raphson</b> จาก <M>{`x_0=0.5`}</M> โดย<b>ไม่ต้องหาอนุพันธ์ด้วยมือ</b> (ให้โปรแกรมหา <M>{`f'`}</M> เอง) หยุดเมื่อ <M>{`|\\Delta x|<0.001`}</M>
        </Problem>

        <Problem label="P5 · Gauss Elimination เต็มรูปแบบ (ระบบตัวเก็งของบท Linear) ⭐" solution={
          <div>
            <PythonRunner code={`A = [[-2,  3,  1],
     [ 3,  4, -5],
     [ 1, -2,  1]]
b = [9, 0, -4]
n = len(A)

M = [A[i][:] + [b[i]] for i in range(n)]
swaps = 0

# Forward elimination
for k in range(n):
    if M[k][k] == 0:
        for r in range(k+1, n):
            if M[r][k] != 0:
                M[k], M[r] = M[r], M[k]
                swaps += 1
                break
    for i in range(k+1, n):
        factor = M[i][k] / M[k][k]
        for j in range(k, n+1):
            M[i][j] -= factor * M[k][j]
    print(f"หลัง eliminate คอลัมน์ {k+1}:")
    for row in M:
        print("   ", [f"{v:8.4f}" for v in row])

# Back substitution
x = [0] * n
for i in range(n-1, -1, -1):
    s = M[i][n]
    for j in range(i+1, n):
        s -= M[i][j] * x[j]
    x[i] = s / M[i][i]

print()
for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")

# ของแถม: det A = ผลคูณ pivot x (-1)^(จำนวนครั้งที่สลับแถว)
det = (-1)**swaps
for i in range(n):
    det *= M[i][i]
print(f"\\ndet A = {det:.4f}   (สลับแถว {swaps} ครั้ง)")

# แทนกลับตรวจ
print("แทนกลับตรวจ:", [round(sum(A[i][j]*x[j] for j in range(n)), 6) for i in range(n)], "vs", b)`} height={380}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (6 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li>สร้าง augmented <code>[A|b]</code> ถูก (แถวละ <M>{`n+1`}</M> ช่อง)</li>
                <li>ลูปนอก <code>for k</code> · ลูปกลาง <code>for i in range(k+1, n)</code></li>
                <li><b><code>for j in range(k, n+1)</code> มี +1</b> — จุดตายอันดับ 1</li>
                <li><code>factor</code> คำนวณ<b>ก่อน</b>เข้าลูป <code>j</code></li>
                <li>back substitution วนถอยหลัง และ<b>หารด้วย <code>M[i][i]</code></b> ตอนท้าย</li>
                <li>print เป็น<b>ทศนิยม</b> ไม่ใช่เศษส่วน</li>
              </ul>
            </Callout>
            <Callout kind="good" title="ทำไมใช้ระบบนี้">
              <p style={{margin:0}}>เป็นระบบเดียวกับ<b>การบ้าน 6-7 ของปีนี้</b> (<code>numer_ชีทเรียนปีนี้/1_การบ้าน/การบ้าน06-07 Linear 8 วิธี.pdf</code> — ยืนยันแล้ว 4 ก.ย. ว่าตัวเลขตรงกับใบปีที่แล้วเป๊ะ เพิ่มแค่ Jacobi/Gauss-Seidel เป็น 8 ข้อ) ⇒ ระบบนี้คือตัวที่ต้องเดินให้คล่องที่สุด · คำตอบเป็น<b>จำนวนเต็มพอดี <M>{`(-1,\\,2,\\,1)`}</M></b> ⇒ แทนกลับแล้วต้องลงตัวเป๊ะทั้ง 3 บรรทัด ถ้าไม่ลงตัวคือคำนวณผิด รู้ทันทีในห้องสอบ</p>
            </Callout>
          </div>
        }>
          เขียนโปรแกรม <b>Gauss Elimination</b> (forward elimination + back substitution) แก้ระบบ
          <MB>{`\\begin{cases}-2x_1+3x_2+x_3=9\\\\ 3x_1+4x_2-5x_3=0\\\\ x_1-2x_2+x_3=-4\\end{cases}`}</MB>
          พิมพ์ <M>{`x_1,x_2,x_3`}</M> เป็นทศนิยม 6 ตำแหน่ง · <b>โบนัส:</b> ให้โปรแกรมคำนวณ <M>{`\\det A`}</M> จากผลคูณ pivot ด้วย
        </Problem>


        <Problem label="P6 · LU Decomposition เต็มรูปแบบ (การบ้าน 6-7 ข้อ 1.5) ⭐" solution={
          <div>
            <PythonRunner code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]
b = [9, 0, -4]
n = len(A)

L = [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]
U = [row[:] for row in A]

for k in range(n):
    for i in range(k+1, n):
        f = U[i][k] / U[k][k]
        L[i][k] = f                      # เก็บก่อน แล้วค่อยกำจัด
        for j in range(k, n):
            U[i][j] -= f * U[k][j]

print("L =")
for r in L: print("  ", [f"{v:8.4f}" for v in r])
print("U =")
for r in U: print("  ", [f"{v:8.4f}" for v in r])

y = [0.0] * n                            # Ly = b
for i in range(n):
    y[i] = b[i] - sum(L[i][k]*y[k] for k in range(i))
print("\\ny =", [f"{v:.6f}" for v in y])

x = [0.0] * n                            # Ux = y
for i in range(n-1, -1, -1):
    x[i] = (y[i] - sum(U[i][j]*x[j] for j in range(i+1, n))) / U[i][i]

for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")

chk = [sum(A[i][j]*x[j] for j in range(n)) for i in range(n)]
print("\\nแทนกลับ Ax =", [f"{v:.4f}" for v in chk], " ต้องได้ b =", b)`} height={420}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (6 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li>ใช้ <code>n = len(A)</code> ไม่ฮาร์ดโค้ด 3</li>
                <li><code>U = [row[:] for row in A]</code> — copy ทีละแถว ไม่ใช่ <code>A[:]</code></li>
                <li><code>L</code> เริ่มด้วย 1 บนแนวทแยง (Doolittle)</li>
                <li><b><code>L[i][k] = f</code> อยู่ก่อนลูปกำจัด</b> — จุดตายอันดับ 1</li>
                <li>forward sub <b>ไม่หาร</b> (diag L = 1) · back sub <b>หาร</b> <code>U[i][i]</code></li>
                <li>มีบรรทัด<b>แทนกลับตรวจ</b> ตอนท้าย</li>
              </ul>
            </Callout>
          </div>
        }>
          เขียนโปรแกรมแก้ระบบของ<b>การบ้าน 6-7</b> ด้วย <b>LU Decomposition (Doolittle)</b> · พิมพ์ <M>L</M>, <M>U</M>, <M>y</M> และ <M>x</M> · คำตอบต้องได้ <M>{`x=(-1,\\;2,\\;1)`}</M>
        </Problem>

        <Problem label="P7 · Gauss-Seidel เต็มรูปแบบ (การบ้าน 6-7 ข้อ 1.8) ⭐" solution={
          <div>
            <PythonRunner code={`# ระบบเดิมของการบ้าน 6-7 ลู่ออก -> ใช้ระบบสมมูลที่ dominant
# E1' = R2 + 2R3   E2' = R1 - R3   E3' = R1 + 2R3
A = [[5, 0, -3], [-3, 5, 0], [0, -1, 3]]
b = [-8, 13, 1]
n = len(A)

dom = all(abs(A[i][i]) > sum(abs(A[i][j]) for j in range(n) if j != i) for i in range(n))
print("diagonally dominant?", dom, "\\n")

tol = 0.001
x = [0.0] * n
k, err = 0, 1.0

while err > tol:                         # หยุดด้วย tol ไม่ใช่จำนวนรอบ
    k += 1
    old = x[:]
    for i in range(n):
        s = sum(A[i][j]*x[j] for j in range(n) if j != i)   # ใช้ x ค่าใหม่ทันที
        x[i] = (b[i] - s) / A[i][i]
    err = max(abs(x[i] - old[i]) for i in range(n))
    print(f"k={k:2d} " + "  ".join(f"{v:9.6f}" for v in x) + f"   err={err:.6f}")

print()
for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")`} height={400}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (6 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li>มีบรรทัด<b>เช็ค diagonally dominant</b> ก่อนเข้าลูป</li>
                <li>ใช้ <code>while err &gt; tol</code> ไม่ใช่ <code>for k in range(N)</code> ⭐</li>
                <li><code>old = x[:]</code> ไม่ใช่ <code>old = x</code></li>
                <li>อ่านจาก <code>x</code> (ไม่ใช่ <code>old</code>) — ไม่งั้นเป็น Jacobi</li>
                <li><code>err = max(abs(...))</code> ครบทุกตัวแปร ไม่ใช่แค่ตัวแรก</li>
                <li><b>print ทุกรอบ</b> — อาจารย์สั่ง</li>
              </ul>
              <p style={{margin:"6px 0 0"}}>ถ้าเขียนถูก ต้องจบที่ <b>รอบที่ 5</b> · เปลี่ยนเป็น Jacobi (อ่านจาก <code>old</code>) จะใช้ <b>12 รอบ</b></p>
            </Callout>
          </div>
        }>
          เขียนโปรแกรมแก้ระบบการบ้าน 6-7 ด้วย <b>Gauss-Seidel</b> · <M>{`tol = 0.001`}</M> เริ่มที่ <M>{`x^{(0)}=(0,0,0)`}</M> · <span style={{color:"var(--yellow)"}}>อย่าลืมว่าระบบเดิม<b>ลู่ออก</b> ต้องแปลงก่อน</span>
        </Problem>

        <Problem label="P8 · Newton Divided-Difference เต็มรูปแบบ" solution={
          <div>
            <PythonRunner code={`import math

xs = [1, 4, 6, 5]                        # ไม่เรียง ไม่ห่างเท่ากัน -> ต้องใช้ DD หรือ Lagrange
ys = [0, 1.386294, 1.791759, 1.609438]   # ln(x)
xq = 2
n = len(xs)

c = ys[:]
for j in range(1, n):
    for i in range(n-1, j-1, -1):        # ถอยหลัง!
        c[i] = (c[i] - c[i-1]) / (xs[i] - xs[i-j])
    print(f"order {j}: c{j} = {c[j]:.6f}")

p, term = c[0], 1.0
for k in range(1, n):
    term *= (xq - xs[k-1])
    p += c[k] * term
print(f"\\nNewton DD : f({xq}) = {p:.6f}")

pl = 0.0                                 # ตรวจด้วยวิธีที่สอง
for i in range(n):
    Li = 1.0
    for j in range(n):
        if j != i:
            Li *= (xq - xs[j]) / (xs[i] - xs[j])
    pl += ys[i] * Li
print(f"Lagrange  : f({xq}) = {pl:.6f}   (ต้องเท่ากันเป๊ะ)")
print(f"ค่าจริง ln(2) = {math.log(2):.6f}   -> error {abs(p-math.log(2)):.6f}")`} height={380}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (5 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li><code>c = ys[:]</code> copy ไม่ใช่อ้างอิงตัวเดิม</li>
                <li>ลูป <code>i</code> <b>ถอยหลัง</b> <code>range(n-1, j-1, -1)</code></li>
                <li>ตัวหาร <code>xs[i] - xs[i-j]</code> — ระยะ <b>j ช่อง</b></li>
                <li>ประกอบพหุนามด้วย <code>term *= (xq - xs[k-1])</code> สะสมไปเรื่อย ๆ</li>
                <li>มี<b>วิธีที่สองไว้ตรวจ</b> (Lagrange) — กติกาผิด=0 บังคับให้ตรวจเสมอ</li>
              </ul>
            </Callout>
          </div>
        }>
          จุด <M>{`(1,0),(4,1.386294),(6,1.791759),(5,1.609438)`}</M> · หา <M>{`f(2)`}</M> ด้วย <b>Newton Divided-Difference</b> แล้ว<b>ตรวจซ้ำด้วย Lagrange</b> — สองวิธีต้องได้เลขเท่ากัน
        </Problem>

        <Problem label="P9 · Linear Regression + Linearization เต็มรูปแบบ" solution={
          <div>
            <PythonRunner code={`import math

xs = [1, 2, 3, 4, 5, 6, 7]
ys = [0.5, 2.5, 2.0, 4.0, 3.5, 6.0, 5.5]
n = len(xs)

def fit(X, Y):                           # ใช้ซ้ำได้ทั้ง linear และ linearized
    m = len(X)
    Sx  = sum(X)
    Sy  = sum(Y)
    Sxy = sum(X[i]*Y[i] for i in range(m))
    Sxx = sum(v*v for v in X)
    a1 = (m*Sxy - Sx*Sy) / (m*Sxx - Sx*Sx)
    a0 = Sy/m - a1*Sx/m
    return a0, a1

a0, a1 = fit(xs, ys)
print(f"y = {a0:.6f} + {a1:.6f} x")

Sr = sum((ys[i] - (a0 + a1*xs[i]))**2 for i in range(n))
St = sum((y - sum(ys)/n)**2 for y in ys)
print(f"Sr = {Sr:.6f}   St = {St:.6f}   r2 = {1 - Sr/St:.6f}")

# ── Linearization: y = a*x^b  ->  ln y = ln a + b ln x ──
X2 = [1, 2, 3, 4, 5]
Y2 = [0.5, 1.7, 3.4, 5.7, 8.4]
lx = [math.log(v) for v in X2]
ly = [math.log(v) for v in Y2]
c0, b = fit(lx, ly)
a = math.exp(c0)                         # ★ ต้อง exp กลับ ไม่ใช่ตอบ c0 ตรง ๆ
print(f"\\npower model: y = {a:.6f} * x^{b:.6f}")
print(f"ทำนาย y(6) = {a * 6**b:.6f}")`} height={400}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (5 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li>ผลรวมครบ 4 ตัว: <code>Sx, Sy, Sxy, Sxx</code></li>
                <li><code>a0 = Sy/n - a1*Sx/n</code> — <b>ใช้ค่าเฉลี่ย</b> ไม่ใช่ผลรวมดิบ</li>
                <li>มี <M>{`r^2`}</M> จาก <M>{`1 - S_r/S_t`}</M></li>
                <li>Linearization: take log <b>ทั้งสองแกน</b> สำหรับ power model</li>
                <li><b><M>{`a = e^{c_0}`}</M></b> — ลืม exp กลับคือกับดักอันดับ 1 ของหัวข้อนี้</li>
              </ul>
            </Callout>
          </div>
        }>
          (ก) fit เส้นตรงกับข้อมูล 7 จุด แล้วรายงาน <M>{`a_0, a_1, r^2`}</M> &nbsp;(ข) ข้อมูลชุดที่สองเป็น <M>{`y=ax^b`}</M> — จัดรูปให้เป็นเชิงเส้นแล้ว fit ด้วย<b>ฟังก์ชันเดิม</b> · <span style={{color:"var(--yellow)"}}>ต้อง <M>{`a=e^{c_0}`}</M> ตอนแปลงกลับ</span>
        </Problem>

        <Problem label="P10 · [การบ้าน 9] Newton DD 3 แบบ — recursive · top-down · bottom-up ⭐" solution={
          <div>
            <PythonRunner code={`# การบ้าน 9 · Newton Divided-Difference 3 แบบ (x = 4.2)
xs = [0, 2, 4, 6, 8]
ys = [9.81, 9.7487, 9.6879, 9.6879, 9.5682]
xq = 4.2
n = len(xs)

# (1) recursive — f[x_i..x_j]
def dd_rec(i, j):
    if i == j:
        return ys[i]
    return (dd_rec(i+1, j) - dd_rec(i, j-1)) / (xs[j] - xs[i])

# (2) DP top-down — recursive + จำคำตอบไว้ใน memo
memo = {}
def dd_memo(i, j):
    if (i, j) in memo:
        return memo[(i, j)]
    if i == j:
        r = ys[i]
    else:
        r = (dd_memo(i+1, j) - dd_memo(i, j-1)) / (xs[j] - xs[i])
    memo[(i, j)] = r
    return r

# (3) DP bottom-up — ตารางสามเหลี่ยมแบบในชีท
T = [[0.0]*n for _ in range(n)]
for i in range(n):
    T[i][0] = ys[i]
for j in range(1, n):
    for i in range(n-j):
        T[i][j] = (T[i+1][j-1] - T[i][j-1]) / (xs[i+j] - xs[i])

def newton(C):                      # C[k] = f[x0..xk]
    total, term = 0.0, 1.0
    for k in range(n):
        total += C[k] * term
        term *= (xq - xs[k])
    return total

C1 = [dd_rec(0, k) for k in range(n)]
C2 = [dd_memo(0, k) for k in range(n)]
C3 = [T[0][k] for k in range(n)]      # แถวบนสุด = สัมประสิทธิ์
for name, C in [("recursive", C1), ("top-down ", C2), ("bottom-up", C3)]:
    print(name, f"f({xq}) = {newton(C):.6f}")`} height={560}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (4 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li>recursive: ฐาน <code>i == j</code> คืน <code>ys[i]</code> · ตัวหารคือ <code>xs[j] - xs[i]</code> (ปลายขวา − ปลายซ้าย)</li>
                <li>top-down = recursive <b>ตัวเดิมเป๊ะ</b> + เช็ค <code>memo</code> ก่อน + เก็บผลก่อน return</li>
                <li>bottom-up: สัมประสิทธิ์คือ<b>แถวบนสุด</b> <code>T[0][k]</code> · ตัวหาร <code>xs[i+j] - xs[i]</code> ห่าง <b>j ช่อง</b></li>
                <li>ทั้ง 3 แบบต้องได้ <b>9.686255</b> เท่ากัน — ถ้าไม่เท่า แปลว่าเขียนผิดสักตัว</li>
              </ul>
            </Callout>
            <p style={{margin:"6px 0 0"}}>ต่างกันที่<b>ความเร็ว</b> ไม่ใช่คำตอบ: recursive คำนวณช่องเดิมซ้ำจนโตแบบ exponential · top-down กับ bottom-up คำนวณแต่ละช่องครั้งเดียว (O(n²)) — อธิบายละเอียดพร้อมจำนวนครั้งที่เรียกอยู่ที่ <a href="#interp">บท Interpolation · การบ้าน 9</a></p>
          </div>
        }>
          ใช้ตารางการบ้าน 9 (x = 0,2,4,6,8) หา <M>{`f(4.2)`}</M> ด้วย polynomial 5 จุด โดยเขียน divided difference <b>3 แบบ</b> ในไฟล์เดียว แล้วพิมพ์ผลทั้ง 3 ให้เห็นว่าเท่ากัน
        </Problem>

        <Problem label="P11 · [การบ้าน 8] Conjugate Gradient — หยุดด้วย ε แล้วนับรอบ" solution={
          <div>
            <PythonRunner code={`# การบ้าน 8 · Conjugate Gradient (ไม่ใช้ numpy)
A = [[5, 2, 0, 0],
     [2, 5, 2, 0],
     [0, 2, 5, 2],
     [0, 0, 2, 5]]
B = [12, 17, 14, 7]
eps = 0.000001
n = len(B)

def matvec(M, v):
    return [sum(M[i][j]*v[j] for j in range(n)) for i in range(n)]
def dot(u, v):
    return sum(u[i]*v[i] for i in range(n))

X = [0.0]*n
R = [a - b for a, b in zip(matvec(A, X), B)]     # R0 = AX0 - B
D = [-r for r in R]                               # D0 = -R0
k = 0
while True:
    AD = matvec(A, D)
    lam = -dot(D, R) / dot(D, AD)
    X = [X[i] + lam*D[i] for i in range(n)]
    R = [a - b for a, b in zip(matvec(A, X), B)]
    k += 1
    err = dot(R, R) ** 0.5
    print(f"k={k}  lambda={lam:.6f}  error={err:.6e}")
    if err < eps:
        break
    alpha = dot(R, AD) / dot(D, AD)
    D = [-R[i] + alpha*D[i] for i in range(n)]

print("iterations =", k)
print("X =", [round(v, 6) for v in X])`} height={560}/>
            <Callout kind="tip" title="เช็คลิสต์ให้คะแนนตัวเอง (5 ข้อ)">
              <ul style={{margin:0, paddingLeft:18}}>
                <li>เริ่ม <code>R = AX − B</code> (เครื่องหมายตามสไลด์อาจารย์) และ <code>D = −R</code></li>
                <li><code>lam = −(DᵀR)/(DᵀAD)</code> — <b>มีเครื่องหมายลบ</b></li>
                <li>อัปเดต X → คำนวณ R ใหม่ → <b>เช็ค error ก่อน</b> ค่อยหา alpha</li>
                <li><code>alpha = (RᵀAD)/(DᵀAD)</code> ใช้ R <b>ตัวใหม่</b> กับ D <b>ตัวเก่า</b> · แล้ว <code>D = −R + alpha·D</code></li>
                <li>ลูป <code>while</code> หยุดด้วย <code>err &lt; eps</code> ไม่ใช่ <code>for k in range(4)</code> (กฎอาจารย์) · คำตอบ: <b>4 รอบ</b></li>
              </ul>
            </Callout>
          </div>
        }>
          ระบบ 4×4 ของการบ้าน 8 · <M>{`X^{(0)}=0`}</M> · <M>{`\\varepsilon = 0.000001`}</M> — เขียนโปรแกรม CG <b>ไม่ใช้ numpy</b> พิมพ์ λ และ error ทุกรอบ แล้วตอบว่าต้องทำกี่รอบ
        </Problem>
        </TimedExam>
      </Sect>

      {/* ═══════════ 4 · JS ↔ Python ═══════════ */}
      <Sect tag="4" title="ถ้าจะเขียนเป็น JavaScript — ตารางแปลง">
        <Callout kind="tip" title="เขียนภาษาไหนดี">
          <p style={{margin:0}}>โค้ดตัวอย่างของอาจารย์ในเอกสารเป็น <b>JavaScript</b> แต่ตรรกะเหมือนกันทุกประการ ⇒ <b>เขียนภาษาที่ตัวเองคล่องที่สุด</b> ขอแค่โครงถูกและตรรกะครบ · ตารางนี้ไว้เผื่อโจทย์ระบุภาษามา</p>
        </Callout>
        <NumTable
          headers={["สิ่งที่ทำ", "Python", "JavaScript"]}
          rows={[
            ["นิยามฟังก์ชัน", "def f(x): return x**4 - 13", "function f(x){ return Math.pow(x,4) - 13; }"],
            ["ยกกำลัง", "x**4", "Math.pow(x,4)"],
            ["ค่าสัมบูรณ์", "abs(v)", "Math.abs(v)"],
            ["เอกซ์โพเนนเชียล / ล็อก", "math.exp(x) · math.log(x)", "Math.exp(x) · Math.log(x)"],
            ["ประกาศตัวแปร", "x = 2.0", "let x = 2.0;"],
            ["ลูปนับรอบ", "for i in range(1, n):", "for (let i = 1; i < n; i++){ }"],
            ["ลูปไม่จำกัดรอบ", "while True:", "while (true){ }"],
            ["เลื่อนตัวแปร (Secant)", "x0, x1 = x1, x2", "x0 = x1; x1 = x2;"],
            ["พิมพ์ผล", "print(round(x, 6))", "console.log(x.toFixed(6));"],
            ["เศษเหลือ (เช็คคี่/คู่)", "i % 2", "i % 2"],
            ["ลูปถอยหลัง (back subst.)", "for i in range(n-1, -1, -1):", "for (let i = n-1; i >= 0; i--){ }"],
            ["คัดลอกเมทริกซ์ (Cramer)", "[row[:] for row in A]", "A.map(row => row.slice())"],
            ["สลับแถว (pivot = 0)", "M[k], M[r] = M[r], M[k]", "[M[k], M[r]] = [M[r], M[k]];"],
          ]}
        />
        <Callout kind="warn" title="⚠︎ กับดักของ JavaScript ตอนเลื่อนตัวแปร">
          <p style={{margin:0}}>Python เขียน <code>x0, x1 = x1, x2</code> ได้บรรทัดเดียวเพราะมันประเมินฝั่งขวาก่อนทั้งหมด · แต่ JavaScript ต้องเขียนสองบรรทัดและ<b>ลำดับสำคัญ</b>: <code>x0 = x1;</code> ต้องมาก่อน <code>x1 = x2;</code> — ถ้าสลับ ค่า <code>x1</code> เก่าจะหายไปก่อนถูกเก็บ</p>
        </Callout>
      </Sect>

      {/* ═══════════ 5 · เช็คลิสต์ ═══════════ */}
      <Sect tag="5" title="เช็คลิสต์ตรวจโค้ดตัวเองบนกระดาษ (30 วินาทีก่อนส่ง)">
        <NumTable
          headers={["#", "เช็คอะไร", "ถ้าขาดจะเกิดอะไร"]}
          rows={[
            ["1", "มี def f(x) และ return ตรงกับโจทย์", "ทั้งโปรแกรมคำนวณผิดฟังก์ชัน"],
            ["2", "ครบ 3 ขั้น: Initial Value · Iteration Form · เงื่อนไขหยุด", "ขาดขั้นไหนก็ไม่ใช่โปรแกรมที่ใช้ได้"],
            ["3", "เงื่อนไขหยุดเป็น absolute และมี tol", "ลูปไม่มีวันจบ หรือหยุดผิดจุด"],
            ["4", "Secant มีบรรทัดเลื่อนตัวแปร", "วนค่าเดิมไม่รู้จบ"],
            ["5", "Bisection/False Position มีตัวแปรเก็บค่ารอบก่อน (prev)", "รอบแรกไม่มีค่าเทียบ โปรแกรมพัง"],
            ["6", "Simpson เปลี่ยนครบ 2 จุด (น้ำหนักในลูป + ตัวคูณ h/3)", "เปลี่ยนจุดเดียว = คำตอบผิด"],
            ["7", "Simpson แปลง n พาราโบลาเป็นช่องย่อย 2n แล้ว", "h ผิด ทั้งข้อผิด"],
            ["8", "สัมประสิทธิ์ finite difference บวกกันได้ 0", "จำสูตรผิด"],
            ["9", "print ออกมาเป็นทศนิยม (round / toFixed)", "อาจารย์ไม่รับเศษส่วน"],
            ["10", "ตัวแปรที่ใช้ในลูป ประกาศไว้ก่อนลูปครบทุกตัว", "โปรแกรมรันไม่ผ่านตั้งแต่บรรทัดแรก"],
            ["11", "Gauss: ลูป j เขียน range(k, n+1) ไม่ใช่ range(k, n)", "คอลัมน์ b ไม่ถูกอัปเดต — U ถูกแต่คำตอบผิดหมด"],
            ["12", "Gauss: back substitution หารด้วย M[i][i] ตอนท้าย", "ได้ผลรวมดิบ ไม่ใช่ค่า x"],
            ["13", "Cramer: คัดลอกเมทริกซ์ด้วย [row[:] for row in A]", "ไปแก้ A ตัวจริง — ไม่ error แต่เลขผิด"],
          ]}
        />
        <Callout kind="good" title="เป้าหมายที่วัดได้">
          <p style={{margin:0}}>ก่อนถึงวันสอบ ให้เขียน <b>P1–P5 ได้ครบโดยไม่เปิดดูอะไรเลย ภายในข้อละ 10 นาที</b> · ถ้าทำได้ แปลว่าคะแนนครึ่งหนึ่งของข้อสอบ (~45 คะแนน) อยู่ในมือแล้ว · <b>P5 (Gauss) สำคัญที่สุดในบรรดาที่เพิ่งเพิ่ม</b> เพราะ Linear เป็นบทเดียวที่ยังไม่เคยซ้อมเขียนโค้ดเลย</p>
        </Callout>
      </Sect>
    </div>
  );
}

window.CodeDrillLesson = CodeDrillLesson;
