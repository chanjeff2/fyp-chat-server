import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeysService } from 'src/keys/keys.service';
import { Device, DeviceDocument } from 'src/models/device.model';
import { UsersService } from 'src/users/users.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    private usersService: UsersService,
    @Inject(forwardRef(() => KeysService)) private keysService: KeysService,
  ) {}

  async createDevice(
    userId: string,
    createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    if (!(await this.usersService.isUserExist(userId))) {
      throw new NotFoundException(`User ${userId} not found.`);
    }
    const deviceId = await this.getNextUnusedDeviceId(userId);
    // create new device
    const device = await this.deviceModel.create({
      deviceId: deviceId,
      userId: userId,
      ...createDeviceDto,
    });
    return device;
  }

  async getDevice(userId: string, deviceId: number): Promise<Device | null> {
    const device = await this.deviceModel.findOne({
      userId: userId,
      deviceId: deviceId,
    });
    return device;
  }

  async getDeviceById(deviceId: string): Promise<Device | null> {
    return await this.deviceModel.findById(deviceId);
  }

  async getAllDevices(userId: string): Promise<Device[]> {
    return await this.deviceModel.find({
      userId: userId,
    });
  }

  private async getNextUnusedDeviceId(userId: string): Promise<number> {
    // remove all old devices as currently not support multi devices
    await this.deviceModel.deleteMany({
      userId: userId,
    });
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
    return device;
  }
}
