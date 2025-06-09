import fs from 'fs';
import csv from 'csv-parser';

function getStockandNameFromCSV() {
  return new Promise((resolve, reject) => {
    const stocks = [];

    fs.createReadStream('combined_gain.csv')
      .pipe(csv())
      .on('data', (row) => {
        const name = row['Company'] || Object.values(row)[1];
        const change = row['Change'] || Object.values(row)[3];

        if (name && change) {
          stocks.push({ stockName: name.trim(),changePercent: change.trim() });
        
        }
    
      })
      .on('end', () => {
        resolve(stocks);
      })
      .on('error', (error) => {
        reject(error);
      });
    
  });
}

export { getStockandNameFromCSV };