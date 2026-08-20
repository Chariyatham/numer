// Regression — Linear, Polynomial, Multiple

function RegressionLesson() {
  // Slide example: y = 2.5x, x = [1..7], slope expected ~2.5
  const xs = [1,2,3,4,5,6,7];
  const ys = [0.5, 2.5, 2, 4, 3.5, 6, 5.5];

  return (
    <div>
      <Hero
        kicker="08 · Regression"
        title="Least-Squares Regression"
        lead="วาดเส้นโค้งให้ 'ใกล้' ทุกจุดที่สุด แทนที่จะผ่านทุกจุด — เพราะข้อมูลจริงมี noise"
        readout={{
          label: "Least-squares · Σ(error)² ของเส้นที่ลอง",
          steps: [
            { x: "9.1", w: 72 },
            { x: "2.4", w: 30 },
            { x: "0.41", w: 11 },
          ],
          result: "0.30 ต่ำสุด",
          note: "เส้นที่ดีที่สุด = เส้นที่ผลรวมของ error² น้อยที่สุด",
        }}
        meta={["Linear", "Polynomial", "Multiple Linear", "Normal Equations"]}
      />

      <Sect tag="0" title="ทำไมไม่ใช้ Interpolation?">
        <p>ข้อมูลจริงจากการวัดมี <b>noise/error</b> — ใช้ polynomial degree สูงผ่านทุกจุดจะได้กราฟ "บ้า" ที่ทำนายค่าใหม่ผิดเพี้ยน</p>
        <p>Regression: ยอมรับว่าเส้นโค้ง<em>ไม่ผ่าน</em>ทุกจุด — แลกกับการได้เส้นที่ "เป็นตัวแทน" ของแนวโน้มข้อมูล</p>
      </Sect>

      <Sect tag="1" title="Linear Regression — ยอดนิยมที่สุด">
        <h3>แนวคิด · Minimize Sum of Squared Errors</h3>
        <p>เลือก <M>a_0, a_1</M> ที่ทำให้ผลรวมของ <em>กำลังสอง</em>ของ error น้อยที่สุด</p>

        <Formula label="Cost function">
          <MB>{`E = \\sum_{i=1}^{n}\\left(y_i - (a_0 + a_1 x_i)\\right)^2`}</MB>
        </Formula>

        <Callout title="ทำไมใช้ 'กำลังสอง'?">
          <ul>
            <li>กันเครื่องหมาย — error บวก/ลบไม่หักล้างกัน</li>
            <li>diff ง่าย — ได้สมการเชิงเส้น แก้ตรง ๆ</li>
            <li>"ลงโทษ" จุดที่ห่างมาก ๆ มากกว่า (penalize outliers)</li>
          </ul>
        </Callout>

        <h3>หา <M>a_0, a_1</M> — diff ให้ = 0</h3>
        <p>diff เทียบ <M>a_0</M>:</p>
        <MB>{`\\frac{\\partial E}{\\partial a_0} = -2\\sum (y_i - a_0 - a_1 x_i) = 0`}</MB>
        <p>diff เทียบ <M>a_1</M>:</p>
        <MB>{`\\frac{\\partial E}{\\partial a_1} = -2\\sum x_i(y_i - a_0 - a_1 x_i) = 0`}</MB>

        <p>จัดรูปได้ <b>Normal Equations</b>:</p>
        <Formula label="Normal Equations (Linear)">
          <MB>{`n a_0 + \\sum x_i \\cdot a_1 = \\sum y_i`}</MB>
          <MB>{`\\sum x_i \\cdot a_0 + \\sum x_i^2 \\cdot a_1 = \\sum x_i y_i`}</MB>
        </Formula>

        <p>เขียนในรูป matrix:</p>
        <MB>{`\\begin{pmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{pmatrix}\\begin{pmatrix} a_0 \\\\ a_1 \\end{pmatrix} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_i y_i \\end{pmatrix}`}</MB>

        <h3>เห็นภาพ</h3>
        <ScatterLineViz xs={xs} ys={ys}/>

        <h3>ตัวอย่างทำมือ (จากสไลด์)</h3>
        <p>n = 7, ค่าที่ต้องคำนวณ:</p>
        <NumTable
          headers={["Σxᵢ", "Σyᵢ", "Σxᵢ²", "Σxᵢyᵢ"]}
          rows={[[28, 24, 140, 119.5]]}
        />
        <MB>{`\\begin{pmatrix} 7 & 28 \\\\ 28 & 140 \\end{pmatrix}\\begin{pmatrix} a_0 \\\\ a_1 \\end{pmatrix} = \\begin{pmatrix} 24 \\\\ 119.5 \\end{pmatrix}`}</MB>
        <p>แก้ได้ <M>{`a_0 \\approx 0.0714, a_1 \\approx 0.8393`}</M> → <M>{`f(x) \\approx 0.0714 + 0.8393x`}</M></p>

        <h3>fx-991CW · เร็วที่สุดในโลก</h3>
        <Callout title="ใช้โหมด Statistics">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <code>Statistics</code> → <Key>OK</Key> → เลือก <code>2-Variable</code> → <Key>OK</Key></span>,
            <span>กรอกคอลัมน์ <code>x</code> คั่นด้วย <Key>EXE</Key> → เลื่อนไปหัวคอลัมน์ <code>y</code> ด้วย <Key>▼</Key> <Key>▶</Key> แล้วกรอก <code>y</code></span>,
            <span>กรอกครบกด <Key>OK</Key> → เลือก <code>Reg Results</code> → <Key>OK</Key></span>,
            <span>เลือกทรง <code>y = a + bx</code> → <Key>OK</Key> → อ่าน <code>a</code> (= a₀), <code>b</code> (= a₁), <code>r</code></span>,
            <span><b>คำเตือน:</b> เครื่องนี้ใช้ a = intercept, b = slope (กลับกับสไลด์อาจารย์ที่ใช้ a₀, a₁ — ตรวจให้ดี!)</span>,
          ]}/>
        </Callout>

        <h3>Python</h3>
        <PythonRunner code={`def linear_regression(xs, ys):
    n = len(xs)
    sx, sy = sum(xs), sum(ys)
    sxx = sum(x*x for x in xs)
    sxy = sum(x*y for x, y in zip(xs, ys))
    
    a1 = (n*sxy - sx*sy) / (n*sxx - sx*sx)
    a0 = (sy - a1*sx) / n
    return a0, a1

xs = [1,2,3,4,5,6,7]
ys = [0.5, 2.5, 2, 4, 3.5, 6, 5.5]

a0, a1 = linear_regression(xs, ys)
print(f"f(x) = {a0:.4f} + {a1:.4f}x")
print(f"R² = ?")  # เพิ่มเอง

# R² (coefficient of determination)
y_pred = [a0 + a1*x for x in xs]
ss_res = sum((y - yp)**2 for y, yp in zip(ys, y_pred))
ss_tot = sum((y - sum(ys)/len(ys))**2 for y in ys)
r2 = 1 - ss_res/ss_tot
print(f"R² = {r2:.4f}")`} height={260}/>
      </Sect>

      <Sect tag="2" title="Polynomial Regression">
        <p>Fit <M>{`y = a_0 + a_1 x + a_2 x^2 + \\cdots + a_m x^m`}</M></p>

        <Formula label="Normal Equations (degree m)">
          <MB>{`\\begin{pmatrix} n & \\sum x_i & \\cdots & \\sum x_i^m \\\\ \\sum x_i & \\sum x_i^2 & \\cdots & \\sum x_i^{m+1} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ \\sum x_i^m & \\sum x_i^{m+1} & \\cdots & \\sum x_i^{2m} \\end{pmatrix}\\begin{pmatrix} a_0 \\\\ a_1 \\\\ \\vdots \\\\ a_m \\end{pmatrix} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_i y_i \\\\ \\vdots \\\\ \\sum x_i^m y_i \\end{pmatrix}`}</MB>
        </Formula>

        <Callout kind="tip" title="วิธีจำ — Pattern ของ matrix">
          <p>ดู (i, j) ของ matrix ฝั่งซ้าย: ผลรวม <M>{`\\sum x^{i+j-2}`}</M> ที่จุด (i, j) (1-indexed)</p>
          <p>ฝั่งขวา: <M>{`\\sum x^{i-1} y`}</M></p>
          <p>เลยเป็น matrix สมมาตร + จัดแบบ "ขั้นบันได"</p>
        </Callout>

        <h3>fx-991CW · Quadratic Regression ในตัว (degree 2)</h3>
        <Callout title="โหมด Statistics ทำ y = a + bx + cx² ให้ทันที">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <code>Statistics</code> → <Key>OK</Key> → เลือก <code>2-Variable</code> → <Key>OK</Key></span>,
            <span>กรอกคอลัมน์ x และ y ให้ครบทุกจุด (คั่นด้วย <Key>EXE</Key>)</span>,
            <span>กด <Key>OK</Key> → เลือก <code>Reg Results</code> → <Key>OK</Key></span>,
            <span><b>เลือกโมเดลตรงนี้</b> (ไม่ใช่ตอนเข้าโหมด): <code>y = a + bx + cx²</code> → <Key>OK</Key> → อ่านค่า <code>a, b, c</code> = <M>{`a_0, a_1, a_2`}</M></span>,
            <span><b>degree 3 ขึ้นไป:</b> เครื่องไม่มีให้ตรง ๆ → ต้องตั้ง Normal Equations เองแล้วใช้ <code>Equation</code> → <code>Simul Equation</code></span>,
          ]}/>
        </Callout>

        <PythonRunner code={`import numpy as np

def poly_regression(xs, ys, m):
    n = len(xs)
    # Build (m+1)x(m+1) normal equation matrix
    sX = [sum(x**k for x in xs) for k in range(2*m + 1)]
    sY = [sum(x**k * y for x, y in zip(xs, ys)) for k in range(m + 1)]
    
    A = [[sX[i+j] for j in range(m+1)] for i in range(m+1)]
    coef = np.linalg.solve(A, sY)
    return coef    # [a_0, a_1, ..., a_m]

xs = [0, 1, 2, 3, 4, 5]
ys = [2.1, 7.7, 13.6, 27.2, 40.9, 61.1]

coef = poly_regression(xs, ys, m=2)
print(f"y = {coef[0]:.4f} + {coef[1]:.4f}x + {coef[2]:.4f}x²")

# Predict
import numpy as np
x_test = 4.5
y_pred = sum(c * x_test**k for k, c in enumerate(coef))
print(f"y({x_test}) ≈ {y_pred:.4f}")`} height={240}/>

        <Callout kind="warn" title="ระวัง! Polynomial overfit">
          ใช้ degree สูง ๆ จะ fit ข้อมูลเป๊ะ แต่ทำนายค่าใหม่ผิดมาก<br/>
          rule of thumb: ใช้ degree 2-3 พอ ถ้าข้อมูลไม่เกิน 10 จุด
        </Callout>
      </Sect>

      <Sect tag="3" title="Multiple Linear Regression">
        <p>มี<b>ตัวแปรอิสระหลายตัว</b>: <M>{`y = a_0 + a_1 x_1 + a_2 x_2 + \\cdots + a_m x_m`}</M></p>

        <h3>ที่มา · Normal Equations</h3>
        <p>cost function แบบ least-squares:</p>
        <Formula><MB>{`S = \\sum_{i=1}^{n}\\left(y_i - a_0 - a_1 x_{1i} - a_2 x_{2i} - \\cdots - a_m x_{mi}\\right)^2`}</MB></Formula>
        <p>หา <M>{`\\partial S / \\partial a_k = 0`}</M> สำหรับทุก k → <em>matrix normal equations</em>:</p>
        <MB>{`\\begin{pmatrix} n & \\sum x_{1i} & \\sum x_{2i} & \\sum x_{3i} \\\\ \\sum x_{1i} & \\sum x_{1i}^2 & \\sum x_{1i}x_{2i} & \\sum x_{1i}x_{3i} \\\\ \\sum x_{2i} & \\sum x_{1i}x_{2i} & \\sum x_{2i}^2 & \\sum x_{2i}x_{3i} \\\\ \\sum x_{3i} & \\sum x_{1i}x_{3i} & \\sum x_{2i}x_{3i} & \\sum x_{3i}^2 \\end{pmatrix}\\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\\\ a_3 \\end{pmatrix} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_{1i} y_i \\\\ \\sum x_{2i} y_i \\\\ \\sum x_{3i} y_i \\end{pmatrix}`}</MB>

        <Callout kind="tip" title="วิธี matrix แบบกะทัดรัด">
          <p>เขียน <M>Z</M> เป็น <em>design matrix</em> (มี 1 เป็น column แรก แล้วตามด้วย x₁, x₂, ...):</p>
          <MB>{`Z = \\begin{pmatrix} 1 & x_{11} & x_{21} & x_{31} \\\\ 1 & x_{12} & x_{22} & x_{32} \\\\ \\vdots & \\vdots & \\vdots & \\vdots \\end{pmatrix}, \\quad a = (Z^T Z)^{-1} Z^T y`}</MB>
        </Callout>

        <h3>ตัวอย่างเต็มจากชีท MultipleLinear_Integration.pdf · 7 แถว</h3>
        <NumTable
          headers={["i","x₁","x₂","x₃","y"]}
          rows={[
            [1,1,0,1,4],
            [2,0,1,3,-5],
            [3,2,4,1,-6],
            [4,3,2,2,0],
            [5,4,1,5,-1],
            [6,2,3,3,-7],
            [7,1,6,4,-20],
          ]}
        />

        <window.HandWalkthrough steps={[
          { title: "Step 1 · นับ n และรวม Σx_k, Σy",
            body: `n = 7

Σx₁ = 1 + 0 + 2 + 3 + 4 + 2 + 1 = 13
Σx₂ = 0 + 1 + 4 + 2 + 1 + 3 + 6 = 17
Σx₃ = 1 + 3 + 1 + 2 + 5 + 3 + 4 = 19
Σy  = 4 + (-5) + (-6) + 0 + (-1) + (-7) + (-20) = -35` },
          { title: "Step 2 · กำลังสอง Σx_k²",
            body: `Σx₁² = 1² + 0² + 2² + 3² + 4² + 2² + 1²
     = 1 + 0 + 4 + 9 + 16 + 4 + 1 = 35

Σx₂² = 0² + 1² + 4² + 2² + 1² + 3² + 6²
     = 0 + 1 + 16 + 4 + 1 + 9 + 36 = 67

Σx₃² = 1² + 3² + 1² + 2² + 5² + 3² + 4²
     = 1 + 9 + 1 + 4 + 25 + 9 + 16 = 65` },
          { title: "Step 3 · cross products Σx_i·x_j",
            body: `Σx₁x₂ = 1·0 + 0·1 + 2·4 + 3·2 + 4·1 + 2·3 + 1·6
      = 0 + 0 + 8 + 6 + 4 + 6 + 6 = 30

Σx₁x₃ = 1·1 + 0·3 + 2·1 + 3·2 + 4·5 + 2·3 + 1·4
      = 1 + 0 + 2 + 6 + 20 + 6 + 4 = 39

Σx₂x₃ = 0·1 + 1·3 + 4·1 + 2·2 + 1·5 + 3·3 + 6·4
      = 0 + 3 + 4 + 4 + 5 + 9 + 24 = 49` },
          { title: "Step 4 · ผลคูณ Σx_k·y",
            body: `Σx₁y = 1·4 + 0·(-5) + 2·(-6) + 3·0 + 4·(-1) + 2·(-7) + 1·(-20)
     = 4 + 0 - 12 + 0 - 4 - 14 - 20 = -46

Σx₂y = 0·4 + 1·(-5) + 4·(-6) + 2·0 + 1·(-1) + 3·(-7) + 6·(-20)
     = 0 - 5 - 24 + 0 - 1 - 21 - 120 = -171

Σx₃y = 1·4 + 3·(-5) + 1·(-6) + 2·0 + 5·(-1) + 3·(-7) + 4·(-20)
     = 4 - 15 - 6 + 0 - 5 - 21 - 80 = -123` },
          { title: "Step 5 · ประกอบ matrix 4×4 (Normal Equations)",
            body: `| n    Σx₁  Σx₂  Σx₃ | |a₀|   | Σy   |
| Σx₁  Σx₁² Σx₁x₂ Σx₁x₃| |a₁| = | Σx₁y|
| Σx₂  Σx₁x₂ Σx₂² Σx₂x₃| |a₂|   | Σx₂y|
| Σx₃  Σx₁x₃ Σx₂x₃ Σx₃²| |a₃|   | Σx₃y|

แทนตัวเลข:

|  7   13  17  19 | |a₀|   |  -35 |
| 13   35  30  39 | |a₁| = |  -46 |
| 17   30  67  49 | |a₂|   | -171 |
| 19   39  49  65 | |a₃|   | -123 |

(matrix นี้สมมาตร — เพราะ ZᵀZ สมมาตรเสมอ)` },
          { title: "Step 6 · แก้ด้วย Gauss Elimination — Step 1 กำจัด col 1",
            body: `f₂₁ = 13/7  → R₂ ← R₂ - (13/7)R₁
f₃₁ = 17/7  → R₃ ← R₃ - (17/7)R₁
f₄₁ = 19/7  → R₄ ← R₄ - (19/7)R₁

R₂:  35 - (13/7)·13 = 35 - 169/7 = (245-169)/7 = 76/7
     30 - (13/7)·17 = 30 - 221/7 = (210-221)/7 = -11/7
     39 - (13/7)·19 = 39 - 247/7 = (273-247)/7 = 26/7
     -46 - (13/7)·(-35) = -46 + 65 = 19

R₃:  30 - (17/7)·13 = -11/7
     67 - (17/7)·17 = 180/7
     49 - (17/7)·19 = 20/7
     -171 - (17/7)·(-35) = -171 + 85 = -86

R₄:  39 - (19/7)·13 = 26/7
     49 - (19/7)·17 = 20/7
     65 - (19/7)·19 = 94/7
     -123 - (19/7)·(-35) = -123 + 95 = -28

|  7   13   17    19   |  -35 |
|  0   76/7 -11/7 26/7 |   19 |
|  0  -11/7 180/7 20/7 |  -86 |
|  0   26/7 20/7  94/7 |  -28 |` },
          { title: "Step 7 · ทำต่อ Gauss → solver (ใช้ Python ด้านล่าง)",
            body: `ที่เหลือ (เคลียร์ col 2, col 3) คำนวณยุ่งมาก — เน้นความเข้าใจ pattern แล้วใช้
Python หรือ Matrix mode บน fx-991CW แก้ Gauss

ผลลัพธ์ (เลขสวย!):
a₀ =  4
a₁ =  2
a₂ = -3
a₃ = -2` },
          { title: "Step 8 · สรุปสมการ Multiple Linear Regression",
            body: `y = 4 + 2·x₁ − 3·x₂ − 2·x₃

ตรวจกับแถว 7: x = (1, 6, 4) → y_pred = 4 + 2(1) - 3(6) - 2(4)
              = 4 + 2 - 18 - 8 = -20 ✓ (ตรงกับ y_actual = -20)

ตรวจกับแถว 1: x = (1, 0, 1) → y_pred = 4 + 2(1) - 3(0) - 2(1)
              = 4 + 2 - 0 - 2 = 4 ✓ (ตรงกับ y_actual = 4)

ข้อมูลชุดนี้พอดี (zero residuals ทุกแถว — โจทย์ตั้งใจให้คำตอบสวย)` },
        ]}/>

        <p style={{margin:"12px 0 6px"}}>สำหรับ general case ใช้ Z<sup>T</sup>Z, Z<sup>T</sup>y แล้วเรียก <code>numpy.linalg.solve</code> — สั้นและถูก:</p>

        <PythonRunner code={`import numpy as np

def multi_linear(X, y):
    """X: list of [x1, x2, ...] for each data point; y: list of y"""
    X = np.array(X, float); y = np.array(y, float)
    n, m = X.shape
    Z = np.column_stack([np.ones(n), X])     # design matrix
    ZTZ = Z.T @ Z
    ZTy = Z.T @ y
    print("ZᵀZ =\\n", np.round(ZTZ, 3))
    print("\\nZᵀy =", np.round(ZTy, 3))
    coef = np.linalg.solve(ZTZ, ZTy)
    return coef, ZTZ, ZTy

X = [[1,0,1],[0,1,3],[2,4,1],[3,2,2],[4,1,5],[2,3,3],[1,6,4]]
y = [4, -5, -6, 0, -1, -7, -20]
coef, _, _ = multi_linear(X, y)
print(f"\\ny = {coef[0]:.4f} + {coef[1]:.4f}x₁ + {coef[2]:.4f}x₂ + {coef[3]:.4f}x₃")

# คำนวณ residuals + RMSE
import numpy as np
y_pred = [coef[0] + coef[1]*r[0] + coef[2]*r[1] + coef[3]*r[2] for r in X]
res = [yi - yp for yi, yp in zip(y, y_pred)]
rmse = np.sqrt(np.mean(np.square(res)))
print(f"RMSE = {rmse:.4f}")`} height={300}/>

        <Callout kind="warn" title="fx-991CW · Stat mode ทำ Multiple Linear ไม่ได้! (สำคัญในห้องสอบ)">
          <p><b>Stat mode</b> ของ fx-991CW รองรับแค่ตัวแปรอิสระ <em>เดี่ยว</em> (y = a + bx, y = aˣᵇ, y = a·eᵇˣ ฯลฯ) — ไม่มี option สำหรับ Multiple Linear ที่มี x₁, x₂, x₃</p>
          <p style={{margin:"8px 0 4px"}}><b>วิธีในห้องสอบ — ใช้ 2 mode ผสมกัน:</b></p>
          <ol style={{margin:0, paddingLeft:18}}>
            <li>คำนวณ Σx_k, Σx_k², Σx_ix_j, Σx_ky <b>ทีละคู่</b> ใน <Key>Stat</Key> mode (เลือก 1-var หรือ 2-var)
              <br/><span style={{fontSize:'0.75rem', color:"var(--text-faint)"}}>เช่น ใส่ list x₁ กับ x₂ → ได้ Σx₁, Σx₂, Σx₁², Σx₂², Σx₁x₂</span></li>
            <li>ประกอบ matrix 4×4 ในกระดาษ (ใช้ค่าที่ออกมาทุกตัว)</li>
            <li>ไปที่ <Key>HOME</Key> → <code>Equation</code> → <code>Simul Equation</code> → เลือก <b>4 Unknowns</b> → ใส่ matrix 4×4 + RHS → กด <Key>EXE</Key> ได้ <M>{`a_0, a_1, a_2, a_3`}</M> ทันที</li>
          </ol>
          <p style={{margin:"6px 0 0", fontSize:'0.778rem'}}>fx-991CW รองรับ Simul Equation สูงสุด <b>4×4</b> — พอดีกับ Multiple Linear 3 ตัวแปร (4 unknowns)</p>
        </Callout>
      </Sect>

      <Sect tag="4" title="Linearization · จัดรูปให้เป็น Linear Regression">
        <p>โมเดล <b>nonlinear</b> ก็ใช้ Linear Regression ได้ — แค่ "ดัด" ตัวแปรให้เป็นเส้นตรง</p>

        <div className="grid-2">
          <Callout kind="good" title="โมเดล Exponential · y = a · eᵇˣ">
            <p>take ln ทั้ง 2 ข้าง:</p>
            <MB>{`\\ln y = \\ln a + b x`}</MB>
            <p>ตั้ง <M>{`Y = \\ln y, A_0 = \\ln a, A_1 = b`}</M> → Linear regression บน (x, Y)</p>
            <p style={{margin:0, fontSize:'0.75rem', color:"var(--text-dim)"}}>เสร็จแล้วถอด <M>{`a = e^{A_0}, b = A_1`}</M></p>
          </Callout>

          <Callout kind="good" title="โมเดล Power · y = a · xᵇ">
            <p>take log (หรือ ln) ทั้ง 2 ข้าง:</p>
            <MB>{`\\log y = \\log a + b \\log x`}</MB>
            <p>ตั้ง <M>{`X = \\log x, Y = \\log y, A_0 = \\log a, A_1 = b`}</M> → Linear (X, Y)</p>
            <p style={{margin:0, fontSize:'0.75rem', color:"var(--text-dim)"}}>ใช้ตอน scaling laws / physics</p>
          </Callout>

          <Callout kind="good" title="โมเดล Saturation · y = a·x / (b+x)">
            <p>กลับด้าน:</p>
            <MB>{`\\frac{1}{y} = \\frac{1}{a} + \\frac{b}{a}\\cdot\\frac{1}{x}`}</MB>
            <p>ตั้ง <M>{`X = 1/x, Y = 1/y`}</M> → Linear (X, Y) — slope = b/a, intercept = 1/a</p>
            <p style={{margin:0, fontSize:'0.75rem', color:"var(--text-dim)"}}>ใช้ใน biochemistry (Michaelis-Menten)</p>
          </Callout>

          <Callout kind="good" title="โมเดล Logarithmic · y = a + b·ln x">
            <p>ตั้ง <M>{`X = \\ln x`}</M> → Linear (X, y) โดยตรง</p>
          </Callout>
        </div>

        <h3>ตัวอย่าง · Exponential fit</h3>
        <p>ข้อมูล: <span className="mono">x = [1, 2, 3, 4, 5], y = [2.7, 7.4, 20.1, 54.6, 148.4]</span></p>
        <NumTable
          headers={["x", "y", "ln y"]}
          rows={[
            [1, 2.7, 0.993],
            [2, 7.4, 2.001],
            [3, 20.1, 3.001],
            [4, 54.6, 4.000],
            [5, 148.4, 5.000],
          ]}
        />
        <p>fit linear on (x, ln y): <M>{`\\ln y = 0 + 1.0 \\cdot x`}</M> → <M>{`a = e^0 = 1, b = 1.0`}</M> → <M>{`y = e^x`}</M> ✓</p>

        <PythonRunner code={`import math

def fit_exponential(xs, ys):
    """y = a e^(bx) → ln y = ln a + b x"""
    Y = [math.log(y) for y in ys]
    n = len(xs)
    sx = sum(xs); sy = sum(Y); sxx = sum(x*x for x in xs); sxy = sum(x*y for x, y in zip(xs, Y))
    b = (n*sxy - sx*sy) / (n*sxx - sx*sx)
    A0 = (sy - b*sx) / n
    a = math.exp(A0)
    return a, b

xs = [1, 2, 3, 4, 5]
ys = [2.7, 7.4, 20.1, 54.6, 148.4]
a, b = fit_exponential(xs, ys)
print(f"y ≈ {a:.4f} · e^({b:.4f} x)")

def fit_power(xs, ys):
    """y = a x^b → log y = log a + b log x"""
    X = [math.log10(x) for x in xs]; Y = [math.log10(y) for y in ys]
    n = len(xs)
    sx = sum(X); sy = sum(Y); sxx = sum(x*x for x in X); sxy = sum(x*y for x, y in zip(X, Y))
    b = (n*sxy - sx*sy) / (n*sxx - sx*sx)
    A0 = (sy - b*sx) / n
    a = 10**A0
    return a, b

xs2 = [1, 2, 3, 4, 5]
ys2 = [0.5, 2.0, 4.5, 8.0, 12.5]    # y = 0.5 x^2
a2, b2 = fit_power(xs2, ys2)
print(f"y ≈ {a2:.4f} · x^{b2:.4f}")`} height={280}/>

        <Callout kind="warn" title="ระวัง · Linearization บิดเบือน error">
          <p>เมื่อ take log/inverse — error ไม่ใช่ least-squares ของ y จริง ๆ อีกต่อไป → ค่าที่ได้อาจ <em>ไม่ใช่ optimal</em></p>
          <p style={{margin:0}}>ถ้าต้องการ optimal จริง ๆ ใช้ <em>non-linear regression</em> (Gauss-Newton, Levenberg-Marquardt) — เกินขอบเขตวิชานี้</p>
        </Callout>
      </Sect>

      <Sect tag="5" title="Interactive · Regression Solver">
        <RegressionSolver/>
      </Sect>

      <Sect tag="∑" title="Quick Ref">
        <NumTable
          headers={["Method", "Model", "ตัวแปรไม่รู้", "ใช้กับ", "ข้อสอบ"]}
          rows={[
            ["Linear", "y = a₀ + a₁x", "2", "ข้อมูลเส้นตรง", "★★★"],
            ["Polynomial", "y = Σaᵢxⁱ", "m+1", "ข้อมูลโค้ง (degree 2-3)", "★★★"],
            ["Multiple Linear", "y = a₀ + Σaᵢxᵢ", "m+1", "ตัวแปรอิสระหลายตัว", "★★"],
            ["Exponential", "y = a·eᵇˣ → linearize", "2 (a, b)", "growth/decay", "★★"],
            ["Power", "y = a·xᵇ → linearize", "2", "scaling laws", "★"],
            ["Saturation", "y = ax/(b+x) → linearize", "2", "biochem, kinetics", "★"],
          ]}
        />

        <Callout kind="tip" title="วิธีจำ · เลือก method">
          <ul>
            <li>scatter เป็นเส้นตรง → Linear</li>
            <li>scatter โค้ง (เด้งครั้งเดียว) → Polynomial degree 2</li>
            <li>scatter โค้งหลายเด้ง → Polynomial degree สูงขึ้น (แต่ระวัง overfit)</li>
            <li>scatter วิ่งสูงเป็นเท่าตัว → Exponential</li>
            <li>scatter ดูเป็น log-log เป็นเส้นตรง → Power</li>
            <li>หลายตัวแปร x₁, x₂, … → Multiple Linear</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · Linear Regression" solution={
          <div>
            <p>n = 5, Σx = 15, Σy = 27, Σxy = 99, Σx² = 55</p>
            <p>Normal equations:</p>
            <MB>{`\\begin{pmatrix} 5 & 15 \\\\ 15 & 55 \\end{pmatrix}\\begin{pmatrix} a_0 \\\\ a_1 \\end{pmatrix} = \\begin{pmatrix} 27 \\\\ 99 \\end{pmatrix}`}</MB>
            <p>แก้ได้ <M>{`a_1 = 2.4, a_0 = 0.2`}</M> → <M>{`y = 0.2 + 2.4x`}</M></p>
          </div>
        }>
          ข้อมูล: x = [1,2,3,4,5], y = [3,5,8,10,11]<br/>
          หาเส้น <M>y = a_0 + a_1 x</M> ที่ดีที่สุดด้วย least-squares
        </Problem>

        <Problem label="ข้อ 2 · Quadratic" solution={
          <p>ใช้สูตร Normal Equation 3×3 — n=6, Σx=15, Σx²=55, Σx³=225, Σx⁴=979, Σy=152.6, Σxy=585.6, Σx²y=2488.8</p>
        }>
          ข้อมูล: x = [0,1,2,3,4,5], y = [2.1, 7.7, 13.6, 27.2, 40.9, 61.1]<br/>
          Fit polynomial degree 2 และคำนวณ <M>y(4.5)</M>
        </Problem>
      </Sect>
    </div>
  );
}

