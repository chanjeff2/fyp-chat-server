import { AccessChangeEvent } from './access-change-event';

export class PermissionUpdateDto extends AccessChangeEvent {
  override type: string = 'permission-update';
}
