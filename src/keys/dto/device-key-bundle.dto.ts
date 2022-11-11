import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PreKey } from 'src/models/pre-key.model';
import { SignedPreKey } from 'src/models/signed-pre-key.model';

export class DeviceKeyBundleDto {
  @IsInt()
  deviceId: number;

  @IsInt()
  registrationId: number;

  @Type(() => SignedPreKey)
  signedPreKey: SignedPreKey;

  @Type(() => PreKey)
  oneTimeKey?: PreKey | null;
}
