import {Command, ux} from '@oclif/core';
import {allStraps} from '../straps';

export default class List extends Command {
  static description = 'List all snaps';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ];

  static flags = {
    ...ux.table.flags(),
  };

  public async run(): Promise<void> {
    const {flags} = await this.parse(List);
    const rows = allStraps(this.config.configDir).map(strap => JSON.parse(JSON.stringify(strap)));
    ux.table(rows, {name: {}}, {
      printLine: this.log.bind(this),
      ...flags,
    });
  }
}
