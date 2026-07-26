# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Numer Master" — a single-page educational web app (Thai-language) teaching Numerical Methods through interactive lessons, animations, and runnable Python. **No build system.** `index.html` loads React 18, Babel Standalone, and KaTeX from CDNs, then includes every `.jsx` file directly as `<script type="text/babel">`. JSX is transpiled in the browser at runtime.

## Running / developing

Serve the directory over HTTP and open `index.html`. From the repo root, any static server works:

```
python3 -m http.server 8000
# or
npx serve .
```

Opening `index.html` via `file://` will break: CDN integrity checks and KaTeX fonts require a real origin. There is no `package.json`, no lint, no test suite — verification means loading the page in a browser and clicking through.

When you change a `.jsx` file, just refresh. If you add a new lesson file, you must also add a `<script>` tag for it in `index.html` (order matters — see below).

## Architecture

### Load order and globals (critical)

Because there's no module system, every file is a plain `<script>` evaluated in order against the global `window`. Files at the bottom of `index.html` depend on files higher up:

1. `lib/components.jsx` — shared UI (`TeX`, `M`, `MB`, `Sect`, `Hero`, `Callout`, `Problem`, `PythonRunner`, `CodeBlock`, `NumTable`, `Formula`, `CalcSteps`, `Key`). Attached to `window` at the bottom of the file.
2. `lib/anim.jsx` — `StepPlayer`, `Axes`, `plotPath`, `makeScale`, `ease`. Used by all lesson animations.
3. `lib/solvers.jsx` — pure-JS numerical solvers (root finding, linear systems, interpolation, regression, integration, differentiation). All methods including `cramer`, `luDecomp`/`solveLU`, `cholesky`/`solveCholesky`, `matrixInverse`/`solveByInverse`, `gaussJordan`, `taylorSeries`/`autoDerivs`, `newtonForwardEval`/`newtonBackwardEval`, `cubicSpline`, `romberg`, `gaussLegendre`, `richardsonDeriv` are exposed on `window`. Also `parseExpr` for turning user math text into JS functions.
4. `lib/minicalc.jsx` — floating fx-991CW-style calculator; exposes `MiniCalc` and `CalcToggle` (rendered globally by `app.jsx`).
5. `lib/inputs.jsx` — `MatrixInput`, `VectorInput`, `PointsInput`, `FnInput`, `SolverShell`, `fmt`, `parseMat`/`parseVec`. Used by every interactive solver UI.
6. `lib/progress.jsx` — `useLessonDone`, `useProblemDone`, `LessonDoneToggle`. Tracks per-lesson and per-problem completion in localStorage.
7. `lessons/*.jsx` — each defines one component named `<Topic>Lesson` (e.g. `RootFindingLesson`). The component name is referenced as a string in `app.jsx`'s `CHAPTERS` table and resolved via `window[comp]` at render time, so the lesson file must run before `app.jsx`.
8. `app.jsx` — sidebar + `location.hash`-based router + keyboard nav (`[`/`]` for prev/next chapter) + progress badges. Last.

### Gotcha: don't name anything `Math`

`components.jsx` warns about this explicitly. The LaTeX wrapper is `TeX` / `M` / `MB`, never `Math`, because shadowing the global `Math` object would break every solver.

### How a lesson is structured

Every lesson follows the same nine-section template (documented in `lessons/intro.jsx`): Why & Intuition → Theory → Animation → Worked Example → Interactive Solver → fx-991CW Keystrokes → Python (runnable) → Mock Exam Problem → Quick Reference. When adding a new lesson, match this rhythm and reuse `Sect`, `Hero`, `Callout`, `Problem`, `Formula`, `NumTable`, `CalcSteps`, `Key`, `CodeBlock`, `PythonRunner`, and `StepPlayer` from the libs rather than rolling new primitives.

User-facing copy is in **Thai**. Preserve that — UI labels, headings, and explanations are all Thai; only code, math, and identifiers are English.

### Python execution

`PythonRunner` lazy-loads Pyodide from a CDN the first time the user clicks Run, then caches the promise. Cells are independently editable in-page. There is no server.

### Persistence

The app uses `localStorage` heavily — font size (`numer-fs`), per-chapter scroll position (`scroll-<id>`), and calculator state (`calc-vars`, `calc-hist`, `calc-ang`, `calc-pos`). When changing routing or chapter IDs, old scroll keys become orphaned but harmless.

### Editor "tweaks" hook

