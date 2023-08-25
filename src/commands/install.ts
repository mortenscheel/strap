/* eslint-disable no-await-in-loop */
import {Args, Command} from '@oclif/core';
import UserStraps from '../straps';
import Listr, {ListrContext} from 'listr';
import {util} from '../util';

export default class Install extends Command {
    static description = 'install a strap';

    static examples = [
        '<%= config.bin %> <%= command.id %> some-strap',
    ];

    static args = {
        name: Args.string({description: 'Name of the strap to install'}),
    };

    public async run(): Promise<void> {
        const {args} = await this.parse(Install);
        let name = args.name;
        const userStraps = UserStraps.resolve(this.config);
        if (!name) {
            name = await util.inquirer.select({
                message: 'Select strap',
                choices: userStraps.straps.map(strap => ({
                    name: strap.name,
                    value: strap.name,
                    description: strap.description,
                })),
            });
        }

        const strap = userStraps.findStrap(name);
        if (!strap) {
            this.log(`${name} not found`);
            this.exit(1);
        }

        if (strap.skip) {
            const skipTests = Array.isArray(strap.skip) ? strap.skip : [strap.skip];
            for (const skipTest of skipTests) {
                const skipReason = await skipTest();
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
        await tasks.run(context)
            .catch(error => {
                this.error(error);
            });
    }
}
