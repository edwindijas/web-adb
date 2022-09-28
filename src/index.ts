/* global console */

import { forwardPorts } from './portForward';
import { getDevices } from './adb';
import { openMobileBrowser } from './mobileBroswer';

export const main = async () => {
    const devices = await getDevices();

    console.log(devices);

    const ports = await forwardPorts(devices)
    
    openMobileBrowser(devices, ports);
}

main();