import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DevicesService } from 'src/devices/devices.service';
import { Device, DeviceDocument } from 'src/models/device.model';
import { OneTimeKey, OneTimeKeyDocument } from 'src/models/one-time-key.model';
import { PreKey } from 'src/models/pre-key.model';
import { User, UserDocument } from 'src/models/user.model';
import { DeviceKeyBundleDto } from './dto/device-key-bundle.dto';
import { KeyBundleDto } from './dto/key-bundle.dto';
import { NeedUpdateKeysDto } from './dto/need-update-keys.dto';
import { UpdateKeysDto } from './dto/update-keys.dto';
import * as moment from 'moment';

@Injectable()
export class KeysService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(OneTimeKey.name)
    private oneTimeKeyModel: Model<OneTimeKeyDocument>,
    @Inject(forwardRef(() => DevicesService))
    private devicesService: DevicesService,
    private configService: ConfigService,
  ) {}

  async updateKeys(userId: string, updateKeysDto: UpdateKeysDto) {
    if (updateKeysDto.identityKey) {
      await this.userModel.findByIdAndUpdate(userId, <User>{
        identityKey: updateKeysDto.identityKey,
      });
    }
    if (updateKeysDto.signedPreKey) {
      const device = await this.devicesService.getDevice(
        userId,
        updateKeysDto.deviceId,
      );
      if (device) {
        await this.deviceModel.findByIdAndUpdate(device._id, <Device>{
          signedPreKey: updateKeysDto.signedPreKey,
        });
      }
    }
    if (updateKeysDto.oneTimeKeys) {
      const keys: Partial<OneTimeKey>[] = updateKeysDto.oneTimeKeys.map(
        (key) => ({
          deviceId: updateKeysDto.deviceId,
          userId: userId,
          preKey: key,
        }),
      );
      await this.oneTimeKeyModel.insertMany(keys);
    }
  }

  async getKeyBundle(
    userId: string,
    deviceId?: number,
  ): Promise<KeyBundleDto | null> {
    const user = await this.userModel.findById(userId);
    if (!user) return null;
    let devices = await this.devicesService.getAllDevices(userId);
    if (devices.length === 0) return null;
    if (deviceId) {
      devices = devices.filter((device) => device.deviceId === deviceId);
    }
    const keyBundle = new KeyBundleDto();
    if (user.identityKey == null) {
      return null; // not yet uploaded keys
    }
    keyBundle.identityKey = user.identityKey;
    const deviceKeyBundles: DeviceKeyBundleDto[] = await Promise.all(
      devices
        .filter(
          (device) =>
            device.registrationId != null && device.signedPreKey != null,
        )
        .map(async (device) => ({
          deviceId: device.deviceId,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          registrationId: device.registrationId!, // checked non-null above
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          signedPreKey: device.signedPreKey!, // checked non-null above
          oneTimeKey: await this.takeOneTimeKey(userId, device.deviceId),
        })),
    );
    if (deviceKeyBundles.length === 0) {
      return null;
    }
    keyBundle.deviceKeyBundles = deviceKeyBundles;
    return keyBundle;
  }

  private async takeOneTimeKey(
    userId: string,
    deviceId: number,
  ): Promise<PreKey | null> {
    const key = await this.oneTimeKeyModel.findOneAndRemove({
      userId: userId,
      deviceId: deviceId,
    });
    if (!key) return null;
    return key.preKey;
  }

  async removeAllOneTimeKeysOfOneDevice(userId: string, deviceId: number) {
    await this.oneTimeKeyModel.deleteMany({
      userId: userId,
      deviceId: deviceId,
    });
  }

  async isDeviceNeedUpdateKeys(
    userId: string,
    deviceId: number,
  ): Promise<NeedUpdateKeysDto> {
    const device = await this.devicesService.getDevice(userId, deviceId);
    if (!device) {
      throw new NotFoundException(`Deivce #${deviceId} not found`);
    }
    const signedPreKey = device.signedPreKey;
    let isSignedPreKeyExpired;
    if (device.signedPreKey != null) {
      const monthsBeforeExpiration =
        this.configService.get<number>('SIGNED_PRE_KEY_EXPIRATION_MONTHS') ?? 1;
      const expiredDay = moment(signedPreKey!!.createdAt).add(
        monthsBeforeExpiration,
        'month',
      );
      isSignedPreKeyExpired = moment().isAfter(expiredDay);
    } else {
      isSignedPreKeyExpired = true;
    }

    const oneTimeKeysCount = await this.oneTimeKeyModel.count({
      userId: userId,
      deviceId: deviceId,
    });
    const oneTImeKeysThreshold =
      this.configService.get<number>('ONE_TIME_KEY_THRESHOLD') ?? 20;
    const dto = new NeedUpdateKeysDto();
    dto.signedPreKey = isSignedPreKeyExpired;
    dto.oneTimeKeys = oneTimeKeysCount < oneTImeKeysThreshold;
    return dto;
  }
}
