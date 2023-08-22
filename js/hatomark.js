const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let hatoarray;
let building_li;
let array = [];
let site_link_object;
exports.hatomark = async function hatomark(page) {
  await page.goto(
    "https://www.hatomarksite.com/search/zentaku/buy/house/area/07/list?m_adr%5B%5d=07202&m_adr%5B%5d=07203&m_adr%5B%5d=07208&m_adr%5B%5d=07408&m_adr%5B%5d=07421&page=1",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await page.select('select[name="price_b_to"]', "10000000");
  const search_button = await getElements(
    'button[type="submit"',
    /^検索$/,
    page
  );
  search_button.click();
  await sleep(3000);
  await page.select('select[name="limit"]', "100");
  await sleep(10000);
  const list_table = await page.$(".list-table");
  building_li = await list_table.$$(".col-12"); //偶数でカード
  console.log(building_li.length);
  for (i = 0; i < building_li.length - 1; i = i + 2) {
    hatoarray = {
      build_src: "",
      site_link: "",
      address: "",
      traffic: "",
      price: "",
      land_area: "",
      build_area: "",
      build_date: "",
      company: "",
      flag: false,
      build_flag: false,
    };
    site_link_object = {
      site: "",
      link: "",
    };
    let site_link_array = [];
    hatoarray.build_src = await getBuildSrc();
    site_link_object.link = await getLink(page);
    site_link_object.site = "ハトマーク";
    site_link_array.push(site_link_object);
    hatoarray.site_link = site_link_array;
    hatoarray.address = await getAdress();
    hatoarray.traffic = await getTraffic();
    hatoarray.price = await getTableItem(/価格/);
    let land_area = await getTableItem(/土地面積/);
    land_area = land_area.split("公簿").join("");
    land_area = land_area.split(",").join("");
    hatoarray.land_area = land_area;
    hatoarray.site = "ハトマーク";
    hatoarray.build_area = await getTableItem(/建物面積/);
    hatoarray.build_date = await getTableItem(/築年月/);
    hatoarray.company = await getCompany();
    array.push(hatoarray);
  }
  return array;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(".img-wrap");
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await getElements("a", /詳細を見る/, building_li[i]);
  const link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getAdress() {
  const address = await building_li[i].$(".address");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  address_text = address_text.replace("MAP", "");
  return address_text;
}
async function getTraffic() {
  const traffic = await building_li[i].$(".traffic");
  let traffic_text = await (
    await traffic.getProperty("textContent")
  ).jsonValue();
  traffic_text = traffic_text.replace("駅までmap", "");
  return traffic_text;
}
async function getTableItem(keyword) {
  const element_base = await getElements(".col", keyword, building_li[i]);
  const element = await element_base.$(".room-detail-value");
  let element_text = await (
    await element.getProperty("textContent")
  ).jsonValue();
  return element_text;
}
async function getCompany() {
  const company = await building_li[i].$(".text-end");
  const company_text = await (
    await company.getProperty("textContent")
  ).jsonValue();
  return company_text;
}

async function getElements(Elementname, textContent, A) {
  let resultSelectors = await A.$$(Elementname);
  let resultsArray = [];
  let keyFlag = "";
  for (let i = 0; i < resultSelectors.length; i++) {
    resultsArray.push(
      await (await resultSelectors[i].getProperty("textContent")).jsonValue()
    );
    //console.log(resultsArray[i]);
    if (resultsArray[i].match(textContent)) {
      keyFlag = i;
      break;
    }
  }
  return resultSelectors[keyFlag];
}
