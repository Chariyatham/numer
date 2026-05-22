// Pure-JS solvers for all methods. Used by interactive solvers and animations.
// All return iteration tables: arrays of { iter, xl, xr, xm, fl, fr, fm, err } etc.

// Parse a math expression into a function. Uses Function constructor + Math.
function parseExpr(expr) {
  // Allow ^ as power
  const e = expr.replace(/\^/g, "**");
  return new Function("x", `with(Math){ return (${e}); }`);
}

// ===== Bisection =====
function bisection(f, a, b, maxIter = 50, tol = 1e-6) {
  const rows = [];
  let xl = a, xr = b;
  let fl = f(xl), fr = f(xr);
  if (fl * fr > 0) return { rows, error: "f(a)·f(b) > 0 — ไม่มีรากในช่วงนี้" };
  let prev = null;
  for (let i = 0; i < maxIter; i++) {
    const xm = (xl + xr) / 2;
    const fm = f(xm);
    const err = prev === null ? null : Math.abs((xm - prev) / xm);
    rows.push({ iter: i+1, xl, xr, xm, fl, fr, fm, err });
    if (prev !== null && err < tol) break;
    if (fl * fm < 0) { xr = xm; fr = fm; } else { xl = xm; fl = fm; }
    prev = xm;
  }
  return { rows };
}

// ===== False Position =====
function falsePosition(f, a, b, maxIter = 50, tol = 1e-6) {
  const rows = [];
  let xl = a, xr = b;
  let fl = f(xl), fr = f(xr);
  if (fl * fr > 0) return { rows, error: "f(a)·f(b) > 0 — ไม่มีรากในช่วงนี้" };
  let prev = null;
  for (let i = 0; i < maxIter; i++) {
    const xm = xr - fr*(xl - xr)/(fl - fr);
    const fm = f(xm);
    const err = prev === null ? null : Math.abs((xm - prev) / xm);
    rows.push({ iter: i+1, xl, xr, xm, fl, fr, fm, err });
    if (prev !== null && err < tol) break;
    if (fl * fm < 0) { xr = xm; fr = fm; } else { xl = xm; fl = fm; }
    prev = xm;
  }
  return { rows };
}

// ===== One-point Iteration =====
// f rearranged as x = g(x); user gives g
function onePoint(g, x0, maxIter = 50, tol = 1e-6) {
  const rows = [];
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const xnew = g(x);
    const err = x === 0 ? Math.abs(xnew - x) : Math.abs((xnew - x) / xnew);
    rows.push({ iter: i+1, x, xnew, err });
    if (err < tol) break;
    x = xnew;
  }
  return { rows };
}

// ===== Newton-Raphson =====
// Auto numeric derivative
function deriv(f, x, h = 1e-6) { return (f(x+h) - f(x-h)) / (2*h); }
function newtonRaphson(f, x0, maxIter = 50, tol = 1e-6, fp = null) {
  const rows = [];
  let x = x0;
  for (let i = 0; i < maxIter; i++) {
    const fx = f(x);
    const fpx = fp ? fp(x) : deriv(f, x);
    const xnew = x - fx/fpx;
    const err = Math.abs((xnew - x) / xnew);
    rows.push({ iter: i+1, x, fx, fpx, xnew, err });
    if (err < tol) break;
    x = xnew;
  }
  return { rows };
}

// ===== Secant =====
function secant(f, x0, x1, maxIter = 50, tol = 1e-6) {
  const rows = [];
  let xa = x0, xb = x1;
  for (let i = 0; i < maxIter; i++) {
    const fa = f(xa), fb = f(xb);
    const xnew = xb - fb*(xa - xb)/(fa - fb);
    const err = Math.abs((xnew - xb) / xnew);
    rows.push({ iter: i+1, xa, xb, fa, fb, xnew, err });
    if (err < tol) break;
    xa = xb; xb = xnew;
  }
  return { rows };
}

