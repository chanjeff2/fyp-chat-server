import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from 'src/models/user.model';
import { UpdateKeysDto } from './dto/update-keys.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (await this.usersService.isUserExist(createUserDto.username)) {
      throw new BadRequestException('Username already exists');
    }
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

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
