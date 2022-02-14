const puppeteer = require('puppeteer');

const argv = process.argv;
let username;
let password;
let geoData;

if (argv.length < 3) {
  username = '你的学号';
  password = '你的密码';
  geoData = {
    "type": "complete",
    // ...
    "info": "SUCCESS"
  };
} else {
  username = argv[2];
  password = argv[3];
  geoData = JSON.parse(argv[4]);
}

const url = 'https://xxcapp.xidian.edu.cn/ncov/wap/default/index';
const saveUrl = 'https://xxcapp.xidian.edu.cn/ncov/wap/default/save';

const handle = () =>
(async () => {
  const browser = await puppeteer.launch();
  try {
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
    const log = await res.json();
    console.log(log['m']);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();

handle();