// Progress tracking — read state per lesson + done state per problem.
// All in localStorage. Exposes hooks + UI components on window.

const { useState: useProgS, useEffect: useProgE } = React;

const LS_DONE = "numer-lesson-done";
const LS_PROB = "numer-problem-done";

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function useLessonDone(id) {
  const [done, setDone] = useProgS(() => !!loadJSON(LS_DONE, {})[id]);
  const toggle = () => {
    const m = loadJSON(LS_DONE, {});
    m[id] = !done;
    saveJSON(LS_DONE, m);
    setDone(!done);
  };
  return [done, toggle];
}

function useProblemDone(pid) {
  const [done, setDone] = useProgS(() => !!loadJSON(LS_PROB, {})[pid]);
  const toggle = () => {
    const m = loadJSON(LS_PROB, {});
    m[pid] = !done;
    saveJSON(LS_PROB, m);
    setDone(!done);
  };
  return [done, toggle];
}

function getLessonDoneMap() { return loadJSON(LS_DONE, {}); }
function getProblemDoneMap() { return loadJSON(LS_PROB, {}); }

function LessonDoneToggle({ id }) {
  const [done, toggle] = useLessonDone(id);
  return (
    <button className={"lesson-done-toggle " + (done ? "done" : "")} onClick={toggle}>
      <span>{done ? "✓" : "○"}</span>
      <span>{done ? "เรียนแล้ว" : "ติ๊กเมื่อเรียนจบบทนี้"}</span>
    </button>
  );
}

function ProblemDoneToggle({ id }) {
  const [done, toggle] = useProblemDone(id);
  return (
    <button className={"lesson-done-toggle " + (done ? "done" : "")}
      style={{marginLeft:0, fontSize:'0.722rem', padding:"2px 8px"}} onClick={toggle}>
      {done ? "✓ ทำแล้ว" : "○ ยังไม่ทำ"}
    </button>
  );
}

Object.assign(window, {
  useLessonDone, useProblemDone, getLessonDoneMap, getProblemDoneMap,
  LessonDoneToggle, ProblemDoneToggle,
});
