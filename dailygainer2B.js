import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "dailygainerB.csv");

const url = "https://money.rediff.com/gainers/bse/daily/groupb";

export async function scrapeGainersB() {
  const browser = await puppeteer.launch({ headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
   });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const data = await page.evaluate(() => {
    const groupElem = document.querySelector("thead h3");
    const group = groupElem ? groupElem.textContent.replace(/[()]/g, "").trim() : "Unknown";

    const rows = Array.from(document.querySelectorAll("table.dataTable tbody tr"));
    const extracted = [];

    for (const row of rows) {
      const cols = row.querySelectorAll("td");
      if (cols.length === 3) {
        const company = cols[0].innerText.trim().replace(/\s+/g, " ");
        const percentChange = cols[2].innerText.replace("+", "").replace(/\u00a0/g, "").trim();
        extracted.push({ company, group, percentChange });
      }
    }

    return extracted;
  });

  // Write to CSV
  const header = "Company,Group,Change\n";
  const csvRows = data.map(d => `"${d.company}","${d.group}","${d.percentChange}"`).join("\n");

  fs.writeFileSync(outputPath, header + csvRows, "utf8");
  console.log(`✅ Saved ${data.length} rows to ${outputPath}`);

  await browser.close();
}

