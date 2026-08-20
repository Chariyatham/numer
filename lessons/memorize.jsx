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

// ────────── ชุดที่ 6 · กฎห้องสอบ + ค่ากดเครื่อง ──────────
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
        lead="สูตรครบ 4 บท + โค้ดครบ 4 บท (6 โครง) + กฎห้องสอบ · เห็นแค่คำถามก่อน กดแล้วค่อยเฉลย แล้วกดว่าจำได้/ยังไม่ได้ — รอบต่อไปเหลือแต่ใบที่ยังไม่แม่น"
        readout={{
          label: "ไม่ต้องเปิดบทอื่นเลย · เปิดหน้านี้หน้าเดียว",
          steps: [
            { x: "โค้ด 6 โครง · 4 บท", w: 30 },
            { x: "สูตร 4 บท", w: 50 },
            { x: "กฎ + ค่ากดเครื่อง", w: 20 },
          ],
          result: "38",
          note: "ใบทั้งหมด — ท่องวันละ 10–15 นาที ทุกวันจนถึงวันสอบ",
        }}
        meta={["การ์ดพลิก", "กรองเฉพาะที่ยังไม่ได้", "จำสถานะไว้ในเครื่อง", "โค้ดเต็มไม่ใช่แค่โครง"]}
      />

      <Callout kind="good" title="📍 ที่มาของทุกใบ — ไม่มีอะไรเกินขอบเขต">
        <NumTable
          headers={["ชุด", "จำนวน", "มาจากไหน"]}
          rows={[
            ["1 · โค้ด 6 โครง", "6 ใบ", "อาจารย์บอกเอง “มีโค้ดครึ่งหนึ่ง” = ~45 คะแนน · ครบทั้ง 4 บท"],
            ["2 · Integration", "6 ใบ", "สรุป Final น.20–21 (ปีนี้ย้ายมาเป็นบทแรก)"],
            ["3 · Differentiation", "6 ใบ", "สรุป Final น.22–25 · ตาราง 24 สูตรครบตามที่อาจารย์นับ"],
            ["4 · Root Finding", "11 ใบ", "ติว mid น.1–7 (graphical → secant + Taylor) + ใบจัด g(x) จากคาบ 5 ส.ค."],
            ["5 · Linear", "5 ใบ", "อาจารย์บอกเองว่าออกถึง Cramer + Gauss (เท่ากัน/ไม่เท่ากัน) เท่านั้น"],
            ["6 · กฎห้องสอบ", "4 ใบ", "ถอดจากไฟล์เสียงคาบ 5 + 8 ส.ค."],
          ]}
        />
        <p style={{margin:"8px 0 0", fontSize:'0.84rem'}}><b>ตัดออกแล้ว:</b> Gauss-Jordan · Matrix Inversion · LU · Cholesky (อาจารย์บอกว่าออกถึงแค่ Cramer/Gauss — รวมใบ “ทั้ง 6 วิธีบนระบบเดียวกัน” ที่ตัดออก 16 ส.ค.) · Jacobi · Gauss-Seidel · Conjugate Gradient · Interpolation · Spline · Regression · Romberg · Gauss-Legendre · Richardson — ทั้งหมดอยู่ใน “สรุป Final” ส่วนที่เป็น<b>เนื้อหาหลังมิดเทอม</b> หรือไม่ปรากฏในไฟล์เสียงเลย</p>
      </Callout>

      <Callout kind="tip" title="วิธีใช้ให้ได้ผลจริง — อย่าแค่ “อ่านผ่าน”">
        <ol style={{margin:0, paddingLeft:20}}>
          <li>อ่านคำถามบนการ์ด → <b>เขียนคำตอบลงกระดาษเปล่าก่อน</b> อย่าเพิ่งกด</li>
          <li>กดดูเฉลย → ถ้าตรง กด <b>“✓ จำได้”</b> · ถ้าไม่ตรงแม้แต่นิดเดียว กด <b>“✗ ยังไม่ได้”</b> (อย่าเข้าข้างตัวเอง — ในห้องสอบผิดนิดเดียวก็ 0)</li>
          <li>จบรอบแล้วกด <b>“เฉพาะที่ยังไม่ได้”</b> → ท่องซ้ำเฉพาะที่เหลือ</li>
          <li><b>พรุ่งนี้กลับมาทำใหม่ทั้งชุด</b> — การท่องซ้ำวันเว้นวันจำได้ยาวกว่าท่องรวดเดียว 3 ชั่วโมง</li>
        </ol>
      </Callout>

      <Callout kind="good" title="✅ โค้ดครบทั้ง 4 บทแล้ว — ไม่ต้องหาเพิ่ม">
        <p style={{margin:"0 0 8px"}}>ชื่อโครงเป็นตัวอักษร A–E เลยดูเหมือนมาจากบทเดียว จริง ๆ <b>6 โครงนี้กระจายครบทุกบทที่อยู่ในขอบเขต</b> — Integration ก็มีโค้ด (โครง C) · Differentiation ก็มี (โครง D)</p>
        <NumTable
          headers={["บท", "โครงที่ต้องเขียนได้", "หน้าตา", "เวลาท่อง", "ถ้าเวลาไม่พอ"]}
          rows={[
            ["① Integration", "โครง C", "ลูปเดียว บวกน้ำหนัก 1-2-2-1 / 1-4-2-4-1", "~20 นาที", "🔴 ห้ามข้าม"],
            ["② Differentiation", "โครง D", <b>ไม่มีลูปเลย แทนค่าตรง ๆ</b>, "~10 นาที", "🔴 ถูกที่สุดในข้อสอบ"],
            ["③ Root Finding", "โครง A · B · B′", "while True → สูตร → เช็คหยุด (โครงเดียวกันทั้ง 3)", "~60 นาที", "🔴 บทที่กินข้อสอบเยอะสุด"],
            ["④ Linear Systems", "โครง E (+ E′)", "ลูปซ้อน หนักสุดใน 6 ตัว", "~40 นาที", "⚠︎ ไม่ทัน → เขียน E′ Cramer แทน (สั้นกว่ามาก)"],
          ]}
        />
      </Callout>

      <Callout kind="tip" title="“เอาทำมือครึ่งให้ได้ก่อน” — ไม่ต้องเลือก เพราะมันคือสูตรตัวเดียวกัน">
        <p style={{margin:"0 0 6px"}}><b>โค้ด = สูตรทำมือที่ห่อด้วยลูป</b> · จำสูตร Composite Simpson ได้ = ได้ทั้งข้อทำมือ<b>และ</b>โครง C ฟรี · ส่วนที่เพิ่มมาสำหรับข้อโค้ดมีแค่ 3 บรรทัด: <code>while True</code> · เงื่อนไขหยุด · อัปเดตตัวแปร</p>
        <p style={{margin:"0 0 6px"}}>⇒ <b>ไล่เป็นบท ไม่ใช่ไล่เป็นครึ่ง</b> — ท่องสูตรบทไหนเสร็จ ให้เขียนโค้ดของบทนั้นต่อทันทีตอนสูตรยังอยู่ในหัว</p>
        <p style={{margin:0}}>ถ้าต้องเลือกจริง ๆ <b>ข้อโค้ดคุ้มกว่า</b>: อาจารย์ตรวจแค่คำตอบ ผิด = 0 ⇒ ข้อทำมือหลุดได้จากปัดเลข เครื่องหมาย หรือใช้ ε ผิดนิยาม แต่<b>ข้อโค้ดไม่มีเลขให้พลาด เขียนถูกก็ได้เต็ม</b></p>
      </Callout>

      <Callout kind="warn" title="⏱ ถ้าเหลือ 10 ชั่วโมง — ลำดับที่ควรเดิน">
        <NumTable
          headers={["ชม.", "ทำอะไร", "ทำไมอยู่ตรงนี้"]}
          rows={[
            ["0–1", "Integration: 4 สูตร + โครง C", "บทที่คุ้นสุด กวาดจบเร็ว เอาความมั่นใจ"],
            ["1–3", "Differentiation: 6 สูตร (ใบ ⭐) + โครง D", "โครง D ไม่มีลูป = โค้ดที่ถูกที่สุดในข้อสอบ"],
            ["3–6", "Root: A · B · B′ + ใบ One-point เจาะพิเศษ", "บทที่กินข้อสอบเยอะสุด และเป็นจุดที่ยังไม่ชิน"],
            ["6–8", "Linear: ใบ Gauss ทำมือ 4 ก้าว + โครง E", "จุดที่ยังไม่ชินอันที่สอง"],
            ["8–9.5", "กระดาษเปล่า เขียน 6 โครงรวดโดยไม่เปิดดู", "เขียนไม่ออก = ยังไม่ได้จำ ไม่ใช่ “พอไหว”"],
            ["9.5–10", "ชุดที่ 6 · กฎห้องสอบ + ห้ามตอบเศษส่วน + ε ≠ tol", "กันเสียคะแนนฟรีในข้อที่ทำถูกแล้ว"],
          ]}
        />
        <p style={{margin:"8px 0 0", fontSize:'0.84rem'}}>จัดตามที่ kim บอกเอง 20 ส.ค.: <b>ไม่ชิน Differentiation, Root (โดยเฉพาะ One-point) และ Gauss Elimination</b> ⇒ 2 ช่วงกลางจึงยาวกว่าเพื่อน</p>
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

      <Deck id="lin" title="ชุดที่ 5 · Linear Systems"
        subtitle="อาจารย์บอกเองว่าออกถึงแค่ Cramer กับ Gauss — Jordan/Inversion/LU/Cholesky ตัดออกแล้ว · ใบ ⭐ Gauss ทำมือ มี 4 ก้าวให้ท่องเป็นลำดับ" cards={LIN_CARDS}/>

      <Deck id="rule" title="ชุดที่ 6 · กฎห้องสอบ + ค่ากดเครื่อง"
        subtitle="ชุดนี้ไม่ใช่เนื้อหา แต่เป็นตัวกันเสียคะแนนฟรี — ท่องพร้อมกับสูตร" cards={RULE_CARDS}/>
    </div>
  );
}

window.MemorizeLesson = MemorizeLesson;
