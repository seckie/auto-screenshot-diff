'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const ERROR_LOG_FILE_PATH = './index_error.log';
const conf = require('./conf.js');

async function saveScreenshot (opt) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({width: 1024, height: 10000});

  const dir = path.join(__dirname, opt.screenshots_dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const list = require(opt.url_json);
  for (let i = 0, l = list.length; i<l; ++i) {
    const url = list[i];
    const filename = url.replace(new RegExp(opt.host + '([\.\/]*)?'), '').replace(/\//g, '__');
    const filepath = path.join(opt.screenshots_dir, filename + '.png');
    if (fs.existsSync(filepath)) {
      continue;
    }
    await page.goto(url)
      .catch((err) => { console.error(err); });
    await page.screenshot({path: filepath})
      .then(() => {
        console.log('screenshot was saved: ', filepath);
      })
      .catch((err) => { console.error(err); });
  }

  await browser.close();
};


(async () => {
  await saveScreenshot(conf.before);
  await saveScreenshot(conf.after);
})();

