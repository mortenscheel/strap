/// <reference types="./types" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (util: StrapUtils): Strap => ({
    name: '%name%',
    context: async () => {
    // Optionally add values to the context object passed to tasks
        return {};
    },
    skip: async () => false, // Return true (or string) if this strap shouldn't run
    tasks: [
    // See https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer
    ],
});
