import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playGlitch } from "./glitch";
import { playWhenReady } from "./videos";

// Scroll progress of the homepage parallax (0 → 1) at which the main trailer
// appears in the TV, through a glitch. Scrolling back above it hides it the
// same way. 0.38: just before the project list starts rising (0.39 on desktop).
const TRAILER_REVEAL_PROGRESS = 0.38;

document.addEventListener("DOMContentLoaded", function () {
  // Banner anim — the parallax only exists on the homepage
  if (!document.querySelector(".parallax-container")) return;

  // The forest image zooms out of the TV screen. Its scale/rotation pivot must
  // sit exactly on the screen hole, wherever `background-size: cover` puts it
  // for the current viewport — otherwise the TV frame or the forest shows
  // at the start of the zoom on some screen widths.
  const selectedBg = document.querySelector(".selected-background");
  if (selectedBg) {
    gsap.set(selectedBg, { transformOrigin: getTvScreenOrigin(selectedBg) });
    ScrollTrigger.addEventListener("refreshInit", () => {
      gsap.set(selectedBg, { transformOrigin: getTvScreenOrigin(selectedBg) });
    });
  }

  const parallax = gsap.timeline({
    scrollTrigger: {
      trigger: ".parallax-container",
      start: "top top",
      end: "bottom top",
      pin: ".parallax-container",
      scrub: 0.3,
      onEnterBack: () => {
        gsap.set(".banner-container", { display: "block" });
      },
      onUpdate: (self) => updateTrailerReveal(self.progress),
    },
    onComplete: () => {
      gsap.set(".banner-container", { display: "none" });
    },
  });

  parallax.set(".selected-trailer", { zIndex: 10 });

  // Main trailer reveal: not scrubbed with the scroll anymore, triggered once
  // when the scroll passes TRAILER_REVEAL_PROGRESS (see updateTrailerReveal)
  let trailerShown = false;
  const getMainTrailer = () => document.querySelector(".selected-main-trailer");
  gsap.set(getMainTrailer(), { opacity: 0 });

  function setTrailerVisible(visible) {
    const trailer = getMainTrailer();
    if (!trailer) return;
    gsap.set(trailer, { opacity: visible ? 1 : 0 });
    // Returned so the glitch holds until the first frame is on screen
    if (visible) return restartTrailer(trailer);
  }

  function updateTrailerReveal(progress, { instant = false } = {}) {
    const shouldShow = progress >= TRAILER_REVEAL_PROGRESS;
    if (shouldShow === trailerShown) return;
    trailerShown = shouldShow;
    if (instant) setTrailerVisible(shouldShow);
    else playGlitch({ onPeak: () => setTrailerVisible(shouldShow) });
  }

  // Page loaded/restored already scrolled past the point: show it directly
  ScrollTrigger.addEventListener("refresh", () => {
    if (parallax.scrollTrigger) {
      updateTrailerReveal(parallax.scrollTrigger.progress, { instant: true });
    }
  });

  if (window.innerWidth <= 678) {
    // console.log("mobile");
    parallax.from(
      ".selected-background",
      {
        // 18 (not 13): enough for the screen to cover tall phones too
        scale: 18,
        rotate: -45,

        duration: 1,
      },
      "<"
    );

    parallax.from(
      ".selected-works",
      {
        translateY: "200%",
        duration: 0.5,
      },
      "<0.6"
    );
  } else {
    // console.log("desktop");
    parallax.to(".layer-1", {
      y: "-6vw",
      duration: 1,
    });
    parallax.to(
      ".banner-scroll-cta",
      {
        opacity: 0,
        duration: 0.8,
        y: -20,
      },
      "<"
    );
    parallax.fromTo(
      ".layer-1-2",
      {
        y: "23vw",
      },
      {
        y: "18vw",
        duration: 1,
      },
      "<"
    );
    parallax.to(
      ".layer-2",
      {
        y: "-4vw",
        duration: 1,
      },
      "<"
    );
    parallax.to(
      ".banner-titles",
      {
        y: -30,
        duration: 1,
      },
      "<"
    );
    parallax.to(
      ".banner-texts",
      {
        y: -40,
        duration: 1,
      },
      "<"
    );
    parallax.to(
      ".layer-3",
      {
        y: -20,
        duration: 1,
      },
      "<"
    );
    parallax.to(
      ".layer-4",
      {
        y: 5,
        duration: 1,
      },
      "<"
    );
    parallax.to(
      ".layer-5",
      {
        y: 20,
        duration: 1,
      },
      "<"
    );
    parallax.to(
      ".layer-background",
      {
        y: 30,
        duration: 1,
      },
      "<"
    );
    parallax.from(
      ".selected-background",
      {
        scale: 30,
        rotate: -65,

        duration: 1.6,
      },
      "<"
    );
    parallax.to(
      ".banner-container",
      {
        scale: 0.4,
        duration: 2,
        y: 100,
      },
      "<1.3"
    );

    parallax.from(
      ".selected-works",
      {
        translateY: "200%",
        duration: 2,
      },
      "<"
    );
  }
});

// Restart the trailer from its first frame (native <video>, or the Vimeo
// iframe fallback from videos.js). Resolves once the first frame is ready.
function restartTrailer(trailer) {
  if (trailer instanceof HTMLVideoElement) {
    return playWhenReady(trailer, { restart: true });
  } else if (typeof Vimeo !== "undefined" && trailer.getAttribute("src")) {
    const player = new Vimeo.Player(trailer);
    player.setCurrentTime(0).then(() => player.play()).catch(() => {});
  }
}

// Centre of the transparent TV screen in each forest image, as a fraction of
// the image size. Keep in sync with the --screen-* variables in _selected.scss.
const TV_SCREEN = {
  desktop: { ratio: 3000 / 1688, x: 0.5047, y: 0.6019 }, // forest-desktop.png
  mobile: { ratio: 1018 / 1810, x: 0.5059, y: 0.5472 }, // forest-mobile.png
};

function getTvScreenOrigin(el) {
  // Same breakpoint as the forest-mobile.png switch in _selected.scss
  const screen = window.matchMedia("(max-width: 767px)").matches
    ? TV_SCREEN.mobile
    : TV_SCREEN.desktop;
  const boxW = el.offsetWidth;
  const boxH = el.offsetHeight;
  // Size of the image once `background-size: cover` + centered
  const coverW = Math.max(boxW, boxH * screen.ratio);
  const coverH = coverW / screen.ratio;
  const x = boxW / 2 + (screen.x - 0.5) * coverW;
  const y = boxH / 2 + (screen.y - 0.5) * coverH;
  return `${x}px ${y}px`;
}
