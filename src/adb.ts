

import path from 'path';

import { exec, ExecException } from 'child_process';
import { easyPromise } from './general';

export const getDevices = (): Promise<string[]> => {
    
    const {prom, resolve, reject} = easyPromise<string[], string>(),
    adb = getAdbPath(),
    
    callback = (error: ExecException | null, stdout: string, stderr: string) => {
        const lines = stdout.trim().split(/\n/g).filter(a => a.trim() !== '');
        lines.splice(0, 1);

        resolve(lines.map((line: string) => {
            return line.split(/\t/g)[0];
        }));
    } 

    exec(`${adb} devices`, callback)

    return prom;
}

export const getAdbPath = () => {
    const adb = "adb-mac";
    return path.join(__dirname, `./adb/${adb}`, )
}