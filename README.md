# Health Card Checkin
西安电子科技大学健康卡自动打卡脚本，基于无头 Chromium 浏览器。

基于无头浏览器（无界面浏览器 Puppeteer），相当于模拟真实操作。与直接发送 POST 请求相比，能够更稳定的工作。理论上只要前端不发生变化就能正常工作。

缺点的话就是在服务器上部署比较麻烦，需要安装很多 Chromium 运行所需的库。
阿里云函数计算、腾讯云函数等 Serverless 环境部署十分麻烦，所以不推荐在这类服务上部署。

因为是启动了真正的浏览器，所以运行起来会相对慢一些。

~~不过打卡追求什么效率呢？打上就行了！~~

## 部署
该脚本执行需要 [node.js](https://nodejs.org/) 环境。请先确保个人电脑或服务器上安装了 node.js。

以下命令如无特别注明，则均在项目文件夹里执行。

**注意**：第一次使用前，请确保在你的所在城市至少手动打卡过一次。

### 安装依赖

安装 [puppeteer](https://github.com/puppeteer/puppeteer)。
```
npm i puppeteer
```
如果使用 yarn，可执行 `yarn add puppeteer`。

如果你发现安装的 puppeteer 没有附带浏览器（特点是 node_modules 文件夹不到 100 MB），请参考下面的「指定外部浏览器」。

### 修改脚本配置

使用文本编辑器（如 VS Code、Sublime Text，记事本也算）打开 yqt-check.js。

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
🔼 `geoData` 是位置信息数据。可以在[这个页面](https://geoinfo.hawa130.com/)获取（建议使用手机打开，定位更精准，以免出现奇妙 bug）。复制之后可以直接粘贴，替换掉花括号及其内部的内容。

**注意**：这个数据一定要保证和上一次手动打卡在一个城市，否则会打卡失败（因为填写时需要选择切换城市，以及原因，脚本可不会自动处理这种情况）。

如果更换城市，请手动更换成最新获取的 `geoData` ，并且下一次手动打卡。

#### 如何修改启动参数

在 [yqt-check.js](https://github.com/hawa130/health-card-checkin/blob/master/yqt-check.js) 的第 49 行，有一行

```js
const browser = await puppeteer.launch();
```

下面提到的**修改浏览器启动参数**，改的就是这一行 `launch()` 括号里面的内容。

如果你对 JavaScript 有了解，应该明白括号里面是个 Object。

#### Linux 用户注意事项

如果你使用的不是 Linux 系统，可以跳过这一步。

如果你使用的是 Linux 系统，还需要修改浏览器启动参数

```javascript
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
```
如果不修改是无法启动浏览器的。

这样做关闭了 Chromium 的沙箱机制，官方并不推荐这种做法，因为不够安全，但确实是最简单的方法。
官方也提供了其他的[替代方案](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)（更安全）。

#### 指定外部浏览器（可选）

如果你的 puppeteer 带了浏览器，可以跳过这一步。

修改浏览器启动参数（这里的示例是 macOS 的 Chrome 路径，其他平台按需填写。如：Windows 平台是 chrome.exe 的路径）。

这里的浏览器需要是 Chromium 内核的。

```js
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // 指定 Chrome/Chromium 启动路径
  });
```

### 运行脚本

执行指令，如果输出为 `{ e: 0, m: '操作成功', d: {} }` 或 `{ e: 1, m: '今天已经填报了', d: {} }` 就算成功了。~~如果想要偷懒，设置定时运行即可。~~

```
node yqt-check.js
```
如果想要定时在 Linux 服务器上运行，请用 [crontab](https://www.runoob.com/linux/linux-comm-crontab.html) 。

## 部署注意事项
个人测试该脚本在完整 Windows 环境下能够正常运行。

Linux 系统可能会因为或多或少的库缺失无法运行。启动时如果有缺失的库会报错，以及缺失库的名字。一般缺哪个装哪个就好了。

## 关于定位获取网站
该网站是托管于 GitHub Pages 的纯静态网站，不会收集任何信息。所使用的 API 是从健康卡打卡网页扒的 API，保证获取数据的可用性。

网站源代码也在项目里，即 [index.html](https://github.com/hawa130/health-card-checkin/blob/master/index.html) 。如果网站挂了或者域名到期了，可以在本地部署使用。

## 附录
[puppeteer 常见问题](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#troubleshooting)

