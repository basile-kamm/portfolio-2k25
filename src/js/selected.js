import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", function () {
  const selectedWorks = document.querySelectorAll(".selected-work");
  const selectedTrailers = document.querySelectorAll(".selected-trailer");
  const selectedDetails = document.querySelectorAll(
    ".selected-detail-container"
  );
  const selectedDetailClose = document.querySelector(".selected-detail-close");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");

  const body = document.querySelector("body");

  selectedWorks.forEach((selectedWork) => {
    let hoverEnterAnim = null;
    let hoverLeaveAnim = null;
    let hoverGlitch = null;
    const hoverValue = selectedWork.getAttribute("data-selected-value");

    selectedWork.addEventListener("mouseenter", function () {
      // Kill the leave animation if it's running
      if (hoverLeaveAnim) {
        hoverLeaveAnim.kill();
        hoverLeaveAnim = null;
      }

      // Create and play the enter animation
      hoverEnterAnim = createHoverEnterAnimation(selectedWork);
      hoverGlitch = hoverGlitchAnim();

      // Show the related trailer
      selectedTrailers.forEach((trailer) => {
        if (trailer.classList.contains(hoverValue)) {
          gsap.set(trailer, { display: "block" });
        }
      });
    });

    selectedWork.addEventListener("mouseleave", function () {
      // Kill the enter animation if it's running
      // console.log("Mouse leave");
      if (hoverEnterAnim) {
        hoverEnterAnim.kill();
        hoverEnterAnim = null;
      }
      if (hoverGlitch) {
        hoverGlitch.restart();
      } else {
        hoverGlitch = hoverGlitchAnim();
      }

      // Create and play the leave animation
      const hoverLeaveAnim = createHoverLeaveAnimation(selectedWork);

      hoverLeaveAnim.eventCallback("onComplete", () => {
        selectedTrailers.forEach((trailer) => {
          if (trailer.classList.contains(hoverValue)) {
            gsap.set(trailer, { display: "none" });
          }
        });
      });
      // Hide the related trailer after the animation completes
    });

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

    function playVimeoVideos() {
      const iframes = document.querySelectorAll(".selected-trailer-js");

      iframes.forEach((iframe) => {
        const vimeoPlayer = new Vimeo.Player(iframe);
        vimeoPlayer.play(); // Play the video
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

    function hoverGlitchAnim() {
      const tl = gsap.timeline();

      tl.to(".selected-trailer-glitch", {
        opacity: 1,
        duration: 0.3,
      });
      tl.to(
        ".selected-trailer-glitch",
        {
          opacity: 0,
          duration: 0.3,
        },
        "0.7"
      );
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
    tl.set(selectedCloseMap, { display: "block" });
    tl.to(selectedWorkDetail, { translateY: 0, translateX: 0 });
    tl.fromTo(
      selectedWorkDetail.querySelectorAll(".open-anim"),
      { x: 600 },
      { x: 0, stagger: 0.1 },
      "<"
    );
    tl.to(
      selectedDetailClose,
      {
        translateY: 0,
        translateX: 0,
      },
      "<"
    );
    tl.to(selectedCloseMap, { opacity: 1 }, "<");

    return tl;
  }
});
