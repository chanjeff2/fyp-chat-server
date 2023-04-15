import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsString,
} from 'class-validator';
import { FCMEventType } from 'src/enums/fcm-event-type.enum';
import { IncomingMessageDto } from './incoming-message.dto';

export class SendMessageDto {
  @IsInt()
  senderDeviceId: number;

  @IsMongoId()
  recipientUserId: string;

  @IsString()
  chatroomId: string;

  @IsEnum(FCMEventType)
  messageType: FCMEventType;

  @IsArray()
  @Type(() => IncomingMessageDto)
  messages: IncomingMessageDto[];
}
