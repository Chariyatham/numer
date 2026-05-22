// Interpolation — Newton's Divided Differences + Lagrange

function InterpolationLesson() {
  // Example data from slide
  const xs = [1.9, 3.1, 4.2, 5.1, 6.2];
  const ys = [14.4, 28.7, 36.2, 43.1, 51.4];
  const xTest = 4.5;

  return (
    <div>
      <Hero
        kicker="04 · Interpolation"
        title="Newton & Lagrange Interpolation"
        lead="วาดเส้นโค้งให้ผ่านจุดข้อมูลทุกจุด — เพื่อประมาณค่า y ที่ x ใด ๆ ระหว่างจุด"
        meta={["Linear / Quadratic / Polynomial", "Newton Divided Diff", "Lagrange", "n+1 จุด → degree n"]}
      />

      <Sect tag="0" title="Interpolation vs Regression">
        <div className="grid-2">
          <Callout kind="good" title="Interpolation">
            <p>เส้นโค้ง <b>ผ่านทุกจุด</b> ของข้อมูล — ใช้เมื่อข้อมูล "เป๊ะ" (ไม่มี noise)</p>
            <p className="mono" style={{fontSize:12, margin:0}}>data 5 จุด → polynomial degree 4</p>
          </Callout>
          <Callout kind="tip" title="Regression (บท 06)">
            <p>เส้นโค้ง <b>ใกล้</b> ทุกจุด — ใช้เมื่อข้อมูลมี noise</p>
            <p className="mono" style={{fontSize:12, margin:0}}>data 100 จุด → fit linear/quadratic</p>
          </Callout>
        </div>
      </Sect>

      {/* Newton Divided Differences */}
      <Sect tag="0.5" title="เขียนมือ · Newton DD พื้นฐาน (โจทย์ระดับสอบ)">
        <p>จุดข้อมูล (1, 0), (4, 1.3863), (6, 1.7918) — หา P(2) ด้วย Newton DD degree 2 ทำมือทุก step</p>
        <window.HandWalkthrough steps={[
          { title: "สร้างตาราง DD",
            body: `f[x₀] = 0
f[x₁] = 1.3863
f[x₂] = 1.7918

f[x₀, x₁] = (1.3863 − 0) / (4 − 1) = 1.3863 / 3 = 0.4621
f[x₁, x₂] = (1.7918 − 1.3863) / (6 − 4) = 0.4055 / 2 = 0.20275

f[x₀, x₁, x₂] = (0.20275 − 0.4621) / (6 − 1) = −0.25935 / 5 = −0.05187

สัมประสิทธิ์: c₀ = 0, c₁ = 0.4621, c₂ = −0.05187`,
            calc: "(1.3863 − 0) ÷ 3 → STO A   |   (1.7918 − 1.3863) ÷ 2 → STO B   |   (B − A) ÷ 5 → STO C" },
          { title: "สร้างพหุนาม P(x)",
            body: `P(x) = c₀ + c₁(x − x₀) + c₂(x − x₀)(x − x₁)
P(x) = 0 + 0.4621·(x − 1) + (−0.05187)·(x − 1)(x − 4)` },
          { title: "ประเมิน P(2)",
            body: `P(2) = 0 + 0.4621·(2 − 1) + (−0.05187)·(2 − 1)(2 − 4)
     = 0.4621·1 + (−0.05187)·1·(−2)
     = 0.4621 + 0.10374
     = 0.5658

(ค่าจริง ln(2) ≈ 0.6931 — error เพราะใช้ degree แค่ 2)`,
            calc: "0 + A·(2 − 1) + C·(2 − 1)·(2 − 4) =" },
        ]}/>
      </Sect>

      <Sect tag="1" title="Newton's Divided-Difference">
        <h3>แนวคิด — Build up degree by degree</h3>
        <p>เริ่มจากสูตรเส้นตรงผ่าน 2 จุด (linear) แล้ว <em>เพิ่ม term</em> เพื่อให้ผ่านจุดถัดไป — สังเกตว่าค่าสัมประสิทธิ์ที่คำนวณก่อนหน้านี้<b>ไม่เปลี่ยน</b>เมื่อเพิ่มจุดใหม่</p>

        <Formula label="รูปทั่วไป (degree n)">
          <MB>{`f(x) = c_0 + c_1(x-x_0) + c_2(x-x_0)(x-x_1) + \\cdots + c_n\\prod_{i=0}^{n-1}(x-x_i)`}</MB>
        </Formula>

        <h4>ตารางสัมประสิทธิ์ (Divided Difference Table)</h4>
        <p>ค่า <M>c_k</M> = "ผลต่างหารแบ่งครั้งที่ k" คำนวณจากตารางสามเหลี่ยม</p>

        <DDTable xs={xs} ys={ys}/>

        <h3>วิธีจำ — วิธีวาด "tree"</h3>
        <Callout title="หลักการ Divided Difference">
          <p>เริ่มจากซ้าย: คอลัมน์ 1 = <M>y_i</M> เลย</p>
          <p>คอลัมน์ถัดไป: <M>{`f[x_i, x_{i-1}] = \\dfrac{f[x_i] - f[x_{i-1}]}{x_i - x_{i-1}}`}</M> (เลขล่าง − บน, x ห่างกัน)</p>
          <p>ยกกำลังถัดไป: <M>{`f[x_2, x_1, x_0] = \\dfrac{f[x_2, x_1] - f[x_1, x_0]}{x_2 - x_0}`}</M></p>
          <p>เก็บ <b>ค่าบนสุด</b>ของแต่ละคอลัมน์ → ได้ <M>c_0, c_1, c_2, \ldots</M></p>
        </Callout>

        <h3>เห็นภาพ · เพิ่ม degree ทีละจุด</h3>
        <NewtonProgression xs={xs} ys={ys} xTest={xTest}/>

        <h3>fx-991CW · เครื่องคิดเลขช่วยอย่างไร</h3>
        <Callout title="ใช้ตัวแปร A–F เก็บค่าระหว่างทาง">
          <CalcSteps steps={[
            <span>เก็บ <M>x_0, x_1, x_2</M> ใน A, B, C</span>,
            <span>เก็บ <M>y_0, y_1, y_2</M> ใน D, E, F</span>,
            <span>คำนวณ <M>{`f[x_1,x_0]`}</M>: <code>(E−D) ÷ (B−A)</code> → เก็บใส่ <code>x</code></span>,
            <span>คำนวณ <M>{`f[x_2,x_1]`}</M>: <code>(F−E) ÷ (C−B)</code> → เก็บใส่ <code>y</code></span>,
            <span>คำนวณ <M>{`f[x_2,x_1,x_0]`}</M>: <code>(y − x) ÷ (C−A)</code></span>,
            <span><b>แนะนำ:</b> ใช้โหมด <Key>Spreadsheet</Key> สร้างตารางได้ทั้งตารางในเครื่อง</span>,
          ]}/>
        </Callout>

        <h3>Python · Newton Divided Differences</h3>
        <PythonRunner code={`def newton_dd(xs, ys):
    n = len(xs)
    dd = [[y] for y in ys]
    for j in range(1, n):
        for i in range(n - j):
            dd[i].append((dd[i+1][j-1] - dd[i][j-1]) / (xs[i+j] - xs[i]))
    coeffs = dd[0]                  # [c0, c1, c2, ...]
    return coeffs

def eval_newton(coeffs, xs, x):
    result = coeffs[0]
    term = 1.0
    for k in range(1, len(coeffs)):
        term *= (x - xs[k-1])
        result += coeffs[k] * term
    return result

xs = [1.9, 3.1, 4.2, 5.1, 6.2]
ys = [14.4, 28.7, 36.2, 43.1, 51.4]
c = newton_dd(xs, ys)
print("ค่าสัมประสิทธิ์ c0..c4:")
for i, ci in enumerate(c):
    print(f"  c{i} = {ci:.6f}")
print(f"\\nf(4.5) = {eval_newton(c, xs, 4.5):.6f}")`} height={260}/>
      </Sect>

      {/* Lagrange */}
      <Sect tag="2" title="Lagrange Polynomial">
        <p>แทนที่จะหาสัมประสิทธิ์ <M>c_i</M> ใหม่ Lagrange สร้าง "polynomial พิเศษ" ขึ้นมาให้เลย</p>

        <Formula label="Lagrange form">
          <MB>{`f(x) = \\sum_{i=0}^{n} L_i(x)\\, y_i`}</MB>
          <MB>{`L_i(x) = \\prod_{j=0, j\\neq i}^{n} \\frac{x - x_j}{x_i - x_j}`}</MB>
        </Formula>

        <Callout kind="tip" title="ลักษณะพิเศษของ L_i(x)">
          <ul>
            <li><M>{`L_i(x_i) = 1`}</M> ที่จุดของตัวเอง</li>
            <li><M>{`L_i(x_j) = 0`}</M> ที่จุดของคนอื่น (ถ้า i≠j)</li>
            <li>เลยทำให้ <M>{`f(x_i) = y_i`}</M> ผ่านทุกจุดอัตโนมัติ</li>
          </ul>
        </Callout>

        <h3>ตัวอย่าง Linear (2 จุด)</h3>
        <p><M>x_0 = 1.9, y_0 = 14.4</M>; <M>x_1 = 6.2, y_1 = 51.4</M>; หา <M>f(4.5)</M></p>
        <MB>{`L_0(x) = \\frac{x - x_1}{x_0 - x_1} = \\frac{4.5 - 6.2}{1.9 - 6.2} = \\frac{-1.7}{-4.3} \\approx 0.3953`}</MB>
        <MB>{`L_1(x) = \\frac{x - x_0}{x_1 - x_0} = \\frac{4.5 - 1.9}{6.2 - 1.9} \\approx 0.6047`}</MB>
        <MB>{`f(4.5) = 0.3953(14.4) + 0.6047(51.4) \\approx 36.77`}</MB>

        <h3>วิธีจำ <M>L_i</M> — "ตัวบนตรงข้าม, ตัวล่างเรา"</h3>
        <Callout title="ทริค!">
          <p>สำหรับจุดที่ <em>เราเอง</em> (index = i):</p>
          <ul>
            <li><b>ตัวล่างของ Lᵢ:</b> <M>{`(x_i - x_0)(x_i - x_1)\\cdots`}</M> ทุก<em>คนอื่น</em></li>
            <li><b>ตัวบนของ Lᵢ:</b> เหมือนตัวล่าง แต่เปลี่ยน <M>x_i</M> เป็น <M>x</M></li>
          </ul>
        </Callout>

        <PythonRunner code={`def lagrange(xs, ys, x):
    n = len(xs)
    result = 0
    for i in range(n):
        L = 1
        for j in range(n):
            if j != i:
                L *= (x - xs[j]) / (xs[i] - xs[j])
        result += ys[i] * L
        print(f"  L{i}({x}) = {L:.6f}")
    return result

xs = [1.9, 3.1, 4.2, 5.1, 6.2]
ys = [14.4, 28.7, 36.2, 43.1, 51.4]
ans = lagrange(xs, ys, 4.5)
print(f"\\nf(4.5) = {ans:.6f}")`} height={220}/>

        <h3>Animation · ดู Lᵢ(x) หน้าตาเป็นยังไง</h3>
        <p>แต่ละ <M>{`L_i`}</M> เป็น "ภูเขา" ที่ <M>=1</M> ที่ <M>{`x_i`}</M> และ <M>=0</M> ที่จุดอื่น ๆ → ผลรวม <M>{`\\sum L_i y_i`}</M> จึงผ่านทุกจุดเป๊ะ</p>
        <LagrangeBasisViz xs={[1, 2, 3, 4, 5]}/>
      </Sect>

      <Sect tag="3" title="Newton's Forward / Backward Differences (จุดห่างเท่ากัน)">
        <p>เมื่อจุดข้อมูล <em>ห่างเท่ากัน</em> (<M>{`x_{i+1}-x_i=h`}</M>) เราใช้สูตรย่อพิเศษ → คำนวณเร็วกว่า Divided Difference</p>

        <Formula label="Newton Forward (ใช้เมื่อ x อยู่ใกล้ x₀)">
          <MB>{`P_n(x) = f_0 + s\\,\\Delta f_0 + \\frac{s(s-1)}{2!}\\,\\Delta^2 f_0 + \\frac{s(s-1)(s-2)}{3!}\\,\\Delta^3 f_0 + \\ldots`}</MB>
          <p style={{fontSize:13, color:"var(--text-dim)", margin:"4px 0 0"}}>โดย <M>{`s = (x - x_0)/h`}</M> และ <M>{`\\Delta f_i = f_{i+1} - f_i`}</M></p>
        </Formula>

        <Formula label="Newton Backward (ใช้เมื่อ x อยู่ใกล้ xₙ — ปลายตาราง)">
          <MB>{`P_n(x) = f_n + s\\,\\nabla f_n + \\frac{s(s+1)}{2!}\\,\\nabla^2 f_n + \\ldots`}</MB>
          <p style={{fontSize:13, color:"var(--text-dim)", margin:"4px 0 0"}}>โดย <M>{`s = (x - x_n)/h`}</M> และ <M>{`\\nabla f_i = f_i - f_{i-1}`}</M></p>
        </Formula>

        <Callout kind="tip" title="วิธีสร้างตาราง Δ (forward differences)">
          <p>คล้ายตาราง DD แต่ <b>ไม่หารด้วยผลต่าง x</b> เพราะ h เท่ากันทุกช่อง:</p>
          <NumTable
            headers={["x", "f", "Δf", "Δ²f", "Δ³f"]}
            rows={[
              ["x₀ = 0", "1", "Δf₀ = 1", "Δ²f₀ = 2", "Δ³f₀ = 2"],
              ["x₁ = 1", "2", "Δf₁ = 3", "Δ²f₁ = 4", ""],
              ["x₂ = 2", "5", "Δf₂ = 7", "", ""],
              ["x₃ = 3", "12", "", "", ""],
            ]}
          />
        </Callout>

        <h3>ตัวอย่าง · ประมาณค่า f(0.5) จาก จุด (0,1), (1,2), (2,5), (3,12)</h3>
        <p>h = 1, x₀ = 0, s = (0.5 − 0)/1 = 0.5</p>
        <Formula>
          <MB>{`P(0.5) = 1 + 0.5(1) + \\frac{0.5(-0.5)}{2}(2) + \\frac{0.5(-0.5)(-1.5)}{6}(2) = 1 + 0.5 - 0.25 + 0.125 = 1.375`}</MB>
        </Formula>

        <h3>Python — Newton Forward Difference</h3>
        <PythonRunner code={`def newton_forward(xs, ys, x):
    n = len(xs)
    h = xs[1] - xs[0]
    s = (x - xs[0]) / h
    # build forward diff table
    T = [row[:] for row in [[y] for y in ys]]
    for j in range(1, n):
        for i in range(n - j):
            T[i].append(T[i+1][j-1] - T[i][j-1])
    # apply formula
    result = T[0][0]
    prod = 1.0
    fact = 1
    for k in range(1, n):
        prod *= (s - (k-1))
        fact *= k
        result += prod / fact * T[0][k]
    return result, T

xs = [0, 1, 2, 3]
ys = [1, 2, 5, 12]
val, T = newton_forward(xs, ys, 0.5)
print("Forward diff table:")
for i, row in enumerate(T): print(f"  i={i}: {row}")
print(f"\\nf(0.5) ≈ {val:.6f}")`} height={240}/>

        <Callout kind="warn" title="เมื่อไหร่ใช้ Forward vs Backward">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>Forward:</b> x อยู่ใกล้ต้นตาราง (ใกล้ x₀)</li>
            <li><b>Backward:</b> x อยู่ใกล้ท้ายตาราง (ใกล้ xₙ)</li>
            <li>กลางตาราง → ทั้งคู่ใช้ได้ แต่ <em>Stirling/Bessel</em> (ขั้นสูง) แม่นกว่า</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="3.5" title="Interactive · ลองทุกวิธีเอง">
        <p>ใส่จุดของคุณ เลือก method → ดูคำตอบ + ตารางสัมประสิทธิ์</p>
        <InterpSolver/>
      </Sect>

      <Sect tag="4" title="เปรียบเทียบ — Newton vs Lagrange">
        <NumTable
          headers={["", "Newton DD", "Lagrange"]}
          rows={[
            ["รูปสูตร", "c₀ + c₁(x−x₀) + …", "Σ Lᵢ(x)·yᵢ"],
            ["ต้องคำนวณ", "ตารางสัมประสิทธิ์", "ตัวบน/ล่างของ Lᵢ"],
            ["เพิ่มจุดใหม่", "ง่าย — แค่เพิ่ม term", "ต้องคำนวณใหม่ทั้งหมด"],
            ["คำนวณมือ", "ใช้คอลัมน์เรียง", "น่าจำสูตร Lᵢ"],
            ["ผลลัพธ์", "เหมือนกันเป๊ะ", "เหมือนกันเป๊ะ"],
          ]}
        />
      </Sect>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · Newton Cubic" solution={
          <div>
            <p>ใช้ 4 จุด → cubic polynomial</p>
            <p>คำนวณตาราง DD แล้วจะได้ <M>{`c_0 = 14.4,\\, c_1 = 11.917,\\, c_2 = -0.8736,\\, c_3 = 0.0823`}</M> โดยประมาณ</p>
            <p><M>{`f(4.5) = 14.4 + 11.917(2.6) + (-0.8736)(2.6)(1.4) + 0.0823(2.6)(1.4)(0.3) \\approx 39.0`}</M></p>
          </div>
        }>
          <p>ข้อมูล: x = [1.9, 3.1, 4.2, 5.1], y = [14.4, 28.7, 36.2, 43.1]</p>
          <p>หา <M>f(4.5)</M> ด้วย Newton's Divided Difference ที่ degree 3 พร้อมแสดงตาราง DD</p>
        </Problem>

        <Problem label="ข้อ 2 · เปรียบเทียบ" solution={
          <p>คำตอบเหมือนกันเป๊ะ (มี Theorem ของ Polynomial Interpolation: polynomial degree ≤ n ที่ผ่าน n+1 จุดมีเพียง <b>หนึ่งเดียว</b>) ต่างกันแค่ "รูป" ที่เขียน</p>
        }>
          จุดข้อมูล (0,1), (1,2), (2,5), (3,10) — คำนวณ f(1.5) ทั้ง Newton DD และ Lagrange แล้วเทียบดูว่าได้ค่าเดียวกันหรือไม่ พร้อมอธิบาย<em>ทำไม</em>
        </Problem>
      </Sect>
    </div>
  );
}

