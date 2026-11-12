import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pauseVideosIn } from "./videos";

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

  // Works grid only exists on the works page
  if (cards.length === 0) return;

  const displayIframes = [
    ...document.querySelectorAll(".display-iframe-lazy"),
  ].filter((iframe) => iframe.getAttribute("data-src"));

  function onFirstScroll() {
    let loadedCount = 0;

    // No lazy iframe left to wait for (videos are handled by videos.js)
    if (displayIframes.length === 0) {
      ScrollTrigger.killAll();
      workHorizontalScroll();
      return;
    }

    displayIframes.forEach((iframe) => {
      iframe.setAttribute("src", iframe.getAttribute("data-src"));

      iframe.addEventListener("load", () => {
        loadedCount++;
        // Attendre que tous soient chargés (only the ones that have a src,
        // otherwise the count would never be reached)
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
      const lastRow = document.querySelector(".works-display-row.last");
      if (window.innerWidth > 768 && lastRow) {
        ScrollTrigger.killAll();
        const elementBox = lastRow.getBoundingClientRect();
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
            if (src && !iframe.getAttribute("src")) iframe.setAttribute("src", src);
          });

          // onclick (not addEventListener) so reopening a project doesn't
          // stack listeners that would reverse previous animations too
          const closeDetail = function () {
            openDetailAnim.reverse();
            pauseVideosIn(selectedWorkDetail);
            playVimeoVideos();
          };
          if (selectedDetailClose) selectedDetailClose.onclick = closeDetail;
          if (selectedCloseMap) selectedCloseMap.onclick = closeDetail;
        }
      });
    });
  });

  function playVimeoVideos() {
    if (typeof Vimeo === "undefined") return; // Vimeo API script not loaded
    const iframes = document.querySelectorAll(
      ".selected-detail-iframe-container.thumbnail iframe"
    );

    iframes.forEach((iframe) => {
      if (!iframe.getAttribute("src")) return; // Not loaded yet
      const vimeoPlayer = new Vimeo.Player(iframe);
      vimeoPlayer.play().catch(() => {}); // Play the video
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
    if (selectedCloseMap) tl.set(selectedCloseMap, { display: "block" });
    tl.to(selectedWorkDetail, { translateY: 0, translateX: 0 });
    const openAnimEls = selectedWorkDetail.querySelectorAll(".open-anim");
    if (openAnimEls.length) {
      tl.fromTo(openAnimEls, { x: 600 }, { x: 0, stagger: 0.1 }, "<");
    }
    if (selectedDetailClose) {
      tl.to(selectedDetailClose, { translateY: 0, translateX: 0 }, "<");
    }
    if (selectedCloseMap) tl.to(selectedCloseMap, { opacity: 1 }, "<");

    return tl;
  }

  // horizontal scroll

  const windowHeight = window.innerHeight;

  function workHorizontalScroll() {
    if (window.innerWidth > 768) {
      const worksRows = document.querySelectorAll(".works-display-row");
      const worksLastRow = document.querySelector(".works-display-row.last");
      if (!worksLastRow || worksRows.length === 0) return;

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
