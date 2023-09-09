const { Notification } = require('electron');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let child;

function Search(_event, text) {
  console.log(text);
  if (previous_text === text) {
    webcontents.findInPage(text, { findNext: true });
  } else {
    previous_text = text;
    webcontents.findInPage(text);
  }
}

function killTest() {
  if (child) {
    try {
      process.kill(child.pid);
      console.log('プロセスを終了しました');
    } catch (error) {
      console.error('プロセスの終了に失敗しました:', error);
    }
    child = null;
  } else {
    console.log('実行中のプロセスはありません');
  }
}

function executeCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, options);

    let stdoutData = '';
    let stderrData = '';

    proc.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(
          new Error(`Command failed with exit code ${code}: ${stderrData}`)
        );
      } else {
        resolve(stdoutData);
      }
    });

    child = proc; // child変数にprocを代入
  });
}

function test() {
  executeCommand('npx', ['playwright', 'test', '--ui'], { cwd: 'playwright' })
    .then((output) => {
      console.log(`stdout: ${output}`);
    })
    .catch((error) => {
      console.error(`exec error: ${error.message}`);
    });
}

function newTest(_event, link) {
  executeCommand(
    'npx',
    ['playwright', 'codegen', link, '--viewport-size=800,800'],
    { cwd: 'playwright' }
  )
    .then((output) => {
      console.log(`stdout: ${output}`);
    })
    .catch((error) => {
      console.error(`exec error: ${error.message}`);
    });
}

function reportTest() {
  executeCommand('npx', ['allure', 'open', './allure-report'], {
    cwd: 'playwright',
  })
    .then((output) => {
      console.log(`stdout: ${output}`);
    })
    .catch((error) => {
      console.error(`exec error: ${error.message}`);
    });
}

function runTest(_event, fileName) {
  executeCommand(
    'npx',
    ['playwright', 'test', fileName, '--reporter=line,allure-playwright'],
    { cwd: 'playwright' }
  )
    .then((output) => {
      console.log(`stdout: ${output}`);
      return executeCommand(
        'npx',
        ['allure', 'generate', './allure-results', '--clean'],
        { cwd: 'playwright' }
      );
    })
    .then((output) => {
      console.log(`stdout: ${output}`);
      new Notification({
        title: 'テストが完了しました',
        body: 'レポート結果を確認しましょう',
      }).show();
    })
    .catch((error) => {
      console.error(`exec error: ${error.message}`);
    });
}

function getScreenshot(_event, link, uuid) {
  executeCommand(
    'npx',
    ['playwright', 'screenshot', link, `../images/${uuid}.png`],
    { cwd: 'playwright' }
  )
    .then((output) => {
      console.log(`stdout: ${output}`);
    })
    .catch((error) => {
      console.error(`exec error: ${error.message}`);
    });
}

function editCode(_event, fileName) {
  executeCommand('code', [fileName], { cwd: 'playwright/e2e' })
    .then((output) => {
      console.log(`stdout: ${output}`);
    })
    .catch((error) => {
      console.error(`exec error: ${error.message}`);
    });
}

module.exports = {
  Search,
  test,
  newTest,
  reportTest,
  runTest,
  getScreenshot,
  editCode,
  killTest,
};
