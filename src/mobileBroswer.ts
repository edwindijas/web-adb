import http from 'http'
import openBrowser from './openBrowser';
import {exec} from 'child_process'
import { getAdbPath } from './adb';

const adb = getAdbPath();

export const openMobileBrowser = (devices: string[], ports: number[]) => {
    devices.forEach(device => {
        ports.forEach((port) => {
            exec(`${adb} -s ${device} shell am start -n com.android.chrome/com.google.android.apps.chrome.Main -d 'http://localhost:${port}/'`)
        })
    })

}

export const getOpenWindows = (devices: string[]) => {

}


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
          openBrowser(link);
        } catch (e: any) {
          console.error(e.message);
        }
        client.end();
      });
    })
  }


  const getTarget = (data: any) => {
    let x;
    for (x = 0; x < data.length; x++) {
      if (data[x].url.indexOf('http://localhost:8080') === 0) {
        break;
      }
    }

    if (x === data.length) {
      return undefined;
    }

    const { webSocketDebuggerUrl } = data[x];
    return 'devtools://devtools/bundled/inspector.html?ws=' + webSocketDebuggerUrl.substr('ws://'.length);
  };
