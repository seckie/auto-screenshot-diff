'use strict';

const fs = require('fs');
const path = require('path');
const conf = require('./conf.js');
const resemble = require('resemblejs');
const compareImages = require('resemblejs/compareImages');

resemble.outputSettings({ transparency: 0.1 });

async function getFileList (path) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path)) {
      reject();
    }
    let list = fs.readdirSync(path);
    list = list.filter((filename) => {
      return /\.(png|jpg|jpeg|gif)$/.test(filename);
    });
    resolve(list);
  });
}

async function doResemble (filename) {
  return new Promise((resolve, reject) => {
    try {
      const path_before = path.join(conf.before.screenshots_dir, filename);
      const path_after = path.join(conf.after.screenshots_dir, filename);
      const path_output = path.join(conf.report_dir, filename);
      if (fs.existsSync(path_output)) {
        console.log(path_output + ' is already exists.');
        resolve();
        return;
      }

      compareImages(
        fs.readFileSync(path_before),
        fs.readFileSync(path_after)
      ).then((data) => {
        console.log(path_output, '=> ', JSON.stringify(data));
        fs.writeFileSync(path_output, data.getBuffer());
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function doDiff (conf) {

  if (!fs.existsSync(conf.report_dir)) {
    fs.mkdirSync(conf.report_dir);
  }
  const list = await getFileList(conf.before.screenshots_dir);

  function loop(i) {
    const filename = list[i];
    doResemble(filename)
      .then(() => {
        if (i < list.length) {
          i++;
          loop(i);
        }
      }, (err) => {
        console.error(err.message);
        if (i < list.length) {
          i++;
          loop(i);
        }
      });
  };
  loop(0);
};


(async () => {
  await doDiff(conf);
})();

