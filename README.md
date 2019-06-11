# Nestjs Command

## Description

[Nest.js](https://github.com/nestjs/nest) Command tools, base on [yargs](https://github.com/yargs/yargs)

## Dependency
- Use version `1.*` for nestjs `6.*`
- Use version `0.*` for nestjs `5.*`

## Installation

```bash
$ npm install --save nestjs-command

# if use typescript
$ npm install --save-dev @types/yargs
```

## Quick Start

Register the command module in base module: `/src/app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

@Module({
  imports: [
    CommandModule,
  ],
})
export class AppModule {}

```

Create a Init File: `/src/cli.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CoreModule } from './core/core.module'; // Base module
import { QuietLogger } from './core/services/quiet-logger.service'; // Custom Logger

(async () => {
  const app = await NestFactory.createApplicationContext(CoreModule);
  app.select(CommandModule).get(CommandService).exec();
})();

```

~~Create cli file: `/bin/cli`~~

Use `nestjs-command` to exec command (instead `/bin/cli`)

- `npx nestjs-command`: run by default `/src/cli.ts`
- `CLI_PATH=./dist/cli.js npx nestjs-command`: run `/dist/cli.js` by env `CLI_PATH`

# Usage

Create a simple Command File: `/src/user/user.command.ts`

```typescript
import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UserCommand {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Command({ command: 'create:user <account>', describe: 'create a user' })
  async create(
    @Positional({
      name: 'account',
      describe: 'the user account string',
      type: 'string',
    }) account: string,
  ) {
    const user = await this.userService.create(account);
    console.log(user);
  }
}

```

Register UserCommand class as provider in base module: `/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserCommand } from "./user/user.command";

@Module({
  imports: [
    CommandModule,
  ],
  providers: [
    UserCommand
  ]
})
export class AppModule {}

```


Run cli in terminal

```bash
npx nestjs-command create:user my-first-user
```

