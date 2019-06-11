import { Argv, CommandModule } from 'yargs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandService {
  private _yargs?: Argv;
  private running: boolean = false;

  initialize(metadatas: CommandModule[]) {
    this.yargs.scriptName('cli');
    metadatas.forEach(command => {
      this.yargs.command(command);
    });
  }

  exec() {
    this.yargs.demandCommand(1);
    this.yargs.help('h')
      .alias('h', 'help')
      .alias('v', 'version');
    this.yargs.argv;
  }

  run() {
    this.running = true;
  }

  exit(code?: number) {
    this.running = false;
    process.exit(code);
  }

  get yargs() {
    if (this._yargs === undefined) {
      this._yargs = require('yargs');
    }
    return this._yargs;
  }

  get isRunning() {
    return this.running;
  }
}