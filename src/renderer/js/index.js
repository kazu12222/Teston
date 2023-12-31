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
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');

    const productTitle = document.createElement('div');
    productTitle.classList.add('product-title');
    const titleParagraph = document.createElement('p');
    titleParagraph.innerText = test.title;
    productTitle.appendChild(titleParagraph);

    const productImage = document.createElement('div');
    productImage.classList.add('product-image');
    const imgElem = document.createElement('img');
    imgElem.id = test.id; // UUIDをIDとして設定
    imgElem.classList.add('clickable-image');
    imgElem.setAttribute('data-filename', test.filename);
    imgElem.src = `../../../images/${test.filename.replace(
      '.spec.js',
      '.png'
    )}`;
    imgElem.alt = test.title;
    productImage.appendChild(imgElem);

    productItem.appendChild(productTitle);
    productItem.appendChild(productImage);

    container.appendChild(productItem);
  });

  const imageElements = document.querySelectorAll('.clickable-image');
  const modal = document.getElementById('myModal');
  const closeBtn = document.querySelector('.close');

  imageElements.forEach((image) => {
    image.addEventListener('click', function () {
      modal.setAttribute('data-filename', image.dataset.filename);
      modal.style.display = 'block';
    });
  });

  // クローズボタンがクリックされたときのイベントリスナー
  closeBtn.onclick = function () {
    modal.style.display = 'none';
  };

  // モーダルの外側をクリックしたときにモーダルを閉じる
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
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
const editButton = document.getElementById('edit-code');
const runButton = document.getElementById('run-test');
const deleteButton = document.getElementById('delete-test');
const modal = document.getElementById('myModal');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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
  // window.location.href = '../../../playwright/playwright-report/index.html';
  window.versions.reportTest();
});
editButton.addEventListener('click', async () => {
  const fileName = modal.dataset.filename;
  window.versions.editCode(fileName);
});
runButton.addEventListener('click', async () => {
  const fileName = modal.dataset.filename;
  window.versions
    .runTest(fileName)
    .then(() => {
      console.log('All commands in runTest have completed!');
      window.location.href = `./result.html?fileName=${fileName}&testFinish=true`;
    })
    .catch((error) => {
      console.error('An error occurred in runTest:', error);
    });
  await sleep(1000);
  window.location.href = `./result.html?fileName=${fileName}`;
});
deleteButton.addEventListener('click', async () => {
  const fileName = modal.dataset.filename;
  const uuid = fileName.replace('.spec.js', '');
  let currentTestData = JSON.parse(localStorage.getItem('testData') || '{}');
  currentTestData[uuid] = undefined;
  localStorage.setItem('testData', JSON.stringify(currentTestData));
  window.versions.deleteScreenshot(uuid);
  window.versions.deleteCode(fileName);
  window.location.href = './index.html';
});

func(); //ping,pang
