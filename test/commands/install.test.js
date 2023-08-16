"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@oclif/test");
describe('install', () => {
    test_1.test
        .stdout()
        .command(['install', 'foo'])
        .exit(1)
        .it('fails with unknown strap', ctx => {
        (0, test_1.expect)(ctx.stdout).to.contain('foo not found');
    });
    test_1.test
        .command(['install'])
        .exit(2)
        .it('requires strap name');
});
//# sourceMappingURL=install.test.js.map