import { IsDate, IsInt, IsMongoId, IsString } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  senderDeviceId: number;

  @IsMongoId()
  recipientUserId: string;

  @IsInt()
  recipientDeviceId: number;

  @IsString()
  content: string;

  @IsDate()
  sentAt: Date;
}
