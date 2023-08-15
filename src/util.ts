// @ts-expect-error Not allowed to import ESM types from CJS
import type {ExecaReturnValue, Options} from 'execa';
import {existsSync, readFileSync} from 'node:fs';
import {Package} from './types/composer';
import {writeFileSync} from 'node:fs';

export const exec = async (
  binary: string,
  args: string[],
  options: Options = {},
): Promise<ExecaReturnValue> => (await import('execa')).execa(binary, args, options || {});

export const execString = async (
  commandString: string,
  options: Options = {},
): Promise<ExecaReturnValue> => {
  const parts = commandString.split(' ');
  const command = <string>parts.shift();
  return exec(command, parts, options);
};

export const composer = async (
  args: string[],
  options: Options = {},
): Promise<ExecaReturnValue> => {
  if (!args.some(arg => arg === '--ansi' || arg === '--no-ansi')) {
    args.push('--ansi');
  }

  return exec('composer', args, options);
};

export const composerHasPackage = async (name: string): Promise<boolean> => {
  try {
    await composer(['show', name]);
    return true;
  } catch {
    return false;
  }
};

export const fileExists = (path: string): boolean => existsSync(path);

export const readFile = (path: string): string => {
  if (!fileExists(path)) {
    throw new Error(`${path} not found`);
  }

  return readFileSync(path, 'utf-8');
};

export const writeFile = (path: string, content: string): void => writeFileSync(path, content, 'utf-8');

export const readJson = <T = Record<string, unknown>>(path: string): T => JSON.parse(readFile(path));

export const isLaravelProject = (): boolean => {
  try {
    const data = readJson<Package>('composer.json');
    const packages = Object.keys(data.require!);
    return packages.includes('laravel/framework');
  } catch {
    return false;
  }
};

export const sleep = async (ms: number): Promise<void> => new Promise(resolve => {
  setTimeout(resolve, ms);
});
