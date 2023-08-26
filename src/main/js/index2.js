const path = require('path');
const fs = require('fs');
require('dotenv').config();
const axios = require('axios');
const { exec } = require('child_process');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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
function loadFile(_event, fileName) {
  const fileContent = fs.readFileSync(
    path.join(__dirname, '../playwright/e2e/example.spec.js'),
    'utf8'
  );
  console.log(fileContent);
  console.log(fileName);
  return fileContent;
}

function gptFixCode(_event, fileName) {
  const fileContent = loadFile(_event, 'A');
  let userMessage = fileContent;

  if (userMessage === undefined) {
    userMessage = '？？？';
  }
  const prompt = userMessage;
  const requestOptions = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
    },
    data: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Playwrightのコードに対して以下のエラーが出ました。
          正しく修正してPlaywrightのコードのみを出力してください
          
          <条件>
          ・Playwrightのコードのみを出力すること
          ・Playwrightのコードを全文省略せずに出力すること
          ・直したところにのみコメントアウトで横に修正内容を書く
          ・修正したところ以外にはコメントアウトを追加しない
          ・エラーが出ているところ以外は修正しないでください`,
        },

        {
          role: 'user',
          content: `
        <Playwright>
        // @ts-check
        const { test, expect } = require('@playwright/test');
        
        test('has title', async ({ page }) => {
          await page.goto('https://playwright.dev/');
        
          // Expect a title "to contain" a substring.
          await expect(page).toHaveTitle(/Playwrigt/);
        });
        
        test('get started link', async ({ page }) => {
          await page.goto('https://playwright.dev/');
        
          // Click the get started link.
          await page.getByRole('link', { name: 'Get started' }).click();
        
          // Expects page to have a heading with the name of Installation.
          await expect(
            page.getByRole('heading', { name: 'Installation' })
          ).toBeVisible();
        });
        
        
        <エラー文>
        Error: Timed out 5000ms waiting for expect(received).toHaveTitle(expected)
        
        Expected pattern: /Playwrigt/
        Received string:  "Fast and reliable end-to-end testing for modern web apps | Playwright"
        `,
        },
      ],
    }),
  };
  console.log(process.env.OPENAI_API_KEY);
  console.log('before res');
  return axios('https://api.openai.com/v1/chat/completions', requestOptions)
    .then((response) => {
      const text = response.data.choices[0].message.content.trim();
      return text;
    })
    .catch((error) => {
      console.error('Error:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      throw error; // or handle it accordingly
    });
}

module.exports = {
  Search,
  test,
  newTest,
  reportTest,
  runTest,
  loadFile,
  gptFixCode,
};