function RegressionSolver() {
  const [model, setModel] = React.useState("linear");
  const [degree, setDegree] = React.useState(2);
  const [xs, setXs] = React.useState(["1","2","3","4","5"]);
  const [ys, setYs] = React.useState(["3","5","8","10","11"]);
  const [xq, setXq] = React.useState("3.5");

  const xn = xs.map(parseFloat).filter(v => !isNaN(v));
  const yn = ys.map(parseFloat).filter(v => !isNaN(v));
  const x = parseFloat(xq);
  const ok = xn.length === yn.length && xn.length >= 2 && !isNaN(x);

  let coef = null, predict = null, expr = "";
  if (ok) {
    if (model === "linear") {
      const r = linearRegression(xn, yn);
      coef = [r.a0, r.a1]; predict = r.eval(x); expr = `y = ${num(r.a0, 4)} + ${num(r.a1, 4)} x`;
    } else if (model === "poly") {
      const r = polyRegression(xn, yn, degree);
      coef = r.coeffs; predict = r.eval(x);
      expr = "y = " + r.coeffs.map((c, i) => i === 0 ? num(c,4) : `${c >= 0 ? "+ " : "− "}${num(Math.abs(c),4)} x${i > 1 ? '^'+i : ''}`).join(" ");
    } else if (model === "exp") {
      // y = a e^(bx) → ln y = ln a + b x
      const Y = yn.map(v => Math.log(v));
      const r = linearRegression(xn, Y);
      const a = Math.exp(r.a0), b = r.a1;
      coef = [a, b]; predict = a * Math.exp(b * x); expr = `y = ${num(a,4)} · exp(${num(b,4)} x)`;
    } else if (model === "power") {
      const X = xn.map(v => Math.log(v)), Y = yn.map(v => Math.log(v));
      const r = linearRegression(X, Y);
      const a = Math.exp(r.a0), b = r.a1;
      coef = [a, b]; predict = a * Math.pow(x, b); expr = `y = ${num(a,4)} · x^${num(b,4)}`;
    }
  }

  return (
    <div className="solver-shell">
      <h4>Regression Solver</h4>
      <div className="chip-row">
        {[["linear","Linear"],["poly","Polynomial"],["exp","Exponential"],["power","Power"]].map(([k,l]) => (
          <button key={k} className={"btn small " + (model === k ? "primary" : "")} onClick={() => setModel(k)}>{l}</button>
        ))}
        {model === "poly" && <span className="input-row" style={{display:"inline-flex"}}>
          <label>degree:</label>
          <input type="number" min="1" max="6" value={degree} onChange={e => setDegree(+e.target.value)} style={{width:60}}/>
        </span>}
      </div>
      <PointsInput xs={xs} ys={ys} onChange={(nx, ny) => { setXs(nx); setYs(ny); }}/>
      <div className="input-row">
        <label>ทำนายที่ x =</label>
        <input type="text" value={xq} onChange={e => setXq(e.target.value)} style={{width:100}}/>
      </div>
      {ok && coef && (
        <div className="callout good">
          <div style={{fontFamily:"var(--font-mono)"}}>{expr}</div>
          <div style={{marginTop:6, fontFamily:"var(--font-mono)"}}><b>y({fmt(x,4)}) ≈ {fmt(predict, 6)}</b></div>
        </div>
      )}
    </div>
  );
}
function num(v, p = 4) { return (+v).toFixed(p).replace(/\.?0+$/, ""); }

