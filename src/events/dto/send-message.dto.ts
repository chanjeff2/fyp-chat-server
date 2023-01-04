import { IsDateString, IsInt, IsMongoId, IsString } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  senderDeviceId: number;

  @IsMongoId()
  recipientUserId: string;

  @IsInt()
  recipientDeviceId: number;

  @IsInt()
  cipherTextType: number;

  @IsString()
  content: string;

  @IsDateString()
  sentAt: string; // iso string
}
