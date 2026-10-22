// แผนเตรียมสอบไฟนอล — รีเซ็ตรอบสอง 2026-10-20 (รอบแรก 1 ต.ค. = แผน 25 วัน ~2.5 ชม./วัน · ไม่ได้เดินตาม)
// เหตุที่รีเซ็ต: ถึง 20 ต.ค. kim "อ่านไปนิดเดียว แทบเหมือนไม่เริ่ม" + ได้ใบการบ้าน 11 (Regression) ซึ่งเป็นใบสุดท้าย
// ที่มาของทุกตัวเลขในไฟล์นี้:
//   • ไฟนอล จันทร์ 26 ต.ค. 2569 · 50 คะแนน · คะแนนเก็บ 0 · มิด 17.33/40 (คะแนนจริง ออก 10 ก.ย. 2569)
//   • เวลาที่มี ณ 20 ต.ค.: kim ตอบว่า "เต็มที่เลย" ⇒ วางไว้ ~8 ชม./วัน (คืนวันอังคาร ~3–4 ชม.)
//   • ขอบเขต = ใบการบ้าน 6-7 · 8 · 9 · 10 · 11 + Quadratic/Cubic Spline จากสไลด์ Interpolation+Spline หน้า 17–18
//     (kim ยืนยัน 20 ต.ค. ว่าอยู่ในเอกสาร "เขียนเล็ก ๆ" แต่ไม่มีใบการบ้าน ⇒ ทำหลังสุด)
//   • โพสต์ Google Classroom ของอาจารย์ (kim แปะมา 21 ต.ค.): 24 มิ.ย. "F score < 40 (39, 39.2, 39.5)" = ไม่ปัดขึ้น ·
//     9 ก.ย. สถิติมิด mean 13.46 / SD 9.17 / max 38.22 · 19 ก.ย. การบ้าน 9 ต้องเขียน code 3 แบบ (ห้ามอยู่ในรายการตัด)
//   ⛔ ห้ามเขียนว่าไฟนอล = 6 ข้อ×15 / 1 ข้อทำไม่ได้ เป็นข้อเท็จจริง — นั่นคือบรีฟ *ก่อนมิด* (transcripts/w6.txt)
//      kim สั่ง 12 ก.ย.: ฟอร์แมตไฟนอลอาจไม่เหมือนมิด · เป้าให้พูดเป็น % · ขอบเขตยึดใบการบ้าน
// เปลี่ยน key เป็น final-v3 เพราะรายการข้อเปลี่ยนหมด
const PLAN_KEY = "numer-planchk-final-v3";

