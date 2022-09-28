import fs from 'fs';
import path from 'path';

const currentDirecctory = process.cwd();
const CONFIG_FILENAME = 'webpack.config.json';

const DEFAULT_CONFIG: Config = {
    ports: 3000
}

export const getConfig = (
    function () {
        const filename = path.join(currentDirecctory, CONFIG_FILENAME);
        let config: Config | false = DEFAULT_CONFIG;
        if (fs.existsSync(filename)) {
            const file = fs.readFileSync(filename).toString();
            try {
                config = JSON.parse(file) as Config;
            } catch (e) {
                config = false;
            }
        }

        return (): Config | false => {
            return config;
        }
    }()
)


type WEBADBCONFIG = {[key: string]: string};


interface Config {
    "ports": number[] | number,
    "server"?: boolean,
    "proxy"?: 
    {
        "server": string,
        "to": string
    }[]
}

