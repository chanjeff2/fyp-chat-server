import { IsEnum, IsMongoId } from 'class-validator';
import { Role } from 'src/models/group-member.model';

export class JoinGroupDto {
  @IsMongoId()
  chatroomId: string;

  @IsMongoId()
  userId: string;

  @IsEnum(Role)
  role: Role;
}
