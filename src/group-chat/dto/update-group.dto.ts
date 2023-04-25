import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsUrl()
  @IsOptional()
  profilePicUrl?: string;
}
