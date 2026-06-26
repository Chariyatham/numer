# Graph Report - .  (2026-06-24)

## Corpus Check
- 51 files · ~64,338 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 323 nodes · 420 edges · 25 communities (22 shown, 3 thin omitted)
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 91 edges (avg confidence: 0.82)
- Token cost: 194,933 input · 34,397 output

## Community Hubs (Navigation)
- [[_COMMUNITY_IntegrationInterpCG Lesson UI|Integration/Interp/CG Lesson UI]]
- [[_COMMUNITY_JS Numerical Solvers Library|JS Numerical Solvers Library]]
- [[_COMMUNITY_Final Exam Review Concepts|Final Exam Review Concepts]]
- [[_COMMUNITY_RegressionSpline Lessons & Inputs|Regression/Spline Lessons & Inputs]]
- [[_COMMUNITY_Linear Systems & Root Concepts|Linear Systems & Root Concepts]]
- [[_COMMUNITY_App Architecture & Conventions|App Architecture & Conventions]]
- [[_COMMUNITY_Shared UI Components|Shared UI Components]]
- [[_COMMUNITY_Midterm Review Concepts|Midterm Review Concepts]]
- [[_COMMUNITY_Linear Systems Lesson UI|Linear Systems Lesson UI]]
- [[_COMMUNITY_Differentiation Lesson|Differentiation Lesson]]
- [[_COMMUNITY_Screenshot fx-991CW Keys & Bisection|Screenshot: fx-991CW Keys & Bisection]]
- [[_COMMUNITY_Progress Tracking (localStorage)|Progress Tracking (localStorage)]]
- [[_COMMUNITY_Screenshot Root Finding Lesson|Screenshot: Root Finding Lesson]]
- [[_COMMUNITY_Differentiation Concepts (diff1)|Differentiation Concepts (diff1)]]
- [[_COMMUNITY_Interpolation Concepts (Sheets)|Interpolation Concepts (Sheets)]]
- [[_COMMUNITY_Screenshot IntroLanding Screen|Screenshot: Intro/Landing Screen]]
- [[_COMMUNITY_App Router & Sidebar|App Router & Sidebar]]
- [[_COMMUNITY_Problems Bank Lesson|Problems Bank Lesson]]
- [[_COMMUNITY_ExamQuiz Lesson|Exam/Quiz Lesson]]
- [[_COMMUNITY_Open Root-Finding (root3)|Open Root-Finding (root3)]]
- [[_COMMUNITY_Grill-Me Guideline|Grill-Me Guideline]]

