import { IsDateString, IsMongoId, IsString } from 'class-validator';
import { FCMEvent } from './fcm-event';

export abstract class ChatroomEvent extends FCMEvent {
  @IsMongoId()
  senderUserId: string;
  
  @IsString()
  chatroomId: string;

  @IsDateString()
  sentAt: string; // iso string
}