# Health Card Checkin
西安电子科技大学健康卡自动打卡脚本，基于 Puppeteer，一种无头（无界面） Chromium 浏览器。

因为是基于真实的浏览器，所以相当于模拟真实操作。与直接发送 POST 请求相比，能够更稳定的工作，即使网页提交表单新增或减少字段，它也都能对付，有较强的自适应能力。理论上只要前端不发生大变化就能正常工作。

阿里云函数计算、腾讯云函数等 Serverless 环境部署十分麻烦，所以不推荐在这类服务上部署。

因为是启动了真正的浏览器，所以运行起来会相对慢一些。~~不过打卡追求什么效率呢？打上就行了！~~

**打个广告：** 开学了怎么办？来看[晨午晚检自动化快捷指令](https://www.icloud.com/shortcuts/2ed0fc2e238a40ec87b3d292f13db979)，可以设置个人自动化定时运行哦。仅限 iPhone、iPad 和 Mac 用户。

接下来步入正题：如何使用该脚本呢？这里提供了两种部署方案：「[GitHub Actions 部署](#github-actions-部署推荐)」和「[自行部署](#自行部署)」。前者部署方法简单，也不需要服务器或者不关机的电脑，所以个人更推荐前者。

## 使用前

第一次使用前，请确保**在你的所在城市至少手动打卡过一次**，并且开启自动打卡后中途不再切换城市。

## GitHub Actions 部署（推荐）

### Fork 本仓库

点击右上角的「Fork」按钮。

### 获取位置信息

在[这个页面](https://geoinfo.hawa130.com/)获取位置信息。

1. 点击「获取定位信息」。
2. 若提示需要权限，请允许。
3. 获取成功后，点击「复制打卡用数据」，此时位置信息已存储至剪贴板。

### 设置 Secrets

该步骤设置你的信息。

<img width="1440" alt="image" src="https://user-images.githubusercontent.com/26119430/153638517-a0ebf033-dbbb-4b8a-b181-09c4d0955335.png">

1. 如图所示：依次点开「Settings → Secrets → Actions」，点击「New repository secret」。
2. Name 填入 `USERNAME`，Value 填入你的学号。
3. 点击「Add secret」，此时你已经成功新建了一个 repository secret，Name 为 `USERNAME`，Value 为你的学号。
4. 同理，新建一个 repository secret，Name 为 `PASSWORD`，Value 为你的密码。
5. 同理，新建一个 repository secret，Name 为 `GEO_INFO`，Value 为你的位置信息，请粘贴刚才复制的位置信息。

经过以上步骤，脚本就配置完成了。

### 测试 Actions

**启用 Actions**

⬇️ 点击「Actions」，点击那个大大的绿色按钮。
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/26119430/153703723-d86d5d16-8e1b-4900-8b85-f13d91eebd88.png">

⬇️ 在左侧选择「Auto Health Card Check-in」，点击「Enable workflow」。
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/26119430/153703851-d10eb0f3-ec08-4286-8b11-2ead78baa9b4.png">

⬇️ 手动运行一次。
<img width="941" alt="image" src="https://user-images.githubusercontent.com/26119430/153704060-09e9536a-d24c-40b0-876c-303f7e46b899.png">

等待运行结果即可。如果运行成功会显示绿色的 ✅。

⬇️ 如果想以后再手动运行可以这样。
<img width="1440" alt="image" src="https://user-images.githubusercontent.com/26119430/153639130-7dcbc056-e19d-4eb4-96ee-5b32c4dc7eb6.png">

**查看更详细的运行结果**
1. 点击你想看的运行记录「Auto Health Card Check-in」。
<img width="943" alt="image" src="https://user-images.githubusercontent.com/26119430/153646492-d01af54b-8f67-46c5-9e2d-2eabd840f3ec.png">

2. 点击「run」。
<img width="382" alt="image" src="https://user-images.githubusercontent.com/26119430/153642171-06cfdd3b-228a-4aa6-9ded-204f372b6335.png">

3. 展开「Run Script」。
<img width="1035" alt="image" src="https://user-images.githubusercontent.com/26119430/153642189-ed395901-893d-4fd0-b4a1-898a01d37647.png">

4. 从第 4 行（行号为 4 的行）起，就是脚本的输出了。
5. 正常的输出应该是 `操作成功` 或者 `今天已经填报了`。如有不正常的输出请先看 [FAQs](#faqs)，若仍未解决请提出 Issues。

如果一切顺利，到这里你的 Actions 已经配置好了，它将会在每天北京时间上午 8:40 自动填写健康卡，无需手动干预。如果打卡失败了，GitHub 会发送邮件通知。

### 高级设置（可选）

默认配置是每天早上 8:40 进行打卡，如果你有需要更改定时的需求，请阅读此版块。

你可以编辑 .github/workflows 文件夹里的 [run-script.yml](.github/workflows/run-script.yml) 以进行自定义配置。
打开这个文件，点击右边的「✏️ Edit this file」按钮可以进行编辑。
该配置文件的第 6 行与定时相关，是一个 cron 表达式。

`40 0,8 * * *` 这五项分别代表：分，时，日，月，星期。
表示每天 UTC 时间 0:40 和 8:40，即北京时间 8:40 和 16:40 执行此 action。（多执行一次保险）
北京时间的小时数减去 8 就是 UTC 时间了。如果减出来是个负数，请加上 24，所以注意换算哦。

这里举几个例子：
- `0 23 * * *`：每天 UTC 时间 23:00，即北京时间 7:00 执行。
- `30 10 * * *`：每天北京时间 18:30 执行。

所以看到这里，我相信你应该明白如何修改打卡时间了。

修改后点击「Start commit」，在弹出窗口中点击「Commit changes」即可保存修改。

更多 cron 表达式的高级用法请看[这里](https://www.runoob.com/linux/linux-comm-crontab.html)。

### FAQs

#### 为什么我运行时，详细的输出里面显示 Timeout？

<img width="1029" alt="image" src="https://user-images.githubusercontent.com/26119430/153640487-8f31aeb7-f1db-4f50-9e5d-879196e8c5e6.png">

1. 检查学号和密码是否填写正确，如果不确定请更新（Update）`USERNAME` 和 `PASSWORD` 两个 secrets 的值。
2. 确定至少在所在城市[手动打卡](https://xxcapp.xidian.edu.cn/ncov/wap/default/index)过一次。
3. 检查定位信息是否和上一次手动打卡的信息在同一城市，如果不确定请手动打卡一次，并紧接着更新 `GEO_INFO` 的值（[获取位置信息的网页](https://geoinfo.hawa130.com/)）。
4. 检查是否在打卡时间范围内，如果不在打卡时间范围内则无法提交。

#### 如何停用脚本？

**方法 1**

<img width="627" alt="image" src="https://user-images.githubusercontent.com/26119430/153641223-d860d15c-2187-4ac9-961c-b046f6016ac5.png">

编辑 .github/workflows 文件夹里的 [run-script.yml](.github/workflows/run-script.yml)。将第 5 行和第 6 行注释掉（在这两行行首插入 `#`）或者删除。
完成操作后，点击「Start commit」，在弹出窗口中点击「Commit changes」即可保存修改。
这样定时就取消了。

**方法 2**

<img width="1439" alt="image" src="https://user-images.githubusercontent.com/26119430/153702059-26a1353b-d133-4933-92b8-547fb12c661c.png">

点开「Settings → Actions → General」，选择「Disable Actions」，点击 Save 后即可禁用 Actions。

## 自行部署

该部署方法适合进阶玩家（需要具备命令行使用基础以及安装 npm 包的能力）。~~也适合闲的没事干喜欢折腾的~~

该脚本执行需要 [node.js](https://nodejs.org/) 环境。请先确保个人电脑或服务器上安装了 node.js。

以下命令如无特别注明，则均在**项目文件夹**里执行。

### 下载 yqt-check.js

你也可以克隆仓库。请确保下面的指令均在包含该文件的文件夹（即项目文件夹）内运行。

### 安装依赖

执行下面的指令，安装 puppeteer。
```
npm i puppeteer
```
如果使用 yarn，可执行 `yarn add puppeteer`。

如果你发现安装的 puppeteer 没有附带浏览器（特点是 node_modules 文件夹不到 100 MB），请参考下面的「[指定外部浏览器](#指定外部浏览器可选)」。

### 修改脚本配置

使用文本编辑器（如 VS Code、Sublime Text，记事本也算）打开 yqt-check.js。

```javascript
username = '你的学号';
password = '你的密码';
```
🔼 这两个字符串分别替换成统一身份认证的学号和密码。注意是字符串格式，带引号。

```javascript
geoData = {
  "type": "complete",
  // ...
  "info": "SUCCESS"
};
```
🔼 `geoData` 是位置信息数据。可以在[这个页面](https://geoinfo.hawa130.com/)获取（建议使用手机打开，定位更精准，以免出现奇妙 bug）。获取完之后点击「复制可视化数据」。复制之后可以直接粘贴，替换掉花括号及其内部的内容。

**注意**：这个数据一定要保证和上一次手动打卡在一个城市，否则会打卡失败（因为填写时需要选择切换城市，以及原因，脚本可不会自动处理这种情况）。

如果更换城市，请手动更换成最新获取的 `geoData` ，并且下一次手动打卡。

---

#### 如何修改启动参数

在 [yqt-check.js](https://github.com/hawa130/health-card-checkin/blob/master/yqt-check.js) 的第 27 行，有

```js
const browser = await puppeteer.launch();
```

下面提到的**修改浏览器启动参数**，改的就是这一行 `launch()` 括号里面的内容。

如果你对 JavaScript 有了解，应该明白括号里面是个 Object。

#### 如果 Linux 用户无法启动

如果你使用的不是 Linux 系统，可以跳过这一步。

如果你使用的是 Linux 系统，可能会出现浏览器无法启动的情况，这时候就需要修改浏览器启动参数

```javascript
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
```

这样做关闭了 Chromium 的沙箱机制，官方并不推荐这种做法，因为不够安全，但确实是最简单的方法。
官方也提供了其他的[替代方案](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)（更安全）。

#### 指定外部浏览器（可选）

如果你的 puppeteer 带了浏览器，可以跳过这一步。

修改浏览器启动参数，指定 Chrome/Chromium 启动路径。

这里的示例是 macOS 的 Chrome 路径，其他平台按需填写。如：Windows 平台是 chrome.exe 的路径）。这里的浏览器需要是 Chromium 内核的。

```js
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  // 指定 Chrome/Chromium 启动路径
});
```

### 运行脚本

执行指令，如果输出为 `操作成功` 或 `今天已经填报了` 就算成功了。~~如果想要偷懒，设置定时运行即可。~~

```
node yqt-check.js
```
如果想要定时在 Windows 电脑上运行，请用「Windows 计划任务」功能。注意打卡时电脑不能睡眠或关机。

如果想要定时在 Linux 服务器上运行，请用 [crontab](https://www.runoob.com/linux/linux-comm-crontab.html) 。

### 部署注意事项
个人测试该脚本在完整 Windows 环境下能够正常运行。

Linux 系统可能会因为或多或少的库缺失无法运行。启动时如果有缺失的库会报错，以及缺失库的名字。一般缺哪个装哪个就好了。

## 关于获取位置信息的网站
该网站是托管于 GitHub Pages 的纯静态网站，不会收集任何信息。所使用的 API 是从健康卡打卡网页扒的 API，保证获取数据的可用性。

网站源代码也在项目里，即 [index.html](https://github.com/hawa130/health-card-checkin/blob/master/index.html) 。如果网站挂了或者域名到期了，可以在本地部署使用。

## 用户协议

1. 你可以自由地分发、修改该脚本，不受任何约束，也不用署名。（就把它当成公共领域对待就行）
2. 该脚本为免费提供，无任何收费服务。~~（这简陋脚本总不会有人倒卖吧）~~
3. 如果身体有任何疑似新冠肺炎症状的情况，请立即停止使用该脚本，并根据实际情况手动填报。（一定要如实填报哦）
4. 若发生因使用本脚本而导致的任何意外，作者概不负责。~~（用个脚本能发生什么意外呢，我想不到，只是个免责声明吧）~~

如果你使用本脚本，将默认视为你同意上述协议。

## 附录
[puppeteer 常见问题](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#troubleshooting)

