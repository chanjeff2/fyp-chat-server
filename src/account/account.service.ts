import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccountService {
  constructor(private usersService: UsersService) {}

  async getProfile(userId: string): Promise<User | null> {
    return await this.usersService.getUserById(userId);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return await this.usersService.updateUser(userId, updateUserDto);
  }
}
