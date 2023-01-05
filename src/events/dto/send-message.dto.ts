import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsMongoId,
  IsString,
} from 'class-validator';
import { IncomingMessageDto } from './incoming-message.dto';

export class SendMessageDto {
  @IsInt()
  senderDeviceId: number;

  @IsMongoId()
  recipientUserId: string;

  @IsArray()
  @Type(() => IncomingMessageDto)
  messages: IncomingMessageDto[];

  @IsDateString()
  sentAt: string; // iso string
}
