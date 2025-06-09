import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function scrapeStockDataBloser() {
  const browser = await puppeteer.launch({ headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
   });
  const page = await browser.newPage();

  await page.goto('https://money.rediff.com/losers/bse/daily/groupb', { waitUntil: 'networkidle2' });

  await page.waitForSelector('.dataTable tbody tr');

  await delay(2000); // wait 2 seconds

  const stockData = await page.evaluate(() => {
    const rows = document.querySelectorAll('.dataTable tbody tr');
    const data = [];

    rows.forEach(row => {
      const companyAnchor = row.querySelector('td a');
      const group = row.children[1]?.textContent.trim();
      const percentChange = row.children[4]?.textContent.trim();
      const company = companyAnchor?.textContent.trim();

      if (company && group && percentChange) {
        data.push({ company, group, percentChange });
      }
    });

    return data;
  });

  console.log(stockData);

  // Convert to CSV format
  const csvHeader = 'Company,Group,Change\n';
  const csvRows = stockData.map(item =>
    `"${item.company}","${item.group}","${item.percentChange}"`
  );
  const csvContent = csvHeader + csvRows.join('\n');

  // Save to file
  const filePath = path.join('./', 'dailyloserB.csv');
  fs.writeFileSync(filePath, csvContent, 'utf8');
  console.log(`\n✅ CSV saved at ${filePath}`);

  await browser.close();
}


