const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
let hatoarray;
let building_li;
let array = [];
let site_link_object;
exports.housestation = async function housestation(page) {
  await page.goto(
    "http://www.address-kaitai.com/buy/ikkodate/area/sc_07202/?kt=10000000",
    {
      waitUntil: ["networkidle0"],
    }
  );
  await sleep(10000);
  building_li = await page.$$(".krList");

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
    site_link_object.site = "housestation";
    site_link_array.push(site_link_object);
    hatoarray.site_link = site_link_array;
    hatoarray.address = await getAddress();
    hatoarray.traffic = await getTraffic();
    hatoarray.price = await getPrice();
    hatoarray.land_area = await getLandarea();
    hatoarray.build_area = await getBuildarea();
    hatoarray.build_date = await getDate();
    array.push(hatoarray);
  }
  return array;
};

async function getBuildSrc() {
  const build_src_base = await building_li[i].$(".picBox");
  const build_src = await build_src_base.$eval("img", (el) => el.src);
  return build_src;
}
async function getLink(page) {
  const detail_link_base = await building_li[i].$(".link-to-detail");
  let link = await page.evaluate((body) => body.href, detail_link_base);
  return link;
}
async function getPrice() {
  const price_base = await building_li[i].$(".spec");
  const price = await price_base.$(".kakaku");
  const price_text = await (await price.getProperty("textContent")).jsonValue();
  return price_text;
}
async function getAddress() {
  const address_base = await building_li[i].$$(".spec > .dotLn");
  const address = await address_base[1].$("dl:nth-child(1) > dd");
  let address_text = await (
    await address.getProperty("textContent")
  ).jsonValue();
  return address_text;
}
async function getTraffic() {
  const traffic_base = await building_li[i].$$(".spec > .dotLn");
  const traffic = await traffic_base[1].$("dl:nth-child(2) > dd");
  let traffic_text = await (
    await traffic.getProperty("textContent")
  ).jsonValue();
  return traffic_text;
}
async function getLandarea() {
  const land_area = await building_li[i].$(
    ".spec > div:nth-child(3) > table > tbody > tr > td:nth-child(1) > dl > dd"
  );
  let land_area_text = await (
    await land_area.getProperty("textContent")
  ).jsonValue();
  land_area_text = land_area_text.replace(/\s+/g, "");
  return land_area_text;
}
async function getBuildarea() {
  const build_area = await building_li[i].$(
    ".spec > div:nth-child(4) > table > tbody > tr > td:nth-child(1) > dl > dd"
  );
  let build_area_text = await (
    await build_area.getProperty("textContent")
  ).jsonValue();
  build_area_text = build_area_text.replace(/\s+/g, "");
  return build_area_text;
}
async function getDate() {
  const date = await building_li[i].$(
    ".spec > div:nth-child(4) > table > tbody > tr > td:nth-child(2) > dl > dd"
  );
  let date_text = await (await date.getProperty("textContent")).jsonValue();
  date_text = date_text.replace(/\s+/g, "");
  return date_text;
}
