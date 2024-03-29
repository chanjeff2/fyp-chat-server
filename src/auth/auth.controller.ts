import {
  Controller,
  Post,
  UseGuards,
  Body,
  UseFilters,
  HttpCode,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { MongoExceptionFilter } from 'src/filters/mongo-exception.filter';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { JwtRefreshPayload } from 'src/interfaces/jwt-refresh-payload.interface';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard ';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@AuthUser() user: User): Promise<AccessTokenDto> {
    return this.authService.login(user);
  }

  @Post('register')
  @UseFilters(MongoExceptionFilter)
  async register(@Body() registerDto: RegisterDto): Promise<AccessTokenDto> {
    return await this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@AuthUser() user: JwtPayload) {
    await this.authService.logout(user.userId);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(200)
  @Post('refresh-tokens')
  async refreshToken(
    @AuthUser() user: JwtRefreshPayload,
  ): Promise<AccessTokenDto> {
    return await this.authService.refreshTokens(user.userId, user.refreshToken);
  }
}
