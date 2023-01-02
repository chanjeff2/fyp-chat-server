import { IsDateString, IsMongoId, IsString } from 'class-validator';

export class MessageDto {
  @IsMongoId()
  senderUserId: string;

  @IsString()
  senderDeviceId: string; // fcm require all field to be string

  @IsString()
  content: string;

  @IsDateString()
  sentAt: string; // iso string
}
