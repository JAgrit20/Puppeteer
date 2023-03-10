const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const urls = [];

// Read URLs from CSV file
fs.createReadStream('cental_india_short.csv')
  .pipe(csv())
  .on('data', row => {
    urls.push(row.url);
  })
  .on('end', async () => {

    const csvWriter = createCsvWriter({
      path: 'output.csv',
      header: [
        { id: 'url', title: 'URL' },
        { id: 'text', title: 'Extracted Text' },
      ]
    });

    const browser = await puppeteer.launch({
        headless: true
    });

    const page = (await browser.pages())[0];

    // Loop through each URL and extract text
    for (const url of urls) {
      await page.goto(url);

      const extractedText = await page.$eval('*', (el) => el.innerText);

      console.log(`Extracted text for ${url}: ${extractedText}`);

      // Write extracted text to new CSV file
      const record = { url, text: extractedText };
      await csvWriter.writeRecords([record]);
    }

    await browser.close();

    console.log('Done!');
  });
