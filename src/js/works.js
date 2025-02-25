import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import "./loader";

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
          // let fontSize = 100;
          // console.log(
          //   selectedTitleContainer.clientWidth,
          //   selectedWorkDetail.innerWidth
          // );
          // while (
          //   selectedTitleContainer.clientWidth > selectedWorkDetail.innerWidth
          // ) {
          //   console.log(selectedTitleContainer.clientWidth);
          //   fontSize -= 1;
          //   selectedTitle.style.fontSize = fontSize + "px";
          // }
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
  // {
  //   const process = document.querySelector(".works-display");
  //   if (typeof process != "undefined" && process != null) {
  //     let sections = gsap.utils.toArray(".works-display-row");
  //     gsap.to(sections, {
  //       xPercent: -100 * (sections.length - 1),
  //       ease: "none",
  //       scrollTrigger: {
  //         trigger: process,
  //         markers: false,
  //         scrub: 1,
  //         pin: true,
  //         snap: 1 / (sections.length - 1),
  //         end: () =>
  //           "+=" + document.querySelector(".works-display-row").offsetWidth,
  //       },
  //     });
  //   }
  // }

  const worksContainer = document.querySelector(".works-display"); // Section where pinning starts
  const worksRows = document.querySelectorAll(".works-display-row");

  let maxScrollDistance = 0;

  worksRows.forEach((worksRow) => {
    const rowWidth = worksRow.scrollWidth;
    maxScrollDistance = Math.max(maxScrollDistance, rowWidth);
  });

  // Create a scrollable space so the animation has enough room to happen
  gsap.set("body", { height: `${maxScrollDistance + window.innerHeight}px` });

  // Pin the entire page when reaching .works-display
  ScrollTrigger.create({
    trigger: worksContainer,
    start: "bottom bottom",
    end: `+=${maxScrollDistance}`, // Scroll duration based on the longest row
    pin: true,
    scrub: 1,
    onEnter: () => {
      console.log("worked");
      // document.querySelector("body").classList.add("no-scroll");
    },
  });

  // Animate each row at its own speed, moving 50px further
  worksRows.forEach((worksRow) => {
    gsap.to(worksRow, {
      x: () => `-${worksRow.scrollWidth - window.innerWidth + 30}px`,
      ease: "none",
      scrollTrigger: {
        trigger: worksContainer, // Tie movement to the pinned section
        start: "bottom bottom",
        end: `+=${maxScrollDistance}`,
        scrub: 1,
      },
    });
  });
});
