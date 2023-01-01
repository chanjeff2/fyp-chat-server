import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { User } from 'src/models/user.model';
import { UsersService } from 'src/users/users.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) return null;
    // TODO: check password hash match
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;
    return user;
  }

  async login(user: User): Promise<AccessTokenDto> {
    const payload: JwtPayload = {
      username: user.username,
      userId: user._id,
    };
    const token = await this.getAndStoreTokens(payload);
    return token;
  }

  async register(registerDto: RegisterDto): Promise<AccessTokenDto> {
    const passwordHash = await bcrypt.hash(registerDto.password, 10); // bcrypt for short string
    const user = await this.usersService.createUser({
      passwordHash: passwordHash,
      ...registerDto,
    });
    const payload: JwtPayload = {
      username: user.username,
      userId: user._id,
    };
    const token = await this.getAndStoreTokens(payload);
    return token;
  }

  async logout(userId: string) {
    await this.usersService.updateUser(userId, { refreshToken: null });
  }

  async getAndStoreTokens(payload: JwtPayload): Promise<AccessTokenDto> {
    const dto = new AccessTokenDto();
    dto.accessToken = this.getAccessToken(payload);
    const accessTokenTTL = ms(
      (this.configService.get<string>('JWT_EXPIRES_IN') ??
        '15m') as StringValue,
    );
    dto.accessTokenExpiresAt = new Date(Date.now() + accessTokenTTL);
    dto.refreshToken = this.getRefreshToken(payload);
    const refreshTokenTTL = ms(
      (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ??
        '7d') as StringValue,
    );
    dto.refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTTL);
    await this.updateRefreshToken(payload.userId, dto.refreshToken);
    return dto;
  }

  private getAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  private getRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken); // argon2 for long hash
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AccessTokenDto> {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException();
    }
    const isRefreshTokenMatch = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatch) throw new UnauthorizedException();
    const payload: JwtPayload = {
      username: user.username,
      userId: user._id,
    };
    const token = new AccessTokenDto();
    token.accessToken = this.getAccessToken(payload);
    const accessTokenTTL = ms(
      (this.configService.get<string>('JWT_EXPIRES_IN') ??
        '15m') as StringValue,
    );
    token.accessTokenExpiresAt = new Date(Date.now() + accessTokenTTL);
    return token;
  }
}
