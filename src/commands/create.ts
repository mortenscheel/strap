import {Args, Command} from '@oclif/core';
import UserStraps from '../straps';
import {util} from '../util';

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
            name = await util.inquirer.input({message: 'Name'});
            if (!name) {
                this.error('No name provided');
            }
        }

        const strapPath = UserStraps.resolve(this.config).create(name);
        this.log(strapPath);
        const open = (await import('open')).default;
        await open(strapPath);
    }
}
