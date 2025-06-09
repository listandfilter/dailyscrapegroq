import {scrapeStockData} from './dailygainer.js'
import {scrapeStockDataB} from './dailygainerB.js'
import {scrapeStockDataloser} from './dailyloserA.js'
import {scrapeStockDataBloser} from './dailyloserB.js'
import {feeddailygainer} from './feeddailygainerA.js'
import {feeddailyloser} from './feeddailyloser.js'

import {filterCSV} from './filtercsvgainerA.js'
import {filterCSVB} from './filtercsvgainerB.js'
import {filterCSVloserA} from './filtercsvloserA.js'
import {filterCSVloserB} from './filtercsvloserb.js'
import {rundailygain} from './promptgain.js'
import {rundailyloss} from './promptloss.js'
import { joinCSVFiles } from './joincsv.js'
import {joinCSVFilesloss} from './joincsv2.js'


async function runAllTasksSequentially() {
  try {
    await scrapeStockData();
    await scrapeStockDataB();

    console.log('daily Gainer scraping completed!');

    await filterCSV('dailygainer.csv', 'filtereddailygainer.csv');
    await filterCSVB('dailygainerB.csv','filtereddailygainerB.csv');

    await joinCSVFiles('filtereddailygainer.csv', 'filtereddailygainerB.csv', 'combined_gain.csv');
    await scrapeStockDataloser();
    await scrapeStockDataBloser();
  

    await filterCSVloserA('dailyloserA.csv','filtereddailyloserA.csv')
    await filterCSVloserB('dailyloserB.csv','filtereddailyloserB.csv')

    await joinCSVFilesloss('filtereddailyloserA.csv', 'filtereddailyloserB.csv', 'combined_loss.csv');
    
    await feeddailygainer()
    await feeddailyloser()


    await rundailygain()
    await rundailyloss()
    console.log(' All tasks executed sequentially!');
    process.exit(0);

  } catch (err) {
    console.error(' Error during task execution:', err);
  }
}

runAllTasksSequentially();