function LagrangeBasisViz({ xs }) {
  const n = xs.length;
  const W = 640, H = 320, padding = { l: 38, r: 12, t: 14, b: 26 };
  const xMin = Math.min(...xs) - 0.5, xMax = Math.max(...xs) + 0.5;
  const yDomain = [-0.6, 1.4];
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale(yDomain, [H - padding.b, padding.t]);

  // colors for each L_i
  const colors = ["#58c4dd","#83c167","#ffd66b","#f47274","#a87dbe","#e879bc","#f6a85f"];
  const Li = (i) => (x) => {
    let L = 1;
    for (let j = 0; j < n; j++) if (j !== i) L *= (x - xs[j]) / (xs[i] - xs[j]);
    return L;
  };
  return (
    <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
      <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={yDomain}/>
      {xs.map((x, i) => (
        <path key={i} d={plotPath(Li(i), xMin, xMax, sx, sy, 240)} fill="none" stroke={colors[i % colors.length]} strokeWidth="1.8" opacity="0.9"/>
      ))}
      {xs.map((x, i) => (
        <circle key={"d"+i} cx={sx(x)} cy={sy(0)} r="4" fill={colors[i % colors.length]}/>
      ))}
      {xs.map((x, i) => (
        <text key={"t"+i} x={sx(x)} y={sy(1)-6} fill={colors[i % colors.length]} fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle">L{i}</text>
      ))}
      <line x1={padding.l} y1={sy(1)} x2={W-padding.r} y2={sy(1)} stroke="#3b4452" strokeDasharray="3 3"/>
    </svg>
  );
}

