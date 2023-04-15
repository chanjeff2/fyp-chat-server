import { IsDateString, IsMongoId } from 'class-validator';

export class SyncUserDto {
  @IsMongoId()
  _id: string;

  @IsDateString()
  updatedAt: string;
}
