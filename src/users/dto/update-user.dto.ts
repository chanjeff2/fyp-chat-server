import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string | null;

  @IsUrl()
  @IsOptional()
  profilePicUrl?: string | null;
}
