import { IsDateString, IsMongoId } from 'class-validator';

export class sendInvitationDto {
  @IsMongoId()
  target: string;

  @IsDateString()
  sentAt: string;
}
