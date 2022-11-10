import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { PreKey } from 'src/models/pre-key.model';
import { SignedPreKey } from 'src/models/signed-pre-key.model';

export class KeyBundleDto {
  @IsInt()
  registrationId: number;

  @IsString()
  identityKey: string;

  @Type(() => SignedPreKey)
  signedPreKey: SignedPreKey;

  @Type(() => PreKey)
  oneTimeKey: PreKey;
}
