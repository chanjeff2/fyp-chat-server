import { Expose, Exclude, Transform, plainToClass } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { User } from 'src/models/user.model';

@Exclude()
export class UserProfileDto {
  @IsMongoId()
  @Expose({ name: 'userId' })
  @Transform((value) => value.obj._id.toString())
  _id: ObjectId;

  @IsString()
  @Expose()
  username: string;

  @IsString()
  @Expose()
  displayName: string;

  static from(user: User) {
    return plainToClass(UserProfileDto, user);
  }
}
