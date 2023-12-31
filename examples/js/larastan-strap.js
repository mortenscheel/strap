/**
 * @param {import('./types').StrapUtils} util
 * @returns {import('./types').Strap}
 */
module.exports = (util) => ({
    name: "larastan",
    description: "Static analysis for Laravel",
    skip: async () =>
        util.project.isLaravel()
            ? false
            : "Larastan requires a Laravel project",
    context: async () => {
        const level = await util.inquirer.input({
            message: "Select level [1-9]",
            default: "8",
            validate: (value) => /^[1-9]$/.test(value),
        });
        const checkMissingIterableValueType = await util.inquirer.confirm({
            message: "Check missing iterable value type",
            default: false,
        });
        return { level, checkMissingIterableValueType };
    },
    tasks: [
        {
            title: "Install Larastan",
            skip: async () =>
                (await util.project.hasComposerPackage("larastan/larastan"))
                    ? "Larastan is already installed"
                    : false,
            task: () =>
                util.execa("composer", [
                    "require",
                    "larastan/larastan",
                    "--dev",
                ]),
        },
        {
            title: "Generate phpstan.neon",
            skip: () =>
                util.fs.existsSync("phpstan.neon")
                    ? "phpstan.neon already exists"
                    : false,
            task: (ctx) => {
                const config = {
                    includes: ["./vendor/larastan/larastan/extension.neon"],
                    parameters: {
                        paths: ["app/"],
                        level: parseInt(ctx.level),
                        excludePaths: [],
                        checkMissingIterableValueType:
                            ctx.checkMissingIterableValueType,
                    },
                };
                util.fs.writeFileSync(
                    "phpstan.neon",
                    util.yaml.dump(config),
                    "utf-8"
                );
            },
        },
    ],
});
