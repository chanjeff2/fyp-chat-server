import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthRequest } from 'src/interfaces/auth-request.interface';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DeviceDto } from './dto/device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addDevice(
    @Request() req: AuthRequest,
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceDto> {
    const device = await this.devicesService.createDevice(
      req.user,
      createDeviceDto,
    );
    return DeviceDto.from(device);
  }

  @Get(':deviceId')
  @UseGuards(JwtAuthGuard)
  async getDevices(
    @Request() req: AuthRequest,
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<DeviceDto> {
    const device = await this.devicesService.getDevice(req.user, deviceId);
    if (!device) throw new NotFoundException();
    return DeviceDto.from(device);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDevices(@Request() req: AuthRequest): Promise<DeviceDto[]> {
    const devices = await this.devicesService.getAllDevices(req.user);
    return devices.map((device) => {
      return DeviceDto.from(device);
    });
  }
}
