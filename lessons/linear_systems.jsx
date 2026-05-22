// Linear Systems — Gauss, Gauss-Jordan, Cramer, Inversion, LU, Cholesky, Jacobi, Gauss-Seidel

const { useState: useStL, useMemo: useMmL } = React;

// === Helper: pretty-print a number as KaTeX cell ===
function num(v, p = 4) {
  if (v == null || isNaN(v)) return "—";
  return (+v).toFixed(p).replace(/\.?0+$/, "");
}

// === Matrix display ===
function MatrixView({ M, highlight, label, vector = null }) {
  // M can be augmented matrix
  return (
    <div className="card tight" style={{display:"inline-block", padding:"10px 16px"}}>
      {label && <div className="kicker" style={{marginBottom:6}}>{label}</div>}
      <table style={{borderCollapse:"collapse", fontFamily:"var(--font-mono)", fontSize:13}}>
        <tbody>
          {M.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) => {
                const isAug = j === row.length - 1 && vector !== false;
                const isHi = highlight && highlight.r === i && (highlight.c === j || highlight.col === j);
                const isHiRow = highlight && highlight.row === i;
                return (
                  <td key={j} style={{
                    padding: "4px 10px",
                    color: isHi ? "#ffd66b" : (isHiRow ? "#58c4dd" : "#e6edf3"),
                    background: isHi ? "rgba(255,214,107,0.12)" : (isHiRow ? "rgba(88,196,221,0.06)" : "transparent"),
                    borderLeft: isAug ? "2px solid var(--border-strong)" : "none",
                    borderRadius: 4,
                    textAlign:"right",
                    minWidth: 60,
                  }}>{Number(v.toFixed(4))}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// === Gauss Elimination animated viz ===
function GaussViz({ A0, b0 }) {
  const result = useMmL(() => gaussElim(A0.map(r => r.slice()), b0.slice()), [A0, b0]);
  const steps = result.steps.length;
  return (
    <div>
      <StepPlayer steps={steps} stepDuration={1300} label={(s) => `Step ${s+1}/${steps}`}>
        {({ step }) => {
          const s = result.steps[step];
          return (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:14}}>
              <MatrixView M={s.M} label={`[A | b]`} />
              <div style={{fontFamily:"var(--font-mono)", fontSize:13, color:"var(--yellow)"}}>{s.msg}</div>
            </div>
          );
        }}
      </StepPlayer>
      <div className="callout good" style={{marginTop:10}}>
        <b>คำตอบ:</b> {result.x.map((v, i) => <span key={i} style={{marginRight:14, fontFamily:"var(--font-mono)"}}>x{i+1} = {v.toFixed(6)}</span>)}
      </div>
    </div>
  );
}

// === Jacobi / Gauss-Seidel comparator ===
function IterativeSolver({ method = "jacobi" }) {
  const A = [[-3, 1, 12], [6, 8, 2], [4, 11, -1]];
  const b = [50, 38, 40];
  // Need diagonal dominance for convergence — let me use a better example
  const A2 = [[5, 1, 1], [1, 5, 1], [1, 1, 5]];
  const b2 = [7, 7, 7]; // x = [1,1,1]
  const x0 = [0, 0, 0];

  const fn = method === "jacobi" ? jacobi : gaussSeidel;
  const { rows } = useMmL(() => fn(A2, b2, x0, 20), [method]);

  return (
    <div>
      <p className="muted">ระบบสมการ: <M>{`5x_1+x_2+x_3=7,\\quad x_1+5x_2+x_3=7,\\quad x_1+x_2+5x_3=7`}</M> (คำตอบจริง = (1, 1, 1))</p>
      <NumTable
        headers={["k", "x₁", "x₂", "x₃", "‖Δx‖/‖x‖"]}
        rows={rows.map(r => [r.iter, ...r.x, r.err === null ? "—" : r.err.toExponential(2)])}
      />
    </div>
  );
}

// === Gauss-Jordan animated viz ===
function GaussJordanViz({ A0, b0 }) {
  const result = useMmL(() => gaussJordan(A0.map(r => r.slice()), b0.slice()), [A0, b0]);
  const steps = result.steps.length;
  return (
    <div>
      <StepPlayer steps={steps} stepDuration={1100} label={(s) => `Step ${s+1}/${steps}`}>
        {({ step }) => {
          const s = result.steps[step];
          return (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:12}}>
              <MatrixView M={s.M} label={`[A | b] → กำลังแปลงเป็น [I | x]`}/>
              <div style={{fontFamily:"var(--font-mono)", fontSize:13, color:"var(--yellow)"}}>{s.msg}</div>
            </div>
          );
        }}
      </StepPlayer>
      {result.x && <div className="callout good" style={{marginTop:10}}>
        <b>คำตอบ:</b> {result.x.map((v, i) => <span key={i} style={{marginRight:14, fontFamily:"var(--font-mono)"}}>x{i+1} = {num(v, 6)}</span>)}
      </div>}
    </div>
  );
}

