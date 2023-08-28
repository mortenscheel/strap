import type {ListrContext, ListrOptions, ListrTask} from 'listr';
import path from 'node:path';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {util} from './util';
import slugify from 'slugify';
import UserConfig from './config';
import {Config} from '@oclif/core';
import JSON5 from 'json5';
import execa from 'execa';
import yaml from 'js-yaml';
import {EOL} from 'node:os';

export const parseJsonFile = <T = Record<string, unknown>>(path: string): T => JSON5.parse(readFileSync(path, 'utf-8'));

export const parseYamlFile = <T = Record<string, unknown>>(path: string): T => <T>yaml.load(readFileSync(path, 'utf-8'));

export interface SerializedStrap {
    name: string;
    description?: string;
    tasks: SerializedTask[];
}

interface CommandTask {
    type: 'command';
    title: string;
    command: string;
    args?: string[];
}

interface FileTask {
    type: 'file';
    title: string;
    path: string;
    content: string;
    overwrite?: boolean;
}

type SerializedTask = CommandTask | FileTask;

const objectToStrap = (data: SerializedStrap): Strap => {
    const strap: Strap = {
        name: data.name,
        description: data.description || '',
        tasks: [],
    };
    for (const serializedTask of data.tasks) {
        if (serializedTask.type === 'command') {
            // Parse arguments from command string
            const parts = serializedTask.command.split(' ');
            const command = <string>parts.shift();
            const args = [...parts, ...(serializedTask.args || [])];
            strap.tasks.push({
                title: serializedTask.title,
                task: () => execa(command, args),
            });
        } else if (serializedTask.type === 'file') {
            // ensure correct line endings for the os
            let content = serializedTask.content.replace(/\r?\n/g, EOL);
            if (!content.endsWith(EOL)) {
                content += EOL;
            }

            strap.tasks.push({
                title: serializedTask.title,
                task: () => writeFileSync(serializedTask.path, content, 'utf-8'),
                skip: () => !serializedTask.overwrite && existsSync(serializedTask.path),
            });
        }
    }

    return strap;
};

export interface Strap {
    name: string;
    description?: string;
    tasks: ListrTask[];
    skip?: () => Promise<string | boolean> | Promise<string | boolean>[];
    context?: () => Promise<ListrContext>;
    options?: ListrOptions;
}

export default class UserStraps {
    userConfig: UserConfig;
    straps: Strap[];
    static extensions = ['js', 'json', 'json5', 'yml', 'yaml'];

    constructor(userConfig: UserConfig) {
        this.userConfig = userConfig;
        this.straps = this.resolveStraps();
    }

    resolveStraps(): Strap[] {
        return this.userConfig.getStrapFiles().map(filePath => {
            const extension = path.parse(filePath).ext.replace(/^\./, '');
            switch (extension) {
                case 'js':
                    return <Strap>require(filePath)(util);
                case 'json':
                case 'json5':
                    return objectToStrap(parseJsonFile<SerializedStrap>(filePath));
                case 'yml':
                case 'yaml':
                    return objectToStrap(parseYamlFile<SerializedStrap>(filePath));
                default:
                    throw new Error('Unexpected strap extension: ' + extension);
            }
        });
    }

    findStrap(name: string): Strap | null {
        return this.straps.find(strap => strap.name === name) || null;
    }

    create(name: string, extension: string, data?: SerializedStrap): string {
        let content: string;
        switch (extension) {
            case 'js':
            case 'javascript':
                content = readFileSync(path.resolve(__dirname, '../stub/strap-stub.js'), 'utf-8').replace('%name%', name);
                break;
            case 'json':
            case 'json5':
                content = data ? JSON5.stringify(data, null, 2) : readFileSync(path.resolve(__dirname, '../stub/strap-stub.json'), 'utf-8').replace('%name%', name);
                break;
            case 'yml':
            case 'yaml':
                content = data ? yaml.dump(data) : readFileSync(path.resolve(__dirname, '../stub/strap-stub.yml'), 'utf-8').replace('%name%', name);
                break;
            default:
                throw new Error(`Unknown type: ${extension}`);
        }

        const filename = `${slugify(name)}-strap.${extension}`;
        const strapsFolder = this.userConfig.getStrapsFolder();
        const filepath = path.resolve(strapsFolder, filename);
        if (readdirSync(strapsFolder).includes(filename)) {
            throw new Error(`${filename} already exists in ${strapsFolder}`);
        }

        writeFileSync(filepath, content, 'utf-8');
        return filepath;
    }

    static resolve(config: Config): UserStraps {
        return new UserStraps(UserConfig.resolve(config));
    }
}
