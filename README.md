# Health Card Checkin
西安电子科技大学健康卡自动打卡脚本，基于无头 Chromium 浏览器。

基于无头浏览器（无界面浏览器 Puppeteer），相当于模拟真实操作。与直接发送 POST 请求相比，能够更稳定的工作。理论上只要前端不发生变化就能正常工作。

缺点的话就是在服务器上部署比较麻烦，需要安装很多 Chromium 运行所需的库。
阿里云函数计算、腾讯云函数等 Serverless 环境部署十分麻烦，所以不推荐在这类服务上部署。

因为是启动了真正的浏览器，所以运行起来会相对慢一些。

~~不过打卡追求什么效率呢？打上就行了！~~

## 部署
该脚本执行需要 [node.js](https://nodejs.org/) 环境。请先确保个人电脑或服务器上安装了 node.js。

---

### 安装依赖

安装 [puppeteer](https://github.com/puppeteer/puppeteer)。
```
npm i puppeteer
```
如果使用 yarn，可执行 `yarn add puppeteer`。

---

### 修改脚本配置

```javascript
const username = '你的学号';
const password = '你的密码';
```
🔼 这两个字符串分别替换成统一身份认证的学号和密码。注意是字符串格式，带引号。

```javascript
const geoData = {
  "type": "complete",
  // ...
  "info": "SUCCESS"
};
```
🔼 `geoData` 是位置信息数据。可以在[这个页面](https://geoinfo.hawa130.com/)获取。复制之后可以直接粘贴，替换掉花括号及其内部的内容。

**注意**：这个数据一定要保证和上一次手动打卡在一个城市，否则会打卡失败（因为填写时需要选择切换城市的原因，该脚本不会自动选择）。

如果更换城市，请手动更换成最新获取的 `geoData` ，并且下一次手动打卡。

---

如果你使用的是 Linux 系统，还需要修改
```javascript
const browser = await puppeteer.launch();
```
为
```javascript
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
```
如果不修改是无法启动浏览器的。

这样做关闭了 Chromium 的沙箱机制，官方并不推荐这种做法，因为不够安全，但确实是最简单的方法。
官方也提供了其他的[替代方案](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)（更安全）。

---

### 运行脚本

```
node yqt-check.js
```
如果想要定时在服务器上运行，请用 [crontab](https://www.runoob.com/linux/linux-comm-crontab.html) 。

## 部署注意事项
个人测试该脚本在完整 Windows 环境下能够正常运行。

Linux 系统可能会因为或多或少的库缺失无法运行。启动时如果有缺失的库会报错，以及缺失库的名字。一般缺哪个装哪个就好了。

## 附录
[puppeteer 常见问题](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#troubleshooting)
