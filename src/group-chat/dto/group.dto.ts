import { Transform, Type } from 'class-transformer';
import { IsArray, IsMongoId, IsString } from 'class-validator';
import { GroupMemberDto } from './group-member.dto';

export class GroupDto {
  @IsMongoId()
  @Transform((value) => value.obj._id.toString())
  _id: String;

  @IsString()
  name: string;

  @IsArray()
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];
}
