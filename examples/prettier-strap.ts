/// <reference types="./types" />

export default (util: StrapUtils): Strap => ({
    name: 'prettier',
    context: async () => {
        const selection = await util.inquirer.checkbox({
            message: 'Select plugins (optional)',
            choices: [
                {name: 'Blade', value: 'blade'},
                {name: 'TailwindCSS', value: 'tailwind'},
            ],
        });

        return selection.reduce((acc: Record<string, boolean>, val: string) => {
            acc[val] = true;
            return acc;
        }, {});
    },
    tasks: [
        {
            title: 'Install Packages',
            task: (ctx: Record<string, boolean>) => {
                const packages = [
                    'prettier',
                    ...(ctx.blade ? ['@shufo/prettier-plugin-blade'] : []),
                    ...(ctx.tailwind ? ['prettier-plugin-tailwindcss'] : []),
                ];
                return util.execa('npm', ['install', '--save-dev', ...packages]);
            },
        },
        {
            title: 'Generate config',
            skip: () => util.fs.existsSync('.prettierrc'),
            task: (ctx: Record<string, boolean>) => {
                const config: {
                    trailingComma: string;
                    tabWidth: number;
                    semi: boolean;
                    singleQuote: boolean;
                    plugins: string[],
                    overrides: Record<string, unknown>[],
                } = {
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

                util.fs.writeFileSync('.prettierrc', JSON.stringify(config, null, 2) + util.os.EOL, 'utf-8');
            },
        },
    ],
});
