/**
 * @param {import('./types').StrapUtils} util
 * @returns {import('./types').Strap}
 */
module.exports = util => ({
    name: '%name%',
    context: async () => {
    // Optionally add values to the context object passed to tasks
        return {};
    },
    skip: async () => false, // Return true (or string) if this strap shouldn't run
    tasks: [
    // See https://github.com/SBoudrias/Inquirer.js
    ],
});