// ===== Gauss Elimination =====
function gaussElim(A, b) {
  const n = A.length;
  // augmented copy
  const M = A.map((row, i) => [...row, b[i]]);
  const steps = [{ M: clone(M), msg: "เริ่ม" }];
  for (let k = 0; k < n; k++) {
    // pivot if needed
    if (M[k][k] === 0) {
      for (let i = k+1; i < n; i++) {
        if (M[i][k] !== 0) {
          [M[k], M[i]] = [M[i], M[k]];
          steps.push({ M: clone(M), msg: `สลับแถว R${k+1} ↔ R${i+1}` });
          break;
        }
      }
    }
    for (let i = k+1; i < n; i++) {
      const factor = M[i][k] / M[k][k];
      for (let j = k; j <= n; j++) M[i][j] -= factor * M[k][j];
      steps.push({ M: clone(M), msg: `R${i+1} ← R${i+1} − (${factor.toFixed(4)})·R${k+1}` });
    }
  }
  // back substitution
  const x = new Array(n).fill(0);
  for (let i = n-1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i+1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return { x, steps, M };
}

function clone(M) { return M.map(r => r.slice()); }

// ===== Jacobi / Gauss-Seidel =====
function jacobi(A, b, x0, maxIter = 30, tol = 1e-6) {
  const n = A.length;
  let x = x0.slice();
  const rows = [{ iter: 0, x: x.slice(), err: null }];
  for (let k = 0; k < maxIter; k++) {
    const xnew = new Array(n);
    for (let i = 0; i < n; i++) {
      let s = b[i];
      for (let j = 0; j < n; j++) if (j !== i) s -= A[i][j] * x[j];
      xnew[i] = s / A[i][i];
    }
    const err = norm(sub(xnew, x)) / (norm(xnew) + 1e-15);
    rows.push({ iter: k+1, x: xnew.slice(), err });
    x = xnew;
    if (err < tol) break;
  }
  return { rows, x };
}

function gaussSeidel(A, b, x0, maxIter = 30, tol = 1e-6) {
  const n = A.length;
  let x = x0.slice();
  const rows = [{ iter: 0, x: x.slice(), err: null }];
  for (let k = 0; k < maxIter; k++) {
    const prev = x.slice();
    for (let i = 0; i < n; i++) {
      let s = b[i];
      for (let j = 0; j < n; j++) if (j !== i) s -= A[i][j] * x[j];
      x[i] = s / A[i][i];
    }
    const err = norm(sub(x, prev)) / (norm(x) + 1e-15);
    rows.push({ iter: k+1, x: x.slice(), err });
    if (err < tol) break;
  }
  return { rows, x };
}

// ===== Gauss-Jordan (full reduction to identity) =====
function gaussJordan(A, b) {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);
  const steps = [{ M: clone(M), msg: "เริ่ม" }];
  for (let k = 0; k < n; k++) {
    // partial pivot
    let piv = k;
    for (let i = k+1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[piv][k])) piv = i;
    if (piv !== k) {
      [M[k], M[piv]] = [M[piv], M[k]];
      steps.push({ M: clone(M), msg: `สลับแถว R${k+1} ↔ R${piv+1} (pivot)` });
    }
    const d = M[k][k];
    if (Math.abs(d) < 1e-14) return { x: null, steps, error: "matrix singular" };
    for (let j = 0; j <= n; j++) M[k][j] /= d;
    steps.push({ M: clone(M), msg: `R${k+1} ÷ ${d.toFixed(4)} → pivot = 1` });
    for (let i = 0; i < n; i++) if (i !== k && M[i][k] !== 0) {
      const f = M[i][k];
      for (let j = 0; j <= n; j++) M[i][j] -= f * M[k][j];
      steps.push({ M: clone(M), msg: `R${i+1} ← R${i+1} − (${f.toFixed(4)})·R${k+1}` });
    }
  }
  const x = M.map(r => r[n]);
  return { x, steps, M };
}

