const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

async function main() {
  const html = await request.get("https://codingwithstefan.com/table-example");

  fs.writeFileSync("./test.html", html);
  const $ = cheerio.load(html);
  const scrapedRows = [];
  $("body > table > tbody > tr").each((index, element) => {
    const tds = $(element).find("td");
    const company = $(tds[0]).text();
    const contact = $(tds[1]).text();
    const country = $(tds[2]).text();
    const tableInfo = {
      company,
      contact,
      country,
    };
    scrapedRows.push(tableInfo);
  });

  console.log(scrapedRows);
}

main();
