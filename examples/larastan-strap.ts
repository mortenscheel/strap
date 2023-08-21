/// <reference types="./types" />

export default (util: StrapUtils): Strap => ({
    name: 'larastan',
    skip: async () => (util.project.isLaravel() ? false : 'Larastan requires a Laravel project'),
    context: async () => {
        const level = await util.inquirer.input({
            message: 'Select level [1-9]',
            default: 8,
            validate: (value: string) => /^[1-9]$/.test(value),
        });
        const checkMissingIterableValueType = await util.inquirer.confirm({
            message: 'Check missing iterable value type',
            default: false,
        });
        return {level, checkMissingIterableValueType};
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
            task: (ctx: Record<string, unknown>) => {
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
});
