import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PreKey } from 'src/models/pre-key.model';
import { SignedPreKey } from 'src/models/signed-pre-key.model';

export class UpdateKeysDto {
  @IsInt()
  deviceId: number;

  @IsString()
  @IsOptional()
  identityKey?: string;

  @Type(() => SignedPreKey)
  @IsOptional()
  signedPreKey?: SignedPreKey;

  @Type(() => PreKey)
  @IsOptional()
  oneTimeKeys?: PreKey[];
}
