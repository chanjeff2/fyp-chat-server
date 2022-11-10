import { IsString } from 'class-validator';
import { PreKeyDto } from './pre-key.dto';

export class SignedPreKeyDto extends PreKeyDto {
  @IsString()
  signature: string;
}
