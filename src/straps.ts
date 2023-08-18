import Listr, {ListrContext, ListrOptions, ListrTask} from 'listr';
import path from 'node:path';
import {copyFileSync, readFileSync, existsSync, mkdirSync, readdirSync, writeFileSync} from 'node:fs';
import {util} from './util';
import slugify from 'slugify';

export interface Strap {
  name: string;
  tasks: ListrTask[];
  skip?: () => Promise<string | boolean> | Promise<string | boolean>[];
  context?: () => Promise<ListrContext>;
  options?: ListrOptions;
}

let straps: Strap[] | null = null;

const ensureConfigExists = (configDir: string): void => {
  const strapsFolder = path.resolve(configDir, 'straps');
  if (!existsSync(strapsFolder)) {
    mkdirSync(strapsFolder, {recursive: true});
    // Add util.d.ts
    copyFileSync(
      // eslint-disable-next-line unicorn/prefer-module
      path.resolve(__dirname, '../dist/client-utils.d.ts'),
      path.resolve(strapsFolder, 'index.d.ts'),
    );
  }
};

export const allStraps = (configDir: string): Strap[] => {
  if (straps === null) {
    straps = [];
    ensureConfigExists(configDir);
    const strapsFolder = path.resolve(configDir, 'straps');
    for (const file of readdirSync(strapsFolder)) {
      const filePath = path.resolve(strapsFolder, file);
      if (/\.js$/.test(file)) {
        // eslint-disable-next-line unicorn/prefer-module
        let strap = require(filePath);
        if (typeof strap === 'function') {
          strap = strap(util);
        }

        strap.tasks = strap.tasks.map((task: ListrTask) => prepareStrapTask(task));
        straps.push(strap);
      }
    }
  }

  return straps;
};

export const resolveStrap = async (
  name: string,
  configDir: string,
): Promise<Strap | null> => allStraps(configDir).find(strap => strap.name === name) || null;

/**
 * Convert tasks in array form to Listr
 * @param {ListrTask} task Task or array of tasks
 * @returns ListrTask
 */
const prepareStrapTask = (task: ListrTask): ListrTask => {
  if (Array.isArray(task.task)) {
    const tasks = task.task.map(task => prepareStrapTask(task));
    task.task = () => new Listr(tasks);
  }

  return task;
};

export const createStrap = (name: string, configDir: string): string => {
  ensureConfigExists(configDir);
  const strapsFolder = path.resolve(configDir, 'straps');
  const filename = slugify(name) + '.js';
  const filepath = path.resolve(strapsFolder, filename);
  if (readdirSync(strapsFolder).includes(filename)) {
    throw new Error(`${filename} already exists in ${strapsFolder}`);
  }

  // eslint-disable-next-line unicorn/prefer-module
  const content = readFileSync(path.resolve(__dirname, '../stub/strap-stub.js'), 'utf-8').replace('%name%', name);
  writeFileSync(filepath, content, 'utf-8');
  return filepath;
};
