import { IsDateString, IsMongoId } from 'class-validator';

export class SyncGroupDto {
  @IsMongoId()
  _id: string;

  @IsDateString()
  updatedAt: string;
}