// ===== Cramer's Rule =====
function det(A) {
  const n = A.length;
  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0]*A[1][1] - A[0][1]*A[1][0];
  // LU-based determinant for n ≥ 3
  const M = clone(A);
  let sign = 1;
  for (let k = 0; k < n; k++) {
    let piv = k;
    for (let i = k+1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[piv][k])) piv = i;
    if (piv !== k) { [M[k], M[piv]] = [M[piv], M[k]]; sign = -sign; }
    if (Math.abs(M[k][k]) < 1e-14) return 0;
    for (let i = k+1; i < n; i++) {
      const f = M[i][k] / M[k][k];
      for (let j = k; j < n; j++) M[i][j] -= f * M[k][j];
    }
  }
  let d = sign;
  for (let i = 0; i < n; i++) d *= M[i][i];
  return d;
}

function cramer(A, b) {
  const n = A.length;
  const D = det(A);
  const steps = [{ label: "det(A)", value: D, matrix: clone(A) }];
  if (Math.abs(D) < 1e-14) return { x: null, steps, error: "det(A) = 0 — ไม่มีคำตอบเดียว" };
  const x = new Array(n);
  for (let i = 0; i < n; i++) {
    const Ai = clone(A);
    for (let r = 0; r < n; r++) Ai[r][i] = b[r];
    const Di = det(Ai);
    x[i] = Di / D;
    steps.push({ label: `det(A_${i+1})`, value: Di, matrix: Ai, x: x[i] });
  }
  return { x, steps, D };
}

// ===== Matrix Inverse via Gauss-Jordan on [A | I] =====
function matrixInverse(A) {
  const n = A.length;
  // Build augmented [A | I]
  const M = A.map((row, i) => [...row, ...Array.from({length: n}, (_, j) => i === j ? 1 : 0)]);
  const steps = [{ M: clone(M), msg: "เริ่ม [A | I]" }];
  for (let k = 0; k < n; k++) {
    let piv = k;
    for (let i = k+1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[piv][k])) piv = i;
    if (piv !== k) {
      [M[k], M[piv]] = [M[piv], M[k]];
      steps.push({ M: clone(M), msg: `สลับแถว R${k+1} ↔ R${piv+1}` });
    }
    const d = M[k][k];
    if (Math.abs(d) < 1e-14) return { inv: null, steps, error: "matrix singular" };
    for (let j = 0; j < 2*n; j++) M[k][j] /= d;
    steps.push({ M: clone(M), msg: `R${k+1} ÷ ${d.toFixed(4)}` });
    for (let i = 0; i < n; i++) if (i !== k && Math.abs(M[i][k]) > 1e-14) {
      const f = M[i][k];
      for (let j = 0; j < 2*n; j++) M[i][j] -= f * M[k][j];
      steps.push({ M: clone(M), msg: `R${i+1} ← R${i+1} − (${f.toFixed(4)})·R${k+1}` });
    }
  }
  const inv = M.map(r => r.slice(n));
  return { inv, steps };
}

function solveByInverse(A, b) {
  const { inv, steps, error } = matrixInverse(A);
  if (error) return { x: null, steps, error };
  const x = inv.map(row => row.reduce((s, v, i) => s + v*b[i], 0));
  return { x, steps, inv };
}

