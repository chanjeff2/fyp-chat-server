import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from 'src/models/device.model';
import { User, UserDocument } from 'src/models/user.model';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createDevice(
    userId: string,
    createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    const deviceId = await this.getNextUnusedDeviceId(userId);
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
    let deviceId = 1;
    const devices = await this.getAllDevices(userId);
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
