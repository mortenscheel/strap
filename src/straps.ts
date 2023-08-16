import Listr, {ListrContext, ListrOptions, ListrTask} from 'listr';
import path from 'node:path';
import {existsSync, readdirSync, mkdirSync, copyFileSync} from 'node:fs';
import * as util from './util';
import {Config} from '@oclif/core';

export interface Strap {
  name: string;
  tasks: ListrTask[];
  skip?: () => Promise<string | boolean> | Promise<string | boolean>[];
  context?: () => Promise<ListrContext>;
  options?: ListrOptions
}

let straps: Strap[] | null = null;

export const resolveStrap = async (name: string, config: Config): Promise<Strap | null> => {
  if (straps === null) {
    straps = [];
    const strapsFolder = path.resolve(config.configDir, 'straps');
    if (!existsSync(strapsFolder)) {
      mkdirSync(strapsFolder, {recursive: true});
      // Add util.d.ts
      copyFileSync(
        // eslint-disable-next-line unicorn/prefer-module
        path.resolve(__dirname, '../dist/client-utils.d.ts'),
        path.resolve(strapsFolder, 'index.d.ts'),
      );
    }

    for (const file of readdirSync(strapsFolder)) {
      const filePath = path.resolve(strapsFolder, file);
      if (/\.js$/.test(file)) {
        // eslint-disable-next-line unicorn/prefer-module
        let imported = require(filePath);
        if (typeof imported === 'function') {
          imported = imported(util);
        }

        for (const strap of Array.isArray(imported) ? imported : [imported]) {
          strap.tasks = strap.tasks.map((task: ListrTask) => parseTask(task));
          straps.push(strap);
        }
      }
    }
  }

  return straps.find(strap => strap.name === name) || null;
};

const parseTask = (task:ListrTask): ListrTask => {
  if (Array.isArray(task.task)) {
    const tasks = task.task.map(task => parseTask(task));
    task.task = () => new Listr(tasks);
  }

  return task;
};
