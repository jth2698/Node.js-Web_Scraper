const puppet = require("puppeteer");
const cheerio = require("cheerio");
const { initParams } = require("request-promise");
const mongoose = require("mongoose");
const Contract = require("./model/Contract");

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
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/contractDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log("You have successfully connected to MongoDB!!");
}

async function scrapeContract(page) {
  await page.goto(
    "https://www.sec.gov/Archives/edgar/data/1011006/000089161808000399/f42710exv10w19.htm"
  );

  const html = await page.content();
  const $ = cheerio.load(html);

  const contractParts = $("DIV")
    .map((index, element) => {
      const title = $(element).find("DIV[align='center']");
      const clause = $(element).find("DIV[align ='left']");
      return { title, clause };
    })
    .get();

  for (let i = 0; i < contractParts.length; i++) {
    const contractModel = new Contract(contractParts[i]);
    await contractModel.save();
    await sleep(1000);
  }
}

// async function uploadContractParts(contractParts) {
//   for (let i = 0; i < contractParts.length; i++) {
//     // await page.goto(listings[i].url);
//     // const html = await page.content();
//     // const $ = cheerio.load(html);
//     // const jobDescription = $("#postingbody").text();
//     // const compensation = $("p.attrgroup > span:nth-child(1) > b").text();
//     contractParts[i].title = title;
//     contractParts[i].clause = clause;
//     const contractModel = new Contract(contractParts[i]);
//     await contractModel.save();
//     await sleep(1000);
//   }
// }

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
  await connectToMongoDB();
  const browser = await puppet.launch({ headless: false });
  const page = await browser.newPage();
  scrapeContract(page);
  // const uploadContractParts = await uploadContractParts(contractParts);
}

init();
