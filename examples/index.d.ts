/// <reference types="node" />
import { ExecaReturnValue, Options } from 'execa';
import yaml from 'js-yaml';
import * as fs from 'node:fs';
import inquirer from 'inquirer';
export interface Util {
  execa: (command: string, args?: readonly string[], options?: Options) => Promise<ExecaReturnValue>;
  inquirer: typeof inquirer;
  fs: typeof fs;
  project: {
    isLaravel: () => boolean;
    hasComposerPackage: (packageName: string) => Promise<boolean>;
    hasNpmPackage: (packageName: string) => Promise<boolean>;
  };
  yaml: typeof yaml;
}
export declare const util: Util;
