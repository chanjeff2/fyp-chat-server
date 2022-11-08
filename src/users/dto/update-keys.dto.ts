import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PreKeyDto, SignedPreKeyDto } from './pre-key.dto';

export class UpdateKeysDto {
  @IsString()
  @IsOptional()
  identityKey?: string;

  @IsOptional()
  @Type(() => SignedPreKeyDto)
  signedPreKey?: SignedPreKeyDto;

  @IsArray()
  @IsOptional()
  @Type(() => PreKeyDto)
  oneTimeKeys?: PreKeyDto[];
}
