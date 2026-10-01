// แผนเตรียมสอบไฟนอล — รีเซ็ตใหม่ทั้งไฟล์ 2026-10-01 (ของเดิม = แผน 7 สัปดาห์ 9 ก.ย.–26 ต.ค. · W1–W7)
// เหตุที่รีเซ็ต: ถึง 1 ต.ค. บท Linear ยังไม่ได้เริ่ม (W1–W3 หลุด) ⇒ แผนเดิมเดินต่อไม่ได้ ต้องวางใหม่บนเวลาที่เหลือจริง
// ที่มาของทุกตัวเลขในไฟล์นี้:
//   • ไฟนอล จันทร์ 26 ต.ค. 2569 · 50 คะแนน · คะแนนเก็บ 0 · มิด 17.33/40 (คะแนนจริง ออก 10 ก.ย. 2569)
//   • เวลาที่มี ณ 1 ต.ค.: ~2.5 ชม./วัน × 25 วัน ≈ 60 ชม.
//   • ขอบเขต = ใบการบ้าน 6-7 (Linear) · 8 (CG) · 9 (Newton DD) · 10 (Lagrange + Linear Spline)
//   ⛔ ห้ามเขียนว่าไฟนอล = 6 ข้อ×15 / 1 ข้อทำไม่ได้ เป็นข้อเท็จจริง — นั่นคือบรีฟ *ก่อนมิด* (transcripts/w6.txt)
//      kim สั่ง 12 ก.ย.: ฟอร์แมตไฟนอลอาจไม่เหมือนมิด · เป้าให้พูดเป็น % · ขอบเขตยึดใบการบ้าน
// เปลี่ยน key เป็น final-v2 เพราะรายการข้อเปลี่ยนหมด (ติ๊กของ final-v1 จะไม่ตรงกับข้อใหม่)
const PLAN_KEY = "numer-planchk-final-v2";