## God Nodes (most connected - your core abstractions)
1. `makeScale()` - 17 edges
2. `conjugateGradient()` - 9 edges
3. `index.html app shell` - 9 edges
4. `clone()` - 8 edges
5. `Linear System of Equations (3x3)` - 8 edges
6. `Differentiation and ODE Exercises (diff1.pdf)` - 8 edges
7. `Screenshot: Root Finding Lesson (Numer Master)` - 8 edges
8. `Root of Equation` - 7 edges
9. `Linear Systems [A]{x}={B}` - 7 edges
10. `InterpSolver()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `ConjugateLesson()` --calls--> `conjugateGradient()`  [INFERRED]
  lessons/conjugate.jsx → lib/solvers.jsx
- `DiffErrorPlot()` --calls--> `makeScale()`  [INFERRED]
  lessons/differentiation.jsx → lib/anim.jsx
- `CGPath2D()` --calls--> `makeScale()`  [INFERRED]
  lessons/conjugate.jsx → lib/anim.jsx
- `CGResidualPlot()` --calls--> `conjugateGradient()`  [INFERRED]
  lessons/conjugate.jsx → lib/solvers.jsx
- `GaussLegendreViz()` --calls--> `makeScale()`  [INFERRED]
  lessons/integration.jsx → lib/anim.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CDN dependency stack loaded by app shell** — index_app_shell, ref_react18, ref_babel_standalone, ref_katex, ref_pyodide [EXTRACTED 0.90]
- **No-module-system load-order architecture** — index_no_build_system, concept_window_globals, index_load_order_architecture [EXTRACTED 0.90]
- **Direct Solvers for Linear Systems** — uploads_gauss_elimination_method_cramers_rule, uploads_gauss_elimination_method_gauss_elimination, uploads_gauss_elimination_method_gauss_jordan, uploads_gauss_elimination_method_matrix_inversion, uploads_gauss_elimination_method_lu_decomposition, uploads_gauss_elimination_method_cholesky_decomposition [EXTRACTED 1.00]
- **Iterative Solvers for Linear Systems** — uploads_conjugate_jacobi_iteration, uploads_conjugate_gauss_seidel, uploads_conjugate_conjugate_gradient [EXTRACTED 1.00]
- **Bracketing Root-Finding Methods** — uploads_root1_graphical_method, uploads_root1_bisection_method, uploads_root1_false_position [INFERRED 0.85]
- **Finite Divided-Difference Operators** — uploads_diff1_forward_divided_difference, uploads_diff1_backward_divided_difference, uploads_diff1_central_divided_difference [EXTRACTED 1.00]
- **Interpolation Polynomial Methods** — uploads_interpolation_and_extrapolation_i_linear_interpolation, uploads_interpolation_and_extrapolation_i_quadratic_interpolation, uploads_interpolation_and_extrapolation_i_polynomial_interpolation, uploads_interpolation_and_extrapolation_ii_lagrange_interpolation, uploads_interpolation_and_extrapolation_i_newton_divided_difference_interp [INFERRED 0.85]
- **Open Root-Finding Methods** — uploads_root3_newton_raphson, uploads_root3_secant_method [INFERRED 0.85]
- **Newton-Cotes Integration Rules** — uploads_s__numer_final_251111_221516_trapezoidal_rule, uploads_multiplelinear_integration_composite_trapezoidal_rule, uploads_s__numer_final_251111_221516_simpsons_rule, uploads_s__numer_final_251111_221516_composite_simpsons_rule [INFERRED 0.85]
- **Least-Squares Regression Family** — uploads_spline_regression_linear_regression, uploads_spline_regression_polynomial_regression, uploads_multiplelinear_integration_multiple_linear_regression [EXTRACTED 1.00]
- **Root-Finding Methods Family** — numer_thsheet_tiv_numer_mid_251111_221450_bisection, numer_thsheet_tiv_numer_mid_251111_221450_false_position, numer_thsheet_tiv_numer_mid_251111_221450_newton_raphson, numer_thsheet_tiv_numer_mid_251111_221450_secant, numer_thsheet_tiv_numer_mid_251111_221450_one_point_iteration [EXTRACTED 1.00]
- **Root Finding Lesson Screen Layout** — screenshots_01_root_sidebar_nav, screenshots_01_root_hero_header, screenshots_01_root_feature_badges, screenshots_01_root_why_section [INFERRED 0.85]
- **fx-991CW Table-mode keystroke walkthrough** — screenshots_02_root_fxkeys_section, screenshots_02_root_numbered_steps, screenshots_02_root_key_glyphs, screenshots_02_root_calc_table_mode [EXTRACTED 1.00]
- **Intro Landing Screen Layout** — screenshots_intro_sidebar_nav, screenshots_intro_hero_welcome, screenshots_intro_feature_chips, screenshots_intro_roadmap [EXTRACTED 1.00]

## Communities (25 total, 3 thin omitted)

### Community 0 - "Integration/Interp/CG Lesson UI"
Cohesion: 0.07
Nodes (21): CGPath2D(), CGResidualPlot(), ConjugateLesson(), CompositeViz(), ErrorVsNPlot(), GaussLegendreViz(), SimpsonViz(), TrapezoidViz() (+13 more)

### Community 1 - "JS Numerical Solvers Library"
Cohesion: 0.08
Nodes (32): RombergViz(), InterpSolver(), add(), backwardDiffTable(), cholesky(), clone(), compositeTrap(), conjugateGradient() (+24 more)

### Community 2 - "Final Exam Review Concepts"
Cohesion: 0.09
Nodes (28): Composite Trapezoidal Rule, Multiple Linear Regression, Numerical Integration, MultipleLinear_Integration (course sheet), Single Trapezoidal Rule, Backward Divided-Difference, Central Divided-Difference, Composite Simpson's Rule (+20 more)

### Community 3 - "Regression/Spline Lessons & Inputs"
Cohesion: 0.10
Nodes (11): num(), RegressionSolver(), ScatterLineViz(), CubicContinuityViz(), SplineSolver(), SplineViz(), fmt(), cubicSpline() (+3 more)

### Community 4 - "Linear Systems & Root Concepts"
Cohesion: 0.12
Nodes (22): Conjugate Gradient Method, Gauss-Seidel Iteration Method, Jacobi Iteration Method, Conjugate Gradient (Course Sheet), Quadratic Function f(X) = 1/2 X^T A X - B^T X, Search Direction Vector and Step Size (lambda_k, alpha_k), Cholesky Decomposition, Cramer's Rule (+14 more)

### Community 5 - "App Architecture & Conventions"
Cohesion: 0.12
Nodes (20): FontTweaks postMessage edit-mode hook, Nine-section lesson template, localStorage persistence (font/scroll/calc state), Never name anything Math (avoid shadowing global), Numer Master (Thai numerical-methods web app), Thai-language user-facing copy, window globals (no module system), index.html app shell (+12 more)

### Community 6 - "Shared UI Components"
Cohesion: 0.12
Nodes (4): M(), MB(), TeX(), texFromChildren()

### Community 7 - "Midterm Review Concepts"
Cohesion: 0.14
Nodes (17): Bisection Method, Cholesky Decomposition, Cramer's Rule, False Position Method, Gauss Elimination, Gauss-Jordan, Graphical Method, Linear Systems [A]{x}={B} (+9 more)

### Community 9 - "Differentiation Lesson"
Cohesion: 0.24
Nodes (7): DiffComparison(), DiffErrorPlot(), DiffWorkedExample(), diffBackward(), diffCentral(), diffForward(), richardsonDeriv()

### Community 10 - "Screenshot: fx-991CW Keys & Bisection"
Cohesion: 0.29
Nodes (10): Root Finding Lesson - fx-991CW Keys & Bisection Method (screenshot), Bisection Method (Method 2) Section, Calculator Table Mode Walkthrough, fx-991CW Keystrokes Section (Table mode), Key Glyph UI Elements (HOME, Table, OK), Numbered Method Heading (badge '2'), Numbered Keystroke Steps (1-5), Python Code Runner Cell (top, scrollable) (+2 more)

### Community 11 - "Progress Tracking (localStorage)"
Cohesion: 0.33
Nodes (7): getLessonDoneMap(), getProblemDoneMap(), LessonDoneToggle(), loadJSON(), ProblemDoneToggle(), useLessonDone(), useProblemDone()

### Community 12 - "Screenshot: Root Finding Lesson"
Cohesion: 0.36
Nodes (9): Screenshot: Root Finding Lesson (Numer Master), Feature Badge Pills (6 methods, Animation, fx-991CW SOLVE, Python complete), Lesson Hero Header with KaTeX Title, Per-Chapter Progress Indicators, Object-Object Render Artifact in Body Text, Root Finding Lesson Topic (f(x)=0), Sidebar Chapter Navigation, Thai-Language Dark-Theme UI (+1 more)

### Community 13 - "Differentiation Concepts (diff1)"
Cohesion: 0.39
Nodes (9): Backward Divided-Difference O(h), Central Divided-Difference O(h^2), Composite Simpson's Rule, Divided Differences (Numerical Differentiation), First Divided-Difference (First Derivative), Forward Divided-Difference O(h), Differentiation and ODE Exercises (diff1.pdf), Second Divided-Difference (Second Derivative) (+1 more)

### Community 14 - "Interpolation Concepts (Sheets)"
Cohesion: 0.33
Nodes (9): Linear Interpolation, Newton Divided-Difference Interpolation, Interpolation and Extrapolation I (PDF), Polynomial Interpolation, Quadratic Interpolation, Second Divided-Difference Coefficient C2, Lagrange Basis Polynomials (L0, L1), Lagrange Interpolation (+1 more)

### Community 15 - "Screenshot: Intro/Landing Screen"
Cohesion: 0.32
Nodes (8): Numer Master Intro/Landing Screen, Numbered Chapters Grouped in Parts, Dark Theme Visual Design, Feature Chips (Animation, Python, Mock Exam), Welcome Hero Section, Roadmap / Where to Start Section, Chapter Sidebar Navigation, Thai-Language Pedagogical Flow

### Community 16 - "App Router & Sidebar"
Cohesion: 0.33
Nodes (5): ALL_ITEMS, App(), CHAPTERS, getCurrentId(), root

### Community 17 - "Problems Bank Lesson"
Cohesion: 0.40
Nodes (3): DIFFS, PROBLEMS, TOPICS

### Community 21 - "Open Root-Finding (root3)"
Cohesion: 1.00
Nodes (3): Newton-Raphson Method, Root Finding Exercises III (root3.pdf), Secant Method

## Knowledge Gaps
- **44 isolated node(s):** `CHAPTERS`, `ALL_ITEMS`, `root`, `METHOD_QUIZ`, `PROBLEMS` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `makeScale()` connect `Integration/Interp/CG Lesson UI` to `Differentiation Lesson`, `Regression/Spline Lessons & Inputs`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `fmt()` connect `Regression/Spline Lessons & Inputs` to `JS Numerical Solvers Library`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `InterpSolver()` connect `JS Numerical Solvers Library` to `Integration/Interp/CG Lesson UI`, `Regression/Spline Lessons & Inputs`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `makeScale()` (e.g. with `CGPath2D()` and `CGResidualPlot()`) actually correct?**
  _`makeScale()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `conjugateGradient()` (e.g. with `CGResidualPlot()` and `ConjugateLesson()`) actually correct?**
  _`conjugateGradient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `index.html app shell` (e.g. with `Numer Master (Thai numerical-methods web app)` and `Deploy static content to Pages (GitHub Actions)`) actually correct?**
  _`index.html app shell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `CHAPTERS`, `ALL_ITEMS`, `root` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._

