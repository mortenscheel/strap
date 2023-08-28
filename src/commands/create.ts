import {Args, Command, Flags} from '@oclif/core';
import UserStraps, {SerializedStrap} from '../straps';
import {util} from '../util';

export default class Create extends Command {
    static description = 'Create a new strap';

    static examples = [
        '<%= config.bin %> <%= command.id %> some-strap',
    ];

    static flags = {
        yaml: Flags.boolean({description: 'Yaml format'}),
        json: Flags.boolean({description: 'JSON format'}),
        js: Flags.boolean({description: 'JavaScript format'}),
        interactive: Flags.boolean({char: 'i', description: 'Create the strap interactively'}),
    };

    static args = {
        name: Args.string({description: 'name of the new strap'}),
    };

    public async run(): Promise<void> {
        const {args, flags} = await this.parse(Create);
        let name = args.name;
        if (!name) {
            name = await util.inquirer.input({message: 'Strap name'});
            if (!name) {
                this.error('No name provided');
            }
        }

        let extension = '';
        if (flags.yaml) {
            extension = 'yml';
        } else if (flags.json) {
            extension = 'json';
        } else if (flags.js) {
            extension = 'js';
        } else {
            const choices = [
                {name: 'Yaml', value: 'yml'},
                {name: 'JSON', value: 'json'},
            ];
            if (!flags.interactive) {
                choices.push({name: 'JavaScript', value: 'js'});
            }

            extension = await util.inquirer.select({message: 'Select a strap format', choices});
            if (!extension) {
                this.error('Format required');
            }
        }

        let data: SerializedStrap | undefined;
        if (flags.interactive) {
            data = {
                name: name!,
                description: await util.inquirer.input({message: 'Strap description (optional)'}),
                tasks: [],
            };
            while (await util.inquirer.confirm({message: 'Add a task?'})) {
                const title = await util.inquirer.input({message: 'Task title'});
                const type = await util.inquirer.select({
                    message: 'Task type',
                    choices: [
                        {name: 'Execute a command', value: 'command'},
                        {name: 'Write a file', value: 'file'},
                    ],
                });
                if (type === 'command') {
                    const command = await util.inquirer.input({message: 'Command'});
                    data.tasks.push({type, title, command});
                } else if (type === 'file') {
                    const filePath = await util.inquirer.input({message: 'File path'});
                    const content = await util.inquirer.editor({message: 'Add the content in the editor, then close the file'});
                    const overwrite = await util.inquirer.confirm({message: 'Overwrite if exists?', default: false});
                    data.tasks.push({type, title, path: filePath, content, overwrite});
                }
            }
        }

        const strapPath = UserStraps.resolve(this.config).create(name, extension, data);
        this.log(strapPath);
        const open = (await import('open')).default;
        await open(strapPath);
    }
}
