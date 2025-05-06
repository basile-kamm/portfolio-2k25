import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
document.addEventListener("DOMContentLoaded", function () {
  // Banner anim

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
    },
    onComplete: () => {
      gsap.set(".banner-container", { display: "none" });
    },
  });

  parallax.set(".selected-trailer", { zIndex: 10 });

  if (window.innerWidth <= 678) {
    // console.log("mobile");
    parallax.from(
      ".selected-background",
      {
        scale: 13,
        x: -1000,
        y: "-170vw",
        rotate: -45,

        duration: 1,
      },
      "<"
    );
    parallax.from(
      ".selected-main-trailer",
      {
        opacity: 0,
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
      ".selected-main-trailer",
      {
        opacity: 0,
        duration: 1,
      },
      "<"
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
