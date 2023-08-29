const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const {
  Search,
  test,
  newTest,
  reportTest,
  runTest,
  getScreenshot,
  editCode,
} = require('./js/index.js');
const { loadFile, gptFixCode } = require('./js/result.js');
const {
  storeScreenshotName,
  getScreenshotName,
  saveCode,
  deleteScreenshot,
  deleteCode,
} = require('./js/makeTest.js');

if (require('electron-squirrel-startup')) {
  app.quit();
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
  mainWindow.loadFile(path.join(__dirname, '../renderer/html/index.html'));
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
  ipcMain.handle('get-screenshot', getScreenshot);
  ipcMain.handle('store-screenshot-name', storeScreenshotName);
  ipcMain.handle('get-screenshot-name', getScreenshotName);
  ipcMain.handle('save-code', saveCode);
  ipcMain.handle('delete-screenshot', deleteScreenshot);
  ipcMain.handle('delete-code', deleteCode);
  ipcMain.handle('edit-code', editCode);

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
