import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
document.addEventListener("DOMContentLoaded", function () {
  // Banner anim

  const parallax = gsap.timeline({
    scrollTrigger: {
      markers: true,
      trigger: ".parallax-container",
      start: "top top",
      end: "bottom top",
      pin: ".parallax-container",
      scrub: 0.3,
    },
  });

  parallax.to(".layer-1", {
    y: "-6vw",
    duration: 1,
  });
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
      y: 20,
      duration: 1,
    },
    "<"
  );
  parallax.to(
    ".layer-5",
    {
      y: 50,
      duration: 1,
    },
    "<"
  );
  parallax.to(
    ".layer-background",
    {
      y: 70,
      duration: 1,
    },
    "<"
  );
  parallax.from(
    ".selected-background",
    {
      scale: 30,
      y: "-170vw",
      rotate: -45,

      duration: 1,
    },
    "<"
  );
  parallax.to(
    ".banner-container",
    {
      scale: 0.4,
      duration: 0.3,
      y: 100,
    },
    "<0.75"
  );
  parallax.from(
    ".selected-works",
    {
      translateY: "200%",
      duration: 0.5,
    },
    "<"
  );
});
