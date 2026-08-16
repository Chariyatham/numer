// Problem Bank — 80+ practice problems organized by topic + difficulty

const PROBLEMS = [
  // ============ ROOT FINDING ============
  { id: "R01", topic: "root", diff: "easy", title: "Bisection พื้นฐาน",
    q: <p>ใช้ Bisection หาราก <M>{`f(x) = x^2 - 3 = 0`}</M> ในช่วง <M>{`[1, 2]`}</M> 4 iterations พร้อม error %</p>,
    a: <div>
      <StepTable headers={["i","a","b","m","f(m)","ε%"]} rows={[
        [1,1.0000,2.0000,1.5000,-0.7500,"—"],
        [2,1.5000,2.0000,1.7500,0.0625,14.29],
        [3,1.5000,1.7500,1.6250,-0.3594,7.69],
        [4,1.6250,1.7500,1.6875,-0.1523,3.70],
      ]}/>
      <p>m₄ ≈ 1.6875, คำตอบจริง √3 = 1.7320508</p>
    </div>
  },
  { id: "R02", topic: "root", diff: "easy", title: "False Position",
    q: <p>ใช้ False Position หา <M>{`f(x) = x^3 - 5 = 0`}</M> ในช่วง <M>{`[1, 2]`}</M> 3 iterations</p>,
    a: <div>
      <StepTable headers={["i","a","b","m","f(m)","ε%"]} rows={[
        [1,1.0000,2.0000,1.5714,-1.1226,"—"],
        [2,1.5714,2.0000,1.6964,-0.1180,7.37],
        [3,1.6964,2.0000,1.7079,-0.0103,0.67],
      ]}/>
      <p>คำตอบ ∛5 ≈ 1.7099759</p>
    </div>
  },
  { id: "R03", topic: "root", diff: "medium", title: "Newton-Raphson",
    q: <p>หา <M>{`x`}</M> ที่ทำให้ <M>{`e^{-x} - x = 0`}</M> โดย Newton-Raphson, <M>x_0 = 0.5</M>, 4 iterations</p>,
    a: <div>
      <p><M>{`f(x) = e^{-x} - x,\\quad f'(x) = -e^{-x} - 1`}</M></p>
      <StepTable headers={["i","x","f(x)","f'(x)","x_new","ε%"]} rows={[
        [1,0.5000,0.1065,-1.6065,0.5663,11.71],
        [2,0.5663,0.0013,-1.5676,0.5671,0.146],
        [3,0.5671,0.0000,-1.5671,0.5671,0.0000],
      ]}/>
      <p>คำตอบ x ≈ 0.5671433 (เร็วมาก! Quadratic convergence)</p>
    </div>
  },
  { id: "R04", topic: "root", diff: "medium", title: "Secant",
    q: <p>ใช้ Secant หา <M>{`f(x) = x \\cos x - 1 = 0`}</M> โดย <M>{`x_0 = 0, x_1 = 1`}</M>, 4 iterations</p>,
    a: <div>
      <StepTable headers={["i","x₀","x₁","f(x₀)","f(x₁)","x₂"]} rows={[
        [1,0.0000,1.0000,-1.0000,-0.4597,1.8508],
        [2,1.0000,1.8508,-0.4597,-1.5436,0.5901],
        [3,1.8508,0.5901,-1.5436,-0.5097,1.2120],
        [4,0.5901,1.2120,-0.5097,-0.5755,1.0689],
      ]}/>
      <p>ลู่ไปยัง 4.917... (อีกราก) — ระวังเลือก initial values!</p>
    </div>
  },
  { id: "R05", topic: "root", diff: "hard", title: "พิสูจน์ False Position",
    q: <p>จงพิสูจน์สูตร False Position <M>{`x_m = x_r - \\dfrac{f(x_r)(x_l - x_r)}{f(x_l) - f(x_r)}`}</M> โดยอาศัยรูปทรงเส้นตรง</p>,
    a: <div>
      <p>เส้นตรงผ่าน 2 จุด <M>{`(x_l, f_l), (x_r, f_r)`}</M>:</p>
      <MB>{`y - f_r = \\frac{f_l - f_r}{x_l - x_r}(x - x_r)`}</MB>
      <p>ตั้ง y = 0 (อยากให้ตัดแกน x):</p>
      <MB>{`-f_r = \\frac{f_l - f_r}{x_l - x_r}(x_m - x_r)`}</MB>
      <MB>{`x_m - x_r = \\frac{-f_r(x_l - x_r)}{f_l - f_r}`}</MB>
      <MB>{`\\boxed{x_m = x_r - \\frac{f_r(x_l - x_r)}{f_l - f_r}}`}</MB>
    </div>
  },
  { id: "R06", topic: "root", diff: "hard", title: "Modified Graphical + Programming",
    q: <p>เขียนโปรแกรม Python หาราก <M>{`4x^3 - 180 = 0`}</M> ในช่วง <M>{`[0, 10]`}</M> ด้วย modified Graphical (scan 1, แล้ว scan 0.000001)</p>,
    a: <PythonRunner code={`def f(x): return 4*x**3 - 180

# Phase 1: step 1
a = 0
while a < 10:
    if f(a)*f(a+1) < 0: break
    a += 1
y, z = a, a+1
print(f"ราก∈[{y},{z}]")

# Phase 2: step 0.000001
x, best = y, (abs(f(y)), y)
while x <= z:
    if abs(f(x)) < best[0]: best = (abs(f(x)), x)
    x += 0.000001
print(f"ราก ≈ {best[1]:.6f}")`}/>
  },
  { id: "R07", topic: "root", diff: "easy", title: "Taylor Series",
    q: <p>ใช้ Taylor series ที่ <M>x_0 = 1</M> ประมาณ <M>{`e^x`}</M> ที่ <M>x = 1.5</M> สำหรับ <M>n = 0, 1, 2, 3</M> + error %</p>,
    a: <div>
      <p>ที่ <M>x_0 = 1</M>: <M>{`f(x_0) = e^1 \\approx 2.7183,\\; f^{(n)}(x_0) = e^1`}</M> ทุก n</p>
      <p>ค่าจริง <M>{`e^{1.5} \\approx 4.4817`}</M></p>
      <StepTable headers={["n","T_n(1.5)","error %"]} rows={[
        [0,2.7183,39.35],
        [1,4.0775,9.02],
        [2,4.4173,1.44],
        [3,4.4739,0.17],
      ]}/>
    </div>
  },
  { id: "R08", topic: "root", diff: "medium", title: "เลือก Method",
    q: <p>โจทย์: <M>{`x = \\sqrt{x+1}`}</M> หาคำตอบที่ความแม่นยำ <M>{`10^{-6}`}</M> — เลือก 3 method มาเปรียบเทียบจำนวน iterations</p>,
    a: <div>
      <ul>
        <li><b>One-point:</b> <M>{`x_{n+1} = \\sqrt{x_n + 1}`}</M>, x₀=1 → ~10 iter (golden ratio φ)</li>
        <li><b>Bisection:</b> ในช่วง [1,2] → ~20 iter (linear)</li>
        <li><b>Newton:</b> <M>{`f(x) = x^2 - x - 1`}</M>, x₀=1.5 → ~4 iter (quadratic)</li>
      </ul>
      <p>คำตอบ φ = (1+√5)/2 ≈ 1.6180339</p>
    </div>
  },
  { id: "R09", topic: "root", diff: "hard", title: "Multi-root function",
    q: <p>ฟังก์ชัน <M>{`f(x) = (x-1)(x-2)(x-3)`}</M> มี 3 ราก ออกแบบกลยุทธ์ใช้ Bisection หาทั้ง 3 รากแบบเป็นระบบ</p>,
    a: <div>
      <p>ใช้ Bisection scan ทีละช่วงเล็ก:</p>
      <ol>
        <li>Scan <code>x = 0, 0.5, 1, 1.5, ..., 4</code> หาที่ f(x) เปลี่ยนเครื่องหมาย</li>
        <li>พบเปลี่ยนที่ [0.5, 1.5], [1.5, 2.5], [2.5, 3.5]</li>
        <li>Bisection ในแต่ละช่วงแยกกัน → ได้ 1, 2, 3</li>
      </ol>
      <p>กลยุทธ์ "deflation": หลังพบรากแรก r₁ ก็หาร f(x)/(x−r₁) แล้วทำซ้ำ</p>
    </div>
  },
  { id: "R10", topic: "root", diff: "hard", title: "Newton ที่ฉาวฉลาด",
    q: <p>ใช้ Newton หา <M>{`f(x) = x^2 - 2`}</M> โดย <M>x_0 = -3</M> — จะลู่ไปที่รากบวกหรือลบ? ทำไม?</p>,
    a: <div>
      <p>Newton: <M>{`x_{n+1} = x_n - \\frac{x_n^2 - 2}{2x_n}`}</M></p>
      <p>x₀ = -3: <M>{`x_1 = -3 - 7/(-6) = -3 + 1.1667 = -1.833`}</M> — ยังเป็นลบ</p>
      <p>x₂ ≈ -1.4621, x₃ ≈ -1.4145, x₄ ≈ -1.4142 → ลู่ไปยัง <b>-√2</b> (ราก<em>ลบ</em>)</p>
      <p><b>เหตุผล:</b> Newton "ติด" ในด้านเดียวกับ x₀ — ถ้าเริ่มลบ ลู่ไปลบ ถ้าเริ่มบวก ลู่ไปบวก (สำหรับ f นี้ที่สมมาตร)</p>
    </div>
  },

  // ============ LINEAR SYSTEMS ============
  { id: "L01", topic: "linear", diff: "easy", title: "Gauss 2×2",
    q: <p>แก้ <M>{`2x_1 + 3x_2 = 8, \\; x_1 + 4x_2 = 9`}</M> ด้วย Gauss Elimination</p>,
    a: <div>
      <p>R2 ← R2 − (1/2)R1: [0, 4 − 1.5, 9 − 4] = [0, 2.5, 5]</p>
      <p>Back-sub: x₂ = 5/2.5 = 2, x₁ = (8 − 3·2)/2 = 1</p>
      <p>คำตอบ: x₁ = 1, x₂ = 2</p>
    </div>
  },
  { id: "L02", topic: "linear", diff: "easy", title: "Gauss 3×3",
    q: <p><MB>{`\\begin{cases} 2x_1 + x_2 - x_3 = 8 \\\\ -3x_1 - x_2 + 2x_3 = -11 \\\\ -2x_1 + x_2 + 2x_3 = -3 \\end{cases}`}</MB></p>,
    a: <div>
      <p>R2 ← R2 + (3/2)R1; R3 ← R3 + R1; ทำต่อเรื่อย ๆ จนสามเหลี่ยมบน</p>
      <p>คำตอบ: x₁ = 2, x₂ = 3, x₃ = -1</p>
    </div>
  },
  { id: "L03", topic: "linear", diff: "medium", title: "Jacobi vs Gauss-Seidel",
    q: <p>เริ่ม <M>{`x^{(0)} = (0,0,0)`}</M>, ระบบ <M>{`4x_1 + x_2 + x_3 = 6,\\; x_1 + 4x_2 + x_3 = 6,\\; x_1 + x_2 + 4x_3 = 6`}</M> ทำ Jacobi 3 รอบ + Gauss-Seidel 3 รอบ เทียบกัน</p>,
    a: <div>
      <p><b>Jacobi (ใช้ค่าเก่าทั้งหมด):</b></p>
      <StepTable headers={["k","x₁","x₂","x₃"]} rows={[
        [0,0,0,0],[1,1.5,1.5,1.5],[2,0.75,0.75,0.75],[3,1.125,1.125,1.125]
      ]}/>
      <p><b>Gauss-Seidel (ใช้ค่าใหม่ทันที):</b></p>
      <StepTable headers={["k","x₁","x₂","x₃"]} rows={[
        [0,0,0,0],[1,1.5,1.125,0.84375],[2,1.0078,1.0371,0.9888],[3,0.9935,1.0044,1.0005]
      ]}/>
      <p>คำตอบจริง = (1, 1, 1) — Gauss-Seidel ใกล้ขึ้น 4 เท่า</p>
    </div>
  },
  { id: "L04", topic: "linear", diff: "medium", title: "Diagonal Dominance",
    q: <p>ระบบ <M>{`\\begin{pmatrix} 1 & 5 \\\\ 3 & 2 \\end{pmatrix} x = b`}</M> — Jacobi จะลู่เข้าหรือไม่? ปรับยังไงให้ลู่เข้า?</p>,
    a: <div>
      <p>row 1: |1| &lt; |5| → ไม่ diagonal dominant → Jacobi <em>ลู่ออก</em></p>
      <p><b>วิธีแก้:</b> สลับแถว (row pivoting):</p>
      <MB>{`\\begin{pmatrix} 3 & 2 \\\\ 1 & 5 \\end{pmatrix} x = b'`}</MB>
      <p>ตอนนี้ |3| ≥ |2| และ |5| ≥ |1| → diagonal dominant ✓ → Jacobi ลู่เข้า</p>
    </div>
  },
  { id: "L05", topic: "linear", diff: "hard", title: "Pivoting จำเป็น",
    q: <p>แก้ <M>{`\\begin{cases} 10^{-20} x_1 + x_2 = 1 \\\\ x_1 + x_2 = 2 \\end{cases}`}</M> โดย Gauss (ไม่มี pivot) — ทำไมพัง?</p>,
    a: <div>
      <p>ไม่มี pivot: R2 ← R2 − 10²⁰ · R1 → ได้ <code>0, 1 − 10²⁰, 2 − 10²⁰</code></p>
      <p>เครื่อง floating-point ตัด 1 ทิ้ง (subnormal) → x₂ = 1, แทนกลับ x₁ = 0 (ผิดมาก!)</p>
      <p><b>คำตอบจริง:</b> x₁ ≈ 1, x₂ ≈ 1</p>
      <p><b>แก้:</b> <em>Partial pivoting</em> — สลับให้สัมประสิทธิ์ใหญ่อยู่ pivot ก่อน</p>
    </div>
  },
  { id: "L06", topic: "linear", diff: "easy", title: "Identity check",
    q: <p>ใช้ Gauss-Jordan แก้ <M>{`\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix} x = \\begin{pmatrix} 5 \\\\ 1 \\end{pmatrix}`}</M></p>,
    a: <p>R2 ← R2 − R1 → [0, -2, -4]; R2 ← R2/(-2) → [0, 1, 2]; R1 ← R1 − R2 → [1, 0, 3] ⇒ x₁ = 3, x₂ = 2</p>
  },
  { id: "L07", topic: "linear", diff: "medium", title: "Sparse Iteration",
    q: <p>ระบบ tridiagonal 5×5 ใช้ Gauss-Seidel ดีกว่า Gauss Elim เพราะอะไร?</p>,
    a: <p>Gauss-Seidel ใช้ memory O(n) (เก็บแค่ diagonal) ส่วน Gauss Elim ต้องเก็บ matrix ครบ O(n²) — ระบบใหญ่ ๆ ใน FEA, CFD ใช้ iterative methods เสมอ</p>
  },
  { id: "L08", topic: "linear", diff: "hard", title: "Norm Error",
    q: <p>ใช้ infinity norm <M>{`\\|x^{(k+1)} - x^{(k)}\\|_\\infty < 10^{-4}`}</M> เป็น stopping criterion สำหรับระบบใน L03</p>,
    a: <PythonRunner code={`def gauss_seidel(A, b, x0, tol=1e-4, max_iter=50):
    n = len(A); x = x0[:]
    for k in range(max_iter):
        prev = x[:]
        for i in range(n):
            s = b[i] - sum(A[i][j]*x[j] for j in range(n) if j != i)
            x[i] = s/A[i][i]
        err = max(abs(x[i]-prev[i]) for i in range(n))
        print(f"k={k+1} x={[round(v,5) for v in x]} ε∞={err:.2e}")
        if err < tol: return x

A = [[4,1,1],[1,4,1],[1,1,4]]; b = [6,6,6]
gauss_seidel(A, b, [0,0,0])`} height={220}/>
  },
  { id: "L09", topic: "linear", diff: "hard", title: "Ill-conditioned",
    q: <p>Hilbert matrix <M>{`H_{ij} = 1/(i+j-1)`}</M> ขนาด 5×5 — แก้ Hx = b ด้วย Gauss Elim, condition number บอกอะไร?</p>,
    a: <p>cond(H₅) ≈ 4.77×10⁵ — error เล็กใน b ขยายเป็น 5 หลักใน x! แสดงว่า direct method ไม่เหมาะ ควรใช้ iterative + preconditioning</p>
  },
  { id: "L10", topic: "linear", diff: "easy", title: "Cramer's vs Gauss",
    q: <p>โจทย์ 4×4 — ใช้ Cramer's rule หรือ Gauss?</p>,
    a: <p>Cramer's: ต้องคำนวณ det 5 ครั้ง × O(n!) = ช้ามาก ใช้ได้แค่ 2×2, 3×3 (ในใจ) — Gauss = O(n³) เร็วกว่าเสมอเมื่อ n ≥ 4</p>
  },

  // ============ CONJUGATE GRADIENT ============
  { id: "C01", topic: "conjugate", diff: "medium", title: "CG 2×2 ทำมือ",
    q: <p>ใช้ CG แก้ <M>{`\\begin{pmatrix} 4 & 1 \\\\ 1 & 3 \\end{pmatrix} x = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}`}</M> โดย <M>{`x^{(0)} = (0,0)`}</M></p>,
    a: <div>
      <p>r⁽⁰⁾ = Ax⁽⁰⁾ − b = (-1, -2); d⁽⁰⁾ = -r⁽⁰⁾ = (1, 2)</p>
      <p>Ad⁽⁰⁾ = (4·1+1·2, 1·1+3·2) = (6, 7)</p>
      <p>α₀ = -r·d/(d·Ad) = -(-1·1+(-2)·2)/(1·6+2·7) = 5/20 = 0.25</p>
      <p>x⁽¹⁾ = (0,0) + 0.25(1,2) = (0.25, 0.5)</p>
      <p>r⁽¹⁾ = Ax⁽¹⁾ − b = (0.5, -0.25); β₀ = (r⁽¹⁾·Ad⁽⁰⁾)/(d·Ad) = (0.5·6+(-0.25)·7)/20 = 0.0625</p>
      <p>d⁽¹⁾ = -r⁽¹⁾ + β₀d⁽⁰⁾ = (-0.4375, 0.375); α₁ = ... = 1.4545; x⁽²⁾ = (0.0909, 0.6364) (ลู่เป๊ะใน 2 step)</p>
    </div>
  },
  { id: "C02", topic: "conjugate", diff: "easy", title: "Why SPD?",
    q: <p>ทำไม CG ต้องการ matrix สมมาตร positive-definite (SPD)?</p>,
    a: <p>เพราะ CG มองปัญหาเป็นหา min ของ <M>{`\\phi(x) = \\frac{1}{2}x^TAx - b^Tx`}</M> — ต้องเป็น "ชาม" (convex), ต้องการ A สมมาตร (เพื่อ ∇φ = Ax-b) และ positive definite (ก้นชามเดียว, ไม่ใช่ saddle)</p>
  },
  { id: "C03", topic: "conjugate", diff: "hard", title: "n-step convergence",
    q: <p>แสดงว่า CG ลู่เข้าใน n iterations สำหรับ n×n SPD matrix (ในเลขจริง — ไม่นับ round-off)</p>,
    a: <p>ทิศ d⁽⁰⁾, d⁽¹⁾, ..., d⁽ⁿ⁻¹⁾ <em>A-orthogonal</em>: dⁱᵀ A dʲ = 0 เมื่อ i≠j → form a basis of Rⁿ → error e⁽ⁿ⁾ = 0 หลัง n step (ในเลขจริง)</p>
  },

  // ============ INTERPOLATION ============
  { id: "I01", topic: "interp", diff: "easy", title: "Linear Interp",
    q: <p>หา <M>f(2.5)</M> จาก (1, 3), (4, 12) ด้วย Linear interpolation</p>,
    a: <p><M>{`f(2.5) = 3 + \\frac{12 - 3}{4 - 1}(2.5 - 1) = 3 + 3(1.5) = 7.5`}</M></p>
  },
  { id: "I02", topic: "interp", diff: "easy", title: "Newton DD 3 จุด",
    q: <p>ข้อมูล (0,1), (1,3), (2,9) — หา <M>f(1.5)</M> ด้วย Newton's DD</p>,
    a: <div>
      <p>DD: c₀=1, c₁=(3−1)/1=2, c₂=((9−3)/1 − (3−1)/1)/2 = (6−2)/2 = 2</p>
      <p>f(x) = 1 + 2(x) + 2(x)(x−1) = 1 + 2x + 2x² − 2x = 1 + 2x²</p>
      <p>f(1.5) = 1 + 2(2.25) = 5.5</p>
    </div>
  },
  { id: "I03", topic: "interp", diff: "medium", title: "Lagrange 4 จุด",
    q: <p>หา <M>f(2.5)</M> จาก (0,1), (1,2), (3,4), (4,7) ด้วย Lagrange</p>,
    a: <div>
      <p>L₀(2.5) = (2.5-1)(2.5-3)(2.5-4)/((0-1)(0-3)(0-4)) = (1.5)(−0.5)(−1.5)/(−12) = -0.09375</p>
      <p>L₁(2.5) = (2.5-0)(2.5-3)(2.5-4)/((1-0)(1-3)(1-4)) = (2.5)(−0.5)(−1.5)/6 = 0.3125</p>
      <p>L₂(2.5) = (2.5-0)(2.5-1)(2.5-4)/((3-0)(3-1)(3-4)) = (2.5)(1.5)(−1.5)/(−6) = 0.9375</p>
      <p>L₃(2.5) = (2.5-0)(2.5-1)(2.5-3)/((4-0)(4-1)(4-3)) = (2.5)(1.5)(−0.5)/12 = −0.15625</p>
      <p>f(2.5) = -0.09375 + 2(0.3125) + 4(0.9375) + 7(−0.15625) ≈ 3.18</p>
    </div>
  },
  { id: "I04", topic: "interp", diff: "hard", title: "Equivalence",
    q: <p>พิสูจน์ว่า Newton DD และ Lagrange ให้ polynomial เดียวกัน</p>,
    a: <p>Polynomial interpolation theorem: ผ่าน n+1 จุดมี polynomial degree ≤ n เพียงตัวเดียว — ทั้ง 2 form เป็น polynomial degree ≤ n ผ่าน n+1 จุดเดียวกัน → ตัวเดียวกันเป๊ะ (ต่างกันแค่รูปการเขียน)</p>
  },
  { id: "I05", topic: "interp", diff: "medium", title: "Runge's Phenomenon",
    q: <p>Interpolate <M>{`f(x) = 1/(1+x^2)`}</M> ด้วย polynomial degree 10 ที่ <M>{`x = -5, -4, ..., 5`}</M> — เกิดอะไรขึ้นที่ <M>x = ±4.5</M>?</p>,
    a: <p>Polynomial โค้ง "เด้ง" รุนแรงที่ปลายช่วง — error ที่ x = ±4.5 อาจถึง 2-3 (จริง = 0.05) → ผิดพลาด 4000%! ใช้ Spline แทนเพื่อแก้</p>
  },

  // ============ SPLINE ============
  { id: "S01", topic: "spline", diff: "easy", title: "Linear Spline",
    q: <p>หา <M>f(2.7)</M> จาก (1,5), (2,8), (3,11), (4,16) ด้วย Linear Spline</p>,
    a: <p>2.7 ∈ [2,3], m₂ = (11-8)/(3-2) = 3, f₂(2.7) = 8 + 3(0.7) = 10.1</p>
  },
  { id: "S02", topic: "spline", diff: "hard", title: "Quadratic Spline matrix",
    q: <p>3 จุด (1, 2), (2, 5), (3, 4) — ตั้ง quadratic spline system 6×6 (2 segments × 3 coef)</p>,
    a: <div>
      <p>Unknowns: a₁, b₁, c₁, a₂, b₂, c₂ (6 unknowns)</p>
      <p>Equations:</p>
      <ol>
        <li>f₁(1) = 2: a₁ + b₁ + c₁ = 2</li>
        <li>f₁(2) = 5: 4a₁ + 2b₁ + c₁ = 5</li>
        <li>f₂(2) = 5: 4a₂ + 2b₂ + c₂ = 5</li>
        <li>f₂(3) = 4: 9a₂ + 3b₂ + c₂ = 4</li>
        <li>slope ต่อเนื่อง: 2(2)a₁ + b₁ = 2(2)a₂ + b₂ → 4a₁ + b₁ - 4a₂ - b₂ = 0</li>
        <li>เงื่อนไขปิด: a₁ = 0 (สมมติช่วงแรกเป็นเส้นตรง)</li>
      </ol>
      <p>ใช้ Gauss Elim แก้ → ได้ a₁=0, b₁=3, c₁=-1, a₂=-2, b₂=11, c₂=-9</p>
    </div>
  },
  { id: "S03", topic: "spline", diff: "medium", title: "Cubic Spline natural",
    q: <p>Natural cubic spline มีคุณสมบัติพิเศษอะไร? ใช้เมื่อไหร่?</p>,
    a: <p>เงื่อนไขปิด: <M>{`f''(x_0) = f''(x_n) = 0`}</M> → ที่ปลายช่วง curvature = 0 (เหมือนเส้นตรง) เหมาะกับ data ที่<em>ไม่รู้</em> slope ที่ปลาย ใช้ default ทั่วโลก (scipy.CubicSpline)</p>
  },

  // ============ REGRESSION ============
  { id: "G01", topic: "regression", diff: "easy", title: "Linear Regression",
    q: <p>ข้อมูล: (1,1), (2,3), (3,4), (4,7), (5,9) — หาเส้น y = a₀ + a₁x</p>,
    a: <div>
      <p>n=5, Σx=15, Σy=24, Σxy=98, Σx²=55</p>
      <p>a₁ = (5·98 − 15·24)/(5·55 − 15²) = 130/50 = 2.6</p>
      <p>a₀ = (24 − 2.6·15)/5 = -3</p>
      <p>y = -3 + 2.6x</p>
    </div>
  },
  { id: "G02", topic: "regression", diff: "medium", title: "R² calculation",
    q: <p>ข้อมูล G01 — คำนวณ R² (coefficient of determination)</p>,
    a: <div>
      <p>ȳ = 24/5 = 4.8</p>
      <p>SS_tot = Σ(yᵢ − ȳ)² = (1-4.8)² + (3-4.8)² + ... = 41.2</p>
      <p>SS_res = Σ(yᵢ − ŷᵢ)² = (1-(-0.4))² + (3-2.2)² + ... = 2.6</p>
      <p>R² = 1 - SS_res/SS_tot = 1 - 2.6/41.2 ≈ 0.937</p>
      <p>R² > 0.9 → fit ดี</p>
    </div>
  },
  { id: "G03", topic: "regression", diff: "hard", title: "Linearization",
    q: <p>ข้อมูล (1, 0.5), (2, 1.7), (3, 3.4), (4, 5.7), (5, 8.4) สงสัยเป็น <M>{`y = a x^b`}</M> — หา a, b</p>,
    a: <div>
      <p>Take log: <M>{`\\ln y = \\ln a + b \\ln x`}</M> → linear ใน ln x, ln y</p>
      <StepTable headers={["x","y","ln x","ln y"]} rows={[
        [1,0.5,0.000,-0.693],
        [2,1.7,0.693,0.531],
        [3,3.4,1.099,1.224],
        [4,5.7,1.386,1.740],
        [5,8.4,1.609,2.128],
      ]}/>
      <p>Linear regression ใน (ln x, ln y) → slope b ≈ 1.76, intercept ln a ≈ -0.71 → a ≈ 0.49</p>
      <p>y ≈ 0.49·x^1.76</p>
    </div>
  },
  { id: "G04", topic: "regression", diff: "medium", title: "Polynomial deg 2",
    q: <p>fit y = a₀ + a₁x + a₂x² ให้ข้อมูล (0,1), (1,3), (2,7), (3,13), (4,21)</p>,
    a: <div>
      <p>(สังเกตว่าเป็น y = 1 + x + x² เป๊ะ)</p>
      <p>n=5, Σx=10, Σx²=30, Σx³=100, Σx⁴=354, Σy=45, Σxy=130, Σx²y=414</p>
      <p>Normal eqn 3×3 → a₀ = 1, a₁ = 1, a₂ = 1</p>
    </div>
  },

  // ============ INTEGRATION ============
  { id: "N01", topic: "integ", diff: "easy", title: "Trapezoidal",
    q: <p>คำนวณ <M>{`\\int_0^1 x^2 dx`}</M> ด้วย single Trapezoidal — error %</p>,
    a: <p>I = 1/2·(0+1) = 0.5; ค่าจริง = 1/3 ≈ 0.3333; err = 50%</p>
  },
  { id: "N02", topic: "integ", diff: "easy", title: "Composite Trap",
    q: <p>คำนวณ <M>{`\\int_0^1 x^2 dx`}</M> ด้วย Composite Trap n=4</p>,
    a: <p>h=0.25, I = 0.25/2 · (0 + 1 + 2(0.0625+0.25+0.5625)) = 0.34375; err = 3.13%</p>
  },
  { id: "N03", topic: "integ", diff: "medium", title: "Simpson 1/3",
    q: <p>คำนวณ <M>{`\\int_0^2 e^{-x^2} dx`}</M> ด้วย Composite Simpson n=4</p>,
    a: <PythonRunner code={`import math
f = lambda x: math.exp(-x*x)
n = 4; a, b = 0, 2; h = (b-a)/n
s = f(a) + f(b)
for i in range(1, n):
    s += (4 if i%2 else 2) * f(a + i*h)
I = h/3 * s
print(f"I ≈ {I:.6f}  (จริง ≈ 0.882081)")`} height={130}/>
  },
  { id: "N04", topic: "integ", diff: "medium", title: "n ต้องเป็นคู่",
    q: <p>มี data ที่ x = 0, 0.5, 1, 1.5, 2, 2.5, 3 (รวม 7 จุด = 6 intervals). คำนวณ <M>{`\\int_0^3 f(x) dx`}</M> ด้วย Simpson 1/3 ได้ไหม?</p>,
    a: <p>n = 6 → <em>คู่</em> ✓ ใช้ได้ pattern: 1, 4, 2, 4, 2, 4, 1 × h/3</p>
  },
  { id: "N05", topic: "integ", diff: "hard", title: "Error Comparison",
    q: <p>เปรียบเทียบ error % ของ Trap vs Simpson สำหรับ <M>{`\\int_0^1 e^x dx`}</M> เมื่อ n = 2, 4, 8, 16</p>,
    a: <div>
      <p>ค่าจริง = e - 1 ≈ 1.71828</p>
      <StepTable headers={["n","Trap","Trap err%","Simpson","Simp err%"]} rows={[
        [2,1.7539,2.07,1.71886,0.034],
        [4,1.7272,0.52,1.71831,0.0021],
        [8,1.72051,0.130,1.71828,0.00013],
        [16,1.71884,0.033,1.71828,0.0000083],
      ]}/>
      <p>Simpson แม่นกว่า Trap ~64× ที่ n เดียวกัน (เพราะ O(h⁴) vs O(h²))</p>
    </div>
  },

  // ============ DIFFERENTIATION ============
  { id: "D01", topic: "diff", diff: "easy", title: "Forward / Backward / Central",
    q: <p><M>{`f(x) = \\sin x`}</M> ที่ <M>x = \\pi/4</M>, <M>h = 0.1</M> — Forward / Backward / Central ตามลำดับ</p>,
    a: <PythonRunner code={`import math
f = math.sin
x = math.pi/4; h = 0.1
print(f"Forward = {(f(x+h)-f(x))/h:.6f}")
print(f"Backward = {(f(x)-f(x-h))/h:.6f}")
print(f"Central = {(f(x+h)-f(x-h))/(2*h):.6f}")
print(f"จริง = cos(π/4) = {math.cos(x):.6f}")`} height={140}/>
  },
  { id: "D02", topic: "diff", diff: "medium", title: "Second derivative",
    q: <p>หา <M>{`f''(2)`}</M> ของ <M>{`f(x) = x e^x`}</M>, h = 0.1 ด้วย Central O(h²)</p>,
    a: <div>
      <p>สูตร: <M>{`f''(x) \\approx [f(x+h) - 2f(x) + f(x-h)]/h^2`}</M></p>
      <p><M>f(2.1) = 17.149, f(2) = 14.778, f(1.9) = 12.703</M></p>
      <p>f''(2) ≈ (17.149 - 29.556 + 12.703)/0.01 = 29.6</p>
      <p>จริง: f'(x) = (1+x)e^x, f''(x) = (2+x)e^x → f''(2) = 4e² ≈ 29.556 (err 0.15%)</p>
    </div>
  },
  { id: "D03", topic: "diff", diff: "hard", title: "5-point Central",
    q: <p>ใช้ 5-point Central O(h⁴) หา <M>{`f'(0)`}</M> ของ <M>{`f(x) = \\cos x`}</M>, h = 0.2</p>,
    a: <div>
      <p>สูตร: <M>{`f'(x) \\approx [-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)]/(12h)`}</M></p>
      <p>f(0.4) = 0.9211, f(0.2) = 0.9801, f(-0.2) = 0.9801, f(-0.4) = 0.9211</p>
      <p>f'(0) ≈ (-0.9211 + 8·0.9801 - 8·0.9801 + 0.9211)/2.4 = 0 ✓ (จริง = -sin(0) = 0)</p>
    </div>
  },
  { id: "D04", topic: "diff", diff: "medium", title: "h ที่ดีที่สุด",
    q: <p>สำหรับ Central O(h²) ทำไม h เล็กไปทำให้ error ใหญ่ขึ้น?</p>,
    a: <p>Total error = truncation O(h²) + round-off O(ε/h) — เมื่อ h เล็กมาก ๆ ตัว round-off ใหญ่ ⇒ optimal h ~ (ε)^(1/3) ≈ 10⁻⁵ (สำหรับ double precision)</p>
  },

  // ============ MIXED & PROGRAMMING ============
  { id: "M01", topic: "mixed", diff: "hard", title: "Project — Drug Concentration",
    q: <div>
      <p>ยาในกระแสเลือดเป็นไปตาม <M>{`C(t) = 8 e^{-0.5t}(1 - \\cos t)`}</M> mg/L</p>
      <p>(a) หา t ที่ C(t) สูงสุดใน [0, 6] — Newton-Raphson</p>
      <p>(b) หา total drug exposure: <M>{`AUC = \\int_0^6 C(t) dt`}</M> — Composite Simpson n=12</p>
      <p>(c) หาช่วงเวลาที่ C(t) ≥ 2 mg/L — Bisection 2 รอบ</p>
    </div>,
    a: <PythonRunner code={`import math

def C(t): return 8 * math.exp(-0.5*t) * (1 - math.cos(t))
def Cp(t):
    e = math.exp(-0.5*t)
    return -4*e*(1-math.cos(t)) + 8*e*math.sin(t)

# (a) Newton: C'(t) = 0
t = 2.0
for i in range(6):
    Cpp_approx = (Cp(t+1e-6) - Cp(t-1e-6))/2e-6
    tn = t - Cp(t)/Cpp_approx
    print(f"i={i+1} t={t:.5f} → {tn:.5f}")
    if abs(tn - t) < 1e-7: break
    t = tn
print(f"\\nC สูงสุดที่ t ≈ {t:.4f}, C = {C(t):.4f}\\n")

# (b) Composite Simpson n=12
n = 12; a, b = 0, 6; h = (b-a)/n
s = C(a) + C(b)
for i in range(1, n):
    s += (4 if i%2 else 2) * C(a+i*h)
AUC = h/3 * s
print(f"AUC = {AUC:.4f} mg·h/L")`} height={300}/>
  },
  { id: "M02", topic: "mixed", diff: "hard", title: "Project — Temperature data",
    q: <div>
      <p>ข้อมูลอุณหภูมิ (°C) ทุกชั่วโมง: t = 0..6, T = 25, 24, 26, 30, 33, 31, 28</p>
      <p>(a) Interpolate (Newton DD) ที่ t = 3.5</p>
      <p>(b) Fit quadratic regression — เทียบ R²</p>
      <p>(c) คำนวณอุณหภูมิเฉลี่ย <M>{`\\bar T = \\frac{1}{6}\\int_0^6 T(t) dt`}</M></p>
    </div>,
    a: <PythonRunner code={`import numpy as np
ts = [0,1,2,3,4,5,6]
Ts = [25,24,26,30,33,31,28]

# (a) Newton DD
def newton_dd(xs, ys):
    n = len(xs); dd = [[y] for y in ys]
    for j in range(1, n):
        for i in range(n-j):
            dd[i].append((dd[i+1][j-1]-dd[i][j-1])/(xs[i+j]-xs[i]))
    return dd[0]

c = newton_dd(ts, Ts)
def eval_n(c, xs, x):
    r = c[0]; term = 1
    for k in range(1, len(c)):
        term *= (x - xs[k-1]); r += c[k]*term
    return r
print(f"T(3.5) ≈ {eval_n(c, ts, 3.5):.3f} °C")

# (b) Quadratic regression
n = len(ts); X = np.column_stack([np.ones(n), ts, np.array(ts)**2])
coef = np.linalg.lstsq(X, Ts, rcond=None)[0]
print(f"y = {coef[0]:.2f} + {coef[1]:.2f}t + {coef[2]:.2f}t²")
preds = X @ coef
R2 = 1 - sum((y-p)**2 for y,p in zip(Ts, preds)) / sum((y - sum(Ts)/n)**2 for y in Ts)
print(f"R² = {R2:.4f}")`} height={300}/>
  },

  // ============ NEW: LU / Cramer / Cholesky / Inverse ============
  // ⚠︎ id เดิมเป็น L05-L08 ซึ่งชนกับชุดบน ทำให้ React ทิ้งข้อไปเงียบ ๆ — เปลี่ยนเป็น L10-L13 แล้ว (16 ส.ค.)
  { id: "L14", topic: "linear", diff: "medium", title: "Cramer's Rule 3×3 ⭐ ออกสอบ",
    q: <p>ใช้ Cramer's Rule แก้ <MB>{`\\begin{cases} 2x + y - z = 8 \\\\ -3x - y + 2z = -11 \\\\ -2x + y + 2z = -3 \\end{cases}`}</MB></p>,
    a: <div>
      <p>det(A) = 2(−1·2 − 2·1) − 1(−3·2 − 2·(−2)) + (−1)(−3·1 − (−1)(−2)) = 2(−4) − 1(−2) + (−1)(−5) = −8 + 2 + 5 = −1</p>
      <p>det(A₁) = แทน col 1 ด้วย b → −2</p>
      <p>det(A₂) = แทน col 2 ด้วย b → −3</p>
      <p>det(A₃) = แทน col 3 ด้วย b → 1</p>
      <p>คำตอบ: x = 2, y = 3, z = −1</p>
    </div>
  },
  { id: "L11", topic: "linear", diff: "medium", title: "LU Decomposition (Doolittle) — ไม่ออกมิดเทอม",
    q: <p>แตก A เป็น LU ของ <MB>{`A = \\begin{pmatrix} 4 & 3 \\\\ 6 & 3 \\end{pmatrix}`}</MB> แล้วแก้ระบบ <M>{`Ax = (10, 12)^T`}</M></p>,
    a: <div>
      <p>L = [[1,0],[1.5,1]], U = [[4,3],[0,-1.5]]</p>
      <p>Ly = b → y = (10, -3)</p>
      <p>Ux = y → −1.5x₂ = −3 ⇒ x₂ = 2 · แล้ว 4x₁ + 3(2) = 10 ⇒ <b>x₁ = 1</b></p>
      <p><b>คำตอบ: x = (1, 2)</b></p>
      <p>ตรวจ: 4(1) + 3(2) = 10 ✓ · 6(1) + 3(2) = 12 ✓</p>
    </div>
  },
  { id: "L12", topic: "linear", diff: "hard", title: "Cholesky Decomposition — ไม่ออกมิดเทอม",
    q: <p>ตรวจว่า matrix <MB>{`A = \\begin{pmatrix} 4 & 12 & -16 \\\\ 12 & 37 & -43 \\\\ -16 & -43 & 98 \\end{pmatrix}`}</MB> เป็น SPD หรือไม่ แล้วหา Cholesky factor L</p>,
    a: <div>
      <p>ตรวจ symmetry ✓ ตรวจ leading mins: 4, 4·37−144=4, det = 36 — ทั้งหมด &gt;0 → SPD ✓</p>
      <p>L = [[2,0,0],[6,1,0],[-8,5,3]]</p>
      <p>ตรวจ LLᵀ = A ทีละช่อง: (2)(2)=4 ✓ · (6)(2)=12 ✓ · 6²+1²=37 ✓ · (−8)(2)=−16 ✓ · (−8)(6)+(5)(1)=−43 ✓ · (−8)²+5²+3²=98 ✓</p>
    </div>
  },
  { id: "L13", topic: "linear", diff: "hard", title: "Matrix Inversion — ไม่ออกมิดเทอม",
    q: <p>หา A⁻¹ ของ <MB>{`A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 7 \\end{pmatrix}`}</MB> โดย Gauss-Jordan บน [A | I]</p>,
    a: <div>
      <p>[1 2 | 1 0; 3 7 | 0 1] → R2 ← R2 − 3R1: [1 2 | 1 0; 0 1 | -3 1]</p>
      <p>R1 ← R1 − 2R2: [1 0 | 7 -2; 0 1 | -3 1]</p>
      <p>A⁻¹ = [[7, -2], [-3, 1]]</p>
      <p>ตรวจ: A · A⁻¹ = [[1·7+2·(-3), 1·(-2)+2·1],[3·7+7·(-3), 3·(-2)+7·1]] = [[1, 0],[0, 1]] ✓</p>
    </div>
  },

  // ============ NEW: Taylor Series ============
  { id: "R30", topic: "root", diff: "medium", title: "Taylor Series · sin(x) at x₀=0",
    q: <p>ประมาณค่า sin(1) โดย Taylor series รอบ <M>{`x_0 = 0`}</M> สำหรับ n = 1, 3, 5, 7 พร้อม error vs ค่าจริง sin(1) ≈ 0.8414710</p>,
    a: <div>
      <p>sin(x) ≈ x − x³/6 + x⁵/120 − x⁷/5040</p>
      <StepTable headers={["n","Tₙ(1)","|error|"]} rows={[
        [1, 1.0, 0.1585290],
        [3, 0.833333, 0.008138],
        [5, 0.841667, 0.000196],
        [7, 0.841468, 0.000003],
      ]}/>
    </div>
  },
  { id: "R11", topic: "root", diff: "hard", title: "Taylor series · เลือก x₀ ที่ดี",
    q: <p>ประมาณ ln(0.5) สองวิธี: (a) Taylor รอบ x₀=1 — n=4; (b) Taylor รอบ x₀=0.6 — n=4 → วิธีไหนแม่นกว่า ทำไม</p>,
    a: <p>(a) error % ≈ 14% — เพราะ |x − x₀| = 0.5 ใหญ่; (b) error % ≈ 0.4% — เพราะ |x − x₀| = 0.1 เล็ก → Taylor convergence ช้าเมื่อ x ไกล x₀</p>
  },

  // ============ NEW: Newton Forward / Backward ============
  { id: "I30", topic: "interp", diff: "easy", title: "Newton Forward Difference",
    q: <p>สร้างตาราง Δ จากข้อมูล x = [0,1,2,3], y = [1,3,9,27]; หา P(0.5) ด้วย Newton Forward formula</p>,
    a: <div>
      <StepTable headers={["x","y","Δy","Δ²y","Δ³y"]} rows={[
        [0, 1, 2, 4, 8],
        [1, 3, 6, 12, ""],
        [2, 9, 18, "", ""],
        [3, 27, "", "", ""],
      ]}/>
      <p>s = (0.5 − 0)/1 = 0.5</p>
      <p>P(0.5) = 1 + 0.5·2 + (0.5·-0.5)/2 · 4 + (0.5·-0.5·-1.5)/6 · 8 = 1 + 1 − 0.5 + 0.5 = 2.0</p>
    </div>
  },
  { id: "I31", topic: "interp", diff: "medium", title: "Newton Backward · ค่าใกล้ปลายตาราง",
    q: <p>ข้อมูล x = [0.1, 0.2, 0.3, 0.4, 0.5], y = [1.105, 1.221, 1.350, 1.492, 1.649] — ประมาณ y(0.46) ด้วย Newton Backward</p>,
    a: <p>s = (0.46 − 0.5)/0.1 = −0.4. y(0.46) ≈ 1.649 + (−0.4)(0.157) + ... ≈ 1.5841</p>
  },

  // ============ NEW: Linearization ============
  { id: "G30", topic: "regression", diff: "medium", title: "Exponential fit",
    q: <p>ข้อมูล x = [1,2,3,4,5], y = [2.5, 4.1, 6.8, 11.2, 18.5] — fit <M>{`y = a e^{bx}`}</M></p>,
    a: <div>
      <p>take ln y: [0.916, 1.411, 1.917, 2.416, 2.918]</p>
      <p>linear fit (x, ln y): slope ≈ 0.500, intercept ≈ 0.415</p>
      <p>a = e^0.415 ≈ 1.514, b = 0.500 → y ≈ 1.514 e^(0.5x)</p>
    </div>
  },
  { id: "G05", topic: "regression", diff: "hard", title: "Power vs Exponential",
    q: <p>ข้อมูล x = [1,2,4,8,16], y = [3, 6, 12, 24, 48] — fit ทั้ง <M>{`y=ax^b`}</M> และ <M>{`y=ae^{bx}`}</M> เทียบ RMSE ดูว่าโมเดลไหนเหมาะ</p>,
    a: <p>data ดูเป็น power (เพราะ y กับ x เท่าตัวเสมอ → log-log linear) → Power: a=3, b=1 (สมบูรณ์); Exponential ไม่เหมาะเลย — RMSE สูงกว่ามาก</p>
  },

  // ============ NEW: Romberg / Gauss-Legendre ============
  { id: "N30", topic: "integ", diff: "medium", title: "Romberg Integration",
    q: <p>ใช้ Romberg ระดับ 3 (n = 1, 2, 4) คำนวณ <M>{`\\int_0^1 \\frac{1}{1+x^2} dx`}</M> เทียบ π/4 ≈ 0.7853982</p>,
    a: <div>
      <p>R[0][0] = Trap n=1 = 0.5(1+0.5)·1 = 0.75</p>
      <p>R[1][0] = Trap n=2 = 0.7750</p>
      <p>R[2][0] = Trap n=4 = 0.7828</p>
      <p>R[1][1] = (4·0.7750 − 0.75)/3 = 0.7833</p>
      <p>R[2][1] = (4·0.7828 − 0.7750)/3 = 0.7854</p>
      <p>R[2][2] = (16·0.7854 − 0.7833)/15 = 0.7854 ✓ (ใกล้ค่าจริงมาก)</p>
    </div>
  },
  { id: "N31", topic: "integ", diff: "medium", title: "Gauss-Legendre 2-point",
    q: <p>ใช้ Gauss-Legendre 2 จุดบน [0, 2] คำนวณ <M>{`\\int_0^2 e^x dx`}</M> เทียบ e²−1 ≈ 6.3891</p>,
    a: <div>
      <p>map [−1, 1] → [0, 2]: x = 1 + t, dx = dt</p>
      <p>nodes t = ±1/√3 ≈ ±0.5774, weights w = 1, 1</p>
      <p>x₁ = 1 − 0.5774 = 0.4226, x₂ = 1 + 0.5774 = 1.5774</p>
      <p>I ≈ (1)·[1·e^0.4226 + 1·e^1.5774] = 1.5260 + 4.8429 = 6.3689</p>
      <p>error % ≈ 0.32% — แค่ 2 จุด ก็แม่นกว่า Trap n=4!</p>
    </div>
  },
  { id: "N06", topic: "integ", diff: "hard", title: "Gauss-Legendre 3-point",
    q: <p>เปรียบเทียบ Gauss-Legendre 3 จุด, Composite Simpson n=4, Composite Trap n=8 สำหรับ <M>{`\\int_0^{\\pi} \\sin x\\, dx = 2`}</M> — วิธีไหน fastest+แม่นที่สุด</p>,
    a: <p>Gauss-Leg 3-pt ≈ 1.99999... (err ~10⁻⁶), Simpson n=4 ≈ 2.0046 (err 0.23%), Trap n=8 ≈ 1.974 (err 1.3%) → Gauss ใช้แค่ 3 evals แต่แม่นที่สุด</p>
  },

  // ============ NEW: Richardson ============
  { id: "D30", topic: "diff", diff: "medium", title: "Richardson Extrapolation",
    q: <p>คำนวณ f'(1) ของ <M>{`f(x) = \\ln x`}</M> โดย: (a) Central h=0.2; (b) Central h=0.1; (c) Richardson — เทียบกับค่าจริง 1.0</p>,
    a: <div>
      <p>(a) D(0.2) = (ln 1.2 − ln 0.8)/0.4 = 1.01366</p>
      <p>(b) D(0.1) = (ln 1.1 − ln 0.9)/0.2 = 1.00335</p>
      <p>(c) Richardson = (4·1.00335 − 1.01366)/3 = 0.999909 → err 0.009%</p>
      <p>เห็นว่า Richardson ลด error จาก 0.3% เหลือ 0.009% (ดีขึ้น 30 เท่า!)</p>
    </div>
  },

  // ============ NEW: Mixed / Project ============
  { id: "M03", topic: "mixed", diff: "hard", title: "หา x ที่ทำให้ ∫₀ˣ e^(-t²) dt = 0.5",
    q: <PythonRunner code={`import math
from scipy.integrate import quad

# erf-like integral; we want x s.t. F(x) = 0.5
def F(x):
    val, _ = quad(lambda t: math.exp(-t*t), 0, x)
    return val

# โจทย์ Bisection หา x ที่ F(x) = 0.5
def bisect(g, a, b, tol=1e-6):
    while b - a > tol:
        m = (a+b)/2
        if g(a)*g(m) < 0: b = m
        else: a = m
    return (a+b)/2

ans = bisect(lambda x: F(x) - 0.5, 0, 2)
print(f"x ≈ {ans:.6f} → F(x) = {F(ans):.6f}")`} height={200}/>,
    a: <p>เป็นโจทย์ผสม integration + root finding: ใช้ Bisection แต่ละ iter ต้อง numerical integrate ด้วย → คำตอบ x ≈ 0.4769</p>
  },
  { id: "M04", topic: "mixed", diff: "hard", title: "ODE-like project — Population",
    q: <p>แบบจำลอง population: <M>{`dP/dt = 0.1 P(1 - P/1000)`}</M>, <M>{`P(0) = 50`}</M> — ใช้ Euler step h = 5 ทำนาย P(50) จากนั้น regression fit logistic model จาก data ที่ได้</p>,
    a: <p>นี่เป็นโจทย์ project แบบหลายขั้น — รวม Euler ODE + regression — ดู Mock Exam Set H</p>
  },

  // ============ ระดับ "ข้อสอบจริง" — ยากกว่าแบบฝึกฉบับเต็ม ============
  { id: "X01", topic: "root", diff: "hard", title: "🔥 EXAM · Newton + พิสูจน์ convergence rate",
    q: <div>
      <p>กำหนด <M>{`f(x) = x - \\cos x = 0`}</M></p>
      <p><b>(a)</b> ใช้ Newton-Raphson หา x โดย <M>{`x_0 = 0.5`}</M> ทำมือ 4 iterations แสดง <M>{`x, f(x), f'(x), x_{\\text{new}}, \\varepsilon_a`}</M> ทุกรอบ</p>
      <p><b>(b)</b> คำนวณ <em>true error</em> จากค่าจริง (~0.7390851332) เทียบ <em>approximate error</em> ทุก iter — สังเกตว่า quadratic convergence: <M>{`e_{n+1} \\approx C e_n^2`}</M></p>
      <p><b>(c)</b> เขียน code Python รับ tolerance + พิมพ์ table</p>
    </div>,
    a: <div>
      <p><M>{`f'(x) = 1 + \\sin x`}</M></p>
      <StepTable headers={["i","x","f(x)","f'(x)","x_new","true err","approx %"]} rows={[
        [1, 0.5000000, -0.3775826, 1.4794255, 0.7552224, 0.0161372, "33.79"],
        [2, 0.7552224, 0.0271033, 1.6854230, 0.7391412, 0.0000561, "2.18"],
        [3, 0.7391412, 0.0000946, 1.6736322, 0.7390851, 0.0000001, "0.0076"],
        [4, 0.7390851, 0.0000000, 1.6735909, 0.7390851, "≈ 0", "≈ 0"],
      ]}/>
      <p>สังเกต e₁ = 0.0161, e₂ = 5.6×10⁻⁵, e₃ = 1×10⁻⁷</p>
      <p>e₂ / e₁² = 5.6e-5 / (0.0161)² = 0.216 ≈ |f''(x*)/(2 f'(x*))| → ยืนยัน quadratic convergence ✓</p>
      <PythonRunner code={`import math
def newton(f, fp, x0, tol=1e-10, max_iter=100):
    x = x0
    print(f"{'i':>3} {'x':>14} {'f(x)':>14} {'εₐ %':>10}")
    for i in range(max_iter):
        fx, fpx = f(x), fp(x)
        xn = x - fx/fpx
        err = abs((xn-x)/xn) if xn else abs(xn-x)
        print(f"{i+1:3d} {x:14.10f} {fx:14.6e} {err*100:10.6f}")
        if err < tol: return xn
        x = xn
ans = newton(lambda x: x - math.cos(x), lambda x: 1 + math.sin(x), 0.5)
print(f"\\nคำตอบ x ≈ {ans:.10f}")`} height={200}/>
    </div>
  },

  { id: "X02", topic: "linear", diff: "hard", title: "🔥 EXAM · LU + Cholesky + Inverse บน matrix เดียว",
    q: <div>
      <p>กำหนด <MB>{`A = \\begin{pmatrix} 9 & 6 & 3 \\\\ 6 & 13 & 8 \\\\ 3 & 8 & 14 \\end{pmatrix},\\ b = \\begin{pmatrix} 12 \\\\ 23 \\\\ 30 \\end{pmatrix}`}</MB></p>
      <p><b>(a)</b> ตรวจว่า A เป็น SPD — แสดง leading minor det ทุก order</p>
      <p><b>(b)</b> แตก A ด้วย LU Doolittle — แสดง L, U ทำมือ</p>
      <p><b>(c)</b> ใช้ LU แก้ Ax = b</p>
      <p><b>(d)</b> ทำ Cholesky decomposition: A = LLᵀ — แสดง L ทำมือทุก lᵢⱼ</p>
      <p><b>(e)</b> หา A⁻¹ ด้วย Gauss-Jordan</p>
      <p><b>(f)</b> เขียน Python ทำทุกข้อ + verify A·x = b</p>
    </div>,
    a: <PythonRunner code={`import numpy as np
A = np.array([[9,6,3],[6,13,8],[3,8,14]], float)
b = np.array([12,23,30], float)

# (a) leading minors
m1 = A[0,0]; m2 = np.linalg.det(A[:2,:2]); m3 = np.linalg.det(A)
print(f"Leading mins: {m1}, {m2}, {m3:.4f} → SPD ✓\\n")

# (b)(c) LU
from scipy.linalg import lu_factor, lu_solve
lu_f, piv = lu_factor(A)
x_lu = lu_solve((lu_f, piv), b)
print(f"LU x = {x_lu}\\n")

# (d) Cholesky
L = np.linalg.cholesky(A)
print("L =\\n", L.round(4))
y = np.linalg.solve(L, b)
x_ch = np.linalg.solve(L.T, y)
print(f"Cholesky x = {x_ch}\\n")

# (e) Inverse
A_inv = np.linalg.inv(A)
print("A⁻¹ =\\n", A_inv.round(4))
x_inv = A_inv @ b
print(f"\\nA⁻¹·b = {x_inv}")

# Verify
print(f"\\nVerify A·x = b? {np.allclose(A @ x_lu, b)}")`} height={300}/>
  },

  { id: "X03", topic: "interp", diff: "hard", title: "🔥 EXAM · Newton DD + Lagrange + Spline เปรียบเทียบ",
    q: <div>
      <p>ข้อมูล <em>การวัดอุณหภูมิดาวเทียม</em>:</p>
      <NumTable headers={["t (วินาที)", "T (°C)"]} rows={[
        [0, -2.5], [10, 8.3], [20, 24.6], [30, 41.2], [40, 52.8], [50, 49.1]
      ]}/>
      <p>(เห็นได้ว่า T เพิ่มแล้วลด — มี peak ระหว่าง t = 40-50)</p>
      <p><b>(a)</b> สร้างตาราง Newton's Divided Difference ครบทุกคอลัมน์ — แสดงทำมือ</p>
      <p><b>(b)</b> ใช้ Newton DD degree 5 ประมาณ T(25) และ T(45)</p>
      <p><b>(c)</b> ใช้ Lagrange degree 5 ประมาณ T(25) — เปรียบเทียบกับ (b) ต้องเท่ากัน (พิสูจน์ทฤษฎี polynomial เอกลักษณ์)</p>
      <p><b>(d)</b> ใช้ Cubic Spline ประมาณ T(25), T(45) — เทียบกับ Newton</p>
      <p><b>(e)</b> โจทย์ <b>extrapolate</b>: ใช้พหุนาม degree 5 ประมาณ T(60) — เห็น Runge phenomenon: extrapolate ไกล → error ระเบิด</p>
      <p><b>(f)</b> Python: plot T(t) จาก 3 methods (Newton, Lagrange, Spline) + ข้อมูลจริง</p>
    </div>,
    a: <PythonRunner code={`import numpy as np
from scipy.interpolate import CubicSpline, lagrange

t = [0, 10, 20, 30, 40, 50]
T = [-2.5, 8.3, 24.6, 41.2, 52.8, 49.1]

# Newton DD
def newton_dd(xs, ys):
    n = len(xs)
    dd = [list(ys)] + [[0]*(n-j) for j in range(1,n)]
    coeffs = [ys[0]]
    for j in range(1, n):
        for i in range(n-j):
            dd[j][i] = (dd[j-1][i+1] - dd[j-1][i]) / (xs[i+j] - xs[i])
        coeffs.append(dd[j][0])
    return coeffs

def eval_newton(coeffs, xs, x):
    s = coeffs[0]; term = 1
    for k in range(1, len(coeffs)):
        term *= (x - xs[k-1])
        s += coeffs[k] * term
    return s

coeffs = newton_dd(t, T)
print("Newton DD coefficients:", [round(c, 4) for c in coeffs])

for x in [25, 45, 60]:
    n_val = eval_newton(coeffs, t, x)
    l_val = lagrange(t, T)(x)
    cs = CubicSpline(t, T)
    s_val = cs(x)
    print(f"t={x}: Newton={n_val:.4f}, Lagrange={l_val:.4f}, Spline={s_val:.4f}")

# (e) Extrapolation warning
print("\\n⚠ t=60 อยู่นอกข้อมูล — Newton/Lagrange ระเบิด, Spline ดีกว่าแต่ก็ไม่เชื่อ")`} height={300}/>
  },

  { id: "X04", topic: "regression", diff: "hard", title: "🔥 EXAM · Multiple Linear + Nonlinear (Logistic)",
    q: <div>
      <p>ข้อมูลผลทดลอง: ระดับยา (mg) × อายุ (yrs) × เพศ (0/1) → effectiveness (0-100)</p>
      <NumTable headers={["dose","age","sex","y"]} rows={[
        [5, 25, 0, 38], [10, 30, 1, 56], [15, 22, 0, 67],
        [20, 45, 1, 78], [25, 38, 0, 81], [30, 50, 1, 88],
        [35, 28, 0, 91], [40, 60, 1, 92],
      ]}/>
      <p><b>(a)</b> Multiple Linear Regression: <M>{`y = a_0 + a_1·\\text{dose} + a_2·\\text{age} + a_3·\\text{sex}`}</M> — แสดง <M>{`Z^T Z`}</M> และ <M>{`Z^T y`}</M></p>
      <p><b>(b)</b> คำนวณ R² + residuals — ทำนาย y ที่ (dose=22, age=35, sex=0)</p>
      <p><b>(c)</b> สังเกตว่า y ขึ้น เร็วตอนแรก แล้วช้าลง → Linearize <M>{`y = 100/(1 + e^{-(a + b\\,\\text{dose})})`}</M> (logistic)</p>
      <p><b>(d)</b> เปรียบเทียบ RMSE ของ 2 model</p>
    </div>,
    a: <PythonRunner code={`import numpy as np, math
X = np.array([[5,25,0],[10,30,1],[15,22,0],[20,45,1],[25,38,0],[30,50,1],[35,28,0],[40,60,1]], float)
y = np.array([38,56,67,78,81,88,91,92], float)
n = len(y)

# (a) Multiple Linear
Z = np.column_stack([np.ones(n), X])
ZTZ = Z.T @ Z; ZTy = Z.T @ y
a = np.linalg.solve(ZTZ, ZTy)
print(f"Linear: y = {a[0]:.2f} + {a[1]:.3f}·dose + {a[2]:.3f}·age + {a[3]:.2f}·sex")
y_pred = Z @ a
ss_res = np.sum((y - y_pred)**2); ss_tot = np.sum((y - y.mean())**2)
R2 = 1 - ss_res/ss_tot; rmse = math.sqrt(ss_res/n)
print(f"R² = {R2:.4f}, RMSE = {rmse:.3f}")
print(f"Predict (22, 35, 0): {a[0] + a[1]*22 + a[2]*35 + a[3]*0:.2f}")

# (c) Logistic (linearize)
# y = 100/(1+e^-(a+b·dose)) → ln(y/(100-y)) = a + b·dose
dose = X[:,0]
Y = np.log(y / (100 - y))
sx, sy = dose.sum(), Y.sum(); sxx = (dose*dose).sum(); sxy = (dose*Y).sum()
b = (n*sxy - sx*sy)/(n*sxx - sx*sx); a_log = (sy - b*sx)/n
print(f"\\nLogistic: y = 100/(1+exp(-({a_log:.3f} + {b:.3f}·dose)))")
y_log = 100 / (1 + np.exp(-(a_log + b*dose)))
rmse_log = math.sqrt(np.mean((y - y_log)**2))
print(f"RMSE_logistic = {rmse_log:.3f}  (vs linear {rmse:.3f})")`} height={300}/>
  },

  { id: "X05", topic: "integ", diff: "hard", title: "🔥 EXAM · Romberg + Adaptive + Gauss-Legendre บนฟังก์ชันเดียวกัน",
    q: <div>
      <p>คำนวณ <M>{`I = \\int_0^2 \\frac{\\sin(10x)}{1 + x^2}\\, dx`}</M> (มี oscillation สูง — ยากสำหรับ method ปกติ)</p>
      <p><b>(a)</b> Composite Trapezoidal n = 8, 16, 32, 64 — เห็น convergence ช้า</p>
      <p><b>(b)</b> Composite Simpson n = 8, 16, 32, 64 — เร็วขึ้น</p>
      <p><b>(c)</b> Romberg ระดับ 5 — เร็วที่สุด</p>
      <p><b>(d)</b> Gauss-Legendre 2-pt, 3-pt, 4-pt — เห็นว่า 4-pt ก็ยังไม่พอเพราะ <em>oscillation นอกขอบเขต polynomial</em></p>
      <p><b>(e)</b> วิเคราะห์: ทำไม Gauss แพ้ Romberg ในเคสนี้?</p>
    </div>,
    a: <PythonRunner code={`import math
f = lambda x: math.sin(10*x) / (1 + x*x)
true_val = 0.34746  # อ้างอิงจาก scipy quad

def trap(f, a, b, n):
    h = (b-a)/n
    return h/2 * (f(a) + f(b) + 2*sum(f(a+i*h) for i in range(1,n)))
def simp(f, a, b, n):
    h = (b-a)/n
    s = f(a) + f(b)
    for i in range(1, n): s += (4 if i%2 else 2)*f(a+i*h)
    return h/3 * s
def romberg(f, a, b, k):
    R = [[0]*k for _ in range(k)]
    for i in range(k): R[i][0] = trap(f, a, b, 2**i)
    for j in range(1, k):
        for i in range(j, k): R[i][j] = (4**j * R[i][j-1] - R[i-1][j-1])/(4**j-1)
    return R[k-1][k-1]

print(f"True = {true_val:.6f}\\n")
print("(a)(b) Trap vs Simpson:")
print(f"{'n':>4} {'Trap':>14} {'err%':>10} {'Simp':>14} {'err%':>10}")
for n in [8, 16, 32, 64]:
    t = trap(f, 0, 2, n); s = simp(f, 0, 2, n)
    print(f"{n:4d} {t:14.6f} {abs(t-true_val)/true_val*100:10.4f} {s:14.6f} {abs(s-true_val)/true_val*100:10.4f}")

print(f"\\n(c) Romberg k=5: {romberg(f, 0, 2, 5):.8f}  err = {abs(romberg(f,0,2,5)-true_val):.2e}")

print("\\n(d) Gauss-Legendre:")
GL = {2:[(-1/math.sqrt(3),1),(1/math.sqrt(3),1)],
      3:[(-math.sqrt(3/5),5/9),(0,8/9),(math.sqrt(3/5),5/9)],
      4:[(-0.861136,0.347855),(-0.339981,0.652145),(0.339981,0.652145),(0.861136,0.347855)]}
for N, nw in GL.items():
    mid, half = 1, 1
    val = half * sum(w*f(mid+half*t) for t,w in nw)
    print(f"  {N}-pt: {val:.6f}  err = {abs(val-true_val):.4f}")

print("\\n(e) Gauss แพ้เพราะ sin(10x) ไม่ใช่ polynomial degree ต่ำ — มี oscillation 3 รอบใน [0,2]")
print("    Romberg แม่นกว่าเพราะ Richardson extrapolate ที่หลายจุด → จับ oscillation ได้")`} height={400}/>
  },

  { id: "X06", topic: "diff", diff: "hard", title: "🔥 EXAM · Richardson + Higher-order Diff + Error analysis",
    q: <div>
      <p>กำหนด <M>{`f(x) = e^{-x^2}`}</M> ที่ <M>{`x = 0.5`}</M> ค่าจริง <M>{`f'(0.5) = -1·e^{-0.25}·1 = -0.7788`}</M></p>
      <p><b>(a)</b> Central diff O(h²) ที่ h = 0.4, 0.2, 0.1, 0.05, 0.01 — รายงาน |error|</p>
      <p><b>(b)</b> Richardson Extrapolation (h, h/2) ที่ h = 0.4, 0.2 — ลด error ขนาดไหน</p>
      <p><b>(c)</b> Central 5-point O(h⁴) — เทียบ Richardson</p>
      <p><b>(d)</b> โจทย์ <em>หา</em> h ที่ดีที่สุด: ลด h ต่อ → ตอนไหน round-off ชนะ truncation</p>
    </div>,
    a: <PythonRunner code={`import math
f = lambda x: math.exp(-x*x)
true_val = -math.exp(-0.25)   # = -0.7788

def central(f, x, h): return (f(x+h)-f(x-h))/(2*h)
def central5(f, x, h): return (-f(x+2*h) + 8*f(x+h) - 8*f(x-h) + f(x-2*h))/(12*h)
def richardson(f, x, h):
    D1 = central(f, x, h); D2 = central(f, x, h/2)
    return (4*D2 - D1)/3

print(f"True f'(0.5) = {true_val:.10f}\\n")
print(f"{'h':>10} {'Central O(h²)':>18} {'|err|':>12} {'Richardson':>14} {'|err|':>12} {'Central5 O(h⁴)':>18} {'|err|':>12}")
for h in [0.4, 0.2, 0.1, 0.05, 0.01, 0.001, 1e-6, 1e-10]:
    c = central(f, 0.5, h); r = richardson(f, 0.5, h); c5 = central5(f, 0.5, h)
    print(f"{h:10.0e} {c:18.12f} {abs(c-true_val):12.2e} {r:14.10f} {abs(r-true_val):12.2e} {c5:18.12f} {abs(c5-true_val):12.2e}")

print("\\nสังเกต: ที่ h=10⁻¹⁰ Central O(h²) error เพิ่ม! round-off > truncation")
print("Sweet spot: h ≈ 10⁻⁵ สำหรับ O(h²)  |  h ≈ 10⁻³ สำหรับ O(h⁴)")`} height={300}/>
  },

  { id: "X07", topic: "mixed", diff: "hard", title: "🔥 EXAM PROJECT · Heat Transfer (โจทย์ Project ระดับ Final)",
    q: <div>
      <p><b>โจทย์ระดับ project — ใช้ทุก method ที่เรียนมา</b></p>
      <p>มีท่อความร้อน อุณหภูมิที่จุดต่าง ๆ ตามความยาว x:</p>
      <NumTable headers={["x (cm)", "T (°C)"]} rows={[
        [0, 100], [10, 78], [20, 62], [30, 51], [40, 43], [50, 38], [60, 35]
      ]}/>
      <p>การถ่ายเทความร้อน <M>{`Q = -k A \\frac{dT}{dx}`}</M> โดย k = 0.5 W/(m·K), A = 0.01 m²</p>
      <p><b>(1)</b> ใช้ <b>Cubic Spline</b> สร้างฟังก์ชัน T(x) ต่อเนื่อง</p>
      <p><b>(2)</b> ใช้ <b>Central Difference</b> หา dT/dx ที่ x = 25 — เทียบกับ Spline derivative</p>
      <p><b>(3)</b> หา <b>Q</b> ที่ x = 25</p>
      <p><b>(4)</b> ใช้ <b>Composite Simpson</b> คำนวณ <em>average T</em> = <M>{`\\frac{1}{60}\\int_0^{60} T(x)\\,dx`}</M></p>
      <p><b>(5)</b> หา x ที่ T = 50 ด้วย <b>Bisection</b> บน spline interpolation</p>
      <p><b>(6)</b> Linearize: ดู T(x) คล้าย exponential decay <M>{`T = T_∞ + (T_0 - T_∞)e^{-bx}`}</M> — fit b ด้วย linearization โดยสมมุติ <M>{`T_∞ = 30`}</M></p>
      <p><b>(7)</b> เขียน <b>Python script เดียว</b> ทำทุกข้อ</p>
    </div>,
    a: <PythonRunner code={`import numpy as np, math
from scipy.interpolate import CubicSpline

x = np.array([0,10,20,30,40,50,60])
T = np.array([100,78,62,51,43,38,35])
k, A = 0.5, 0.01

# (1) Cubic Spline
cs = CubicSpline(x, T, bc_type='natural')

# (2) Central diff vs Spline derivative
h = 1.0
dT_central = (cs(25+h) - cs(25-h)) / (2*h)
dT_spline = cs(25, 1)
print(f"(2) dT/dx ที่ x=25: Central = {dT_central:.4f}, Spline = {dT_spline:.4f}")

# (3) Q at x=25
Q = -k * A * dT_spline
print(f"(3) Q(25) = {Q:.4f} W")

# (4) Average T via Simpson
def simp(f, a, b, n):
    h = (b-a)/n; s = f(a)+f(b)
    for i in range(1,n): s += (4 if i%2 else 2)*f(a+i*h)
    return h/3 * s
avg_T = simp(cs, 0, 60, 30) / 60
print(f"(4) Average T = {avg_T:.4f} °C")

# (5) Bisection หา T(x) = 50
def bisect(f, a, b, tol=1e-6):
    while b-a > tol:
        m = (a+b)/2
        if f(a)*f(m) < 0: b = m
        else: a = m
    return (a+b)/2
x_50 = bisect(lambda v: cs(v) - 50, 20, 40)
print(f"(5) T = 50 ที่ x = {x_50:.4f}")

# (6) Linearize: ln(T - 30) = ln(T0 - 30) - bx
T_inf = 30
Y = np.log(T - T_inf)
n = len(x); sx, sy = x.sum(), Y.sum(); sxx = (x*x).sum(); sxy = (x*Y).sum()
b = -(n*sxy - sx*sy)/(n*sxx - sx*sx); T0 = math.exp((sy + b*sx)/n) + T_inf
print(f"(6) Fit: T(x) = {T_inf} + {T0-T_inf:.2f}·exp(-{b:.5f}·x)")
print(f"    ทำนาย T(25): {T_inf + (T0-T_inf)*math.exp(-b*25):.2f} (vs spline {cs(25):.2f})")`} height={400}/>
  },

  // ============ PROOF PROBLEMS — อาจารย์ออกในข้อสอบบ่อย ============
  { id: "P01", topic: "proof", diff: "medium", title: "พิสูจน์สูตร False Position",
    q: <div>
      <p>จงพิสูจน์ว่าสูตร False Position:</p>
      <MB>{`x_m = \\frac{x_l\\,f(x_r) - x_r\\,f(x_l)}{f(x_r) - f(x_l)}`}</MB>
      <p>มาจากการลากเส้นตรงผ่าน <M>{`(x_l, f(x_l))`}</M> และ <M>{`(x_r, f(x_r))`}</M> แล้วหาจุดที่เส้นนี้ตัดแกน <M>x</M></p>
    </div>,
    a: <div>
      <p><b>ขั้นที่ 1</b> · สมการเส้นตรงผ่าน 2 จุด <M>{`(x_l, f_l)`}</M> และ <M>{`(x_r, f_r)`}</M>:</p>
      <MB>{`\\frac{y - f_l}{x - x_l} = \\frac{f_r - f_l}{x_r - x_l}`}</MB>
      <p><b>ขั้นที่ 2</b> · ให้ <M>{`y = 0`}</M> (จุดตัดแกน x = <M>{`x_m`}</M>):</p>
      <MB>{`\\frac{-f_l}{x_m - x_l} = \\frac{f_r - f_l}{x_r - x_l}`}</MB>
      <p><b>ขั้นที่ 3</b> · cross multiply:</p>
      <MB>{`-f_l(x_r - x_l) = (f_r - f_l)(x_m - x_l)`}</MB>
      <MB>{`x_m - x_l = \\frac{-f_l(x_r - x_l)}{f_r - f_l}`}</MB>
      <MB>{`x_m = x_l - \\frac{f_l(x_r - x_l)}{f_r - f_l}`}</MB>
      <p><b>ขั้นที่ 4</b> · จัดรูปอีกแบบ (รวมเป็นเศษเดียว):</p>
      <MB>{`x_m = \\frac{x_l(f_r - f_l) - f_l(x_r - x_l)}{f_r - f_l} = \\frac{x_l f_r - f_l x_r}{f_r - f_l}`}</MB>
      <p>หรือเทียบเท่า: <M>{`x_m = \\frac{x_l f(x_r) - x_r f(x_l)}{f(x_r) - f(x_l)}`}</M> ✓</p>
    </div>
  },

  { id: "P02", topic: "proof", diff: "easy", title: "พิสูจน์ Newton-Raphson จาก Taylor",
    q: <div>
      <p>ใช้ Taylor expansion ลำดับ 1 รอบ <M>{`x_n`}</M>:</p>
      <MB>{`f(x) \\approx f(x_n) + f'(x_n)(x - x_n)`}</MB>
      <p>จงหา <M>{`x_{n+1}`}</M> ที่ทำให้ <M>{`f(x_{n+1}) = 0`}</M> — ได้สูตร Newton-Raphson</p>
    </div>,
    a: <div>
      <p>ตั้ง <M>{`f(x_{n+1}) = 0`}</M> ในสูตร Taylor ลำดับ 1:</p>
      <MB>{`0 \\approx f(x_n) + f'(x_n)(x_{n+1} - x_n)`}</MB>
      <p>แก้หา <M>{`x_{n+1}`}</M>:</p>
      <MB>{`f'(x_n)(x_{n+1} - x_n) = -f(x_n)`}</MB>
      <MB>{`x_{n+1} - x_n = -\\frac{f(x_n)}{f'(x_n)}`}</MB>
      <MB>{`\\boxed{\\; x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)} \\;}`}</MB>
      <p>เงื่อนไข: <M>{`f'(x_n) \\neq 0`}</M> (มิฉะนั้นวิธีพัง — แทนเจนต์ขนานแกน x)</p>
    </div>
  },

  { id: "P03", topic: "proof", diff: "hard", title: "พิสูจน์ CG λₖ (step size)",
    q: <div>
      <p>กำหนด <M>{`f(x) = \\tfrac{1}{2} x^T A x - b^T x`}</M> และการ update <M>{`x^{(k+1)} = x^{(k)} + \\lambda D^{(k)}`}</M></p>
      <p>จงพิสูจน์ว่า λ ที่ทำให้ <M>{`f(x^{(k+1)})`}</M> ต่ำสุดคือ:</p>
      <MB>{`\\lambda_k = -\\frac{(D^{(k)})^T R^{(k)}}{(D^{(k)})^T A D^{(k)}}, \\quad R^{(k)} = A x^{(k)} - b`}</MB>
    </div>,
    a: <div>
      <p><b>ขั้นที่ 1</b> · แทน <M>{`x^{(k)} + \\lambda D^{(k)}`}</M> ใน f:</p>
      <MB>{`f(x + \\lambda D) = \\tfrac{1}{2}(x + \\lambda D)^T A (x + \\lambda D) - b^T(x + \\lambda D)`}</MB>
      <p><b>ขั้นที่ 2</b> · กระจาย (ใช้ A สมมาตร <M>{`x^T A D = D^T A x`}</M>):</p>
      <MB>{`= \\tfrac{1}{2} x^T A x + \\lambda x^T A D + \\tfrac{1}{2}\\lambda^2 D^T A D - b^T x - \\lambda b^T D`}</MB>
      <p><b>ขั้นที่ 3</b> · diff เทียบ λ:</p>
      <MB>{`\\frac{\\partial f}{\\partial \\lambda} = x^T A D + \\lambda D^T A D - b^T D = (Ax - b)^T D + \\lambda D^T A D = R^T D + \\lambda D^T A D`}</MB>
      <p><b>ขั้นที่ 4</b> · เซต = 0:</p>
      <MB>{`\\lambda_k = -\\frac{R^T D}{D^T A D} = -\\frac{D^T R}{D^T A D} \\quad \\blacksquare`}</MB>
    </div>
  },

  { id: "P04", topic: "proof", diff: "hard", title: "พิสูจน์ CG αₖ (mixing factor)",
    q: <div>
      <p>กำหนดทิศใหม่ <M>{`D^{(k+1)} = -R^{(k+1)} + \\alpha_k D^{(k)}`}</M></p>
      <p>จงพิสูจน์ว่า <M>{`\\alpha_k`}</M> ที่ทำให้ <M>{`D^{(k+1)}`}</M> และ <M>{`D^{(k)}`}</M> <em>A-conjugate</em> กัน (<M>{`(D^{(k+1)})^T A D^{(k)} = 0`}</M>) คือ:</p>
      <MB>{`\\alpha_k = \\frac{(R^{(k+1)})^T A D^{(k)}}{(D^{(k)})^T A D^{(k)}}`}</MB>
    </div>,
    a: <div>
      <p><b>ขั้นที่ 1</b> · แทน <M>{`D^{(k+1)}`}</M> ในเงื่อนไข conjugacy:</p>
      <MB>{`(-R^{(k+1)} + \\alpha_k D^{(k)})^T A D^{(k)} = 0`}</MB>
      <p><b>ขั้นที่ 2</b> · กระจาย:</p>
      <MB>{`-(R^{(k+1)})^T A D^{(k)} + \\alpha_k (D^{(k)})^T A D^{(k)} = 0`}</MB>
      <p><b>ขั้นที่ 3</b> · แก้หา αₖ:</p>
      <MB>{`\\alpha_k = \\frac{(R^{(k+1)})^T A D^{(k)}}{(D^{(k)})^T A D^{(k)}} \\quad \\blacksquare`}</MB>
      <p>หมายเหตุ: เพราะ <M>A</M> สมมาตรและ PD ตัวส่วน <M>{`D^T A D > 0`}</M> (เว้นกรณี D=0 ที่ระบุได้ว่าลู่เข้าแล้ว) — αₖ มีอยู่จริงและจำกัด</p>
    </div>
  },

  { id: "P05", topic: "proof", diff: "hard", title: "พิสูจน์ Simpson's 1/3 จาก Lagrange",
    q: <div>
      <p>จงพิสูจน์สูตร Simpson's 1/3:</p>
      <MB>{`\\int_{x_0}^{x_2} f(x)\\, dx \\approx \\frac{h}{3}\\left[ f(x_0) + 4 f(x_1) + f(x_2) \\right]`}</MB>
      <p>โดยการ integrate Lagrange Polynomial 2nd-order ผ่าน 3 จุด <M>{`(x_0, f_0),\\, (x_1, f_1),\\, (x_2, f_2)`}</M> ที่ห่างเท่ากัน <M>{`h = x_1 - x_0 = x_2 - x_1`}</M></p>
    </div>,
    a: <div>
      <p><b>ขั้นที่ 1</b> · ใช้พิกัดเลื่อน <M>{`u = x - x_1`}</M> → จุดเป็น <M>{`-h, 0, +h`}</M></p>
      <p><b>ขั้นที่ 2</b> · Lagrange polynomial 3 จุด:</p>
      <MB>{`P(u) = f_0 \\cdot \\frac{u(u-h)}{(-h)(-2h)} + f_1 \\cdot \\frac{(u+h)(u-h)}{(h)(-h)} + f_2 \\cdot \\frac{(u+h)\\,u}{(2h)(h)}`}</MB>
      <p>ลดรูป:</p>
      <MB>{`P(u) = \\frac{f_0\\,(u^2 - hu)}{2h^2} + \\frac{f_1\\,(h^2 - u^2)}{h^2} + \\frac{f_2\\,(u^2 + hu)}{2h^2}`}</MB>
      <p><b>ขั้นที่ 3</b> · integrate จาก <M>{`u = -h`}</M> ถึง <M>{`u = h`}</M>:</p>
      <p>ใช้: <M>{`\\int_{-h}^{h} u^2\\,du = \\tfrac{2h^3}{3}`}</M>, <M>{`\\int_{-h}^{h} hu\\,du = 0`}</M> (odd), <M>{`\\int_{-h}^{h} 1\\,du = 2h`}</M></p>
      <MB>{`\\int_{-h}^{h} P(u)\\,du = \\frac{f_0}{2h^2}(\\tfrac{2h^3}{3}) + \\frac{f_1}{h^2}(2h^3 - \\tfrac{2h^3}{3}) + \\frac{f_2}{2h^2}(\\tfrac{2h^3}{3})`}</MB>
      <MB>{`= \\frac{h f_0}{3} + \\frac{4 h f_1}{3} + \\frac{h f_2}{3} = \\frac{h}{3}(f_0 + 4 f_1 + f_2) \\quad \\blacksquare`}</MB>
    </div>
  },

  { id: "P06", topic: "proof", diff: "hard", title: "พิสูจน์ A สมมาตร PD → มี Cholesky L (lower triangular)",
    q: <div>
      <p>กำหนด <M>{`A \\in \\mathbb{R}^{n \\times n}`}</M> สมมาตรและ positive-definite (SPD)</p>
      <p>จงพิสูจน์ว่ามี matrix lower-triangular <M>L</M> ที่มี diagonal <em>เป็นบวก</em> และ <M>{`A = L L^T`}</M></p>
      <p>(แนะนำ: ใช้การ induction บนขนาด n)</p>
    </div>,
    a: <div>
      <p><b>Base case (n = 1):</b> <M>{`A = [a]`}</M> กับ <M>{`a > 0`}</M> (PD) → ตั้ง <M>{`L = [\\sqrt{a}]`}</M>, ได้ <M>{`L L^T = a = A`}</M> ✓</p>

      <p><b>Inductive step:</b> สมมติทุก SPD ขนาด <M>{`(n-1)\\times(n-1)`}</M> มี Cholesky</p>
      <p>แตก A ของขนาด n×n เป็น block:</p>
      <MB>{`A = \\begin{pmatrix} a_{11} & v^T \\\\ v & A' \\end{pmatrix}, \\quad v \\in \\mathbb{R}^{n-1}, \\;\\; A' \\in \\mathbb{R}^{(n-1)\\times(n-1)}`}</MB>
      <p><b>ขั้นที่ 1</b> · ตั้ง <M>{`l_{11} = \\sqrt{a_{11}}`}</M> (ทำได้เพราะ <M>{`a_{11} > 0`}</M> จาก leading-minor PD)</p>
      <p><b>ขั้นที่ 2</b> · ตั้ง <M>{`l_{21} = v / l_{11}`}</M> ∈ <M>{`\\mathbb{R}^{n-1}`}</M></p>
      <p><b>ขั้นที่ 3</b> · กำหนด <M>{`A'' = A' - l_{21} l_{21}^T`}</M> (Schur complement)</p>
      <p>ต้องพิสูจน์ว่า A'' เป็น SPD ขนาด (n-1)×(n-1) → ใช้ inductive hypothesis ได้</p>
      <ul style={{margin:0, paddingLeft:18}}>
        <li><b>สมมาตร:</b> <M>{`A''^T = (A')^T - (l_{21} l_{21}^T)^T = A' - l_{21} l_{21}^T = A''`}</M> ✓</li>
        <li><b>Positive definite:</b> ทุก <M>{`y \\in \\mathbb{R}^{n-1}, y \\neq 0`}</M> ใช้ <M>{`x = (- v^T y / a_{11}, y^T)^T`}</M> ทดสอบ <M>{`x^T A x > 0`}</M> → ลดรูปได้ <M>{`y^T A'' y > 0`}</M></li>
      </ul>
      <p><b>ขั้นที่ 4</b> · A'' มี Cholesky <M>{`L'(L')^T = A''`}</M> โดย induction</p>
      <p><b>ขั้นที่ 5</b> · ประกอบ L ของ A:</p>
      <MB>{`L = \\begin{pmatrix} l_{11} & 0 \\\\ l_{21} & L' \\end{pmatrix}`}</MB>
      <p>ตรวจ <M>{`L L^T = A`}</M> โดยการคูณ block — ตรงทุก block ✓ <M>{`\\blacksquare`}</M></p>
      <p style={{fontSize:'0.778rem', color:"var(--text-faint)", margin:"6px 0 0"}}>ข้อสังเกต: diagonal ของ L (คือ <M>{`l_{11}, l_{22}, \\ldots`}</M>) เป็นบวกทุกตัว เพราะแต่ละตัวเท่ากับ √(positive number)</p>
    </div>
  },
];

const TOPICS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "root", label: "Root Finding" },
  { id: "linear", label: "Linear Systems" },
  { id: "conjugate", label: "Conjugate Gradient" },
  { id: "interp", label: "Interpolation" },
  { id: "spline", label: "Spline" },
  { id: "regression", label: "Regression" },
  { id: "integ", label: "Integration" },
  { id: "diff", label: "Differentiation" },
  { id: "mixed", label: "ผสม / Project" },
  { id: "proof", label: "พิสูจน์สูตร" },
];
const DIFFS = [
  { id: "all", label: "ทุกระดับ", color: "#9aa4b2" },
  { id: "easy", label: "ง่าย", color: "#83c167" },
  { id: "medium", label: "ปานกลาง", color: "#ffd66b" },
  { id: "hard", label: "ยาก", color: "#f47274" },
];

