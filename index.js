const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

async function main() {
  const html = await request.get("https://codingwithstefan.com/table-example");

  fs.writeFileSync("./test.html", html);
  const $ = cheerio.load(html);
  $("body > table > tbody > tr > td").each((index, element) => {
    console.log($(element).text());
  });
}

main();
