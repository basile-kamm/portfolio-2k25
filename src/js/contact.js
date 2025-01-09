import gsap from "gsap";

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".contact-slide");
  let currentSlide = 0;

  console.log("ye");
  function hideSlide(index) {
    const tl = gsap.timeline();
    // Set the z-index of the current slide to the highest
    tl.set(slides[index], { zIndex: 2 });

    // Animate the clip-path of the current slide to create a shrinking effect
    tl.to(slides[index], {
      clipPath:
        "polygon(20% 100%, 20% 0, 40% 0, 40% 0, 60% 0, 60% 0, 80% 0, 80% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
      duration: 1,
    });
    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 0, 40% 100%, 40% 0, 60% 0, 60% 0, 80% 0, 80% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
        duration: 1,
      },
      "<0.3"
    );
    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 0, 40% 100%, 40% 0, 60% 100%, 60% 0, 80% 0, 80% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
        duration: 1,
      },
      "<0.3"
    );
    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 0, 40% 100%, 40% 0, 60% 100%, 60% 0, 80% 100%, 80% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
        duration: 1,
      },
      "<0.3"
    );

    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 0, 40% 100%, 40% 0, 60% 100%, 60% 0, 80% 100%, 80% 0, 100% 100%, 100% 100%, 0 100%, 0 100%)",
        duration: 1,
      },
      "<0.3"
    );
    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 100%, 40% 100%, 40% 0, 60% 100%, 60% 0, 80% 100%, 80% 0, 100% 100%, 100% 100%, 0 100%, 0 100%)",
        duration: 1,
      },
      "<0.3"
    );
    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 100%, 40% 100%, 40% 100%, 60% 100%, 60% 0, 80% 100%, 80% 0, 100% 100%, 100% 100%, 0 100%, 0 100%)",
        duration: 1,
      },
      "<0.3"
    );
    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 100%, 40% 100%, 40% 100%, 60% 100%, 60% 100%, 80% 100%, 80% 0, 100% 100%, 100% 100%, 0 100%, 0 100%)",
        duration: 1,
      },
      "<0.3"
    );
    tl.to(
      slides[index],
      {
        clipPath:
          "polygon(20% 100%, 20% 100%, 40% 100%, 40% 100%, 60% 100%, 60% 100%, 80% 100%, 80% 100%, 100% 100%, 100% 100%, 0 100%, 0 100%)",
        duration: 1,
      },
      "<0.3"
    );

    // Final stage of the clip-path animation to completely hide it
    // tl.to(slides[index], {
    //   clipPath:
    //     "polygon(20% 100%, 20% 100%, 40% 100%, 40% 100%, 60% 100%, 60% 100%, 80% 100%, 80% 100%, 100% 100%, 100% 100%, 0 100%, 0 100%)",
    //   duration: 1.5,
    //   ease: "power2.inOut",
    // });

    // After hiding, reset zIndex and opacity for the current slide
    tl.set(slides[index], { zIndex: 0, opacity: 0 });
  }

  function showSlide(index) {
    // Reset clip-path and opacity, and bring the slide forward with zIndex
    gsap.set(slides[index], {
      clipPath:
        "polygon(20% 0, 20% 0, 40% 0, 40% 0, 60% 0, 60% 0, 80% 0, 80% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
      opacity: 1,
      zIndex: 1,
    });
  }

  function showNextSlide() {
    // Get the next slide index dynamically
    let nextSlide = (currentSlide + 1) % slides.length;

    // Hide the current slide with the animation
    hideSlide(currentSlide);

    showSlide(nextSlide);
    // Update currentSlide to the next slide
    currentSlide = nextSlide;

    // Show the next slide
  }

  // Initial display of the first slide
  showSlide(currentSlide);

  // Change slide every 6 seconds
  setInterval(showNextSlide, 4000);

  const contactCta = document.querySelector(".contact-cta");
  const contactCtaEl = document.querySelectorAll(".contact-cta b");

  let hoverAnim;

  contactCta.addEventListener("mouseenter", function () {
    hoverAnim = HoverCta();
  });
  contactCta.addEventListener("mouseleave", function () {
    hoverAnim.reverse();
  });

  function HoverCta() {
    const tl = gsap.timeline();

    tl.to(contactCtaEl, {
      color: "rgba(255,255,255, 1)",
      stagger: 0.02,
    });
    tl.to(
      ".contact-underline",
      {
        background: "rgba(255,255,255, 1)",
        duration: 0.4,
      },
      "<0.1"
    );

    return tl;
  }
});
