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
  newTest: (link) => ipcRenderer.invoke('test-new', link),
  reportTest: () => ipcRenderer.invoke('test-report'),
  runTest: (fileName) => ipcRenderer.invoke('test-run', fileName),
  loadFile: (fileName) => ipcRenderer.invoke('load-file', fileName),
  gptFixCode: (fileName) => ipcRenderer.invoke('gpt-fix-code', fileName),
  getScreenshot: (link, uuid) =>
    ipcRenderer.invoke('get-screenshot', link, uuid),
  storeScreenshotName: (fileName) =>
    ipcRenderer.invoke('store-screenshot-name', fileName),
  getScreenshotName: () => ipcRenderer.invoke('get-screenshot-name'),
  saveCode: (code, uuid) => ipcRenderer.invoke('save-code', code, uuid),
  deleteScreenshot: (uuid) => ipcRenderer.invoke('delete-screenshot', uuid),
  editCode: (fileName) => ipcRenderer.invoke('edit-code', fileName),
});
