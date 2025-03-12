import gsap from "gsap";

gsap.to(".loader-text-container", {
  opacity: 1,
  duration: 0.5,
  stagger: 0.3,
});

let loadedAnim;
let loaderState;
const loader = document.querySelector(".loader-container");

// console.log(loaderState);
addLoaderElem();

window.addEventListener("load", () => {
  setTimeout(() => {
    loadedAnim = loadedAnimTl();
    // Optional delay for smoother experience
  }, 500);

  loader.addEventListener("transitionend", () => {
    loaderState = "transitioned";
    loader.remove();
  });
});

function addLoaderElem() {
  let texts;
  if (loader.classList.contains("fr")) {
    texts = [
      "Bienvenue sur",
      "le portfolio",
      "de Basile Kamm",
      "de Basile Kamm",
    ];
  } else {
    texts = ["Welcome to", "Basile Kamm's", "Basile Kamm's", "Portfolio"];
  }
  // console.log(texts);

  addInterval = setInterval(() => {
    if (loaderState != "transitioned") {
      const newElem = document.createElement("p");
      newElem.classList.add("loader-elem");
      newElem.textContent = texts[Math.floor(Math.random() * texts.length)];
      loader.appendChild(newElem);

      gsap.set(newElem, {
        x: "random(0, 90, 1)vw",
        y: "random(0, 90, 1)vh",
        scale: "random(0.7, 1.3, 0.1)",
        color: (function () {
          let m =
            "#" +
            Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0") +
            Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0") +
            Math.floor(Math.random() * 256)
              .toString(16)
              .padStart(2, "0");

          // console.log(m);
          return m;
        })(),
      });
      // console.log(loaderState);
    } else {
      clearInterval(addInterval);
      // console.log("interval has been cleared");
    }
  }, 100);
}

function loadedAnimTl() {
  const tl = gsap.timeline();
  const parallaxCont = document.querySelector(".parallax-container");

  tl.to(loader, {
    translateY: "-100%",
    duration: 1,
    ease: "power2.inOut",
  });

  if (parallaxCont) {
    tl.from(
      ".banner-title-letter",
      {
        y: 200,
        stagger: 0.05,
      },
      ">0.5"
    );
    tl.from(
      ".banner-title",
      {
        skewY: 30,
        y: 30,
        duration: 1,
      },
      "<"
    );
    tl.from(
      ".banner-texts > *",
      {
        x: 500,
        stagger: 0.4,
        duration: 1.5,
      },
      "<"
    );
    tl.from(
      "header",
      {
        translateY: "-100%",
        duration: 1,
      },
      "<1"
    );
  } else {
    console.log("paralax not");
  }
}
