require('dotenv').config();
const { exec } = require('child_process');

function Search(_event, text) {
  console.log(text);
  if (previous_text === text) {
    webcontents.findInPage(text, { findNext: true });
    // 前回の検索時とテキストが変わっていないので次のマッチを検索
  } else {
    // 検索開始
    previous_text = text;
    webcontents.findInPage(text); //api使用
  }
}

function test() {
  exec('cd playwright && npx playwright test --ui', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}
function newTest(_event, link) {
  exec(
    `cd playwright && npx playwright codegen ${link} --viewport-size=800,800`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}
function reportTest() {
  exec(
    'cd playwright && npx playwright show-report',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}
function runTest(_event, fileName) {
  exec(
    `cd playwright && npx playwright test ${fileName} --reporter=html`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        console.error(`stderr: ${stderr}`); // 追加
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}

function getScreenshot(_event, link, uuid) {
  exec(
    `cd playwright && npx playwright screenshot ${link} ../images/${uuid}.png`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}
function editCode(_event, fileName) {
  exec(`cd playwright/e2e && code ${fileName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

module.exports = {
  Search,
  test,
  newTest,
  reportTest,
  runTest,
  getScreenshot,
  editCode,
};
