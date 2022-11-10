import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { User } from 'src/models/user.model';

@Exclude()
export class AccountDto {
  @IsMongoId()
  @Transform((value) => value.obj._id.toString())
  @Expose({ name: 'userId' })
  _id: ObjectId;

  @IsString()
  @Expose()
  username: string;

  static from(user: User): AccountDto {
    return plainToInstance(AccountDto, user);
  }
}
