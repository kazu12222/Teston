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
function newTest() {
  exec(
    `cd playwright && npx playwright codegen --viewport-size=800,800`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
  exec(
    `cd playwright/e2e && code example3.spec.js`, //codeを貼り付けられる場所を作る
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
  //コードの保存場所、スクリーンショット、タイトルを決めて保存するhtml作成
  //ロジック
  //buttonを押したらcodegen+html切り替え=>保存orキャンセルを用いてHomeに戻る
}
function reportTest() {
  exec('cd playwright/e2e && code example.spec.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}
function runTest(_event, fileName) {
  exec(
    `cd playwright && npx playwright test ${fileName}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
}

module.exports = {
  Search,
  test,
  newTest,
  reportTest,
  runTest,
};
