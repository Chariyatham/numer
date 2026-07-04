// Differentiation — Forward, Backward, Central + high-accuracy versions

function DifferentiationLesson() {
  return (
    <div>
      <Hero
        kicker="02 · Differentiation"
        title="Numerical Differentiation"
        lead="ประมาณค่า f'(x), f''(x), ... จากข้อมูลที่จุด ๆ — ใช้ Taylor series ในการพิสูจน์ + 3 สาย: Forward, Backward, Central"
        readout={{
          label: "Central difference · f′ ของ eˣ ที่ x=0  (จริง = 1)",
          steps: [
            { x: "1.0269", w: 72 },
            { x: "1.00668", w: 18 },
            { x: "1.00167", w: 5 },
          ],
          result: "1.00000",
          note: "h เล็กลงครึ่งหนึ่ง → error เหลือ ~¼ (แม่นระดับ h²)",
        }}
        meta={["O(h), O(h²), O(h⁴)", "First & Higher", "Taylor proof", "fx-991CW d/dx"]}
      />

      <Sect tag="0" title="ที่มาจาก Taylor Series">
        <p>ทุกสูตรในบทนี้เริ่มจาก Taylor expansion:</p>
        <Formula>
          <MB>{`f(x_{i+1}) = f(x_i) + h\\,f'(x_i) + \\frac{h^2}{2!}f''(x_i) + \\frac{h^3}{3!}f'''(x_i) + \\cdots`}</MB>
          <MB>{`f(x_{i-1}) = f(x_i) - h\\,f'(x_i) + \\frac{h^2}{2!}f''(x_i) - \\frac{h^3}{3!}f'''(x_i) + \\cdots`}</MB>
        </Formula>
        <p>โดยที่ <M>h = x_{`i+1`} - x_i</M></p>
      </Sect>

      <Sect tag="1" title="First Derivative · 3 สาย">
        <h3>1.1 Forward Divided Difference — มองข้างหน้า</h3>
        <p>จาก Taylor ของ <M>f(x_{`i+1`})</M> ตัดทุกอันที่มี <M>h^2</M> ขึ้นไป:</p>
        <MB>{`f(x_{i+1}) \\approx f(x_i) + h\\,f'(x_i)`}</MB>
        <Formula>
          <MB>{`f'(x_i) \\approx \\frac{f(x_{i+1}) - f(x_i)}{h} \\quad + O(h)`}</MB>
        </Formula>

        <h3>1.2 Backward Divided Difference — มองข้างหลัง</h3>
        <p>จาก Taylor ของ <M>f(x_{`i-1`})</M> จัดรูปคล้ายเดิม:</p>
        <Formula>
          <MB>{`f'(x_i) \\approx \\frac{f(x_i) - f(x_{i-1})}{h} \\quad + O(h)`}</MB>
        </Formula>

        <h3>1.3 Central Divided Difference — มองทั้งสองข้าง</h3>
        <p>เอา <M>f(x_{`i+1`})</M> − <M>f(x_{`i-1`})</M> จาก Taylor series:</p>
        <MB>{`f(x_{i+1}) - f(x_{i-1}) = 2h\\,f'(x_i) + \\frac{2h^3}{3!}f'''(x_i) + \\cdots`}</MB>
        <Formula>
          <MB>{`f'(x_i) \\approx \\frac{f(x_{i+1}) - f(x_{i-1})}{2h} \\quad + O(h^2)`}</MB>
        </Formula>
        <p>สังเกตว่า term ที่มี <M>h^2</M> (จาก <M>f''</M>) หายไปเอง — ทำให้ <b>Central แม่นกว่ามาก</b></p>

        <h3>Animation — secant ค่อย ๆ กลายเป็น tangent เมื่อ h เล็กลง</h3>
        <SecantTangentViz/>

        <h3>เห็นภาพ — error ของ 3 สูตร</h3>
        <DiffComparison/>

        <h3>ตัวอย่างจากสไลด์ — <M>f(x) = e^x</M> ที่ <M>x = 2</M> (จริง = <M>e^2 \approx 7.389</M>)</h3>
        <DiffWorkedExample/>

        <Callout kind="tip" title="วิธีเลือก">
          <ul>
            <li>มีข้อมูลแค่ <em>ปลายซ้าย</em> (x = a) → ใช้ <b>Forward</b></li>
            <li>มีข้อมูลแค่ <em>ปลายขวา</em> (x = b) → ใช้ <b>Backward</b></li>
            <li>มีข้อมูล<em>ทั้งสองข้าง</em> → ใช้ <b>Central</b> เสมอ (แม่นกว่า)</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="2" title="Higher Derivatives">
        <p>จาก Taylor expansion เพิ่ม term — เอา <M>{`f(x_{i+1}) + f(x_{i-1})`}</M>:</p>
        <MB>{`f(x_{i+1}) + f(x_{i-1}) = 2 f(x_i) + h^2 f''(x_i) + \\frac{h^4}{12}f^{(4)}(x_i) + \\cdots`}</MB>

        <Formula label="Central f''(x) — O(h²)">
          <MB>{`f''(x_i) \\approx \\frac{f(x_{i+1}) - 2 f(x_i) + f(x_{i-1})}{h^2}`}</MB>
        </Formula>

        <p>แบบ Forward / Backward สำหรับ <M>f''(x)</M>:</p>
        <Formula label="Forward f''(x) — O(h)">
          <MB>{`f''(x_i) \\approx \\frac{f(x_{i+2}) - 2f(x_{i+1}) + f(x_i)}{h^2}`}</MB>
        </Formula>
        <Formula label="Backward f''(x) — O(h)">
          <MB>{`f''(x_i) \\approx \\frac{f(x_i) - 2f(x_{i-1}) + f(x_{i-2})}{h^2}`}</MB>
        </Formula>
      </Sect>

      <Sect tag="3" title="More Accurate Derivative — O(h²), O(h⁴)">
        <p>ใช้จุดมากขึ้น → ตัด term error ตัวต่อไปได้</p>

        <Formula label="Central f'(x) — O(h⁴)">
          <MB>{`f'(x_i) \\approx \\frac{-f(x_{i+2}) + 8 f(x_{i+1}) - 8 f(x_{i-1}) + f(x_{i-2})}{12 h}`}</MB>
        </Formula>

        <Formula label="Central f''(x) — O(h⁴)">
          <MB>{`f''(x_i) \\approx \\frac{-f(x_{i+2}) + 16 f(x_{i+1}) - 30 f(x_i) + 16 f(x_{i-1}) - f(x_{i-2})}{12 h^2}`}</MB>
        </Formula>

        <Callout title="ตารางสัมประสิทธิ์ (จากสไลด์)">
          <table className="tbl">
            <thead><tr><th>Order</th><th>Formula</th><th>i-2</th><th>i-1</th><th>i</th><th>i+1</th><th>i+2</th><th>÷</th><th>Err</th></tr></thead>
            <tbody>
              <tr><td>f'</td><td>Forward</td><td></td><td></td><td>-3</td><td>4</td><td>-1</td><td>2h</td><td className="num">O(h²)</td></tr>
              <tr><td>f'</td><td>Backward</td><td>1</td><td>-4</td><td>3</td><td></td><td></td><td>2h</td><td className="num">O(h²)</td></tr>
              <tr><td>f'</td><td>Central</td><td>-1</td><td>-8</td><td>0</td><td>8</td><td>1</td><td>12h</td><td className="num">O(h⁴)</td></tr>
              <tr><td>f''</td><td>Central</td><td>-1</td><td>16</td><td>-30</td><td>16</td><td>-1</td><td>12h²</td><td className="num">O(h⁴)</td></tr>
              <tr><td>f'''</td><td>Central</td><td>-1</td><td>2</td><td>0</td><td>-2</td><td>1</td><td>2h³</td><td className="num">O(h²)</td></tr>
              <tr><td>f⁽⁴⁾</td><td>Central</td><td>1</td><td>-4</td><td>6</td><td>-4</td><td>1</td><td>h⁴</td><td className="num">O(h²)</td></tr>
            </tbody>
          </table>
        </Callout>

        <Callout kind="tip" title="fx-991CW · 5-point เก็บ f-values ในตัวแปร A–E">
          <p>สูตร 5-point เช่น <M>{`f'(x_i) = (-f_{i+2}+8f_{i+1}-8f_{i-1}+f_{i-2})/(12h)`}</M> มีค่าคงที่ <code>−1, 8, 0, −8, 1</code> — เก็บค่า f ในตัวแปรช่วยลดข้อผิดพลาด:</p>
          <CalcSteps steps={[
            <span>คำนวณ <M>{`f(x_{i-2})`}</M> → <Key>STO</Key> <Key>A</Key></span>,
            <span>คำนวณ <M>{`f(x_{i-1})`}</M> → <Key>STO</Key> <Key>B</Key></span>,
            <span>คำนวณ <M>{`f(x_i)`}</M> → <Key>STO</Key> <Key>C</Key>  (ใช้กับ f'' Central)</span>,
            <span>คำนวณ <M>{`f(x_{i+1})`}</M> → <Key>STO</Key> <Key>D</Key></span>,
            <span>คำนวณ <M>{`f(x_{i+2})`}</M> → <Key>STO</Key> <Key>E</Key></span>,
            <span>ประกอบสูตร: <code>(−E + 8D − 8B + A) ÷ (12h)</code> → กด <Key>=</Key> ได้ <M>f'(x_i)</M> แม่นยำ O(h⁴)</span>,
            <span>สำหรับ <M>f''</M>: <code>(−E + 16D − 30C + 16B − A) ÷ (12h²)</code></span>,
          ]}/>
          <p style={{margin:"6px 0 0", fontSize:'0.778rem'}}>ทริค: ถ้า h เป็น decimal คงที่ → คำนวณ <code>1/(12h)</code> ก่อน → <Key>STO</Key> <Key>F</Key> → ใช้ <code>(−E+8D−8B+A)×F</code></p>
          <p style={{margin:"4px 0 0", fontSize:'0.75rem', color:"var(--text-faint)"}}>คนสอบเร็วใช้เทคนิคนี้คำนวณ 5-point ได้ใน 30 วินาที — เร็วกว่าคำนวณทีละสูตรด้วยมือ 3 เท่า</p>
        </Callout>
      </Sect>

      <Sect tag="4" title="fx-991CW · d/dx ในเครื่อง">
        <Callout title="วิธีกด">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Calculate</Key></span>,
            <span>กด <Key>OPTN</Key> หรือเลือก <code>d/dx</code> จากเมนู</span>,
            <span>พิมพ์ฟังก์ชัน + ค่า x เช่น <code>d/dx(x³+2x | x=2)</code></span>,
            <span><Key>=</Key> → ได้คำตอบทันที</span>,
            <span><b>เครื่องใช้ Central Difference</b> O(h²) เป็น default</span>,
          ]}/>
        </Callout>

        <Callout kind="warn" title="ระวัง! d/dx ในเครื่องไม่เหมือนทำมือเป๊ะ">
          เครื่องใช้ <em>numerical</em> diff (ไม่ใช่ symbolic) — มี error เล็ก ๆ ตามค่า h ที่เครื่องเลือก ถ้าโจทย์ให้ "ค่าจริง" มาเปรียบเทียบ ผลจาก d/dx จะใกล้แต่ไม่เป๊ะ
        </Callout>
      </Sect>

      <Sect tag="5" title="Python — Numerical Diff ครบสูตร">
        <PythonRunner code={`import math

# First derivative
def fwd(f, x, h):  return (f(x+h) - f(x))/h
def bwd(f, x, h):  return (f(x) - f(x-h))/h
def ctr(f, x, h):  return (f(x+h) - f(x-h))/(2*h)
def ctr4(f, x, h): return (-f(x+2*h) + 8*f(x+h) - 8*f(x-h) + f(x-2*h))/(12*h)

# Second derivative
def fpp(f, x, h):  return (f(x+h) - 2*f(x) + f(x-h))/(h*h)
def fpp4(f, x, h): return (-f(x+2*h) + 16*f(x+h) - 30*f(x) + 16*f(x-h) - f(x-2*h))/(12*h*h)

f = math.exp
x = 2; h = 0.25
true_val = math.exp(2)
print(f"True f'(2) = e² = {true_val:.6f}")
print(f"{'method':<20} {'value':>12} {'error%':>10}")
for name, fn in [
    ("Forward", fwd), ("Backward", bwd), ("Central O(h²)", ctr), ("Central O(h⁴)", ctr4)
]:
    v = fn(f, x, h)
    print(f"{name:<20} {v:>12.6f} {abs(true_val-v)/true_val*100:>10.4f}")

print(f"\\nTrue f''(2) = e² = {true_val:.6f}")
print(f"{'Central O(h²)':<20} {fpp(f, x, h):>12.6f} {abs(true_val-fpp(f,x,h))/true_val*100:>10.4f}")
print(f"{'Central O(h⁴)':<20} {fpp4(f, x, h):>12.6f} {abs(true_val-fpp4(f,x,h))/true_val*100:>10.4f}")`} height={300}/>
      </Sect>

      <Sect tag="6" title="Richardson Extrapolation · เพิ่มความแม่นจาก O(h²) → O(h⁴)">
        <p>ถ้าเรามี <M>{`D(h)`}</M> = central difference ที่ <M>h</M> และ <M>{`D(h/2)`}</M> ที่ <M>{`h/2`}</M> — รวมกันให้ลด error ได้</p>

        <Formula label="Richardson formula">
          <MB>{`D_{\\text{refined}} = \\frac{4\\,D(h/2) - D(h)}{3} = D(h/2) + \\frac{D(h/2) - D(h)}{3}`}</MB>
          <p style={{fontSize:'0.778rem', color:"var(--text-dim)", margin:"4px 0 0"}}>O(h²) + O(h²) → O(h⁴)</p>
        </Formula>

        <Callout kind="good" title="ที่มา">
          <p>Central diff มี error: <M>{`D(h) = f'(x) + c h^2 + O(h^4)`}</M></p>
          <p>ที่ h/2: <M>{`D(h/2) = f'(x) + c (h/2)^2 + O(h^4) = f'(x) + (c/4) h^2 + O(h^4)`}</M></p>
          <p>คูณ 4 ใน h/2 แล้วลบ: <M>{`4D(h/2) - D(h) = 3 f'(x) + O(h^4)`}</M> → หาร 3 ได้ <M>{`f'(x) + O(h^4)`}</M> ✓</p>
        </Callout>

        <h3>ตัวอย่าง · <M>{`f(x) = e^x`}</M> ที่ x = 2</h3>
        <NumTable
          headers={["h", "D(h) [central O(h²)]", "D(h/2)", "Richardson [O(h⁴)]", "Error vs e²"]}
          rows={[0.4, 0.2, 0.1, 0.05].map(h => {
            const D1 = diffCentral(Math.exp, 2, h);
            const D2 = diffCentral(Math.exp, 2, h/2);
            const Dr = (4*D2 - D1)/3;
            return [h, D1.toFixed(8), D2.toFixed(8), Dr.toFixed(10), Math.abs(Dr - Math.exp(2)).toExponential(3)];
          })}
        />

        <PythonRunner code={`import math

def central(f, x, h): return (f(x+h) - f(x-h)) / (2*h)
def richardson(f, x, h):
    D1 = central(f, x, h)
    D2 = central(f, x, h/2)
    return (4*D2 - D1) / 3

f = math.exp; x = 2; true_val = math.exp(2)
print(f"True f'(2) = e² = {true_val:.12f}\\n")
for h in [0.4, 0.2, 0.1, 0.05, 0.025]:
    D = central(f, x, h)
    R = richardson(f, x, h)
    print(f"h={h:.4f}  Central={D:.10f} err={abs(D-true_val):.2e}  Richardson={R:.10f} err={abs(R-true_val):.2e}")`} height={200}/>
      </Sect>

      <Sect tag="7" title="Error vs h · U-shape ของ Floating Point">
        <p>ลด h → truncation error ลด, แต่ <em>round-off</em> จาก subtraction เริ่มสำคัญที่ h เล็กมาก ๆ</p>
        <DiffErrorPlot/>
        <Callout kind="warn" title="กับดักที่นักศึกษาทุกคนเจอ">
          <p>คิดว่า "ยิ่ง h เล็กยิ่งแม่น" — ผิด! สำหรับ floating-point มี <em>sweet spot</em>:</p>
          <ul>
            <li>O(h): h ≈ √ε ≈ 10⁻⁸</li>
            <li>O(h²): h ≈ ε^(1/3) ≈ 10⁻⁵</li>
            <li>O(h⁴): h ≈ ε^(1/5) ≈ 10⁻³</li>
          </ul>
          <p style={{margin:0}}>ที่ h เล็กกว่านี้ round-off เริ่มชนะ truncation</p>
        </Callout>
      </Sect>

      <Sect tag="8" title="Interactive · Differentiation Solver">
        <DiffSolver/>
      </Sect>

      <Sect tag="∑" title="Quick Reference">
        <Callout kind="tip" title="วิธีจำ — 3 + 1">
          <ul>
            <li><b>Forward:</b> มองข้างหน้าเท่านั้น — error O(h)</li>
            <li><b>Backward:</b> มองข้างหลังเท่านั้น — error O(h)</li>
            <li><b>Central:</b> มองทั้งสองข้าง — error O(h²) ดีกว่ามาก</li>
            <li><b>5-point Central:</b> ใช้ 4 จุดข้าง + 1 จุดเรา — error O(h⁴) ดีที่สุด</li>
          </ul>
          <p>error ลดลงตาม h: ลด h → 1/2 ทำให้ error ลด → 1/2 (O(h)), 1/4 (O(h²)), 1/16 (O(h⁴))</p>
        </Callout>
      </Sect>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 1 · 3 สาย" solution={
          <div>
            <p>ที่ x = 2, h = 0.1:</p>
            <p><M>f(2.1) \approx 8.1662, f(1.9) \approx 6.6859, f(2) \approx 7.3891</M></p>
            <p>Forward: <M>{`(8.1662 - 7.3891)/0.1 = 7.7710`}</M> — err 5.17%</p>
            <p>Backward: <M>{`(7.3891 - 6.6859)/0.1 = 7.0320`}</M> — err 4.83%</p>
            <p>Central: <M>{`(8.1662 - 6.6859)/0.2 = 7.4015`}</M> — err 0.17%</p>
          </div>
        }>
          คำนวณ <M>{`f'(x)`}</M> ของ <M>{`f(x) = e^x`}</M> ที่ x = 2 ด้วย h = 0.1 ใช้ Forward, Backward, Central พร้อม error %
        </Problem>

        <Problem label="ข้อ 2 · Higher accuracy" solution={
          <div>
            <p>Central O(h⁴):</p>
            <MB>{`f''(2.5) \\approx \\frac{-f(2.3) + 16f(2.4) - 30f(2.5) + 16f(2.6) - f(2.7)}{12(0.1)^2}`}</MB>
            <p>คำนวณ + เทียบกับค่าจริงด้วย Taylor</p>
          </div>
        }>
          ใช้สูตร Central O(h⁴) คำนวณ <M>{`f''(x)`}</M> ของ <M>{`f(x) = \\sin x + 2x`}</M> ที่ <M>x = 2.5</M> ด้วย h = 0.1
        </Problem>
      </Sect>
    </div>
  );
}

// Animated: central secant line rotates toward the true tangent as h → 0
function SecantTangentViz() {
  const f = Math.exp;
  const x0 = 2;
  const trueSlope = Math.exp(2);   // f'(2) = e²
  const fx0 = f(x0);
  const hValues = [0.7, 0.5, 0.35, 0.2, 0.1, 0.05];
  const xDomain = [1.2, 2.8];
  const yDomain = [2, 16];
  return (
    <StepPlayer steps={hValues.length} stepDuration={1400} label={(s) => `h = ${hValues[s]}`}>
      {({ step }) => {
        const h = hValues[step];
        const xl = x0 - h, xr = x0 + h;
        const fl = f(xl), fr = f(xr);
        const m = (fr - fl) / (2 * h);   // central difference slope
        // secant through the two sample points, extended across the domain
        const secY = (X) => fl + m * (X - xl);
        // true tangent through (x0, f(x0))
        const tanY = (X) => fx0 + trueSlope * (X - x0);
        const markers = [
          { kind: "line", x1: xDomain[0], y1: tanY(xDomain[0]), x2: xDomain[1], y2: tanY(xDomain[1]), color: "#83c167", dashed: true, width: 1.3 },
          { kind: "line", x1: xDomain[0], y1: secY(xDomain[0]), x2: xDomain[1], y2: secY(xDomain[1]), color: "#ffd66b", width: 2 },
          { kind: "point", x: xl, y: fl, color: "#58c4dd", label: "x−h" },
          { kind: "point", x: xr, y: fr, color: "#f47274", label: "x+h" },
          { kind: "point", x: x0, y: fx0, color: "#ffd66b" },
        ];
        const errPct = Math.abs(trueSlope - m) / trueSlope * 100;
        return (
          <div>
            <FnPlot fn={f} xDomain={xDomain} yDomain={yDomain} markers={markers} height={300}/>
            <div className="grid-2" style={{marginTop:10}}>
              <div className="card tight">
                <div className="kicker">central difference</div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7}}>
                  <div>h = {h}</div>
                  <div>slope = (f(x+h)−f(x−h)) / 2h</div>
                  <div>= <b style={{color:"#ffd66b"}}>{m.toFixed(6)}</b></div>
                </div>
              </div>
              <div className="card tight">
                <div className="kicker">เทียบ tangent จริง</div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:'0.778rem', lineHeight:1.7}}>
                  <div><span style={{color:"#83c167"}}>f′(2) = e²</span> = {trueSlope.toFixed(6)}</div>
                  <div>error = {errPct.toFixed(4)}%</div>
                  <div style={{color:"var(--text-faint)", fontSize:'0.75rem', marginTop:4}}>เส้นเหลือง (secant) เข้าหาเส้นเขียว (tangent) เมื่อ h เล็กลง</div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}

function DiffComparison() {
  const [logh, setLogh] = React.useState(-1);   // h = 10^logh
  const h = Math.pow(10, logh);
  const f = Math.exp;
  const x = 2;
  const trueVal = Math.exp(2);
  const v_fwd = diffForward(f, x, h);
  const v_bwd = diffBackward(f, x, h);
  const v_ctr = diffCentral(f, x, h);

  return (
    <div className="card">
      <div className="field-row">
        <div className="field" style={{flex:1}}>
          <label>h = 10^{logh.toFixed(1)} = {h.toExponential(2)}</label>
          <input type="range" min="-8" max="0" step="0.1" value={logh} onChange={e => setLogh(+e.target.value)} style={{width:"100%"}}/>
        </div>
      </div>
      <div className="grid-3" style={{marginTop:12}}>
        {[
          { name: "Forward", val: v_fwd, color: "var(--blue)" },
          { name: "Backward", val: v_bwd, color: "var(--pink)" },
          { name: "Central", val: v_ctr, color: "var(--green)" },
        ].map((m, i) => {
          const err = Math.abs(trueVal - m.val) / trueVal * 100;
          return (
            <div className="card tight" key={i}>
              <div className="kicker" style={{color:m.color}}>{m.name}</div>
              <div className="mono" style={{fontSize:'0.778rem', marginTop:4}}>{m.val.toFixed(8)}</div>
              <div className="mono" style={{fontSize:'0.722rem', color:"var(--text-faint)"}}>err = {err.toExponential(3)}%</div>
            </div>
          );
        })}
      </div>
      <div className="mono" style={{fontSize:'0.75rem', marginTop:10, color:"var(--text-dim)"}}>
        คำตอบจริง f'(2) = e² = {trueVal.toFixed(10)}
      </div>
      <p className="muted" style={{fontSize:'0.778rem', marginTop:8}}>ลดค่า h ดู error ของแต่ละสูตร — Central error ลดเร็วกว่า แต่ถ้า h เล็กเกินไป (10⁻⁸) จะเริ่มเจอ <em>round-off error</em> ของ floating point!</p>
    </div>
  );
}

function DiffWorkedExample() {
  const f = Math.exp;
  const trueV = Math.exp(2);
  const h = 0.25;
  return (
    <NumTable
      headers={["Method", "สูตร", "ค่าที่ได้", "ค่าจริง", "error %"]}
      rows={[
        ["Forward", "(f(2.25)−f(2))/0.25", diffForward(f,2,h).toFixed(6), trueV.toFixed(6), (Math.abs(trueV-diffForward(f,2,h))/trueV*100).toFixed(4)],
        ["Backward", "(f(2)−f(1.75))/0.25", diffBackward(f,2,h).toFixed(6), trueV.toFixed(6), (Math.abs(trueV-diffBackward(f,2,h))/trueV*100).toFixed(4)],
        ["Central", "(f(2.25)−f(1.75))/0.5", diffCentral(f,2,h).toFixed(6), trueV.toFixed(6), (Math.abs(trueV-diffCentral(f,2,h))/trueV*100).toFixed(4)],
      ]}
    />
  );
}

function DiffErrorPlot() {
  const f = Math.exp; const x = 2; const trueVal = Math.exp(2);
  const hs = [];
  for (let p = -16; p <= 0; p += 0.5) hs.push(Math.pow(10, p));
  const data = hs.map(h => ({
    h,
    fwd: Math.abs(diffForward(f, x, h) - trueVal),
    ctr: Math.abs(diffCentral(f, x, h) - trueVal),
    rich: (() => {
      const D1 = diffCentral(f, x, h), D2 = diffCentral(f, x, h/2);
      return Math.abs((4*D2 - D1)/3 - trueVal);
    })(),
  })).filter(d => d.fwd > 0 && d.ctr > 0 && d.rich > 0);

  const W = 580, H = 320, padding = { l: 50, r: 12, t: 14, b: 30 };
  const logH = data.map(d => Math.log10(d.h));
  const allE = data.flatMap(d => [d.fwd, d.ctr, d.rich]).filter(v => v > 0).map(v => Math.log10(v));
  const xDomain = [Math.min(...logH) - 0.3, Math.max(...logH) + 0.3];
  const yDomain = [Math.min(...allE) - 0.5, Math.max(...allE) + 0.5];
  const sx = makeScale(xDomain, [padding.l, W - padding.r]);
  const sy = makeScale(yDomain, [H - padding.b, padding.t]);

  // Animated: trace the error curves as h sweeps — เห็น error ลดแล้ว "กลับเพิ่ม" (U-shape) จาก round-off
  return (
    <div className="error-plot">
      <StepPlayer steps={data.length} stepDuration={450} label={(s) => `h = ${data[s].h.toExponential(1)}`}>
        {({ step }) => {
          const shown = data.slice(0, step+1);
          const makePath = (key) => shown.map((d, i) => `${i === 0 ? "M" : "L"}${sx(logH[i]).toFixed(1)},${sy(Math.log10(d[key])).toFixed(1)}`).join(" ");
          return (
            <svg className="svg-stage" viewBox={`0 0 ${W} ${H}`}>
              <Axes width={W} height={H} padding={padding} xDomain={xDomain} yDomain={yDomain}/>
              <path d={makePath("fwd")} fill="none" stroke="#f47274" strokeWidth="2"/>
              <path d={makePath("ctr")} fill="none" stroke="#58c4dd" strokeWidth="2"/>
              <path d={makePath("rich")} fill="none" stroke="#83c167" strokeWidth="2"/>
              {(() => { const d = data[step]; return (
                <g>
                  <circle cx={sx(logH[step])} cy={sy(Math.log10(d.fwd))} r="5" fill="#f47274"/>
                  <circle cx={sx(logH[step])} cy={sy(Math.log10(d.ctr))} r="5" fill="#58c4dd"/>
                  <circle cx={sx(logH[step])} cy={sy(Math.log10(d.rich))} r="5" fill="#83c167"/>
                </g>
              ); })()}
              <text x={padding.l+10} y={padding.t+18} fill="#f47274" fontFamily="JetBrains Mono" fontSize="12">— Forward O(h)</text>
              <text x={padding.l+10} y={padding.t+36} fill="#58c4dd" fontFamily="JetBrains Mono" fontSize="12">— Central O(h²)</text>
              <text x={padding.l+10} y={padding.t+54} fill="#83c167" fontFamily="JetBrains Mono" fontSize="12">— Richardson O(h⁴)</text>
              <text x={W/2} y={H-6} fill="#9aa4b2" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">log₁₀ h →</text>
              <text x={14} y={H/2} fill="#9aa4b2" fontSize="11" transform={`rotate(-90 14 ${H/2})`} textAnchor="middle" fontFamily="JetBrains Mono">log₁₀ |error|</text>
            </svg>
          );
        }}
      </StepPlayer>
      <p className="muted" style={{fontSize:'0.75rem', margin:"6px 0 0"}}>เห็นชัดว่า error ลดลงเรื่อย ๆ ตอน h ใหญ่ — แต่<b>กลับเพิ่ม</b>ตอน h เล็กมาก เพราะ floating-point round-off</p>
    </div>
  );
}

function DiffSolver() {
  const [expr, setExpr] = React.useState("exp(x)");
  const [x, setX] = React.useState("2");
  const [h, setH] = React.useState("0.1");
  const [result, setResult] = React.useState(null);
  const [err, setErr] = React.useState("");
  const run = () => {
    try {
      const f = parseExpr(expr);
      const xv = +x, hv = +h;
      setResult({
        fwd: diffForward(f, xv, hv),
        bwd: diffBackward(f, xv, hv),
        ctr: diffCentral(f, xv, hv),
        ctr4: (-f(xv+2*hv) + 8*f(xv+hv) - 8*f(xv-hv) + f(xv-2*hv)) / (12*hv),
        rich: richardsonDeriv(f, xv, hv).D,
        f2:  (f(xv+hv) - 2*f(xv) + f(xv-hv)) / (hv*hv),
      });
      setErr("");
    } catch (e) { setErr(e.message); setResult(null); }
  };
  return (
    <div className="solver-shell">
      <h4>Differentiation Solver</h4>
      <div className="input-row">
        <FnInput value={expr} onChange={setExpr} label="f(x) ="/>
        <label>x =</label><input type="text" value={x} onChange={e => setX(e.target.value)} style={{width:80}}/>
        <label>h =</label><input type="text" value={h} onChange={e => setH(e.target.value)} style={{width:80}}/>
        <button className="btn primary" onClick={run}>คำนวณ</button>
      </div>
      {err && <Callout kind="danger">{err}</Callout>}
      {result && (
        <NumTable
          headers={["Method", "Order", "f'(x)"]}
          rows={[
            ["Forward", "O(h)", result.fwd.toFixed(10)],
            ["Backward", "O(h)", result.bwd.toFixed(10)],
            ["Central", "O(h²)", result.ctr.toFixed(10)],
            ["Central 5-pt", "O(h⁴)", result.ctr4.toFixed(10)],
            ["Richardson", "O(h⁴)", result.rich.toFixed(10)],
            ["f''(x) Central", "O(h²)", result.f2.toFixed(10)],
          ]}
        />
      )}
    </div>
  );
}

window.DifferentiationLesson = DifferentiationLesson;
