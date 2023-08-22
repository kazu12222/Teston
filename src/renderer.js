window.onbeforeunload = function () {
  localStorage.clear();
  localStorage.setItem('key', JSON.stringify(new_property_array));
};
window.onload = function () {};
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
const imageElements = document.querySelectorAll('.clickable-image');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

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

function execCommand(fileName) {
  console.log(fileName);
  window.versions.runTest(fileName);
}

doTest.addEventListener('click', async () => {
  window.versions.test();
});
newTest.addEventListener('click', async () => {
  window.versions.newTest();
});
reportTest.addEventListener('click', async () => {
  window.versions.reportTest();
});
func(); //ping,pang