// Animated: line starts flat at mean(y), then rotates/shifts toward the least-squares fit (SSE ↓)
function ScatterLineViz({ xs, ys }) {
  const { a0, a1 } = linearRegression(xs, ys);
  const W = 600, H = 320;
  const padding = { l: 40, r: 12, t: 14, b: 26 };
  const xMin = Math.min(...xs) - 1, xMax = Math.max(...xs) + 1;
  const yMin = Math.min(...ys) - 1, yMax = Math.max(...ys) + 1;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const meanY = ys.reduce((s, v) => s + v, 0) / ys.length;
  const a0s = meanY, a1s = 0;     // naive start: flat line through the mean
  const sse = (A0, A1) => xs.reduce((s, x, i) => s + (ys[i] - (A0 + A1*x))**2, 0);
  const nSteps = 7;
  return (
    <StepPlayer steps={nSteps} stepDuration={950} label={(s) => s === nSteps-1 ? "Least-squares ✓" : `ปรับเส้น ${s+1}/${nSteps}`}>
      {({ step }) => {
        const t = step / (nSteps - 1);
        const A0 = a0s + (a0 - a0s) * t;
        const A1 = a1s + (a1 - a1s) * t;
        const isFinal = step === nSteps - 1;
        const linePath = plotPath(x => A0 + A1*x, xMin, xMax, sx, sy, 30);
        const E = sse(A0, A1);
        const lineColor = isFinal ? "#58c4dd" : "#f6a85f";
        return (
          <div>
            <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
              <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
              {xs.map((x, i) => {
                const yp = A0 + A1*x;
                return <line key={i} x1={sx(x)} y1={sy(ys[i])} x2={sx(x)} y2={sy(yp)} stroke="#f47274" strokeWidth="1.5" strokeDasharray="2 3"/>;
              })}
              <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.5" strokeDasharray={isFinal ? null : "6 4"}/>
              {xs.map((x, i) => (
                <circle key={i} cx={sx(x)} cy={sy(ys[i])} r="5" fill="#ffd66b" stroke="#0e1116" strokeWidth="1.5"/>
              ))}
              <text x={W-padding.r-10} y={padding.t+18} textAnchor="end" fill={lineColor} fontFamily="JetBrains Mono" fontSize="12">
                y = {A0.toFixed(3)} + {A1.toFixed(3)}x
              </text>
              <text x={W-padding.r-10} y={padding.t+36} textAnchor="end" fill="#f47274" fontFamily="JetBrains Mono" fontSize="12">
                SSE = {E.toFixed(3)}
              </text>
            </svg>
            <p className="muted" style={{fontSize:'0.778rem', marginTop:4}}>
              ▶ เส้นเริ่มจากแนวราบที่ค่าเฉลี่ย แล้วค่อยปรับจน <b>SSE ต่ำสุด</b> &nbsp;·&nbsp;
              <span style={{color:"var(--yellow)"}}>●</span> ข้อมูล &nbsp;
              <span style={{color:"var(--red)"}}>┊</span> residual
            </p>
          </div>
        );
      }}
    </StepPlayer>
  );
}

window.RegressionLesson = RegressionLesson;