// ===== LU Decomposition (Doolittle: L has 1s on diagonal) =====
function luDecomp(A) {
  const n = A.length;
  const L = Array.from({length:n}, () => new Array(n).fill(0));
  const U = Array.from({length:n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) L[i][i] = 1;
  const steps = [];
  for (let k = 0; k < n; k++) {
    // U row k
    for (let j = k; j < n; j++) {
      let s = A[k][j];
      for (let p = 0; p < k; p++) s -= L[k][p] * U[p][j];
      U[k][j] = s;
    }
    // L column k
    for (let i = k+1; i < n; i++) {
      let s = A[i][k];
      for (let p = 0; p < k; p++) s -= L[i][p] * U[p][k];
      if (Math.abs(U[k][k]) < 1e-14) return { L: null, U: null, steps, error: "U pivot zero" };
      L[i][k] = s / U[k][k];
    }
    steps.push({ L: clone(L), U: clone(U), msg: `จบรอบ k=${k+1}: คำนวณ U[${k+1}][·] และ L[·][${k+1}] เสร็จ` });
  }
  return { L, U, steps };
}

function solveLU(A, b) {
  const { L, U, steps: decompSteps, error } = luDecomp(A);
  if (error) return { x: null, error, steps: decompSteps };
  const n = A.length;
  // Ly = b (forward)
  const y = new Array(n).fill(0);
  const forward = [];
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let j = 0; j < i; j++) s -= L[i][j] * y[j];
    y[i] = s / L[i][i];
    forward.push({ i, val: y[i], expr: `y${i+1} = (${b[i]} − Σ L·y) / L[${i+1}][${i+1}]` });
  }
  // Ux = y (backward)
  const x = new Array(n).fill(0);
  const backward = [];
  for (let i = n-1; i >= 0; i--) {
    let s = y[i];
    for (let j = i+1; j < n; j++) s -= U[i][j] * x[j];
    x[i] = s / U[i][i];
    backward.push({ i, val: x[i], expr: `x${i+1} = (y${i+1} − Σ U·x) / U[${i+1}][${i+1}]` });
  }
  return { x, y, L, U, steps: { decompose: decompSteps, forward, backward } };
}

// ===== Cholesky (A = L Lᵀ, symmetric positive definite) =====
function cholesky(A) {
  const n = A.length;
  const L = Array.from({length:n}, () => new Array(n).fill(0));
  const steps = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) return { L: null, steps, error: "ไม่ใช่ positive definite — Cholesky ใช้ไม่ได้" };
        L[i][j] = Math.sqrt(s);
      } else {
        L[i][j] = s / L[j][j];
      }
      steps.push({ L: clone(L), i, j, expr: i === j
        ? `L[${i+1}][${j+1}] = √(A[${i+1}][${j+1}] − Σ L²) = ${L[i][j].toFixed(4)}`
        : `L[${i+1}][${j+1}] = (A[${i+1}][${j+1}] − Σ L·L) / L[${j+1}][${j+1}] = ${L[i][j].toFixed(4)}`
      });
    }
  }
  return { L, steps };
}

function solveCholesky(A, b) {
  const { L, steps, error } = cholesky(A);
  if (error) return { x: null, error, steps };
  const n = A.length;
  // Ly = b
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let j = 0; j < i; j++) s -= L[i][j] * y[j];
    y[i] = s / L[i][i];
  }
  // Lᵀx = y
  const x = new Array(n).fill(0);
  for (let i = n-1; i >= 0; i--) {
    let s = y[i];
    for (let j = i+1; j < n; j++) s -= L[j][i] * x[j];
    x[i] = s / L[i][i];
  }
  return { x, y, L, steps };
}

// ===== Taylor Series =====
// derivs = array of functions [f, f', f'', ...]  OR auto via numeric derivatives
function taylorSeries(derivs, x0, x, n) {
  const rows = [];
  let sum = 0;
  let fact = 1;
  let dx = 1;
  for (let k = 0; k <= n; k++) {
    if (k > 0) { fact *= k; dx *= (x - x0); }
    const term = derivs[k](x0) * dx / fact;
    sum += term;
    rows.push({ n: k, term, sum, derivAt: derivs[k](x0) });
  }
  return { rows, value: sum };
}

// Auto higher derivatives via repeated central differences (good to ~4th order)
function autoDerivs(f, n, h = 1e-3) {
  const out = [f];
  for (let k = 1; k <= n; k++) {
    const prev = out[k-1];
    out.push((x) => (prev(x+h) - prev(x-h)) / (2*h));
  }
  return out;
}

