import gsap from "gsap";

// Glitch flash over the TV screen (.selected-trailer-glitch), shared by the
// project hover (selected.js) and the trailer reveal on scroll (parallax.js).
//
// Only one glitch runs at a time: starting a new one kills the previous one
// (last wins). `onPeak` runs when the glitch fully covers the screen — that's
// where content behind it can be swapped invisibly. If a glitch is killed
// before its peak, its `onPeak` still runs right away so the state it was
// meant to apply (e.g. trailer shown/hidden) is never lost.

// Total duration of every glitch (hover, trailer reveal and hide), in seconds.
// Split as 30% fade in, 40% fully visible, 30% fade out.
const GLITCH_DURATION = 0.5;

const FADE_IN = GLITCH_DURATION * 0.3;
const FADE_OUT_AT = GLITCH_DURATION * 0.7;
const FADE_OUT = GLITCH_DURATION * 0.3;

let current = null; // { tl, onPeak, peaked }

export function playGlitch({ onPeak } = {}) {
  const el = document.querySelector(".selected-trailer-glitch");

  if (current) {
    current.tl.kill();
    if (!current.peaked && current.onPeak) current.onPeak();
    current = null;
  }

  if (!el) {
    if (onPeak) onPeak();
    return null;
  }

  const run = { tl: gsap.timeline(), onPeak, peaked: false };
  run.tl.to(el, { opacity: 1, duration: FADE_IN });
  run.tl.call(() => {
    run.peaked = true;
    if (onPeak) onPeak();
  });
  run.tl.to(el, { opacity: 0, duration: FADE_OUT }, FADE_OUT_AT);
  run.tl.eventCallback("onComplete", () => {
    if (current === run) current = null;
  });

  current = run;
  return run.tl;
}
