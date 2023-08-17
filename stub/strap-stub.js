/**
 * @param {import('.').StrapUtilities} util
 * @returns function
 */
module.exports = function (util) {
  return {
    name: '%name%',
    context: () => {
      // Optionally add values to the context object passed to tasks
      return {};
    },
    skip: () => false, // Return true (or string) if this strap shouldn't run
    tasks: [
      // See https://github.com/SamVerschueren/listr
    ],
  };
};
