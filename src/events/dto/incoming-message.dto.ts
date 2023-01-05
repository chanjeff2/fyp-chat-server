import { IsInt, IsString } from 'class-validator';

export class IncomingMessageDto {
  @IsInt()
  cipherTextType: number;

  @IsInt()
  recipientDeviceId: number;

  @IsInt()
  recipientRegistrationId: number;

  @IsString()
  content: string;
}
