import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
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
}
