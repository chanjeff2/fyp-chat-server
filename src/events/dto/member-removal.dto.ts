import { AccessChangeEvent } from './access-change-event';

export class MemberRemovalDto extends AccessChangeEvent {
  override type: string = 'member-removal';
}
