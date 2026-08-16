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

// ────────── ชุดที่ 1 · โค้ด 5 โครง (45 คะแนนของข้อสอบมาจากตรงนี้) ──────────
const CODE_CARDS = [
  { id: "A", q: "โครง A · Bracketing — Bisection & False Position",
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
  { id: "B", q: "โครง B · Open Method — One-point & Newton",
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
  { id: "B2", q: "โครง B′ · Secant",
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
  { id: "C", q: "โครง C · Summation — Composite Trapezoidal & Simpson",
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
  { id: "D", q: "โครง D · Finite Difference — ไม่มีลูปเลย",
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
  { id: "d0", q: "3 สูตรที่ต้องได้ก่อนเพื่อน — ปิดตาเขียนให้ได้",
    hint: "ออกบ่อยที่สุด · ที่เหลือดูจากตาราง 2 ใบข้างบน",
    a: <><MB>{`f'_{fwd}=\\frac{f_{i+1}-f_i}{h}\\qquad f'_{bwd}=\\frac{f_i-f_{i-1}}{h}`}</MB>
      <MB>{`f'_{ctr}=\\frac{f_{i+1}-f_{i-1}}{2h}\\qquad f''_{ctr}=\\frac{f_{i+1}-2f_i+f_{i-1}}{h^2}`}</MB>
      <p style={{margin:0}}>central แม่นกว่าเพราะ error สองข้าง<b>หักล้างกัน</b> ⇒ ถ้าโจทย์ไม่บังคับให้เลือก central เสมอ</p></> },
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
      <MB>{`f(x_i)\\cdot f(x_{i+1})<0\;\\Rightarrow\;\\text{มีรากระหว่าง } x_i \\text{ กับ } x_{i+1}`}</MB>
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
  { id: "l5", q: "ทั้ง 6 วิธีบนระบบเดียวกัน — ของแถมที่ทำให้ประหยัดแรง ⭐",
    hint: "ถ้าข้อสอบสั่งวิธีที่เราไม่แม่น ใบนี้ช่วยได้",
    a: <>
      <p style={{margin:"0 0 6px"}}>ระบบตัวอย่างในบท: <M>{`-2x_1+3x_2+x_3=9,\ 3x_1+4x_2-5x_3=0,\ x_1-2x_2+x_3=-4`}</M> ⇒ <b>ทุกวิธีลงที่ <M>{`(-1,\,2,\,1)`}</M> เหมือนกันหมด</b></p>
      <ul style={{margin:0, paddingLeft:18, lineHeight:1.8}}>
        <li><b>ทำ Gauss เสร็จ = ได้ LU ฟรี</b> — <M>L</M> คือตัวคูณ <M>{`m_{ij}`}</M> ที่ใช้กำจัด · <M>U</M> คือเมทริกซ์สามเหลี่ยมบนที่ได้ตอนจบ</li>
        <li><b>ผลคูณตัวหลักหลัง Gauss = det A</b> ⇒ เอาไปตรวจข้อ Cramer ได้ฟรี</li>
        <li><b>Gauss-Jordan = Gauss ที่ทำต่อ</b> จนได้ <M>I</M> ⇒ อ่านคำตอบจากคอลัมน์ขวาเลย ไม่ต้อง back-substitution</li>
        <li><b>Matrix Inversion = Gauss-Jordan บน <M>{`[A\,|\,I]`}</M></b> ⇒ ทุกช่องของ <M>{`A^{-1}`}</M> มีตัวส่วนเป็น det A</li>
      </ul>
      <p style={{margin:"6px 0 0"}}>⇒ <b>จริง ๆ ต้องแม่นแค่ Gauss วิธีเดียว</b> อีก 3 วิธีต่อยอดจากมันหมด</p>
    </> },
  { id: "l6", q: "Cholesky กับเมทริกซ์ที่ไม่สมมาตร — ทำยังไง",
    hint: "กับดักของใบงาน",
    a: <>
      <p style={{margin:"0 0 6px"}}>Cholesky ต้องการเมทริกซ์<b>สมมาตร</b> · ถ้า <M>{`A\neq A^T`}</M> ให้คูณ <M>{`A^T`}</M> ทั้งสองข้าง:</p>
      <MB>{`A^TA\,x=A^Tb`}</MB>
      <p style={{margin:0}}><M>{`A^TA`}</M> <b>สมมาตรเสมอ</b> และ positive definite เมื่อ <M>{`\det A\neq0`}</M> ⇒ ใช้ Cholesky ได้ · <b>ต้องไล่เช็คสมมาตรให้ครบทุกคู่</b> — เมทริกซ์ในใบงานมี 2 ใน 3 คู่ที่ตรงกัน หลอกตามาก</p>
    </> },
  { id: "l4", q: "เมทริกซ์ไม่จัตุรัส (สมการ ≠ ตัวแปร) → อ่านผลยังไง",
    a: <NumTable
        headers={["แถวสุดท้ายหลังทำ Gauss", "แปลว่า"]}
        rows={[
          [<M>{`[\\,0\\ 0\\ 0\\,|\\,c\\neq0\\,]`}</M>, "ไม่มีคำตอบ"],
          [<M>{`[\\,0\\ 0\\ 0\\,|\\,0\\,]`}</M>, "มีคำตอบไม่จำกัด (มีตัวแปรอิสระ)"],
          ["มีตัวหลักครบทุกคอลัมน์", "คำตอบเดียว"],
        ]}/> },
  { id: "l7", q: "LU Decomposition (Doolittle) — สูตรหา L, U",
    a: <><MB>{`u_{ij}=a_{ij}-\\sum_{k<i}l_{ik}u_{kj}\\qquad l_{ji}=\\frac{a_{ji}-\\sum_{k<i}l_{jk}u_{ki}}{u_{ii}}`}</MB>
      <p style={{margin:"4px 0 0"}}>Doolittle: <M>{`l_{ii}=1`}</M> · แก้ 2 ต่อ: <b>① Ly = b</b> (forward) → <b>② Ux = y</b> (backward)</p></> },
];

// ────────── ชุดที่ 6 · กฎห้องสอบ + ค่ากดเครื่อง ──────────
const RULE_CARDS = [
  { id: "g1", q: "กฎ 5 ข้อที่ทำให้เสียคะแนนฟรี ⭐", hint: "ท่องให้ขึ้นใจ ทุกข้อมาจากปากอาจารย์",
    a: <ol style={{margin:0, paddingLeft:20, lineHeight:1.8}}>
        <li><b>ตรวจแค่คำตอบสุดท้าย ผิด = 0</b> ไม่มีคะแนนขั้นตอน</li>
        <li><b>ห้ามตอบเศษส่วน</b> — “ตอบ 5 ส่วน 2 ผมไม่คิดให้”</li>
        <li><b>ข้อที่เขียนว่า “จงแสดงวิธีทำ” ต้องกางวิธี</b> — กดเครื่องแล้วเขียนแต่คำตอบ = 0</li>
        <li><b>แทนค่ากลับตรวจทุกครั้ง</b> — วิธีเดียวที่รู้ว่าถูกจริง</li>
        <li><b>ห้ามคำนวณต่อจากเลขที่ปัดแล้ว</b> — เดินต่อด้วย Ans / STO / ↑=</li>
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
        lead="สูตรทุกบท + โค้ดครบ 5 โครง + กฎห้องสอบ · เห็นแค่คำถามก่อน กดแล้วค่อยเฉลย แล้วกดว่าจำได้/ยังไม่ได้ — รอบต่อไปเหลือแต่ใบที่ยังไม่แม่น"
        readout={{
          label: "ไม่ต้องเปิดบทอื่นเลย · เปิดหน้านี้หน้าเดียว",
          steps: [
            { x: "โค้ด 5 โครง", w: 30 },
            { x: "สูตร 4 บท", w: 50 },
            { x: "กฎ + ค่ากดเครื่อง", w: 20 },
          ],
          result: "28",
          note: "ใบทั้งหมด — ท่องวันละ 10–15 นาที ทุกวันจนถึงวันสอบ",
        }}
        meta={["การ์ดพลิก", "กรองเฉพาะที่ยังไม่ได้", "จำสถานะไว้ในเครื่อง", "โค้ดเต็มไม่ใช่แค่โครง"]}
      />

      <Callout kind="good" title="📍 ที่มาของทุกใบ — ไม่มีอะไรเกินขอบเขต">
        <NumTable
          headers={["ชุด", "จำนวน", "มาจากไหน"]}
          rows={[
            ["1 · โค้ด 5 โครง", "5 ใบ", "อาจารย์บอกเอง “มีโค้ดครึ่งหนึ่ง” = ~45 คะแนน"],
            ["2 · Integration", "6 ใบ", "สรุป Final น.20–21 (ปีนี้ย้ายมาเป็นบทแรก)"],
            ["3 · Differentiation", "6 ใบ", "สรุป Final น.22–25 · ตาราง 24 สูตรครบตามที่อาจารย์นับ"],
            ["4 · Root Finding", "10 ใบ", "ติว mid น.1–7 (graphical → secant + Taylor)"],
            ["5 · Linear", "7 ใบ", "ติว mid น.8–14 · เน้น Cramer + Gauss (เท่ากัน/ไม่เท่ากัน)"],
            ["6 · กฎห้องสอบ", "4 ใบ", "ถอดจากไฟล์เสียงคาบ 5 + 8 ส.ค."],
          ]}
        />
        <p style={{margin:"8px 0 0", fontSize:'0.84rem'}}><b>ตัดออกแล้ว:</b> Jacobi · Gauss-Seidel · Conjugate Gradient · Interpolation · Spline · Regression · Romberg · Gauss-Legendre · Richardson — ทั้งหมดอยู่ใน “สรุป Final” ส่วนที่เป็น<b>เนื้อหาหลังมิดเทอม</b> หรือไม่ปรากฏในไฟล์เสียงเลย</p>
      </Callout>

      <Callout kind="tip" title="วิธีใช้ให้ได้ผลจริง — อย่าแค่ “อ่านผ่าน”">
        <ol style={{margin:0, paddingLeft:20}}>
          <li>อ่านคำถามบนการ์ด → <b>เขียนคำตอบลงกระดาษเปล่าก่อน</b> อย่าเพิ่งกด</li>
          <li>กดดูเฉลย → ถ้าตรง กด <b>“✓ จำได้”</b> · ถ้าไม่ตรงแม้แต่นิดเดียว กด <b>“✗ ยังไม่ได้”</b> (อย่าเข้าข้างตัวเอง — ในห้องสอบผิดนิดเดียวก็ 0)</li>
          <li>จบรอบแล้วกด <b>“เฉพาะที่ยังไม่ได้”</b> → ท่องซ้ำเฉพาะที่เหลือ</li>
          <li><b>พรุ่งนี้กลับมาทำใหม่ทั้งชุด</b> — การท่องซ้ำวันเว้นวันจำได้ยาวกว่าท่องรวดเดียว 3 ชั่วโมง</li>
        </ol>
      </Callout>

      <Callout kind="danger" title="ถ้ามีเวลาท่องแค่ชุดเดียว — ท่องชุดโค้ด">
        <p style={{margin:0}}>ข้อเขียนโปรแกรม ~3 ข้อ = <b>45 คะแนน</b> และมาจากแค่ 5 โครงนี้ · <b>ข้อโค้ดไม่มีเลขให้ปัดพลาด ไม่มีกดเครื่องผิด</b> เขียนถูกก็ได้เต็ม — คุ้มกว่าทุกอย่างในหน้านี้</p>
      </Callout>

      <Deck id="code" title="ชุดที่ 1 · โค้ด 5 โครง — 45 คะแนนมาจากตรงนี้"
        subtitle="เขียนลงกระดาษเปล่าให้ได้ทั้งบล็อก ไม่ใช่แค่จำว่ามีลูป — รวมคอมเมนต์ ① ② ③ ด้วย เพราะอาจารย์สั่งให้เขียนกรอบ 3 ขั้น"
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
        <p style={{margin:"8px 0 0"}}>⇒ ในตาราง 2 ใบข้างล่าง <b>ท่องแค่ 2 แถวบน (f′ กับ f″)</b> · แถว f‴/f⁗ เก็บไว้เผื่อเจอ แต่<b>อย่าเสียเวลาท่อง</b></p>
      </Callout>

      <Deck id="dif" title="ชุดที่ 3 · Differentiation — เน้น f′ กับ f″"
        subtitle="ตาราง 2 ใบแรกมีครบ 24 สูตร แต่ท่องจริงแค่ 2 แถวบนของแต่ละตาราง" cards={DIF_CARDS}/>

      <Deck id="root" title="ชุดที่ 4 · Root Finding — 6 วิธี + กติกาเดินตาราง"
        subtitle="บทที่ใหญ่ที่สุดและมีวิธีเยอะสุด — ใบที่ 6, 7, 8 คือกติกาที่ทำให้ตารางไม่หลุด" cards={ROOT_CARDS}/>

      <Deck id="lin" title="ชุดที่ 5 · Linear Systems"
        subtitle="บทที่เพิ่งเรียน — เน้น Cramer กับ Gauss ก่อน" cards={LIN_CARDS}/>

      <Deck id="rule" title="ชุดที่ 6 · กฎห้องสอบ + ค่ากดเครื่อง"
        subtitle="ชุดนี้ไม่ใช่เนื้อหา แต่เป็นตัวกันเสียคะแนนฟรี — ท่องพร้อมกับสูตร" cards={RULE_CARDS}/>
    </div>
  );
}

window.MemorizeLesson = MemorizeLesson;