function ProblemsLesson() {
  const [topic, setTopic] = React.useState("all");
  const [diff, setDiff] = React.useState("all");
  const filtered = PROBLEMS.filter(p =>
    (topic === "all" || p.topic === topic) &&
    (diff === "all" || p.diff === diff)
  );

  return (
    <div>
      <Hero
        kicker="★ · Problem Bank"
        title={`โจทย์ฝึก ${PROBLEMS.length}+ ข้อ`}
        lead="โจทย์เรียงจากง่ายไปยาก พร้อมเฉลย step-by-step ฝึกให้คล่องก่อนลงสนามจริง"
        meta={[`${PROBLEMS.length} ข้อ`, "8 หัวข้อ", "3 ระดับความยาก", "เฉลยทุกข้อ"]}
      />

      <Sect tag="🎯" title="กรองโจทย์">
        <div className="card">
          <div style={{display:"flex", flexDirection:"column", gap:12}}>
            <div>
              <div className="eyebrow" style={{marginBottom:6}}>หัวข้อ</div>
              <div className="chip-row">
                {TOPICS.map(t => (
                  <button key={t.id} className={"btn small " + (topic === t.id ? "primary" : "")} onClick={() => setTopic(t.id)}>
                    {t.label} <span className="muted">({t.id === "all" ? PROBLEMS.length : PROBLEMS.filter(p => p.topic === t.id).length})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="eyebrow" style={{marginBottom:6}}>ความยาก</div>
              <div className="chip-row">
                {DIFFS.map(d => (
                  <button key={d.id} className={"btn small " + (diff === d.id ? "primary" : "")} onClick={() => setDiff(d.id)} style={diff === d.id ? null : {color: d.color}}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="muted" style={{fontSize:'0.778rem', margin:"10px 0 0"}}>แสดง <b style={{color:"var(--blue)"}}>{filtered.length}</b> จาก {PROBLEMS.length} ข้อ</p>
        </div>
      </Sect>

      <Sect tag="📚" title={`โจทย์ (${filtered.length} ข้อ)`}>
        {filtered.length === 0 && <Callout>ไม่พบโจทย์ตามเงื่อนไข ลองเปลี่ยน filter</Callout>}
        {filtered.map(p => {
          const dInfo = DIFFS.find(d => d.id === p.diff);
          const tInfo = TOPICS.find(t => t.id === p.topic);
          return (
            <Problem key={p.id} label={
              <span>
                <span className="mono">{p.id}</span> · {p.title}
                <span className="tag" style={{marginLeft:8, color: dInfo.color, borderColor: dInfo.color}}>{dInfo.label}</span>
                <span className="tag" style={{marginLeft:4}}>{tInfo.label}</span>
              </span>
            } solution={p.a}>
              {p.q}
            </Problem>
          );
        })}
      </Sect>

      <Sect tag="💡" title="วิธีฝึกให้เซียน">
        <Callout kind="tip" title="เทคนิคทำโจทย์เร็ว">
          <ol>
            <li><b>วันที่ 1-3:</b> ทำโจทย์ง่ายทุกหัวข้อ (≈30 ข้อ) — เน้นจำสูตร</li>
            <li><b>วันที่ 4-7:</b> โจทย์ปานกลาง (≈30 ข้อ) — เน้นเข้าใจที่มา</li>
            <li><b>วันที่ 8-10:</b> โจทย์ยาก + โจทย์ผสม (≈20 ข้อ) — จำลองข้อสอบ</li>
            <li><b>วันก่อนสอบ:</b> ทำ Mock Final แบบจับเวลา → review ข้อผิด</li>
          </ol>
        </Callout>

        <Callout kind="warn" title="ห้ามพลาด — ทักษะที่ต้องมี">
          <ul>
            <li>ทำมือ Bisection / Newton / Secant ได้ใน 3 นาที (4 iter)</li>
            <li>ทำ Gauss Elim 3×3 ในใจ + เครื่องคิดเลข ใน 5 นาที</li>
            <li>คำนวณ Lagrange Lᵢ ทันที (ไม่ใช้เครื่อง)</li>
            <li>จำ pattern Simpson "1, 4, 2, 4, ..., 4, 1" + เลือก method ใน 10 วินาที</li>
            <li>เขียน code Python ของ Bisection ในกระดาษได้ (10 บรรทัด)</li>
          </ul>
        </Callout>
      </Sect>
    </div>
  );
}

window.ProblemsLesson = ProblemsLesson;
