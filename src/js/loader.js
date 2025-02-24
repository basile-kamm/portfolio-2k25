import gsap from "gsap";

gsap.to(".loader-text-container", {
  opacity: 1,
  duration: 0.5,
  stagger: 0.3,
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-container");

  setTimeout(() => {
    // Optional delay for smoother experience
    gsap.to(loader, {
      translateY: "-100%",
      duration: 1,
      ease: "power2.inOut",
    });
  }, 500);

  loader.addEventListener("transitionend", () => {
    loader.remove();
  });
});
