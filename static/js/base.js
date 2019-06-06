(function () {
  const config = require('../config.json')
  document.getElementById('server').value = config.server
  document.getElementById('private').value = config.privateChannel
  document.getElementById('regular').value = config.regularChannel
  document.getElementById('bae').value = config.baeChannel
  document.getElementById('elmo1').value = config.elmo1Channel
  document.getElementById('elmo2').value = config.elmo2Channel
  document.getElementById('fnf').value = config.fnfChannel
  document.getElementById('child').value = config.childChannel
  document.getElementById('bot').value = config.botToken
  document.getElementById('cooldown').value = config.cooldown
  if (config.deleteAfterReact) {
    document.getElementById('deleteAfterReact').checked = true
  }
  if (config.childSizes) {
    document.getElementById('childSizes').checked = true
  }
  if (config.after10){
    document.getElementById('after10').checked =true
  }
})();
const electron = require('electron');
const {
  ipcRenderer
} = electron;

function stop() {
  ipcRenderer.send('stop');
  document.getElementById('server').disabled = false;
  document.getElementById('private').disabled = false;
  document.getElementById('regular').disabled = false;
  document.getElementById('bae').disabled = false;
  document.getElementById('elmo1').disabled = false;
  document.getElementById('elmo2').disabled = false;
  document.getElementById('fnf').disabled = false;
  document.getElementById('child').disabled = false;
  document.getElementById('bot').disabled = false;
  document.getElementById('cooldown').disabled = true;
  document.getElementById('deleteAfterReact').disabled = false;
  document.getElementById('childSizes').disabled = false;
  document.getElementById('after10').disabled = false
  document.getElementById('botsname').innerHTML = '';
  document.getElementById('name').innerHTML = '';
  document.getElementById("icon").src = 'https://is3-ssl.mzstatic.com/image/thumb/Purple124/v4/62/f8/8f/62f88f95-982b-c903-2123-0bbaf4e72482/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-7.png/246x0w.jpg'
  document.getElementById('redeemed').innerHTML = '';
  document.getElementById('live').innerHTML = '';
  document.getElementById('total').innerHTML = ''
  document.getElementById('textOut').innerHTML = ''
}
ipcRenderer.on('message', function (start, i) {
  console.log('x')
});

ipcRenderer.on('cartsTotal', function (cartsTotal, cartNum) {
  document.getElementById('total').innerHTML = cartNum
});
ipcRenderer.on('liveTotal', function (liveTotal, liveNum) {
  document.getElementById('live').innerHTML = liveNum
});
ipcRenderer.on('redeemedTotal', function (redeemedTotal, redeemedNum) {
  document.getElementById('redeemed').innerHTML = redeemedNum
});
ipcRenderer.on('serverImg', function (serverImg, img) {
  document.getElementById("icon").src = img
});
ipcRenderer.on('serverName', function (serverName, name) {
  document.getElementById('name').innerHTML = name
});
ipcRenderer.on('botName', function (botName, bname) {
  document.getElementById('botsname').innerHTML = bname
});
ipcRenderer.on('redeemedOutput', function (redeemedOutput, redeemedOut) {
  outString = '';
  redeemedOut.forEach(element => {
    outString += element.name + ': ' + element.quantityCart +'\n'
  });
  document.getElementById('textOut').innerHTML = outString
});
ipcRenderer.on('loginError', function (loginError, x) {
  alert('Login details incorrect');
  stop()
});

ipcRenderer.on('wrongVersion',function (wrongVersion,updates) {
    alert('You are not on the latest version. Please download the latest from https://github.com/fraserdale/freeCarts \nUpdates: '+updates);
    console.log('You are not on the latest update. Please go to https://github.com/fraserdale/freeCarts')
});

function save() {
  const server = document.querySelector('#server').value;
  const private = document.querySelector('#private').value;
  const regular = document.querySelector('#regular').value;
  const bae = document.querySelector('#bae').value;
  const elmo1 = document.querySelector('#elmo1').value;
  const elmo1 = document.querySelector('#elmo2').value;
  const elmo1 = document.querySelector('#fnf').value;
  const child = document.querySelector('#child').value;
  const bot = document.querySelector('#bot').value;
  const deleteAfterReact = document.getElementById('deleteAfterReact').checked
  const childSizes = document.getElementById('childSizes').checked
  const after10 = document.getElementById('after10').checked
  const cooldown = document.getElementById('cooldown').value
  config = `{"server":"${server}","privateChannel":"${private}","regularChannel":"${regular}","baeChannel":"${bae}","childChannel":"${child}","elmo1Channel":"${elmo1}","elmo2Channel":"${elmo2}","fnfChannel":"${fnf}","botToken":"${bot}","deleteAfterReact":${deleteAfterReact},"childSizes":${childSizes},"after10":${after10},"cooldown":${cooldown}}`
  console.log(config)
  ipcRenderer.send('configSave', config);
}

function start() {
  //save()
  document.getElementById('server').disabled = true
  document.getElementById('private').disabled = true
  document.getElementById('regular').disabled = true
  document.getElementById('bae').disabled = true
  document.getElementById('elmo1').disabled = true
  document.getElementById('elmo2').disabled = true
  document.getElementById('fnf').disabled = true
  document.getElementById('child').disabled = true
  document.getElementById('bot').disabled = true
  document.getElementById('deleteAfterReact').disabled = true
  document.getElementById('childSizes').disabled = true
  document.getElementById('after10').disabled = true
  document.getElementById('cooldown').disabled = true
  ipcRenderer.send('start');
}

function showSettings() {
  var x = document.getElementById("settings");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

ipcRenderer.send('checkVersion');
