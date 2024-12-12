import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", function () {
  const selectedWorks = document.querySelectorAll(".selected-work");

  selectedWorks.forEach((selectedWork) => {
    let hoverAnim = null; // Initialize variable to store animation instance

    selectedWork.addEventListener("mouseenter", function () {
      console.log("Mouse entered:", selectedWork);
      hoverAnim = selectedWorkHover(selectedWork);
    });

    selectedWork.addEventListener("mouseleave", function () {
      if (hoverAnim) {
        hoverAnim.reverse();
      }
    });
  });

  function selectedWorkHover() {
    const tl = gsap.timeline();

    tl.to(".selected-work-title.main", {
      translateY: "-100%",
      duration: 0.5,
    });
    tl.to(
      ".selected-work-title.desktop",
      {
        translateY: "0",
        duration: 0.3,
      },
      "<"
    );
    tl.to(
      ".selected-work-topic",
      {
        translateY: 0,
        stagger: 0.1,
        duration: 0.2,
      },
      "<0.1"
    );
    tl.to(
      ".selected-work-underline",
      {
        translateY: 0,
        duration: 0.3,
      },
      "<0.2"
    );
    tl.to(
      ".selected-work",
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
