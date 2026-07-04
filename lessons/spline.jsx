// Spline Interpolation — Linear, Quadratic, Cubic

function SplineLesson() {
  // Slide example: x = [1, 1.5, 2, 2.5], y = [45, 75, 160, 245], find f(1.75)
  const xs = [1, 1.5, 2, 2.5];
  const ys = [45, 75, 160, 245];

  return (
    <div>
      <Hero
        kicker="07 · Spline Interpolation"
        title="Spline — เส้นโค้งต่อเส้น"
        lead="แทนที่จะใช้ polynomial ใหญ่ ๆ ผ่านทุกจุด เราใช้ polynomial เล็ก ๆ ต่อกันเป็นช่วง ๆ — แม่นยำกว่า, ไม่มี oscillation"
        readout={{
          label: "Cubic spline · max error ของ 1/(1+x²) บน [−5,5]",
          steps: [
            { x: "0.42", w: 72 },
            { x: "0.022", w: 20 },
            { x: "1e−3", w: 6 },
          ],
          result: "→ 0",
          note: "เพิ่มจุด (h เล็กลง) → spline ลู่เข้าฟังก์ชันจริง ต่างจาก polynomial ที่ยิ่งเด้ง (Runge)",
        }}
        meta={["Linear / Quadratic / Cubic", "Piecewise", "Function + Slope ต่อเนื่อง"]}
      />

      <Sect tag="0" title="ทำไมต้องมี Spline?">
        <p>Newton/Lagrange polynomial degree สูง ๆ มีปัญหา <b>Runge's phenomenon</b> — โค้งเด้งไป-มาตรงจุดปลาย (โดยเฉพาะ data เป็น <M>{`1/(1+x^2)`}</M> ใน <M>{`[-5, 5]`}</M>)</p>
        <Callout kind="tip" title="ไอเดียของ Spline">
          แทนที่จะใช้ polynomial เดียวผ่าน n+1 จุด → ใช้ <b>polynomial ย่อย ๆ ระหว่างแต่ละคู่จุด</b> แล้วบังคับให้ "ติดกัน" ที่จุดต่อ
        </Callout>
      </Sect>

      <Sect tag="1" title="Linear Spline — ลากเส้นตรงต่อกัน">
        <p>ง่ายสุด: ระหว่าง <M>{`(x_i, y_i)`}</M> กับ <M>{`(x_{i+1}, y_{i+1})`}</M> ใช้สมการเส้นตรง</p>

        <Formula>
          <MB>{`f_i(x) = y_i + m_i(x - x_i), \\quad x_i \\le x \\le x_{i+1}`}</MB>
          <MB>{`m_i = \\frac{y_{i+1} - y_i}{x_{i+1} - x_i}`}</MB>
        </Formula>

        <h3>ตัวอย่างจากสไลด์</h3>
        <p>หา <M>f(1.75)</M> จากข้อมูล:</p>
        <NumTable headers={["i", "xᵢ", "yᵢ"]} rows={xs.map((x,i)=>[i, x, ys[i]])}/>

        <p><b>Step 1:</b> คำนวณ <M>m_i</M> ทุกช่วง:</p>
        <MB>{`m_1 = \\frac{75 - 45}{1.5 - 1} = 60, \\quad m_2 = \\frac{160 - 75}{2 - 1.5} = 170, \\quad m_3 = \\frac{245 - 160}{2.5 - 2} = 170`}</MB>
        <p><b>Step 2:</b> 1.75 อยู่ใน <M>{`[1.5, 2]`}</M> → ใช้ <M>f_2(x)</M></p>
        <MB>{`f_2(1.75) = 75 + 170(1.75 - 1.5) = 75 + 42.5 = 117.5`}</MB>

        <SplineViz xs={xs} ys={ys} kind="linear"/>
      </Sect>

      <Sect tag="2" title="Quadratic Spline — โค้งกำลัง 2">
        <p>ระหว่างแต่ละคู่จุด ใช้ <M>{`f_i(x) = a_i x^2 + b_i x + c_i`}</M> → มี 3 ตัวแปร × n ช่วง = 3n ตัวแปร</p>

        <h3>ทำมือเต็ม · matrix 9×9 (4 จุด, ตามชีท Final p.16)</h3>
        <p>ข้อมูลตัวอย่างชีท: <code>x = [1, 1.5, 2, 2.5]</code>, <code>y = [45, 75, 160, 245]</code> → 4 จุด, 3 ช่วง, <b>9 ตัวแปร</b> <M>{`(a_1,b_1,c_1,\\;a_2,b_2,c_2,\\;a_3,b_3,c_3)`}</M></p>
        <p style={{fontSize:'0.778rem', color:"var(--text-faint)", margin:"-6px 0 12px"}}>📌 ข้อมูล 5 จุดในชีท SPLINE_regression.pdf (<code>x=[2,4,6,8,10]</code>) ใช้ pattern เดียวกัน — matrix ขยายเป็น 12×12</p>

        <window.HandWalkthrough steps={[
          { title: "Step 1 · นับสมการที่ต้องการ (3n = 9)",
            body: `กฎ 3 ข้อ:
1) จุดเชื่อมต่อ (function เท่ากัน): f_i(x_i) = f_{i+1}(x_i) = y_i
   → 2(n−1) + 2 = 2n = 6 สมการ
2) Slope ต่อเนื่อง: f'_i(x_i) = f'_{i+1}(x_i) ที่จุดเชื่อม
   → n−1 = 2 สมการ
3) ปิดระบบ: สมมติ a_1 = 0 (ช่วงแรกเป็นเส้นตรง)
   → 1 สมการ
รวม 6+2+1 = 9 สมการ ✓ ใช้แก้กับ 9 ตัวแปร` },
          { title: "Step 2 · สมการ 1–2 · ผ่านจุดของช่วงที่ 1",
            body: `f_1(x) = a_1·x² + b_1·x + c_1

f_1(1)   = a_1(1)    + b_1(1)   + c_1  = 45
        →  1·a_1   +  1·b_1  + 1·c_1 = 45    ← Eq 1
f_1(1.5) = a_1(2.25) + b_1(1.5) + c_1 = 75
        →  2.25·a_1 + 1.5·b_1 + 1·c_1 = 75   ← Eq 2` },
          { title: "Step 3 · สมการ 3–4 · ผ่านจุดของช่วงที่ 2",
            body: `f_2(1.5) = 2.25·a_2 + 1.5·b_2 + 1·c_2 = 75    ← Eq 3
f_2(2)   = 4·a_2    + 2·b_2   + 1·c_2 = 160   ← Eq 4` },
          { title: "Step 4 · สมการ 5–6 · ผ่านจุดของช่วงที่ 3",
            body: `f_3(2)   = 4·a_3    + 2·b_3   + 1·c_3 = 160   ← Eq 5
f_3(2.5) = 6.25·a_3 + 2.5·b_3 + 1·c_3 = 245   ← Eq 6` },
          { title: "Step 5 · สมการ 7–8 · slope ต่อเนื่อง",
            body: `f'_i(x) = 2a_i·x + b_i

f'_1(1.5) = f'_2(1.5):
   2a_1(1.5) + b_1 = 2a_2(1.5) + b_2
   3a_1 + b_1 − 3a_2 − b_2 = 0     ← Eq 7

f'_2(2) = f'_3(2):
   4a_2 + b_2 − 4a_3 − b_3 = 0      ← Eq 8` },
          { title: "Step 6 · สมการ 9 · ปิดระบบ a_1 = 0",
            body: `1·a_1 + 0 + 0 + ... = 0    ← Eq 9 (เลือกให้ a_1 = 0)` },
          { title: "Step 7 · ประกอบเป็น matrix 9×9 (รายแถว)",
            body: `              a_1  b_1  c_1  a_2  b_2  c_2  a_3  b_3  c_3  | RHS
Eq 1:        1    1    1    0    0    0    0    0    0  |  45
Eq 2:        2.25 1.5  1    0    0    0    0    0    0  |  75
Eq 3:        0    0    0    2.25 1.5  1    0    0    0  |  75
Eq 4:        0    0    0    4    2    1    0    0    0  | 160
Eq 5:        0    0    0    0    0    0    4    2    1  | 160
Eq 6:        0    0    0    0    0    0    6.25 2.5  1  | 245
Eq 7:        3    1    0   -3   -1    0    0    0    0  |   0
Eq 8:        0    0    0    4    1    0   -4   -1    0  |   0
Eq 9:        1    0    0    0    0    0    0    0    0  |   0` },
          { title: "Step 8 · แก้ด้วย Gauss (ใช้ Python ด้านล่าง) → ได้สัมประสิทธิ์",
            body: `a_1 = 0       b_1 = 60      c_1 = -15
a_2 = 220     b_2 = -600    c_2 = 480
a_3 = -220    b_3 = 1160    c_3 = -1280

สรุป piecewise:
f_1(x) =          60x − 15            ; 1   ≤ x ≤ 1.5
f_2(x) =  220x² − 600x + 480          ; 1.5 ≤ x ≤ 2
f_3(x) = -220x² + 1160x − 1280        ; 2   ≤ x ≤ 2.5` },
          { title: "Step 9 · ใช้งาน · หา f(1.75)",
            body: `x = 1.75 อยู่ในช่วง [1.5, 2] → ใช้ f_2(x)

f_2(1.75) = 220(1.75)² − 600(1.75) + 480
          = 220(3.0625) − 1050 + 480
          = 673.75 − 1050 + 480
          = 103.75 ✓` },
        ]}/>

        <PythonRunner code={`import numpy as np

def quadratic_spline(xs, ys):
    n = len(xs) - 1     # number of intervals
    # Variables order: [a1, b1, c1, a2, b2, c2, ..., an, bn, cn] → 3n unknowns
    A = np.zeros((3*n, 3*n))
    bv = np.zeros(3*n)
    row = 0
    
    # Each segment passes through its 2 endpoints (2n equations)
    for i in range(n):
        # f_i(x_i) = y_i
        A[row, 3*i]   = xs[i]**2
        A[row, 3*i+1] = xs[i]
        A[row, 3*i+2] = 1
        bv[row] = ys[i]; row += 1
        # f_i(x_{i+1}) = y_{i+1}
        A[row, 3*i]   = xs[i+1]**2
        A[row, 3*i+1] = xs[i+1]
        A[row, 3*i+2] = 1
        bv[row] = ys[i+1]; row += 1
    
    # Slope continuous at interior knots (n-1 equations)
    for i in range(n-1):
        A[row, 3*i]   =  2*xs[i+1]
        A[row, 3*i+1] =  1
        A[row, 3*(i+1)]   = -2*xs[i+1]
        A[row, 3*(i+1)+1] = -1
        row += 1
    
    # Closure: a_1 = 0
    A[row, 0] = 1
    row += 1
    
    coef = np.linalg.solve(A, bv)
    return coef.reshape(n, 3)   # rows: [a, b, c] per segment

def eval_quad_spline(coef, xs, x):
    for i in range(len(xs)-1):
        if xs[i] <= x <= xs[i+1]:
            a, b, c = coef[i]
            return a*x*x + b*x + c
    return None

xs = [1, 1.5, 2, 2.5]; ys = [45, 75, 160, 245]
coef = quadratic_spline(xs, ys)
print("Coefficients per segment:")
for i, (a,b,c) in enumerate(coef):
    print(f"  segment {i+1}: f(x) = {a:.4f}x² + {b:.4f}x + {c:.4f}")
print(f"\\nf(1.75) = {eval_quad_spline(coef, xs, 1.75):.4f}")`} height={320}/>

        <SplineViz xs={xs} ys={ys} kind="quadratic"/>
      </Sect>

      <Sect tag="3" title="Cubic Spline — กำลัง 3 (ที่นิยมที่สุด)">
        <p>ระหว่างแต่ละคู่จุดใช้ <M>{`f_i(x) = a_i x^3 + b_i x^2 + c_i x + d_i`}</M> → 4 ตัวแปร × n = 4n ตัวแปร</p>
        <p>Cubic spline แม่นยำที่สุดและ <em>smooth</em> ที่สุด (continuous up to second derivative) — เป็นที่นิยมในงาน computer graphics, CAD, animation</p>

        <h3>ทำมือเต็ม · matrix 12×12 (4 จุด, Natural Cubic Spline)</h3>
        <p>ข้อมูลเดียวกับ Sect 2: <code>x = [1, 1.5, 2, 2.5]</code>, <code>y = [45, 75, 160, 245]</code> → 4 จุด, 3 ช่วง, <b>12 ตัวแปร</b> <M>{`(a_i, b_i, c_i, d_i)`}</M> × 3 segments</p>
        <p style={{fontSize:'0.778rem', color:"var(--text-faint)", margin:"-6px 0 12px"}}>📌 5 จุดของชีท SPLINE_regression.pdf ขยายเป็น matrix 16×16 ใน pattern เดียวกัน</p>

        <window.HandWalkthrough steps={[
          { title: "Step 1 · นับสมการที่ต้องการ (4n = 12)",
            body: `เงื่อนไข 4 ข้อ:
1) ผ่านจุด: 2n = 6 สมการ
2) Slope ต่อเนื่องที่จุดเชื่อม: f'_i(x_i) = f'_{i+1}(x_i)
   → n−1 = 2 สมการ
3) Curvature ต่อเนื่อง: f''_i(x_i) = f''_{i+1}(x_i)
   → n−1 = 2 สมการ
4) Natural BC ปลายทั้งสอง: f''(x_0) = f''(x_n) = 0
   → 2 สมการ
รวม 6+2+2+2 = 12 สมการ ✓` },
          { title: "Step 2 · derivative ทั่วไป",
            body: `f_i(x)   =   a_i·x³ +   b_i·x² + c_i·x + d_i
f'_i(x)  = 3 a_i·x² + 2 b_i·x  + c_i
f''_i(x) = 6 a_i·x  + 2 b_i` },
          { title: "Step 3 · สมการ 1–6 · ผ่านจุดของแต่ละช่วง",
            body: `f_1(1)   =   a_1 +   b_1 + c_1 + d_1 = 45      ← Eq 1
f_1(1.5) = 3.375·a_1 + 2.25·b_1 + 1.5·c_1 + d_1 = 75   ← Eq 2
f_2(1.5) = 3.375·a_2 + 2.25·b_2 + 1.5·c_2 + d_2 = 75   ← Eq 3
f_2(2)   = 8·a_2  + 4·b_2 + 2·c_2 + d_2 = 160    ← Eq 4
f_3(2)   = 8·a_3  + 4·b_3 + 2·c_3 + d_3 = 160    ← Eq 5
f_3(2.5) = 15.625·a_3 + 6.25·b_3 + 2.5·c_3 + d_3 = 245 ← Eq 6` },
          { title: "Step 4 · สมการ 7–8 · slope ต่อเนื่อง",
            body: `f'_1(1.5) = f'_2(1.5):
   3a_1(1.5²) + 2b_1(1.5) + c_1 = 3a_2(1.5²) + 2b_2(1.5) + c_2
   6.75·a_1 + 3·b_1 + c_1 − 6.75·a_2 − 3·b_2 − c_2 = 0   ← Eq 7

f'_2(2) = f'_3(2):
   12·a_2 + 4·b_2 + c_2 − 12·a_3 − 4·b_3 − c_3 = 0       ← Eq 8` },
          { title: "Step 5 · สมการ 9–10 · curvature ต่อเนื่อง",
            body: `f''_1(1.5) = f''_2(1.5):
   6a_1(1.5) + 2b_1 = 6a_2(1.5) + 2b_2
   9·a_1 + 2·b_1 − 9·a_2 − 2·b_2 = 0    ← Eq 9

f''_2(2) = f''_3(2):
   12·a_2 + 2·b_2 − 12·a_3 − 2·b_3 = 0   ← Eq 10` },
          { title: "Step 6 · สมการ 11–12 · Natural BC",
            body: `f''_1(x_0) = f''_1(1) = 0:
   6·a_1(1) + 2·b_1 = 0
   6·a_1 + 2·b_1 = 0     ← Eq 11

f''_3(x_n) = f''_3(2.5) = 0:
   6·a_3(2.5) + 2·b_3 = 0
   15·a_3 + 2·b_3 = 0    ← Eq 12` },
          { title: "Step 7 · ประกอบเป็น matrix 12×12",
            body: `         a_1   b_1   c_1   d_1   a_2   b_2   c_2   d_2   a_3   b_3   c_3   d_3 | RHS
Eq 1:    1     1     1     1     0     0     0     0     0     0     0     0  |  45
Eq 2:    3.375 2.25  1.5   1     0     0     0     0     0     0     0     0  |  75
Eq 3:    0     0     0     0     3.375 2.25  1.5   1     0     0     0     0  |  75
Eq 4:    0     0     0     0     8     4     2     1     0     0     0     0  | 160
Eq 5:    0     0     0     0     0     0     0     0     8     4     2     1  | 160
Eq 6:    0     0     0     0     0     0     0     0    15.625 6.25  2.5   1  | 245
Eq 7:    6.75  3     1     0    -6.75 -3    -1     0     0     0     0     0  |   0
Eq 8:    0     0     0     0    12     4     1     0   -12    -4    -1     0  |   0
Eq 9:    9     2     0     0    -9    -2     0     0     0     0     0     0  |   0
Eq 10:   0     0     0     0    12     2     0     0   -12    -2     0     0  |   0
Eq 11:   6     2     0     0     0     0     0     0     0     0     0     0  |   0
Eq 12:   0     0     0     0     0     0     0     0    15     2     0     0  |   0` },
          { title: "Step 8 · แก้ด้วย Gauss (ใช้ Python) → สัมประสิทธิ์",
            body: `a_1 =  117.333    b_1 = -352.000    c_1 =  382.667    d_1 = -103.000
a_2 = -146.667    b_2 =  836.000    c_2 = -1399.333   d_2 =  788.000
a_3 =   29.333    b_3 = -220.000    c_3 =  712.667    d_3 = -620.000

สรุป piecewise (ค่าโดยประมาณ):
f_1(x) =  117.33x³ − 352.00x² + 382.67x − 103.00    ; 1   ≤ x ≤ 1.5
f_2(x) = -146.67x³ + 836.00x² − 1399.33x + 788.00   ; 1.5 ≤ x ≤ 2
f_3(x) =   29.33x³ − 220.00x² + 712.67x − 620.00    ; 2   ≤ x ≤ 2.5` },
          { title: "Step 9 · ใช้งาน · หา f(1.75)",
            body: `x = 1.75 อยู่ในช่วง [1.5, 2] → ใช้ f_2(x)

f_2(1.75) = -146.67(1.75)³ + 836.00(1.75)² − 1399.33(1.75) + 788.00
          = -146.67(5.359) + 836.00(3.0625) − 1399.33(1.75) + 788.00
          = -785.94 + 2560.25 − 2448.83 + 788.00
          ≈ 113.48

(ค่าแม่นยำจาก numpy: 113.375)

หมายเหตุ: cubic spline ให้ค่าสูงกว่า quadratic spline (103.75) เพราะ
curvature ที่จุดเชื่อมเรียบกว่า — โค้งติดตามแนวข้อมูลใกล้ปลายมากกว่า` },
        ]}/>

        <PythonRunner code={`from scipy.interpolate import CubicSpline
import numpy as np

xs = [1, 1.5, 2, 2.5]
ys = [45, 75, 160, 245]
cs = CubicSpline(xs, ys, bc_type='natural')

print(f"f(1.75) = {cs(1.75):.4f}")
print(f"f(1.25) = {cs(1.25):.4f}")
print(f"f(2.25) = {cs(2.25):.4f}")

# Coefficients per interval (a, b, c, d):
print("\\nCoefficients (descending power):")
for i in range(len(xs)-1):
    coef = cs.c[:, i]
    print(f"  segment {i+1}: {coef.round(4).tolist()}")`} height={220}/>

        <SplineViz xs={xs} ys={ys} kind="cubic"/>

        <h3>Animation · ดู S, S', S'' ต่อเนื่องที่จุดต่อ</h3>
        <p>Cubic spline ต่อเนื่อง C² — ค่าฟังก์ชัน, slope, และ curvature เรียบทุกจุด</p>
        <CubicContinuityViz xs={xs} ys={ys}/>

        <h3>Interactive · ลองจุดของคุณเอง</h3>
        <SplineSolver/>
      </Sect>

      <Sect tag="★" title="fx-991CW · ใช้ Equation / Polynomial เช็ค Spline">
        <Callout title="ไม่มี mode 'Spline' ในเครื่อง — ใช้ Polynomial เช็คเป็น segment">
          <p>ในห้องสอบ ใช้เครื่องคิดเลขเช็คคำตอบที่ทำมือ ทำได้ 2 วิธี:</p>
          <p style={{margin:"8px 0 4px"}}><b>วิธีที่ 1 · Polynomial mode (เช็คว่าค่า f_i(x) ตรง)</b></p>
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Equation</Key> → เลือก <Key>Polynomial</Key></span>,
            <span>เลือกลำดับ 2 (Quadratic Spline) หรือ 3 (Cubic Spline)</span>,
            <span>ใส่สัมประสิทธิ์ของ segment ที่ x อยู่ในช่วง (เช่น a₂, b₂, c₂)</span>,
            <span>กด <Key>=</Key> เพื่อหา root ของ segment นั้น (เช็คว่า extremum อยู่ถูก)</span>,
          ]}/>
          <p style={{margin:"8px 0 4px"}}><b>วิธีที่ 2 · Table mode (ดูค่า f(x) เร็ว)</b></p>
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Table</Key> → ใส่สูตร <code>aX² + bX + c</code> หรือ <code>aX³+bX²+cX+d</code></span>,
            <span>กำหนด Start = ขอบซ้ายของ segment, End = ขอบขวา, Step = ช่วงย่อย</span>,
            <span>scroll หาค่า X ที่ต้องการ → ดู f(X) ในคอลัมน์</span>,
          ]}/>
          <p style={{margin:"6px 0 0", fontSize:'0.778rem', color:"var(--text-faint)"}}>⚠ ระวัง: ต้องเปลี่ยน coefficient ทุกครั้งที่ข้าม segment เพราะ spline เป็น piecewise</p>
        </Callout>
      </Sect>

      <Sect tag="∑" title="เปรียบเทียบ Linear / Quad / Cubic">
        <NumTable
          headers={["", "Linear", "Quadratic", "Cubic"]}
          rows={[
            ["Continuity", "C⁰", "C¹", "C²"],
            ["ตัวแปร/segment", "2", "3", "4"],
            ["จำนวนตัวแปรรวม", "2n", "3n", "4n"],
            ["Smooth?", "เห็นมุม", "เรียบ", "เรียบมาก"],
            ["ใช้บ่อย", "จำลองคร่าว ๆ", "งานพื้นฐาน", "Computer graphics, CAD"],
          ]}
        />

        <Callout kind="tip" title="วิธีเลือก">
          <ul>
            <li>โจทย์บอก "Spline" เฉย ๆ → ใช้ Cubic (default ทั่วโลก)</li>
            <li>โจทย์บอก "Linear Spline" → เส้นตรงต่อกัน (ง่าย)</li>
            <li>โจทย์บอก "First-order/Second-order Spline" → Linear/Quadratic</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · Linear Spline" solution={
          <div>
            <p>1.75 อยู่ใน <M>{`[1.5, 2]`}</M> → ใช้ <M>{`f_2(x) = 75 + 170(x - 1.5)`}</M></p>
            <p><M>{`f_2(1.75) = 75 + 170(0.25) = 117.5`}</M></p>
          </div>
        }>
          ข้อมูล x = [1, 1.5, 2, 2.5], y = [45, 75, 160, 245]<br/>
          หา f(1.75) ด้วย Linear Spline แสดงการคำนวณ slope ทุกช่วง
        </Problem>

        <Problem label="ข้อ 2 · Quadratic Spline (ทำมือ)" solution={
          <p>สร้างระบบสมการ 9×9 (สำหรับ 4 จุด, 3 ช่วง) ตามที่อธิบายไว้ข้างบน แล้วใช้ <b>Gauss Elimination</b> แก้ — หรือใช้คำสั่ง EQUATION ในเครื่องคิดเลข (รองรับ matrix ขนาด 4×4)</p>
        }>
          ใช้ Quadratic Spline แก้ข้อมูลเดียวกัน ตั้ง <M>a_1 = 0</M> เพื่อปิดระบบ แสดง matrix 9×9 และคำตอบ
        </Problem>
      </Sect>
    </div>
  );
}

