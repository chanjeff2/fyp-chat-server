import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { GroupType } from 'src/enums/group-type.enum';
import { Group } from 'src/models/group.model';

@Exclude()
export class GroupInfoDto {
  @Expose()
  @IsMongoId()
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @Expose()
  @IsEnum(GroupType)
  groupType: GroupType;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsDateString()
  createdAt: string;

  static from(group: Group): GroupInfoDto {
    return plainToInstance(GroupInfoDto, group);
  }
}
