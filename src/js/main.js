import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import "./parallax";
import "./selected";
document.addEventListener("DOMContentLoaded", function () {
  const creditsCta = document.querySelector(".credits");
  const creditsCont = document.querySelector(".credits-container");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");
  const creditsClose = document.querySelector(".credits-close");

  let openCreditsAnim;

  creditsCta.addEventListener("click", function () {
    if (!openCreditsAnim) {
      openCreditsAnim = openCredits(); // Create the animation instance
    }
  });

  creditsClose.addEventListener("click", function () {
    console.log("ye");
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
    tl.to(creditsCont, { translateY: 0 });

    return tl;
  }
});
