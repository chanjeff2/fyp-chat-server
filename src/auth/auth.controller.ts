import { Request, Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthRequest } from 'src/interfaces/auth-request.interface';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard ';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
