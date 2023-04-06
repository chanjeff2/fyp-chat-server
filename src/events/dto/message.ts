import { IsString } from 'class-validator';
import { ChatroomEvent } from './chatroom-event';

export abstract class Message extends ChatroomEvent {
  @IsString()
  senderDeviceId: string; // fcm require all field to be string

  @IsString()
  cipherTextType: string;

  @IsString()
  content: string;
}
