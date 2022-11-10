import {
  Body,
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateKeysDto } from './dto/update-keys.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  async getUserDto(@Param('username') username: string): Promise<UserDto> {
    const user = await this.usersService.getUserAndFetchOneTimeKey(username);
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return UserDto.from(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-keys')
  async updateKeys(@Body() updateKeysDto: UpdateKeysDto) {
    // TODO: implement updateKeys()
    throw new NotImplementedException();
  }
}
