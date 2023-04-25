import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
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
  @IsBoolean()
  isPublic: boolean;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsUrl()
  @IsOptional()
  profilePicUrl?: string;

  @Expose()
  @IsDateString()
  createdAt: string;

  @Expose()
  @IsDateString()
  updatedAt: string;

  static from(group: Group): GroupInfoDto {
    return plainToInstance(GroupInfoDto, group);
  }
}
