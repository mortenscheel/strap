import {Args, Command} from '@oclif/core';
import path from 'node:path';
import slugify from 'slugify';
import {existsSync} from 'node:fs';
import inquirer from 'inquirer';

export default class Edit extends Command {
  static description = 'edit a strap file';

  static examples = [
    '<%= config.bin %> <%= command.id %> some-strap',
  ];

  static args = {
    name: Args.string({description: 'strap name', required: true}),
  };

  public async run(): Promise<void> {
    const {args} = await this.parse(Edit);
    const sel = await inquirer.prompt({
      type: 'checkbox',
      name: 'c',
      message: 'Select plugins',
      choices: [
        {name: 'PHPUnit', value: 'phpunit'},
        {name: 'PhpStan', value: 'phpstan'},
        {name: 'Composer Normalize', value: 'normalize'},
        {name: 'Pint', value: 'pint'},
      ],
    });
    this.log(sel);
    this.exit();
    const name = args.name;
    const filePath = path.resolve(this.config.configDir, `straps/${slugify(name)}.js`);
    if (!existsSync(filePath)) {
      this.error(`${filePath} not found`);
    }

    const open = (await import('open')).default;
    await open(filePath);
  }
}