`app.jsx`'s `FontTweaks` listens for `postMessage` events `__activate_edit_mode` / `__deactivate_edit_mode` from `window.parent`, and posts `__edit_mode_available` / `__edit_mode_dismissed` back. This is for an external host iframe — leave it alone unless you know what's calling it.

## Reference material

`uploads/` contains the source PDFs (Thai course materials) the lessons are derived from. `screenshots/` is reference imagery. Neither is consumed by the app at runtime.

## Behavioral guideline

`SKILL.md` (Karpathy guidelines) applies to changes here: surgical edits, no speculative abstractions, match existing style. The codebase deliberately has no build step and no framework beyond React+Babel-in-browser — don't introduce one without being asked.

## Lecture transcription (added 2026-07-04)

`tools/transcribe_groq.py` transcribes Thai lecture audio via the Groq API (free tier, whisper-large-v3 with automatic -turbo fallback): `python3 tools/transcribe_groq.py <audio files>` → `transcripts/<stem>.txt` + `.segments.txt`. It needs `ffmpeg`/`ffprobe`/`curl` and reads the API key from `GROQ_API_KEY` or `~/.config/groq.key` — **the key must never be committed** (repo is public; run `grep -rn "gsk_"` before committing). Pipeline details and lessons learned live in the script's docstring.

## Teaching standard (kim's explicit requirement)

When writing or revising lesson content: professor/sheet-level detail is the *minimum* — never summarize away topics, always explain the "why" behind each formula, and prefer animations/interactive widgets over static text. kim wants to understand deeply enough to teach others. Transcribed lectures (when available) reveal what the professor emphasizes beyond the sheets — weave that in and mark it as lecture-sourced.

## Lesson QA — กฎตัวเลข (added 2026-07-26 after cross-model review)

ทุก defect ที่เจอในการรีวิวไขว้เป็น failure class เดียวกัน: **เลขที่คำนวณต่อจากเลขที่ปัดแล้ว**. กฎ:

1. **เลขอนุพัทธ์** (error %, "เร็วกว่า X เท่า", ε เปรียบเทียบ) ต้องคำนวณจาก **full-precision program output** — ห้ามคำนวณจากค่าที่ปัดโชว์ในตาราง (เคยพลาด: FP error 0.00084%→จริง 0.00086%, ~460 เท่า→จริง ~450 เท่า)
2. ถ้าอ้าง output ของโปรแกรม ให้**รันจริงแล้ว copy เลขจาก output** อย่าคำนวณในหัว (เคยพลาด: f = −2.0×10⁻⁵ ที่จริง −2.2×10⁻⁵)
3. **เงื่อนไขหยุดที่สอนใน Callout ต้องตรงกับโค้ดข้างล่างเป๊ะ** — absolute `|Δx|` กับ relative `|Δx/x|` คือคนละเกณฑ์ (เคยพลาด: callout สอน absolute แต่โค้ดใช้ relative)
4. **precision ที่โชว์ต้องเท่ากันทั้งหัวข้อ** — walkthrough ทำมือกับตารางสรุปต้องปัดตำแหน่งเท่ากัน (มาตรฐานบท root/diff = 6 ตำแหน่ง)
5. เปลี่ยนที่มาโจทย์ (เช่น root1.pdf → การบ้าน 4) ต้อง **grep ทั้งไฟล์หา label เก่า** ให้ครบ: หัวข้อ h3, ตัวหนังสือเล็กใน Callout, และ**comment บรรทัดแรกในโค้ด Python** (จุดที่หลุดบ่อยสุด)
6. Bullet สเปคโจทย์ต้องบรรยายสิ่งที่โปรแกรมที่แสดง**ทำจริง** ไม่ใช่ variant อื่นของ algorithm (เคยพลาด: bullet บอก "หา min |f(x)|" แต่โค้ดหยุดเมื่อ f เปลี่ยนเครื่องหมาย)

Review pipeline ก่อน commit บทเรียน (ทำครบทั้ง 3 ขั้น):
1. รันเลข**ทุกตัว**ที่ปรากฏในบทด้วย python เทียบทีละตัว — รวมถึงเลขใน Callout/หมายเหตุ ไม่ใช่แค่ตารางหลัก
2. เทียบกับใบงาน/ชีทจริง (PDF) ว่าโจทย์-สูตร-ตัวอย่างเทสตรง และจดจุดที่ใบงานพิมพ์ผิดไว้ในบทเรียนด้วย (เช่น การบ้าน 4 พิมพ์ข้อย่อยของข้อ 1 หลงเป็น 2.1/2.2)
3. เปิดหน้าจริง (serve + playwright + `/usr/bin/chromium`) เช็ค console error + screenshot ส่วนที่แก้
