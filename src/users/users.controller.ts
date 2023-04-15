import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { SyncUserDto } from './dto/sync-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<UserProfileDto> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return UserProfileDto.from(user);
  }

  @Get('username/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserProfileDto> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return UserProfileDto.from(user);
  }

  @Post('sync')
  async synchronize(
    @Body('data') data: SyncUserDto[],
  ): Promise<UserProfileDto[]> {
    const users = await this.usersService.synchronize(data);
    return users.map((user) => UserProfileDto.from(user));
  }
}
