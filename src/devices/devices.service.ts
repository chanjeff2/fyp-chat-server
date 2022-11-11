import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from 'src/models/device.model';
import { User, UserDocument } from 'src/models/user.model';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceDto } from './dto/device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createDevice(
    user: User,
    createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    const deviceId = await this.getNextUnusedDeviceId(user);
    const device = await this.deviceModel.create({
      deviceId: deviceId,
      ...createDeviceDto,
    });
    await this.userModel.findByIdAndUpdate(user._id.toString(), {
      $push: { devices: device },
    });
    return device;
  }

  async getDevice(user: User, deviceId: number): Promise<Device | null> {
    const devices = await this.getAllDevices(user);
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

  async getAllDevices(user: User): Promise<Device[]> {
    const userWithDevices = await this.userModel
      .findById(user._id.toString())
      .populate('devices')
      .exec();
    if (!userWithDevices) {
      return [];
    }
    return userWithDevices.devices as Device[];
  }

  private async getNextUnusedDeviceId(user: User): Promise<number> {
    let deviceId = 1;
    const devices = await this.getAllDevices(user);
    devices.sort((a, b) => a.deviceId - b.deviceId);
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].deviceId !== deviceId) {
        break;
      }
      deviceId++;
    }
    return deviceId;
  }
}
