'use strict';
module.exports = {
  before: {
    host: 'https://likealunatic.jp',
    screenshots_dir: 'screenshots_before',
    url_list: './data/urls_before.txt',
    url_json: './data/urls_before.json'
  },
  after: {
    host: 'https://dev.likealunatic.jp',
    screenshots_dir: 'screenshots_after',
    url_list: './data/urls_after.txt',
    url_json: './data/urls_after.json'
  },
  report_dir: 'screenshots_diff'
};
