import { Injectable } from '@nestjs/common';
import { CommandService } from './command.service';

@Injectable()
export class CommandLogService {
  constructor(
    private readonly commandService: CommandService,
  ) {}

  log(message: string) {
    if (!this.isRunning) return;
    console.log(message);
  }

  error(message: string, trace: string) {
    if (!this.isRunning) return;
    console.error(message, trace);
  }

  warn(message: string) {
    if (!this.isRunning) return;
    console.warn(message);
  }

  private get isRunning(): boolean {
    return this.commandService.isRunning;
  }
}