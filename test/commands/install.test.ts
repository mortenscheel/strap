import {expect, test} from '@oclif/test';

describe('install', () => {
  test
  .stdout()
  .command(['install', 'foo'])
  .exit(1)
  .it('fails with unknown strap', ctx => {
    expect(ctx.stdout).to.contain('foo not found');
  });

  test
  .command(['install'])
  .exit(2)
  .it('requires strap name');
});
