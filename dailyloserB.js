import axios from 'axios';
import * as cheerio from 'cheerio';
import { createObjectCsvWriter } from 'csv-writer';

const url = 'https://money.rediff.com/losers/bse/daily/groupb';

export async function scrapeStockDataBloser() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results = [];

    $('table.dataTable tbody tr').each((index, element) => {
      const company = $(element).find('td:nth-child(1)').text().trim();
      const group = $(element).find('td:nth-child(2)').text().trim();
      const change = $(element).find('td:nth-child(5)').text().trim();

      results.push({ company, group, change });
    });

    const csvWriter = createObjectCsvWriter({
      path: 'dailyloserB.csv',
      header: [
        { id: 'company', title: 'Company' },
        { id: 'group', title: 'Group' },
        { id: 'change', title: 'Change' },
      ]
    });

    await csvWriter.writeRecords(results);
    console.log('✅ CSV saved as "dailyloserB.csv"');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}




