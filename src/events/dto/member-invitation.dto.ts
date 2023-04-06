import { AccessChangeEvent } from './access-change-event';

export class MemberInvitationDto extends AccessChangeEvent {
  override type: string = 'member-invitation';
}
