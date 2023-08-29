window.addEventListener('DOMContentLoaded', (event) => {
  const urlParams = new URLSearchParams(window.location.search);
  const testFinish = urlParams.get('testFinish');

  if (testFinish === 'true') {
    const reportTest = document.getElementById('report-test');
    if (reportTest) {
      reportTest.disabled = false; // ボタンを有効にする
    }
  }
});

const code1 = document.getElementById('code-1');
const code2 = document.getElementById('code-2');
const editButton = document.getElementById('edit-code');
const reportTest = document.getElementById('report-test');
function redirectToIndex() {
  window.location.href = './index.html';
}
async function A() {
  const A = await window.versions.loadFile('A');
  console.log(A);
  code1.textContent = A;
  const B = await window.versions.gptFixCode('B');
  // console.log(B);
  code2.textContent = B;
}

//index.jsと同じ
editButton.addEventListener('click', async () => {
  const fileName = new URLSearchParams(window.location.search).get('fileName');
  console.log(fileName);
  window.versions.editCode(fileName);
});
reportTest.addEventListener('click', async () => {
  //   window.location.href = '../../../playwright/playwright-report/index.html';
  window.versions.reportTest();
});
