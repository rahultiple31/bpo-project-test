const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "dist/index.html",
  "dist/assets/css/styles.css",
  "dist/assets/js/main.js",
];

const fail = (message) => {
  console.error(message);
  process.exitCode = 1;
};

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

const index = fs.readFileSync(path.join(root, "dist", "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "dist", "assets", "css", "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "dist", "assets", "js", "main.js"), "utf8");

if (!index.includes('href="assets/css/styles.css"')) {
  fail("Built index.html does not reference the CSS bundle.");
}

if (!index.includes('src="assets/js/main.js"')) {
  fail("Built index.html does not reference the JS bundle.");
}

if (!css.includes(":root") || !css.includes(".hero")) {
  fail("Built CSS does not contain expected site styles.");
}

if (!js.includes("addEventListener") || !js.includes("FormData")) {
  fail("Built JS does not contain expected interactions.");
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("Static build checks passed.");
