// Spline Interpolation — Linear, Quadratic, Cubic

function SplineLesson() {
  // Slide example: x = [1, 1.5, 2, 2.5], y = [45, 75, 160, 245], find f(1.75)
  const xs = [1, 1.5, 2, 2.5];
  const ys = [45, 75, 160, 245];

  return (
    <div>
      <Hero
        kicker="05 · Spline Interpolation"
        title="Spline — เส้นโค้งต่อเส้น"
        lead="แทนที่จะใช้ polynomial ใหญ่ ๆ ผ่านทุกจุด เราใช้ polynomial เล็ก ๆ ต่อกันเป็นช่วง ๆ — แม่นยำกว่า, ไม่มี oscillation"
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

        <h3>เงื่อนไข (ต้องการ 3n สมการ)</h3>
        <Callout title="กฎ 3 ข้อ">
          <ol>
            <li><b>จุดเชื่อมต่อ (function เท่ากัน):</b> <M>{`f_i(x_i) = f_{i+1}(x_i) = y_i`}</M> → ได้ 2(n−1) + 2 = 2n สมการ</li>
            <li><b>Slope ต่อเนื่อง:</b> <M>{`f'_i(x_i) = f'_{i+1}(x_i)`}</M> → ได้ n−1 สมการ</li>
            <li><b>เงื่อนไขปิด:</b> สมมติ <M>a_1 = 0</M> (ช่วงแรกเป็นเส้นตรง) → ได้ 1 สมการสุดท้าย</li>
          </ol>
          รวม = 2n + (n−1) + 1 = 3n ✓
        </Callout>

        <h3>วิธีทำ — สร้าง matrix 3n × 3n</h3>
        <p>เช่นมี 4 จุด → 3 ช่วง → 9 ตัวแปร <M>{`(a_1,b_1,c_1, a_2,b_2,c_2, a_3,b_3,c_3)`}</M></p>
        <p>เขียน 9 สมการเชิงเส้น แล้วใช้ Gauss Elimination แก้ — น่าใช้คอมพิวเตอร์</p>

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

        <Callout title="เงื่อนไข 4 ข้อ (ต้องการ 4n สมการ)">
          <ol>
            <li><b>ผ่านจุด:</b> 2n สมการ</li>
            <li><b>Slope ต่อเนื่อง:</b> <M>{`f'_i = f'_{i+1}`}</M> ที่จุดต่อ → (n−1) สมการ</li>
            <li><b>Curvature ต่อเนื่อง:</b> <M>{`f''_i = f''_{i+1}`}</M> ที่จุดต่อ → (n−1) สมการ</li>
            <li><b>เงื่อนไขปิด (Natural):</b> <M>{`f''(x_0) = f''(x_n) = 0`}</M> → 2 สมการ</li>
          </ol>
          รวม = 2n + 2(n−1) + 2 = 4n ✓
        </Callout>

        <p>Cubic spline แม่นยำที่สุดและ <em>smooth</em> ที่สุด (continuous up to second derivative) — เป็นที่นิยมในงานคอมพิวเตอร์กราฟิก, CAD, animation</p>

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

  return (
    <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
      <Axes width={W} height={H} padding={padding} xDomain={[xMin, xMax]} yDomain={[yMin, yMax]}/>
      {paths.map((p, i) => <path key={i} d={p} fill="none" stroke={colors[i % colors.length]} strokeWidth="2.5"/>)}
      {xs.map((x, i) => (
        <circle key={i} cx={sx(x)} cy={sy(ys[i])} r="5" fill="#ffd66b" stroke="#0e1116" strokeWidth="1.5"/>
      ))}
      {xs.map((x, i) => (
        <text key={"t"+i} x={sx(x)+8} y={sy(ys[i])-8} fill="#ffd66b" fontFamily="JetBrains Mono" fontSize="11">({x}, {ys[i]})</text>
      ))}
    </svg>
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
      <p className="muted" style={{fontSize:12, marginTop:6}}>เส้นแนวตั้งคือจุดต่อระหว่าง segment — ทุก panel ผ่านจุดต่อแบบเรียบ (ไม่กระโดด, ไม่หัก)</p>
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
            <div className="mono" style={{fontSize:12}}>S'({fmt(x,4)}) ≈ {fmt(cs.deriv1(x), 6)} ; S''({fmt(x,4)}) ≈ {fmt(cs.deriv2(x), 6)}</div>
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