const PLAN = [
  { id: "d0", title: "อ. 20 ต.ค. (คืนนี้) · Regression — การบ้าน 11", when: "~3–4 ชม.",
    goal: "Linear · Polynomial m = 2 · Multiple — ทำมือครบ 3 ข้อ + โค้ดฟังก์ชันเดียวที่ตอบได้ทั้ง 3 ข้อ",
    note: "เริ่มที่เรื่องนี้เพราะเพิ่งสอน ง่ายที่สุดในขอบเขต และเครื่องคิดเลขเช็คคำตอบให้ได้ตรง ๆ (Statistics → Reg Results) ⇒ ได้คะแนนชัวร์ก้อนแรกตั้งแต่คืนนี้ · ข้อมูลชุดนี้คือชุดเดียวกับชีทสรุป Final ปีที่แล้วหน้า 19 ซึ่งคำตอบตรงกันทุกตัว",
    items: [
      ["d0a", <span>🟥 <a href="#regression">#regression</a> หมวด HW11 · ข้อ 1.1 Linear ทำมือ: ตาราง Σ 4 ตัว → <M>{`a_1, a_0`}</M> → f(65) = 36.24 · เช็คด้วย Reg Results <code>y=a+bx</code></span>],
      ["d0b", <span>🟥 ข้อ 2.1 Polynomial m = 2: ตั้งระบบ 3×3 (ลายขั้นบันได Σx<sup>i+j</sup>) · เช็คด้วย Reg Results <code>y=a+bx+cx²</code> · <b>ระวังกับดัก a₂ ตัวเล็ก</b> — ต้องเก็บค่าเต็มไว้ในเครื่อง</span>],
      ["d0c", <span>🟧 ข้อ 3.1 Multiple: อ่านหมวด 3 (เดินครบ 8 ขั้น) แล้วตั้งระบบ 4×4 เองให้ได้</span>],
      ["d0d", <span>⭐ โค้ด <b>โครง R</b> (ฟังก์ชันเดียว ตอบได้ทั้ง 3 ข้อ): อ่าน → ปิด → เขียนบนกระดาษเปล่า → รันเทียบใน <a href="#code">#code</a> P12</span>],
      ["d0e", <span>🔀 โจทย์พลิก R-A (ย้อนกลับ) · R-B (ข้อมูลหาย) · R-C (ทำนายค่า Multiple)</span>],
    ]},
  { id: "d1", title: "พ. 21 ต.ค. · Interpolation + Linear Spline → เริ่ม Gauss", when: "~8 ชม.",
    goal: "Newton DD (การบ้าน 9) · Lagrange + Linear Spline (การบ้าน 10) · เย็น: Gauss Elimination (การบ้าน 6-7 ข้อ 1.2)",
    note: "เรื่องที่สั้นและได้คะแนนแน่ทำก่อน · DD กับ Lagrange ต้องได้เลขเท่ากันเป๊ะ ⇒ ใช้ตรวจกันเองได้ (ผิด = 0 จึงต้องมีวิธีที่สองเสมอ) · Gauss Elimination คือโครงแม่ของ Linear ทั้งบท เริ่มเย็นนี้ให้มีเวลานอนทับหนึ่งคืน",
    items: [
      ["d1a", <span>เช้า 30 นาที: เขียนโครง R ใหม่จากความจำ + <a href="#memo">#memo</a> 10 นาที</span>],
      ["d1b", <span>🟥 <a href="#interp">#interp</a> หมวด HW9 · Newton DD ที่ <b>x = 4.2</b> — ตารางสามเหลี่ยมทำมือ (linear / quadratic / polynomial)</span>],
      ["d1c", <span>⭐ โค้ด DD <b>ต้องเขียนได้ครบ 3 แบบ</b> (อาจารย์โพสต์สั่งเอง 19 ก.ย.): <b>bottom-up (ตาราง)</b> ก่อน → recursive → top-down = recursive + memo (<a href="#code">#code</a> P10)</span>],
      ["d1d", <span>🟥 <a href="#interp">#interp</a> หมวด HW10 · Lagrange ที่ <b>x = 42,285</b> + จัดรูป L₀, L₁ · ตรวจว่าได้เท่ากับ DD</span>],
      ["d1e", <span>⭐ โค้ด Lagrange รับ <b>n จุด</b> (โครง K2 · จุดตาย <code>if j != i</code>)</span>],
      ["d1f", <span>🟥 <a href="#spline">#spline</a> หมวด HW10 · Linear Spline ที่ x = 4.5 + โค้ด (โครง K4 · <b>หาช่วงก่อนแทนสูตร</b>) + โจทย์พลิก S-A, S-B</span>],
      ["d1g", <span>🟥 เย็น: <a href="#linear">#linear</a> Gauss Elimination ทำมือ (การบ้าน 1.2) + <b>โครง E</b> จากความจำ (<a href="#code">#code</a> P5)</span>],
    ]},
  { id: "d2", title: "พฤ. 22 ต.ค. · Linear แบบตรง: Jordan · Inversion · LU · Cholesky", when: "~8 ชม.",
    goal: "การบ้าน 6-7 ข้อ 1.3–1.6 — ทุกวิธีคือโครง E ที่แก้ไม่กี่บรรทัด",
    note: "เรียงตามลำดับนี้ ห้ามกระโดด: Gauss → กำจัดข้างบนด้วย = Jordan → ต่อ [A|I] = Inversion → เก็บตัวคูณไว้ใน L = LU → ใช้ substitution ชุดเดียวกัน = Cholesky · ทุกข้อเช็คคำตอบด้วย Equation → Simul Equation",
    items: [
      ["d2a", <span>เช้า 30 นาที: เขียนโครง E · K1 · K2 · K4 ใหม่จากความจำ + <a href="#memo">#memo</a></span>],
      ["d2b", <span>🟧 Gauss-Jordan (1.3) + <b>โครง F</b></span>],
      ["d2c", <span>🟧 Matrix Inversion (1.4) + <b>โครง F′</b> (ต่อ [A|I] ลูปถึง 2n)</span>],
      ["d2d", <span>🟧 LU Decomposition (1.5) + <b>โครง G</b> (<a href="#code">#code</a> P6)</span>],
      ["d2e", <span>🟨 Cholesky (1.6) + <b>โครง H</b> — ใช้ได้เฉพาะ A สมมาตร positive definite</span>],
      ["d2f", <span>🔀 โจทย์พลิก: ให้ L, U หรือ A⁻¹ มาแล้ว — ใช้แก้ระบบที่ b เปลี่ยน ไม่ต้องเริ่มใหม่</span>],
    ]},
  { id: "d3", title: "ศ. 23 ต.ค. · Iterative + CG + Spline กำลัง 2–3", when: "~8 ชม.",
    goal: "Jacobi / Gauss-Seidel (1.7–1.8) · Conjugate Gradient (การบ้าน 8) · Quadratic / Cubic Spline (สไลด์หน้า 17–18)",
    note: "ลูปของ Jacobi / GS / CG ต้องหยุดด้วย tolerance ไม่ใช่นับรอบ (เหตุที่เคยได้ 1 เต็ม 6) · Quadratic/Cubic Spline มีในสไลด์แต่ไม่มีใบการบ้าน ⇒ เอาแค่ตั้งระบบสมการได้แล้วแก้ด้วยโครง E",
    items: [
      ["d3a", <span>เช้า 30 นาที: เขียนโครง E · F · G · H ใหม่จากความจำ + <a href="#memo">#memo</a></span>],
      ["d3b", <span>🟥 <a href="#linear">#linear</a> Jacobi (1.7) + Gauss-Seidel (1.8) · เช็ค diagonally dominant ก่อน · <b>โครง J</b> (while + tolerance · <a href="#code">#code</a> P7)</span>],
      ["d3c", <span>🟧 <a href="#conjugate">#conjugate</a> การบ้าน 8 ข้อ 1 · โค้ด CG 4×4 ε = 1e-6 นับรอบ (<a href="#code">#code</a> P11) + เดินมือ 1–2 รอบ</span>],
      ["d3d", <span>⬜ ตัดได้: CG ข้อ 2–3 (contour · พิสูจน์ λ, α)</span>],
      ["d3e", <span>🟨 <a href="#spline">#spline</a> Quadratic Spline — ตั้งระบบสมการเองให้ได้ แล้วแก้ด้วยโครง E</span>],
      ["d3f", <span>⬜ ถ้าเหลือเวลา: Cubic Spline — เข้าใจว่าเงื่อนไขมาจากไหน (ต่อเนื่อง · slope · ความโค้ง)</span>],
    ]},
  { id: "d4", title: "ส. 24 ต.ค. · Mock A + ซ่อม", when: "~8 ชม.",
    goal: "จับเวลา 180 นาทีครั้งแรก แล้วซ่อมทุกข้อที่พลาด",
    note: "นี่คือจุดที่ห้ามข้ามที่สุดในแผน — ถ้าไม่ซ้อมจับเวลา จะไปเจอ “ทำไม่ทัน” ครั้งแรกในห้องสอบจริง · ตรวจแบบอาจารย์: ดูแค่คำตอบสุดท้าย ผิด = 0 ตอบทศนิยม ห้ามเศษส่วน",
    items: [
      ["d4a", <span>⭐⭐ <a href="#exam">#exam</a> · <b>Mock A</b> จับเวลา 180 นาที — ปิดโน้ต ใช้แค่เครื่องคิดเลข</span>],
      ["d4b", <span>ตรวจแบบอาจารย์: คำตอบสุดท้ายอย่างเดียว · ข้อ “แสดงวิธีทำ” ต้องมีวิธีเขียนไว้จริง</span>],
      ["d4c", <span><a href="#midterm">#midterm</a> · กรอกสมุดพลาด 🩺 ทุกข้อที่ไม่ได้คะแนน รวมข้อที่ทำไม่ทัน</span>],
      ["d4d", <span>ซ่อม: กลับไปทำการบ้านเรื่องที่พลาดซ้ำจนถูก (ไม่เปิดหัวข้อใหม่)</span>],
      ["d4e", <span>เย็น: <a href="#code">#code</a> หมวด 3 · เขียนทุกโครงลงกระดาษเปล่า</span>],
    ]},
  { id: "d5", title: "อา. 25 ต.ค. · Mock B + ทวนเบา ๆ", when: "~6 ชม.",
    goal: "Mock รอบสอง → ซ่อม → บ่ายทวนเบา ๆ แล้วนอนเร็ว",
    note: "รอบนี้วัดว่าซ่อมจากรอบ A ได้จริงไหม · อะไรที่ยังไม่เคยอ่านถึงวันนี้ = ปล่อยไป · สมองที่นอนพอทำข้อสอบได้ดีกว่าสมองที่อ่านเพิ่มอีก 3 ชั่วโมง",
    items: [
      ["d5a", <span>⭐ <a href="#exam">#exam</a> · <b>Mock B</b> จับเวลา 180 นาที</span>],
      ["d5b", <span>ซ่อม + เทียบกับสมุดพลาด 🩺 ว่าโรคเดิมยังอยู่ไหม</span>],
      ["d5c", <span>บ่าย: <a href="#memo">#memo</a> + <a href="#code">#code</a> ทวนเร็ว — ไม่เปิดเรื่องใหม่</span>],
      ["d5d", <span>เช็คเครื่องคิดเลข (ถ่าน · Statistics · Equation · Matrix) แล้วนอนเร็ว</span>],
    ]},
  { id: "d6", title: "จันทร์ 26 ต.ค. · วันสอบ", when: "ไฟนอล 50 คะแนน",
    goal: "ไม่มีอะไรใหม่ — ทำตามเกมแพลนที่ซ้อมมาแล้ว",
    note: "เกมแพลนในห้อง (ไม่ผูกกับจำนวนข้อ ใช้ได้ทุกฟอร์แมต): อ่านโจทย์ให้ครบทั้งฉบับใน 5 นาทีแรก → จัดอันดับว่าข้อไหนมั่นใจสุด → ทำข้อที่มั่นใจก่อน → เจอข้อที่ตันให้ข้ามทันที อย่าฝืน → เวลาที่เหลือคือ “ตรวจซ้ำข้อที่ทำแล้ว” ไม่ใช่เริ่มข้อใหม่",
    items: [
      ["d6a", "ตื่นมาทวนสมุดพลาด + โครงโค้ด 30 นาที ไม่แตะโจทย์ใหม่"],
      ["d6b", "5 นาทีแรกในห้อง — อ่านครบทุกข้อ ชี้ตัวข้อที่จะทิ้ง"],
      ["d6c", "ข้อ “แสดงวิธีทำ” — เขียนวิธีให้เห็น ไม่ใช่แค่คำตอบ"],
      ["d6d", "ทุกข้อที่ตอบเป็นตัวเลข — เช็คด้วยเครื่องอีกวิธี และตอบเป็นทศนิยมเท่านั้น ห้ามเศษส่วน"],
      ["d6e", "เหลือเวลา = ตรวจซ้ำข้อที่ทำแล้ว ไม่ใช่เริ่มข้อที่ยังไม่ได้แตะ"],
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
        title={`เหลือ ${left} วัน — แผน 6 วันสุดท้าย อ่านเต็มเวลา`}
        lead="ไฟนอล 50 คะแนน · คะแนนเก็บ 0 · มิด 17.33/40 ⇒ ต้องได้อย่างน้อย 22.67/50 (45.3%) ถึงจะผ่าน · เริ่มจริงวันที่ 20 ต.ค. อ่านเต็มเวลา ~8 ชม./วัน ≈ 45 ชม. · เน้น “ท่องโค้ด + ทำโจทย์การบ้าน” · ติ๊กไปทีละข้อ บันทึกอัตโนมัติ"
        readout={{
          label: "จันทร์ 26 ต.ค. 2569 · ไฟนอล 50 คะแนน",
          steps: [
            { x: "อ.–พ. Regression · Interp · Spline", w: 30 },
            { x: "พ.–ศ. Linear 7 วิธี · CG", w: 40 },
            { x: "ส.–อา. Mock ×2 + ซ่อม", w: 30 },
          ],
          result: "6",
          note: "วัน นับจาก 20 ต.ค. — ~8 ชม./วัน รวมราว 45 ชม.",
        }}
        meta={["เต็มเวลา ~8 ชม./วัน", "Mock 180 นาที × 2", "เขียนโค้ดจากความจำทุกเช้า", "ผ่าน D = 45.3% · เป้า 55%+"]}
      />

      <Callout kind="danger" title="⛔ แผน 6 วันนี้เลิกใช้แล้ว (23 ต.ค.)">
        <p style={{margin:0}}>เริ่มอ่านจริงวันศุกร์ 23 ⇒ เหลือ 3 วัน · ใช้ <b>ตาราง 3 วัน</b> ในหน้า <a href="#start">เริ่มที่นี่</a> แล้วอ่านเมนูกลุ่ม ① ตามลำดับ · หน้านี้เก็บไว้ดูย้อนหลังเท่านั้น</p>
      </Callout>

      <Callout kind="warn" title="🔄 รีเซ็ตรอบสอง 20 ต.ค. — ทำไมแผน 25 วันถูกแทนที่">
        <p style={{margin:"0 0 6px"}}>แผน 25 วัน (1 ต.ค.) วางบนเวลา ~2.5 ชม./วัน · ถึง 20 ต.ค. ยัง<b>แทบไม่ได้เริ่ม</b> แต่ตอนนี้อ่านได้<b>เต็มเวลา</b> และใบการบ้าน 11 (Regression) มาแล้ว ⇒ ขอบเขตครบ วางใหม่บนเวลาที่เหลือจริง</p>
        <p style={{margin:0}}>45 ชม. ยังพอสำหรับทุกเรื่องในขอบเขต ถ้าทำตามลำดับ — แผนนี้<b>เรียงตามคะแนนที่ได้ต่อชั่วโมง</b> ไม่ใช่ตามลำดับบท และมีลำดับตัดไว้ให้แล้วถ้าหลุด (ติ๊กของแผนเก่าไม่ถูกนำมา เพราะรายการเปลี่ยนหมด)</p>
      </Callout>

      <Callout kind="good" title="⭐ วิธีเรียนแต่ละเรื่อง — “ท่องโค้ด + ดูวิธีทำโจทย์” ที่ได้ผลจริง">
        <ol style={{margin:"0 0 6px", paddingLeft:20}}>
          <li>อ่านหมวดเฉลยการบ้านของบทนั้น (ทำมือ) — 20–30 นาที</li>
          <li><b>ปิดเฉลย</b> ทำโจทย์การบ้านเองบนกระดาษ → <b>เช็คคำตอบด้วยเครื่องคิดเลขอีกวิธี</b> (Reg Results · Simul Equation · Matrix) — เพราะอาจารย์ตรวจแค่คำตอบสุดท้าย ผิด = 0</li>
          <li>อ่านโค้ด 1 รอบ → ปิด → <b>เขียนบนกระดาษเปล่า</b> → เทียบ → จดบรรทัดที่ลืม → รันในแอปให้เห็นผล</li>
          <li>ทำโจทย์พลิก 1 ข้อ (ย้อนกลับ / ประยุกต์ — แบบที่พลาดตอนมิด)</li>
        </ol>
        <p style={{margin:0}}><b>ทุกเช้า 30 นาที:</b> เขียนโครงโค้ดของเมื่อวานใหม่จากความจำ — <b>อ่านโค้ดเข้าใจ ≠ เขียนออกมาได้เอง</b> และในห้องสอบไม่มีโพย · โครงทั้งหมดเป็นครอบครัวเดียวกัน (ดูแผนผังที่ <a href="#code">#code</a>) ไม่ใช่สิบกว่าโปรแกรมแยกกัน</p>
      </Callout>

      <Callout kind="danger" title="⚠︎ ขอบเขตไฟนอล — ยึดใบการบ้าน (ครบแล้ว ใบ 11 คือใบสุดท้าย)">
        <NumTable
          headers={["ออกไฟนอล", "รายละเอียด", "ที่มา"]}
          rows={[
            [<b>Linear · 7 วิธี</b>, "Gauss Elimination · Gauss-Jordan · Matrix Inversion · LU · Cholesky · Jacobi · Gauss-Seidel (Cramer ออกมิดไปแล้ว)", <span>การบ้าน 6-7 (สั่ง 8 วิธี)</span>],
            ["Conjugate Gradient", "โค้ด 4×4 ε = 1e-6 · f(x₁,x₂) + contour · พิสูจน์ λ, α", "การบ้าน 8"],
            ["Newton Divided-Difference", "x = 4.2 (เลขท้ายรหัส 2) · โค้ด 3 แบบ: recursive / DP top-down / DP bottom-up", "การบ้าน 9 + โพสต์อาจารย์ 19 ก.ย."],
            ["Lagrange + Linear Spline", "Lagrange linear/quad/poly ที่ x = 42,285 + โค้ด n จุด · Linear Spline ที่ x = 4.5 + โค้ด", "การบ้าน 10"],
            [<b>Least-Squares Regression</b>, "Linear + f(65) · Polynomial m = 2 · Multiple (x₁, x₂, x₃) — ทุกข้อมีเขียน code", <span>การบ้าน 11 (20 ต.ค.)</span>],
            ["Quadratic / Cubic Spline", <span>อยู่ในสไลด์ Interpolation + Spline หน้า 17–18 (ตัวหนังสือเล็ก) · <b>ไม่มีใบการบ้าน</b></span>, <span style={{color:"var(--yellow)"}}>kim ยืนยัน 20 ต.ค. ⇒ อยู่ในขอบเขต แต่ทำหลังสุด</span>],
          ]}
        />
        <p style={{margin:"8px 0 0"}}>ทุกหัวข้อมีบทรองรับในแอปครบ (<a href="#linear">#linear</a> · <a href="#interp">#interp</a> · <a href="#spline">#spline</a> · <a href="#regression">#regression</a> · <a href="#conjugate">#conjugate</a>) · Integration / Diff / Root / Cramer ออกมิดไปแล้ว</p>
      </Callout>

      <Sect tag="📊" title="เป้าที่ต้องไปให้ถึง — คิดเป็น % ของไฟนอล">
        <Callout kind="danger" title="⛔ อย่าวางแผนจากสมมติว่าไฟนอลหน้าตาเหมือนมิด">
          <p style={{margin:0}}>ที่เคยได้ยินว่า &ldquo;ครึ่งโค้ดครึ่งมือ&rdquo; คือสิ่งที่อาจารย์บรีฟ<b>ก่อนสอบมิด</b> — ไฟนอลอาจไม่เหมือนกัน ⇒ เป้าในหน้านี้จึงเป็น <b>% ของคะแนนไฟนอล</b> ไม่ใช่ &ldquo;ทำถูกกี่ข้อ&rdquo; · ที่ยึดได้จริง: ① ขอบเขตเดินตามใบการบ้าน ② ตรวจแค่คำตอบสุดท้าย ผิด = 0 · ตอบทศนิยม ห้ามเศษส่วน ③ ข้อ &ldquo;แสดงวิธีทำ&rdquo; ต้องเขียนวิธีด้วย</p>
        </Callout>

        <NumTable
          headers={["เป้า", "ต้องได้จากไฟนอล", "= กี่ % ของไฟนอล", "รวมทั้งวิชา (/90)"]}
          highlight={1}
          rows={[
            [<b>D — ผ่าน (เส้นตาย)</b>, <b>22.67 / 50</b>, <b>45.3%</b>, <span>40.00 พอดี · <b>39.5 ก็ยัง F</b> (อาจารย์เขียนเอง ไม่ปัดขึ้น)</span>],
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
              [<b>ลืมสูตร</b>, "เดินตารางเป็น แต่นึกสูตรไม่ออก", <span><a href="#memo">#memo</a> 10 นาที + เขียนโค้ดจากความจำทุกเช้า</span>],
              [<b>อ่านโจทย์ประยุกต์ไม่ออก</b>, <span>ข้อจรวด — <b>ลืมว่า h คือระยะห่างในตาราง</b></span>, "ทุกเรื่องต้องทำโจทย์พลิก 1 ข้อ (🔀 ในเช็คลิสต์) + Mock 2 รอบ"],
              [<b>โจทย์ย้อนกลับ</b>, "ให้ผลลัพธ์มา แล้วให้หา input", "Regression R-A/R-B (อ.) · Spline S-A (พ.) · Mock"],
              [<b>เลือกช่วงเอง</b>, "กดเครื่องแล้วรากไม่อยู่ในช่วงที่เลือก", "Spline: หา segment ก่อนแทนสูตร (พ.)"],
            ]}
          />
          <p style={{margin:"8px 0 0"}}><b>ที่ได้ผล:</b> ข้อ Cramer ได้คะแนนเพราะ<b>ซ้อมทั้งมือและโค้ดมาแล้ว</b> ⇒ กติกาของแผนนี้: <b>ทุกเรื่อง = ทำมือ + โค้ด + โจทย์พลิก 1 ข้อ</b> · และโค้ดทุกลูปที่วนหาคำตอบต้อง<b>หยุดด้วย tolerance</b> ไม่ใช่จำนวนรอบ (กฎอาจารย์)</p>
        </Callout>
      </Sect>

      <Sect tag="🎯" title="จัดลำดับความสำคัญ — ทำจากบนลงล่าง">
        <NumTable
          headers={["ระดับ", "หัวข้อ", "เพราะอะไร"]}
          rows={[
            [<b>🟥 ห้ามพลาด</b>, "Linear/Polynomial Regression · Newton DD · Lagrange · Linear Spline · Gauss Elimination · Jacobi/Gauss-Seidel", "อยู่ในใบการบ้าน ทำมือได้เร็ว และเครื่องคิดเลขเช็คคำตอบได้ — นี่คือแกนของ 55%"],
            [<b>🟧 ควรได้</b>, "Multiple Regression (ฟังก์ชันเดิม) · Gauss-Jordan / Inversion · LU · โค้ด CG (การบ้าน 8)", "ต่อยอดจากโครงเดิมแค่ไม่กี่บรรทัด คุ้มเวลา"],
            [<b>🟨 ถ้ามีเวลา</b>, "Cholesky · Quadratic Spline", "ใช้เวลามากกว่าเมื่อเทียบคะแนน · Quadratic Spline ไม่มีใบการบ้าน"],
            [<span className="muted">⬜ ตัดก่อน</span>, <span className="muted">Cubic Spline · พิสูจน์ λ/α + contour ของ CG</span>, <span className="muted">กินเวลามากที่สุด ได้คะแนนน้อยที่สุดต่อชั่วโมง</span>],
          ]}
        />
      </Sect>

      <Sect tag="🗓" title="แผน 6 วัน — ติ๊กไปทีละข้อ">
        <PlanChecklist/>
      </Sect>

      <Sect tag="✂️" title="ถ้าตามไม่ทัน — ตัดตามลำดับนี้">
        <p><b>ตัดตามลำดับนี้ อย่าตัดมั่ว</b> — เรียงจาก &ldquo;เสียคะแนนน้อยที่สุด&rdquo; ไป &ldquo;มากที่สุด&rdquo;</p>
        <NumTable
          headers={["ลำดับตัด", "ตัดอะไร", "เพราะอะไร"]}
          rows={[
            ["1 · ตัดก่อนเลย", "พิสูจน์ λ, α + contour ของ CG (d3d)", "เก็บแค่โค้ด CG (การบ้าน 8 ข้อ 1) ไว้ก็พอ"],
            ["2", "Cubic Spline (d3f)", "ระบบสมการใหญ่ กินเวลามาก · ไม่มีใบการบ้าน"],
            ["3", "Quadratic Spline (d3e)", "ไม่มีใบการบ้าน — แต่ห้ามตัด Linear Spline"],
            ["4", "Cholesky ทำมือ (d2e)", "เก็บโครงโค้ด H ไว้ถ้าทำได้ (ใช้ substitution ชุดเดียวกับ LU)"],
            [<b>ห้ามตัด</b>, <b>โครง E (Gauss) · J (Jacobi/GS) · R (Regression)</b>, "E เป็นแม่ของ Jordan / Inversion / LU / Spline · J คือที่กฎ tolerance ใช้จริง · R ตอบการบ้าน 11 ได้ทั้งใบ"],
            [<b>ห้ามตัด</b>, <b>Newton DD (โค้ดครบ 3 แบบ) + Lagrange + Linear Spline</b>, "การบ้าน 9–10 สั่งตรง ๆ ทั้งมือและโค้ด · โค้ด DD 3 แบบ อาจารย์โพสต์สั่งเอง 19 ก.ย. — top-down คือ recursive + memo อีก 3 บรรทัด"],
            [<b>ห้ามตัด</b>, <b>Mock อย่างน้อย 1 รอบ (d4a)</b>, "ไม่งั้นจะเจอ “ทำไม่ทัน” ครั้งแรกในห้องสอบจริง"],
            [<b>ห้ามตัด</b>, <b>การนอน</b>, "อ่านเต็มเวลา 6 วันติด ถ้าอดนอนจะพลาดเลขง่าย ๆ ในห้อง — และผิด = 0"],
          ]}
        />
      </Sect>

      <Sect tag="📌" title="ที่มาของแผนนี้ — กำกับไว้ทุกบรรทัดตามกฎ">
        <NumTable
          headers={["ข้อมูล", "แหล่ง", "ความน่าเชื่อ"]}
          rows={[
            ["มิด 17.33/40 · คะแนนเก็บ 0 · ต้องผ่านถึงจะจบ", "คะแนนจริง (ออก 10 ก.ย.) + kim", "สูงสุด"],
            ["ขอบเขต: Linear 7 วิธี · CG · Newton DD · Lagrange · Linear Spline · Regression", "ใบการบ้าน 6-7 · 8 · 9 · 10 · 11", "สูงสุด — ใบงานปีนี้"],
            ["Quadratic / Cubic Spline อยู่ในขอบเขต", "สไลด์ Interpolation + Spline หน้า 17–18 + kim ยืนยัน 20 ต.ค.", "สูง (แต่ไม่มีใบการบ้าน)"],
            ["ข้อมูลการบ้าน 11 = ชุดเดียวกับชีทสรุป Final ปีที่แล้วหน้า 19", "เทียบตัวเลขแล้ว ผลตรงกันทุกตัว", "สูง"],
            ["ตรวจแค่คำตอบ · ผิด = 0 · ห้ามเศษส่วน · “แสดงวิธีทำ” ต้องเขียนวิธี", "kim + ไฟล์เสียงคาบ 5 ส.ค. (transcripts/w6.txt)", "สูง"],
            [<span className="muted">“ครึ่งโค้ดครึ่งมือ”</span>, <span className="muted">บรีฟ<b>ก่อนมิด</b> (ไฟล์เสียงเดียวกัน)</span>, <span style={{color:"var(--yellow)"}}>⛔ ไม่รับประกันว่าไฟนอลจะเหมือน — อย่าตรึง</span>],
            ["F = คะแนนรวม < 40 · ไม่ปัดขึ้น (39 · 39.2 · 39.5 ก็ F)", "โพสต์ Classroom ของอาจารย์ 24 มิ.ย.", "สูงสุด — อาจารย์เขียนเอง"],
            ["สถิติมิดทั้งห้อง: เฉลี่ย 13.46 · SD 9.17 · ต่ำสุด 0 · สูงสุด 38.22 (เต็ม 40)", "โพสต์ Classroom ของอาจารย์ 9 ก.ย.", "สูงสุด"],
            ["โค้ด DD ต้องได้ 3 แบบ: recursive · DP top-down · DP bottom-up (ตารางตามชีท)", "โพสต์ Classroom ของอาจารย์ 19 ก.ย.", "สูงสุด — อาจารย์เขียนเอง"],
            ["ลูปต้องหยุดด้วย tolerance ไม่ใช่จำนวนรอบ", "kim เล่าเหตุที่สอบท้ายคาบได้ 1 เต็ม 6", "สูง"],
            ["อ่านเต็มเวลา · แทบยังไม่เริ่ม ณ 20 ต.ค.", "kim (20 ต.ค.)", "สูงสุด"],
          ]}
        />
      </Sect>
    </div>
  );
}

window.PlanLesson = PlanLesson;
