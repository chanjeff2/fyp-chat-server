import { IsEnum, IsString } from 'class-validator';
import { GroupType } from 'src/enums/group-type.enum';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsEnum(GroupType)
  groupType?: GroupType;
}