// Interactive solver: enter points + x, get value (Newton DD / Lagrange / Forward)
function InterpSolver({ defaultMethod = "newton" }) {
  const [method, setMethod] = React.useState(defaultMethod);
  const [xs, setXs] = React.useState(["1.9","3.1","4.2","5.1","6.2"]);
  const [ys, setYs] = React.useState(["14.4","28.7","36.2","43.1","51.4"]);
  const [xq, setXq] = React.useState("4.5");

  const xn = xs.map(parseFloat).filter(v => !isNaN(v));
  const yn = ys.map(parseFloat).filter(v => !isNaN(v));
  const x = parseFloat(xq);
  const ok = xn.length === yn.length && xn.length >= 2 && !isNaN(x);

  let result = null, table = null;
  if (ok) {
    try {
      if (method === "newton") {
        const r = dividedDifferences(xn, yn);
        result = r.eval(x); table = r.dd;
      } else if (method === "lagrange") {
        result = lagrange(xn, yn).eval(x);
      } else if (method === "forward") {
        const r = newtonForwardEval(xn, yn, x);
        result = r.value; table = r.table;
      } else if (method === "backward") {
        const r = newtonBackwardEval(xn, yn, x);
        result = r.value; table = r.table;
      }
    } catch (e) { result = NaN; }
  }

  return (
    <div className="solver-shell">
      <h4>Interpolation Solver</h4>
      <div className="chip-row">
        {[["newton","Newton DD"],["lagrange","Lagrange"],["forward","Forward Δ"],["backward","Backward ∇"]].map(([k, l]) => (
          <button key={k} className={"btn small " + (method === k ? "primary" : "")} onClick={() => setMethod(k)}>{l}</button>
        ))}
      </div>
      <PointsInput xs={xs} ys={ys} onChange={(nx, ny) => { setXs(nx); setYs(ny); }}/>
      <div className="input-row">
        <label>หา f(x) ที่ x =</label>
        <input type="text" value={xq} onChange={e => setXq(e.target.value)} style={{width:100}}/>
      </div>
      {ok && result != null && !isNaN(result) && (
        <div className="callout good">
          <b style={{fontFamily:"var(--font-mono)"}}>f({fmt(x, 4)}) ≈ {fmt(result, 8)}</b>
        </div>
      )}
      {!ok && <Callout kind="warn">กรอกตัวเลขให้ครบและจำนวน x = y</Callout>}
    </div>
  );
}

