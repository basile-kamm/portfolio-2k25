import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".works-item");
  const radioButtons = document.querySelectorAll('input[name="filter"]');
  const selectedDetails = document.querySelectorAll(
    ".selected-detail-container"
  );

  const selectedDetailClose = document.querySelector(".selected-detail-close");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");
  const body = document.querySelector("body");

  const displayIframes = document.querySelectorAll(".display-iframe-lazy");

  function onFirstScroll() {
    let loadedCount = 0;

    displayIframes.forEach((iframe, index) => {
      const src = iframe.getAttribute("data-src");
      if (!src) return;

      iframe.setAttribute("src", src);

      iframe.addEventListener("load", () => {
        loadedCount++;
        // Attendre que tous soient chargés
        if (loadedCount === displayIframes.length) {
          // Petit délai pour être sûr que le DOM est mis à jour
          setTimeout(() => {
            ScrollTrigger.killAll();
            workHorizontalScroll();
          }, 100);
        }
      });
    });

    // Supprime l’écouteur après le premier scroll
    window.removeEventListener("scroll", onFirstScroll);
  }

  // Ajoute l'écouteur au chargement de la page
  window.addEventListener("scroll", onFirstScroll, { once: true });

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      cards.forEach((card) => {
        if (card.classList.contains(radio.value)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
      if (window.innerWidth > 768) {
        ScrollTrigger.killAll();
        const elementBox = document
          .querySelector(".works-display-row.last")
          .getBoundingClientRect();
        const bottomPosition =
          window.scrollY + elementBox.top + elementBox.height;
        window.scrollTo({ top: bottomPosition - window.innerHeight });

        workHorizontalScroll();
      } else {
        window.scrollTo({ top: 200 });
      }
    });
  });

  cards.forEach((card) => {
    const itemValue = card.getAttribute("data-works-item-value");

    card.addEventListener("click", function () {
      selectedDetails.forEach((selectedWorkDetail) => {
        if (selectedWorkDetail.classList.contains(itemValue)) {
          const openDetailAnim = openWorkDetail(selectedWorkDetail);
          // Load iframe
          const lazyIframes = selectedWorkDetail.querySelectorAll(
            ".detail-iframe-lazy"
          );
          lazyIframes.forEach((iframe) => {
            const src = iframe.getAttribute("data-src");
            iframe.setAttribute("src", src);
          });

          selectedDetailClose.onclick = function () {
            openDetailAnim.reverse();
            playVimeoVideos();
          };
          selectedCloseMap.addEventListener("click", function () {
            openDetailAnim.reverse();
            playVimeoVideos();
          });
        }
      });
    });
  });

  function playVimeoVideos() {
    const iframes = document.querySelectorAll(
      ".selected-detail-iframe-container.thumbnail iframe"
    );

    iframes.forEach((iframe) => {
      const vimeoPlayer = new Vimeo.Player(iframe);
      vimeoPlayer.play(); // Play the video
    });
  }

  function openWorkDetail(selectedWorkDetail) {
    const tl = gsap.timeline({
      onReverseComplete: () => {
        gsap.set(selectedWorkDetail, { display: "none" });
        body.classList.remove("no-scroll");
      },
    });
    body.classList.add("no-scroll");
    tl.set(selectedWorkDetail, { display: "block" });
    tl.set(selectedCloseMap, { display: "block" });
    tl.to(selectedWorkDetail, { translateY: 0, translateX: 0 });
    tl.fromTo(
      selectedWorkDetail.querySelectorAll(".open-anim"),
      { x: 600 },
      { x: 0, stagger: 0.1 },
      "<"
    );
    tl.to(selectedDetailClose, { translateY: 0, translateX: 0 }, "<");
    tl.to(selectedCloseMap, { opacity: 1 }, "<");

    return tl;
  }

  // horizontal scroll

  const windowHeight = window.innerHeight;

  function workHorizontalScroll() {
    if (window.innerWidth > 768) {
      const worksRows = document.querySelectorAll(".works-display-row");
      const worksLastRow = document.querySelector(".works-display-row.last");

      let maxScrollDistance = 0;

      worksRows.forEach((worksRow) => {
        const rowWidth = worksRow.scrollWidth;
        maxScrollDistance = Math.max(maxScrollDistance, rowWidth);
      });

      gsap.set("body", {
        height: `${windowHeight}px`,
      });

      // console.log(maxScrollDistance, window.innerWidth);

      if (maxScrollDistance > window.innerWidth) {
        gsap.set("body", {
          height: `${maxScrollDistance + windowHeight}px`,
        });

        ScrollTrigger.create({
          trigger: worksLastRow,
          start: "bottom bottom",
          end: `+=${maxScrollDistance}`, // Scroll duration based on the longest row
          pin: ".works-scroll",
          scrub: 1,
          // markers: true,
        });

        worksRows.forEach((worksRow) => {
          gsap.to(worksRow, {
            x: () => `-${worksRow.scrollWidth - window.innerWidth + 30}px`,
            ease: "none",
            scrollTrigger: {
              trigger: worksLastRow, // Tie movement to the pinned section
              start: "bottom bottom",
              end: `+=${maxScrollDistance}`,
              scrub: 1,
              // markers: true,
            },
          });
        });
      }
    }
  }
});
