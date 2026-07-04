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
