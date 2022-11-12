import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/models/user.model';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceDto } from './dto/device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addDevice(
    @AuthUser() user: User,
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceDto> {
    const device = await this.devicesService.createDevice(
      user._id.toString(),
      createDeviceDto,
    );
    return DeviceDto.from(device);
  }

  @Get(':deviceId')
  @UseGuards(JwtAuthGuard)
  async getDevices(
    @AuthUser() user: User,
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<DeviceDto> {
    const device = await this.devicesService.getDevice(
      user._id.toString(),
      deviceId,
    );
    if (!device) throw new NotFoundException(`Device #${deviceId} not found`);
    return DeviceDto.from(device);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDevices(@AuthUser() user: User): Promise<DeviceDto[]> {
    const devices = await this.devicesService.getAllDevices(
      user._id.toString(),
    );
    return devices.map((device) => {
      return DeviceDto.from(device);
    });
  }
}
