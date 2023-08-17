import {Args, Command} from '@oclif/core';
import {resolveStrap} from '../straps';
import Listr, {ListrContext} from 'listr';

export default class Install extends Command {
  static description = 'install a strap';

  static examples = [
    '<%= config.bin %> <%= command.id %> some-strap',
  ];

  static args = {
    name: Args.string({description: 'Name of the strap to install', required: true}),
  };

  public async run(): Promise<void> {
    const {args} = await this.parse(Install);
    const name = args.name;
    const strap = await resolveStrap(name, this.config.configDir);
    if (!strap) {
      this.log(`${name} not found`);
      this.exit(1);
    }

    if (strap.skip) {
      const skips = Array.isArray(strap.skip) ? strap.skip : [strap.skip];
      for (const skip of skips) {
        // eslint-disable-next-line no-await-in-loop
        const skipReason = await skip();
        if (skipReason) {
          this.log(skipReason);
          this.exit(1);
        }
      }
    }

    let context: ListrContext = {};
    if (strap?.context) {
      context = await strap.context();
    }

    const tasks = new Listr(strap.tasks, strap.options || {});
    tasks.run(context)
    .catch(error => {
      this.error(error);
    });
  }
}
