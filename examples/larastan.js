/**
 *
 * @param {import(".").StrapUtilities} util
 * @returns
 */
module.exports = function (util) {
  return {
    name: 'larastan',
    skip: async () => (util.isLaravelProject() ? false : 'Larastan requires a Laravel project'),
    tasks: [
      {
        title: 'Install Larastan',
        skip: async () =>
          (await util.composerHasPackage('nunomaduro/larastan')) ? 'Larastan is already installed' : false,
        task: () => util.composer(['require', 'nunomaduro/larastan', '--dev']),
      },
      {
        title: 'Add phpstan.neon',
        skip: () => (util.fileExists('phpstan.neon') ? 'phpstan.neon already exists' : false),
        task: () =>
          util.writeFile(
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
  `
          ),
      },
    ],
  };
};
