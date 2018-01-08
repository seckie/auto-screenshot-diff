'use strict';

const fs = require('fs');
const _ = require('lodash');
const validUrl = require('valid-url');
const conf = require('./conf.js');

async function cleanup (opt) {
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(opt.url_list, 'utf8');
    let list = data.split(/[\n\r]+/);
    list = _.uniq(list);
    list = list.filter((url) => {
      if (!validUrl.isUri(url)) {
        console.info('Invalid URL: ' + url);
        return false;
      }
      return (
        url.indexOf(opt.host) !== -1 &&
        /\/(?:[\w]+(?:.html|.php))?(?:\?[\w&;=]+)?$/.test(url)
      );
    });
    const res = JSON.stringify(list);
    fs.writeFile(opt.url_json, res, 'utf8', (err) => {
      if (err) {
        reject(err);
      }
      console.log(opt.url_json + ' was saved.');
      resolve();
    });
  });
}

(async () => {
  await cleanup(conf.before);
  await cleanup(conf.after);
})();
