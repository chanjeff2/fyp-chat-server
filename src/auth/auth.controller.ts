import {
  Request,
  Controller,
  Post,
  UseGuards,
  Body,
  UseFilters,
} from '@nestjs/common';
import { MongoExceptionFilter } from 'src/filters/mongo-exception.filter';
import { AuthRequest } from 'src/interfaces/auth-request.interface';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './local-auth.guard ';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @UseFilters(MongoExceptionFilter)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return user;
  }
}
