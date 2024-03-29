import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { SyncUserDto } from './dto/sync-user.dto';
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

  async isUserExist(userId: string): Promise<boolean> {
    const doc = await this.userModel.exists({ _id: userId });
    return doc != null;
  }

  async isUsernameExist(username: string): Promise<boolean> {
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

  async synchronize(data: SyncUserDto[]): Promise<User[]> {
    const users = await Promise.all(
      data.map(async (dto) => {
        const user = await this.userModel.findOne({
          _id: dto._id,
          updatedAt: {
            $gt: dto.updatedAt, // db is newer
          },
        });
        return user as User;
      }),
    );
    return users.filter((e): e is User => e !== null);
  }
}
