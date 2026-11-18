import gsap from "gsap";

// Glitch flash over the TV screen (.selected-trailer-glitch), shared by the
// project hover (selected.js) and the trailer reveal on scroll (parallax.js).
//
// Only one glitch runs at a time: starting a new one kills the previous one
// (last wins). `onPeak` runs when the glitch fully covers the screen — that's
// where content behind it can be swapped invisibly. If a glitch is killed
// before its peak, its `onPeak` still runs right away so the state it was
// meant to apply (e.g. trailer shown/hidden) is never lost.
//
// `onPeak` may return a Promise (e.g. "the new video has a frame to show"):
// the glitch then stays fully visible until it resolves, at most MAX_HOLD
// seconds, so the swap never shows after the glitch is gone.

// Total duration of every glitch (hover, trailer reveal and hide), in seconds.
// Split as 30% fade in, 40% fully visible, 30% fade out.
const GLITCH_DURATION = 0.5;

const FADE_IN = GLITCH_DURATION * 0.3;
const FADE_OUT_AT = GLITCH_DURATION * 0.7;
const FADE_OUT = GLITCH_DURATION * 0.3;

// Longest time the glitch waits at its peak for `onPeak`'s Promise, in seconds
const MAX_HOLD = 1.5;

let current = null; // { tl, onPeak, peaked, killed }

export function playGlitch({ onPeak } = {}) {
  const el = document.querySelector(".selected-trailer-glitch");

  if (current) {
    current.killed = true;
    current.tl.kill();
    if (!current.peaked && current.onPeak) current.onPeak();
    current = null;
  }

  if (!el) {
    if (onPeak) onPeak();
    return null;
  }

  const run = { tl: gsap.timeline(), onPeak, peaked: false, killed: false };
  run.tl.to(el, { opacity: 1, duration: FADE_IN });
  run.tl.call(() => {
    run.peaked = true;
    const ready = onPeak ? onPeak() : null;
    if (!ready || typeof ready.then !== "function") return;

    // Hold at the peak until the new content is ready (or MAX_HOLD is over)
    run.tl.pause();
    const timeout = new Promise((resolve) => setTimeout(resolve, MAX_HOLD * 1000));
    Promise.race([ready, timeout])
      .catch(() => {})
      .then(() => {
        if (!run.killed) run.tl.resume();
      });
  });
  run.tl.to(el, { opacity: 0, duration: FADE_OUT }, FADE_OUT_AT);
  run.tl.eventCallback("onComplete", () => {
    if (current === run) current = null;
  });

  current = run;
  return run.tl;
}
