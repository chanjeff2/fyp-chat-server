import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Group } from 'src/models/group.model';
import { GroupMemberDto } from './group-member.dto';

@Exclude()
export class GroupDto {
  @Expose()
  @IsMongoId()
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsArray()
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];

  @Expose()
  @IsDateString()
  createdAt: string;

  static from(group: Group): GroupDto {
    return plainToInstance(GroupDto, group);
  }
}
