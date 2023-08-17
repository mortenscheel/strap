/**
 *
 * @param {import(".").StrapUtilities} util
 * @returns function
 */
module.exports = function (util) {
  return {
    name: 'prettier',
    context: async () => {
      const selection = await (
        await util.inquirer()
      ).checkbox({
        message: 'Select plugins',
        choices: [
          {name: 'Blade', value: 'blade'},
          {name: 'TailwindCSS', value: 'tailwind'},
        ],
      });
      return selection.reduce((acc, val) => {
        acc[val] = true;
        return acc;
      }, {});
    },
    tasks: [
      {
        title: 'Install Packages',
        task: ctx => {
          const packages = [
            'prettier',
            ...(ctx.blade ? ['@shufo/prettier-plugin-blade'] : []),
            ...(ctx.tailwind ? ['prettier-plugin-tailwindcss'] : []),
          ];
          return util.exec('npm', ['install', '--save-dev', ...packages]);
        },
      },
      {
        title: 'Generate config',
        skip: () => util.fileExists('.prettierrc'),
        task: ctx => {
          const config = {
            trailingComma: 'es5',
            tabWidth: 4,
            semi: true,
            singleQuote: true,
            plugins: [],
            overrides: [],
          };
          if (ctx.blade) {
            config.plugins.push('@shufo/prettier-plugin-blade');
            config.overrides.push({
              files: ['*.blade.php'],
              options: {
                parser: 'blade',
                tabWidth: 4,
              },
            });
          }

          if (ctx.tailwind) {
            config.plugins.push('prettier-plugin-tailwindcss');
          }

          util.writeFile('.prettierrc', JSON.stringify(config, null, 2) + require('os').EOL);
        },
      },
    ],
  };
};
