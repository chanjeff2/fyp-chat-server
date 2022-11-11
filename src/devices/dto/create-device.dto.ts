import { IsInt, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsInt()
  registrationId: number;

  @IsString()
  name: string;
}
