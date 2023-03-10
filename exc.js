const puppeteer = require('puppeteer');

const csv = require('csv-parser');
const fs = require('fs');

const urls = [];

// Read URLs from CSV file
fs.createReadStream('cental_india_short.csv')
  .pipe(csv())
  .on('data', row => {
    urls.push(row.url);
  })
  .on('end', async () => {

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = (await browser.pages())[0];
    const website_url = 'https://news.google.com/rss/articles/CBMiT2h0dHBzOi8vbGlmZXN0eWxlLmlucXVpcmVyLm5ldC8zMTE3MDYvYnJhemlsaWFuLWVtYmFzc3ktbWFya3MtaW5kZXBlbmRlbmNlLWRheS_SAVNodHRwczovL2xpZmVzdHlsZS5pbnF1aXJlci5uZXQvMzExNzA2L2JyYXppbGlhbi1lbWJhc3N5LW1hcmtzLWluZGVwZW5kZW5jZS1kYXkvYW1wLw?oc=5'
for (const url of urls) {
      await page.goto(url);
      const extractedText = await page.$eval('*', (el) => el.innerText);
      console.log(extractedText);
      fs.writeFileSync('file.txt', extractedText);
    }

    await browser.close();
})();
});