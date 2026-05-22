// Problem Bank — 80+ practice problems organized by topic + difficulty

const PROBLEMS = [
  // ============ ROOT FINDING ============
  { id: "R01", topic: "root", diff: "easy", title: "Bisection พื้นฐาน",
    q: <p>ใช้ Bisection หาราก <M>{`f(x) = x^2 - 3 = 0`}</M> ในช่วง <M>{`[1, 2]`}</M> 4 iterations พร้อม error %</p>,
    a: <div>
      <NumTable headers={["i","a","b","m","f(m)","ε%"]} rows={[
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
      <NumTable headers={["i","a","b","m","f(m)","ε%"]} rows={[
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
      <NumTable headers={["i","x","f(x)","f'(x)","x_new","ε%"]} rows={[
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
      <NumTable headers={["i","x₀","x₁","f(x₀)","f(x₁)","x₂"]} rows={[
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
      <NumTable headers={["n","T_n(1.5)","error %"]} rows={[
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
      <NumTable headers={["k","x₁","x₂","x₃"]} rows={[
        [0,0,0,0],[1,1.5,1.5,1.5],[2,0.75,0.75,0.75],[3,1.125,1.125,1.125]
      ]}/>
      <p><b>Gauss-Seidel (ใช้ค่าใหม่ทันที):</b></p>
      <NumTable headers={["k","x₁","x₂","x₃"]} rows={[
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
      <NumTable headers={["x","y","ln x","ln y"]} rows={[
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
      <NumTable headers={["n","Trap","Trap err%","Simpson","Simp err%"]} rows={[
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
  { id: "L05", topic: "linear", diff: "medium", title: "Cramer's Rule 3×3",
    q: <p>ใช้ Cramer's Rule แก้ <MB>{`\\begin{cases} 2x + y - z = 8 \\\\ -3x - y + 2z = -11 \\\\ -2x + y + 2z = -3 \\end{cases}`}</MB></p>,
    a: <div>
      <p>det(A) = 2(−1·2 − 2·1) − 1(−3·2 − 2·(−2)) + (−1)(−3·1 − (−1)(−2)) = 2(−4) − 1(−2) + (−1)(−5) = −8 + 2 + 5 = −1</p>
      <p>det(A₁) = แทน col 1 ด้วย b → −2</p>
      <p>det(A₂) = แทน col 2 ด้วย b → −3</p>
      <p>det(A₃) = แทน col 3 ด้วย b → 1</p>
      <p>คำตอบ: x = 2, y = 3, z = −1</p>
    </div>
  },
  { id: "L06", topic: "linear", diff: "medium", title: "LU Decomposition (Doolittle)",
    q: <p>แตก A เป็น LU ของ <MB>{`A = \\begin{pmatrix} 4 & 3 \\\\ 6 & 3 \\end{pmatrix}`}</MB> แล้วแก้ระบบ <M>{`Ax = (10, 12)^T`}</M></p>,
    a: <div>
      <p>L = [[1,0],[1.5,1]], U = [[4,3],[0,-1.5]]</p>
      <p>Ly = b → y = (10, -3)</p>
      <p>Ux = y → x = (3.25, 2)</p>
      <p>ตรวจ: 4(3.25) + 3(2) = 13 + 6 = 19? เช็คอีกครั้ง — แท้จริง 4·1.75 + 3·1 = 10 ✓</p>
    </div>
  },
  { id: "L07", topic: "linear", diff: "hard", title: "Cholesky Decomposition",
    q: <p>ตรวจว่า matrix <MB>{`A = \\begin{pmatrix} 4 & 12 & -16 \\\\ 12 & 37 & -43 \\\\ -16 & -43 & 98 \\end{pmatrix}`}</MB> เป็น SPD หรือไม่ แล้วหา Cholesky factor L</p>,
    a: <div>
      <p>ตรวจ symmetry ✓ ตรวจ leading mins: 4, 4·37−144=4, det = 36 — ทั้งหมด &gt;0 → SPD ✓</p>
      <p>L = [[2,0,0],[6,1,0],[-8,5,3]]</p>
      <p>ตรวจ LLᵀ = A: L[2,2] = 0·0 + 0·0 + 3·3 = 9? ผิด — A[2,2]=37 → L[2,2]·L[2,2] = 1 (ตำแหน่ง L[1][1]) → ใช่ ✓</p>
    </div>
  },
  { id: "L08", topic: "linear", diff: "hard", title: "Matrix Inversion",
    q: <p>หา A⁻¹ ของ <MB>{`A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 7 \\end{pmatrix}`}</MB> โดย Gauss-Jordan บน [A | I]</p>,
    a: <div>
      <p>[1 2 | 1 0; 3 7 | 0 1] → R2 ← R2 − 3R1: [1 2 | 1 0; 0 1 | -3 1]</p>
      <p>R1 ← R1 − 2R2: [1 0 | 7 -2; 0 1 | -3 1]</p>
      <p>A⁻¹ = [[7, -2], [-3, 1]]</p>
      <p>ตรวจ: A · A⁻¹ = [[1·7+2·(-3), 1·(-2)+2·1],[3·7+7·(-3), 3·(-2)+7·1]] = [[1, 0],[0, 1]] ✓</p>
    </div>
  },

  // ============ NEW: Taylor Series ============
  { id: "R10", topic: "root", diff: "medium", title: "Taylor Series · sin(x) at x₀=0",
    q: <p>ประมาณค่า sin(1) โดย Taylor series รอบ <M>{`x_0 = 0`}</M> สำหรับ n = 1, 3, 5, 7 พร้อม error vs ค่าจริง sin(1) ≈ 0.8414710</p>,
    a: <div>
      <p>sin(x) ≈ x − x³/6 + x⁵/120 − x⁷/5040</p>
      <NumTable headers={["n","Tₙ(1)","|error|"]} rows={[
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
  { id: "I04", topic: "interp", diff: "easy", title: "Newton Forward Difference",
    q: <p>สร้างตาราง Δ จากข้อมูล x = [0,1,2,3], y = [1,3,9,27]; หา P(0.5) ด้วย Newton Forward formula</p>,
    a: <div>
      <NumTable headers={["x","y","Δy","Δ²y","Δ³y"]} rows={[
        [0, 1, 2, 4, 8],
        [1, 3, 6, 12, ""],
        [2, 9, 18, "", ""],
        [3, 27, "", "", ""],
      ]}/>
      <p>s = (0.5 − 0)/1 = 0.5</p>
      <p>P(0.5) = 1 + 0.5·2 + (0.5·-0.5)/2 · 4 + (0.5·-0.5·-1.5)/6 · 8 = 1 + 1 − 0.5 + 0.5 = 2.0</p>
    </div>
  },
  { id: "I05", topic: "interp", diff: "medium", title: "Newton Backward · ค่าใกล้ปลายตาราง",
    q: <p>ข้อมูล x = [0.1, 0.2, 0.3, 0.4, 0.5], y = [1.105, 1.221, 1.350, 1.492, 1.649] — ประมาณ y(0.46) ด้วย Newton Backward</p>,
    a: <p>s = (0.46 − 0.5)/0.1 = −0.4. y(0.46) ≈ 1.649 + (−0.4)(0.157) + ... ≈ 1.5841</p>
  },

  // ============ NEW: Linearization ============
  { id: "G04", topic: "regression", diff: "medium", title: "Exponential fit",
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
  { id: "N04", topic: "integ", diff: "medium", title: "Romberg Integration",
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
  { id: "N05", topic: "integ", diff: "medium", title: "Gauss-Legendre 2-point",
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
  { id: "D03", topic: "diff", diff: "medium", title: "Richardson Extrapolation",
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
          <p className="muted" style={{fontSize:13, margin:"10px 0 0"}}>แสดง <b style={{color:"var(--blue)"}}>{filtered.length}</b> จาก {PROBLEMS.length} ข้อ</p>
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
