// posthtml config. JS (not JSON) to know if we're in dev:
// `npm run dev` skips the AVIF/WebP generation of html-modules/picture.html,
// which made the dev server take minutes to start.
const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  plugins: {
    "posthtml-include": {
      root: "src",
      raw: true,
      posthtmlExpressionsOptions: {
        removeScriptLocals: true,
        locals: { isDev },
      },
    },
    "posthtml-expressions": {
      removeScriptLocals: true,
      locals: { isDev },
    },
    "posthtml-extend": {
      root: "src",
      strict: false,
      expressions: { locals: { isDev } }, // used by the loader in base-layout.html
    },
  },
};
