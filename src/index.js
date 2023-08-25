const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const axios = require('axios');
const { exec } = require('child_process');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
if (require('electron-squirrel-startup')) {
  app.quit();
}
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
  exec(`cd playwright && npx playwright codegen`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
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

const createWindow = () => {
  // Create the browser window.webContents
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), //(実行中のスクリプトパス,レンダリング前にバージョン公開)非同期でスクリプトをロード
    },
  });
  //(preloadのkey"set-title"からtitle文字列取得,handleSetTitleにipcMainEvent構造体とtitleを送る)
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  //////////////////////////////////////////////////////////////

  webcontents = mainWindow.webContents;
  webcontents.on('found-in-page', (event, result) => {
    console.log(event);
    //api作成,インスタンス化
    if (result.activeMatchOrdinal) {
      console.log(result);
      active = result.activeMatchOrdinal;
    } //アクティブなマッチの位置を覚えておく
    if (result.finalUpdate) {
      result_string = `${active}/${result.matches}`;
    } // M個のマッチ中 N 番目がアクティブな時，N/M という文字列をつくる
  });

  ////////////////////////////////////////////////////////////////
  //mainWindowにindex.html読み込み
  mainWindow.webContents.setWindowOpenHandler(); //Developerツールを開いてサイトを開く
};

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong'); //setup送信,preloadのinvoke("ping")
  ipcMain.on('search', Search);
  ipcMain.handle('test', test);
  ipcMain.handle('test-new', newTest);
  ipcMain.handle('test-report', reportTest);
  ipcMain.handle('test-run', runTest);
  ipcMain.handle('load-file', loadFile);
  ipcMain.handle('gpt-fix-code', gptFixCode);
  createWindow();
  app.on('activate', () => {
    //activateをリッスン(mac用)
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  //全てのウィンドウが閉じられると終了(終了するまでアクティブ)
  if (process.platform !== 'darwin') {
    //darwin=macOS
    app.quit();
  }
});
