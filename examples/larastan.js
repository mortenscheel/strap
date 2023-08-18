/**
 *
 * @param {import(".").Util} util
 * @returns
 */
module.exports = function (util) {
  return {
    name: 'larastan',
    skip: async () => (util.project.isLaravel() ? false : 'Larastan requires a Laravel project'),
    context: async () => {
      return await util.inquirer.prompt([
        {
          type: 'number',
          name: 'level',
          message: 'Strictness level (1-9)',
          default: 8,
        },
        {
          type: 'confirm',
          name: 'checkMissingIterableValueType',
          message: 'Check missing iterable value type',
          default: false,
        },
      ]);
    },
    tasks: [
      {
        title: 'Install Larastan',
        skip: async () =>
          (await util.project.hasComposerPackage('nunomaduro/larastan')) ? 'Larastan is already installed' : false,
        task: () => util.execa('composer', ['require', 'nunomaduro/larastan', '--dev']),
      },
      {
        title: 'Generate phpstan.neon',
        skip: () => (util.fs.existsSync('phpstan.neon') ? 'phpstan.neon already exists' : false),
        task: (ctx) => {
          const config = {
            includes: ['./vendor/nunomaduro/larastan/extension.neon'],
            parameters: {
              paths: ['app/'],
              level: ctx.level,
              excludePaths: [],
              checkMissingIterableValueType: ctx.checkMissingIterableValueType,
            },
          };
          util.fs.writeFileSync('phpstan.neon', util.yaml.dump(config), 'utf-8');
        },
      },
    ],
  };
};
