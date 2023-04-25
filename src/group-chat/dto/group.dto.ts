import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { Group } from 'src/models/group.model';
import { GroupInfoDto } from './group-info.dto';
import { GroupMemberDto } from './group-member.dto';

@Exclude()
export class GroupDto extends GroupInfoDto {
  @Expose()
  @IsArray()
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];

  static fromMembers(group: Group, members: GroupMemberDto[]): GroupDto {
    const dto = plainToInstance(GroupDto, group);
    dto.members = members;
    return dto;
  }
}
