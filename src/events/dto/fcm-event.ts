import { IsString } from 'class-validator';
import { FCMEventType } from 'src/enums/fcm-event-type.enum';

export abstract class FCMEvent {
  @IsString()
  type: FCMEventType;
}
