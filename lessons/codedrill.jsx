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
        lead="ครึ่งหนึ่งของข้อสอบคือข้อเขียนโปรแกรม และห้ามเปิดโพย — หน้านี้ฝึกให้เขียนออกมาได้เองบนกระดาษเปล่า"
        readout={{
          label: "โปรแกรมทั้งหมดที่ออกสอบ ย่อเหลือ 6 โครง",
          steps: [
            { x: "A · Bracketing", w: 17 },
            { x: "B/B′ · Open + Secant", w: 33 },
            { x: "C · Summation", w: 17 },
            { x: "D · Finite diff", w: 17 },
            { x: "E · Linear", w: 16 },
          ],
          result: "6",
          note: "จำ 6 โครงนี้ได้ = เขียนได้ทุกข้อ เพราะที่เหลือคือเปลี่ยนไม่กี่บรรทัด",
        }}
        meta={["6 โครงหลัก", "เติมช่องว่าง 10 ข้อ", "กระดาษเปล่า 5 ข้อ", "ตาราง JS ↔ Python"]}
      />

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
      <Sect tag="1" title="6 โครงที่ครอบคลุมทุกโปรแกรมในข้อสอบ">
        <Callout kind="good" title="🎙️ เขียนตามกรอบ 3 ขั้นของอาจารย์เสมอ">
          <p style={{margin:0}}>ทุกโครงข้างล่างวางตาม ① <b>Initial Value</b> ② <b>Iteration Form</b> ③ <b>เงื่อนไขหยุด</b> · เงื่อนไขหยุดใช้ <b>absolute</b> <code>abs(ค่าใหม่ − ค่าเก่า) &lt; tol</code> โดยอาจารย์ตั้ง <code>tol = 0.001</code> เว้นแต่โจทย์สั่งเอง</p>
        </Callout>

        <h3>โครง A · Bracketing — Bisection &amp; False Position</h3>
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

        <h3 style={{marginTop:22}}>โครง B · Open Method — One-point &amp; Newton</h3>
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

        <h3 style={{marginTop:22}}>โครง B′ · Secant — เหมือน B แต่มีค่าเริ่ม 2 ตัว</h3>
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

        <h3 style={{marginTop:22}}>โครง C · Summation — Composite Trapezoidal &amp; Simpson</h3>
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

        <h3 style={{marginTop:22}}>โครง D · Finite Difference — ไม่มีลูปเลย</h3>
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

        <h3 style={{marginTop:22}}>โครง E · Linear Systems — Gauss Elimination &amp; Cramer</h3>
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

      {/* ═══════════ 2 · เติมช่องว่าง ═══════════ */}
      <Sect tag="2" title="ดริลเติมช่องว่าง · 10 ข้อ — เจาะบรรทัดที่ลืมบ่อยที่สุด">
        <p>อ่านโค้ดแล้วเติมบรรทัดที่หายไป <b>โดยไม่เลื่อนกลับไปดูโครงข้างบน</b> — ถ้าเติมไม่ได้แปลว่ายังไม่พร้อมเขียนบนกระดาษ</p>

        <TimedExam presets={[20, 12, 8]} label="10 ข้อ · แนะนำ 20 นาที (ข้อละ 2 นาที)">

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

        </TimedExam>
      </Sect>

      {/* ═══════════ 3 · กระดาษเปล่า ═══════════ */}
      <Sect tag="3" title="ดริลกระดาษเปล่า · 5 ข้อ — เขียนทั้งโปรแกรมโดยไม่ดูอะไรเลย">
        <Callout kind="danger" title="กติกาของดริลนี้ — ทำแบบนี้เท่านั้นถึงจะได้ผล">
          <ol style={{margin:0, paddingLeft:20}}>
            <li>ปิดหน้าจอ หยิบ<b>กระดาษเปล่ากับปากกา</b> (เขียนบนคอมไม่นับ เพราะในห้องสอบไม่มี autocomplete)</li>
            <li>เขียนให้จบทั้งโปรแกรมโดย<b>ไม่เปิดดูอะไรเลย</b> จับเวลาข้อละ 10 นาที</li>
            <li>เขียนเสร็จค่อยกดดูเฉลย แล้วเทียบว่าขาดบรรทัดไหน</li>
            <li>บรรทัดที่ขาด <b>จดไว้ในสมุดแยก</b> แล้ววันรุ่งขึ้นเขียนข้อเดิมใหม่</li>
          </ol>
        </Callout>

        <TimedExam presets={[50, 30, 20]} label="5 ข้อ · แนะนำ 50 นาที (ข้อละ 10 นาที)">

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
              <p style={{margin:0}}>เป็นระบบเดียวกับ<b>ใบงาน “ระบบเดียว 6 วิธี”</b> (<code>Gauss Elimination Method.pdf</code>) ที่โครงเหมือนการบ้าน 4/5 เป๊ะ ⇒ ตัวเก็งที่แม่นที่สุดของบทนี้ · คำตอบเป็น<b>จำนวนเต็มพอดี <M>{`(-1,\\,2,\\,1)`}</M></b> ⇒ แทนกลับแล้วต้องลงตัวเป๊ะทั้ง 3 บรรทัด ถ้าไม่ลงตัวคือคำนวณผิด รู้ทันทีในห้องสอบ</p>
            </Callout>
          </div>
        }>
          เขียนโปรแกรม <b>Gauss Elimination</b> (forward elimination + back substitution) แก้ระบบ
          <MB>{`\\begin{cases}-2x_1+3x_2+x_3=9\\\\ 3x_1+4x_2-5x_3=0\\\\ x_1-2x_2+x_3=-4\\end{cases}`}</MB>
          พิมพ์ <M>{`x_1,x_2,x_3`}</M> เป็นทศนิยม 6 ตำแหน่ง · <b>โบนัส:</b> ให้โปรแกรมคำนวณ <M>{`\\det A`}</M> จากผลคูณ pivot ด้วย
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
