import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
    return user;
  }

  async isUserExist(username: string): Promise<boolean> {
    const doc = await this.userModel.exists({ username: username });
    return doc != null;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username: username });
    return user;
  }

  async getUserAndFetchOneTimeKey(username: string): Promise<User | null> {
    const user = await this.userModel.findOneAndUpdate(
      { username: username },
      {
        $pop: { oneTimeKeys: -1 }, // return first element
      },
    );
    return user;
  }
}
