import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The loader leaves as soon as the page has loaded, but stays at least this
// long (counted from the start of the navigation) so it never just flashes
const LOADER_MIN_DURATION = 2000; // ms
// Extra wait on the homepage once loaded, so the banner is ready when revealed
const HOMEPAGE_LOADER_DELAY = 200; // ms

let loadedAnim;
let loaderState;
const loader = document.querySelector(".loader-container");

if (loader) {
  // Block scrolling while the loader covers the page
  document.body.classList.add("no-scroll");

  addLoaderElem();

  const hideLoader = () => {
    // performance.now() = time elapsed since the navigation started
    const remaining = Math.max(0, LOADER_MIN_DURATION - performance.now());
    const isHomepage = document.querySelector(".parallax-container");
    const delay = isHomepage ? remaining + HOMEPAGE_LOADER_DELAY : remaining;
    setTimeout(() => {
      loadedAnim = loadedAnimTl();
    }, delay);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }
}

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

  const addInterval = setInterval(() => {
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
    onComplete: () => {
      // Loader is gone: stop adding texts, remove it, allow scrolling again
      // and let ScrollTrigger re-measure
      loaderState = "transitioned";
      loader.remove();
      document.body.classList.remove("no-scroll");
      ScrollTrigger.refresh();
    },
  });

  if (parallaxCont) {
    tl.from(
      ".banner-title-letter",
      {
        y: 200,
        opacity: 0,
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
  }
}
