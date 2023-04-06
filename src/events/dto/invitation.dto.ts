import { ChatroomEvent } from './chatroom-event';

export class InvitationDto extends ChatroomEvent {
  override type: string = 'invitation';
}
