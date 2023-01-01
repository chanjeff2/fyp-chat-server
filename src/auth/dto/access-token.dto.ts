import { IsDate, IsOptional, IsString } from 'class-validator';

export class AccessTokenDto {
  @IsString()
  accessToken: string;

  @IsDate()
  accessTokenExpiresAt: Date;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsDate()
  @IsOptional()
  refreshTokenExpiresAt?: Date;
}
