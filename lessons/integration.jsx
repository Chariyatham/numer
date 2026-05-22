// Integration — Trapezoidal, Composite Trap, Simpson 1/3, Composite Simpson

function IntegrationLesson() {
  // Slide example: ∫ from 2 to 8 of 4x^3 - 33x^2 + 23x + 2 dx
  // f(x) = 4x³ - 33x² + 23x + 2, true value = 155938.4? — actually let me recompute
  // Slide says true value 155938 — let's use a different example for clarity

  // We'll use: ∫_0^2 (e^x) dx, true = e^2 - 1 ≈ 6.389056

  return (
    <div>
      <Hero
        kicker="07 · Integration"
        title="Numerical Integration"
        lead="ประมาณค่า ∫ f(x) dx โดยการหาพื้นที่ใต้กราฟด้วยรูปทรงที่คำนวณง่าย — Trapezoidal และ Simpson"
        meta={["Trapezoidal", "Composite Trap", "Simpson 1/3", "Composite Simpson"]}
      />

      <Sect tag="0" title="ทำไมต้อง Numerical Integration?">
        <p>integral บางตัวคำนวณ analytical ไม่ได้ เช่น:</p>
        <ul>
          <li><M>{`\\int e^{-x^2} dx`}</M> (กระดิ่ง Gaussian — ไม่มี elementary function)</li>
          <li><M>{`\\int \\sin(x^2) dx`}</M> (Fresnel integral)</li>
          <li>หรือมี <M>f(x)</M> แค่จุดข้อมูล (data ไม่มีสมการ)</li>
        </ul>
        <p>วิธีแก้: <b>ประมาณพื้นที่ใต้กราฟ</b>ด้วยรูปทรงง่าย ๆ</p>
      </Sect>

      <Sect tag="1" title="Trapezoidal Rule — ใช้คางหมู">
        <h3>แนวคิด</h3>
        <p>แทนที่เส้นโค้งด้วย "เส้นตรง" ผ่าน <M>{`(a, f(a))`}</M> และ <M>{`(b, f(b))`}</M> — ได้รูปคางหมู</p>

        <Formula>
          <MB>{`I \\approx \\frac{h}{2}\\left[f(a) + f(b)\\right], \\quad h = b - a`}</MB>
        </Formula>

        <p className="muted" style={{fontSize:13}}>มาจากสูตรพื้นที่คางหมู = (ผลบวกของด้านขนาน × สูง) / 2 — ด้านขนานคือ f(a) กับ f(b), สูงคือ h</p>

        <TrapezoidViz/>

        <Callout kind="warn" title="error ของ trapezoidal (single)">
          <p>เกิดจากการประมาณเส้นโค้งด้วยเส้นตรง: <M>{`E = -\\dfrac{(b-a)^3}{12} f''(\\xi)`}</M> สำหรับ <M>{`\\xi`}</M> ใดในช่วง <M>{`[a, b]`}</M></p>
          <p>error เป็น <M>{`O(h^3)`}</M> — ถ้าช่วงใหญ่ error จะใหญ่มาก</p>
        </Callout>
      </Sect>

      <Sect tag="2" title="Composite Trapezoidal — แบ่งช่วงย่อย">
        <p>แบ่งช่วง <M>[a, b]</M> เป็น n ช่วงย่อยเท่า ๆ กัน แล้วใช้ trapezoidal กับแต่ละช่วง รวมพื้นที่ทั้งหมด</p>

        <Formula>
          <MB>{`I \\approx \\frac{h}{2}\\left[f(x_0) + f(x_n) + 2\\sum_{i=1}^{n-1} f(x_i)\\right], \\quad h = \\frac{b-a}{n}`}</MB>
        </Formula>

        <Callout kind="tip" title="วิธีจำ">
          <ul>
            <li>จุดปลาย (x₀, xₙ) คูณ <b>1</b></li>
            <li>จุดกลาง (x₁, x₂, ..., xₙ₋₁) คูณ <b>2</b></li>
            <li>คูณทั้งหมดด้วย <b>h/2</b></li>
          </ul>
        </Callout>

        <CompositeViz kind="trap"/>

        <h3>ตัวอย่างจากสไลด์</h3>
        <p>หา <M>{`\\int_{a}^{b} f(x) dx`}</M> โดยแบ่ง n=4 ช่วง:</p>
        <NumTable
          headers={["i", "xᵢ", "f(xᵢ)", "น้ำหนัก"]}
          rows={[
            [0, "a", "f(a)", "×1"],
            [1, "a+h", "f(x₁)", "×2"],
            [2, "a+2h", "f(x₂)", "×2"],
            [3, "a+3h", "f(x₃)", "×2"],
            [4, "b", "f(b)", "×1"],
          ]}
        />
      </Sect>

      <Sect tag="3" title="Simpson's 1/3 Rule — ใช้พาราโบลา">
        <h3>แนวคิด</h3>
        <p>แทนที่เส้นโค้งด้วย "พาราโบลา" ผ่าน 3 จุด: <M>{`(a, f(a)), (m, f(m)), (b, f(b))`}</M> โดย m คือจุดกลาง</p>

        <Formula>
          <MB>{`I \\approx \\frac{h}{3}\\left[f(a) + 4 f(m) + f(b)\\right], \\quad h = \\frac{b-a}{2}`}</MB>
        </Formula>

        <Callout kind="good" title="ทำไม 4 ตรงกลาง?">
          <p>มาจากการ integrate พาราโบลาผ่าน 3 จุด แล้วจัดรูป — น้ำหนักที่ได้คือ <M>(1, 4, 1)</M></p>
          <p>error: <M>{`E = -\\dfrac{(b-a)^5}{2880} f^{(4)}(\\xi)`}</M> — เร็วกว่า trapezoidal มาก!</p>
        </Callout>

        <SimpsonViz/>
      </Sect>

      <Sect tag="4" title="Composite Simpson's 1/3 Rule">
        <p>แบ่งช่วงเป็น n ช่วงย่อย (<b>n ต้องเป็นเลขคู่เท่านั้น!</b>) แล้วใช้ Simpson กับ 2 ช่วงย่อยต่อครั้ง</p>

        <Formula>
          <MB>{`I \\approx \\frac{h}{3}\\left[f(x_0) + f(x_n) + 4\\sum_{i \\text{ คี่}} f(x_i) + 2\\sum_{i \\text{ คู่}} f(x_i)\\right]`}</MB>
        </Formula>

        <Callout kind="warn" title="กฎ 1, 4, 2, 4, 2, ..., 4, 1">
          <ul>
            <li>x₀: ×1 (ปลายซ้าย)</li>
            <li>xₙ: ×1 (ปลายขวา)</li>
            <li>i เป็นเลข<b>คี่</b> (i = 1, 3, 5, ...): ×4</li>
            <li>i เป็นเลข<b>คู่</b> (i = 2, 4, 6, ..., n-2): ×2</li>
            <li>n ต้องเป็นเลข<b>คู่</b> (ถ้าไม่ใช่ ใช้ Simpson ไม่ได้!)</li>
          </ul>
        </Callout>

        <CompositeViz kind="simpson"/>

        <h3>เปรียบเทียบ — Trap vs Simpson ที่ n เดียวกัน</h3>
        <CompareTrapSimpson/>

        <h3>Python — ครบทุก method</h3>
        <PythonRunner code={`import math

def trapezoid(f, a, b):
    return (b - a) / 2 * (f(a) + f(b))

def composite_trap(f, a, b, n):
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += 2 * f(a + i*h)
    return h / 2 * s

def simpson(f, a, b):
    m = (a + b) / 2
    return (b - a) / 6 * (f(a) + 4*f(m) + f(b))

def composite_simpson(f, a, b, n):
    if n % 2 != 0:
        raise ValueError("n ต้องเป็นเลขคู่!")
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i*h)
    return h / 3 * s

# ทดสอบ: ∫_0^2 e^x dx = e^2 - 1 ≈ 6.389056
f = lambda x: math.exp(x)
true_val = math.exp(2) - 1

print(f"{'method':<25} {'value':>12} {'error %':>10}")
print(f"{'true':<25} {true_val:>12.6f} {'-':>10}")

for method, name, *args in [
    (trapezoid, "Trap (single)", 0, 2),
    (composite_trap, "Composite Trap n=4", 0, 2, 4),
    (composite_trap, "Composite Trap n=10", 0, 2, 10),
    (simpson, "Simpson (single)", 0, 2),
    (composite_simpson, "Composite Simp n=4", 0, 2, 4),
    (composite_simpson, "Composite Simp n=10", 0, 2, 10),
]:
    val = method(f, *args)
    err = abs(true_val - val) / true_val * 100
    print(f"{name:<25} {val:>12.6f} {err:>10.4f}")`} height={320}/>
      </Sect>

      <Sect tag="5" title="Romberg Integration — เร่งความแม่นด้วย Richardson Extrapolation">
        <p>Romberg คือการใช้ <em>Richardson extrapolation</em> เพื่อ "ขยาย" ผลของ Composite Trap ให้แม่นยำขึ้นแบบ exponential</p>

        <Formula label="Richardson formula">
          <MB>{`R_{k,j} = \\frac{4^j R_{k,j-1} - R_{k-1,j-1}}{4^j - 1}`}</MB>
          <p style={{fontSize:13, color:"var(--text-dim)", margin:"4px 0 0"}}>คอลัมน์แรก <M>{`R_{k,0}`}</M> = Composite Trap ที่ <M>{`n = 2^k`}</M> ช่วง</p>
        </Formula>

        <Callout kind="good" title="พลังของ Romberg">
          <p>คอลัมน์ 0 = O(h²), คอลัมน์ 1 = O(h⁴), คอลัมน์ 2 = O(h⁶), ...</p>
          <p style={{margin:0}}>แต่ละขั้นไปขวาเพิ่มความแม่น 2 อันดับ — แค่ 4-5 ระดับก็ <em>แม่นกว่า Simpson เป็นล้านเท่า</em></p>
        </Callout>

        <h3>ตัวอย่าง · <M>{`\\int_0^{\\pi/2} \\sin x\\, dx = 1`}</M></h3>
        <RombergViz/>

        <h3>Python — Romberg ครบ</h3>
        <PythonRunner code={`import math

def romberg(f, a, b, levels=5):
    R = [[0]*levels for _ in range(levels)]
    # คอลัมน์ 0 = composite trap ที่ n=1, 2, 4, 8, ...
    for k in range(levels):
        n = 2**k
        h = (b - a) / n
        R[k][0] = h/2 * (f(a) + f(b) + 2*sum(f(a + i*h) for i in range(1, n)))
    # extrapolate
    for j in range(1, levels):
        for k in range(j, levels):
            R[k][j] = (4**j * R[k][j-1] - R[k-1][j-1]) / (4**j - 1)
    return R

f = lambda x: math.sin(x)
T = romberg(f, 0, math.pi/2, 5)
print("Romberg table:")
for i, row in enumerate(T):
    print(" ", [f"{v:.8f}" for v in row[:i+1]])
print(f"\\nคำตอบ ≈ {T[-1][-1]:.10f}  (จริง = 1)")`} height={240}/>
      </Sect>

      <Sect tag="6" title="Gauss-Legendre Quadrature — แม่นด้วยจุดน้อยที่สุด">
        <p>แทนที่จะใช้จุดห่างเท่ากัน (เหมือน Trap/Simpson) — Gauss เลือกจุดให้<b>แม่นที่สุด</b>สำหรับพหุนามให้ได้ degree สูงสุด</p>

        <Formula label="Gauss-Legendre บน [a, b]">
          <MB>{`\\int_a^b f(x)\\,dx \\approx \\frac{b-a}{2}\\sum_{i=1}^{N} w_i\\, f\\!\\left(\\frac{a+b}{2} + \\frac{b-a}{2}\\,t_i\\right)`}</MB>
          <p style={{fontSize:13, color:"var(--text-dim)", margin:"4px 0 0"}}>จุด <M>{`t_i`}</M> และน้ำหนัก <M>{`w_i`}</M> เป็นค่าคงตัวมาตรฐาน (ตามตาราง)</p>
        </Formula>

        <NumTable
          headers={["N", "tᵢ (nodes บน [−1,1])", "wᵢ (weights)", "Exact for polynomial degree"]}
          rows={[
            ["2", "±0.5774 (= ±1/√3)", "1, 1", "3"],
            ["3", "0, ±0.7746 (= ±√(3/5))", "8/9, 5/9, 5/9", "5"],
            ["4", "±0.3399, ±0.8611", "0.6521, 0.3479", "7"],
          ]}
        />

        <Callout kind="tip" title="ทำไม Gauss-Legendre เก่ง">
          <p>2 จุด → integration <b>เป๊ะ</b>สำหรับ polynomial degree ≤ 3 — Simpson 1/3 ต้องใช้ 3 จุดถึงทำได้</p>
          <p>3 จุด → เป๊ะถึง degree 5 — เทียบเท่า Composite Simpson หลายช่วง</p>
          <p style={{margin:0}}>ใช้กับฟังก์ชันที่ smooth → cost น้อยมาก, แม่นยำมาก</p>
        </Callout>

        <h3>ตัวอย่าง · <M>{`\\int_0^1 e^x\\, dx = e - 1 \\approx 1.71828`}</M></h3>
        <GaussLegendreViz/>

        <PythonRunner code={`import math

# Gauss-Legendre 2-point and 3-point
NODES_2 = [-1/math.sqrt(3), 1/math.sqrt(3)]; W_2 = [1, 1]
NODES_3 = [-math.sqrt(3/5), 0, math.sqrt(3/5)]; W_3 = [5/9, 8/9, 5/9]

def gauss_legendre(f, a, b, N=2):
    nodes, weights = (NODES_2, W_2) if N == 2 else (NODES_3, W_3)
    mid = (a+b)/2; half = (b-a)/2
    return half * sum(w * f(mid + half*t) for t, w in zip(nodes, weights))

f = lambda x: math.exp(x)
true_val = math.e - 1
print(f"True integral = {true_val:.10f}\\n")
for N in [2, 3]:
    val = gauss_legendre(f, 0, 1, N)
    err = abs(val - true_val) / true_val * 100
    print(f"Gauss-Legendre {N}-point: {val:.10f}  err = {err:.6e} %")

# เทียบ Composite Simpson
def simp(f, a, b, n):
    h = (b-a)/n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i%2 else 2)*f(a+i*h)
    return h/3 * s
print(f"\\nComp.Simpson n=2:  {simp(f, 0, 1, 2):.10f}")
print(f"Comp.Simpson n=4:  {simp(f, 0, 1, 4):.10f}")`} height={280}/>
      </Sect>

      <Sect tag="7" title="Interactive · Integration Solver">
        <IntegrationSolver/>
      </Sect>

      <Sect tag="8" title="Error vs n · ดูทำไม Simpson แม่นกว่า">
        <p>plot log-log ของ error เทียบกับ n สำหรับ <M>{`\\int_0^1 e^x dx`}</M> — slope บอกอันดับการลู่เข้า</p>
        <ErrorVsNPlot/>
      </Sect>

      <Sect tag="∑" title="Quick Ref · เปรียบเทียบ">
        <NumTable
          headers={["Method", "สูตร", "Error", "เงื่อนไข"]}
          rows={[
            ["Trapezoidal", "(h/2)(f₀+f₁)", "O(h³)", "—"],
            ["Composite Trap", "(h/2)(f₀+fₙ+2Σ)", "O(h²) overall", "n ≥ 1"],
            ["Simpson 1/3", "(h/3)(f₀+4f₁+f₂)", "O(h⁵)", "3 จุด"],
            ["Composite Simp", "(h/3)(f₀+fₙ+4Σคี่+2Σคู่)", "O(h⁴) overall", "n เป็น<b>คู่</b>!"],
            ["Simpson 3/8", "(3h/8)(f₀+3f₁+3f₂+f₃)", "O(h⁵)", "n = 3"],
            ["Romberg (k)", "Extrapolate Trap", "O(h^(2k+2))", "doubled n"],
            ["Gauss-Leg 2-pt", "(b-a)/2 · Σ wᵢf(xᵢ)", "exact ถึง degree 3", "2 จุด"],
            ["Gauss-Leg 3-pt", "(b-a)/2 · Σ wᵢf(xᵢ)", "exact ถึง degree 5", "3 จุด"],
          ]}
        />

        <Callout kind="tip" title="วิธีเลือก">
          <ul>
            <li>โจทย์ให้ <em>กี่จุด</em> ก็ตามตรง — บอก f ที่ 5 จุด, 9 จุด → Composite Simpson (n=4, 8)</li>
            <li>โจทย์มีจุดคู่ → Simpson ตลอด (แม่นกว่า)</li>
            <li>โจทย์มีจุดคี่ (เช่น 4 จุด → n=3) → ใช้ Composite Trap หรือ Simpson 3/8</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · เทียบ 3 method" solution={
          <PythonRunner code={`import math
f = lambda x: math.sin(x) / x if x != 0 else 1.0
# จริง ๆ ค่านี้ไม่มีรูปปิด แต่ scipy ให้ ≈ 0.946083
true_val = 0.946083

def trap(f, a, b, n):
    h = (b-a)/n
    return h/2 * (f(a) + f(b) + 2*sum(f(a+i*h) for i in range(1,n)))

def simp(f, a, b, n):
    h = (b-a)/n
    return h/3 * (f(a)+f(b) + sum((4 if i%2 else 2)*f(a+i*h) for i in range(1,n)))

print("n  | Comp.Trap | err%   | Comp.Simp | err%")
for n in [4, 8, 16]:
    t = trap(f, 0.001, 1, n); s = simp(f, 0.001, 1, n)
    print(f"{n:2d} | {t:.6f}  | {abs(true_val-t)/true_val*100:.4f} | {s:.6f}  | {abs(true_val-s)/true_val*100:.4f}")`} height={200}/>
        }>
          คำนวณ <M>{`\\int_0^1 \\frac{\\sin x}{x} dx`}</M> โดยใช้:
          <ol>
            <li>Composite Trapezoidal (n=4, 8, 16)</li>
            <li>Composite Simpson (n=4, 8, 16)</li>
          </ol>
          เทียบกับค่าจริง 0.946083 + คำนวณ error %
        </Problem>

        <Problem label="ข้อ 2 · เลือก method" solution={
          <p>n = 5 → odd → ใช้ Simpson 1/3 <b>ไม่ได้</b>! ต้องใช้ Composite Trapezoidal หรือผสม Simpson 1/3 (4 ช่วงแรก, n=4) + Trapezoidal (ช่วงที่ 5)</p>
        }>
          คุณมี f(x) ที่ x = 0, 0.5, 1, 1.5, 2, 2.5 (รวม 6 จุด) — จะคำนวณ <M>{`\\int_0^{2.5} f(x) dx`}</M> ด้วย Simpson 1/3 ได้ไหม? อธิบาย
        </Problem>
      </Sect>
    </div>
  );
}

