import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", function () {
  const selectedWorks = document.querySelectorAll(".selected-work");
  const selectedTrailers = document.querySelectorAll(".selected-trailer");
  console.log("Selected works:", selectedWorks);

  selectedWorks.forEach((selectedWork) => {
    let hoverAnim = null; // Initialize variable to store animation instance
    const hoverValue = selectedWork.getAttribute("data-selected-value");

    selectedWork.addEventListener("mouseenter", function () {
      console.log(hoverValue);
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
  });

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
