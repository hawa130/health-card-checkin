const puppeteer = require('puppeteer');

const argv = process.argv;
const username = argv[2];
const password = argv[3];
const geoData = JSON.parse(argv[4]);

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
  console.log(await res.json()['m']);
  await browser.close();
})();

handle();