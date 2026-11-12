import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pauseVideosIn, playWhenReady } from "./videos";
import { playGlitch } from "./glitch";

// How much faster the project detail closes than it opens (2 = twice as fast)
const DETAIL_CLOSE_SPEED = 1.5;

document.addEventListener("DOMContentLoaded", function () {
  const selectedWorks = document.querySelectorAll(".selected-work");
  // Looked up on demand: a trailer <video> may be swapped for its Vimeo
  // fallback iframe after page load (see videos.js)
  const getTrailers = () => document.querySelectorAll(".selected-trailer");
  const selectedDetails = document.querySelectorAll(
    ".selected-detail-container"
  );
  const selectedDetailClose = document.querySelector(".selected-detail-close");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");

  const body = document.querySelector("body");

  // Selected works only exist on the homepage
  if (selectedWorks.length === 0) return;

  selectedWorks.forEach((selectedWork) => {
    let hoverEnterAnim = null;
    let hoverLeaveAnim = null;
    const hoverValue = selectedWork.getAttribute("data-selected-value");

    selectedWork.addEventListener("mouseenter", function () {
      // Kill the leave animation if it's running
      if (hoverLeaveAnim) {
        hoverLeaveAnim.kill();
        hoverLeaveAnim = null;
      }

      // Create and play the enter animation
      hoverEnterAnim = createHoverEnterAnimation(selectedWork);

      // Start loading the trailer now (during the glitch fade-in), show it
      // at the glitch peak, and keep the glitch up until it has a frame
      const trailers = getRelatedTrailers();
      const ready = Promise.all(trailers.map((t) => playWhenReady(t)));
      playGlitch({
        onPeak: () => {
          trailers.forEach((t) => gsap.set(t, { display: "block" }));
          return ready;
        },
      });
    });

    selectedWork.addEventListener("mouseleave", function () {
      // Kill the enter animation if it's running
      // console.log("Mouse leave");
      if (hoverEnterAnim) {
        hoverEnterAnim.kill();
        hoverEnterAnim = null;
      }
      // Hide the related trailer at the glitch peak, while it's covered
      playGlitch({
        onPeak: () => {
          getRelatedTrailers().forEach((t) => gsap.set(t, { display: "none" }));
        },
      });

      // Create and play the leave animation (stored so mouseenter can kill it)
      hoverLeaveAnim = createHoverLeaveAnimation(selectedWork);
    });

    function getRelatedTrailers() {
      return [...getTrailers()].filter((t) => t.classList.contains(hoverValue));
    }

    selectedWork.addEventListener("click", function () {
      selectedDetails.forEach((selectedWorkDetail) => {
        if (selectedWorkDetail.classList.contains(hoverValue)) {
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
            // Close faster than it opened (same animation, played backwards)
            openDetailAnim.timeScale(DETAIL_CLOSE_SPEED).reverse();
            pauseVideosIn(selectedWorkDetail);
            playVimeoVideos();
          };
          if (selectedDetailClose) selectedDetailClose.onclick = closeDetail;
          if (selectedCloseMap) selectedCloseMap.onclick = closeDetail;
        }
      });
    });

    // Resume trailers that fell back to Vimeo iframes (Vimeo pauses them when
    // another player starts). Native <video> trailers are handled by videos.js
    function playVimeoVideos() {
      if (typeof Vimeo === "undefined") return; // Vimeo API script not loaded
      const iframes = document.querySelectorAll("iframe.selected-trailer-js");

      iframes.forEach((iframe) => {
        if (!iframe.getAttribute("src")) return; // Not loaded yet
        const vimeoPlayer = new Vimeo.Player(iframe);
        vimeoPlayer.play().catch(() => {}); // Play the video
      });
    }

    function createHoverEnterAnimation(selectedWork) {
      const tl = gsap.timeline();

      if (window.screen.width >= 678) {
        tl.to(selectedWork.querySelector(".selected-work-title.main"), {
          translateY: "-100%",
          duration: 0.5,
          ease: "back.out(1.7)",
        })
          .to(
            selectedWork.querySelector(".selected-work-title.desktop"),
            { translateY: "0", duration: 0.6, ease: "back.out(1.7)" },
            "<"
          )
          .fromTo(
            selectedWork.querySelector(".selected-work-underline"),
            { translateX: "-100%" },
            { translateX: 0, duration: 0.5 },
            "<0.1"
          )
          .to(
            selectedWork.querySelectorAll(".selected-work-topic"),
            { translateY: 0, stagger: 0.1, duration: 0.4, ease: "back.out(1)" },
            "<0.1"
          )
          .to(
            selectedWork,
            {
              duration: 0.6,
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(217, 217, 217, 0) 100%)",
            },
            "<0.1"
          );
      }
      return tl;
    }

    function createHoverLeaveAnimation(selectedWork) {
      const tl = gsap.timeline();

      if (window.screen.width >= 678) {
        tl.to(selectedWork.querySelector(".selected-work-title.main"), {
          translateY: "0%",
          duration: 0.6,
          ease: "bounce.out",
        })
          .to(
            selectedWork.querySelector(".selected-work-title.desktop"),
            { translateY: "100%", duration: 0.3 },
            "<"
          )
          .to(
            selectedWork.querySelectorAll(".selected-work-topic"),
            {
              translateY: "120%",
              stagger: 0.1,
              duration: 0.4,
              ease: "bounce.out",
            },
            "<0.1"
          )
          .to(
            selectedWork.querySelector(".selected-work-underline"),
            { translateX: "100%", duration: 0.4 },
            "<0.2"
          )
          .to(
            selectedWork,
            {
              duration: 0.2,
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(217, 217, 217, 0) 100%)",
            },
            "<0.1"
          );
      }
      return tl;
    }
  });

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
});
