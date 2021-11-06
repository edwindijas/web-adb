const { exec } = require("child_process");
const http = require('http');
//const openBrowser = require('./openBrowser')

const adb = "./adb/adb-mac"

const runOnDevice = (device) => {
  const doExtra = (function () {
    let errs = '', count = 0;
    return function (newErrors) {
      if (newErrors) {
        errs = `${errs} ${newErrors}`;
      }
      count += 1;
      if (!errs && count === 3) {
        runURLCheck();
      }
      return errs;
    }
  }());

  const runURLCheck = () => {
    setTimeout(getHost, 10000);
  };

  const getHost = () => {
    const options = {
      hostname: 'localhost',
      port: 9222,
      path: '/json',
      agent: false,
    };
    const client = http.get(options, function (res) {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          const link = getTarget(parsedData);
          console.log(link);
          openBrowser(link);
        } catch (e) {
          console.error(e.message);
        }
        client.end();
      });
    })
  }

  const getTarget = (data) => {
    let x;
    for (x = 0; x < data.length; x++) {
      if (data[x].url.indexOf('http://localhost:3000') === 0) {
        break;
      }
    }

    if (x === data.length) {
      return undefined;
    }

    const { webSocketDebuggerUrl } = data[x];
    return url = 'devtools://devtools/bundled/inspector.html?ws=' + webSocketDebuggerUrl.substr('ws://'.length);
  };

  const callBack = (error, stdout, stderr) => {
    console.log(error);
    doExtra(stderr);
  };

  exec(`${adb} -s ${device} reverse tcp:3000 tcp:3000`, callBack);
  exec(`${adb} -s ${device} reverse tcp:8080 tcp:8080`, callBack);
  exec(`${adb} -s ${device} forward tcp:9222 localabstract:chrome_devtools_remote`, callBack);

  if (doExtra() === '') {
    exec(`${adb} -s ${device} shell am start -n com.android.chrome/com.google.android.apps.chrome.Main -d 'http://localhost:3000/'`, callBack);
  } else {
    console.log(doExtra());
  }
}

const getDevices = () => {
  return new Promise((resolve, reject) => {
    exec(`${adb} devices`, function (error, stdout, stderr) {
      const lines = stdout.trim().split(/\n/g).filter(a => a.trim() !== '');
      lines.splice(0, 1);
      resolve(lines.map(line => {
        return line.split(/\t/g)[0];
      }));
    })
  })
};

const devices = getDevices();
devices.then(response => {
  response.forEach(device => {
    runOnDevice(device);
  })
});
