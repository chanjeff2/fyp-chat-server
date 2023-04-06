import { IsEnum, IsMongoId } from 'class-validator';
import { Role } from 'src/models/group-member.model';

export class JoinGroupDto {
  @IsMongoId()
  group: string;

  @IsMongoId()
  user: string;

  @IsEnum(Role)
  role: Role;
}
