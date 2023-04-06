import { IsMongoId } from 'class-validator';
import { ChatroomEvent } from './chatroom-event';

export abstract class AccessChangeEvent extends ChatroomEvent {
  @IsMongoId()
  recipientUserId: string;
}
