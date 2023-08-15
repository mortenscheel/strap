import {Args, Command} from '@oclif/core';
import {findStrap} from '../straps';
import Listr, {ListrContext} from 'listr';

export default class Install extends Command {
  static description = 'Install a strap';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ];

  static args = {
    name: Args.string({description: 'Name of the strap to install', required: true}),
  };

  public async run(): Promise<void> {
    const {args} = await this.parse(Install);
    const name = args.name;
    const strap = findStrap(name);
    if (!strap) {
      this.log(`${name} not found`);
      this.exit(1);
    }

    if (strap.skip) {
      const skipMessage = await strap.skip();
      if (skipMessage) {
        this.error(skipMessage);
      }
    }

    let context: ListrContext = {};
    if (strap?.context) {
      context = await strap.context();
    }

    const tasks = new Listr(strap.tasks);
    tasks.run(context)
    .catch(error => {
      console.error(error);
    });

    this.log('ok');
  }
}
