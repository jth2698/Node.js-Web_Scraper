const request = require("request-promise");
const fs = require("fs");
const cheerio = require("cheerio");

async function main() {
  const html = await request.get("https://codingwithstefan.com/table-example");

  fs.writeFileSync("./test.html", html);
  const $ = cheerio.load(html);
  const scrapedRows = [];
  const tableHeader = [];
  $("body > table > tbody > tr").each((index, element) => {
    if (index === 0) {
      const tblhdrs = $(element).find("th");
      tblhdrs.each((index, element) => {
        tableHeader.push($(element).text().toLowerCase());
      });
      return true;
    }
    const tds = $(element).find("td");
    const tableRow = {};
    tds.each((index, element) => {
      tableRow[tableHeader[index]] = $(element).text();
    });
    scrapedRows.push(tableRow);
  });

  console.log(scrapedRows);
}

main();