function TrapezoidViz() {
  const f = x => Math.exp(x);
  const a = 0, b = 2;
  const W = 580, H = 280;
  const padding = { l: 38, r: 12, t: 14, b: 26 };
  const xMin = -0.3, xMax = 2.3;
  const yMin = -0.5, yMax = 8;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const fnPath = plotPath(f, xMin, xMax, sx, sy, 200);
  const I = trapezoid(f, a, b);
  const trueI = Math.exp(2) - 1;
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
          Trap: {I.toFixed(4)} · จริง: {trueI.toFixed(4)} · err: {(Math.abs(trueI-I)/trueI*100).toFixed(2)}%
        </text>
      </svg>
      <p className="muted" style={{fontSize:13, marginTop:6}}>
        <M>{`\\int_0^2 e^x dx`}</M> — เส้นเหลืองคือฟังก์ชันจริง, สีฟ้าคือคางหมูที่ประมาณ (เห็นว่าใหญ่กว่าพื้นที่จริงเพราะ <M>{`e^x`}</M> นูนขึ้น)
      </p>
    </div>
  );
}

function SimpsonViz() {
  const f = x => Math.exp(x);
  const a = 0, b = 2;
  const m = (a+b)/2;
  const W = 580, H = 280;
  const padding = { l: 38, r: 12, t: 14, b: 26 };
  const xMin = -0.3, xMax = 2.3;
  const yMin = -0.5, yMax = 8;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const fnPath = plotPath(f, xMin, xMax, sx, sy, 200);
  // Parabola through 3 points
  const x0 = a, x1 = m, x2 = b, y0 = f(a), y1 = f(m), y2 = f(b);
  // Use Lagrange to evaluate parabola
  const parab = (x) => {
    const L0 = (x-x1)*(x-x2)/((x0-x1)*(x0-x2));
    const L1 = (x-x0)*(x-x2)/((x1-x0)*(x1-x2));
    const L2 = (x-x0)*(x-x1)/((x2-x0)*(x2-x1));
    return y0*L0 + y1*L1 + y2*L2;
  };
  const parabPath = plotPath(parab, a, b, sx, sy, 100);
  // Filled area under parabola
  let areaD = `M ${sx(a)} ${sy(0)} `;
  for (let i = 0; i <= 60; i++) {
    const x = a + (b-a)*i/60;
    areaD += `L ${sx(x)} ${sy(parab(x))} `;
  }
  areaD += `L ${sx(b)} ${sy(0)} Z`;
  const I = simpson(f, a, b);
  const trueI = Math.exp(2) - 1;
  return (
    <div>
      <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
        <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
        <path d={areaD} fill="#a87dbe" opacity="0.20"/>
        <path d={fnPath} fill="none" stroke="#ffd66b" strokeWidth="2.5"/>
        <path d={parabPath} fill="none" stroke="#a87dbe" strokeWidth="2"/>
        {[a, m, b].map((x, i) => <circle key={i} cx={sx(x)} cy={sy(f(x))} r="4" fill="#83c167"/>)}
        <text x={W-padding.r-10} y={padding.t+18} textAnchor="end" fontFamily="JetBrains Mono" fontSize="12" fill="#a87dbe">
          Simp: {I.toFixed(4)} · จริง: {trueI.toFixed(4)} · err: {(Math.abs(trueI-I)/trueI*100).toFixed(3)}%
        </text>
      </svg>
      <p className="muted" style={{fontSize:13, marginTop:6}}>
        เส้นม่วงคือพาราโบลาผ่าน 3 จุด — แม่นยำกว่าเส้นตรงเยอะ
      </p>
    </div>
  );
}

