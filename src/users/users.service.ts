import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User, UserDocument } from 'src/models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const user = await this.userModel.create(registerDto);
    return user;
  }

  async isUserExist(username: string): Promise<boolean> {
    const doc = await this.userModel.exists({ username: username });
    return doc != null;
  }

  async getUser(username: string): Promise<User | null> {
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
