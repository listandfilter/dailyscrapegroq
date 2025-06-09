import fs from 'fs/promises';
import path from 'path';

function parsePercent(percentStr) {
  return parseFloat(percentStr.replace('+', '').replace('%', '').trim());
}

export async function filterCSV(inputPath, outputPath) {
  try {
    const content = await fs.readFile(inputPath, 'utf8');
    const lines = content.trim().split('\n');
    const header = lines[0];
    const filteredRows = [header];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      const parts = row.split(',');

      const percentChangeRaw = parts[2]?.replace(/"/g, '');
      const percentChange = parsePercent(percentChangeRaw);

      if (percentChange > 7) {
        filteredRows.push(row);
      }
    }

    await fs.writeFile(outputPath, filteredRows.join('\n'), 'utf8');
    console.log(`✅ Filtered CSV saved to: ${outputPath}`);
  } catch (err) {
    console.error('❌ Error filtering CSV:', err);
    throw err;
  }
}
