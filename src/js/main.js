import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import "./loader";
import "./contact";
import "./works";

import "./parallax";
import "./selected";
import "./credits";

document.addEventListener("DOMContentLoaded", function () {
  {
    const trailerIframes = document.querySelectorAll(".selected-trailer-js");

    function onFirstScroll() {
      trailerIframes.forEach((iframe) => {
        if (!iframe.getAttribute("src")) {
          // Vérifie si src est déjà défini
          const src = iframe.getAttribute("data-src");
          if (src) {
            iframe.setAttribute("src", src);
          }
        }
      });

      // Supprime l'écouteur après la première détection
      window.removeEventListener("scroll", onFirstScroll);
    }

    if (window.screen.width >= 678) {
      window.addEventListener("scroll", onFirstScroll);
    }
  }

  {
    //hover Btn effect
    const btnCont = document.querySelector(".banner-cta-container");
    const mainBtn = document.querySelector(".banner-cta.main");

    let addInterval, removeInterval;
    let addedBtn = 0;
    let hoverAnim = null;
    let hoverAnimLeave = null;

    let addedText;
    if (mainBtn.classList.contains("fr")) {
      addedText = "Contactez-moi";
    } else {
      addedText = "Contact me";
    }

    mainBtn.addEventListener("mouseover", () => {
      clearInterval(removeInterval); // Stop removal if hovering again
      if (hoverAnimLeave) {
        hoverAnimLeave.kill();
        hoverAnimLeave = null;
      }
      hoverAnim = mainCtaHoverAnim();
      addInterval = setInterval(() => {
        if (addedBtn < 60) {
          // Only add if less than 20
          const newElem = document.createElement("p");
          newElem.classList.add("banner-cta", "added");
          newElem.textContent = addedText;
          btnCont.appendChild(newElem);

          gsap.set(newElem, {
            x: "random(0, 100, 5)vw",
            y: "random(0, 80, 1)vh",
            // rotate: "random(0, 360)",
            opacity: "random(0.5, 1)",
          });

          addedBtn++; // Increase counter
          //console.log("Added:", addedBtn);
        } else {
          clearInterval(addInterval); // Stop adding when max is reached
        }
      }, 30);
    });

    mainBtn.addEventListener("mouseleave", () => {
      clearInterval(addInterval); // Stop adding new elements
      if (hoverAnim) {
        hoverAnim.kill();
        hoverAnim = null;
      }

      hoverAnimLeave = mainCtaHoverAnimLeave();

      removeInterval = setInterval(() => {
        const addedButtons = document.querySelectorAll(".banner-cta.added");
        if (addedButtons.length > 0) {
          addedButtons[0].remove(); // Remove first added element
          addedBtn--; // Decrease counter
          //console.log("Removed:", addedBtn);
        } else {
          clearInterval(removeInterval); // Stop when no elements left
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
  }
});
