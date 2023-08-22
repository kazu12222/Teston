const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let hatoarray;
let building_li;
let array = [];
let site_link_object;
exports.housego = async function housego(page) {
  await page.goto(
    "https://house.goo.ne.jp/buy/touhoku_uh/area_fukushima/07202.html?sk=2&pu=1000",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await sleep(3000);
  await page.select('select[name="ps"]', "80");
  await sleep(10000);
  building_li = await page.$$(".rent_tabel_box > table.property > tbody");

  console.log(building_li.length);
  for (i = 0; i < building_li.length; i++) {
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
    site_link_object.site = "housego";
    site_link_array.push(site_link_object);
    hatoarray.site_link = site_link_array;
    hatoarray.address = await getAdress();
    hatoarray.traffic = await getTraffic();
    hatoarray.price = await getTableItem(4);
    let land_area_base = await getTableItem(6);
    land_area_base = land_area_base.replace("\n", "");
    hatoarray.land_area = land_area_base;
    hatoarray.build_area = await getBuildArea();
    let build_date_item = await getTableItem(7);
    build_date_item = build_date_item.replace("\n", "");
    hatoarray.build_date = build_date_item;
    hatoarray.company = await getCompany();
    array.push(hatoarray);
  }
  return array;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(
    "tr:nth-child(1) > td:nth-child(2) > ul > li.img"
  );
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await building_li[i].$(
    "tr:nth-child(1) > td:nth-child(3) > a"
  );
  const link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getAdress() {
  const address = await building_li[i].$("tr:nth-child(1) > td:nth-child(3)");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  address_text = address_text.split(/\n\n/);
  address_text[0] = address_text[0].replace("\n", "");
  return address_text[0];
}
async function getTraffic() {
  const address = await building_li[i].$("tr:nth-child(1) > td:nth-child(3)");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  address_text = address_text.split(/\n\n/);
  return address_text[1];
}
async function getBuildArea() {
  const build_ara = await building_li[i].$("tr:nth-child(1) > td:nth-child(5)");
  let build_ara_text = await (
    await build_ara.getProperty("textContent")
  ).jsonValue();
  build_ara_text = build_ara_text.split(/\n/);
  return build_ara_text[2];
}
async function getTableItem(keynum) {
  const element = await building_li[i].$(
    `tr:nth-child(1) > td:nth-child(${keynum})`
  );
  let element_text = await (
    await element.getProperty("textContent")
  ).jsonValue();
  return element_text;
}
async function getCompany() {
  const company = await building_li[i].$("tr:nth-child(3) > td");
  const company_text = await (
    await company.getProperty("textContent")
  ).jsonValue();
  return company_text;
}
