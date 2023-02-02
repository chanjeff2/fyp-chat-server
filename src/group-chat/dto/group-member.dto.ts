import { Type } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Role } from 'src/models/group-member.model';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';

export class GroupMemberDto {
  @Type(() => UserProfileDto)
  user: UserProfileDto;

  @IsEnum(Role)
  role: Role;
}
