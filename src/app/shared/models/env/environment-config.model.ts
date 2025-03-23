import {IsEnum, IsOptional, IsPort} from 'class-validator';
import {NodeEnvironment} from '../env';

export class EnvironmentConfig {
  @IsOptional()
  @IsPort()
  PORT = `3000`;

  @IsOptional()
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.DEV;
}
