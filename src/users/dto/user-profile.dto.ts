import { Expose, Exclude, Transform, plainToClass } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { User } from 'src/models/user.model';

@Exclude()
export class UserProfileDto {
  @IsMongoId()
  @Expose({ name: 'userId' })
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @IsString()
  @Expose()
  username: string;

  @IsString()
  @IsOptional()
  @Expose()
  displayName: string;

  @IsString()
  @IsOptional()
  @Expose()
  status?: string;

  static from(user: User): UserProfileDto {
    return plainToClass(UserProfileDto, user);
  }
}
