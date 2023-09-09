async function getUUID() {
  return await window.versions.getScreenshotName();
}

async function saveCode() {
  const uuid = await getUUID();
  const code = document.getElementById('code-input').value;
  const title = document.getElementById('title-input').value;

  // code保存
  console.log(code);
  window.versions.saveCode(code, uuid);

  // localstorage保存(ファイル名、タイトル、uuid)
  console.log(uuid);
  console.log(title);

  var data = {
    id: uuid,
    filename: `${uuid}.spec.js`,
    title: title,
  };
  let currentTestData = JSON.parse(localStorage.getItem('testData') || '{}');

  // テストデータを更新
  currentTestData[uuid] = data;

  // 更新したテストデータをLocalStorageに再度保存
  localStorage.setItem('testData', JSON.stringify(currentTestData));
  window.versions.killTest();
  window.location.href = './index.html';
}

async function redirectToIndex() {
  const uuid = await getUUID();
  // 画像削除
  window.versions.deleteScreenshot(uuid);
  window.versions.killTest();
  // href戻る
  window.location.href = './index.html';
}
