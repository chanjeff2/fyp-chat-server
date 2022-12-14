import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { IsInt, IsMongoId, IsString } from 'class-validator';
import { Device } from 'src/models/device.model';

@Exclude()
export class DeviceDto {
  @IsMongoId()
  @Expose()
  @Transform((value) => value.obj._id.toString())
  _id: string;

  @IsInt()
  @Expose()
  deviceId: number;

  @IsString()
  @Expose()
  name: string;

  static from(device: Device): DeviceDto {
    return plainToInstance(DeviceDto, device);
  }
}
