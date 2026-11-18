import gsap from "gsap";

document.addEventListener("DOMContentLoaded", function () {
  const creditsCta = document.querySelector(".credits");
  const creditsCont = document.querySelector(".credits-container");
  const selectedCloseMap = document.querySelector(".selected-detail-close-map");
  const creditsClose = document.querySelector(".credits-close");

  // Credits only exist on the homepage
  if (!creditsCta || !creditsCont) return;

  let openCreditsAnim = null;

  function closeCredits() {
    // The close map is shared with the project details: only act if the
    // credits are actually open
    if (!openCreditsAnim) return;
    openCreditsAnim.reverse();
    openCreditsAnim = null;
  }

  creditsCta.addEventListener("click", function () {
    openCreditsAnim = openCredits(); // Create the animation instance
  });

  if (creditsClose) creditsClose.addEventListener("click", closeCredits);
  if (selectedCloseMap) selectedCloseMap.addEventListener("click", closeCredits);
  // Escape closes the credits (no-op when they aren't open)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCredits();
  });

  function openCredits() {
    const tl = gsap.timeline({
      onReverseComplete: () => {
        gsap.set(creditsCont, { display: "none" });
        if (selectedCloseMap) gsap.set(selectedCloseMap, { display: "none" });
      },
    });

    tl.set(creditsCont, { display: "block" });
    if (selectedCloseMap) tl.set(selectedCloseMap, { display: "block" });
    tl.to(creditsCont, { translateY: 0, duration: 0.5 });

    return tl;
  }
});