function DDTable({ xs, ys }) {
  const n = xs.length;
  const dd = ys.map(y => [y]);
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      dd[i][j] = (dd[i+1][j-1] - dd[i][j-1]) / (xs[i+j] - xs[i]);
    }
  }
  return (
    <div style={{overflowX:"auto"}}>
      <table className="tbl" style={{fontFamily:"var(--font-mono)", fontSize:13}}>
        <thead>
          <tr>
            <th>i</th>
            <th>xᵢ</th>
            <th>f[xᵢ]</th>
            {Array.from({length: n-1}, (_, k) => <th key={k}>{`ครั้งที่ ${k+1}`}</th>)}
          </tr>
        </thead>
        <tbody>
          {xs.map((x, i) => (
            <tr key={i} className={i === 0 ? "hi" : ""}>
              <td>{i}</td>
              <td className="num">{x}</td>
              {Array.from({length: n}, (_, j) => (
                <td key={j} className="num" style={{color: i === 0 && j > 0 ? "var(--yellow)" : undefined}}>
                  {dd[i][j] !== undefined ? dd[i][j].toFixed(4) : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{fontSize:12, marginTop:4}}>แถวบนสุด (สีเหลือง) คือสัมประสิทธิ์ c₀, c₁, c₂, c₃, c₄ ที่ใช้ใส่สูตร Newton</p>
    </div>
  );
}

function NewtonProgression({ xs, ys, xTest }) {
  const [degree, setDegree] = React.useState(1);
  const W = 640, H = 320;
  const padding = { l: 40, r: 12, t: 14, b: 26 };

  const subX = xs.slice(0, degree+1);
  const subY = ys.slice(0, degree+1);
  const { coeffs, eval: ev } = dividedDifferences(subX, subY);
  const fAtTest = ev(xTest);

  const xMin = Math.min(...xs) - 0.5, xMax = Math.max(...xs) + 0.5;
  const yMin = Math.min(...ys) - 5, yMax = Math.max(...ys) + 5;
  const sx = makeScale([xMin, xMax], [padding.l, W - padding.r]);
  const sy = makeScale([yMin, yMax], [H - padding.b, padding.t]);
  const fnPath = plotPath(ev, xMin, xMax, sx, sy, 200);

  return (
    <div>
      <div className="chip-row">
        {[1,2,3,4].map(d => (
          <button key={d} className={"btn small " + (degree === d ? "primary" : "")} onClick={() => setDegree(d)}>
            Degree {d} ({d+1} จุด)
          </button>
        ))}
      </div>
      <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
        <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
        <path d={fnPath} fill="none" stroke="#58c4dd" strokeWidth="2"/>
        {xs.map((x, i) => (
          <circle key={i} cx={sx(x)} cy={sy(ys[i])} r="5"
            fill={i <= degree ? "#ffd66b" : "#3b4452"}
            stroke="#0e1116" strokeWidth="1.5"/>
        ))}
        <line x1={sx(xTest)} x2={sx(xTest)} y1={padding.t} y2={H-padding.b} stroke="#83c167" strokeDasharray="3 3" opacity="0.6"/>
        <circle cx={sx(xTest)} cy={sy(fAtTest)} r="6" fill="#83c167" stroke="#0e1116" strokeWidth="2"/>
        <text x={sx(xTest)+8} y={sy(fAtTest)-8} fill="#83c167" fontFamily="JetBrains Mono" fontSize="11">f({xTest}) = {fAtTest.toFixed(4)}</text>
      </svg>
      <p className="muted" style={{fontSize:13}}>เพิ่มจุดเรื่อย ๆ → polynomial โค้งตามรูปข้อมูลมากขึ้น</p>
    </div>
  );
}

window.InterpolationLesson = InterpolationLesson;
