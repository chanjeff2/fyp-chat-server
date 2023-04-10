import { IsDateString, IsEnum, IsMongoId } from 'class-validator';
import { FCMEventType } from 'src/enums/fcm-event-type.enum';

export class SendAccessControlDto {
  @IsMongoId()
  targetUserId: string;

  @IsEnum(FCMEventType)
  type: FCMEventType;

  @IsDateString()
  sentAt: string;
}
