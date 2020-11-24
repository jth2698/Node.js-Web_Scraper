const puppet = require("puppeteer");
const cheerio = require("cheerio");
const { initParams } = require("request-promise");
const mongoose = require("mongoose");
const Listing = require("./model/Listing");

require("dotenv").config();

// const scrapingResults = [
//   {
//     title: "Entry Level Software Engineer - C or C++",
//     datePosted: new Date("2020-07-26-12:00:00"),
//     neighborhood: "(palo alto)",
//     url: "",
//     jobDescription: "lorem ipsum",
//     compensation: "Up to US$0.00 per year",
//   },
// ];

async function connectToMongoDB() {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log("You have successfully connected to MongoDB!!");
}

async function scrapeListings(page) {
  await page.goto(
    "https://sfbay.craigslist.org/d/sorftware-ga-dba-etc/search/sof"
  );

  const html = await page.content();
  const $ = cheerio.load(html);

  const listings = $(".result-info")
    .map((index, element) => {
      const titleEl = $(element).find(".result-title");
      const timeEl = $(element).find(".result-date");
      const hoodEl = $(element).find(".result-hood");
      const title = $(titleEl).text();
      const datePosted = new Date($(timeEl).attr("datetime"));
      const url = $(titleEl).attr("href");
      const hood = $(hoodEl).text().trim().replace("(", "").replace(")", "");
      return { title, datePosted, hood, url };
    })
    .get();

  return listings;
}

async function scrapeJobDescriptions(listings, page) {
  for (let i = 0; i < listings.length; i++) {
    await page.goto(listings[i].url);
    const html = await page.content();
    const $ = cheerio.load(html);
    const jobDescription = $("#postingbody").text();
    const compensation = $("p.attrgroup > span:nth-child(1) > b").text();
    listings[i].jobdescription = jobDescription;
    listings[i].compensation = compensation;
    const listingModel = new Listing(listings[i]);
    await listingModel.save();
    await sleep(1000);
  }
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
  await connectToMongoDB();
  const browser = await puppet.launch({ headless: false });
  const page = await browser.newPage();
  const listings = await scrapeListings(page);
  const jobDescrips = await scrapeJobDescriptions(listings, page);
}

init();
