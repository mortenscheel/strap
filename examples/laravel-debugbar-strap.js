/**
 * @param {import('./types').StrapUtils} util
 * @returns {import('./types').Strap}
 */
module.exports = util => ({
    name: 'laravel-debugbar',
    skip: async () => util.project.hasComposerPackage('barryvdh/laravel-debugbar'),
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
});