---

## บันทึกการรัน (Run Notes — 2026-06-24)

สิ่งที่ทำในการ build กราฟครั้งนี้ (เพิ่มเองโดย Claude นอกเหนือจาก audit อัตโนมัติด้านบน):

- **Detect:** 51 ไฟล์ · ~64,338 คำ — code 20 (.jsx), docs 4, papers 24 (.pdf), images 3
- **Code (AST):** สกัดได้ 187 nodes / 252 edges จาก .jsx ทั้งหมด (deterministic, ไม่ใช้ LLM)
- **Semantic (Claude subagents, 7 chunks ขนานกัน):** docs 4 + images 3 + **papers แค่ 12 ไฟล์**
  - ⚠️ **dedup PDF:** ตรวจ md5 พบว่า PDF ใน `uploads/` กับ `numer_ชีทเรียน/` เป็นไฟล์เดียวกัน (byte-identical) 11 คู่ และ `uploads/summary.pdf` = `สรุป Numer_Final` ด้วย → เหลือเนื้อหาไม่ซ้ำจริง 12 จาก 24 ไฟล์ จึงสกัดแค่ชุดเดียว (`uploads/` 11 ไฟล์ + `numer_ชีทเรียน/ติว Numer_mid` ที่มีเฉพาะที่นั่น) เพื่อกัน node ซ้ำและประหยัด token ~ครึ่งหนึ่ง
  - ดังนั้น "51 files" ใน Corpus Check ด้านบนคือจำนวนที่ detect เจอ แต่ที่สกัด semantic จริง = 19 ไฟล์ (12 PDF + 4 docs + 3 images)
