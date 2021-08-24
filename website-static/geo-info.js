// 获取定位信息
function getLocation() {
  let mapObj = new AMap.Map('iCenter');
  mapObj.plugin('AMap.Geolocation', function () {
    let geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, // 是否使用高精度定位，默认:true
      timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
      maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
      convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      showButton: true,         // 显示定位按钮，默认：true
      buttonPosition: 'LB',     // 定位按钮停靠位置，默认：'LB'，左下角
      buttonOffset: new AMap.Pixel(10, 20),// 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      panToLocation: false,     // 定位成功后将定位到的位置作为地图中心点，默认：true
      zoomToAccuracy:false      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    mapObj.addControl(geolocation);
    let button = document.querySelector('.get-info');
    button.innerHTML = '<i class="bi bi-arrow-repeat"></i>定位中...';
    button.disabled = true;
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete', locateComplete);//返回定位信息
    AMap.event.addListener(geolocation, 'error', locateError);      //返回定位出错信息
  });
}

function located(res) {
  document.querySelector('.geo-info-container').className = 'geo-info-container';
  document.querySelector('.copy').className = 'copy btn btn-outline-secondary';
  let data = JSON.stringify(res, null, '    ');
  let hignlightedData = hljs.highlight(data, {language: 'json'}).value;
  document.querySelector('.geo-info').innerHTML = hignlightedData;
}
// 定位成功
function locateComplete(res) {
  let button = document.querySelector('.get-info');
  button.innerHTML = '<i class="bi bi-check-circle"></i>获取成功';
  button.className = 'get-info btn btn-success';
  located(res);
}
// 定位失败
function locateError(res) {
  let button = document.querySelector('.get-info');
  button.innerHTML = '<i class="bi bi-x-circle"></i>获取失败';
  button.className = 'get-info btn btn-danger';
  button.disabled = false;
  setTimeout(function () {
    button.innerHTML = '<i class="bi bi-geo-alt"></i>获取定位信息';
    button.className = 'get-info btn btn-primary';
  }, 3000);
  located(res);
}
// 点击复制
function onCopy() {
  const data = document.querySelector('.geo-info').innerText;
  navigator.clipboard.writeText(data)
    .then(function () {
      let button = document.querySelector('.copy');
      button.innerHTML = '<i class="bi bi-check-circle"></i>复制成功';
      button.className = 'copy btn btn-outline-success';
      button.disabled = true;
      setTimeout(function () {
        button.innerHTML = '<i class="bi bi-clipboard"></i>复制';
        button.className = 'copy btn btn-outline-secondary';
        button.disabled = false;
      }, 3000);
    }, function () {
      let button = document.querySelector('.copy');
      button.innerHTML = '<i class="bi bi-x-circle"></i>复制失败';
      button.className = 'copy btn btn-outline-danger';
      setTimeout(function () {
        button.innerHTML = '<i class="bi bi-clipboard"></i>复制';
        button.className = 'copy btn btn-outline-secondary';
      }, 3000);
    })
}