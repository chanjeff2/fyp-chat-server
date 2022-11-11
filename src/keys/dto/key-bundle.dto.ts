import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { DeviceKeyBundleDto } from './device-key-bundle.dto';

export class KeyBundleDto {
  @IsString()
  identityKey: string;

  @IsArray()
  @Type(() => DeviceKeyBundleDto)
  deviceKeyBundles: DeviceKeyBundleDto[];
}
