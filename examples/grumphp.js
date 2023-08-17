/**
 *
 * @param {import(".").StrapUtilities} util
 * @returns
 */
module.exports = function (util) {
  return {
    name: 'grumphp',
    context: async () => {
      const selection = await (
        await util.inquirer()
      ).checkbox({
        message: 'Select pre-commit checks',
        choices: [
          { name: 'PHPUnit', value: 'phpunit' },
          { name: 'PhpStan', value: 'phpstan' },
          { name: 'Composer Normalize', value: 'normalize' },
          { name: 'Pint', value: 'pint' },
        ],
      });
      return selection.reduce(
        (acc, val) => {
          acc[val] = true;
          return acc;
        },
        {
          configExists: util.fileExists('grumphp.yml'),
        }
      );
    },
    tasks: [
      {
        title: 'Install GrumPHP',
        skip: () => util.composerHasPackage('phpro/grumphp'),
        task: [
          {
            title: 'Enable composer plugin',
            task: () => util.execString('composer config --no-plugins allow-plugins.phpro/grumphp true'),
          },
          {
            title: 'Install package',
            task: () => util.composer(['require', '--dev', 'phpro/grumphp']),
          },
        ],
      },
      {
        title: 'Install Pint plugin',
        enabled: (ctx) => !!ctx.pint,
        task: () => util.composer(['require', '--dev', 'yieldstudio/grumphp-laravel-pint']),
        skip: () => util.composerHasPackage('yieldstudio/grumphp-laravel-pint'),
      },
      {
        title: 'Install Composer Normalizer',
        enabled: (ctx) => !!ctx.normalize,
        skip: () => util.composerHasPackage('ergebnis/composer-normalize'),
        task: [
          {
            title: 'Enable composer plugin',
            task: () => util.execString('composer config --no-plugins allow-plugins.ergebnis/composer-normalize true'),
          },
          {
            title: 'Install package',
            task: () => util.composer(['require', '--dev', 'ergebnis/composer-normalize']),
          },
        ],
      },
      {
        title: 'Generate config',
        skip: (ctx) => (ctx.configExists ? 'grumphp.yml already exists' : false),
        task: (ctx) => {
          const config = {
            extensions: [],
            tasks: {},
          };
          if (ctx.pint) {
            config.extensions.push('YieldStudio\\GrumPHPLaravelPint\\ExtensionLoader');
            config.tasks.laravel_pint = null;
          }
          if (ctx.normalize) {
            config.tasks.composer_normalize = null;
          }
          if (ctx.phpstan) {
            config.tasks.phpstan = {
              memory_limit: '-1',
              use_grumphp_paths: false,
            };
          }
          if (ctx.phpunit) {
            config.tasks.phpunit = null;
          }
          const yaml = util.yaml.dump({ grumphp: config });
          util.writeFile('grumphp.yml', yaml);
        },
      },
    ],
  };
};
