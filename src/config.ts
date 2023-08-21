import {Config} from '@oclif/core';
import path from 'node:path';
import {copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import yaml from 'js-yaml';
import {mkdirSync} from 'node:fs';

interface UserConfigData {
    strapsFolder: string;
}

export default class UserConfig {
    configDir: string;
    configPath: string;
    data: UserConfigData;

    constructor(config: Config) {
        this.configDir = config.configDir;
        this.configPath = path.resolve(this.configDir, 'config.yml');
        if (existsSync(this.configPath)) {
            this.data = <UserConfigData>yaml.load(readFileSync(this.configPath, 'utf-8'));
        } else {
            this.data = {strapsFolder: './straps'};
            writeFileSync(this.configPath, yaml.dump(this.data), 'utf-8');
        }

        const strapsFolder = this.getStrapsFolder();
        if (!existsSync(strapsFolder)) {
            mkdirSync(strapsFolder);
        }

        const typesPath = path.resolve(strapsFolder, 'types.d.ts');
        if (!existsSync(typesPath)) {
            // eslint-disable-next-line unicorn/prefer-module
            copyFileSync(path.resolve(__dirname, '../stub/types.d.ts'), typesPath);
        }
    }

    getStrapsFolder(): string {
        return path.resolve(this.configDir, this.data.strapsFolder);
    }

    getStrapFiles(): string[] {
        return readdirSync(this.getStrapsFolder(), 'utf-8')
            .filter(filename => /-strap\.ts$/.test(filename))
            .map(filename => path.resolve(this.getStrapsFolder(), filename));
    }

    static resolve(config: Config): UserConfig {
        return new UserConfig(config);
    }
}
