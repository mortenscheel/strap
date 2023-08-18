import {Args, Command} from '@oclif/core';
import inquirer from 'inquirer';
import {createStrap} from '../straps';

export default class Create extends Command {
  static description = 'Create a new strap';

  static examples = [
    '<%= config.bin %> <%= command.id %> some-strap',
  ];

  static args = {
    name: Args.string({description: 'name of the new strap'}),

  };

  public async run(): Promise<void> {
    const {args} = await this.parse(Create);
    let name = args.name;
    if (!name) {
      name = (await inquirer.prompt({type: 'input', name: 'name', message: 'Name of the new strap?'})).name;
      if (!name) {
        this.error('No name provided');
      }
    }

    const strapPath = createStrap(name, this.config.configDir);
    this.log(strapPath);
    const open = (await import('open')).default;
    await open(strapPath);
  }
}
