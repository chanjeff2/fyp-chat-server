import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { User } from 'src/models/user.model';

@Exclude()
export class AccountDto {
  @IsMongoId()
  @Transform((value) => value.obj._id.toString())
  @Expose({ name: 'userId' })
  _id: string;

  @IsString()
  @Expose()
  username: string;

  @IsString()
  @IsOptional()
  @Expose()
  displayName?: string;

  static from(user: User): AccountDto {
    return plainToInstance(AccountDto, user);
  }
}
