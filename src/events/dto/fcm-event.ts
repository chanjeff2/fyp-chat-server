import { IsString } from 'class-validator';

export abstract class FCMEvent {
  @IsString()
  type: string;
}