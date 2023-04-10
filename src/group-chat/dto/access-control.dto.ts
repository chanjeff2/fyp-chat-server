import { IsMongoId } from 'class-validator';
import { ChatroomEvent } from '../../events/dto/chatroom-event';

export class AccessControlDto extends ChatroomEvent {
  @IsMongoId()
  targetUserId: string;
}