// ===== Newton's Forward / Backward Differences (equally-spaced) =====
function forwardDiffTable(ys) {
  const n = ys.length;
  const T = ys.map(v => [v]);
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      T[i][j] = T[i+1][j-1] - T[i][j-1];
    }
  }
  return T;
}
function backwardDiffTable(ys) {
  const n = ys.length;
  const T = ys.map(v => [v]);
  for (let j = 1; j < n; j++) {
    for (let i = n-1; i >= j; i--) {
      T[i][j] = T[i][j-1] - T[i-1][j-1];
    }
  }
  return T;
}
function newtonForwardEval(xs, ys, x) {
  const n = xs.length;
  const h = xs[1] - xs[0];
  const s = (x - xs[0]) / h;
  const T = forwardDiffTable(ys);
  let sum = T[0][0];
  let prod = 1;
  let fact = 1;
  for (let k = 1; k < n; k++) {
    prod *= (s - (k-1));
    fact *= k;
    sum += prod / fact * T[0][k];
  }
  return { value: sum, table: T, s };
}
function newtonBackwardEval(xs, ys, x) {
  const n = xs.length;
  const h = xs[1] - xs[0];
  const s = (x - xs[n-1]) / h;
  const T = backwardDiffTable(ys);
  let sum = T[n-1][0];
  let prod = 1;
  let fact = 1;
  for (let k = 1; k < n; k++) {
    prod *= (s + (k-1));
    fact *= k;
    sum += prod / fact * T[n-1][k];
  }
  return { value: sum, table: T, s };
}

// ===== Cubic Spline (natural) =====
function cubicSpline(xs, ys) {
  const n = xs.length - 1;        // n segments
  const h = new Array(n);
  for (let i = 0; i < n; i++) h[i] = xs[i+1] - xs[i];
  // Build tridiagonal system for c[0..n] with natural BC: c[0]=c[n]=0
  const A = Array.from({length: n+1}, () => new Array(n+1).fill(0));
  const rhs = new Array(n+1).fill(0);
  A[0][0] = 1;
  A[n][n] = 1;
  for (let i = 1; i < n; i++) {
    A[i][i-1] = h[i-1];
    A[i][i]   = 2*(h[i-1] + h[i]);
    A[i][i+1] = h[i];
    rhs[i] = 3 * ((ys[i+1] - ys[i])/h[i] - (ys[i] - ys[i-1])/h[i-1]);
  }
  const { x: c } = gaussElim(A, rhs);
  const a = ys.slice(0, n);
  const b = new Array(n), d = new Array(n);
  for (let i = 0; i < n; i++) {
    b[i] = (ys[i+1] - ys[i])/h[i] - h[i]*(2*c[i] + c[i+1])/3;
    d[i] = (c[i+1] - c[i]) / (3*h[i]);
  }
  // Evaluator: S_i(x) = a[i] + b[i](x-xs[i]) + c[i](x-xs[i])² + d[i](x-xs[i])³
  function eval_(x) {
    let i = 0;
    for (i = 0; i < n-1; i++) if (x < xs[i+1]) break;
    const dx = x - xs[i];
    return a[i] + b[i]*dx + c[i]*dx*dx + d[i]*dx*dx*dx;
  }
  function deriv1(x) {
    let i = 0;
    for (i = 0; i < n-1; i++) if (x < xs[i+1]) break;
    const dx = x - xs[i];
    return b[i] + 2*c[i]*dx + 3*d[i]*dx*dx;
  }
  function deriv2(x) {
    let i = 0;
    for (i = 0; i < n-1; i++) if (x < xs[i+1]) break;
    const dx = x - xs[i];
    return 2*c[i] + 6*d[i]*dx;
  }
  return { a, b, c: c.slice(0, n), d, eval: eval_, deriv1, deriv2 };
}

