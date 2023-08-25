import type {ListrContext, ListrOptions, ListrTask} from 'listr';
import path from 'node:path';
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {StrapUtils, util} from './util';
import slugify from 'slugify';
import UserConfig from './config';
import {Config} from '@oclif/core';

export interface Strap {
    name: string;
    tasks: ListrTask[];
    skip?: () => Promise<string | boolean> | Promise<string | boolean>[];
    context?: () => Promise<ListrContext>;
    options?: ListrOptions;
}

export default class UserStraps {
    userConfig: UserConfig;
    straps: Strap[];

    constructor(userConfig: UserConfig) {
        this.userConfig = userConfig;
        this.straps = this.resolveStraps();
    }

    resolveStraps(): Strap[] {
        return this.userConfig.getStrapFiles().map(filePath => {
            // eslint-disable-next-line unicorn/prefer-module
            const generator: (util: StrapUtils) => Strap = require(filePath);
            return generator(util);
        });
    }

    findStrap(name: string): Strap | null {
        return this.straps.find(strap => strap.name === name) || null;
    }

    create(name: string): string {
        const filename = slugify(name) + '-strap.js';
        const strapsFolder = this.userConfig.getStrapsFolder();
        const filepath = path.resolve(strapsFolder, filename);
        if (readdirSync(strapsFolder).includes(filename)) {
            throw new Error(`${filename} already exists in ${strapsFolder}`);
        }

        // eslint-disable-next-line unicorn/prefer-module
        const content = readFileSync(path.resolve(__dirname, '../stub/strap-stub.js'), 'utf-8').replace('%name%', name);
        writeFileSync(filepath, content, 'utf-8');
        return filepath;
    }

    static resolve(config: Config): UserStraps {
        return new UserStraps(UserConfig.resolve(config));
    }
}
