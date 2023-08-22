let new_property_array;
let update_property_array;
let before_property_array;
let checkflag;
let getdiv = document.getElementById('div');
window.onbeforeunload = function () {
  localStorage.clear();
  localStorage.setItem('key', JSON.stringify(new_property_array));
};
window.onload = function () {
  before_property_array = JSON.parse(localStorage.getItem('key'));
  for (i = 0; i < before_property_array.length; i++) {
    for (j = i + 1; j < before_property_array.length; j++) {
      if (
        before_property_array[i].land_area.substr(0, 2) ==
        before_property_array[j].land_area.substr(0, 2)
      ) {
        if (before_property_array[i].price == before_property_array[j].price) {
          for (k = 0; k < before_property_array[j].site_link.length; k++) {
            before_property_array[i].site_link.push(
              before_property_array[j].site_link[k]
            );
            if (before_property_array[j].flag) {
              before_property_array.flag = true;
            }
          }
          before_property_array.splice(j, 1); //jの情報をなくす
        }
      }
    }
    for (l = 0; l < before_property_array[i].site_link.length; l++) {
      for (l2 = l + 1; l2 < before_property_array[i].site_link.length; l2++) {
        if (
          before_property_array[i].site_link[l].site ==
          before_property_array[i].site_link[l2].site
        ) {
          before_property_array[i].site_link.splice(l2, 1);
        }
      }
    }
  }

  console.log(before_property_array);
  getdiv.innerHTML = '';
  new_property_array = before_property_array;
  for (i = 0; i < before_property_array.length; i++) {
    makeBuildingLi(before_property_array);
  }
};
const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // 'pong' と出力
};
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
const watchfilterbtn = document.getElementById('watchfilter');
const unwatchfilterbtn = document.getElementById('unwatchfilter');
const allshowbtn = document.getElementById('allshow');
const btn3 = document.getElementById('btn3');
const upsortbtn = document.getElementById('upsort');
const downsortbtn = document.getElementById('downsort');
const filter500 = document.getElementById('filter500');
const filter1000 = document.getElementById('filter1000');
const filter_build = document.getElementById('filter_build');
const filter_area = document.getElementById('filter_area');