// ===== Romberg Integration =====
function romberg(f, a, b, levels = 5) {
  const R = Array.from({length: levels}, () => new Array(levels).fill(0));
  for (let k = 0; k < levels; k++) {
    const n = Math.pow(2, k);
    R[k][0] = compositeTrap(f, a, b, n);
  }
  for (let j = 1; j < levels; j++) {
    for (let k = j; k < levels; k++) {
      const p = Math.pow(4, j);
      R[k][j] = (p * R[k][j-1] - R[k-1][j-1]) / (p - 1);
    }
  }
  return { table: R, value: R[levels-1][levels-1] };
}

// ===== Gauss-Legendre (2-point and 3-point on [a,b]) =====
const GL_NODES = {
  2: { xs: [-1/Math.sqrt(3), 1/Math.sqrt(3)], ws: [1, 1] },
  3: { xs: [-Math.sqrt(3/5), 0, Math.sqrt(3/5)], ws: [5/9, 8/9, 5/9] },
  4: { xs: [-0.861136, -0.339981, 0.339981, 0.861136], ws: [0.347855, 0.652145, 0.652145, 0.347855] },
};
function gaussLegendre(f, a, b, n = 2) {
  const { xs, ws } = GL_NODES[n] || GL_NODES[2];
  const mid = (a + b) / 2;
  const half = (b - a) / 2;
  let s = 0;
  const rows = [];
  for (let i = 0; i < xs.length; i++) {
    const x = mid + half * xs[i];
    const term = ws[i] * f(x);
    s += term;
    rows.push({ i: i+1, t: xs[i], w: ws[i], x, fx: f(x), term: half*term });
  }
  return { value: half * s, rows };
}

// ===== Richardson Extrapolation for f'(x) =====
// D(h) = central diff; D(h/2) = central diff at h/2; refined = (4 D(h/2) - D(h)) / 3
function richardsonDeriv(f, x, h) {
  const D1 = diffCentral(f, x, h);
  const D2 = diffCentral(f, x, h/2);
  const D = (4*D2 - D1) / 3;
  return { D1, D2, D, expr: "(4·D(h/2) − D(h)) / 3" };
}

// ===== Vector helpers =====
function dot(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
function matvec(A, x) {
  return A.map(row => dot(row, x));
}
function sub(a, b) { return a.map((v, i) => v - b[i]); }
function add(a, b) { return a.map((v, i) => v + b[i]); }
function scal(a, k) { return a.map(v => v * k); }
function norm(a) { return Math.sqrt(dot(a, a)); }

// ===== Conjugate Gradient =====
function conjugateGradient(A, b, x0, maxIter = 50, tol = 1e-6) {
  let x = x0.slice();
  let r = sub(matvec(A, x), b);       // r = Ax - b
  let d = scal(r, -1);
  const rows = [{ iter: 0, x: x.slice(), r: r.slice(), d: d.slice(), alpha: null, beta: null, err: norm(r) }];
  for (let k = 0; k < maxIter; k++) {
    const Ad = matvec(A, d);
    const alpha = -dot(r, d) / dot(d, Ad);
    x = add(x, scal(d, alpha));
    const rNew = add(matvec(A, x), scal(b, -1));
    const err = norm(rNew);
    const beta = dot(rNew, Ad) / dot(d, Ad);
    const dNew = add(scal(rNew, -1), scal(d, beta));
    rows.push({ iter: k+1, x: x.slice(), r: rNew.slice(), d: dNew.slice(), alpha, beta, err });
    if (err < tol) break;
    r = rNew; d = dNew;
  }
  return { rows, x };
}

// ===== Newton's Divided Differences =====
function dividedDifferences(xs, ys) {
  const n = xs.length;
  const dd = ys.map(y => [y]);
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      dd[i][j] = (dd[i+1][j-1] - dd[i][j-1]) / (xs[i+j] - xs[i]);
    }
  }
  // coefficients c0 = dd[0][0], c1 = dd[0][1], ...
  const coeffs = dd[0].slice();
  // evaluator
  function eval_(x) {
    let result = coeffs[0];
    let term = 1;
    for (let k = 1; k < n; k++) {
      term *= (x - xs[k-1]);
      result += coeffs[k] * term;
    }
    return result;
  }
  return { coeffs, eval: eval_, dd };
}

