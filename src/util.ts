import execa from 'execa';
import {ExecaReturnValue, Options} from 'execa';
import yaml from 'js-yaml';
import * as fs from 'node:fs';
import inquirer from 'inquirer';
import {Package} from './types/composer';

const readJson = <T = Record<string, unknown>>(path: string): T => JSON.parse(fs.readFileSync(path, 'utf-8'));

export interface Util {
  execa: (command: string, args?: readonly string[], options?: Options) => Promise<ExecaReturnValue>,
  inquirer: typeof inquirer,
  fs: typeof fs,
  project: {
    isLaravel: () => boolean,
    hasComposerPackage: (packageName: string) => Promise<boolean>,
    hasNpmPackage: (packageName: string) => Promise<boolean>,
  },
  yaml: typeof yaml,
}

export const util:Util = {
  execa: execa,
  inquirer: inquirer,
  fs: fs,
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