function SplineViz({ xs, ys, kind }) {
  const W = 640, H = 320;
  const padding = { l: 40, r: 12, t: 14, b: 26 };
  const xMin = Math.min(...xs) - 0.3, xMax = Math.max(...xs) + 0.3;
  const yMin = Math.min(...ys) - 20, yMax = Math.max(...ys) + 30;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);

  // Compute spline functions
  let segments = [];
  if (kind === "linear") {
    for (let i = 0; i < xs.length-1; i++) {
      const m = (ys[i+1] - ys[i]) / (xs[i+1] - xs[i]);
      segments.push({ x0: xs[i], x1: xs[i+1], fn: x => ys[i] + m*(x - xs[i]) });
    }
  } else if (kind === "quadratic") {
    // Solve quadratic spline system
    const n = xs.length - 1;
    const N = 3 * n;
    const A = Array.from({length: N}, () => new Array(N).fill(0));
    const bv = new Array(N).fill(0);
    let row = 0;
    for (let i = 0; i < n; i++) {
      A[row][3*i] = xs[i]*xs[i]; A[row][3*i+1] = xs[i]; A[row][3*i+2] = 1; bv[row] = ys[i]; row++;
      A[row][3*i] = xs[i+1]*xs[i+1]; A[row][3*i+1] = xs[i+1]; A[row][3*i+2] = 1; bv[row] = ys[i+1]; row++;
    }
    for (let i = 0; i < n-1; i++) {
      A[row][3*i] = 2*xs[i+1]; A[row][3*i+1] = 1;
      A[row][3*(i+1)] = -2*xs[i+1]; A[row][3*(i+1)+1] = -1;
      row++;
    }
    A[row][0] = 1; row++;
    const { x: coef } = gaussElim(A, bv);
    for (let i = 0; i < n; i++) {
      const a = coef[3*i], b = coef[3*i+1], c = coef[3*i+2];
      segments.push({ x0: xs[i], x1: xs[i+1], fn: x => a*x*x + b*x + c });
    }
  } else if (kind === "cubic") {
    // Natural cubic spline using standard tridiagonal solve
    const n = xs.length - 1;
    const h = xs.slice(1).map((x, i) => x - xs[i]);
    const a = ys.slice();
    const A = Array.from({length: n+1}, () => new Array(n+1).fill(0));
    const bv = new Array(n+1).fill(0);
    A[0][0] = 1; A[n][n] = 1;
    for (let i = 1; i < n; i++) {
      A[i][i-1] = h[i-1];
      A[i][i] = 2*(h[i-1] + h[i]);
      A[i][i+1] = h[i];
      bv[i] = 3*((a[i+1]-a[i])/h[i] - (a[i]-a[i-1])/h[i-1]);
    }
    const { x: c } = gaussElim(A, bv);
    const b = [], d = [];
    for (let i = 0; i < n; i++) {
      b.push((a[i+1]-a[i])/h[i] - h[i]*(2*c[i] + c[i+1])/3);
      d.push((c[i+1] - c[i])/(3*h[i]));
    }
    for (let i = 0; i < n; i++) {
      const ai = a[i], bi = b[i], ci = c[i], di = d[i], xi = xs[i];
      segments.push({ x0: xs[i], x1: xs[i+1], fn: x => ai + bi*(x-xi) + ci*(x-xi)**2 + di*(x-xi)**3 });
    }
  }

  // Build SVG paths
  const paths = segments.map(seg => plotPath(seg.fn, seg.x0, seg.x1, sx, sy, 30));
  const colors = ["#58c4dd", "#83c167", "#ffd66b", "#e879bc", "#f6a85f"];

  // Animated: reveal one segment at a time so you see the spline drawn piece by piece
  return (
    <StepPlayer steps={segments.length} stepDuration={1100} label={(s) => `Segment ${s+1}/${segments.length} · [${xs[s]}, ${xs[s+1]}]`}>
      {({ step }) => (
        <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
          <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
          {paths.slice(0, step+1).map((p, i) => (
            <path key={i} d={p} fill="none" stroke={colors[i % colors.length]}
              strokeWidth={i === step ? 3.5 : 2.5} opacity={i === step ? 1 : 0.8}/>
          ))}
          {xs.map((x, i) => (
            <circle key={i} cx={sx(x)} cy={sy(ys[i])} r={i === step+1 ? 6 : 5}
              fill={i <= step+1 ? "#ffd66b" : "#3b4452"} stroke="#0e1116" strokeWidth="1.5"/>
          ))}
          {xs.map((x, i) => i <= step+1 && (
            <text key={"t"+i} x={sx(x)+8} y={sy(ys[i])-8} fill="#ffd66b" fontFamily="JetBrains Mono" fontSize="11">({x}, {ys[i]})</text>
          ))}
        </svg>
      )}
    </StepPlayer>
  );
}