// ===== Lagrange =====
function lagrange(xs, ys) {
  const n = xs.length;
  function eval_(x) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      let L = 1;
      for (let j = 0; j < n; j++) if (j !== i) L *= (x - xs[j]) / (xs[i] - xs[j]);
      s += ys[i] * L;
    }
    return s;
  }
  return { eval: eval_ };
}

// ===== Linear regression =====
function linearRegression(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a,b) => a+b, 0);
  const sy = ys.reduce((a,b) => a+b, 0);
  const sxx = xs.reduce((a,b) => a+b*b, 0);
  const sxy = xs.reduce((a,b,i) => a + b*ys[i], 0);
  const a1 = (n*sxy - sx*sy) / (n*sxx - sx*sx);
  const a0 = (sy - a1*sx) / n;
  return { a0, a1, eval: x => a0 + a1*x };
}

// ===== Polynomial regression (degree m) using normal equations =====
function polyRegression(xs, ys, m) {
  // Build (m+1)x(m+1) normal equation matrix
  const n = xs.length;
  const sX = new Array(2*m + 1).fill(0);
  for (let k = 0; k <= 2*m; k++) sX[k] = xs.reduce((a,b) => a + Math.pow(b, k), 0);
  const sY = new Array(m + 1).fill(0);
  for (let k = 0; k <= m; k++) sY[k] = xs.reduce((a,b,i) => a + Math.pow(b, k) * ys[i], 0);
  const A = [];
  for (let i = 0; i <= m; i++) {
    const row = [];
    for (let j = 0; j <= m; j++) row.push(sX[i+j]);
    A.push(row);
  }
  const { x: coeffs } = gaussElim(A, sY);
  return { coeffs, eval: (x) => coeffs.reduce((a, c, k) => a + c*Math.pow(x, k), 0) };
}

// ===== Trapezoidal & Composite =====
function trapezoid(f, a, b) {
  return (b - a) / 2 * (f(a) + f(b));
}
function compositeTrap(f, a, b, n) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += 2 * f(a + i*h);
  return h / 2 * s;
}

// ===== Simpson 1/3 =====
function simpson(f, a, b) {
  const m = (a + b) / 2;
  return (b - a) / 6 * (f(a) + 4*f(m) + f(b));
}
function compositeSimpson(f, a, b, n) {
  if (n % 2 !== 0) n += 1; // must be even
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 === 0 ? 2 : 4) * f(a + i*h);
  return h / 3 * s;
}

// ===== Numerical Differentiation =====
function diffForward(f, x, h)  { return (f(x+h) - f(x)) / h; }
function diffBackward(f, x, h) { return (f(x) - f(x-h)) / h; }
function diffCentral(f, x, h)  { return (f(x+h) - f(x-h)) / (2*h); }

Object.assign(window, {
  parseExpr,
  bisection, falsePosition, onePoint, newtonRaphson, secant,
  gaussElim, gaussJordan, jacobi, gaussSeidel, conjugateGradient,
  det, cramer, matrixInverse, solveByInverse,
  luDecomp, solveLU, cholesky, solveCholesky,
  taylorSeries, autoDerivs,
  forwardDiffTable, backwardDiffTable, newtonForwardEval, newtonBackwardEval,
  dividedDifferences, lagrange,
  cubicSpline,
  linearRegression, polyRegression,
  trapezoid, compositeTrap, simpson, compositeSimpson,
  romberg, gaussLegendre,
  diffForward, diffBackward, diffCentral, deriv, richardsonDeriv,
  dot, matvec, sub, add, scal, norm, clone
});