// === Cramer's rule viz ===
function CramerViz({ A0, b0 }) {
  const result = useMmL(() => cramer(A0.map(r=>r.slice()), b0.slice()), [A0, b0]);
  const n = A0.length;
  return (
    <div>
      {result.error
        ? <Callout kind="danger">{result.error}</Callout>
        : <>
          <div style={{display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center"}}>
            {result.steps.map((s, i) => (
              <div key={i} className="card tight" style={{padding:"10px 14px"}}>
                <div className="kicker" style={{marginBottom:4}}>{s.label} = <b style={{color:"var(--yellow)"}}>{num(s.value, 4)}</b></div>
                <MatrixView M={s.matrix} vector={false}/>
                {s.x !== undefined && <div style={{fontFamily:"var(--font-mono)", marginTop:4, color:"var(--green)"}}>
                  x{i} = {num(s.value, 4)} / {num(result.D, 4)} = <b>{num(s.x, 6)}</b>
                </div>}
              </div>
            ))}
          </div>
        </>
      }
    </div>
  );
}

// === LU Decomposition viz ===
function LUViz({ A0, b0 }) {
  const result = useMmL(() => solveLU(A0.map(r=>r.slice()), b0.slice()), [A0, b0]);
  if (result.error) return <Callout kind="danger">{result.error}</Callout>;
  return (
    <div style={{display:"flex", flexDirection:"column", gap:14, alignItems:"center"}}>
      <div style={{display:"flex", gap:18, flexWrap:"wrap", justifyContent:"center"}}>
        <MatrixView M={result.L} label="L (สามเหลี่ยมล่าง, diagonal=1)" vector={false}/>
        <MatrixView M={result.U} label="U (สามเหลี่ยมบน)" vector={false}/>
      </div>
      <div className="grid-2" style={{width:"100%", gap:14}}>
        <div className="card tight">
          <div className="kicker">Step 1 · Forward — Ly = b</div>
          {result.steps.forward.map((r, i) => (
            <div key={i} style={{fontFamily:"var(--font-mono)", fontSize:12, padding:"2px 0"}}>
              y{i+1} = <b style={{color:"var(--yellow)"}}>{num(r.val, 6)}</b>
            </div>
          ))}
        </div>
        <div className="card tight" style={{borderColor:"var(--green-dim)"}}>
          <div className="kicker" style={{color:"var(--green)"}}>Step 2 · Backward — Ux = y</div>
          {result.steps.backward.map((r, i) => (
            <div key={i} style={{fontFamily:"var(--font-mono)", fontSize:12, padding:"2px 0"}}>
              x{r.i+1} = <b style={{color:"var(--green)"}}>{num(r.val, 6)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// === Cholesky viz ===
function CholeskyViz({ A0, b0 }) {
  const result = useMmL(() => solveCholesky(A0.map(r=>r.slice()), b0.slice()), [A0, b0]);
  if (result.error) return <Callout kind="danger">{result.error}</Callout>;
  // Build L^T from L
  const LT = result.L[0].map((_, j) => result.L.map(r => r[j]));
  return (
    <div style={{display:"flex", flexDirection:"column", gap:14, alignItems:"center"}}>
      <StepPlayer steps={result.steps.length} stepDuration={900} label={(s) => `Step ${s+1}/${result.steps.length}`}>
        {({ step }) => {
          const s = result.steps[step];
          return (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
              <MatrixView M={s.L} label={`L กำลังสร้าง (i=${s.i+1}, j=${s.j+1})`} highlight={{r: s.i, c: s.j}} vector={false}/>
              <div style={{fontFamily:"var(--font-mono)", fontSize:12, color:"var(--yellow)"}}>{s.expr}</div>
            </div>
          );
        }}
      </StepPlayer>
      <div style={{display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center"}}>
        <MatrixView M={result.L} label="L" vector={false}/>
        <MatrixView M={LT} label="Lᵀ" vector={false}/>
      </div>
      <div className="callout good">
        <b>คำตอบ:</b> {result.x.map((v, i) => <span key={i} style={{marginRight:14, fontFamily:"var(--font-mono)"}}>x{i+1} = {num(v, 6)}</span>)}
      </div>
    </div>
  );
}

// === Matrix Inverse viz ===
function InverseViz({ A0 }) {
  const result = useMmL(() => matrixInverse(A0.map(r=>r.slice())), [A0]);
  if (result.error) return <Callout kind="danger">{result.error}</Callout>;
  return (
    <div>
      <StepPlayer steps={result.steps.length} stepDuration={1000} label={(s) => `Step ${s+1}/${result.steps.length}`}>
        {({ step }) => {
          const s = result.steps[step];
          return (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
              <MatrixView M={s.M} label="[A | I] → [I | A⁻¹]" vector={false}/>
              <div style={{fontFamily:"var(--font-mono)", fontSize:13, color:"var(--yellow)"}}>{s.msg}</div>
            </div>
          );
        }}
      </StepPlayer>
      <div style={{display:"flex", justifyContent:"center", marginTop:10}}>
        <MatrixView M={result.inv} label="A⁻¹" vector={false}/>
      </div>
    </div>
  );
}

// === Generic 3x3 system solver shell — reusable across all direct methods ===
function DirectSolverShell({ method = "gauss", title }) {
  // Editable 3x3 system; user can choose method
  const defaultA = [["3","-0.1","-0.2"],["0.1","7","-0.3"],["0.3","-0.2","10"]];
  const defaultB = ["7.85","-19.3","71.4"];
  const [A, setA] = useStL(defaultA);
  const [b, setB] = useStL(defaultB);
  const [result, setResult] = useStL(null);
  const [err, setErr] = useStL("");

  const run = () => {
    const An = parseMat(A, 3, 3); const bn = parseVec(b, 3);
    if (!An || !bn) { setErr("กรอกตัวเลขให้ครบทุกช่อง"); return; }
    setErr("");
    try {
      if (method === "gauss") setResult(gaussElim(An.map(r=>r.slice()), bn.slice()));
      else if (method === "gauss-jordan") setResult(gaussJordan(An.map(r=>r.slice()), bn.slice()));
      else if (method === "cramer") setResult(cramer(An.map(r=>r.slice()), bn.slice()));
      else if (method === "inverse") setResult(solveByInverse(An.map(r=>r.slice()), bn.slice()));
      else if (method === "lu") setResult(solveLU(An.map(r=>r.slice()), bn.slice()));
      else if (method === "cholesky") setResult(solveCholesky(An.map(r=>r.slice()), bn.slice()));
    } catch (e) { setErr("คำนวณไม่ได้: " + e.message); }
  };

  return (
    <SolverShell
      title={title}
      inputs={
        <div className="input-row">
          <div><div style={{fontSize:11, color:"var(--text-faint)", marginBottom:4}}>A</div><MatrixInput value={A} onChange={setA} rows={3} cols={3} prefix="a"/></div>
          <div><div style={{fontSize:11, color:"var(--text-faint)", marginBottom:4}}>b</div><MatrixInput value={b.map(x=>[x])} onChange={(M) => setB(M.map(r=>r[0]))} rows={3} cols={1} prefix="b"/></div>
        </div>
      }
      onRun={run}
      error={err}
      output={result && (result.x
        ? <div className="callout good">
            <b>x =</b> {result.x.map((v,i) => <span key={i} style={{marginRight:14, fontFamily:"var(--font-mono)"}}>x{i+1} = {num(v, 8)}</span>)}
            {method === "cramer" && <div style={{fontSize:12, color:"var(--text-dim)", marginTop:4}}>det(A) = {num(result.D, 6)}</div>}
            {method === "lu" && <div style={{fontSize:12, color:"var(--text-dim)", marginTop:4}}>y (intermediate) = {result.y.map(v=>num(v,4)).join(", ")}</div>}
          </div>
        : <Callout kind="danger">{result.error || "no solution"}</Callout>)
      }
    />
  );
}

function LinearSystemsLesson() {
  const A0 = [[3, -0.1, -0.2], [0.1, 7, -0.3], [0.3, -0.2, 10]];
  const b0 = [7.85, -19.3, 71.4];

  // small SPD matrix for Cholesky demo
  const Aspd = [[4, 2, -2], [2, 10, 2], [-2, 2, 5]];
  const bspd = [2, 20, 5];

  return (
    <div>
      <Hero
        kicker="02 · Linear Systems"
        title="Gauss Elimination & Iterative Methods"
        lead="แก้ระบบสมการเชิงเส้น Ax = b — ตั้งแต่ Gauss กำจัด direct method ไปจนถึง Jacobi และ Gauss-Seidel"
        meta={["Direct method", "Iterative methods", "Convergence", "fx-991CW Equation"]}
      />

      <Sect tag="0" title="ทำไมต้องมี 2 family">
        <p>มี 2 กลุ่มใหญ่:</p>
        <div className="grid-2">
          <Callout kind="good" title="Direct methods (กำจัดตรง ๆ)">
            <p>Gauss Elimination, Gauss-Jordan, LU — <b>คำนวณจบในขั้นตอนตายตัว</b> เช่น <M>{`n^3/3`}</M> operations</p>
            <p className="muted" style={{fontSize:13, marginBottom:0}}>เหมาะกับ matrix เล็ก ๆ (n &lt; 1000) — แม่นยำเป๊ะ</p>
          </Callout>
          <Callout kind="tip" title="Iterative methods (ทำซ้ำ)">
            <p>Jacobi, Gauss-Seidel, Conjugate Gradient — <b>เดาคำตอบ + ปรับเข้าใกล้</b>เรื่อย ๆ</p>
            <p className="muted" style={{fontSize:13, marginBottom:0}}>เหมาะ matrix ใหญ่ + sparse (มีศูนย์เยอะ) — ประหยัด memory</p>
          </Callout>
        </div>
      </Sect>

      <Sect tag="1" title="Gauss Elimination — Direct method พื้นฐาน">
        <h3>แนวคิด · ทำให้ matrix เป็น Upper Triangular</h3>
        <p>เป้าหมาย: ทำให้ matrix อยู่ในรูป <em>สามเหลี่ยมบน</em> เพื่อจะ back-substitute หาค่า x ได้ง่าย</p>

        <Formula label="Forward elimination">
          <MB>{`\\begin{bmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{bmatrix} \\xrightarrow{\\text{elimination}} \\begin{bmatrix} a_{11} & a_{12} & a_{13} \\\\ 0 & a'_{22} & a'_{23} \\\\ 0 & 0 & a''_{33} \\end{bmatrix}`}</MB>
        </Formula>

        <h4>กระบวนการ — Forward Elimination</h4>
        <ol>
          <li>เลือก pivot = แถวบนสุดของคอลัมน์ปัจจุบัน</li>
          <li>คำนวณ factor: <M>{`m_{ik} = a_{ik}/a_{kk}`}</M> (แถว i, คอลัมน์ k)</li>
          <li>หักออก: <M>{`R_i \\leftarrow R_i - m_{ik}\\cdot R_k`}</M></li>
          <li>ทำซ้ำกับทุกแถวด้านล่าง pivot</li>
        </ol>

        <h4>Back Substitution</h4>
        <Formula>
          <MB>{`x_n = \\frac{b_n^{(n)}}{a_{nn}^{(n)}}, \\quad x_i = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j=i+1}^{n} a_{ij} x_j\\right)`}</MB>
        </Formula>

        <h3>เห็นภาพ — ตัวอย่าง 3×3</h3>
        <p>ระบบสมการ:</p>
        <MB>{`\\begin{cases} 3x_1 - 0.1x_2 - 0.2x_3 = 7.85 \\\\ 0.1x_1 + 7x_2 - 0.3x_3 = -19.3 \\\\ 0.3x_1 - 0.2x_2 + 10x_3 = 71.4 \\end{cases}`}</MB>
        <GaussViz A0={A0} b0={b0}/>

        <h3>fx-991CW · ใช้โหมด Equation</h3>
        <Callout title="วิธีไวที่สุด — เครื่องคิดเลข">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Equation</Key> → เลือก <Key>Simul Equation</Key></span>,
            <span>เลือกจำนวนตัวแปร (2 / 3 / 4)</span>,
            <span>กรอกค่า <M>a_{11}</M>, <M>a_{12}</M>, ... , <M>b_n</M></span>,
            <span>กด <Key>=</Key> → เครื่องแสดง x₁, x₂, x₃ ทันที</span>,
            <span><b>แต่</b> — ข้อสอบมักให้แสดง <em>ขั้นตอนการ eliminate</em> ดังนั้นต้องทำมือเป็นด้วย</span>,
          ]}/>
        </Callout>

        <h3>Python — Gauss Elimination จาก 0</h3>
        <PythonRunner code={`def gauss_elim(A, b):
    n = len(A)
    # augmented matrix
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    
    # Forward elimination
    for k in range(n):
        # (pivoting omitted for brevity)
        for i in range(k+1, n):
            factor = M[i][k] / M[k][k]
            for j in range(k, n+1):
                M[i][j] -= factor * M[k][j]
        print(f"After eliminating col {k+1}:")
        for row in M:
            print("  ", [f"{v:8.4f}" for v in row])
    
    # Back substitution
    x = [0] * n
    for i in range(n-1, -1, -1):
        s = M[i][n]
        for j in range(i+1, n):
            s -= M[i][j] * x[j]
        x[i] = s / M[i][i]
    return x

A = [[3, -0.1, -0.2],
     [0.1, 7, -0.3],
     [0.3, -0.2, 10]]
b = [7.85, -19.3, 71.4]
x = gauss_elim(A, b)
print(f"\\nx = {[round(v, 6) for v in x]}")`} height={280}/>

        <h3>Interactive · แก้ระบบของคุณเอง</h3>
        <DirectSolverShell method="gauss" title="Gauss Elimination — Solver"/>
      </Sect>

      <Sect tag="2" title="Gauss-Jordan — Forward + Backward Elimination">
        <p>คล้าย Gauss แต่<em>ลบทั้งบนและล่าง pivot</em> + หารแถว pivot ด้วย <M>{`a_{kk}`}</M> → ได้ matrix <b>เอกลักษณ์</b></p>

        <Formula label="ก่อน vs หลัง Gauss-Jordan">
          <MB>{`[A|b] \\to [I|x]`}</MB>
        </Formula>

        <p>คำตอบโผล่ในคอลัมน์ขวาเลย ไม่ต้อง back-substitute</p>

        <Callout kind="tip" title="ข้อแตกต่าง">
          <ul style={{margin:0}}>
            <li>Gauss → triangular → back-sub <span className="tag green">เร็วกว่า (~50%)</span></li>
            <li>Gauss-Jordan → identity → คำตอบทันที <span className="tag yellow">ใช้คำนวณ A⁻¹ ได้</span></li>
          </ul>
        </Callout>

        <h3>Animation · ดูทีละ row operation</h3>
        <GaussJordanViz A0={A0} b0={b0}/>

        <h3>Python — Gauss-Jordan</h3>
        <PythonRunner code={`def gauss_jordan(A, b):
    n = len(A)
    M = [row[:] + [b[i]] for i, row in enumerate(A)]
    for k in range(n):
        # partial pivot
        piv = max(range(k, n), key=lambda i: abs(M[i][k]))
        if piv != k:
            M[k], M[piv] = M[piv], M[k]
        d = M[k][k]
        for j in range(n+1):
            M[k][j] /= d
        for i in range(n):
            if i != k and M[i][k] != 0:
                f = M[i][k]
                for j in range(n+1):
                    M[i][j] -= f * M[k][j]
    return [row[n] for row in M]

A = [[4,-1,1], [2,3,-1], [1,2,5]]
b = [5, 6, 7]
print("x =", [round(v,6) for v in gauss_jordan(A, b)])`} height={220}/>

        <h3>Interactive</h3>
        <DirectSolverShell method="gauss-jordan" title="Gauss-Jordan — Solver"/>
      </Sect>

      <Sect tag="3" title="Cramer's Rule — กฎคราเมอร์">
        <h3>แนวคิด · ใช้ determinant ล้วน ๆ</h3>
        <p>ถ้า <M>{`\\det(A) \\neq 0`}</M> ระบบ <M>Ax=b</M> มีคำตอบเดียว และ:</p>
        <Formula label="Cramer's Rule">
          <MB>{`x_i = \\frac{\\det(A_i)}{\\det(A)}`}</MB>
          <p style={{fontSize:13, color:"var(--text-dim)", margin:"6px 0 0"}}>โดย <M>A_i</M> คือ matrix A ที่<b>แทนคอลัมน์ที่ i ด้วย b</b></p>
        </Formula>

        <Callout kind="warn" title="ข้อจำกัด — ทำได้แต่ matrix เล็ก ๆ">
          <p>ต้องคำนวณ <M>n+1</M> determinant ขนาด <M>n \times n</M> — ค่าใช้จ่าย <M>O((n+1) \cdot n!)</M> สำหรับวิธี cofactor — ใหญ่กว่า n=4 ก็ไม่ไหวแล้ว</p>
          <p style={{margin:0}}>แต่ <b>ออกข้อสอบบ่อย</b> เพราะแสดงแนวคิด matrix det ได้ชัด</p>
        </Callout>

        <h3>ตัวอย่างทำมือ — 3×3</h3>
        <p>ระบบ <M>{`A x = b`}</M>:</p>
        <MB>{`A = \\begin{bmatrix} -2 & 3 & 1 \\\\ 3 & 4 & -5 \\\\ 1 & -2 & 1 \\end{bmatrix}, \\quad b = \\begin{bmatrix} 9 \\\\ 0 \\\\ -4 \\end{bmatrix}`}</MB>
        <p>คำนวณ <M>{`\\det(A)`}</M> ก่อน → แล้วสลับคอลัมน์ทีละคอลัมน์เพื่อหา <M>{`\\det(A_1), \\det(A_2), \\det(A_3)`}</M></p>
        <CramerViz A0={[[-2,3,1],[3,4,-5],[1,-2,1]]} b0={[9,0,-4]}/>

        <h3>fx-991CW · ใช้เครื่องช่วยหา det</h3>
        <Callout title="วิธีกดเครื่อง">
          <CalcSteps steps={[
            <span><Key>HOME</Key> → <Key>Matrix</Key> → <Key>Define Matrix</Key> → เลือก MatA</span>,
            <span>ขนาด 3×3 → กรอกค่า A</span>,
            <span>กลับมาหน้าคำนวณ → <Key>OPTN</Key> → <Key>Matrix Calc</Key> → <Key>det(</Key> → <Key>MatA</Key> → <Key>=</Key></span>,
            <span>เก็บลงตัวแปร: <Key>STO</Key> → A (เก็บ det(A) ไว้)</span>,
            <span>กลับ Define Matrix → MatB = A แต่แทนคอลัมน์ที่ 1 ด้วย b → หา det → หาร A → ได้ x₁</span>,
            <span>ทำซ้ำกับคอลัมน์ 2, 3</span>,
          ]}/>
        </Callout>

        <h3>Python — Cramer ครบสูตร</h3>
        <PythonRunner code={`import numpy as np

def cramer(A, b):
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    D = np.linalg.det(A)
    print(f"det(A) = {D:.6f}")
    if abs(D) < 1e-12:
        raise ValueError("det(A) = 0 — ไม่มีคำตอบเดียว")
    n = len(b)
    x = []
    for i in range(n):
        Ai = A.copy()
        Ai[:, i] = b
        Di = np.linalg.det(Ai)
        xi = Di / D
        print(f"det(A_{i+1}) = {Di:.6f}  →  x_{i+1} = {xi:.6f}")
        x.append(xi)
    return x

A = [[-2,3,1],[3,4,-5],[1,-2,1]]
b = [9, 0, -4]
print("\\nx =", cramer(A, b))`} height={240}/>

        <h3>Interactive</h3>
        <DirectSolverShell method="cramer" title="Cramer's Rule — Solver"/>
      </Sect>

      <Sect tag="4" title="Matrix Inversion — แก้ผ่าน A⁻¹">
        <h3>แนวคิด · หา A⁻¹ แล้วคูณ b</h3>
        <p>ถ้ารู้ <M>A^{`-1`}</M> ก็แก้ <M>Ax=b</M> ได้ทันที:</p>
        <Formula><MB>{`x = A^{-1} b`}</MB></Formula>
        <p>การหา <M>A^{`-1`}</M> ใช้ Gauss-Jordan บน augmented matrix:</p>
        <Formula label="วิธีหา A⁻¹"><MB>{`[\\,A \\mid I\\,] \\xrightarrow{\\text{Gauss-Jordan}} [\\,I \\mid A^{-1}\\,]`}</MB></Formula>

        <Callout kind="warn" title="ทำเป็น 2 ขั้น">
          <ol style={{margin:0, paddingLeft:18}}>
            <li>วาง matrix A กับ I ติดกัน เป็น augmented n × 2n</li>
            <li>ทำ row operations จนซ้ายเป็น I → ขวากลายเป็น A⁻¹</li>
          </ol>
        </Callout>

        <h3>ตัวอย่างทำมือ — 3×3</h3>
        <p>ระบบ <M>{`A = \\begin{pmatrix} 4 & -1 & 1 \\\\ 2 & 3 & -1 \\\\ 1 & 2 & 5 \\end{pmatrix}`}</M></p>
        <InverseViz A0={[[4,-1,1],[2,3,-1],[1,2,5]]}/>

        <h3>Python — Matrix Inversion</h3>
        <PythonRunner code={`import numpy as np

def matrix_inverse_gj(A):
    n = len(A)
    M = [row[:] + [1.0 if i==j else 0.0 for j in range(n)] for i, row in enumerate(A)]
    for k in range(n):
        piv = max(range(k, n), key=lambda i: abs(M[i][k]))
        if piv != k: M[k], M[piv] = M[piv], M[k]
        d = M[k][k]
        for j in range(2*n): M[k][j] /= d
        for i in range(n):
            if i != k and M[i][k] != 0:
                f = M[i][k]
                for j in range(2*n): M[i][j] -= f * M[k][j]
    return [row[n:] for row in M]

A = [[4,-1,1],[2,3,-1],[1,2,5]]
b = [5, 6, 7]
A_inv = matrix_inverse_gj(A)
print("A⁻¹ =")
for r in A_inv: print(" ", [round(v,4) for v in r])

x = [sum(A_inv[i][j]*b[j] for j in range(3)) for i in range(3)]
print("\\nx = A⁻¹ b =", [round(v,6) for v in x])

# ตรวจ
print("\\nตรวจ: numpy =", np.linalg.solve(A, b))`} height={260}/>

        <h3>Interactive</h3>
        <DirectSolverShell method="inverse" title="Matrix Inversion — Solver"/>
      </Sect>

      <Sect tag="5" title="LU Decomposition — Doolittle / Crout">
        <h3>แนวคิด · แตก A เป็น L · U</h3>
        <p>แทนที่จะทำ Gauss ใหม่ทุกครั้งที่ b เปลี่ยน — เราแตก <M>A=LU</M> ครั้งเดียว:</p>
        <Formula label="Doolittle (L มี 1 บน diagonal)">
          <MB>{`A = LU = \\begin{bmatrix} 1 & 0 & 0 \\\\ l_{21} & 1 & 0 \\\\ l_{31} & l_{32} & 1 \\end{bmatrix} \\begin{bmatrix} u_{11} & u_{12} & u_{13} \\\\ 0 & u_{22} & u_{23} \\\\ 0 & 0 & u_{33} \\end{bmatrix}`}</MB>
        </Formula>
        <p>ขั้นแก้สมการแบ่งเป็น 2 ขั้นย่อย:</p>
        <Formula>
          <MB>{`\\text{(1) Forward: } Ly = b \\quad \\Longrightarrow \\quad y \\text{ ทีละตัวจากบนลงล่าง}`}</MB>
          <MB>{`\\text{(2) Backward: } Ux = y \\quad \\Longrightarrow \\quad x \\text{ ทีละตัวจากล่างขึ้นบน}`}</MB>
        </Formula>

        <Callout kind="good" title="ทำไม LU ดีกว่า Gauss?">
          <p>ถ้า <b>matrix A เดิม แต่ b เปลี่ยน</b> — เช่น load ทุกชั่วโมงในวงจรไฟฟ้า — แตก LU ครั้งเดียว แล้ว forward/back substitution ทุก b ใหม่ใน <M>O(n^2)</M></p>
          <p style={{margin:0}}>Gauss ต้องทำ <M>O(n^3)</M> ใหม่ทุก b</p>
        </Callout>

        <h3>สูตรหาค่า L, U ทีละช่อง (Doolittle)</h3>
        <Formula>
          <MB>{`u_{kj} = a_{kj} - \\sum_{p=1}^{k-1} l_{kp}\\, u_{pj} \\quad (j \\geq k)`}</MB>
          <MB>{`l_{ik} = \\frac{1}{u_{kk}}\\left(a_{ik} - \\sum_{p=1}^{k-1} l_{ip}\\, u_{pk}\\right) \\quad (i > k)`}</MB>
        </Formula>

        <h3>ตัวอย่างทำมือ — แตก A เป็น L · U</h3>
        <LUViz A0={A0} b0={b0}/>

        <h3>Python — LU Doolittle</h3>
        <PythonRunner code={`def lu_doolittle(A):
    n = len(A)
    L = [[0.0]*n for _ in range(n)]
    U = [[0.0]*n for _ in range(n)]
    for i in range(n): L[i][i] = 1.0
    for k in range(n):
        # U row k
        for j in range(k, n):
            s = A[k][j] - sum(L[k][p]*U[p][j] for p in range(k))
            U[k][j] = s
        # L column k
        for i in range(k+1, n):
            s = A[i][k] - sum(L[i][p]*U[p][k] for p in range(k))
            L[i][k] = s / U[k][k]
    return L, U

def solve_lu(L, U, b):
    n = len(b)
    y = [0]*n
    for i in range(n):
        y[i] = (b[i] - sum(L[i][j]*y[j] for j in range(i))) / L[i][i]
    x = [0]*n
    for i in range(n-1, -1, -1):
        x[i] = (y[i] - sum(U[i][j]*x[j] for j in range(i+1, n))) / U[i][i]
    return y, x

A = [[3,-0.1,-0.2],[0.1,7,-0.3],[0.3,-0.2,10]]
b = [7.85, -19.3, 71.4]
L, U = lu_doolittle(A)
print("L ="); [print(" ", [round(v,4) for v in r]) for r in L]
print("U ="); [print(" ", [round(v,4) for v in r]) for r in U]
y, x = solve_lu(L, U, b)
print("\\ny =", [round(v,4) for v in y])
print("x =", [round(v,6) for v in x])`} height={300}/>

        <h3>Interactive</h3>
        <DirectSolverShell method="lu" title="LU Decomposition — Solver"/>
      </Sect>

      <Sect tag="6" title="Cholesky Decomposition — สำหรับ Symmetric Positive Definite">
        <h3>เมื่อไหร่ใช้ได้?</h3>
        <p>เฉพาะเมื่อ matrix A เป็น <b>symmetric positive definite</b> (SPD):</p>
        <ul>
          <li><M>{`A = A^T`}</M> (symmetric — สมมาตรเทียบ diagonal)</li>
          <li>ทุก eigenvalue &gt; 0 → equivalently ทุก leading minor det &gt; 0</li>
        </ul>
        <Callout kind="tip" title="ที่มาจากชีวิตจริง">
          <p>SPD matrix เกิดจาก: <em>Hessian ใน optimization, stiffness matrix ใน FEM, covariance matrix ใน stats</em></p>
          <p style={{margin:0}}>เร็วกว่า LU เท่าตัว (เพราะใช้แค่ L ไม่ต้อง U)</p>
        </Callout>

        <Formula label="Cholesky form">
          <MB>{`A = L L^T \\quad \\text{(L คือ lower triangular)}`}</MB>
        </Formula>

        <Formula label="สูตรหาช่อง L">
          <MB>{`l_{ii} = \\sqrt{\\, a_{ii} - \\sum_{k=1}^{i-1} l_{ik}^2 \\,}`}</MB>
          <MB>{`l_{ij} = \\frac{1}{l_{jj}}\\left(a_{ij} - \\sum_{k=1}^{j-1} l_{ik}\\, l_{jk}\\right), \\quad i > j`}</MB>
        </Formula>

        <h3>ตัวอย่างทำมือ — 3×3 SPD</h3>
        <p>ระบบ <M>{`A x = b`}</M> โดย</p>
        <MB>{`A = \\begin{bmatrix} 4 & 2 & -2 \\\\ 2 & 10 & 2 \\\\ -2 & 2 & 5 \\end{bmatrix}, \\quad b = \\begin{bmatrix} 2 \\\\ 20 \\\\ 5 \\end{bmatrix}`}</MB>
        <p>ตรวจ symmetry ✓ (ทุก <M>{`a_{ij} = a_{ji}`}</M>)  ตรวจ positive: leading mins det 4, 36, 80 &gt; 0 ✓</p>
        <CholeskyViz A0={Aspd} b0={bspd}/>

        <h3>Python — Cholesky</h3>
        <PythonRunner code={`import math

def cholesky(A):
    n = len(A)
    L = [[0.0]*n for _ in range(n)]
    for i in range(n):
        for j in range(i+1):
            s = A[i][j] - sum(L[i][k]*L[j][k] for k in range(j))
            if i == j:
                if s <= 0: raise ValueError("ไม่ใช่ positive definite")
                L[i][j] = math.sqrt(s)
            else:
                L[i][j] = s / L[j][j]
    return L

def solve_cholesky(L, b):
    n = len(b)
    # Ly = b
    y = [0]*n
    for i in range(n):
        y[i] = (b[i] - sum(L[i][k]*y[k] for k in range(i))) / L[i][i]
    # Lᵀx = y
    x = [0]*n
    for i in range(n-1, -1, -1):
        x[i] = (y[i] - sum(L[k][i]*x[k] for k in range(i+1, n))) / L[i][i]
    return x

A = [[4,2,-2],[2,10,2],[-2,2,5]]
b = [2, 20, 5]
L = cholesky(A)
print("L ="); [print(" ", [round(v,4) for v in r]) for r in L]
print("x =", [round(v,6) for v in solve_cholesky(L, b)])`} height={260}/>

        <h3>Interactive</h3>
        <DirectSolverShell method="cholesky" title="Cholesky — Solver (ต้องเป็น SPD!)"/>
      </Sect>

      <Sect tag="7" title="Jacobi Iteration — เริ่ม Iterative">
        <h3>แนวคิด</h3>
        <p>จัดสมการให้แยก <M>x_i</M> ออกมา → เดาค่าเริ่ม → คำนวณ x ใหม่ → วน loop</p>

        <Formula>
          <MB>{`x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j \\neq i} a_{ij}\\, x_j^{(k)} \\right)`}</MB>
        </Formula>

        <Callout kind="warn" title="สำคัญ! Jacobi ใช้ค่า x เก่าทั้งหมด">
          <p>ในรอบ k+1: ใช้ <M>{`x_1^{(k)}, x_2^{(k)}, x_3^{(k)}`}</M> ทั้งหมดของรอบเก่า ตอนคำนวณ <M>{`x_i^{(k+1)}`}</M> ทุกตัว</p>
        </Callout>

        <h3>ตัวอย่างจากสไตล์อาจารย์ (สรุป Numer หน้า 2)</h3>
        <p>ระบบ 4×4 (แสดงจากสไลด์):</p>
        <MB>{`\\begin{bmatrix} 5 & -1 & 0 & 0 \\\\ -1 & 5 & -1 & 0 \\\\ 0 & -1 & 5 & -1 \\\\ 0 & 0 & -1 & 5 \\end{bmatrix} \\begin{bmatrix} x_1 \\\\ x_2 \\\\ x_3 \\\\ x_4 \\end{bmatrix} = \\begin{bmatrix} 12 \\\\ 17 \\\\ 14 \\\\ 7 \\end{bmatrix}`}</MB>
        <p>เริ่ม <M>x^{`(0)`} = (0,0,0,0)</M>:</p>
        <MB>{`x_1 = \\frac{12 - (-1)x_2 - 0\\cdot x_3 - 0\\cdot x_4}{5} = \\frac{12 + x_2}{5}`}</MB>
        <MB>{`x_2 = \\frac{17 + x_1 + x_3}{5}, \\quad x_3 = \\frac{14 + x_2 + x_4}{5}, \\quad x_4 = \\frac{7 + x_3}{5}`}</MB>
        <p>Iteration 1: <M>{`x_1 = 2.4, x_2 = 3.4, x_3 = 2.8, x_4 = 1.4`}</M></p>
        <p>Iteration 2 (ใช้ค่าเก่า): <M>{`x_1 = (12+3.4)/5 = 3.08, x_2 = (17+2.4+2.8)/5 = 4.44, \\ldots`}</M></p>

        <h3>Demo · ทำซ้ำจนลู่เข้า</h3>
        <IterativeSolver method="jacobi"/>

        <Callout kind="danger" title="เงื่อนไขลู่เข้า — Diagonal Dominance">
          <p>Jacobi ลู่เข้าถ้า matrix เป็น <b>diagonally dominant</b>:</p>
          <MB>{`|a_{ii}| \\geq \\sum_{j \\neq i} |a_{ij}| \\quad \\text{ทุก } i`}</MB>
          <p>ตัวอย่าง: matrix <M>{`\\begin{pmatrix} 5 & 1 \\\\ 1 & 5\\end{pmatrix}`}</M> diagonal-dominant (5 &gt; 1) ✓ แต่ <M>{`\\begin{pmatrix} 1 & 5 \\\\ 5 & 1\\end{pmatrix}`}</M> ไม่ (1 &lt; 5) ✗</p>
        </Callout>

        <PythonRunner code={`import numpy as np

def jacobi(A, b, x0, tol=1e-6, max_iter=50):
    n = len(A)
    x = x0[:]
    for k in range(max_iter):
        xn = [0]*n
        for i in range(n):
            s = b[i]
            for j in range(n):
                if j != i:
                    s -= A[i][j] * x[j]    # ใช้ค่าเก่าทั้งหมด
            xn[i] = s / A[i][i]
        err = max(abs(xn[i]-x[i]) for i in range(n))
        print(f"k={k+1:2d}  x={[round(v,4) for v in xn]}  ε={err:.2e}")
        if err < tol: return xn
        x = xn

A = [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]]
b = [12, 17, 14, 7]
ans = jacobi(A, b, [0,0,0,0])
print(f"\\nคำตอบ ≈ {[round(v,4) for v in ans]}")`} height={260}/>
      </Sect>

      <Sect tag="8" title="Gauss-Seidel — Jacobi ฉบับ Upgrade">
        <p>เหมือน Jacobi เป๊ะ ๆ ยกเว้น: <b>ใช้ค่า x ใหม่ทันทีในรอบเดียวกัน</b></p>

        <Formula>
          <MB>{`x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j<i} a_{ij}\\, x_j^{(k+1)} - \\sum_{j>i} a_{ij}\\, x_j^{(k)} \\right)`}</MB>
        </Formula>

        <Callout kind="good" title="ทำไมเร็วกว่า Jacobi">
          ถ้าเรา <em>เพิ่งคำนวณ</em> <M>{`x_1^{(k+1)}`}</M> ใหม่ได้แล้ว ก็เอามาใช้ตอนคำนวณ <M>{`x_2^{(k+1)}`}</M> เลย — ไม่ต้องรอรอบหน้า → ข้อมูลใหม่กว่า → ลู่เข้าเร็วขึ้น ~2 เท่า
        </Callout>

        <h3>ตัวอย่างเทียบ Jacobi vs Gauss-Seidel</h3>
        <p>จากสไลด์: เริ่มเหมือนกัน <M>{`x^{(0)} = (0,0,0,0)`}</M> ทำ 1 iteration:</p>
        <div className="grid-2">
          <div className="card tight">
            <div className="kicker">Jacobi (ใช้ค่าเก่า)</div>
            <div className="mono" style={{fontSize:13, lineHeight:1.7}}>
              x₁ = (12+0)/5 = 2.40<br/>
              x₂ = (17+0+0)/5 = 3.40<br/>
              x₃ = (14+0+0)/5 = 2.80<br/>
              x₄ = (7+0)/5 = 1.40
            </div>
          </div>
          <div className="card tight" style={{borderColor:"var(--green-dim)"}}>
            <div className="kicker" style={{color:"var(--green)"}}>Gauss-Seidel (ใช้ค่าใหม่ทันที)</div>
            <div className="mono" style={{fontSize:13, lineHeight:1.7}}>
              x₁ = (12+0)/5 = 2.40 <em>← x₁ ใหม่</em><br/>
              x₂ = (17+<b>2.40</b>+0)/5 = 3.88 <em>← x₂ ใหม่</em><br/>
              x₃ = (14+<b>3.88</b>+0)/5 = 3.576<br/>
              x₄ = (7+<b>3.576</b>)/5 = 2.1152
            </div>
          </div>
        </div>

        <IterativeSolver method="seidel"/>

        <PythonRunner code={`def gauss_seidel(A, b, x0, tol=1e-6, max_iter=50):
    n = len(A)
    x = x0[:]
    for k in range(max_iter):
        prev = x[:]
        for i in range(n):
            s = b[i]
            for j in range(n):
                if j != i:
                    s -= A[i][j] * x[j]    # x[j] อาจเป็นค่าใหม่ที่เพิ่งคำนวณ!
            x[i] = s / A[i][i]
        err = max(abs(x[i]-prev[i]) for i in range(n))
        print(f"k={k+1:2d}  x={[round(v,4) for v in x]}  ε={err:.2e}")
        if err < tol: return x

A = [[5,-1,0,0],[-1,5,-1,0],[0,-1,5,-1],[0,0,-1,5]]
b = [12,17,14,7]
ans = gauss_seidel(A, b, [0,0,0,0])`} height={220}/>
      </Sect>

      <Sect tag="9" title="Quick Reference & Decision Tree">
        <NumTable
          headers={["Method", "Type", "Cost", "เหมาะกับ", "ออกข้อสอบบ่อย"]}
          rows={[
            ["Gauss Elim", "Direct", "O(n³/3)", "matrix เล็ก, dense", "★★★"],
            ["Gauss-Jordan", "Direct", "O(n³/2)", "ต้องการ A⁻¹ ด้วย", "★★"],
            ["Cramer", "Direct (det)", "O((n+1)·n!)", "n ≤ 3, สอน determinant", "★★★"],
            ["Matrix Inversion", "Direct", "O(n³)", "หลายระบบ b ต่างกัน", "★★"],
            ["LU Decomp", "Direct", "O(n³/3) + O(n²)/b", "b เปลี่ยนหลายครั้ง", "★★★"],
            ["Cholesky", "Direct", "O(n³/6)", "A เป็น SPD", "★★"],
            ["Jacobi", "Iterative", "O(n²)/iter", "diag. dominant + sparse", "★★"],
            ["Gauss-Seidel", "Iterative", "O(n²)/iter", "diag. dominant", "★★★"],
            ["Conjugate Grad", "Iterative", "O(n)/iter (sparse)", "SPD + ใหญ่มาก", "★★ (บท 03)"],
          ]}
        />

        <div className="decision-tree">
          <h4 style={{margin:"0 0 10px"}}>🌳 Decision Tree · เจอโจทย์แบบนี้ → ใช้ method ไหน</h4>
          <details open>
            <summary>โจทย์บอกใช้ method อะไรชัด ๆ</summary>
            <p>→ ใช้ตามที่บอก (อย่าลืมแสดงทุก step ตามที่โจทย์ขอ)</p>
          </details>
          <details>
            <summary>โจทย์ให้ initial guess และคำว่า "iterate" / "tolerance"</summary>
            <p>→ Jacobi หรือ Gauss-Seidel (ดูว่าโจทย์ระบุ; ถ้าไม่ → Gauss-Seidel เร็วกว่า)</p>
          </details>
          <details>
            <summary>โจทย์ให้แค่ A, b — "หา x"</summary>
            <p>→ Gauss Elimination (default) — เป็นวิธีเร็วและตรงไปตรงมา</p>
          </details>
          <details>
            <summary>โจทย์ขอ "หา A⁻¹"</summary>
            <p>→ Matrix Inversion (Gauss-Jordan บน [A | I])</p>
          </details>
          <details>
            <summary>A เป็น symmetric + leading mins ทุกตัว &gt; 0</summary>
            <p>→ Cholesky (เร็วสุด ครึ่งหนึ่งของ LU)</p>
          </details>
          <details>
            <summary>n ≤ 3 + โจทย์ขอ "ใช้ determinant"</summary>
            <p>→ Cramer's Rule</p>
          </details>
        </div>

        <Callout kind="danger" title="กับดักข้อสอบที่พลาดบ่อย">
          <ul style={{margin:0, paddingLeft:18}}>
            <li><b>Cramer:</b> ลืมตรวจ det(A) ≠ 0 ก่อน — ถ้า det = 0 ต้องบอกว่า "ไม่มีคำตอบเดียว"</li>
            <li><b>LU:</b> สับสนระหว่าง Doolittle (L มี 1 บน diag) vs Crout (U มี 1 บน diag) — ดู convention ที่อาจารย์สอน</li>
            <li><b>Cholesky:</b> ใช้ได้เฉพาะ SPD — ตรวจก่อน! ถ้า A ไม่ symmetric → ใช้ไม่ได้เด็ดขาด</li>
            <li><b>Jacobi/GS:</b> ลืมสลับแถวเพื่อให้ diagonal dominant → ลู่ออก (diverge) แทนที่จะลู่เข้า</li>
            <li><b>Gauss/Gauss-Jordan:</b> ลืม pivoting → หาร 0 หรือ error สะสม</li>
          </ul>
        </Callout>

        <Callout kind="tip" title="วิธีจำ — เลือก method">
          <ul>
            <li>ข้อสอบบอก "ใช้ Gauss Elimination" → ทำตามขั้นกำจัด แสดงทุกแถว</li>
            <li>ข้อสอบให้ initial guess <M>x^{`(0)`}</M> + "iterate" → Jacobi หรือ Gauss-Seidel</li>
            <li>ระบบ symmetric positive-definite + ใหญ่ → Conjugate Gradient (บทถัดไป)</li>
          </ul>
        </Callout>
      </Sect>

      <Sect tag="✸" title="ข้อสอบจำลอง">
        <Problem label="ข้อ 0 · Cramer + LU + Cholesky (จากสไลด์อาจารย์)" solution={
          <div>
            <p>ระบบนี้แก้ได้ทุก method — ตรวจคำตอบ x = (1, 0, 1)<sup>T</sup></p>
            <p><b>Cramer:</b> det(A) = (−2)(4·1 − (−5)(−2)) − 3(3·1 − (−5)(1)) + 1(3·(−2) − 4·1) = (−2)(−6) − 3(8) + 1(−10) = 12 − 24 − 10 = −22</p>
            <p>det(A₁) = ใส่ b แทน col 1 = −22 → x₁ = 1</p>
            <p>det(A₂) = ใส่ b แทน col 2 = 0 → x₂ = 0</p>
            <p>det(A₃) = ใส่ b แทน col 3 = −22 → x₃ = 1</p>
          </div>
        }>
          แก้ระบบสมการต่อไปนี้ด้วย <b>Cramer, LU Decomposition, และ Matrix Inversion</b> เปรียบเทียบผลลัพธ์:
          <MB>{`\\begin{cases} -2x_1 + 3x_2 + x_3 = -1 \\\\ 3x_1 + 4x_2 - 5x_3 = -2 \\\\ x_1 - 2x_2 + x_3 = 2 \\end{cases}`}</MB>
        </Problem>

        <Problem label="ข้อ 1 · Gauss" solution={
          <div>
            <p>ทำ forward elimination 2 step:</p>
            <p>R2 ← R2 − (2/4)R1: <span className="mono">[0, 3-0.5·(-1), -1-0.5·1, 6-0.5·5] = [0, 3.5, -1.5, 3.5]</span></p>
            <p>R3 ← R3 − (1/4)R1: <span className="mono">[0, 2-0.25·(-1), 5-0.25·1, 7-0.25·5] = [0, 2.25, 4.75, 5.75]</span></p>
            <p>R3 ← R3 − (2.25/3.5)R2: <span className="mono">[0, 0, 4.75-0.643·(-1.5), 5.75-0.643·3.5] = [0, 0, 5.714, 3.5]</span></p>
            <p>Back substitution: x₃ = 3.5/5.714 = 0.6125, x₂ = (3.5+1.5·0.6125)/3.5 = 1.2625, x₁ = (5+1·1.2625-1·0.6125)/4 = 1.4125</p>
          </div>
        }>
          แก้ระบบสมการต่อไปนี้ด้วย <b>Gauss Elimination</b> แสดงทุกขั้นตอน:
          <MB>{`\\begin{cases} 4x_1 - x_2 + x_3 = 5 \\\\ 2x_1 + 3x_2 - x_3 = 6 \\\\ x_1 + 2x_2 + 5x_3 = 7 \\end{cases}`}</MB>
        </Problem>

        <Problem label="ข้อ 2 · Gauss-Seidel" solution={
          <NumTable
            headers={["k", "x₁", "x₂", "x₃"]}
            rows={[
              [0, 0, 0, 0],
              [1, 0.75, 1.75, 1.50],
              [2, 0.875, 1.7708, 1.4271],
              [3, 0.9132, 1.7517, 1.4338],
            ]}
          />
        }>
          ใช้ <b>Gauss-Seidel</b> แก้ระบบสมการ:
          <MB>{`4x_1 + x_2 + x_3 = 5, \\quad x_1 + 4x_2 + x_3 = 8, \\quad x_1 + x_2 + 4x_3 = 7`}</MB>
          เริ่มจาก <M>{`x^{(0)} = (0,0,0)`}</M> ทำ 3 iterations
        </Problem>
      </Sect>
    </div>
  );
}

window.LinearSystemsLesson = LinearSystemsLesson;
