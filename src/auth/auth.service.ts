import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { User, UserDocument } from 'src/models/user.model';
import { UsersService } from 'src/users/users.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUser(username);
    // TODO: check password hash match
    return user;
  }

  async login(user: UserDocument): Promise<AccessTokenDto> {
    const payload: JwtPayload = { username: user.username, userId: user._id };
    const dto = new AccessTokenDto();
    dto.access_token = this.jwtService.sign(payload);
    return dto;
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);
    return user;
  }
}
