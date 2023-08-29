// window.onbeforeunload = function () {
//   localStorage.clear();
//   localStorage.setItem('key', JSON.stringify(new_property_array));
// };

window.onload = function () {
  // localStorageからテストデータを取得
  const testDataString = localStorage.getItem('testData');
  let testData = testDataString ? JSON.parse(testDataString) : {};

  // testDataがオブジェクトの場合、その値を配列として取得
  if (typeof testData === 'object' && !Array.isArray(testData)) {
    testData = Object.values(testData);
  }

  // 画像を表示するためのコンテナを取得
  const container = document.querySelector('.flex-container');

  // 既存の画像要素をすべて削除
  container.innerHTML = '';

  // テストデータを使用して新しい画像要素を動的に生成
  testData.forEach((test) => {
    const imgElem = document.createElement('img');
    imgElem.id = test.id; // UUIDをIDとして設定
    imgElem.classList.add('clickable-image');
    imgElem.setAttribute('data-filename', test.filename);
    imgElem.src = `../../../images/${test.filename.replace(
      '.spec.js',
      '.png'
    )}`;
    imgElem.alt = test.title;

    container.appendChild(imgElem);
  });
  const imageElements = document.querySelectorAll('.clickable-image');
  imageElements.forEach((image) => {
    image.addEventListener('click', async function () {
      const fileName = image.dataset.filename;
      execCommand(fileName);
      await sleep(1000);
      if (fileName === 'example2.spec.js') {
        window.location.href = './failed.html';
      } else {
        window.location.href = './success.html';
      }
    });
  });
};

const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // 'pong' と出力
};

//set & unsetで2回押せないように

function setFlag(i) {
  //元々falseでチェックでtrue
  Number(i);
  new_property_array[i].flag = true;
  let h2 = document.getElementById(i);
  if (h2.classList.contains('unchecked')) {
    h2.classList.remove('unchecked');
    h2.classList.add('checked');
  }
}
function unsetFlag(i) {
  Number(i);
  new_property_array[i].flag = false;
  let h2 = document.getElementById(`${i}`);
  if (h2.classList.contains('checked')) {
    h2.classList.remove('checked');
    h2.classList.add('unchecked');
  }
}

const doTest = document.getElementById('do-test');
const newTest = document.getElementById('new-test');
const reportTest = document.getElementById('report-test');
const linkInput = document.getElementById('link-input');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function execCommand(fileName) {
  console.log(fileName);
  window.versions.runTest(fileName);
}

doTest.addEventListener('click', async () => {
  window.versions.test();
});
newTest.addEventListener('click', async () => {
  const uuid = crypto.randomUUID();
  console.log(uuid);
  const link = linkInput.value;
  window.location.href = './makeTest.html';
  window.versions.getScreenshot(link, uuid);
  window.versions.storeScreenshotName(uuid);
  window.versions.newTest(link);
  // URLのスクショを撮りいってTmpに置く
});
reportTest.addEventListener('click', async () => {
  window.versions.reportTest();
});
func(); //ping,pang
