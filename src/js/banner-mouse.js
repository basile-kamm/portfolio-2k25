import { ScrollTrigger } from "gsap/ScrollTrigger";

// Banner mouse-follow effect: each layer drifts slightly toward the cursor,
// front layers more than back ones. The per-layer depth lives in CSS
// (--depth in _banner.scss); this module only feeds --mouse-x / --mouse-y
// (-1 → 1) on .banner-container. It uses the CSS `translate` property, so it
// never fights with the GSAP scroll parallax, which animates `transform`.

const SMOOTHING = 0.08; // fraction of the remaining distance covered per frame (~0.6s to settle)

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".banner-container");
  if (!banner) return;

  const canUseEffect = window.matchMedia(
    "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let rafId = null;
  let bannerActive = true;

  function render() {
    current.x += (target.x - current.x) * SMOOTHING;
    current.y += (target.y - current.y) * SMOOTHING;

    banner.style.setProperty("--mouse-x", current.x.toFixed(4));
    banner.style.setProperty("--mouse-y", current.y.toFixed(4));

    const settled =
      Math.abs(target.x - current.x) < 0.001 &&
      Math.abs(target.y - current.y) < 0.001;
    rafId = settled ? null : requestAnimationFrame(render);
  }

  function requestRender() {
    if (rafId === null) rafId = requestAnimationFrame(render);
  }

  function setTarget(x, y) {
    target.x = x;
    target.y = y;
    requestRender();
  }

  function onMouseMove(e) {
    if (!bannerActive) return;
    setTarget(
      (e.clientX / window.innerWidth) * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1
    );
  }

  function onMouseOut(e) {
    // relatedTarget is null when the cursor leaves the window
    if (!e.relatedTarget) setTarget(0, 0);
  }

  function enable() {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
  }

  function disable() {
    window.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseout", onMouseOut);
    setTarget(0, 0);
  }

  // Only follow the mouse while the banner is on screen
  ScrollTrigger.create({
    trigger: ".parallax-container",
    start: "top top",
    end: "bottom top",
    onToggle: (self) => {
      bannerActive = self.isActive;
    },
  });

  if (canUseEffect.matches) enable();
  canUseEffect.addEventListener("change", (e) => (e.matches ? enable() : disable()));
});
