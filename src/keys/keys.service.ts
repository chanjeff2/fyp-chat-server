import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DevicesService } from 'src/devices/devices.service';
import { Device, DeviceDocument } from 'src/models/device.model';
import { OneTimeKey, OneTimeKeyDocument } from 'src/models/one-time-key.model';
import { PreKey } from 'src/models/pre-key.model';
import { User, UserDocument } from 'src/models/user.model';
import { DeviceKeyBundleDto } from './dto/device-key-bundle.dto';
import { KeyBundleDto } from './dto/key-bundle.dto';
import { UpdateKeysDto } from './dto/update-keys.dto';

@Injectable()
export class KeysService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(OneTimeKey.name)
    private oneTimeKeyModel: Model<OneTimeKeyDocument>,
    private devicesService: DevicesService,
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
      const keys = updateKeysDto.oneTimeKeys.map((key) => ({
        deviceId: updateKeysDto.deviceId,
        userId: new Types.ObjectId(userId),
        preKey: key,
      }));
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
    const deviceKeyBundles: DeviceKeyBundleDto[] = await Promise.all(
      devices.map(async (device) => ({
        deviceId: device.deviceId,
        registrationId: device.registrationId,
        signedPreKey: device.signedPreKey,
        oneTimeKey: await this.takeOneTimeKey(userId, device.deviceId),
      })),
    );
    return <KeyBundleDto>{
      identityKey: user.identityKey,
      deviceKeyBundles: deviceKeyBundles,
    };
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
}