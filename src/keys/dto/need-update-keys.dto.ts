import { IsBoolean } from 'class-validator';

export class NeedUpdateKeysDto {
  @IsBoolean()
  signedPreKey: boolean;

  @IsBoolean()
  oneTimeKeys: boolean;
}
