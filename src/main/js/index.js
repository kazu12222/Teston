const { Notification } = require('electron');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

let child;

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

function killTest() {
  if (child) {
    try {
      console.log(child.pid);
      process.kill(child.pid); // childプロセスのpidを使用してプロセスをkill
      console.log('プロセスを終了しました');
    } catch (error) {
      console.error('プロセスの終了に失敗しました:', error);
    }
    child = null;
  } else {
    console.log('実行中のプロセスはありません');
  }
}
function test() {
  child = exec(
    'cd playwright && npx playwright test --ui',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}
function newTest(_event, link) {
  child = exec(
    `cd playwright && npx playwright codegen ${link} --viewport-size=800,800`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
  console.log(child.pid);
}
function reportTest() {
  exec(
    'cd playwright && npx allure open ./allure-report',
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
  return new Promise((resolve, reject) => {
    console.log('Starting to run commands...');
    exec(
      `cd playwright && npx playwright test ${fileName} --reporter=line,allure-playwright`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        console.log('First test execution completed!');

        // First command has finished, now run the second command.
        exec(
          `cd playwright && npx allure generate ./allure-results --clean`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              console.error(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
            console.log('Allure report generation completed!');

            const NOTIFICATION_TITLE = 'テストが完了しました';
            const NOTIFICATION_BODY = 'レポート結果を確認しましょう';

            new Notification({
              title: NOTIFICATION_TITLE,
              body: NOTIFICATION_BODY,
            }).show();

            resolve(); // Both commands finished successfully, so we resolve the promise
          }
        );
      }
    );
  });
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
  killTest,
};
