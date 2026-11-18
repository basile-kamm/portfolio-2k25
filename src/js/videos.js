// Self-hosted project videos (WebM VP9/Opus) with a Vimeo fallback.
//
// Markup: <video src="…webm" data-fallback="https://player.vimeo.com/…">
//  - data-autoplay: muted background loop, played only while on screen
//    (preload="none" means nothing is downloaded before that)
//  - without it: regular player with controls, started by the user
//
// If the browser can't play WebM VP9/Opus (Safari < 15, some older iOS), or the
// file fails to load, the <video> is swapped for the original Vimeo iframe.

const WEBM_TYPE = 'video/webm; codecs="vp9, opus"';

document.addEventListener("DOMContentLoaded", () => {
  // Every self-hosted video; the Vimeo fallback is optional (some trailers
  // only exist as WebM)
  const videos = [...document.querySelectorAll("video")];
  if (videos.length === 0) return;

  const withFallback = videos.filter((video) => video.dataset.fallback);
  const canPlayWebm = document.createElement("video").canPlayType(WEBM_TYPE) !== "";

  if (!canPlayWebm) withFallback.forEach(swapToIframe);

  withFallback.forEach((video) => {
    video.addEventListener("error", () => swapToIframe(video), { once: true });
  });

  // Play background loops only while they're visible (hidden trailers are
  // display:none, so they never intersect until hovered)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (!video.isConnected) return;
        if (isIntersecting) {
          video.play().catch(() => {}); // Autoplay can be refused, keep quiet
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: "200px" }
  );

  videos
    .filter((video) => video.hasAttribute("data-autoplay"))
    .forEach((video) => observer.observe(video));
});

function swapToIframe(video) {
  if (!video.isConnected) return;

  const iframe = document.createElement("iframe");
  iframe.src = video.dataset.fallback;
  if (video.className) iframe.className = video.className;
  iframe.title = "vimeo-player";
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
  iframe.setAttribute("allowfullscreen", "");

  // Stop any pending download of the WebM before removing it
  video.pause();
  video.removeAttribute("src");
  video.load();

  video.replaceWith(iframe);
}

// Start a video (optionally from its first frame) and resolve once it has a
// frame to display. Resolves right away for anything that isn't a native
// <video> (e.g. the Vimeo fallback iframe), so callers never wait on those.
export function playWhenReady(el, { restart = false } = {}) {
  if (!(el instanceof HTMLVideoElement)) return Promise.resolve();

  const ready = new Promise((resolve) => {
    const done = () => {
      el.removeEventListener("loadeddata", onData);
      el.removeEventListener("seeked", onData);
      el.removeEventListener("error", done);
      resolve();
    };
    const onData = () => {
      if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !el.seeking) done();
    };
    el.addEventListener("loadeddata", onData);
    el.addEventListener("seeked", onData);
    el.addEventListener("error", done); // videos.js swaps it for the iframe
  });

  if (restart && el.currentTime !== 0) el.currentTime = 0;
  el.play().catch(() => {});

  // Already has a frame (and no seek pending): nothing to wait for
  if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !el.seeking) {
    return Promise.resolve();
  }
  return ready;
}

// Pause every self-hosted video inside an element (e.g. a closed project detail)
export function pauseVideosIn(element) {
  if (!element) return;
  element.querySelectorAll("video").forEach((video) => video.pause());
}
