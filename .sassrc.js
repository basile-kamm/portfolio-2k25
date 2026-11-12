// Sass config (replaces .sassrc, JS to know if we're in dev).
// In dev, responsive-bg() (scss/_var.scss) uses the original image instead of
// generating AVIF/WebP variants, like html-modules/picture.html (.posthtmlrc.js).
module.exports = {
  includePaths: ["src", "node_modules"],
  // Bootstrap (node_modules) uses Sass features deprecated in Dart Sass 1.8x+:
  // hide its warnings, ours stay visible
  quietDeps: true,
  // Parcel's Sass transformer still calls the legacy JS API: not our code
  silenceDeprecations: ["legacy-js-api"],
  data: `$is-dev: ${process.env.NODE_ENV !== "production"};`,
};
