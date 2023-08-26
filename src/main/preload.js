const { contextBridge, ipcRenderer, ipcMain } = require('electron');

//隔離ワールド
contextBridge.exposeInMainWorld('versions', {
  //レンダラーでロードしたページはここでJS実行
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  setTitle: (title) => ipcRenderer.send('set-title', title), //タイトルを送る
  search: (text) => ipcRenderer.send('search', text),
  test: () => ipcRenderer.invoke('test'),
  newTest: () => ipcRenderer.invoke('test-new'),
  reportTest: () => ipcRenderer.invoke('test-report'),
  runTest: (fileName) => ipcRenderer.invoke('test-run', fileName),
  loadFile: (fileName) => ipcRenderer.invoke('load-file', fileName),
  gptFixCode: (fileName) => ipcRenderer.invoke('gpt-fix-code', fileName),
});
// 関数だけでなく、変数も公開できます

//下記の二つアクセスできないのを解決
//レンダラーーーーAPI
//メインプロセス---DOM

//Web->mainプロセス ipcMain.handle,ipcRender.invokeで公開

//nodejsの入れ方
//1.invoke,2.handle,3.html構築で行う,4.行うjs作成
//1,2,3環境構築,4,html反映,関数を使う
