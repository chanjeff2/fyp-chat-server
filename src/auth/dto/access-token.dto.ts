import { IsString } from 'class-validator';

export class AccessTokenDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
