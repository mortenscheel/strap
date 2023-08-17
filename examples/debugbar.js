/**
 *
 * @param {import(".").StrapUtilities} util
 * @returns
 */
module.exports = function (util) {
  return {
    name: 'laravel-debugbar',
    tasks: [
      {
        title: 'Install composer dependencies',
        task: () => util.execString('composer require --dev barryvdh/laravel-debugbar'),
        skip: () => util.composerHasPackage('barryvdh/laravel-debugbar'),
      },
      {
        title: 'Publish config',
        task: () => util.execString('php artisan vendor:publish --provider=Barryvdh\\Debugbar\\ServiceProvider'),
        skip: () => util.fileExists('config/debugbar.php'),
      },
    ],
  };
};
