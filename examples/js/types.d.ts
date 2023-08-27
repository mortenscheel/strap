/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference types="node" />
import {ExecaReturnValue, Options} from 'execa';
import yaml from 'js-yaml';
import * as fs from 'node:fs';
import * as inquirer from '@inquirer/prompts';
import Listr from 'listr';
import type {ListrOptions as _ListrOptions, ListrTask as _ListrTask} from 'listr';
import * as os from 'node:os';

declare global {
    type ListrContext = any;

    export interface ListrOptions extends _ListrOptions {
    }

    export interface ListrTask extends _ListrTask {
    }

    export interface StrapUtils {
        execa: (command: string, args?: readonly string[], options?: Options) => Promise<ExecaReturnValue>;
        inquirer: typeof inquirer;
        Listr: typeof Listr;
        fs: typeof fs;
        os: typeof os;
        project: {
            isLaravel: () => boolean;
            hasComposerPackage: (packageName: string) => Promise<boolean>;
            hasNpmPackage: (packageName: string) => Promise<boolean>;
        };
        yaml: typeof yaml;
    }

    export interface Strap {
        name: string;
        description?: string;
        tasks: ListrTask[];
        skip?: () => Promise<string | boolean> | Promise<string | boolean>[];
        context?: () => Promise<ListrContext>;
        options?: ListrOptions;
    }
}
