import { Exclude, plainToInstance } from 'class-transformer';
import { User } from 'src/models/user.model';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';

@Exclude()
export class AccountDto extends UserProfileDto {
  static from(user: User): AccountDto {
    return plainToInstance(AccountDto, user);
  }
}
