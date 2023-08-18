/**
 *
 * @param {import(".").Util} util
 * @returns
 */
module.exports = function (util) {
  return {
    name: 'laravel-debugbar',
    tasks: [
      {
        title: 'Install composer dependencies',
        task: () => util.execa('composer', ['require', '--dev', 'barryvdh/laravel-debugbar']),
        skip: () => util.project.hasComposerPackage('barryvdh/laravel-debugbar'),
      },
      {
        title: 'Publish config',
        task: () => util.execa('php', ['artisan', 'vendor:publish', '--provider=Barryvdh\\Debugbar\\ServiceProvider']),
        skip: () => util.fs.existsSync('config/debugbar.php'),
      },
    ],
  };
};