filter_build.addEventListener('click', async () => {
  getdiv.innerHTML = '';
  console.log(new_property_array);
  for (i = 0; i < new_property_array.length; i++) {
    if (!new_property_array[i].build_flag) {
      makeBuildingLi(new_property_array);
    }
  }
});
filter_area.addEventListener('click', async () => {
  getdiv.innerHTML = '';
  console.log(new_property_array);
  for (i = 0; i < new_property_array.length; i++) {
    if (new_property_array[i].build_flag) {
      makeBuildingLi(new_property_array);
    }
  }
});
filter500.addEventListener('click', async () => {
  getdiv.innerHTML = '';
  for (i = 0; i < new_property_array.length; i++) {
    let price = new_property_array[i].price;
    price = price.replace('万円', '');
    price = price.replace('万円', '');
    if (price <= 500) makeBuildingLi(new_property_array);
  }
});
upsortbtn.addEventListener('click', async () => {
  for (i = 0; i < new_property_array.length; i++) {
    for (j = new_property_array.length - 1; i < j; j--) {
      let price1 = new_property_array[j - 1].price;
      let price2 = new_property_array[j].price;
      price1 = price1.replace('万円', '');
      price1 = price1.replace(',', '');
      price2 = price2.replace('万円', '');
      price2 = price2.replace(',', '');
      price1 = parseInt(price1);
      price2 = parseInt(price2);
      if (price1 > price2) {
        let tmp = new_property_array[j - 1];
        new_property_array[j - 1] = new_property_array[j];
        new_property_array[j] = tmp;
      }
    }
  }
  getdiv.innerHTML = '';
  for (i = 0; i < new_property_array.length; i++) {
    makeBuildingLi(new_property_array);
  }
});
downsortbtn.addEventListener('click', async () => {
  for (i = 0; i < new_property_array.length; i++) {
    for (j = new_property_array.length - 1; i < j; j--) {
      let price1 = new_property_array[j - 1].price;
      let price2 = new_property_array[j].price;
      price1 = price1.replace('万円', '');
      price1 = price1.replace(',', '');
      price2 = price2.replace('万円', '');
      price2 = price2.replace(',', '');
      price1 = parseInt(price1);
      price2 = parseInt(price2);
      if (price1 > price2) {
        let tmp = new_property_array[j - 1];
        new_property_array[j - 1] = new_property_array[j];
        new_property_array[j] = tmp;
      }
    }
  }
  getdiv.innerHTML = '';
  for (i = new_property_array.length - 1; i >= 0; i--) {
    makeBuildingLi(new_property_array);
  }
});
unwatchfilterbtn.addEventListener('click', async () => {
  getdiv.innerHTML = '';
  console.log(new_property_array);
  for (i = 0; i < new_property_array.length; i++) {
    if (!new_property_array[i].flag) {
      makeBuildingLi(new_property_array);
    }
  }
});
watchfilterbtn.addEventListener('click', async () => {
  getdiv.innerHTML = '';
  console.log(new_property_array);
  for (i = 0; i < new_property_array.length; i++) {
    if (new_property_array[i].flag) {
      makeBuildingLi(new_property_array);
    }
  }
});
allshowbtn.addEventListener('click', async () => {
  window.versions.test();
});
btn3.addEventListener('click', async () => {
  console.log('更新ボタンが押されました');
  btn3.classList.add('pushbtn');
  update_property_array = await window.versions.puppeteer();
  getdiv.innerHTML = '';
  let tmp = [];
  for (let i = 0; i < new_property_array.length; i++) {
    if (new_property_array[i].flag) {
      tmp.push(new_property_array[i]);
    }
  }
  for (let i = 0; i < update_property_array.length; i++) {
    for (j = 0; j < tmp.length; j++) {
      if (update_property_array[i].address == tmp[j].address) {
        update_property_array[i].flag = true;
      }
    }
  }
  for (let i = 0; i < update_property_array.length; i++) {
    makeBuildingLi(update_property_array);
  }
  new_property_array = update_property_array;
  localStorage.clear();
  localStorage.setItem('key', JSON.stringify(new_property_array));
  btn3.classList.remove('pushbtn');
});
function makeBuildingLi(property_array) {
  let checkclass;
  if (property_array[i].flag) checkclass = 'checked';
  else checkclass = 'unchecked';

  let str1 = `<div style ="border: 1px solid #ddd; border-bottom: none; width: 700px">
  <h2 id = ${i} class = ${checkclass}>
    <p style="margin: 0;
    padding: 0;
    font-size: 1em;">
    <p>${property_array[i].address}
    <button class ="watched" onclick="setFlag(${i})">チェック</button>
    <button class ="unwatched" onclick="unsetFlag(${i})">未チェック</button>
    </p>
    </p>
  </h2>
  <div class="itemBody">
    <p class="itemDescription"></p>
    <div class="clearfix">
      <div style="float: left;
      margin-right: 9px;
        <p class="mainImageRect">
          <a href="/chuko/ikkodate/fukushima/aizuwakamatsushi/suumof_70599242/" target="_blank" data-pbcd-track-on-click="">
            <img alt=A src=${property_array[i].build_src} height="300" widtd="170">
          </a>
        </p>
      </div>
        <table border="1" class="row">
        <tr><th>価格</th><td>${property_array[i].price}</td></tr>
        <tr><th>所在地</th><td>${property_array[i].address}</td></tr>
        <tr><th>交通</th><td>${property_array[i].traffic}</td></tr>
        <tr><th>土地面積</th><td>${property_array[i].land_area}</td></tr>
        <tr><th>建物面積</th><td>${property_array[i].build_area}</td></tr>
        <tr><th>築年月</th><td>${property_array[i].build_date}</td></tr>
        <tr><th>担当会社</th><td>${property_array[i].company}</td></tr>
        <tr><th>参照サイト</th><td>
        `;
  let str2 = '';
  for (j = 0; j < property_array[i].site_link.length; j++) {
    let tmp = `<button type="button" class=copy-btn onClick='navigator.clipboard.writeText("${property_array[i].site_link[j].link}")'>Copy</button><a href='${property_array[i].site_link[j].link}' onclick="window.open('${property_array[i].site_link[j].link}','','width=1920,height=1080'); return false;">
        ${property_array[i].site_link[j].site}</a>,`;
    str2 = str2 + tmp;
  }
  let str3 = `</td></tr></table></div></div></div>`;
  let str = str1 + str2 + str3;
  let div = document.createElement('div');
  div.innerHTML = str; //html要素に変換
  getdiv.appendChild(div);
}
func();
