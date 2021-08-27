const puppeteer = require('puppeteer');

const username = '你的学号';
const password = '你的密码';
// 填入获取的定位 JSON，别忘了分号
// 关于该数据的获取，请阅读 readme.md
// 下面只是个例子
const geoData = {
  "type": "complete",
  "position": {
    "Q": 22.580793185764,
    "R": 113.98844455295199,
    "lng": 113.988445,
    "lat": 22.580793
  },
  "location_type": "html5",
  "message": "Get ipLocation failed.Get geolocation success.Convert Success.Get address success.",
  "accuracy": 1488314,
  "isConverted": true,
  "status": 1,
  "addressComponent": {
    "citycode": "0755",
    "adcode": "440305",
    "businessAreas": [],
    "neighborhoodType": "",
    "neighborhood": "",
    "building": "",
    "buildingType": "",
    "street": "信宜四路",
    "streetNumber": "123号",
    "country": "中国",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "township": "桃源街道"
  },
  "formattedAddress": "广东省深圳市南山区桃源街道S301南坪快速路塘朗山公园",
  "roads": [],
  "crosses": [],
  "pois": [],
  "info": "SUCCESS"
};

const url = 'https://xxcapp.xidian.edu.cn/ncov/wap/default/index';
const saveUrl = 'https://xxcapp.xidian.edu.cn/ncov/wap/default/save';

const handle = () =>
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.evaluate((username, password) => {
    vm.username = username;
    vm.password = password;
    vm.login();
  }, username, password);
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  await page.evaluate((geoData) => vm.locatComplete(geoData), geoData);
  await page.evaluate(() => vm.save());
  const res = await page.waitForResponse(saveUrl);
  console.log(await res.json());
  await browser.close();
})();

handle();