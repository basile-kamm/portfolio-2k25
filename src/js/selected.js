import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", function () {
  const selectedWorks = document.querySelectorAll(".selected-work");
  const selectedTrailers = document.querySelectorAll(".selected-trailer");
  const selectedDetails = document.querySelectorAll(
    ".selected-detail-container"
  );
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");

  const body = document.querySelector("body");

  selectedWorks.forEach((selectedWork) => {
    let hoverAnim = null; // Initialize variable to store animation instance
    const hoverValue = selectedWork.getAttribute("data-selected-value");

    selectedWork.addEventListener("mouseenter", function () {
      hoverAnim = selectedWorkHover(selectedWork);

      selectedTrailers.forEach((trailer) => {
        if (trailer.classList.contains(hoverValue)) {
          gsap.set(trailer, {
            display: "block",
          });
        }
      });
    });

    selectedWork.addEventListener("mouseleave", function () {
      if (hoverAnim) {
        hoverAnim.reverse();

        selectedTrailers.forEach((trailer) => {
          if (trailer.classList.contains(hoverValue)) {
            gsap.set(trailer, {
              display: "none",
            });
          }
        });
      }
    });
    selectedWork.addEventListener("click", function () {
      selectedDetails.forEach((selectedWorkDetail) => {
        if (selectedWorkDetail.classList.contains(hoverValue)) {
          const selectedDetailClose = selectedWorkDetail.querySelector(
            ".selected-detail-close"
          );
          const openDetailAnim = openWorkDetail(
            selectedWorkDetail,
            selectedDetailClose
          );
          selectedDetailClose.onclick = function () {
            openDetailAnim.reverse();
          };
          selectedCloseMap.addEventListener("click", function () {
            openDetailAnim.reverse();
          });
        }
      });
    });
  });

  function openWorkDetail(selectedWorkDetail, selectedDetailClose) {
    const tl = gsap.timeline({
      onReverseComplete: () => {
        tl.set(selectedWorkDetail, { display: "none" });
        body.classList.remove("no-scroll");
      },
    });
    body.classList.add("no-scroll");
    tl.set(selectedWorkDetail, { display: "block" });
    tl.set(selectedDetailClose, { zIndex: 10 });
    tl.set(selectedCloseMap, { display: "block" });
    tl.to(selectedWorkDetail, { translateX: 0 });
    tl.fromTo(
      selectedWorkDetail.querySelectorAll(".open-anim"),
      {
        x: 400,
      },
      {
        x: 0,
        stagger: 0.1,
      },
      "<0.2"
    );
    tl.to(
      selectedCloseMap,
      {
        opacity: 1,
      },
      "<"
    );

    return tl;
  }

  function selectedWorkHover(selectedWork) {
    const tl = gsap.timeline();

    // Scope animations to children of the specific selectedWork
    tl.to(selectedWork.querySelector(".selected-work-title.main"), {
      translateY: "-100%",
      duration: 0.5,
    });
    tl.to(
      selectedWork.querySelector(".selected-work-title.desktop"),
      {
        translateY: "0",
        duration: 0.3,
      },
      "<"
    );
    tl.to(
      selectedWork.querySelectorAll(".selected-work-topic"),
      {
        translateY: 0,
        stagger: 0.1,
        duration: 0.2,
      },
      "<0.1"
    );
    tl.to(
      selectedWork.querySelector(".selected-work-underline"),
      {
        translateY: 0,
        duration: 0.3,
      },
      "<0.2"
    );
    tl.to(
      selectedWork,
      {
        duration: 0.2,
        background:
          "linear-gradient(0deg, rgba(255,255,255, 0.3) 0%, rgba(217, 217, 217, 0) 100%)",
      },
      "<0.1"
    );

    return tl;
  }
});
