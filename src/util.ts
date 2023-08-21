import execa, {ExecaReturnValue, Options} from 'execa';
import yaml from 'js-yaml';
import * as fs from 'node:fs';
import {Package} from './types/composer';
import * as inquirer from '@inquirer/prompts';
import Listr from 'listr';
import * as os from 'node:os';

const readJson = <T = Record<string, unknown>>(path: string): T => JSON.parse(fs.readFileSync(path, 'utf-8'));

export interface StrapUtils {
    execa: (command: string, args?: readonly string[], options?: Options) => Promise<ExecaReturnValue>;
    inquirer: typeof inquirer;
    Listr: typeof Listr,
    fs: typeof fs;
    os: typeof os;
    project: {
        isLaravel: () => boolean;
        hasComposerPackage: (packageName: string) => Promise<boolean>;
        hasNpmPackage: (packageName: string) => Promise<boolean>;
    },
    yaml: typeof yaml,
}

export const util: StrapUtils = {
    execa: execa,
    inquirer: inquirer,
    Listr: Listr,
    fs: fs,
    os: os,
    project: {
        isLaravel: (): boolean => {
            try {
                const data = readJson<Package>('composer.json');
                const packages = Object.keys(data.require!);
                return packages.includes('laravel/framework');
            } catch {
                return false;
            }
        },
        hasComposerPackage: async (packageName: string): Promise<boolean> => {
            try {
                await execa('composer', ['show', packageName]);
                return true;
            } catch {
                return false;
            }
        },
        hasNpmPackage: async (packageName: string): Promise<boolean> => {
            try {
                const {stdout} = await execa('npm', ['list', '--depth=0', packageName]);
                return new RegExp(packageName).test(stdout);
            } catch {
                return false;
            }
        },
    },
    yaml: yaml,
};