function CubicContinuityViz({ xs, ys }) {
  const cs = cubicSpline(xs, ys);
  const xMin = xs[0], xMax = xs[xs.length-1];
  const W = 580, H = 110, padding = { l: 40, r: 12, t: 10, b: 22 };
  const renderPanel = (fn, color, label, range) => {
    const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
    const sy = makeScale(range, [H - padding.b, padding.t]);
    return (
      <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`} key={label}>
        <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={range} xTicks={5} yTicks={3}/>
        <path d={plotPath(fn, xMin, xMax, sx, sy, 200)} fill="none" stroke={color} strokeWidth="2.2"/>
        {xs.map((x, i) => <line key={i} x1={sx(x)} y1={padding.t} x2={sx(x)} y2={H-padding.b} stroke="#3b4452" strokeDasharray="2 3" opacity="0.6"/>)}
        <text x={padding.l + 6} y={padding.t + 16} fill={color} fontFamily="JetBrains Mono" fontSize="12" fontWeight="600">{label}</text>
      </svg>
    );
  };
  // pick ranges
  const sampler = (fn) => {
    const arr = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (xMax - xMin) * i / 100;
      arr.push(fn(x));
    }
    const lo = Math.min(...arr), hi = Math.max(...arr);
    const pad = (hi - lo) * 0.15 || 1;
    return [lo - pad, hi + pad];
  };
  return (
    <div>
      {renderPanel(cs.eval, "#58c4dd", "S(x) — ค่าฟังก์ชัน (C⁰ ต่อเนื่อง)", sampler(cs.eval))}
      {renderPanel(cs.deriv1, "#83c167", "S'(x) — slope (C¹ ต่อเนื่อง)", sampler(cs.deriv1))}
      {renderPanel(cs.deriv2, "#ffd66b", "S''(x) — curvature (C² ต่อเนื่อง, ขอบ = 0)", sampler(cs.deriv2))}
      <p className="muted" style={{fontSize:'0.75rem', marginTop:6}}>เส้นแนวตั้งคือจุดต่อระหว่าง segment — ทุก panel ผ่านจุดต่อแบบเรียบ (ไม่กระโดด, ไม่หัก)</p>
    </div>
  );
}

function SplineSolver() {
  const [xs, setXs] = React.useState(["1","2","3","4","5"]);
  const [ys, setYs] = React.useState(["2","8","27","64","125"]);
  const [xq, setXq] = React.useState("2.5");
  const xn = xs.map(parseFloat).filter(v => !isNaN(v));
  const yn = ys.map(parseFloat).filter(v => !isNaN(v));
  const x = parseFloat(xq);
  const ok = xn.length === yn.length && xn.length >= 3 && !isNaN(x);
  const cs = ok ? cubicSpline(xn, yn) : null;
  return (
    <div className="solver-shell">
      <h4>Cubic Spline Solver (Natural BC)</h4>
      <PointsInput xs={xs} ys={ys} onChange={(nx, ny) => { setXs(nx); setYs(ny); }}/>
      <div className="input-row">
        <label>หา S(x) ที่ x =</label>
        <input type="text" value={xq} onChange={e => setXq(e.target.value)} style={{width:100}}/>
      </div>
      {cs && (
        <>
          <Callout kind="good">
            <div className="mono">S({fmt(x,4)}) ≈ <b>{fmt(cs.eval(x), 8)}</b></div>
            <div className="mono" style={{fontSize:'0.75rem'}}>S'({fmt(x,4)}) ≈ {fmt(cs.deriv1(x), 6)} ; S''({fmt(x,4)}) ≈ {fmt(cs.deriv2(x), 6)}</div>
          </Callout>
          <NumTable
            headers={["seg", "x range", "a", "b", "c", "d"]}
            rows={cs.a.map((_, i) => [i+1, `[${xn[i]}, ${xn[i+1]}]`, fmt(cs.a[i],4), fmt(cs.b[i],4), fmt(cs.c[i],4), fmt(cs.d[i],4)])}
          />
        </>
      )}
    </div>
  );
}

window.SplineLesson = SplineLesson;
