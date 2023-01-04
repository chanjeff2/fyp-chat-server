import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeysService } from 'src/keys/keys.service';
import { Device, DeviceDocument } from 'src/models/device.model';
import { User, UserDocument } from 'src/models/user.model';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => KeysService)) private keysService: KeysService,
  ) {}

  async createDevice(
    userId: string,
    createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    const deviceId = await this.getNextUnusedDeviceId(userId);
    // remove all old devices as currently not support multi devices
    const devices = await this.getAllDevices(userId);
    await Promise.all(
      devices.map(
        async (device) => await this.deleteDevice(userId, device.deviceId),
      ),
    );
    // create new device
    const device = await this.deviceModel.create({
      deviceId: deviceId,
      ...createDeviceDto,
    });
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { devices: device },
    });
    return device;
  }

  async getDevice(userId: string, deviceId: number): Promise<Device | null> {
    const devices = await this.getAllDevices(userId);
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].deviceId === deviceId) {
        return devices[i];
      }
    }
    return null;
  }

  async getDeviceById(deviceId: string): Promise<Device | null> {
    return await this.deviceModel.findById(deviceId);
  }

  async getAllDevices(userId: string): Promise<Device[]> {
    const userWithDevices = await this.userModel
      .findById(userId)
      .populate('devices')
      .exec();
    if (!userWithDevices) {
      return [];
    }
    return userWithDevices.devices as Device[];
  }

  private async getNextUnusedDeviceId(userId: string): Promise<number> {
    return 1; // currently not yet support multi device
    // let deviceId = 1;
    // const devices = await this.getAllDevices(userId);
    // devices.sort((a, b) => a.deviceId - b.deviceId);
    // for (let i = 0; i < devices.length; i++) {
    //   if (devices[i].deviceId !== deviceId) {
    //     break;
    //   }
    //   deviceId++;
    // }
    // return deviceId;
  }

  async deleteDevice(userId: string, deviceId: number): Promise<Device | null> {
    const device = await this.getDevice(userId, deviceId);
    if (!device) {
      return null;
    }
    await this.deviceModel.findByIdAndDelete(device._id);
    await this.keysService.removeAllOneTimeKeysOfOneDevice(userId, deviceId);
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: {
        devices: device._id,
      },
    });
    return device;
  }
}
