import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
import { FileModel } from 'src/models/file.model';

@Exclude()
export class FileDto {
  @IsMongoId()
  @Expose({ name: 'fileId' })
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  publicUrl: string;

  static from(file: FileModel): FileDto {
    return plainToClass(FileDto, file);
  }
}
