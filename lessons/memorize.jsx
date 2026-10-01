// หน้าท่องก่อนสอบ — ทุกอย่างที่ต้องจำอยู่หน้าเดียว ไม่ต้องไปไล่หาบทอื่น
// รูปแบบ: การ์ดพลิก — เห็นแค่คำถาม กดแล้วเฉลย แล้วกดว่าจำได้/ยังไม่ได้
// กรองเหลือเฉพาะใบที่ยังไม่ได้ เพื่อให้รอบต่อ ๆ ไปสั้นลงเรื่อย ๆ
const RECALL_KEY = "numer-recall";

function Deck({ id, title, subtitle, cards }) {
  const [known, setKnown] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(RECALL_KEY) || "{}"); } catch { return {}; }
  });
  const [open, setOpen] = React.useState({});
  const [onlyUnknown, setOnlyUnknown] = React.useState(false);

  const mark = (cid, val) => {
    const next = { ...known, [`${id}:${cid}`]: val };
    setKnown(next);
    localStorage.setItem(RECALL_KEY, JSON.stringify(next));
  };
  const isKnown = (cid) => known[`${id}:${cid}`] === true;
  const nKnown = cards.filter(c => isKnown(c.id)).length;
  const shown = onlyUnknown ? cards.filter(c => !isKnown(c.id)) : cards;

  return (
    <Sect tag="🧠" title={title}>
      {subtitle && <p>{subtitle}</p>}
      <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", margin:"0 0 12px"}}>
        <span style={{flex:"1 1 140px", height:10, background:"var(--bg-soft)", borderRadius:5, overflow:"hidden"}}>
          <span style={{display:"block", height:"100%", width:`${(nKnown/cards.length)*100}%`, background:"var(--green)"}}/>
        </span>
        <b style={{fontFamily:"var(--font-mono)", fontSize:'0.82rem'}}>จำได้ {nKnown}/{cards.length}</b>
        <button className="btn small" onClick={() => setOpen({})}>ปิดทั้งหมด</button>
        <button className="btn small" onClick={() => setOpen(Object.fromEntries(cards.map(c => [c.id, true])))}>เปิดทั้งหมด</button>
        <button className={"btn small " + (onlyUnknown ? "primary" : "")} onClick={() => setOnlyUnknown(v => !v)}>
          {onlyUnknown ? "✓ เฉพาะที่ยังไม่ได้" : "เฉพาะที่ยังไม่ได้"}
        </button>
      </div>

      {shown.length === 0 && (
        <Callout kind="good" title="จำได้ครบทั้งชุดแล้ว 🎉">
          <p style={{margin:0}}>กด “เฉพาะที่ยังไม่ได้” อีกครั้งเพื่อดูทั้งหมด · พรุ่งนี้กลับมาทวนซ้ำอีกรอบ ความจำจะอยู่ยาวกว่าท่องรวดเดียว</p>
        </Callout>
      )}

      <div style={{display:"flex", flexDirection:"column", gap:10}}>
        {shown.map(c => {
          const isOpen = !!open[c.id];
          return (
            <div key={c.id} className="card" style={{padding:"12px 14px",
                 borderColor: isKnown(c.id) ? "var(--green)" : "var(--border)"}}>
              <div onClick={() => setOpen(o => ({ ...o, [c.id]: !o[c.id] }))}
                   style={{cursor:"pointer", display:"flex", gap:10, alignItems:"flex-start"}}>
                <span style={{color:"var(--signal)", fontFamily:"var(--font-mono)", flex:"0 0 auto"}}>
                  {isOpen ? "▾" : "▸"}
                </span>
                <div style={{flex:1}}>
                  <b style={{fontSize:'0.94rem'}}>{c.q}</b>
                  {c.hint && <div style={{fontSize:'0.8rem', color:"var(--text-faint)", marginTop:2}}>{c.hint}</div>}
                  {!isOpen && <div style={{fontSize:'0.78rem', color:"var(--text-faint)", marginTop:4}}>
                    แตะเพื่อดูเฉลย — <b>ลองเขียนลงกระดาษก่อน</b>
                  </div>}
                </div>
                {isKnown(c.id) && <span className="tag green" style={{flex:"0 0 auto"}}>จำได้</span>}
              </div>

              {isOpen && (
                <div style={{marginTop:10, paddingTop:10, borderTop:"1px solid var(--border)"}}>
                  {c.a}
                  <div style={{display:"flex", gap:8, marginTop:10}}>
                    <button className="btn small primary" onClick={() => { mark(c.id, true); setOpen(o => ({...o, [c.id]: false})); }}>✓ จำได้</button>
                    <button className="btn small ghost" onClick={() => { mark(c.id, false); setOpen(o => ({...o, [c.id]: false})); }}>✗ ยังไม่ได้</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Sect>
  );
}

// ────────── ชุดที่ 1 · โค้ด 6 โครง (45 คะแนนของข้อสอบมาจากตรงนี้) ──────────
const CODE_CARDS = [
  { id: "C", q: "① Integration · โครง C — Composite Trapezoidal & Simpson",
    hint: "ลูปสร้างจุด xi แล้วบวกด้วยน้ำหนัก",
    a: <>
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
      <Callout kind="warn" title="จุดตาย">
        <p style={{margin:0}}>ต้องมีบรรทัด <code>a + i*h</code> ในลูป (อาจารย์เน้นเอง) · และ <b>n ของ Simpson = จำนวนพาราโบลา</b> ⇒ ช่องย่อย = 2n</p>
      </Callout>
    </> },
  { id: "D", q: "② Differentiation · โครง D — Finite Difference (ไม่มีลูปเลย)",
    hint: "โครงที่ง่ายที่สุด แทนค่าตรง ๆ",
    a: <>
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
    </> },
  { id: "A", q: "③ Root Finding · โครง A — Bracketing (Bisection & False Position)",
    hint: "ให้ช่วง [xl, xr] ที่คร่อมราก · เขียนทั้งลูปจากความจำ",
    a: <>
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

print(round(xm, 6))`}/>
      <Callout kind="danger" title="3 จุดตายของโครงนี้">
        <ul style={{margin:0, paddingLeft:18}}>
          <li><code>prev</code> ต้องมี — รอบแรกไม่มีค่าเก่าให้เทียบ (= “รอบทำทิ้ง”)</li>
          <li>เทียบเครื่องหมายกับ <code>f(xl)</code> เสมอ ถ้าเผลอใช้ <code>f(xr)</code> เงื่อนไขกลับด้าน</li>
          <li><code>prev = xm</code> ต้องอยู่<b>ท้ายลูป</b> ถ้าวางก่อน <code>if</code> จะหยุดทันที</li>
        </ul>
      </Callout>
    </> },
  { id: "B", q: "④ Root Finding · โครง B — Open Method (One-point & Newton)",
    hint: "มีค่าเริ่มตัวเดียว · ไม่มีรอบทำทิ้ง",
    a: <>
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
    </> },
  { id: "B2", q: "⑤ Root Finding · โครง B′ — Secant",
    hint: "เหมือน B แต่ค่าเริ่ม 2 ตัว · มีบรรทัดที่ลืมบ่อยที่สุดของทั้งวิชา",
    a: <>
      <CodeBlock code={`def f(x): return x**2 - 7

x0, x1 = 3.0, 2.0                    # ① Initial Value ต้องมี 2 ตัว
tol = 0.001

while True:
    x2 = x1 - f(x1)*(x0 - x1) / (f(x0) - f(x1))    # ② Iteration Form

    if abs(x2 - x1) < tol:           # ③ เงื่อนไขหยุด
        break
    x0, x1 = x1, x2                  # ★ เลื่อนตัวแปร — บรรทัดที่ลืมบ่อยที่สุด

print(round(x2, 6))`}/>
      <Callout kind="danger" title="อาจารย์ใช้เวลาอธิบายบรรทัดนี้นานที่สุดในคาบ">
        <p style={{margin:0}}><code>x0, x1 = x1, x2</code> — “x1 กลายเป็น x0, x2 กลายเป็น x1” · ถ้าเขียนแยกเป็น <code>x1 = x2</code> ก่อน แล้วค่อย <code>x0 = x1</code> จะพัง เพราะ x1 ถูกทับไปแล้ว</p>
      </Callout>
    </> },
  { id: "E", q: "⑥ Linear Systems · โครง E — Gauss Elimination (+ E′ Cramer)",
    hint: "2 ก้อน: forward elimination แล้ว back substitution",
    a: <>
      <CodeBlock code={`A = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]]   # ★ เปลี่ยนตามโจทย์
b = [9, 0, -4]
n = len(A)
M = [A[i][:] + [b[i]] for i in range(n)]      # ① augmented [A|b]

for k in range(n):                            # ② forward elimination
    if M[k][k] == 0:                          # pivot = 0 -> สลับแถว
        for r in range(k+1, n):
            if M[r][k] != 0:
                M[k], M[r] = M[r], M[k]
                break
    for i in range(k+1, n):
        factor = M[i][k] / M[k][k]
        for j in range(k, n+1):               # ★ n+1 ไม่ใช่ n
            M[i][j] -= factor * M[k][j]

x = [0] * n                                   # ③ back substitution
for i in range(n-1, -1, -1):
    s = M[i][n]
    for j in range(i+1, n):
        s -= M[i][j] * x[j]
    x[i] = s / M[i][i]

for i in range(n):
    print(f"x{i+1} = {x[i]:.6f}")`}/>
      <Callout kind="danger" title="4 จุดตายของโครงนี้">
        <ul style={{margin:0, paddingLeft:18}}>
          <li><code>range(k, <b>n+1</b>)</code> — ลืม +1 = คอลัมน์ <M>b</M> ไม่อัปเดต ⇒ คำตอบผิดหมดทั้งที่ <M>U</M> ถูก</li>
          <li><code>factor</code> คำนวณ<b>ก่อน</b>เข้าลูป <code>j</code> ไม่งั้นกลายเป็น 0</li>
          <li>back substitution วน<b>ถอยหลัง</b> และ<b>หารด้วย <code>M[i][i]</code></b></li>
          <li>Cramer: คัดลอกเมทริกซ์ด้วย <code>[row[:] for row in A]</code> เท่านั้น</li>
        </ul>
      </Callout>
      <p style={{margin:"14px 0 6px", fontSize:'0.86rem'}}><b>ตัวย่อย E′ · Cramer</b> — สั้นกว่ามาก เขียนได้ใน 2 นาที แต่ต้องเขียน <code>det3</code> เอง และใช้ได้แค่ 2×2/3×3 · <b>ถ้าเวลาไม่พอเขียน Gauss ให้เขียนตัวนี้แทน</b></p>
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
        print(f"x{k+1} = {det3(Ak)/dA:.6f}")   # -> 142.857143 / 135.714286 / 128.571429`}/>
      <p style={{margin:"8px 0 0", fontSize:'0.86rem'}}><b>ของแถม:</b> ผลคูณ pivot หลัง forward elimination = <M>{`\\det A`}</M> (คูณ <M>{`(-1)^k`}</M> ถ้าสลับแถว <M>k</M> ครั้ง) ⇒ ใช้ตรวจ Cramer ได้ฟรี</p>
    </> },
];

// ────────── ชุดที่ 2 · Integration ──────────
const INT_CARDS = [
  { id: "t1", q: "Single Trapezoidal — สูตร", hint: "ใช้แค่ 2 จุด: ปลายซ้าย ปลายขวา",
    a: <MB>{`I=\\frac{b-a}{2}\\big[f(a)+f(b)\\big]`}</MB> },
  { id: "t2", q: "Composite Trapezoidal — สูตร + h", hint: "n = จำนวนช่องย่อย",
    a: <><MB>{`h=\\frac{b-a}{n}\\qquad I=\\frac{h}{2}\\Big[f_0+f_n+2\\sum_{i=1}^{n-1}f_i\\Big]`}</MB>
        <p style={{margin:0}}>น้ำหนัก: <b>1 – 2 – 2 – … – 2 – 1</b></p></> },
  { id: "t3", q: "Single Simpson 1/3 — สูตร", hint: "ใช้ 3 จุด: ซ้าย กลาง ขวา",
    a: <><MB>{`I=\\frac{b-a}{6}\\big[f_0+4f_1+f_2\\big]`}</MB>
        <p style={{margin:0}}>น้ำหนัก <b>1 – 4 – 1</b> · แม่นถึงพหุนามดีกรี <b>3</b> (ไม่ใช่แค่ 2)</p></> },
  { id: "t4", q: "Composite Simpson 1/3 — สูตร + h ⭐", hint: "จุดที่พลาดกันมากที่สุดของบทนี้",
    a: <><MB>{`h=\\frac{b-a}{2n}\\qquad I=\\frac{h}{3}\\Big[f_0+f_{2n}+4\\!\\!\\sum_{i\\ \\text{คี่}}\\!\\!f_i+2\\!\\!\\sum_{i\\ \\text{คู่}}\\!\\!f_i\\Big]`}</MB>
        <Callout kind="danger" title="n = จำนวนพาราโบลา ไม่ใช่จำนวนช่อง">
          <p style={{margin:0}}>ช่องย่อย = <b>2n</b> · เช่น “n = 3” ⇒ 6 ช่องย่อย ⇒ 7 จุด · น้ำหนัก <b>1 – 4 – 2 – 4 – 2 – 4 – 1</b></p>
        </Callout></> },
  { id: "t5", q: "ช่องย่อยเป็นเลขคี่ → ทำยังไง", hint: "กับดักที่ออกสอบ",
    a: <p style={{margin:0}}>Simpson 1/3 ล้วน <b>ใช้ไม่ได้</b> เพราะพาราโบลา 1 อันกิน 2 ช่อง จับคู่ไม่ลงตัว ⇒ ใช้ <b>Composite Trapezoidal</b> แทน หรือผสม Simpson 1/3 กับช่องคู่ + Trapezoidal ช่องที่เหลือ · <b>ต้องนับช่อง = จุด − 1 ก่อนเลือกวิธีเสมอ</b></p> },
  { id: "t6", q: "ตารางเทียบ 4 วิธี — h · จำนวนจุด · error order",
    hint: "ข้อสอบชอบถามว่า “วิธีไหนแม่นกว่า เพราะอะไร”",
    a: <><NumTable
        headers={["วิธี", "สูตร", "h", "ต้องใช้จุด", "error"]}
        rows={[
          ["① Trapezoidal", "(h/2)(f₀+f₁)", "b−a", "2 จุด", "O(h³)"],
          ["② Composite Trap", "(h/2)(f₀+fₙ+2Σใน)", "(b−a)/n", "n ≥ 1", "O(h²)"],
          ["③ Simpson 1/3", "(h/3)(f₀+4f₁+f₂)", "(b−a)/2", "3 จุด", "O(h⁵)"],
          ["④ Composite Simpson", "(h/3)(f₀+f₂ₙ+4Σคี่+2Σคู่)", "(b−a)/2n", "n = พาราโบลา", "O(h⁴)"],
        ]}/>
      <p style={{margin:"6px 0 0"}}>ช่องเพิ่มเท่าตัว ⇒ Trapezoidal error ลด <b>4 เท่า</b> · Simpson ลด <b>16 เท่า</b></p></> },
];

// ────────── ชุดที่ 3 · Differentiation ──────────
const DIF_CARDS = [
  { id: "dt1", q: "⭐ ตารางชุด “ธรรมดา” O(h) — ครบ f′ ถึง f⁗ (12 สูตร)",
    hint: "⚠︎ ท่องจริงแค่ 2 แถวบน (f′, f″) — แถว f‴/f⁗ แค่รู้ว่ามี",
    a: <><NumTable
        headers={["อนุพันธ์", "Forward", "Backward", "Central"]}
        rows={[
          ["f′", "(fᵢ₊₁ − fᵢ)/h", "(fᵢ − fᵢ₋₁)/h", "(fᵢ₊₁ − fᵢ₋₁)/2h"],
          ["f″", "(fᵢ₊₂ − 2fᵢ₊₁ + fᵢ)/h²", "(fᵢ − 2fᵢ₋₁ + fᵢ₋₂)/h²", "(fᵢ₊₁ − 2fᵢ + fᵢ₋₁)/h²"],
          ["f‴", "(fᵢ₊₃ − 3fᵢ₊₂ + 3fᵢ₊₁ − fᵢ)/h³", "(fᵢ − 3fᵢ₋₁ + 3fᵢ₋₂ − fᵢ₋₃)/h³", "(fᵢ₊₂ − 2fᵢ₊₁ + 2fᵢ₋₁ − fᵢ₋₂)/2h³"],
          ["f⁗", "(fᵢ₊₄ − 4fᵢ₊₃ + 6fᵢ₊₂ − 4fᵢ₊₁ + fᵢ)/h⁴", "(fᵢ − 4fᵢ₋₁ + 6fᵢ₋₂ − 4fᵢ₋₃ + fᵢ₋₄)/h⁴", "(fᵢ₊₂ − 4fᵢ₊₁ + 6fᵢ − 4fᵢ₋₁ + fᵢ₋₂)/h⁴"],
        ]}/>
      <Callout kind="tip" title="วิธีจำที่ทำให้ไม่ต้องท่องทีละตัว">
        <ul style={{margin:0, paddingLeft:18}}>
          <li><b>Forward = สามเหลี่ยมปาสกาลสลับเครื่องหมาย</b>: 1,−1 · 1,−2,1 · 1,−3,3,−1 · 1,−4,6,−4,1</li>
          <li><b>Backward = Forward กลับด้าน</b> (i+k → i−k แล้วกลับลำดับ)</li>
          <li><b>ตัวส่วนคือ hⁿ</b> เมื่อ n = อันดับอนุพันธ์ (central ของอันดับคี่มี 2 คูณเพิ่ม)</li>
        </ul>
      </Callout></> },
  { id: "dt2", q: "⭐ ตารางชุด “ละเอียด” — ครบ f′ ถึง f⁗ (อีก 12 สูตร)",
    hint: "⚠︎ ท่องจริงแค่ 2 แถวบน · โจทย์เขียน O(h²) = สั่งให้ใช้ตารางนี้",
    a: <><NumTable
        headers={["อนุพันธ์", "Forward O(h²)", "Backward O(h²)", "Central O(h⁴)"]}
        rows={[
          ["f′", "(−fᵢ₊₂ + 4fᵢ₊₁ − 3fᵢ)/2h", "(3fᵢ − 4fᵢ₋₁ + fᵢ₋₂)/2h", "(−fᵢ₊₂ + 8fᵢ₊₁ − 8fᵢ₋₁ + fᵢ₋₂)/12h"],
          ["f″", "(−fᵢ₊₃ + 4fᵢ₊₂ − 5fᵢ₊₁ + 2fᵢ)/h²", "(2fᵢ − 5fᵢ₋₁ + 4fᵢ₋₂ − fᵢ₋₃)/h²", "(−fᵢ₊₂ + 16fᵢ₊₁ − 30fᵢ + 16fᵢ₋₁ − fᵢ₋₂)/12h²"],
          ["f‴", "(−3fᵢ₊₄ + 14fᵢ₊₃ − 24fᵢ₊₂ + 18fᵢ₊₁ − 5fᵢ)/2h³", "(5fᵢ − 18fᵢ₋₁ + 24fᵢ₋₂ − 14fᵢ₋₃ + 3fᵢ₋₄)/2h³", "(−fᵢ₊₃ + 8fᵢ₊₂ − 13fᵢ₊₁ + 13fᵢ₋₁ − 8fᵢ₋₂ + fᵢ₋₃)/8h³"],
          ["f⁗", "(−2fᵢ₊₅ + 11fᵢ₊₄ − 24fᵢ₊₃ + 26fᵢ₊₂ − 14fᵢ₊₁ + 3fᵢ)/h⁴", "(3fᵢ − 14fᵢ₋₁ + 26fᵢ₋₂ − 24fᵢ₋₃ + 11fᵢ₋₄ − 2fᵢ₋₅)/h⁴", "(−fᵢ₊₃ + 12fᵢ₊₂ − 39fᵢ₊₁ + 56fᵢ − 39fᵢ₋₁ + 12fᵢ₋₂ − fᵢ₋₃)/6h⁴"],
        ]}/>
      <p style={{margin:"6px 0 0"}}>⚠︎ <b>Central ของชุดละเอียดเป็น O(h⁴)</b> ไม่ใช่ O(h²) — central ได้ order ฟรีเพิ่ม 1 ขั้นเสมอ</p></> },
  { id: "d0", q: "⭐ 6 สูตรที่ต้องปิดตาเขียนให้ได้ — ท่องจริงแค่นี้ทั้งบท",
    hint: "6 ตัวนี้คือของที่ถูกถามจริงในแบบฝึกหัด 2 + การบ้าน 3 · ที่เหลือดูตาราง 2 ใบข้างบนพอ",
    a: <>
      <p style={{margin:"0 0 4px"}}><b>f′ — ชุดที่แบบฝึกหัด 2 ข้อ 1–2 ถาม</b></p>
      <MB>{`f'_{fwd}=\\frac{f_{i+1}-f_i}{h}\\qquad f'_{bwd}=\\frac{f_i-f_{i-1}}{h}\\qquad f'_{ctr}=\\frac{f_{i+1}-f_{i-1}}{2h}`}</MB>
      <p style={{margin:"10px 0 4px"}}><b>f″ — ชุดที่การบ้าน 3 ข้อ 2 ถาม</b> (โจทย์สั่ง forward O(h²) · backward O(h²) · central O(h⁴))</p>
      <MB>{`f''_{fwd}=\\frac{-f_{i+3}+4f_{i+2}-5f_{i+1}+2f_i}{h^2}\\qquad f''_{bwd}=\\frac{2f_i-5f_{i-1}+4f_{i-2}-f_{i-3}}{h^2}`}</MB>
      <MB>{`f''_{ctr}=\\frac{-f_{i+2}+16f_{i+1}-30f_i+16f_{i-1}-f_{i-2}}{12h^2}`}</MB>
      <Callout kind="tip" title="ถ้ายังมีแรงเหลือ ค่อยเก็บอีก 6 ตัวที่เหลือของ 2 แถวบน">
        <p style={{margin:0}}>f′ ชุดละเอียด (fwd/bwd O(h²), ctr O(h⁴)) และ f″ ชุดธรรมดา (fwd/bwd O(h), ctr O(h²) = <M>{`\\frac{f_{i+1}-2f_i+f_{i-1}}{h^2}`}</M>) — <b>อยู่ในตาราง 2 ใบข้างบนแล้ว</b> · f‴/f⁗ <b>ไม่เคยถูกถาม</b> ไม่ต้องท่อง</p>
      </Callout>
      <p style={{margin:"8px 0 0"}}>central แม่นกว่าเสมอเพราะ error สองข้าง<b>หักล้างกัน</b> ⇒ ถ้าโจทย์ไม่บังคับ ให้เลือก central · <b>แต่ต้องมีจุดครบทั้งสองข้าง</b> ถ้ายืนอยู่ต้น/ท้ายตารางต้องใช้ forward/backward</p>
      <p style={{margin:"6px 0 0", fontSize:'0.8rem', color:"var(--text-faint)"}}>ตรวจแล้วด้วยโปรแกรม: <M>{`f(x)=e^{x/3}+x^2`}</M> ที่ <M>{`x=-2.5,\\ h=0.1`}</M> ⇒ central O(h⁴) ได้ 2.048288689 เทียบค่าจริง 2.048288690</p>
    </> },
  { id: "d7", q: "โจทย์เขียน “O(h²)” แปลว่าอะไร ⭐", hint: "ไม่ใช่คำใบ้ แต่เป็นคำสั่ง",
    a: <p style={{margin:0}}>= <b>คำสั่งให้ใช้ชุดสูตร “ละเอียด”</b> ไม่ใช่ชุดธรรมดา · <b>หยิบผิดชุด = 0</b> แม้คำนวณถูก · และ <M>{`O(h^n)`}</M> แปลว่า “h ลดครึ่ง error ลด <M>{`2^n`}</M> เท่า”</p> },
  { id: "d8", q: "Taylor Series — ที่มาของสูตรทั้ง 24", hint: "รู้ที่มาแล้วไม่ต้องท่องมั่ว",
    a: <><MB>{`f(x_{i+1})=f(x_i)+h f'(x_i)+\\frac{h^2}{2!}f''(x_i)+\\cdots`}</MB>
      <p style={{margin:"4px 0 0"}}>ย้ายข้างหา <M>{`f'`}</M> ⇒ ได้ forward · เทอมที่ทิ้งตัวแรกคือ <M>{`h^1`}</M> ⇒ <b>O(h)</b><br/>
      เอา <M>{`f(x_{i+1})-f(x_{i-1})`}</M> ⇒ เทอม <M>{`h^2`}</M> ตัดกันหมด ⇒ <b>central เป็น O(h²)</b></p></> },
  { id: "d9", q: "ต้องใช้จุดกี่จุด และจุดไหนบ้าง", hint: "เตรียมตาราง f(x) ให้ครบก่อนแทนสูตร",
    a: <p style={{margin:0}}>ดูตัวห้อยที่ไกลสุดในสูตร · เช่น f″ forward O(h²) ใช้ถึง <M>{`f_{i+3}`}</M> ⇒ ต้องมี <M>{`x_i,x_{i+1},x_{i+2},x_{i+3}`}</M> · <b>คำนวณ f ทุกจุดให้ครบก่อน แล้วค่อยแทนสูตร</b></p> },
];

// ────────── ชุดที่ 4 · Root Finding ──────────
const ROOT_CARDS = [
  { id: "r1", q: "Bisection — สูตร + กฎย้ายฝั่ง",
    a: <><MB>{`x_m=\\frac{x_l+x_u}{2}`}</MB>
        <p style={{margin:0}}>ถ้า <M>{`f(x_l)\\cdot f(x_m)<0`}</M> → รากอยู่<b>ซ้าย</b> ⇒ <M>{`x_u\\leftarrow x_m`}</M> · ถ้า <M>{`>0`}</M> → รากอยู่<b>ขวา</b> ⇒ <M>{`x_l\\leftarrow x_m`}</M> · <b>เทียบกับ <M>{`f(x_l)`}</M> เสมอ</b></p></> },
  { id: "r2", q: "False Position — สูตร",
    a: <><MB>{`x_r=x_u-\\frac{f(x_u)\\,(x_l-x_u)}{f(x_l)-f(x_u)}`}</MB>
        <p style={{margin:0}}>กฎย้ายฝั่งเหมือน Bisection ทุกอย่าง · ปลายข้างที่โค้งมากจะ<b>ค้างไม่ขยับ</b> (one-sided convergence) — ไม่ใช่บั๊ก</p></> },
  { id: "r3", q: "One-point Iteration — สูตร + เงื่อนไขลู่เข้า",
    a: <><MB>{`x_{i+1}=g(x_i)`}</MB>
        <p style={{margin:"0 0 4px"}}>ต้องจัด <M>{`f(x)=0`}</M> ให้เป็น <M>{`x=g(x)`}</M> เอง</p>
        <p style={{margin:0}}><b>ลู่เข้าเมื่อ <M>{`|g'(\\text{ราก})|<1`}</M></b> · ถ้า ≥ 1 จะลู่ออกหรือแกว่งไม่จบ ⇒ ต้องจัดรูป g ใหม่</p></> },
  { id: "r3b", q: "⭐ One-point · จัด x = g(x) ยังไง — และรู้ได้ไงว่ารูปที่จัดใช้ได้",
    hint: "จุดที่พลาดมากสุดของบทนี้ · อาจารย์สอนวิธีแยก f₁/f₂ ในคาบ 5 ส.ค.",
    a: <>
      <p style={{margin:"0 0 4px"}}><b>ขั้นที่ 1 · แยก f(x) เป็น 2 ก้อน โดยให้ <M>{`f_1(x)=x`}</M> เสมอ</b> ที่เหลือคือ <M>{`f_2(x)`}</M> ⇒ <M>{`x=f_2(x)=g(x)`}</M></p>
      <CodeBlock code={`f(x) = e^(-x) - x = 0        <- ตัวอย่างที่อาจารย์ใช้จริงปีนี้

f1(x) = x            <- "เป็น x เสมอ"
f2(x) = e^(-x)       <- ที่เหลือ

x = e^(-x)   ->   x_(i+1) = e^(-x_i)        <- isolation form`}/>
      <p style={{margin:"10px 0 4px"}}><b>ขั้นที่ 2 · เช็คก่อนเดิน — ลู่เข้าเมื่อ <M>{`|g'(\\text{ราก})|<1`}</M></b> · รูปที่จัดได้มีหลายแบบ และ<b>ไม่ใช่ทุกแบบที่ใช้ได้</b>:</p>
      <NumTable
        headers={["จัด x² − 7 = 0 ได้เป็น", "g′(√7)", "ผล"]}
        rows={[
          [<M>{`g(x)=7/x`}</M>, "−1.000", "❌ แกว่งสลับข้างไม่จบ (|g′| = 1 พอดี)"],
          [<M>{`g(x)=\\dfrac{7+x}{x+1}`}</M>, "−0.4514", "✅ ลู่เข้า — รูปที่ควรใช้"],
          [<M>{`g(x)=\\dfrac{x+7/x}{2}`}</M>, "0", "✅ เร็วมาก (นี่คือ Newton ของ x²−7 พอดี)"],
        ]}/>
      <Callout kind="tip" title="เคล็ดจัดรูปเมื่อจัดตรง ๆ แล้วลู่ออก">
        <p style={{margin:0}}><b>บวก x ทั้งสองข้างเพื่อให้ดึงตัวร่วมได้</b> — <M>{`x^2-7=0 \\Rightarrow x^2+x=x+7 \\Rightarrow x(x+1)=x+7 \\Rightarrow x=\\dfrac{7+x}{x+1}`}</M> · นี่คือวิธีที่อาจารย์จัดให้ดูบนกระดาน</p>
      </Callout>
      <p style={{margin:"8px 0 0"}}><b>เดินจริง</b> (<M>{`e^{-x}-x`}</M>, <M>{`x_0=0`}</M>): 1.0000000 → 0.3678794 → 0.6922006 → 0.5004735 → … <b>รอบ 14 = 0.5669089</b> จึงเข้าเกณฑ์ <M>{`|\\Delta x|<0.001`}</M> (รากจริง 0.5671433) · <b>ค่าเด้งสลับสูง-ต่ำเป็นเรื่องปกติ</b> เพราะ <M>{`g'<0`}</M> — ถ้าโจทย์ให้ทำ 4 รอบแล้วยังห่างราก อย่าคิดว่าทำผิด</p>
    </> },
  { id: "r4", q: "Newton-Raphson — สูตร + ข้อจำกัด",
    a: <><MB>{`x_{i+1}=x_i-\\frac{f(x_i)}{f'(x_i)}`}</MB>
        <p style={{margin:0}}>เร็วสุด (quadratic — หลักที่ถูกเพิ่มเป็นเท่าตัวทุกรอบ) · แต่<b>ต้อง diff เป็น</b> และพังถ้า <M>{`f'=0`}</M></p></> },
  { id: "r5", q: "Secant — สูตร + ใช้ตอนไหน",
    a: <><MB>{`x_{i+1}=x_i-\\frac{f(x_i)\\,(x_{i-1}-x_i)}{f(x_{i-1})-f(x_i)}`}</MB>
        <p style={{margin:0}}>= Newton ที่แทน <M>{`f'`}</M> ด้วยสโลปจาก 2 จุด ⇒ <b>ไม่ต้อง diff เลย</b> · ใช้เมื่อ diff ยาก/ไม่ได้ · ต้องมีค่าเริ่ม <b>2 ตัว</b></p></> },
  { id: "r6", q: "สูตร error ε ของทุกวิธี ⭐", hint: "อันเดียวใช้ได้หมด",
    a: <><MB>{`\\varepsilon_a=\\left|\\frac{x_{\\text{ใหม่}}-x_{\\text{เก่า}}}{x_{\\text{ใหม่}}}\\right|`}</MB>
        <p style={{margin:0}}><b>ทุกวิธีหารด้วยค่าใหม่</b> — เพราะเราไม่รู้ค่าจริง · จะตอบเป็น % ก็ได้แต่ต้องบอกหน่วยให้ชัด อย่าสลับไปมาในตารางเดียว</p></> },
  { id: "r7", q: "วิธีไหนมี “รอบทำทิ้ง” ⭐", hint: "กติกาเดินตารางของอาจารย์",
    a: <NumTable
        headers={["วิธี", "มีรอบทำทิ้งไหม", "เริ่มคิด error รอบไหน"]}
        rows={[
          ["Bisection", "✅ มี — รอบ 0 ไม่หา error", "รอบ 1"],
          ["False Position", "✅ มี", "รอบ 1"],
          ["One-point · Newton · Secant", "❌ ไม่มี", "รอบ 1"],
        ]}/> },
  { id: "r8", q: "เงื่อนไขหยุดในโปรแกรม ต่างจาก ε ในตารางยังไง ⭐",
    a: <p style={{margin:0}}>โปรแกรมใช้ <b>absolute</b> <M>{`|\\Delta x|<tol`}</M> (อาจารย์ตั้ง <M>{`tol=0.001`}</M> เป็นปกติ) · ตารางรายงานใช้ <b>relative</b> <M>{`\\varepsilon=|\\Delta x / x_{\\text{ใหม่}}|`}</M> · <b>คนละตัว ห้ามสลับ</b> · และถ้าโจทย์เขียน “ทศนิยม n ตำแหน่งไม่เปลี่ยน” นั่นคือเกณฑ์ที่สามอีกแบบ</p> },
  { id: "r0", q: "Graphical Method — วิธีที่ 1 (อยู่ในการบ้าน 3)",
    hint: "อย่าข้าม — ออกในการบ้านจริง",
    a: <><p style={{margin:"0 0 6px"}}>สแกน x ทีละ step แล้วดูว่าช่วงไหน<b>เปลี่ยนเครื่องหมาย</b>:</p>
      <MB>{`f(x_i)\\cdot f(x_{i+1})<0\\;\\Rightarrow\\;\\text{มีรากระหว่าง } x_i \\text{ กับ } x_{i+1}`}</MB>
      <p style={{margin:"4px 0 0"}}><b>Modified Graphical</b> = เจอช่วงแล้ว<b>ลด step</b> (1 → 0.1 → 0.01 …) แล้วสแกนซ้ำในช่วงนั้นจนได้ความละเอียดที่ต้องการ · การบ้าน 3: <M>{`43x-180=0`}</M> ช่วง <M>{`0\\le x\\le 10`}</M> ⇒ ราก <M>{`180/43=4.186047`}</M></p></> },
  { id: "r9", q: "Taylor Series — ประมาณค่าฟังก์ชัน (ออกในเอกสารติว)",
    hint: "ไม่ใช่วิธีหาราก แต่อยู่ในบทนี้",
    a: <><MB>{`f(x)\\approx\\sum_{n=0}^{N}\\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n`}</MB>
      <Callout kind="danger" title="⚠︎ error ของ Taylor ใช้คนละสูตรกับวิธีอื่น">
        <p style={{margin:0}}>ใช้ <b>ผลต่างสัมบูรณ์</b> <M>{`\\varepsilon=|f_{\\text{จริง}}-f_{\\text{ประมาณ}}|`}</M> — <b>ไม่หารด้วยอะไร</b> ต่างจากวิธีวนซ้ำที่หารด้วยค่าใหม่ · ตัวอย่างที่ติว: <M>{`\\ln 4`}</M> จาก <M>{`x_0=2`}</M>, N=0 ⇒ <M>{`\\varepsilon=|\\ln4-\\ln2|=0.693147`}</M></p>
      </Callout></> },
];

// ────────── ชุดที่ 5 · Linear Systems ──────────
const LIN_CARDS = [
  { id: "l1", q: "Cramer’s Rule — สูตร + ข้อจำกัด",
    a: <><MB>{`x_i=\\frac{\\det A_i}{\\det A}`}</MB>
        <p style={{margin:0}}><M>{`A_i`}</M> = เอา <M>A</M> มาแทน<b>คอลัมน์ที่ i</b> ด้วย <M>b</M> · <b>ใช้ได้แค่ 2×2 กับ 3×3</b> (อาจารย์บอกเอง) · เมทริกซ์<b>ต้องจัตุรัส</b> ไม่งั้นหา det ไม่ได้ → ใช้ Gauss แทน · ถ้า <M>{`\\det A=0`}</M> หยุดเลย</p></> },
  { id: "l2", q: "det ของ 2×2 และ 3×3",
    a: <><MB>{`\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}=ad-bc`}</MB>
        <MB>{`\\begin{vmatrix}a_{11}&a_{12}&a_{13}\\\\a_{21}&a_{22}&a_{23}\\\\a_{31}&a_{32}&a_{33}\\end{vmatrix}=a_{11}(a_{22}a_{33}-a_{23}a_{32})-a_{12}(a_{21}a_{33}-a_{23}a_{31})+a_{13}(a_{21}a_{32}-a_{22}a_{31})`}</MB>
        <p style={{margin:0}}>เครื่องหมายสลับ <b>+ − +</b> · ในห้องสอบ<b>ให้กดเครื่อง</b> (โหมด Matrix) อย่ากางมือ — แต่ต้องเขียนสูตรกับเมทริกซ์ <M>{`A_i`}</M> ให้เห็น</p></> },
  { id: "l3", q: "Gauss Elimination — 2 ขั้นตอน",
    a: <><p style={{margin:"0 0 4px"}}><b>① Forward elimination</b> ทำให้เป็นสามเหลี่ยมบน</p>
        <MB>{`m_{ik}=\\frac{a_{ik}}{a_{kk}}\\qquad R_i\\leftarrow R_i-m_{ik}R_k`}</MB>
        <p style={{margin:"6px 0 4px"}}><b>② Back substitution</b> ไล่จากล่างขึ้นบน</p>
        <MB>{`x_i=\\frac{b_i-\\sum_{j>i}a_{ij}x_j}{a_{ii}}`}</MB>
        <p style={{margin:0}}>ตรวจฟรี: <b>ผลคูณตัวหลัก = det A</b></p></> },
  { id: "l3b", q: "⭐ Gauss ทำมือ · เดินตารางทีละ row operation (4 ก้าว)",
    hint: "ท่องเป็นลำดับก้าว ไม่ใช่ท่องสูตร — ก้าวเดียวกันใช้ได้ทุกขนาด",
    a: <>
      <ol style={{margin:"0 0 8px", paddingLeft:20, lineHeight:1.9}}>
        <li>เขียน <b>augmented</b> <M>{`[A\\,|\\,b]`}</M> — b เป็นคอลัมน์สุดท้าย <b>ต้องทำทุก operation กับมันด้วย</b></li>
        <li><b>คอลัมน์ 1</b>: <M>{`m_{i1}=a_{i1}/a_{11}`}</M> แล้ว <M>{`R_i \\leftarrow R_i - m_{i1}R_1`}</M> ทำกับ<b>ทุกแถวใต้ pivot</b></li>
        <li><b>คอลัมน์ 2</b>: ใช้ตัวเลข<b>ใหม่</b> — <M>{`m_{32}=a'_{32}/a'_{22}`}</M> แล้ว <M>{`R_3 \\leftarrow R_3 - m_{32}R_2`}</M> ⇒ ได้สามเหลี่ยมบน</li>
        <li><b>Back substitution</b> จากแถวล่างขึ้นบน: <M>{`x_i=\\dfrac{b_i-\\sum_{j>i}a_{ij}x_j}{a_{ii}}`}</M></li>
      </ol>
      <p style={{margin:"0 0 4px"}}><b>ซ้อมด้วยชุดนี้ก่อน — ตัวคูณเป็นจำนวนเต็มหมด จะได้เห็นโครง</b></p>
      <CodeBlock code={`[A|b] = | 1   1   1 |  6 |      m21 = 2/1 = 2   R2 <- R2 - 2R1
        | 2   4   1 | 13 |      m31 = 3/1 = 3   R3 <- R3 - 3R1
        | 3  11   2 | 31 |

     -> | 1   1   1 |  6 |      m32 = 8/2 = 4   R3 <- R3 - 4R2
        | 0   2  -1 |  1 |
        | 0   8  -1 | 13 |

     -> | 1   1   1 |  6 |   <- Upper Triangular
        | 0   2  -1 |  1 |
        | 0   0   3 |  9 |

back sub:  x3 = 9/3 = 3
           x2 = (1 + 1(3))/2 = 2
           x1 = (6 - 1(2) - 1(3))/1 = 1        ตอบ x = (1, 2, 3)`}/>
      <Callout kind="danger" title="3 กฎที่ทำให้ตารางไม่หลุด">
        <ul style={{margin:0, paddingLeft:18}}>
          <li><b>pivot = 0 → สลับแถวก่อน</b> (ห้ามหารด้วย 0) · สลับ 1 ครั้ง <b>det เปลี่ยนเครื่องหมาย</b></li>
          <li><b>คำนวณ m ให้ครบก่อนแก้แถว</b> — ถ้าแก้ไปคำนวณไปจะใช้เลขที่เปลี่ยนแล้ว</li>
          <li><b>ผลคูณตัวหลัก = det A</b> (ตัวอย่างนี้ 1·2·3 = 6) ⇒ ได้ det มาฟรีไว้ตรวจ Cramer</li>
        </ul>
      </Callout>
      <p style={{margin:"8px 0 0", fontSize:'0.84rem'}}>ในข้อสอบตัวเลขจะเป็นทศนิยมน่าเกลียด — <b>เก็บ m ลงตัวแปรเครื่องคิดเลข</b> (VARIABLE▸[A=]▸Store) อย่าจดค่าที่ปัดแล้วมาคิดต่อ · ตัวอย่างเลขจริงเดินครบทุกบรรทัดอยู่ในบท Linear หมวด Gauss</p>
    </> },
  { id: "l4", q: "เมทริกซ์ไม่จัตุรัส (สมการ ≠ ตัวแปร) → อ่านผลยังไง",
    a: <NumTable
        headers={["แถวสุดท้ายหลังทำ Gauss", "แปลว่า"]}
        rows={[
          [<M>{`[\\,0\\ 0\\ 0\\,|\\,c\\neq0\\,]`}</M>, "ไม่มีคำตอบ"],
          [<M>{`[\\,0\\ 0\\ 0\\,|\\,0\\,]`}</M>, "มีคำตอบไม่จำกัด (มีตัวแปรอิสระ)"],
          ["มีตัวหลักครบทุกคอลัมน์", "คำตอบเดียว"],
        ]}/> },
];

// ────────── ชุดที่ 6 · Linear 6 วิธีที่เหลือ (ของไฟนอลล้วน) ──────────
const LIN2_CARDS = [
  { id: "n0", q: "⭐ เห็นโจทย์ Linear แล้วเลือกวิธีไหน — Decision Tree",
    hint: "ข้อสอบมักสั่งวิธีมาตรง ๆ แต่ถ้าให้เลือกเอง ใช้ตารางนี้",
    a: <NumTable
        headers={["โจทย์บอกอะไร", "ใช้วิธี", "เพราะ"]}
        rows={[
          ["สั่งชื่อวิธีมาเลย", "ทำตามที่สั่ง", "ข้อสอบส่วนใหญ่เป็นแบบนี้ (การบ้าน 6-7 สั่งครบ 8 ข้อ)"],
          ["ให้ b หลายชุด กับ A เดิม", <b>LU</b>, "แยก LU ครั้งเดียว ใช้ซ้ำได้ทุก b"],
          [<span>A สมมาตร + <M>{`\\det`}</M> minor บวกหมด</span>, <b>Cholesky</b>, "เร็วกว่า LU เท่าตัว เพราะใช้แค่ L"],
          ["ต้องการ A⁻¹ ตัวจริง (ไม่ใช่แค่ x)", <b>Matrix Inversion</b>, "วิธีอื่นให้ x อย่างเดียว"],
          ["เมทริกซ์ใหญ่มากและมีศูนย์เยอะ", <span><b>Jacobi / Gauss-Seidel</b></span>, "iterative ไม่ต้องเก็บทั้งเมทริกซ์"],
          ["ไม่บอกอะไรเลย · A ไม่จัตุรัส", <b>Gauss Elimination</b>, "ตัวเดียวที่ใช้ได้ทุกกรณี"],
        ]}/> },
  { id: "n1", q: "Gauss-Jordan ต่างจาก Gauss ตรงไหน (2 อย่าง)",
    a: <><ol style={{margin:"0 0 6px", paddingLeft:20, lineHeight:1.8}}>
          <li><b>normalize แถว pivot</b> — หารทั้งแถวด้วย <M>{`a_{kk}`}</M> ให้ตัวหลักเป็น 1</li>
          <li><b>กำจัดข้างบนด้วย</b> ไม่ใช่แค่ข้างล่าง ⇒ ทุกแถวที่ <M>{`i\\neq k`}</M></li>
        </ol>
        <p style={{margin:0}}>จบแล้วได้ <M>{`[I\\,|\\,x]`}</M> ⇒ <b>อ่านคำตอบจากคอลัมน์ขวาได้เลย ไม่ต้อง back-substitute</b> · <span style={{color:"var(--yellow)"}}>ลืม normalize = ได้แค่ diagonal คำตอบยังผิด</span></p></> },
  { id: "n2", q: "Matrix Inversion — 3 ขั้น + สูตรลัด 2×2",
    a: <><ol style={{margin:"0 0 6px", paddingLeft:20, lineHeight:1.8}}>
          <li>ต่อ augment <M>{`[A\\,|\\,I]`}</M></li>
          <li>ทำ <b>Gauss-Jordan ทั้งแถบ</b> จนซ้ายเป็น <M>I</M></li>
          <li>ครึ่งขวาคือ <M>{`A^{-1}`}</M> แล้ว <M>{`x=A^{-1}b`}</M></li>
        </ol>
        <MB>{`A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix} d & -b \\\\ -c & a\\end{bmatrix}\\quad(2\\times2)`}</MB>
        <p style={{margin:0}}>ตรวจฟรี: <M>{`A\\cdot A^{-1}=I`}</M> · <M>{`\\det A=0`}</M> ⇒ ไม่มี inverse · <span style={{color:"var(--yellow)"}}>ในโค้ด ลูปคอลัมน์ต้องถึง <b>2n</b></span></p></> },
  { id: "n3", q: "LU Decomposition (Doolittle) — L, U มาจากไหน + แก้ยังไง",
    hint: "U คือผลของ forward elimination · L คือตัวคูณที่ Gauss ใช้แล้วทิ้ง",
    a: <><MB>{`A = LU \\qquad L_{ik}=\\frac{a_{ik}}{a_{kk}}\\ (\\text{ตัวคูณ}),\\quad L_{ii}=1`}</MB>
        <p style={{margin:"0 0 4px"}}>แก้ 2 ขั้น:</p>
        <MB>{`Ly = b\\ (\\text{forward, ไล่ลง})\\qquad Ux = y\\ (\\text{back, ไล่ขึ้น})`}</MB>
        <p style={{margin:0}}><b>Doolittle</b> diag <M>L</M> = 1 · <b>Crout</b> diag <M>U</M> = 1 (ต่างกันแค่นี้) · <span style={{color:"var(--yellow)"}}>จุดตาย: ต้อง<b>เก็บตัวคูณลง L ก่อน</b>เอาไปกำจัด ไม่งั้น L กลายเป็น I</span> · ตรวจ: คูณ <M>{`LU`}</M> กลับต้องได้ <M>A</M></p></> },
  { id: "n4", q: "Cholesky — เงื่อนไข + 2 สูตร + ต่างจาก LU ตรงไหน",
    a: <><p style={{margin:"0 0 6px"}}><M>{`A = LL^{T}`}</M> — <b>ใช้ได้เฉพาะ symmetric positive definite</b> (<M>{`A=A^{T}`}</M> และ leading minor det บวกหมด)</p>
        <MB>{`L_{jj}=\\sqrt{a_{jj}-\\sum_{k<j}L_{jk}^{2}}`}</MB>
        <MB>{`L_{ij}=\\frac{a_{ij}-\\sum_{k<j}L_{ik}L_{jk}}{L_{jj}},\\quad i>j`}</MB>
        <p style={{margin:0}}>แก้ <M>{`Ly=b`}</M> แล้ว <M>{`L^{T}x=y`}</M> — <b>substitution ชุดเดียวกับ LU</b> · <span style={{color:"var(--yellow)"}}>ต่างจาก LU ตรง forward sub <b>ต้องหารด้วย</b> <M>{`L_{ii}`}</M> เพราะแนวทแยงไม่ใช่ 1</span> · ใต้รากติดลบ = ไม่ SPD ⇒ เปลี่ยนไป LU</p></> },
  { id: "n5", q: "⭐ Jacobi vs Gauss-Seidel — สูตรเดียวกัน ต่างกันบรรทัดเดียว",
    hint: "การบ้าน 6-7 ข้อ 1.7 กับ 1.8 — ข้อสอบชอบให้ทำคู่กันแล้วเทียบจำนวนรอบ",
    a: <><MB>{`x_i^{(k+1)}=\\frac{1}{a_{ii}}\\Big(b_i-\\sum_{j\\neq i}a_{ij}x_j\\Big)`}</MB>
        <NumTable
          headers={["", "ทางขวาใช้ค่าไหน", "ในโค้ด"]}
          rows={[
            [<b>Jacobi</b>, <span>ค่า<b>เก่าทั้งชุด</b> <M>{`x^{(k)}`}</M> — คำนวณครบก่อนแล้วเขียนทับพร้อมกัน</span>, <span><code>old = x[:]</code> แล้วอ่านจาก <code>old</code></span>],
            [<b>Gauss-Seidel</b>, <span>ค่า<b>ใหม่ทันที</b>ที่คำนวณได้ในรอบเดียวกัน</span>, <span><code>เขียนทับ x[i]</code> แล้วอ่านจาก <code>x</code></span>],
          ]}/>
        <p style={{margin:"6px 0 0"}}>Gauss-Seidel ลู่เข้าเร็วกว่าราวเท่าตัวเสมอ · <span style={{color:"var(--yellow)"}}>ลืม <code>old = x[:]</code> ⇒ Jacobi กลายเป็น Gauss-Seidel เงียบ ๆ = ตอบข้อ 1.7 ผิด</span></p></> },
  { id: "n6", q: "⭐⭐ กับดักใหญ่สุดของ Jacobi/GS — เงื่อนไขลู่เข้า",
    hint: "ระบบของการบ้าน 6-7 ตัวเดิม ลู่ออก ไม่ใช่ยังไม่ถึงรอบ",
    a: <><p style={{margin:"0 0 6px"}}><b>diagonally dominant</b> — ตัวบนเส้นทแยงต้องโตกว่าเพื่อนในแถวเดียวกันรวมกัน:</p>
        <MB>{`|a_{ii}| > \\sum_{j\\neq i}|a_{ij}| \\quad \\text{ทุกแถว}`}</MB>
        <p style={{margin:"0 0 6px"}}>ระบบการบ้าน 6-7 <b>ตกทั้ง 3 แถว</b> ⇒ ต้อง<b>ผสมแถวสร้างระบบสมมูล</b>ก่อน (บวก/ลบสมการได้โดยคำตอบไม่เปลี่ยน):</p>
        <CodeBlock code={`E1' = R2 + 2R3  ->  5x1      - 3x3 = -8     (ตัด x2 ทิ้ง)
E2' = R1 -  R3  -> -3x1 + 5x2      = 13     (ตัด x3 ทิ้ง)
E3' = R1 + 2R3  ->       -  x2 + 3x3 = 1    (ตัด x1 ทิ้ง)

เช็คใหม่: 5>3 ✓  5>3 ✓  3>1 ✓   -> ลู่เข้าแน่นอน`}/>
        <p style={{margin:"6px 0 0"}}>วิธีคิด: <b>ผสมแถวให้แต่ละสมการเหลือตัวแปรแค่ 2 ตัว</b> ตัวที่เหลือบนเส้นทแยงจะโตกว่าเพื่อนทันที · ที่ <M>{`tol=0.001`}</M> จาก <M>{`(0,0,0)`}</M>: <b>Jacobi 12 รอบ · Gauss-Seidel 5 รอบ</b></p></> },
  { id: "n7", q: "⭐ [การบ้าน 8] Conjugate Gradient — ลำดับ 5 บรรทัด + เงื่อนไข",
    hint: "สไลด์อาจารย์ใช้ R = AX − B (ไม่ใช่ B − AX)",
    a: <><MB>{`R^{0}=AX^{0}-B,\\qquad D^{0}=-R^{0}`}</MB>
        <MB>{`\\lambda_k=-\\frac{D^{k\\,T}R^{k}}{D^{k\\,T}AD^{k}},\\qquad X^{k+1}=X^{k}+\\lambda_k D^{k},\\qquad R^{k+1}=AX^{k+1}-B`}</MB>
        <MB>{`\\text{Error}=\\sqrt{R^{k+1\\,T}R^{k+1}}<\\varepsilon\\ \\Rightarrow\\ \\text{หยุด}`}</MB>
        <MB>{`\\alpha_k=\\frac{R^{k+1\\,T}AD^{k}}{D^{k\\,T}AD^{k}},\\qquad D^{k+1}=-R^{k+1}+\\alpha_k D^{k}`}</MB>
        <p style={{margin:0}}>ใช้ได้เมื่อ A <b>สมมาตร + positive definite</b> ⇒ จบไม่เกิน n รอบ (การบ้าน 8 ระบบ 4×4 = <b>4 รอบ</b>) · <span style={{color:"var(--yellow)"}}>A ไม่สมมาตร ⇒ คูณ <M>{`A^{T}`}</M> ทั้งสองข้างก่อน · det &lt; 0 (เช่น [[2,5],[5,1]] ข้อ 2) ⇒ ไม่ใช่ positive definite ⇒ contour เป็นรูปอานม้า</span></p></> },
];

// ────────── ชุดที่ 7 · Interpolation ──────────
const INTERP_CARDS = [
  { id: "p0", q: "⭐ เห็นตารางจุดแล้วเลือกวิธีไหน",
    hint: "คำถามแรกเสมอ: จุดห่างเท่ากันหรือเปล่า",
    a: <NumTable
        headers={["ลักษณะจุด", "ใช้ได้", "เหตุผล"]}
        rows={[
          [<b>ห่างเท่ากัน</b> , "Newton Forward / Backward · (DD และ Lagrange ก็ยังใช้ได้)", <span>มี <M>h</M> คงที่ ⇒ ใช้ตาราง <M>{`\\Delta`}</M> ได้ คำนวณเร็วกว่า</span>],
          [<b>ห่างไม่เท่ากัน</b>, "Newton Divided-Difference · Lagrange เท่านั้น", <span>ไม่มี <M>h</M> เดียว ⇒ Forward/Backward ใช้ไม่ได้</span>],
          ["ถามหลายจุดบนข้อมูลชุดเดิม", <b>Newton DD</b>, "หา coefficient ครั้งเดียว ใช้ซ้ำได้"],
          ["ถามจุดเดียว", <b>Lagrange</b>, "เขียนสั้นกว่า ไม่ต้องสร้างตาราง"],
        ]}/> },
  { id: "p1", q: "Newton Divided-Difference — สูตร + วิธีสร้างตาราง",
    a: <><MB>{`f(x)=b_0+b_1(x-x_0)+b_2(x-x_0)(x-x_1)+\\cdots`}</MB>
        <MB>{`b_0=f(x_0),\\quad b_k=f[x_k,\\ldots,x_0]`}</MB>
        <MB>{`f[x_i,x_j]=\\frac{f(x_i)-f(x_j)}{x_i-x_j}`}</MB>
        <p style={{margin:0}}>สร้างเป็น<b>ตารางสามเหลี่ยม</b>: คอลัมน์ถัดไป = (ช่องล่าง − ช่องบน) / (ระยะ <b>k ช่อง</b> ของ x) · <b>สัมประสิทธิ์ที่ใช้คือแถวบนสุดของแต่ละคอลัมน์</b></p></> },
  { id: "p2", q: "Lagrange — สูตร + จุดที่ลืมบ่อยสุด",
    a: <><MB>{`f(x)=\\sum_{i=0}^{n}L_i(x)\\,f(x_i),\\qquad L_i(x)=\\prod_{j\\neq i}\\frac{x-x_j}{x_i-x_j}`}</MB>
        <p style={{margin:0}}><M>{`L_i`}</M> ถูกออกแบบให้ <b>= 1 ที่ <M>{`x_i`}</M> และ = 0 ที่จุดอื่นทุกจุด</b> ⇒ พหุนามผ่านทุกจุดโดยอัตโนมัติ · <span style={{color:"var(--yellow)"}}>จุดตาย: ลืมเงื่อนไข <M>{`j\\neq i`}</M> ⇒ หารด้วยศูนย์</span> · <b>ต้องได้เลขเท่ากับ Newton DD เป๊ะ</b> ⇒ ใช้ตรวจกันเองได้</p></> },
  { id: "p3", q: "⭐ Newton Forward / Backward — และ h คืออะไร",
    hint: "h คือจุดที่พลาดในมิดเทอม — h ทุกบทคือ “ระยะห่าง”",
    a: <><p style={{margin:"0 0 4px"}}><b>Forward</b> (ใช้เมื่อจุดที่ถามอยู่<b>ต้นตาราง</b>) · <M>{`s=\\dfrac{x-x_0}{h}`}</M></p>
        <MB>{`f(x)=f_0+s\\,\\Delta f_0+\\frac{s(s-1)}{2!}\\Delta^{2}f_0+\\frac{s(s-1)(s-2)}{3!}\\Delta^{3}f_0+\\cdots`}</MB>
        <p style={{margin:"6px 0 4px"}}><b>Backward</b> (จุดที่ถามอยู่<b>ท้ายตาราง</b>) · <M>{`s=\\dfrac{x-x_n}{h}`}</M></p>
        <MB>{`f(x)=f_n+s\\,\\nabla f_n+\\frac{s(s+1)}{2!}\\nabla^{2}f_n+\\frac{s(s+1)(s+2)}{3!}\\nabla^{3}f_n+\\cdots`}</MB>
        <Callout kind="danger" title="⚠︎ h = ระยะห่างระหว่างจุด — โจทย์ประยุกต์ไม่บอกตรง ๆ">
          <p style={{margin:0}}>มิดเทอมพลาดข้อ Diff จรวดเพราะ<b>ลืมว่า h คืออะไร</b> · <b>h ทุกบทคือระยะห่าง</b> — ในตารางเวลา-ความเร็ว h คือช่วงเวลาระหว่างสองแถว · <b>อ่านจากตาราง อย่ารอให้โจทย์บอก</b> · เครื่องหมาย <M>s</M> ต่างกัน: forward <M>{`(s-1)(s-2)`}</M> ลบ · backward <M>{`(s+1)(s+2)`}</M> บวก</p>
        </Callout></> },
  { id: "p5", q: "⭐ [การบ้าน 9] Divided difference เขียนโค้ด 3 แบบ — ต่างกันยังไง",
    hint: "คำตอบเท่ากันทั้ง 3 แบบ ต่างกันแค่ความเร็ว",
    a: <NumTable headers={["แบบ", "หัวใจของโค้ด", "ความเร็ว"]}
        rows={[
          [<b>recursive</b>, <span>ฐาน <code>i == j</code> คืน <code>ys[i]</code> · ไม่งั้น <code>(dd(i+1,j) − dd(i,j−1)) / (xs[j] − xs[i])</code></span>, "คำนวณช่องเดิมซ้ำ ⇒ โตแบบ exponential"],
          [<b>DP top-down</b>, <span>recursive <b>ตัวเดิม</b> + เช็ค <code>memo</code> ก่อน + เก็บผลก่อน return</span>, "แต่ละช่องครั้งเดียว · O(n²)"],
          [<b>DP bottom-up</b>, <span>ตารางสามเหลี่ยมแบบในชีท · คำตอบคือ<b>แถวบนสุด</b> <code>T[0][k]</code></span>, "แต่ละช่องครั้งเดียว · O(n²)"],
        ]}/> },
  { id: "p4", q: "Interpolation ต่างจาก Regression ยังไง",
    a: <NumTable
        headers={["", "Interpolation", "Regression"]}
        rows={[
          ["เส้นผ่านจุด", <b>ผ่านทุกจุดเป๊ะ</b>, "ไม่ผ่าน — ผ่าน “กลาง ๆ”"],
          ["เหมาะกับข้อมูล", "แม่นยำ ไม่มี noise", "มี noise / วัดมาจากการทดลอง"],
          ["ดีกรีพหุนาม", <span>n+1 จุด ⇒ ดีกรี n</span>, "เลือกเอง (มักต่ำกว่าจำนวนจุดมาก)"],
          ["ระวัง", <span>ดีกรีสูง ⇒ <b>แกว่งที่ปลาย</b> (Runge) ⇒ ใช้ Spline แทน</span>, "อย่า extrapolate ไกลเกินข้อมูล"],
        ]}/> },
];

// ────────── ชุดที่ 8 · Spline ──────────
const SPLINE_CARDS = [
  { id: "s1", q: "⭐ ก่อนแทนสูตร Spline ต้องทำอะไรก่อนเสมอ",
    hint: "ตระกูลเดียวกับข้อ “เลือกช่วง bisection” ที่พลาดในมิด",
    a: <><p style={{margin:"0 0 6px"}}><b>หา segment ก่อน</b> — <M>{`x_q`}</M> ตกอยู่ระหว่าง <M>{`x_i`}</M> กับ <M>{`x_{i+1}`}</M> คู่ไหน แล้วค่อยใช้พหุนามของช่วง<b>นั้น</b></p>
        <p style={{margin:0}}>Spline ไม่ใช่สมการเดียว แต่เป็นพหุนาม <b>n ตัว</b> ต่อกัน ⇒ ใช้ผิดช่วง = ผิดทั้งข้อ · <span style={{color:"var(--yellow)"}}>ถ้า <M>{`x_q`}</M> อยู่นอกช่วงข้อมูลทั้งหมด นั่นคือ extrapolation ไม่ใช่ spline — ต้องทักในคำตอบ</span></p></> },
  { id: "s2", q: "Linear Spline — สูตร",
    a: <><MB>{`S_i(x)=y_i+\\frac{y_{i+1}-y_i}{x_{i+1}-x_i}\\,(x-x_i),\\qquad x\\in[x_i,\\,x_{i+1}]`}</MB>
        <p style={{margin:0}}>ก็คือ<b>ลากเส้นตรงเชื่อมจุดติดกัน</b> · ต่อเนื่องที่จุดต่อ แต่<b>อนุพันธ์ไม่ต่อเนื่อง</b> (มีหักมุม) ⇒ นี่คือเหตุผลที่ต้องมี quadratic/cubic</p></> },
  { id: "s3", q: "⭐ นับตัวแปรกับเงื่อนไข — Quadratic vs Cubic",
    hint: "ข้อสอบชอบถาม “ต้องตั้งกี่สมการ” ก่อนให้แก้",
    a: <NumTable
        headers={["", "Linear", "Quadratic", "Cubic"]}
        rows={[
          ["รูปแต่ละช่วง", <M>{`a_ix+b_i`}</M>, <M>{`a_ix^2+b_ix+c_i`}</M>, <M>{`a_ix^3+b_ix^2+c_ix+d_i`}</M>],
          ["ตัวแปรรวม (n ช่วง)", "2n", <b>3n</b>, <b>4n</b>],
          ["ผ่านจุดที่ปลายทุกช่วง", "2n", "2n", "2n"],
          [<span>อนุพันธ์ 1 ต่อเนื่องที่จุดใน</span>, "—", "n−1", "n−1"],
          [<span>อนุพันธ์ 2 ต่อเนื่องที่จุดใน</span>, "—", "—", "n−1"],
          ["เงื่อนไขปิดท้าย", "—", <span>สมมติ <M>{`a_1=0`}</M> (ช่วงแรกเป็นเส้นตรง) = 1</span>, <span>natural: <M>{`f''=0`}</M> ที่ปลายทั้งสอง = 2</span>],
        ]}/> },
  { id: "s4", q: "ทำไมต้องมี Spline ทั้งที่มี Interpolation แล้ว",
    a: <p style={{margin:0}}>พหุนามเดียวที่ผ่านทุกจุด พอจุดเยอะดีกรีจะสูงตาม แล้ว<b>แกว่งรุนแรงที่ปลายช่วง</b> (Runge phenomenon) — ค่ากลางจุดอาจเพี้ยนไปไกลมากทั้งที่ผ่านทุกจุดครบ · Spline แก้ด้วยการ<b>ใช้พหุนามดีกรีต่ำหลายตัวต่อกัน</b> แล้วบังคับให้รอยต่อเรียบ ⇒ ได้ทั้งผ่านทุกจุดและไม่แกว่ง</p> },
];

// ────────── ชุดที่ 9 · Least-Squares Regression ──────────
const REG_CARDS = [
  { id: "r1", q: "⭐ Linear Regression — สูตร a₁ a₀ (ท่องให้ขึ้นใจ)",
    a: <><MB>{`a_1=\\frac{n\\sum x_iy_i-\\sum x_i\\sum y_i}{n\\sum x_i^{2}-\\left(\\sum x_i\\right)^{2}}`}</MB>
        <MB>{`a_0=\\bar y-a_1\\bar x=\\frac{\\sum y_i}{n}-a_1\\frac{\\sum x_i}{n}`}</MB>
        <p style={{margin:0}}>ต้องหา <b>4 ผลรวม</b>: <M>{`\\sum x,\\ \\sum y,\\ \\sum xy,\\ \\sum x^2`}</M> · <span style={{color:"var(--yellow)"}}>จุดตาย: <M>{`a_0`}</M> ใช้<b>ค่าเฉลี่ย</b> ไม่ใช่ผลรวมดิบ</span> · เครื่องคิดเลขมีโหมด Statistics หาให้ได้เลย แต่ข้อ “จงแสดงวิธีทำ” ต้องกางตาราง <M>{`\\sum`}</M> ให้เห็น</p></> },
  { id: "r2", q: "วัดว่า fit ดีแค่ไหน — Sr, St, r²",
    a: <><MB>{`S_r=\\sum\\left(y_i-a_0-a_1x_i\\right)^{2}\\qquad S_t=\\sum\\left(y_i-\\bar y\\right)^{2}`}</MB>
        <MB>{`r^{2}=\\frac{S_t-S_r}{S_t}=1-\\frac{S_r}{S_t}\\qquad s_{y/x}=\\sqrt{\\frac{S_r}{n-2}}`}</MB>
        <p style={{margin:0}}><M>{`S_t`}</M> = ความคลาดถ้าใช้แค่ค่าเฉลี่ย · <M>{`S_r`}</M> = ที่ยังเหลือหลัง fit ⇒ <M>{`r^2`}</M> คือ<b>สัดส่วนที่เส้นอธิบายได้</b> · <M>{`r^2=1`}</M> ผ่านทุกจุดพอดี · หาร <M>{`n-2`}</M> เพราะเสีย degree of freedom ไป 2 ตัว (<M>{`a_0,a_1`}</M>)</p></> },
  { id: "r3", q: "Polynomial / Multiple Regression — ตั้งระบบยังไง",
    a: <><p style={{margin:"0 0 6px"}}><b>Polynomial ดีกรี m</b> ⇒ normal equations ขนาด <M>{`(m+1)\\times(m+1)`}</M>:</p>
        <MB>{`\\begin{pmatrix} n & \\sum x & \\sum x^2 \\\\ \\sum x & \\sum x^2 & \\sum x^3 \\\\ \\sum x^2 & \\sum x^3 & \\sum x^4\\end{pmatrix}\\begin{pmatrix}a_0\\\\a_1\\\\a_2\\end{pmatrix}=\\begin{pmatrix}\\sum y\\\\ \\sum xy\\\\ \\sum x^2y\\end{pmatrix}`}</MB>
        <p style={{margin:0}}><b>Multiple</b> <M>{`y=a_0+a_1x_1+a_2x_2`}</M> ⇒ แทน <M>{`x^k`}</M> ด้วย <M>{`x_1,x_2`}</M> โครงเดียวกัน · <b>แก้ระบบด้วย Gauss ที่เรียนไปแล้ว</b> ⇒ ไม่ใช่ของใหม่ · เมทริกซ์<b>สมมาตรเสมอ</b> ⇒ ใช้ Cholesky ได้ด้วย</p></> },
  { id: "r4", q: "⭐ Linearization — 3 รูปที่ออกสอบ + กับดักตอนแปลงกลับ",
    hint: "ข้อสอบชอบซ่อนตรงนี้ — เห็นสมการไม่เป็นเส้นตรงแล้วต้องจัดรูปก่อน",
    a: <><NumTable
          headers={["โมเดล", "จัดรูปเป็น", "plot อะไรกับอะไร"]}
          rows={[
            [<M>{`y=ae^{bx}`}</M>, <M>{`\\ln y=\\ln a+bx`}</M>, <span><M>{`\\ln y`}</M> กับ <M>x</M></span>],
            [<M>{`y=ax^{b}`}</M>, <M>{`\\ln y=\\ln a+b\\ln x`}</M>, <span><M>{`\\ln y`}</M> กับ <M>{`\\ln x`}</M></span>],
            [<M>{`y=\\dfrac{ax}{b+x}`}</M>, <M>{`\\dfrac{1}{y}=\\dfrac{1}{a}+\\dfrac{b}{a}\\cdot\\dfrac{1}{x}`}</M>, <span><M>{`1/y`}</M> กับ <M>{`1/x`}</M></span>],
          ]}/>
        <Callout kind="danger" title="⚠︎ กับดักอันดับ 1 — ลืมแปลงกลับ">
          <p style={{margin:0}}>fit แล้วได้ <M>{`c_0`}</M> กับ <M>b</M> จากระบบเชิงเส้น · <b><M>{`c_0`}</M> ไม่ใช่คำตอบ</b> ต้อง <M>{`a=e^{c_0}`}</M> ก่อน (ถ้าใช้ log ฐาน 10 ก็ <M>{`a=10^{c_0}`}</M>) · <M>b</M> ใช้ได้ตรง ๆ ไม่ต้องแปลง · <b>ตรวจเสมอ: แทน x ตัวหนึ่งกลับเข้าโมเดลเดิม ต้องได้ y ใกล้ของจริง</b></p>
        </Callout></> },
];

// ────────── ชุดที่ 10 · กฎห้องสอบ + ค่ากดเครื่อง ──────────
const RULE_CARDS = [
  { id: "g1", q: "กฎ 5 ข้อที่ทำให้เสียคะแนนฟรี ⭐", hint: "ท่องให้ขึ้นใจ ทุกข้อมาจากปากอาจารย์",
    a: <ol style={{margin:0, paddingLeft:20, lineHeight:1.8}}>
        <li><b>ตรวจแค่คำตอบสุดท้าย ผิด = 0</b> ไม่มีคะแนนขั้นตอน</li>
        <li><b>ห้ามตอบเศษส่วน</b> — “ตอบ 5 ส่วน 2 ผมไม่คิดให้”</li>
        <li><b>ข้อที่เขียนว่า “จงแสดงวิธีทำ” ต้องกางวิธี</b> — กดเครื่องแล้วเขียนแต่คำตอบ = 0</li>
        <li><b>แทนค่ากลับตรวจทุกครั้ง</b> — วิธีเดียวที่รู้ว่าถูกจริง</li>
        <li><b>ห้ามคำนวณต่อจากเลขที่ปัดแล้ว</b> — เดินต่อด้วย Ans + Replay (◀ EXE) หรือเก็บลงตัวแปร VARIABLE▸[x=]▸Store</li>
      </ol> },
  { id: "g2", q: "เกมแพลน 180 นาที — ทำอะไรตอนไหน",
    a: <NumTable
        headers={["เวลา", "ทำอะไร"]}
        rows={[
          ["0–10", "อ่านครบ 6 ข้อ · ชี้ตัว “ข้อวัดสมอง” แล้วกาไว้ว่าจะทิ้ง"],
          ["10–60", "เก็บข้อเขียนโค้ดก่อน (~3 ข้อ = 45 คะแนน)"],
          ["60–150", "ข้อคำนวณมือที่เป็น “ข้อวัดพลัง”"],
          ["150–175", "ตรวจซ้ำ 5 ข้อที่ทำแล้ว — ไม่ใช่เริ่มข้อที่ 6"],
          ["175–180", "เช็คว่าแปลงเศษส่วนเป็นทศนิยมครบทุกข้อ"],
        ]}/> },
  { id: "g3", q: "ค่าที่ควรกดได้ใน 3 วินาที (ไว้ sanity-check)",
    a: <><NumTable
        headers={["กด", "ได้", "กด", "ได้"]}
        rows={[
          ["e¹", "2.718282", "ln 2", "0.693147"],
          ["e⁻¹", "0.367879", "ln 10", "2.302585"],
          ["√2", "1.414214", "sin 1 (Rad)", "0.841471"],
          ["√7", "2.645751", "cos 1 (Rad)", "0.540302"],
        ]}/>
      <Callout kind="danger" title="ตั้ง Rad ก่อนเสมอถ้ามี sin/cos">
        <p style={{margin:0}}>ถ้าเครื่องอยู่ Deg แล้วกด sin(1) จะได้ <b>0.017452</b> แทน 0.841471 ⇒ <b>ผิดทั้งข้อตั้งแต่บรรทัดแรก</b></p>
      </Callout></> },
  { id: "g4", q: "กรอบ 3 ขั้นของ open method (อาจารย์สั่งให้จด)",
    a: <ol style={{margin:0, paddingLeft:20, lineHeight:1.9}}>
        <li><b>Initial Value</b> — ค่าเริ่ม (Secant มี 2 ตัว)</li>
        <li><b>Iteration Form</b> — สูตรวนซ้ำ</li>
        <li><b>เงื่อนไขการหยุด</b> — <M>{`|\\Delta x|<tol`}</M></li>
      </ol> },
];

function MemorizeLesson() {
  return (
    <div>
      <Hero
        kicker="🧠 ท่องก่อนสอบ"
        title="ทุกอย่างที่ต้องจำ — อยู่หน้าเดียว"
        lead="ชุดที่ 6–9 คือขอบเขตไฟนอลทั้งหมด (Linear 6 วิธีที่เหลือ · Interpolation · Spline · Regression) · ชุด 1–5 เป็นของมิดเทอมไว้ทวน · เห็นแค่คำถามก่อน กดแล้วค่อยเฉลย แล้วกดว่าจำได้/ยังไม่ได้ — รอบต่อไปเหลือแต่ใบที่ยังไม่แม่น"
        readout={{
          label: "ไม่ต้องเปิดบทอื่นเลย · เปิดหน้านี้หน้าเดียว",
          steps: [
            { x: "ชุด 6–9 · ไฟนอล", w: 44 },
            { x: "ชุด 1–5 · มิด (ไว้ทวน)", w: 40 },
            { x: "ชุด 10 · กฎห้องสอบ", w: 16 },
          ],
          result: "58",
          note: "ใบทั้งหมด — ท่องวันละ 10 นาทีทุกวันจนถึง 26 ต.ค. คือข้อ “ห้ามตัด” ในแผน",
        }}
        meta={["การ์ดพลิก", "กรองเฉพาะที่ยังไม่ได้", "จำสถานะไว้ในเครื่อง", "58 ใบ · 10 ชุด"]}
      />

      <Callout kind="good" title="📍 ที่มาของทุกใบ — ไม่มีอะไรเกินขอบเขต">
        <NumTable
          headers={["ชุด", "จำนวน", "มาจากไหน"]}
          rows={[
            ["1 · โค้ด 6 โครง", "6 ใบ", "อาจารย์บอกเอง “มีโค้ดครึ่งหนึ่ง” = ~45 คะแนน · ครบทั้ง 4 บท"],
            ["2 · Integration", "6 ใบ", "สรุป Final น.20–21 (ปีนี้ย้ายมาเป็นบทแรก)"],
            ["3 · Differentiation", "6 ใบ", "สรุป Final น.22–25 · ตาราง 24 สูตรครบตามที่อาจารย์นับ"],
            ["4 · Root Finding", "11 ใบ", "ติว mid น.1–7 (graphical → secant + Taylor) + ใบจัด g(x) จากคาบ 5 ส.ค."],
            ["5 · Linear (Cramer/Gauss)", "5 ใบ", "ใบจากตอนติวมิด — Cramer ออกมิดไปแล้ว · Gauss ย้ายไปไฟนอล"],
            [<b>6 · Linear 6 วิธีที่เหลือ ⭐</b>, "8 ใบ", <span><code>การบ้าน6-7.pdf</code> ข้อ 1.3–1.8 · kim ยืนยันว่าอาจารย์รวมใบนี้เข้าไฟนอล</span>],
            [<b>7 · Interpolation ⭐</b>, "6 ใบ", <span><code>uploads/INTERPOLATION I–II.pdf</code> + สรุป Final</span>],
            [<b>8 · Spline ⭐</b>, "4 ใบ", <span><code>uploads/SPLINE_regression.pdf</code></span>],
            [<b>9 · Regression ⭐</b>, "4 ใบ", <span><code>uploads/SPLINE_regression.pdf</code> + <code>MultipleLinear_Integration.pdf</code></span>],
            ["10 · กฎห้องสอบ", "4 ใบ", "ถอดจากไฟล์เสียงคาบ 5 + 8 ส.ค."],
          ]}
        />
        <p style={{margin:"8px 0 0", fontSize:'0.84rem'}}><b>สถานะ 9 ก.ย. 2569:</b> เติมชุด <b>6–9 ครบแล้ว</b> = ขอบเขตไฟนอลทั้งหมด · <b>ชุด 1–5 เป็นของมิดเทอม</b> (สอบไปแล้ว) แต่ยังเก็บไว้เพราะอาจารย์ชอบต่อสองบทในข้อเดียว · <b>1 ต.ค.:</b> เพิ่มการ์ด n7 (Conjugate Gradient · การบ้าน 8) กับ p5 (divided difference 3 แบบ · การบ้าน 9)</p>
      </Callout>

      <Callout kind="tip" title="วิธีใช้ให้ได้ผลจริง — อย่าแค่ “อ่านผ่าน”">
        <ol style={{margin:0, paddingLeft:20}}>
          <li>อ่านคำถามบนการ์ด → <b>เขียนคำตอบลงกระดาษเปล่าก่อน</b> อย่าเพิ่งกด</li>
          <li>กดดูเฉลย → ถ้าตรง กด <b>“✓ จำได้”</b> · ถ้าไม่ตรงแม้แต่นิดเดียว กด <b>“✗ ยังไม่ได้”</b> (อย่าเข้าข้างตัวเอง — ในห้องสอบผิดนิดเดียวก็ 0)</li>
          <li>จบรอบแล้วกด <b>“เฉพาะที่ยังไม่ได้”</b> → ท่องซ้ำเฉพาะที่เหลือ</li>
          <li><b>พรุ่งนี้กลับมาทำใหม่ทั้งชุด</b> — การท่องซ้ำวันเว้นวันจำได้ยาวกว่าท่องรวดเดียว 3 ชั่วโมง</li>
        </ol>
      </Callout>

      <Callout kind="good" title="⭐ ถ้าเวลาน้อย — ลำดับที่ควรท่องสำหรับไฟนอล">
        <NumTable
          headers={["ลำดับ", "ท่องชุดไหน", "ทำไมอยู่ตรงนี้"]}
          rows={[
            ["1", <span><b>ชุดที่ 6</b> · Linear 6 วิธีที่เหลือ</span>, <span>การบ้าน 6-7 สั่งครบ ⇒ เป็นของที่<b>ออกแน่ที่สุด</b> · ใบ n5 (Jacobi vs GS) กับ n6 (กับดักลู่ออก) คุ้มที่สุด</span>],
            ["2", <span><b>ชุดที่ 9</b> · Regression</span>, <span>สูตร <M>{`a_1,a_0`}</M> ท่องได้ใน 10 นาที แล้วได้ทั้งข้อทำมือและข้อโค้ด · ใบ r4 Linearization คือจุดที่ข้อสอบชอบซ่อน</span>],
            ["3", <span><b>ชุดที่ 7</b> · Interpolation</span>, <span>ใบ p3 มี <M>h</M> — ตัวที่ทำให้พลาดข้อ Diff จรวดในมิดเทอม</span>],
            ["4", <span><b>ชุดที่ 8</b> · Spline</span>, <span>ใบ s1 (หา segment ก่อน) + s3 (นับตัวแปร 3n / 4n) พอสำหรับข้อสอบแล้ว</span>],
            ["5", <span><b>ชุดที่ 10</b> · กฎห้องสอบ</span>, "กันเสียคะแนนฟรีในข้อที่ทำถูกแล้ว — ห้ามเศษส่วน · ผิด=0 · แทนกลับตรวจ"],
            ["6", <span className="muted"><b>ชุดที่ 1–5</b> · ของมิดเทอม</span>, <span className="muted">กวาดสัปดาห์ละครั้ง — เผื่อโผล่มาเป็นครึ่งหนึ่งของโจทย์ผสม</span>],
          ]}
        />
        <p style={{margin:"8px 0 0", fontSize:'0.84rem'}}>ลำดับนี้เรียงตาม <b>คะแนนต่อเวลาที่ลง</b> ไม่ใช่ตามลำดับบท · แผนรายสัปดาห์เต็มอยู่ที่หน้า <a href="#plan">แผนเตรียมไฟนอล</a></p>
      </Callout>

      <Callout kind="tip" title="“โค้ด = สูตรทำมือที่ห่อด้วยลูป” — ท่องทีเดียวได้สองอย่าง">
        <p style={{margin:"0 0 6px"}}>จำสูตร Gauss ทำมือได้ = ได้โครง E ฟรี · จำสูตร Jacobi ได้ = ได้โครง J ฟรี · ส่วนที่เพิ่มมาสำหรับข้อโค้ดมีแค่ 3 บรรทัด: <code>while err &gt; tol</code> · บรรทัดอัปเดตตัวแปร · <code>print</code> ทุกรอบ</p>
        <p style={{margin:0}}>⇒ <b>ไล่เป็นบท ไม่ใช่ไล่เป็นครึ่ง</b> — ท่องสูตรบทไหนเสร็จ ให้ไปเขียนโครงโค้ดของบทนั้นที่หน้า <a href="#code">เขียนโค้ดจากหัว</a> ต่อทันทีตอนสูตรยังอยู่ในหัว · ถ้าต้องเลือกจริง ๆ <b>ข้อโค้ดคุ้มกว่า</b> เพราะไม่มีเลขให้ปัดพลาด เขียนถูกก็ได้เต็ม</p>
      </Callout>

      <Deck id="code" title="ชุดที่ 1 · โค้ด 6 โครง ครบทั้ง 4 บท — 45 คะแนนมาจากตรงนี้"
        subtitle="เรียงตามลำดับบท: ① Integration → ② Differentiation → ③④⑤ Root Finding → ⑥ Linear · เขียนลงกระดาษเปล่าให้ได้ทั้งบล็อก ไม่ใช่แค่จำว่ามีลูป — รวมคอมเมนต์ ① ② ③ ด้วย เพราะอาจารย์สั่งให้เขียนกรอบ 3 ขั้น"
        cards={CODE_CARDS}/>

      <Deck id="int" title="ชุดที่ 2 · Integration — 4 สูตร"
        subtitle="บทที่อาจารย์บอกเองว่าง่ายที่สุด ⇒ ห้ามพลาด" cards={INT_CARDS}/>

      <Callout kind="warn" title="⚠︎ ชุด Differentiation — ท่องจริงแค่ 2 แถว ไม่ใช่ 24 สูตร">
        <p style={{margin:"0 0 6px"}}>ไล่ดูแบบฝึกหัดกับการบ้านจริงแล้วพบว่า:</p>
        <NumTable
          headers={["ถามอะไร", "อยู่ในใบไหน", "ต้องท่องมั้ย"]}
          rows={[
            [<b>f′ · forward/backward O(h) · central O(h²)</b>, "แบบฝึกหัด 2 ข้อ 1–2", "🔴 ท่องให้ขึ้นใจ"],
            [<b>f″ · forward/backward O(h²) · central O(h⁴)</b>, "การบ้าน 3 ข้อ 2", "🔴 ท่องให้ขึ้นใจ"],
            [<span>พิสูจน์ว่าทำไม backward เป็น O(h) · central เป็น O(h²)</span>, "แบบฝึกหัด 2 ข้อ 3", "🔴 ดูใบ Taylor"],
            ["f‴ และ f⁗", <b>ไม่เคยถูกถามเลย</b>, "⬜ แค่รู้ว่ามีในตาราง"],
          ]}
        />
        <p style={{margin:"8px 0 0"}}>⇒ ในตาราง 2 ใบข้างล่าง <b>ท่องแค่ 2 แถวบน (f′ กับ f″)</b> · แถว f‴/f⁗ เก็บไว้เผื่อเจอ แต่<b>อย่าเสียเวลาท่อง</b> · <b>ใบ ⭐ “6 สูตรที่ต้องปิดตาเขียนให้ได้” คัดมาให้แล้วว่าคือตัวไหนบ้าง — ถ้ามีเวลาน้อยให้เปิดใบนั้นใบเดียว</b></p>
      </Callout>

      <Deck id="dif" title="ชุดที่ 3 · Differentiation — เน้น f′ กับ f″"
        subtitle="ตาราง 2 ใบแรกมีครบ 24 สูตร แต่ท่องจริงแค่ 2 แถวบนของแต่ละตาราง" cards={DIF_CARDS}/>

      <Deck id="root" title="ชุดที่ 4 · Root Finding — 6 วิธี + กติกาเดินตาราง"
        subtitle="บทที่ใหญ่ที่สุดและมีวิธีเยอะสุด — ใบ ε / รอบทำทิ้ง / tol คือกติกาที่ทำให้ตารางไม่หลุด · ใบ ⭐ One-point คือจุดที่คนพลาดมากสุด" cards={ROOT_CARDS}/>

      <Deck id="lin" title="ชุดที่ 5 · Linear Systems — ใบ Cramer/Gauss (จากตอนติวมิด)"
        subtitle="⚠︎ ขอบเขตกลับด้านแล้ว — kim ยืนยัน 9 ก.ย. ว่ามิดออก Linear แค่ Cramer อย่างเดียว ⇒ Gauss Elimination · Gauss-Jordan · Inversion · LU · Cholesky · Jacobi · Gauss-Seidel ทั้ง 7 ตัวคือของไฟนอล (การบ้าน 6-7 ข้อ 1.2–1.8) · ชุดนี้ยังเป็นใบเก่าจากตอนติวมิด — ชุดไฟนอลเต็มอยู่ที่บท Linear หมวด 9 และหน้า #cheat 01" cards={LIN_CARDS}/>

      <Callout kind="good" title="⭐ ชุดที่ 6–9 คือของไฟนอลล้วน — เพิ่ม 9 ก.ย. 2569">
        <p style={{margin:"0 0 6px"}}>ชุดที่ 1–5 ข้างบนเป็นใบที่ทำไว้ตอนติวมิดเทอม · <b>ยังมีค่า</b> เพราะข้อสอบมิดพิสูจน์แล้วว่าอาจารย์ชอบต่อสองบท — แต่<b>ของที่ออกไฟนอลจริง ๆ อยู่ในชุด 6–9 ข้างล่างนี้</b></p>
        <p style={{margin:0}}>ถ้าเวลาน้อย <b>ท่องชุด 6 ก่อนเสมอ</b> — Linear 6 วิธีที่เหลือมาจาก <code>การบ้าน6-7.pdf</code> ข้อ 1.3–1.8 ที่อาจารย์บอกเองว่ารวมเข้าไฟนอล</p>
      </Callout>

      <Deck id="lin2" title="ชุดที่ 6 · Linear 6 วิธีที่เหลือ — ⭐ ของไฟนอลล้วน"
        subtitle="Gauss-Jordan · Matrix Inversion · LU · Cholesky · Jacobi · Gauss-Seidel (การบ้าน 6-7 ข้อ 1.3–1.8) · ใบ n5 กับ n6 คือสองใบที่คุ้มที่สุด — บรรทัดเดียวที่แยก Jacobi กับ Gauss-Seidel และกับดักลู่ออก" cards={LIN2_CARDS}/>

      <Deck id="interp" title="ชุดที่ 7 · Interpolation"
        subtitle="คำถามแรกเสมอคือ “จุดห่างเท่ากันหรือเปล่า” · ใบ ⭐ p3 มี h ซึ่งเป็นตัวที่พลาดในมิดเทอม — h ทุกบทคือระยะห่าง" cards={INTERP_CARDS}/>

      <Deck id="spline" title="ชุดที่ 8 · Spline"
        subtitle="ใบ s1 สำคัญที่สุด: ต้องหา segment ก่อนแทนสูตรเสมอ — ตระกูลเดียวกับข้อ “เลือกช่วง bisection” ที่พลาดในมิด" cards={SPLINE_CARDS}/>

      <Deck id="reg" title="ชุดที่ 9 · Least-Squares Regression"
        subtitle="ใบ r1 (สูตร a₁ a₀) กับ r4 (Linearization) คือสองใบที่ออกสอบแน่ — r4 คือจุดที่ข้อสอบชอบซ่อน" cards={REG_CARDS}/>

      <Deck id="rule" title="ชุดที่ 10 · กฎห้องสอบ + ค่ากดเครื่อง"
        subtitle="ชุดนี้ไม่ใช่เนื้อหา แต่เป็นตัวกันเสียคะแนนฟรี — ท่องพร้อมกับสูตร" cards={RULE_CARDS}/>
    </div>
  );
}

window.MemorizeLesson = MemorizeLesson;
