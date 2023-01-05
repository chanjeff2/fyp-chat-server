import { IsInt } from 'class-validator';

export class SendMessageResponse {
  @IsInt({ each: true })
  misMatchDeviceIds: number[] = [];

  @IsInt({ each: true })
  missingDeviceIds: number[] = [];

  @IsInt({ each: true })
  removedDeviceIds: number[] = [];
}
