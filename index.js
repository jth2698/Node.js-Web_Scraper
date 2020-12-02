const puppet = require("puppeteer");
const cheerio = require("cheerio");
const { initParams } = require("request-promise");

async function scrapeContract(page) {
    await page.goto(
        "https://www.sec.gov/Archives/edgar/data/1011006/000089161808000399/f42710exv10w19.htm"
    );

    const html = await page.content();
    const $ = cheerio.load(html);

    const contratParts = $("div")
        .map((index, element) => {
            if (index <= 200) {
                element.children.forEach((child, i) => {
                    if (child.data !== undefined) {
                        let data = child.data.trim();
                        if (data.length > 1) {
                            console.log(
                                `div: ${index}, child: ${i} : ${data}`
                            );
                            if (data.children) {
                                data.children.forEach((subChild, subI) => {
                                    if (subchild.data !== undefined) {
                                        let childData = subChild.data.trim();
                                        if (childData.length > 1) {
                                            console.log(
                                                `div: ${index}, child: ${i}, subChild: ${subI} : ${childData}`
                                            );
                                        }
                                    }
                                })
                            }
                        }
                    }
                });
            }
        })
        .get();



    // for (let i = 0; i < contractParts.length; i++) {
    //     const contractModel = new Contract(contractParts[i]);
    //     await contractModel.save();
    //     await sleep(1000);
}

async function init() {
    // await connectToMongoDB();
    const browser = await puppet.launch({ headless: false });
    const page = await browser.newPage();
    scrapeContract(page);
    // const uploadContractParts = await uploadContractParts(contractParts);
}

init();