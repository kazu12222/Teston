const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { default: puppeteer } = require('puppeteer');
const athome = require('../js/athome.js');
const hatomark = require('../js/hatomark.js');
const housego = require('../js/housego.js');
const nifty = require('../js/nifty.js');
const aisumu = require('../js/aisumu.js');
const housestation = require('../js/housestation.js');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let webcontents;
let previous_text = '';
let active;
if (require('electron-squirrel-startup')) {
  app.quit();
}
async function AutomationPuppeteer() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const property_array = [];
  await sleep(5000);
  //配列にhatoarrayが入ったものが帰ってくる
  const aisumu_array = await aisumu.aisumu(page);
  console.log(aisumu_array.length);
  // const athome_array = await athome.athome(page);
  // console.log(athome_array.length);
  const hatomark_array = await hatomark.hatomark(page);
  console.log(hatomark_array.length);
  const housego_array = await housego.housego(page);
  console.log(housego_array.length);
  const housestation_array = await housestation.housestation(page);
  console.log(housestation_array.length);
  const nifty_array = await nifty.nifty(page);
  console.log(nifty_array.length);
  for (let i = 0; i < hatomark_array.length; i++) {
    property_array.push(hatomark_array[i]);
    console.log('A' + i);
  }
  // for (let i = 0; i < athome_array.length; i++) {
  //   property_array.push(athome_array[i]);
  // }
  for (let i = 0; i < housego_array.length; i++) {
    property_array.push(housego_array[i]);
    console.log('B' + i);
  }
  for (let i = 0; i < nifty_array.length; i++) {
    property_array.push(nifty_array[i]);
    console.log('C' + i);
  }
  for (let i = 0; i < aisumu_array.length; i++) {
    console.log('D' + i);
    property_array.push(aisumu_array[i]);
  }
  for (let i = 0; i < housestation_array.length; i++) {
    console.log('E' + i);
    property_array.push(housestation_array[i]);
  }
  console.log(property_array.length);
  browser.close();
  return property_array;
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
  exec('cd playwright && npx playwright test', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
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
  ipcMain.handle('automation', AutomationPuppeteer);
  ipcMain.on('search', Search);
  ipcMain.handle('test', test);
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
