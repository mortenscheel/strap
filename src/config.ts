import {Config} from '@oclif/core';
import path from 'node:path';
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import yaml from 'js-yaml';
import UserStraps from './straps';

interface UserConfigData {
    defaultFolder: string;
    additionalFolders?: string[];
}

export default class UserConfig {
    configDir: string;
    configPath: string;
    data: UserConfigData;

    constructor(config: Config) {
        this.configDir = config.configDir;
        if (!existsSync(this.configDir)) {
            mkdirSync(this.configDir);
        }

        this.configPath = path.resolve(this.configDir, 'config.yml');
        if (existsSync(this.configPath)) {
            this.data = <UserConfigData>yaml.load(readFileSync(this.configPath, 'utf-8'));
        } else {
            this.data = {defaultFolder: './straps', additionalFolders: []};
            writeFileSync(this.configPath, yaml.dump(this.data), 'utf-8');
        }

        const strapsFolder = this.getStrapsFolder();
        if (!existsSync(strapsFolder)) {
            mkdirSync(strapsFolder);
        }

        const typesPath = path.resolve(strapsFolder, 'types.d.ts');
        if (!existsSync(typesPath)) {
            copyFileSync(path.resolve(__dirname, '../stub/types.d.ts'), typesPath);
        }
    }

    getStrapsFolder(): string {
        return path.resolve(this.configDir, this.data.defaultFolder);
    }

    getStrapFiles(): string[] {
        const additionalFolders = (this.data.additionalFolders || []).map(extraPath => path.resolve(this.configDir, extraPath));
        return [this.getStrapsFolder(), ...additionalFolders]
            .flatMap(folder => readdirSync(folder, 'utf-8').map(filename => path.resolve(folder, filename)))
            .filter(filePath => UserStraps.extensions.includes(path.parse(filePath).ext.replace(/^\./, '')));
    }

    static resolve(config: Config): UserConfig {
        return new UserConfig(config);
    }
}
