import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// First, so a <video> → Vimeo iframe fallback happens before other modules
// look up the video elements
import "./videos";
import "./loader";
import "./contact";
import "./works";

import "./parallax";
import "./banner-mouse";
import "./selected";
import "./credits";

document.addEventListener("DOMContentLoaded", function () {
  // Trailer videos are loaded and played on demand by ./videos.js
  (function initBannerCtaHover() {
    //hover Btn effect
    const btnCont = document.querySelector(".banner-cta-container");
    const mainBtn = document.querySelector(".banner-cta.main");

    // Banner CTA only exists on the homepage
    if (!btnCont || !mainBtn) return;

    const MAX_ADDED_BTN = 60;
    let addInterval = null;
    let removeInterval = null;
    let hoverAnim = null;
    let hoverAnimLeave = null;

    let addedText;
    if (mainBtn.classList.contains("fr")) {
      addedText = "Contactez-moi";
    } else {
      addedText = "Contact me";
    }

    const getAddedButtons = () => btnCont.querySelectorAll(".banner-cta.added");

    function stopAdding() {
      clearInterval(addInterval);
      addInterval = null;
    }

    function stopRemoving() {
      clearInterval(removeInterval);
      removeInterval = null;
    }

    // mouseenter (not mouseover) so hovering child elements doesn't retrigger it
    mainBtn.addEventListener("mouseenter", () => {
      stopRemoving(); // Stop removal if hovering again
      stopAdding(); // Never keep more than one add interval alive
      if (hoverAnimLeave) {
        hoverAnimLeave.kill();
        hoverAnimLeave = null;
      }
      if (hoverAnim) hoverAnim.kill();
      hoverAnim = mainCtaHoverAnim();
      addInterval = setInterval(() => {
        if (getAddedButtons().length < MAX_ADDED_BTN) {
          const newElem = document.createElement("p");
          newElem.classList.add("banner-cta", "added");
          newElem.textContent = addedText;
          btnCont.appendChild(newElem);

          gsap.set(newElem, {
            x: "random(0, 100, 5)vw",
            y: "random(0, 80, 1)vh",
            opacity: "random(0.5, 1)",
          });

        } else {
          stopAdding(); // Stop adding when max is reached
        }
      }, 30);
    });

    mainBtn.addEventListener("mouseleave", () => {
      stopAdding(); // Stop adding new elements
      stopRemoving();
      if (hoverAnim) {
        hoverAnim.kill();
        hoverAnim = null;
      }

      hoverAnimLeave = mainCtaHoverAnimLeave();

      removeInterval = setInterval(() => {
        const first = btnCont.querySelector(".banner-cta.added");
        if (first) {
          first.remove(); // Remove first added element
        } else {
          stopRemoving(); // Stop when no elements left
        }
      }, 20);
    });

    function mainCtaHoverAnim() {
      const tl = gsap.timeline();
      tl.to(mainBtn, {
        padding: "1.4vh 1.2vw 0.2vh",
        duration: 0.3,
      });
      tl.to(mainBtn, {
        padding: "0.8vh 1.2vw 0.8vh",
        duration: 0.3,
      });
      tl.to(
        mainBtn,
        {
          "--height": "100%",
          duration: 0.3,
        },
        "<"
      );

      return tl;
    }
    function mainCtaHoverAnimLeave() {
      const tl = gsap.timeline();

      tl.to(mainBtn, {
        "--height": "0",
        duration: 0.3,
      });
      tl.to(
        mainBtn,
        {
          padding: "1.4vh 1.2vw 0.2vh",
          duration: 0.3,
        },
        "<"
      );
      tl.to(mainBtn, {
        padding: "1.4vh 0 0.2vh",
        duration: 0.3,
      });

      return tl;
    }
  })();
});
