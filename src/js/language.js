const userLang = navigator.language || navigator.userLanguage;
if (userLang.startsWith("fr")) {
  window.location.href = "fr/index.html";
} else {
  window.location.href = "en/index.html";
}
