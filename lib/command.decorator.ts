import 'reflect-metadata';
import { SetMetadata } from '@nestjs/common';
import { PositionalOptions, Options } from 'yargs';

export const COMMAND_HANDLER_METADATA = '__command-handler-metadata__';
export const COMMAND_ARGS_METADATA = '__command-args-metadata__';
export enum CommandParamTypes {
  POSITIONAL = 'POSITIONAL',
  OPTION = 'OPTION',
  ARGV = 'ARGV',
}

export type CommandParamMetadata<O> = {
  [type in CommandParamTypes]: CommandParamMetadataItem<O>[];
};
export interface CommandParamMetadataItem<O> {
  index: number;
  option: O;
}
const createCommandParamDecorator = <O>(paramtype: CommandParamTypes) => {
  return (option?: O): ParameterDecorator => (target, key, index) => {
    const params = Reflect.getMetadata(COMMAND_ARGS_METADATA, target[key]) || {};
    Reflect.defineMetadata(COMMAND_ARGS_METADATA, {
      ...params,
      [paramtype]: [
        ...params[paramtype] || [],
        { index, option },
      ],
    }, target[key]);
  };
};

export interface CommandMetadata {
  params: CommandParamMetadata<CommnadPositionalOption| CommandOptionsOption>;
  option: CommandOption;
}
export interface CommandOption {
  aliases?: string[] | string;
  command: string[] | string;
  describe?: string | false;
}
export function Command(option: CommandOption): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const metadata: CommandMetadata = {
      params: Reflect.getMetadata(COMMAND_ARGS_METADATA, descriptor.value),
      option,
    };

    SetMetadata(
      COMMAND_HANDLER_METADATA, metadata,
    )(
      target, key, descriptor,
    );
  };
}
export interface CommnadPositionalOption extends PositionalOptions {
  name: string;
}
export const Positional = createCommandParamDecorator<CommnadPositionalOption>(
  CommandParamTypes.POSITIONAL,
);

export interface CommandOptionsOption extends Options {
  name: string;
}
export const Option = createCommandParamDecorator<CommandOptionsOption>(
  CommandParamTypes.OPTION,
);

export const Argv = createCommandParamDecorator(
  CommandParamTypes.ARGV,
);