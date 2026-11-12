// Sass config (replaces .sassrc, JS to know if we're in dev).
// In dev, responsive-bg() (scss/_var.scss) uses the original image instead of
// generating AVIF/WebP variants, like html-modules/picture.html (.posthtmlrc.js).
module.exports = {
  includePaths: ["src", "node_modules"],
  data: `$is-dev: ${process.env.NODE_ENV !== "production"};`,
};
