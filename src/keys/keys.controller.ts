import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { KeyBundleDto } from './dto/key-bundle.dto';
import { UpdateKeysDto } from './dto/update-keys.dto';
import { KeysService } from './keys.service';

@Controller('keys')
export class KeysController {
  constructor(private keysService: KeysService) {}

  @Patch('update-keys')
  @UseGuards(JwtAuthGuard)
  async updateKeys(
    @AuthUser() user: JwtPayload,
    @Body() updateKeysDto: UpdateKeysDto,
  ) {
    await this.keysService.updateKeys(user.userId, updateKeysDto);
  }

  @Get(':userId/devices')
  @UseGuards(JwtAuthGuard)
  async getKeysForAllDevices(
    @Param('userId') userId: string,
  ): Promise<KeyBundleDto> {
    const keyBundle = await this.keysService.getKeyBundle(userId);
    if (!keyBundle) {
      throw new NotFoundException(`Key bundle for user ${userId} not found`);
    }
    return keyBundle;
  }

  @Get(':userId/devices/:deviceId')
  @UseGuards(JwtAuthGuard)
  async getKeysForOneDevices(
    @Param('userId') userId: string,
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<KeyBundleDto> {
    const keyBundle = await this.keysService.getKeyBundle(userId, deviceId);
    if (!keyBundle) {
      throw new NotFoundException(
        `Key bundle for user ${userId} device #${deviceId} not found`,
      );
    }
    return keyBundle;
  }
}
