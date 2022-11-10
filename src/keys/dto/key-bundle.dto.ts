import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { PreKeyDto } from './pre-key.dto';
import { SignedPreKeyDto } from './signed-pre-key.dto';

export class KeyBundleDto {
  @IsInt()
  registrationId: number;

  @IsString()
  identityKey: string;

  @Type(() => SignedPreKeyDto)
  signedPreKey: SignedPreKeyDto;

  @Type(() => PreKeyDto)
  oneTimeKey: PreKeyDto;
}
