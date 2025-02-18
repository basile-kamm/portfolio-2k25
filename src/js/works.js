import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

console.log("js loaded");

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".works-item");
  const radioButtons = document.querySelectorAll('input[name="filter"]');
  const selectedDetails = document.querySelectorAll(
    ".selected-detail-container"
  );

  const selectedDetailClose = document.querySelector(".selected-detail-close");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");
  const body = document.querySelector("body");

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      cards.forEach((card) => {
        if (card.classList.contains(radio.value)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  cards.forEach((card) => {
    const itemValue = card.getAttribute("data-works-item-value");

    card.addEventListener("click", function () {
      console.log(itemValue);
      selectedDetails.forEach((selectedWorkDetail) => {
        if (selectedWorkDetail.classList.contains(itemValue)) {
          const openDetailAnim = openWorkDetail(
            selectedWorkDetail,
            selectedDetailClose
          );
          // const selectedTitleContainer = document.querySelector(
          //   ".selected-detail-title-container"
          // );
          // const selectedTitle = document.querySelector(
          //   ".selected-detail-title"
          // );
          // let fontSize = 10;
          // while (
          //   selectedTitleContainer.clientWidth < selectedWorkDetail.innerWidth
          // ) {
          //   fontSize += 1;
          //   selectedTitle.style.fontSize = fontSize + "wv";
          // }
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
        gsap.set(selectedWorkDetail, { display: "none" });
        body.classList.remove("no-scroll");
      },
    });
    body.classList.add("no-scroll");
    tl.set(selectedWorkDetail, { display: "block" });
    tl.set(selectedCloseMap, { display: "block" });
    tl.to(selectedWorkDetail, { translateX: 0 });
    tl.fromTo(
      selectedWorkDetail.querySelectorAll(".open-anim"),
      { x: 600 },
      { x: 0, stagger: 0.1 },
      "<"
    );
    tl.to(selectedDetailClose, { x: 0 }, "<");
    tl.to(selectedCloseMap, { opacity: 1 }, "<");

    return tl;
  }

  // works section horizontal scroll
  {
    const process = document.querySelector(".process");
    if (typeof process != "undefined" && process != null) {
      let sections = gsap.utils.toArray(".process__item");
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: process,
          markers: false,
          scrub: 1,
          pin: true,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + document.querySelector(".process").offsetWidth,
        },
      });
    }
  }
});