const PLAN = [
  { id: "b1", title: "พฤ 1 – อา 4 ต.ค. · Interpolation ก่อน", when: "~10 ชม.",
    goal: "Newton Divided-Difference + Lagrange + Linear Spline — ทั้งทำมือและโค้ด (การบ้าน 9 · 10)",
    note: "เริ่มที่บทนี้ก่อน Linear เพราะเป็นกลุ่ม 🟥 ห้ามพลาด ที่ใบการบ้านล่าสุดสั่งตรง ๆ และสั้นกว่า Linear มาก ⇒ ได้ของที่เก็บคะแนนได้ชัวร์ในมือก่อนภายใน 4 วัน · โจทย์บทนี้มาเป็นตาราง ⇒ ซ้อมอ่านค่าจากตารางไปด้วย (แก้จุดที่พลาดในมิด: ลืมว่า h คือระยะห่าง)",
    items: [
      ["b1a", <span><a href="#interp">#interp</a> · Newton Divided-Difference — ตารางสามเหลี่ยมทำมือ แล้วทำการบ้าน 9 ที่ <b>x = 4.2</b> (เลขท้ายรหัส 2)</span>],
      ["b1b", <span>⭐ การบ้าน 9 โค้ด DD <b>3 แบบ</b>: recursive · DP top-down (memo) · DP bottom-up (ตาราง) — เขียนเองจนรันได้ทั้ง 3</span>],
      ["b1c", <span><a href="#interp">#interp</a> · Lagrange — การบ้าน 10 แบบ linear / quadratic / polynomial ที่ x = 42 และ x = 285</span>],
      ["b1d", <span>การบ้าน 10 โค้ด Lagrange สำหรับ <b>n จุด</b> (ไม่ใช่ฮาร์ดโค้ด 3 จุด)</span>],
      ["b1e", <span><a href="#spline">#spline</a> · Linear Spline — การบ้าน 10 ที่ x = 4.5 + โค้ด · จุดตายคือ <b>หาช่วง (segment) ก่อน</b> แล้วค่อยแทนสูตร</span>],
      ["b1f", <span>🔀 โจทย์ดัด 1 ข้อ: <b>inverse interpolation</b> — ให้ y มา หา x (สลับคอลัมน์ตาราง) · ทำได้ทั้ง DD และ Lagrange</span>],
      ["b1g", <span><a href="#memo">#memo</a> ท่องสูตร 10 นาที (ทุกวัน)</span>],
    ]},
  { id: "b2", title: "จ 5 – อา 11 ต.ค. · Linear แบบตรง (direct)", when: "~17 ชม.",
    goal: "Gauss Elimination → Gauss-Jordan → Matrix Inversion → LU (→ Cholesky ถ้าทัน) — การบ้าน 6-7",
    note: "สี่วิธีนี้คือโครงเดียวกันต่อยอดเป็นชั้น ๆ: Gauss → กำจัดข้างบนด้วย = Jordan → ต่อ [A|I] = Inversion → เก็บตัวคูณไว้ใน L = LU ⇒ เรียนตามลำดับนี้ ห้ามกระโดด · Gauss Elimination คือโครงแม่ ถ้าอันนี้แน่น ที่เหลือคือการแก้ทีละบรรทัด",
    items: [
      ["b2a", <span><a href="#linear">#linear</a> · บทนำ + Decision Tree (15 นาที) — เห็นภาพก่อนว่า 7 วิธีต่างกันตรงไหน</span>],
      ["b2b", <span>🟥 <a href="#linear">#linear</a> · Gauss Elimination ทำมือ + การบ้าน 6-7 ข้อ 1.2 (ปิดเฉลยทำก่อน)</span>],
      ["b2c", <span>⭐ <a href="#code">#code</a> · โครง E (Gauss) — เขียนบนกระดาษเปล่า<b>จากความจำ</b> จนไม่ต้องเปิดดู</span>],
      ["b2d", <span><a href="#linear">#linear</a> · Gauss-Jordan + Matrix Inversion · การบ้าน 1.3, 1.4 · <a href="#code">#code</a> โครง F จากความจำ</span>],
      ["b2e", <span><a href="#linear">#linear</a> · LU Decomposition · การบ้าน 1.5 · <a href="#code">#code</a> โครง G จากความจำ</span>],
      ["b2f", <span>🟨 ถ้าทัน: Cholesky · การบ้าน 1.6 · โครง H (ใช้ substitution ชุดเดียวกับ LU) — จำเงื่อนไข symmetric positive definite</span>],
      ["b2g", <span>🔀 โจทย์ดัด 1 ข้อ: ให้ A⁻¹ หรือ L, U มาแล้ว — ใช้ของที่ให้มาแก้ระบบต่อ ไม่ต้องเริ่มใหม่</span>],
      ["b2h", <span><a href="#memo">#memo</a> ท่องสูตร 10 นาที (ทุกวัน)</span>],
    ]},
  { id: "b3", title: "จ 12 – ศ 16 ต.ค. · Iterative + CG + Regression", when: "~12.5 ชม.",
    goal: "Jacobi / Gauss-Seidel (หยุดด้วย tolerance) · Conjugate Gradient (การบ้าน 8) · Linear + Polynomial Regression",
    note: "Jacobi กับ GS ต่างกันบรรทัดเดียว (GS ใช้ค่าใหม่ทันที) และเป็นจุดที่กฎโค้ดอาจารย์ใช้จริง: ลูปต้องหยุดด้วย tolerance ไม่ใช่นับรอบ (เหตุที่เคยได้ 1 เต็ม 6) · Polynomial Regression = ตั้ง normal equations แล้วโยนเข้าโครง Gauss ที่ทำไปเมื่อสัปดาห์ก่อน",
    items: [
      ["b3a", <span>🟥 <a href="#linear">#linear</a> · Jacobi + Gauss-Seidel · การบ้าน 1.7, 1.8 · กับดักลู่ออกถ้าไม่ diagonally dominant</span>],
      ["b3b", <span>⭐ <a href="#code">#code</a> · โครง J — <b>while + tolerance</b> ห้าม for นับรอบ</span>],
      ["b3c", <span>🟧 <a href="#conjugate">#conjugate</a> · การบ้าน 8: โค้ด CG ระบบ 4×4 ε = 1e-6 + วาด f(x₁,x₂) กับ contour · (ข้ามพิสูจน์ λ, α ได้ถ้าเวลาไม่พอ)</span>],
      ["b3d", <span>🟥 <a href="#regression">#regression</a> · Linear Regression — Σx, Σy, Σxy, Σx² → normal equations ทำมือ + โค้ด</span>],
      ["b3e", <span>🟧 <a href="#regression">#regression</a> · Polynomial Regression — normal equations แล้วแก้ด้วยโครง E</span>],
      ["b3f", <span>🔀 โจทย์ดัด 1 ข้อ: ให้สมการเส้นตรงที่ fit แล้วมา หาข้อมูลที่หายไป 1 ตัว (ย้อนกลับ)</span>],
      ["b3g", <span><a href="#memo">#memo</a> ท่องสูตร 10 นาที (ทุกวัน)</span>],
    ]},
  { id: "b4", title: "ส 17 – อา 18 ต.ค. · Mock รอบ 1 + ซ่อม", when: "~5 ชม.",
    goal: "จับเวลา 180 นาทีเต็ม ครั้งแรก แล้วซ่อมทุกข้อที่พลาด",
    note: "นี่คือจุดที่ห้ามข้ามที่สุดในแผน — ถ้าไม่ได้ซ้อมจับเวลา จะไปเจอ “ทำไม่ทัน” ครั้งแรกในห้องสอบจริง · ตรวจแบบอาจารย์: ดูแค่คำตอบสุดท้าย ผิด = 0 ตอบทศนิยม ห้ามเศษส่วน",
    items: [
      ["b4a", <span>⭐⭐ <a href="#exam">#exam</a> (หรือ <a href="#midterm">#midterm</a> → 🎲 สุ่มชุด) · จับเวลา 180 นาที รอบ 1 — ปิดโน้ต ใช้แค่เครื่องคิดเลข</span>],
      ["b4b", <span>ตรวจแบบอาจารย์: ดูคำตอบสุดท้ายอย่างเดียว · ข้อ “แสดงวิธีทำ” ต้องมีวิธีเขียนไว้จริง</span>],
      ["b4c", <span><a href="#midterm">#midterm</a> · กรอกสมุดพลาด 🩺 ทุกข้อที่ไม่ได้คะแนน รวมข้อที่ทำไม่ทัน</span>],
      ["b4d", <span>อาทิตย์: ทำซ้ำเฉพาะข้อที่พลาดจนถูก (ไม่เปิดหัวข้อใหม่)</span>],
      ["b4e", <span><a href="#memo">#memo</a> ท่องสูตร 10 นาที (ทุกวัน)</span>],
    ]},
  { id: "b5", title: "จ 19 – พฤ 22 ต.ค. · หัวข้อรอง + ดริลเลือกวิธี", when: "~10 ชม.",
    goal: "Quadratic Spline · Multiple Regression · ดริล “ข้อนี้ใช้วิธีไหน?” + โจทย์ย้อนกลับ",
    note: "ยังไม่มีใบการบ้าน Quadratic/Cubic Spline หรือ Regression — ถ้าใบใหม่มาก่อนถึงช่วงนี้ ให้เลื่อนหัวข้อในใบนั้นขึ้นมาทำก่อน (ใบการบ้าน = ตัวยืนยันขอบเขต) · ครึ่งหลังของช่วงนี้คือซ้อม “อ่านโจทย์ประยุกต์” ซึ่งเป็นสาเหตุเสียคะแนนในมิด ไม่ใช่เรียนของใหม่",
    items: [
      ["b5a", <span>🟨 <a href="#spline">#spline</a> · Quadratic Spline — ตั้งระบบสมการแล้วแก้ด้วยโครง E</span>],
      ["b5b", <span>🟨 <a href="#regression">#regression</a> · Multiple Linear Regression — ต่อยอดจาก Linear Regression</span>],
      ["b5c", <span>⭐ ดริล “ข้อนี้ใช้วิธีไหน?” — อ่านโจทย์แล้วบอกวิธีภายใน 30 วินาที (Interpolation vs Regression · direct vs iterative · จุดห่างเท่า/ไม่เท่า)</span>],
      ["b5d", <span>⭐ <a href="#midterm">#midterm</a> · โจทย์ย้อนกลับ — ให้ผลลัพธ์มา หา input (เช่น inverse interpolation: ให้ y หา x)</span>],
      ["b5e", <span><a href="#code">#code</a> · เขียนโครง E · F · G · J · K ปิดตาอีกรอบ</span>],
      ["b5f", <span><a href="#memo">#memo</a> ท่องสูตร 10 นาที (ทุกวัน)</span>],
    ]},
  { id: "b6", title: "ศ 23 – ส 24 ต.ค. · Mock รอบ 2", when: "~5 ชม.",
    goal: "จับเวลา 180 นาทีรอบสอง แล้วซ่อม — ตั้งแต่นี้ห้ามเปิดหัวข้อใหม่",
    note: "รอบนี้วัดว่าซ่อมจากรอบ 1 ได้จริงไหม · อะไรที่ยังไม่เคยอ่านถึงวันนี้ = ปล่อยไป ไม่ต้องฝืนเปิด",
    items: [
      ["b6a", <span>⭐ <a href="#exam">#exam</a> · จับเวลา 180 นาที รอบ 2 (คนละชุดกับรอบ 1)</span>],
      ["b6b", <span>ซ่อมข้อที่พลาด + เทียบกับสมุดพลาด 🩺 ว่าโรคเดิมยังอยู่ไหม</span>],
      ["b6c", <span>ไม่เปิดหัวข้อใหม่ตั้งแต่ 23 ต.ค.</span>],
      ["b6d", <span><a href="#memo">#memo</a> ท่องสูตร 10 นาที (ทุกวัน)</span>],
    ]},
  { id: "b7", title: "อา 25 ต.ค. · วันก่อนสอบ", when: "~2.5 ชม. เบา ๆ",
    goal: "ทวนเบา ๆ ไม่ใช่เรียน — แล้วนอนเร็ว",
    note: "สมองที่นอนพอทำข้อสอบได้ดีกว่าสมองที่อ่านเพิ่มอีก 3 ชั่วโมง",
    items: [
      ["b7a", <span><a href="#memo">#memo</a> + <a href="#code">#code</a> · ทวนสูตรและโครงโค้ดแบบเร็ว</span>],
      ["b7b", <span>กวาด Trap / Simpson / Root 30 นาที (<a href="#cheat">#cheat</a>) — เผื่อโผล่เป็นครึ่งหนึ่งของโจทย์ผสม</span>],
      ["b7c", <span>เช็คเครื่องคิดเลข (ถ่าน · Rad · Matrix · Table) แล้วนอนเร็ว</span>],
    ]},
  { id: "b8", title: "จันทร์ 26 ต.ค. · วันสอบ", when: "ไฟนอล 50 คะแนน",
    goal: "ไม่มีอะไรใหม่ — ทำตามเกมแพลนที่ซ้อมมาแล้ว",
    note: "เกมแพลนในห้อง (ไม่ผูกกับจำนวนข้อ ใช้ได้ทุกฟอร์แมต): อ่านโจทย์ให้ครบทั้งฉบับใน 5 นาทีแรก → จัดอันดับว่าข้อไหนมั่นใจสุด → ทำข้อที่มั่นใจก่อน → เจอข้อที่ตันให้ข้ามทันที อย่าฝืน → เวลาที่เหลือคือ “ตรวจซ้ำข้อที่ทำแล้ว” ไม่ใช่เริ่มข้อใหม่",
    items: [
      ["b8a", "ตื่นมาทวนสมุดพลาด + โครงโค้ด 30 นาที ไม่แตะโจทย์ใหม่"],
      ["b8b", "5 นาทีแรกในห้อง — อ่านครบทุกข้อ ชี้ตัวข้อที่จะทิ้ง"],
      ["b8c", "ข้อ “แสดงวิธีทำ” — เขียนวิธีให้เห็น ไม่ใช่แค่คำตอบ"],
      ["b8d", "ทุกข้อที่ตอบเป็นตัวเลข — แทนค่ากลับตรวจ และตอบเป็นทศนิยมเท่านั้น ห้ามเศษส่วน"],
      ["b8e", "เหลือเวลา = ตรวจซ้ำข้อที่ทำแล้ว ไม่ใช่เริ่มข้อที่ยังไม่ได้แตะ"],
    ]},
];

function PlanChecklist() {
  const [done, setDone] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(PLAN_KEY) || "{}"); } catch { return {}; }
  });
  const toggle = (k) => {
    const next = { ...done, [k]: !done[k] };
    setDone(next);
    try { localStorage.setItem(PLAN_KEY, JSON.stringify(next)); } catch {}
  };
  const all = PLAN.flatMap(p => p.items.map(i => i[0]));
  const n = all.filter(k => done[k]).length;

  return (
    <div>
      <div style={{display:"flex", alignItems:"center", gap:10, margin:"0 0 14px"}}>
        <span style={{flex:1, height:12, background:"var(--bg-soft)", borderRadius:6, overflow:"hidden"}}>
          <span style={{display:"block", height:"100%", width:`${(n / all.length) * 100}%`,
                        background:"var(--green)", transition:"width .2s"}}/>
        </span>
        <b style={{fontFamily:"var(--font-mono)", fontSize:'0.9rem'}}>{n}/{all.length}</b>
      </div>
      {PLAN.map(ph => {
        const dn = ph.items.filter(i => done[i[0]]).length;
        return (
          <div key={ph.id} className="card" style={{padding:"14px 16px", marginBottom:12}}>
            <div style={{display:"flex", alignItems:"baseline", gap:8, flexWrap:"wrap"}}>
              <b style={{fontSize:'1rem'}}>{ph.title}</b>
              <span className="tag">{ph.when}</span>
              <div style={{flex:1}}/>
              <span style={{fontFamily:"var(--font-mono)", fontSize:'0.8rem',
                            color: dn === ph.items.length ? "var(--green)" : "var(--text-faint)"}}>
                {dn}/{ph.items.length}{dn === ph.items.length ? " ✓" : ""}
              </span>
            </div>
            <p style={{margin:"3px 0 2px", fontSize:'0.84rem', color:"var(--text-dim)"}}>🎯 {ph.goal}</p>
            <p style={{margin:"0 0 10px", fontSize:'0.8rem', color:"var(--text-faint)"}}>{ph.note}</p>
            <div style={{display:"flex", flexDirection:"column", gap:4}}>
              {ph.items.map(([k, text]) => (
                <label key={k} style={{display:"flex", gap:9, alignItems:"flex-start", cursor:"pointer",
                                       fontSize:'0.88rem', lineHeight:1.6,
                                       opacity: done[k] ? 0.45 : 1,
                                       textDecoration: done[k] ? "line-through" : "none"}}>
                  <input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)}
                    style={{marginTop:5, accentColor:"var(--green)", flex:"0 0 auto"}}/>
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// นับถอยหลังจริงจากวันที่เปิดหน้า — ไม่ฮาร์ดโค้ด
function daysToFinal() {
  const final = new Date(2026, 9, 26); // 26 ต.ค. 2569 (เดือนใน JS เริ่มที่ 0)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((final - today) / 86400000));
}

function PlanLesson() {
  const left = daysToFinal();
  return (
    <div>
      <Hero
        kicker="🗓 แผนเตรียมไฟนอล · ต้องผ่าน"
        title={`เหลือ ${left} วัน — แผน 25 วัน เป้า “ผ่านชัวร์ 55%+”`}
        lead="ไฟนอล 50 คะแนน · คะแนนเก็บ 0 · มิด 17.33/40 ⇒ ต้องได้อย่างน้อย 22.67/50 (45.3%) ถึงจะผ่าน — และวิชานี้ต้องผ่านถึงจะจบ · เวลาจริงที่มี ~2.5 ชม./วัน ≈ 60 ชม. · ติ๊กไปทีละข้อ บันทึกอัตโนมัติ"
        readout={{
          label: "จันทร์ 26 ต.ค. 2569 · ไฟนอล 50 คะแนน",
          steps: [
            { x: "1–4 ต.ค. Interp", w: 16 },
            { x: "5–16 ต.ค. Linear · CG · Regression", w: 48 },
            { x: "17–24 ต.ค. Mock ×2 + ซ่อม", w: 32 },
          ],
          result: "25",
          note: "วัน นับจาก 1 ต.ค. — ~2.5 ชม./วัน รวมราว 60 ชม.",
        }}
        meta={["~2.5 ชม./วัน", "Mock 180 นาที × 2", "ท่องสูตร 10 นาที/วัน", "ผ่าน D = 45.3% · เป้า 55%+"]}
      />

      <Callout kind="warn" title="🔄 ทำไมแผนถูกรีเซ็ตวันที่ 1 ต.ค.">
        <p style={{margin:"0 0 6px"}}>แผนเดิม 7 สัปดาห์ (9 ก.ย.) วาง Linear ไว้ 3 สัปดาห์แรก — ถึงวันนี้ <b>บท Linear ยังไม่ได้เริ่ม</b> ⇒ แผนเดิมเดินต่อไม่ได้แล้ว เลยวางใหม่บนเวลาที่เหลือจริง ไม่ใช่เวลาที่ควรจะมี</p>
        <p style={{margin:0}}>ข่าวดี: 25 วัน × 2.5 ชม. ≈ 60 ชม. ยังพอสำหรับ “ผ่านชัวร์” ถ้าเลือกทำถูกเรื่อง — แผนนี้จึง<b>จัดลำดับตามคะแนนที่ได้ต่อชั่วโมง</b> ไม่ใช่ตามลำดับบท และมีลำดับตัดไว้ให้แล้วถ้าหลุดอีก (ติ๊กของแผนเก่าไม่ถูกนำมา เพราะรายการเปลี่ยนหมด)</p>
      </Callout>

      <Callout kind="danger" title="⚠︎ ขอบเขตไฟนอล — ยึดใบการบ้าน">
        <NumTable
          headers={["ออกไฟนอล", "รายละเอียด", "ที่มา"]}
          rows={[
            [<b>Linear · 7 วิธี</b>, "Gauss Elimination · Gauss-Jordan · Matrix Inversion · LU · Cholesky · Jacobi · Gauss-Seidel (Cramer ออกมิดไปแล้ว)", <span>การบ้าน 6-7 (สั่ง 8 วิธี)</span>],
            ["Conjugate Gradient", "โค้ด 4×4 ε = 1e-6 · f(x₁,x₂) + contour · พิสูจน์ λ, α", "การบ้าน 8"],
            ["Newton Divided-Difference", "x = 4.2 (เลขท้ายรหัส 2) · โค้ด 3 แบบ: recursive / DP top-down / DP bottom-up", "การบ้าน 9"],
            ["Lagrange + Linear Spline", "Lagrange linear/quad/poly ที่ x = 42,285 + โค้ด n จุด · Linear Spline ที่ x = 4.5 + โค้ด", "การบ้าน 10"],
            [<span className="muted">Quadratic/Cubic Spline · Regression (linear / polynomial / multiple)</span>, <span className="muted">ยังไม่มีใบการบ้าน — แต่อยู่ในบทของแอปและชีทไฟนอลปีที่แล้ว</span>, <span style={{color:"var(--yellow)"}}>ใบใหม่มาเมื่อไหร่ ลำดับความสำคัญจะขยับตาม</span>],
          ]}
        />
        <p style={{margin:"8px 0 0"}}><b>เช็คขอบเขตแล้ว:</b> เทียบกับชีทไฟนอลปีที่แล้วหน้า 1 — ทุกหัวข้อมีบทรองรับในแอปครบ (<a href="#linear">#linear</a> · <a href="#interp">#interp</a> · <a href="#spline">#spline</a> · <a href="#regression">#regression</a> · <a href="#conjugate">#conjugate</a>) · Integration ปีนี้ย้ายไปออกมิดแล้ว</p>
      </Callout>

      <Sect tag="📊" title="เป้าที่ต้องไปให้ถึง — คิดเป็น % ของไฟนอล">
        <Callout kind="danger" title="⛔ อย่าวางแผนจากสมมติว่าไฟนอลหน้าตาเหมือนมิด">
          <p style={{margin:0}}>ที่เคยได้ยินว่า &ldquo;ครึ่งโค้ดครึ่งมือ&rdquo; คือสิ่งที่อาจารย์บรีฟ<b>ก่อนสอบมิด</b> — ไฟนอลอาจไม่เหมือนกัน ⇒ เป้าในหน้านี้จึงเป็น <b>% ของคะแนนไฟนอล</b> ไม่ใช่ &ldquo;ทำถูกกี่ข้อ&rdquo; · ที่ยึดได้จริง: ① ขอบเขตเดินตามใบการบ้าน ② ตรวจแค่คำตอบสุดท้าย ผิด = 0 · ตอบทศนิยม ห้ามเศษส่วน ③ ข้อ &ldquo;แสดงวิธีทำ&rdquo; ต้องเขียนวิธีด้วย</p>
        </Callout>

        <NumTable
          headers={["เป้า", "ต้องได้จากไฟนอล", "= กี่ % ของไฟนอล", "รวมทั้งวิชา (/90)"]}
          highlight={1}
          rows={[
            [<b>D — ผ่าน (เส้นตาย)</b>, <b>22.67 / 50</b>, <b>45.3%</b>, "40.00 พอดี"],
            [<span><b>ผ่านชัวร์</b> ← เป้าของแผนนี้</span>, <b>27.50 / 50</b>, <b>55%</b>, <span>44.83 — เผื่อพลาดได้ ~10% (≈4.8 คะแนน)</span>],
            [<span className="muted">C</span>, "32.67 / 50", "65.3%", "50.00 พอดี"],
            [<span className="muted">ทำได้ 1 ใน 3</span>, "16.67 / 50", "33%", <span style={{color:"var(--red)"}}>34.00 — <b>ไม่ผ่าน</b></span>],
          ]}
        />
        <Callout kind="good" title="⭐ ทำไมตั้งเป้า 55% ไม่ใช่ 45.3%">
          <p style={{margin:0}}>เพราะการตรวจคือ <b>ผิด = 0 ไม่มีคะแนนขั้นตอน</b> — ปัดเลขพลาดข้อเดียวหายทั้งข้อ · ถ้าเล็งแค่ 45.3% พลาดนิดเดียวก็ตก · เล็ง 55% แล้วพลาดไป ~10% ยังผ่าน · มิดทำได้ 17.33/40 = 43% ⇒ <b>ต้องดีขึ้นจากมิดอีกราว 12 จุด %</b> ซึ่งทำได้ถ้าเก็บกลุ่ม 🟥 ให้แน่น</p>
        </Callout>

        <Callout kind="danger" title="⚠︎ สาเหตุที่เสียคะแนนในมิด — ไม่ใช่ “ไม่เข้าใจวิธี”">
          <NumTable
            headers={["ที่พลาดจริง", "ตัวอย่างจากมิด", "แผนนี้แก้ยังไง"]}
            rows={[
              [<b>ลืมสูตร</b>, "เดินตารางเป็น แต่นึกสูตรไม่ออก", <span>ท่องสูตร <a href="#memo">#memo</a> 10 นาทีทุกวัน</span>],
              [<b>อ่านโจทย์ประยุกต์ไม่ออก</b>, <span>ข้อจรวด — <b>ลืมว่า h คือระยะห่างในตาราง</b></span>, "ทุกหัวข้อต้องมีโจทย์ดัด 1 ข้อ (🔀 ในเช็คลิสต์)"],
              [<b>โจทย์ย้อนกลับ</b>, "ให้ผลลัพธ์มา แล้วให้หา input", "inverse interpolation (1–4 ต.ค.) + ดริลย้อนกลับ (19–22 ต.ค.)"],
              [<b>เลือกช่วงเอง</b>, "กดเครื่องแล้วรากไม่อยู่ในช่วงที่เลือก", "Spline: หา segment ก่อนแทนสูตร · ดริลเลือกวิธี"],
            ]}
          />
          <p style={{margin:"8px 0 0"}}><b>ที่ได้ผล:</b> ข้อ Cramer ได้คะแนนเพราะ<b>ซ้อมทั้งมือและโค้ดมาแล้ว</b> ⇒ กติกาของแผนนี้: <b>ทุกหัวข้อ = ทำมือ + โค้ด + โจทย์ดัด 1 ข้อ</b> · และโค้ดทุกลูปต้อง<b>หยุดด้วย tolerance</b> ไม่ใช่จำนวนรอบ (กฎอาจารย์)</p>
        </Callout>
      </Sect>

      <Sect tag="🎯" title="จัดลำดับความสำคัญ — ทำจากบนลงล่าง">
        <NumTable
          headers={["ระดับ", "หัวข้อ", "เพราะอะไร"]}
          rows={[
            [<b>🟥 ห้ามพลาด</b>, "Newton DD · Lagrange · Linear Spline · Gauss Elimination · Jacobi/Gauss-Seidel · Linear Regression", "อยู่ในใบการบ้าน (หรือเป็นฐานของทุกวิธี) และทำมือได้เร็ว — นี่คือแกนของ 55%"],
            [<b>🟧 ควรได้</b>, "Gauss-Jordan / Inversion · LU · Conjugate Gradient (การบ้าน 8) · Polynomial Regression", "ต่อยอดจากโครงเดิมแค่ไม่กี่บรรทัด คุ้มเวลา"],
            [<b>🟨 ถ้ามีเวลา</b>, "Cholesky · Quadratic Spline · Multiple Regression", "ใช้เวลามากกว่าเมื่อเทียบคะแนนที่ได้ · Quadratic/Multiple ยังไม่มีใบการบ้าน"],
            [<span className="muted">⬜ ตัดก่อน</span>, <span className="muted">Cubic Spline ทำมือ · พิสูจน์ λ/α ของ CG</span>, <span className="muted">กินเวลามากที่สุด ได้คะแนนน้อยที่สุดต่อชั่วโมง</span>],
          ]}
        />
      </Sect>

      <Sect tag="🗓" title="แผน 25 วัน — ติ๊กไปทีละข้อ">
        <PlanChecklist/>
      </Sect>

      <Sect tag="✂️" title="ถ้าตามไม่ทัน — ตัดตามลำดับนี้">
        <p>เวลา 60 ชม. ไม่มีที่ให้หลุดเยอะ · <b>ตัดตามลำดับนี้ อย่าตัดมั่ว</b> — เรียงจาก &ldquo;เสียคะแนนน้อยที่สุด&rdquo; ไป &ldquo;มากที่สุด&rdquo;</p>
        <NumTable
          headers={["ลำดับตัด", "ตัดอะไร", "เพราะอะไร"]}
          rows={[
            ["1 · ตัดก่อนเลย", "Cubic Spline ทำมือ", "ระบบสมการใหญ่ กินเวลามาก · ยังไม่มีใบการบ้าน"],
            ["2", "พิสูจน์ λ, α ของ CG", "เก็บแค่โค้ด CG (การบ้าน 8) ไว้ก็พอ"],
            ["3", "Multiple Regression (b5b)", "ส่วนขยายของ Linear Regression · ยังไม่มีใบการบ้าน"],
            ["4", "Quadratic Spline (b5a)", "ยังไม่มีใบการบ้าน — แต่ห้ามตัด Linear Spline"],
            ["5", "Mock รอบ 2 (b6a)", "ซ้อม 1 รอบได้ประโยชน์ส่วนใหญ่แล้ว"],
            [<b>ห้ามตัด</b>, <b>โครง Gauss Elimination (โครง E)</b>, "เป็นแม่ของ Jordan / Inversion / LU / Polynomial Regression / Quadratic Spline"],
            [<b>ห้ามตัด</b>, <b>Newton DD + Lagrange</b>, "การบ้าน 9–10 สั่งตรง ๆ ทั้งมือและโค้ด"],
            [<b>ห้ามตัด</b>, <b>Mock รอบ 1 (b4a)</b>, "ไม่งั้นจะเจอ “ทำไม่ทัน” ครั้งแรกในห้องสอบจริง"],
            [<b>ห้ามตัด</b>, <b>ท่องสูตรประจำวัน</b>, "วันละ 10 นาที แต่แก้สาเหตุอันดับ 1 ที่เสียคะแนนในมิด (ลืมสูตร)"],
          ]}
        />
      </Sect>

      <Sect tag="📌" title="ที่มาของแผนนี้ — กำกับไว้ทุกบรรทัดตามกฎ">
        <NumTable
          headers={["ข้อมูล", "แหล่ง", "ความน่าเชื่อ"]}
          rows={[
            ["มิด 17.33/40 · คะแนนเก็บ 0 · ต้องผ่านถึงจะจบ", "คะแนนจริง (ออก 10 ก.ย.) + kim", "สูงสุด"],
            ["ขอบเขต: Linear 7 วิธี · CG · Newton DD · Lagrange · Linear Spline", "ใบการบ้าน 6-7 · 8 · 9 · 10", "สูงสุด — ใบงานปีนี้"],
            ["ครอบคลุมชีทไฟนอลปีที่แล้วหน้า 1 · Integration ย้ายไปมิด", "เทียบชีทปีที่แล้วกับบทในแอป", "สูง"],
            ["ตรวจแค่คำตอบ · ผิด = 0 · ห้ามเศษส่วน · “แสดงวิธีทำ” ต้องเขียนวิธี", "kim + ไฟล์เสียงคาบ 5 ส.ค. (transcripts/w6.txt)", "สูง"],
            [<span className="muted">“ครึ่งโค้ดครึ่งมือ”</span>, <span className="muted">บรีฟ<b>ก่อนมิด</b> (ไฟล์เสียงเดียวกัน)</span>, <span style={{color:"var(--yellow)"}}>⛔ ไม่รับประกันว่าไฟนอลจะเหมือน — อย่าตรึง</span>],
            ["ลูปต้องหยุดด้วย tolerance ไม่ใช่จำนวนรอบ", "kim เล่าเหตุที่สอบท้ายคาบได้ 1 เต็ม 6", "สูง"],
            ["เวลา ~2.5 ชม./วัน · Linear ยังไม่เริ่ม ณ 1 ต.ค.", "kim (1 ต.ค.)", "สูงสุด"],
          ]}
        />
      </Sect>
    </div>
  );
}

window.PlanLesson = PlanLesson;
