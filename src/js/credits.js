import gsap from "gsap";

document.addEventListener("DOMContentLoaded", function () {
  const creditsCta = document.querySelector(".credits");
  const creditsCont = document.querySelector(".credits-container");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");
  const creditsClose = document.querySelector(".credits-close");

  let openCreditsAnim;

  creditsCta.addEventListener("click", function () {
    openCreditsAnim = openCredits(); // Create the animation instance
  });

  creditsClose.addEventListener("click", function () {
    openCreditsAnim.reverse();
    openCreditsAnim == null;
  });
  selectedCloseMap.addEventListener("click", function () {
    openCreditsAnim.reverse();
    openCreditsAnim == null;
  });

  function openCredits() {
    const tl = gsap.timeline({
      onReverseComplete: () => {
        tl.set(creditsCont, { display: "none" });
        tl.set(selectedCloseMap, { display: "none" });
      },
    });

    tl.set(creditsCont, { display: "block" });
    tl.set(selectedCloseMap, { display: "block" });
    tl.to(creditsCont, { translateY: 0, duration: 0.5 });

    return tl;
  }
});
