import {Args, Command} from '@oclif/core';
import {inquirer} from '../util';
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
    this.log('name: ' + name);
    if (!name) {
      name = await (await inquirer()).input({message: 'Name of the new strap?'});
      if (!name) {
        this.error('No name provided');
      }
    }

    this.log('name: ' + name);

    const strapPath = createStrap(name, this.config.configDir);
    const open = (await import('open')).default;
    await open(strapPath);
  }
}
