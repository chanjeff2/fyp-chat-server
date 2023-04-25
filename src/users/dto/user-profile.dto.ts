import { Expose, Exclude, Transform, plainToClass } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
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
  displayName?: string;

  @IsUrl()
  @IsOptional()
  @Expose()
  profilePicUrl?: string;

  @IsString()
  @IsOptional()
  @Expose()
  status?: string;

  @Expose()
  @IsDateString()
  createdAt: string;

  @Expose()
  @IsDateString()
  updatedAt: string;

  static from(user: User): UserProfileDto {
    return plainToClass(UserProfileDto, user);
  }
}
