import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceDto } from './dto/device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addDevice(
    @AuthUser() user: JwtPayload,
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceDto> {
    const device = await this.devicesService.createDevice(
      user.userId,
      createDeviceDto,
    );
    return DeviceDto.from(device);
  }

  @Get(':deviceId')
  @UseGuards(JwtAuthGuard)
  async getDevice(
    @AuthUser() user: JwtPayload,
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<DeviceDto> {
    const device = await this.devicesService.getDevice(user.userId, deviceId);
    if (!device) throw new NotFoundException(`Device #${deviceId} not found`);
    return DeviceDto.from(device);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDevices(@AuthUser() user: JwtPayload): Promise<DeviceDto[]> {
    const devices = await this.devicesService.getAllDevices(user.userId);
    return devices.map((device) => {
      return DeviceDto.from(device);
    });
  }

  @Delete(':deviceId')
  @UseGuards(JwtAuthGuard)
  async deleteDevice(
    @AuthUser() user: JwtPayload,
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<DeviceDto> {
    const device = await this.devicesService.deleteDevice(
      user.userId,
      deviceId,
    );
    if (!device) throw new NotFoundException(`Device #${deviceId} not found`);
    return DeviceDto.from(device);
  }
}
