import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

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
    y: -50,
  });
  parallax.fromTo(
    ".layer-1-2",
    {
      y: -100,
    },
    {
      y: 100,
    },
    "<"
  );

  parallax.from(
    ".selected-background",
    {
      scale: 30,
      y: -1000,
    },
    "0.6"
  );
});
