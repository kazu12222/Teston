const fs = require('fs');

// メインプロセスでデータを保存する変数
let currentScreenshotName = null;

function storeScreenshotName(_event, screenshotName) {
  currentScreenshotName = screenshotName;
}

function getScreenshotName() {
  return currentScreenshotName;
}

function saveCode(_event, code, uuid) {
  console.log(uuid);
  console.log(code);
  fs.writeFile(`playwright/e2e/${uuid}.spec.js`, code, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File has been created');
  });
}

function deleteScreenshot(_event, uuid) {
  fs.unlink(`images/${uuid}.png`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File has been deleted');
  });
}
function deleteCode(_event, fileName) {
  fs.unlink(`playwright/e2e/${fileName}`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File has been deleted');
  });
}

module.exports = {
  storeScreenshotName,
  getScreenshotName,
  saveCode,
  deleteScreenshot,
  deleteCode,
};
