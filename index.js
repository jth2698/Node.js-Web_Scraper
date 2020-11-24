const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

async function main() {
  const html = await request.get(
    "https://reactnativetutorial.net/css-selectors/lesson3.html"
  );

  fs.writeFileSync("./test.html", html);
  const $ = await cheerio.load(html);
  const red = $("#red").text()
    console.log(red);
}

main();
