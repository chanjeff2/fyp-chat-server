import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { User } from 'src/models/user.model';
import { PreKeyDto, SignedPreKeyDto } from './pre-key.dto';

export class KeyBundle {
  @IsInt()
  registrationId: number;

  @IsString()
  identityKey: string;

  @Type(() => SignedPreKeyDto)
  signedPreKey: SignedPreKeyDto;

  @Type(() => PreKeyDto)
  oneTimeKey?: PreKeyDto;
}

export class UserDto {
  @IsString()
  username: string;

  @IsString()
  displayName: string;

  @Type(() => KeyBundle)
  keyBundle?: KeyBundle;

  static from(user: User): UserDto {
    const dto = new UserDto();
    dto.username = user.username;
    dto.displayName = user.displayName;

    const keyBundle = new KeyBundle();
    keyBundle.registrationId = user.registrationId;
    keyBundle.identityKey = user.identityKey;
    keyBundle.signedPreKey = user.signedPreKey;
    keyBundle.oneTimeKey = user.oneTimeKeys.at(0);
    dto.keyBundle = keyBundle;
    return dto;
  }
}