function CompositeViz({ kind }) {
  const [n, setN] = React.useState(4);
  const f = x => Math.exp(x);
  const a = 0, b = 2;
  const W = 580, H = 280;
  const padding = { l: 38, r: 12, t: 14, b: 26 };
  const xMin = -0.3, xMax = 2.3;
  const yMin = -0.5, yMax = 8;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const fnPath = plotPath(f, xMin, xMax, sx, sy, 200);
  const h = (b-a)/n;
  const trueI = Math.exp(2) - 1;
  let I, shapes;
  if (kind === "trap") {
    I = compositeTrap(f, a, b, n);
    shapes = [];
    for (let i = 0; i < n; i++) {
      const x1 = a + i*h, x2 = a + (i+1)*h;
      shapes.push(<polygon key={i} points={`${sx(x1)},${sy(0)} ${sx(x1)},${sy(f(x1))} ${sx(x2)},${sy(f(x2))} ${sx(x2)},${sy(0)}`} fill="#58c4dd" opacity="0.16" stroke="#58c4dd" strokeWidth="1.5"/>);
    }
  } else {
    I = compositeSimpson(f, a, b, n);
    shapes = [];
    for (let i = 0; i < n; i += 2) {
      const x0 = a + i*h, x1 = a + (i+1)*h, x2 = a + (i+2)*h;
      const y0 = f(x0), y1 = f(x1), y2 = f(x2);
      const par = x => {
        const L0 = (x-x1)*(x-x2)/((x0-x1)*(x0-x2));
        const L1 = (x-x0)*(x-x2)/((x1-x0)*(x1-x2));
        const L2 = (x-x0)*(x-x1)/((x2-x0)*(x2-x1));
        return y0*L0 + y1*L1 + y2*L2;
      };
      let d = `M ${sx(x0)} ${sy(0)} `;
      for (let k = 0; k <= 30; k++) {
        const x = x0 + (x2-x0)*k/30;
        d += `L ${sx(x)} ${sy(par(x))} `;
      }
      d += `L ${sx(x2)} ${sy(0)} Z`;
      shapes.push(<path key={i} d={d} fill="#a87dbe" opacity="0.18" stroke="#a87dbe" strokeWidth="1.5"/>);
    }
  }
  return (
    <div>
      <div className="chip-row">
        <span className="muted">n = </span>
        {[2, 4, 6, 8, 12, 20].map(v => (
          <button key={v} className={"btn small " + (n === v ? "primary" : "")} onClick={() => setN(v)}>{v}</button>
        ))}
      </div>
      <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
        <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
        {shapes}
        <path d={fnPath} fill="none" stroke="#ffd66b" strokeWidth="2.5"/>
        <text x={W-padding.r-10} y={padding.t+18} textAnchor="end" fontFamily="JetBrains Mono" fontSize="12" fill={kind === "trap" ? "#58c4dd" : "#a87dbe"}>
          n={n} → I = {I.toFixed(6)} · err = {(Math.abs(trueI-I)/trueI*100).toFixed(4)}%
        </text>
      </svg>
    </div>
  );
}

