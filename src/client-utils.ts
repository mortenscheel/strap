// @ts-expect-error Not allowed to import ESM types from CJS
import {ExecaReturnValue, Options} from 'execa';
import type {checkbox, confirm, editor, expand, input, password, rawlist, select} from '@inquirer/prompts';
import yaml from 'js-yaml';

interface Inquirer {
  checkbox: typeof checkbox;
  confirm: typeof confirm;
  editor: typeof editor;
  expand: typeof expand;
  input: typeof input;
  password: typeof password;
  rawlist: typeof rawlist;
  select: typeof select;
}

export interface StrapUtilities {
  exec: (binary: string, args: string[], options?: Options) => Promise<ExecaReturnValue>;
  execString: (commandString: string, options?: Options) => Promise<ExecaReturnValue>;
  composer: (args: string[], options?: Options) => Promise<ExecaReturnValue>;
  composerHasPackage: (name: string) => Promise<boolean>;
  fileExists: (path: string) => boolean;
  readFile: (path: string) => string;
  readJson: <T = Record<string, unknown>>(path: string) => T;
  writeFile: (path: string, content: string) => void;
  isLaravelProject: () => boolean;
  sleep: (ms: number) => Promise<void>;
  inquirer: () => Promise<Inquirer>;
  yaml: typeof yaml;
}
