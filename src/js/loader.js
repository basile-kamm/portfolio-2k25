import gsap from "gsap";

gsap.to(".loader-text-container", {
  opacity: 1,
  duration: 0.5,
  stagger: 0.3,
});

let loadedAnim;
const loader = document.querySelector(".loader-container");
window.addEventListener("load", () => {
  setTimeout(() => {
    loadedAnim = loadedAnimTl();
    // Optional delay for smoother experience
  }, 500);

  loader.addEventListener("transitionend", () => {
    loader.remove();
  });
});

function loadedAnimTl() {
  const tl = gsap.timeline();
  const parallaxCont = document.querySelector(".parallax-container");

  tl.to(loader, {
    translateY: "-100%",
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
      console.log("loader finised");
    },
  });

  if (parallaxCont) {
    console.log("paralax existe");
    tl.from(
      ".banner-title-letter",
      {
        y: 200,
        stagger: 0.05,
      },
      ">0.5"
    );
    tl.from(
      ".banner-title",
      {
        skewY: 30,
        y: 30,
        duration: 1,
      },
      "<"
    );
    tl.from(
      ".banner-texts > *",
      {
        x: 500,
        stagger: 0.4,
        duration: 1.5,
      },
      "<"
    );
    tl.from(
      "header",
      {
        translateY: "-100%",
        duration: 1,
      },
      "<1"
    );
  } else {
    console.log("paralax not");
  }
}
