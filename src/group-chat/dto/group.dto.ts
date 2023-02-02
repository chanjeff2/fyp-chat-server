import { Transform, Type } from 'class-transformer';
import { IsArray, IsDateString, IsMongoId, IsString } from 'class-validator';
import { GroupMemberDto } from './group-member.dto';

export class GroupDto {
  @IsMongoId()
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @IsString()
  name: string;

  @IsArray()
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];

  @IsDateString()
  createdAt: string;
}
