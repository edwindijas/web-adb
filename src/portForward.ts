import { getConfig } from "./config"
import { easyPromise } from "./general";
import { exec, ExecException } from 'child_process';
import { getAdbPath } from "./adb";

const defaultPorts = '3000';

const getConfigPorts = (): number[] => {
    const config = getConfig();
    let ports = defaultPorts
    if (!config || !config.ports) {
        ports = defaultPorts
    }

    const usablePorts = ports.split(',');
    return usablePorts.map((str) => Number(str));

}


export const forwardPorts = (devices: string[]): Promise<number[]> => {
    const {prom, resolve, reject} = easyPromise<number[], string>() || {};
    const promises: Promise<boolean>[] = [];
    const ports = getConfigPorts();

    devices.forEach((device) => {
        promises.push(forwardToDevice(device, ports));
    })

    Promise.all(promises).then(() => {
        resolve(ports);
    })

    return prom;
}

export const forwardToDevice = (device: string, ports: number[]): Promise<boolean> => {
    const adb = getAdbPath();
    const {prom, resolve} = easyPromise<boolean, string>() || {};
    
    const promises: Promise<boolean>[] = [];
    ports.forEach((port) => {
        const {prom, resolve, reject} = easyPromise<boolean, string>() || {};
        promises.push(prom);
        exec(`${adb} -s ${device} reverse tcp:${port} tcp:${port}`, () => {
            resolve(true)
        });

    });

    Promise.all(promises).then(() => {
        resolve(true);
    })
    return prom;
}
