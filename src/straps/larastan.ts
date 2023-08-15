import {Strap} from './index';
import {composer, composerHasPackage, fileExists, isLaravelProject, writeFile} from '../util';

export const larastan: Strap = {
  name: 'larastan',
  skip: async () => isLaravelProject() ? false : 'Larastan requires a Laravel project',
  context: async () => {
    const selection = await (await import('@inquirer/prompts')).checkbox({
      message: 'Select steps',
      choices: [
        {name: 'Install', value: 'install'},
        {name: 'Config', value: 'config'},
      ],
    });
    return {
      install: selection.includes('install'),
      config: selection.includes('config'),
    };
  },
  tasks: [
    {
      title: 'Install Larastan',
      skip: async () => await composerHasPackage('nunomaduro/larastan') ? 'Larastan is already installed' : false,
      task: () => composer(['require', 'nunomaduro/larastan', '--dev']),
    },
    {
      title: 'Add phpstan.neon',
      skip: () => fileExists('phpstan.neon') ? 'phpstan.neon already exists' : false,
      task: () => writeFile(
        'phpstan.neon',
        `
includes:
    - ./vendor/nunomaduro/larastan/extension.neon

parameters:
    paths:
        - app/

    # Level 9 is the highest level
    level: 8

    excludePaths:
    #    - ./app/Console/Commands/Local/*

    checkMissingIterableValueType: false
`),
    },
  ],
};