- **Merge:** 187 (AST) + 136 (semantic) → 323 nodes / 420 edges / 25 communities
- **Outputs:** `graph.html`, `graph.json`, `GRAPH_REPORT.md` · benchmark = 14.5x token reduction
- 🐞 **ไล่บั๊กแล้ว — ไม่ใช่บั๊กปัจจุบัน:** subagent อ่าน `screenshots/01-root.png` เจอ `[object Object]` ตรงตำแหน่ง `<M>` inline-math 3 จุดในส่วน "ทำไมต้องเรียน" → ตรวจแล้วพบว่า `texFromChildren`/`TeX`/`M` ใน `lib/components.jsx` เหมือนกันเป๊ะตั้งแต่ initial commit และ**ถูกต้อง** (render KaTeX เข้า `ref` ผ่าน `useEffect`, fallback เป็นช่องว่างถ้า KaTeX ไม่โหลด — ไม่มี path ที่ออก `[object Object]`) สาเหตุคือ **screenshot เก่าตกค้าง** (commit แค่ `2b7cde2` ครั้งเดียว ไม่เคยอัปเดต ขณะที่ `root_finding.jsx` แก้อีก 3 commits) → ควร re-capture `screenshots/01-root.png` + `02-root.png` ไม่ต้องแก้โค้ด
