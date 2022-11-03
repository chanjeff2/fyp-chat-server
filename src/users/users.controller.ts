import {
  Body,
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from 'src/models/user.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    // TODO: check if repeated username
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  @Get(':username')
  getUser(@Param('username') username: string): UserDto {
    throw new NotImplementedException();
  }
}
