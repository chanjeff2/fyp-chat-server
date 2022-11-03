import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString } from 'class-validator';
import { PreKeyDto, SignedPreKeyDto } from './pre-key.dto';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsInt()
  registrationId: number;

  @IsString()
  displayName: string;

  @IsString()
  identityKey: string;

  @Type(() => SignedPreKeyDto)
  signedPreKey: SignedPreKeyDto;

  @IsArray()
  @Type(() => PreKeyDto)
  oneTimeKeys: PreKeyDto[];
}
