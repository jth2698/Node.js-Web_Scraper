const puppet = require("puppeteer");
const cheerio = require("cheerio");

const scrapingResults = [
  {
    title: "Entry Level Software Engineer - C or C++",
    datePosted: new Date("2020-07-26-12:00:00"),
    neighborhood: "(palo alto)",
    url: "",
    jobDescription: "lorem ipsum",
    compensation: "Up to US$0.00 per year",
  },
];

async function main() {
  const browser = await puppet.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://sfbay.craigslist.org/d/sorftware-ga-dba-etc/search/sof"
  );

  const html = await page.content();
  const $ = cheerio.load(html);

  $(".result-title").each((index, element) => {
    console.log($(element).text());
  });
}

main();