function CompareTrapSimpson() {
  return (
    <NumTable
      headers={["n", "Comp. Trap", "Trap err %", "Comp. Simpson", "Simp err %"]}
      rows={[2,4,6,8,12,20].map(n => {
        const f = x => Math.exp(x);
        const t = compositeTrap(f, 0, 2, n);
        const s = compositeSimpson(f, 0, 2, n);
        const tv = Math.exp(2) - 1;
        return [n, t.toFixed(6), (Math.abs(tv-t)/tv*100).toFixed(4), s.toFixed(6), (Math.abs(tv-s)/tv*100).toFixed(6)];
      })}
    />
  );
}

function RombergViz() {
  const [levels, setLevels] = React.useState(5);
  const f = x => Math.sin(x);
  const a = 0, b = Math.PI / 2;
  const { table } = romberg(f, a, b, levels);
  return (
    <div>
      <div className="input-row">
        <label>Levels:</label>
        <input type="range" min="2" max="7" value={levels} onChange={e => setLevels(+e.target.value)} style={{flex:1, maxWidth:280}}/>
        <span className="mono" style={{color:"var(--yellow)"}}>k = {levels}</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <table className="tbl" style={{fontFamily:"var(--font-mono)", fontSize:12}}>
          <thead><tr>
            <th>k\\j</th>
            {Array.from({length: levels}, (_, j) => <th key={j}>R[k,{j}]</th>)}
          </tr></thead>
          <tbody>
            {table.map((row, k) => (
              <tr key={k} className={k === levels-1 ? "hi" : ""}>
                <td>{k}</td>
                {row.map((v, j) => j <= k
                  ? <td key={j} className="num" style={{color: j === k && k === levels-1 ? "var(--green)" : undefined}}>{(+v).toFixed(10)}</td>
                  : <td key={j}></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout kind="good" style={{marginTop:8}}>
        ค่าที่แม่นที่สุด (มุมขวาล่างสีเขียว) = <b style={{fontFamily:"var(--font-mono)"}}>{table[levels-1][levels-1].toFixed(12)}</b> · ค่าจริง = 1
      </Callout>
    </div>
  );
}

function GaussLegendreViz() {
  const f = x => Math.exp(x);
  const [N, setN] = React.useState(2);
  const a = 0, b = 1;
  const { value, rows } = gaussLegendre(f, a, b, N);
  const trueVal = Math.E - 1;
  const W = 580, H = 280, padding = { l: 38, r: 12, t: 14, b: 26 };
  const sx = makeScale([-0.1, 1.1], [padding.l, W - padding.r]);
  const sy = makeScale([0, 3.0], [H - padding.b, padding.t]);
  return (
    <div>
      <div className="chip-row">
        {[2, 3, 4].map(n => (
          <button key={n} className={"btn small " + (N === n ? "primary" : "")} onClick={() => setN(n)}>N = {n} points</button>
        ))}
      </div>
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
        headers={["i","tᵢ","wᵢ","xᵢ = (a+b)/2 + (b-a)/2·tᵢ","f(xᵢ)","wᵢ·f(xᵢ)·(b-a)/2"]}
        rows={rows.map(r => [r.i, r.t.toFixed(4), r.w.toFixed(4), r.x.toFixed(4), r.fx.toFixed(4), r.term.toFixed(6)])}
      />
      <Callout kind="good">
        ∫ ≈ <b className="mono">{value.toFixed(10)}</b> · จริง = <b className="mono">{trueVal.toFixed(10)}</b> · error = {Math.abs(value - trueVal).toExponential(3)}
      </Callout>
    </div>
  );
}

function IntegrationSolver() {
  const [expr, setExpr] = React.useState("sin(x)/x");
  const [a, setA] = React.useState("0.0001");
  const [b, setB] = React.useState("1");
  const [n, setN] = React.useState("8");
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
        <Callout kind="good">
          ∫ ≈ <b className="mono">{result.toFixed(10)}</b>
        </Callout>
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

  const trapPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${sx(logN[i]).toFixed(1)},${sy(Math.log10(Math.max(d.trap, 1e-16))).toFixed(1)}`).join(" ");
  const simpPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${sx(logN[i]).toFixed(1)},${sy(Math.log10(Math.max(d.simp, 1e-16))).toFixed(1)}`).join(" ");

  return (
    <div className="error-plot">
      <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
        <Axes width={W} height={H} padding={padding} xDomain={xDomain} yDomain={yDomain}/>
        <path d={trapPath} fill="none" stroke="#58c4dd" strokeWidth="2"/>
        <path d={simpPath} fill="none" stroke="#ffd66b" strokeWidth="2"/>
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={sx(logN[i])} cy={sy(Math.log10(Math.max(d.trap, 1e-16)))} r="4" fill="#58c4dd"/>
            <circle cx={sx(logN[i])} cy={sy(Math.log10(Math.max(d.simp, 1e-16)))} r="4" fill="#ffd66b"/>
          </g>
        ))}
        <text x={padding.l+10} y={padding.t+18} fill="#58c4dd" fontFamily="JetBrains Mono" fontSize="12">— Trap (slope ≈ −2)</text>
        <text x={padding.l+10} y={padding.t+36} fill="#ffd66b" fontFamily="JetBrains Mono" fontSize="12">— Simpson (slope ≈ −4)</text>
        <text x={(W)/2} y={H-6} fill="#9aa4b2" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">log₁₀ n →</text>
        <text x={14} y={H/2} fill="#9aa4b2" fontSize="11" transform={`rotate(-90 14 ${H/2})`} textAnchor="middle" fontFamily="JetBrains Mono">log₁₀ |error|</text>
      </svg>
      <p className="muted" style={{fontSize:12, margin:"6px 0 0"}}>
        slope = −2 → error ∝ n⁻² (O(h²)); slope = −4 → error ∝ n⁻⁴ (O(h⁴)) → Simpson แม่นกว่ามาก
      </p>
    </div>
  );
}

window.IntegrationLesson = IntegrationLesson;
