import { Controller, Post, UseGuards, Body, UseFilters } from '@nestjs/common';
import { AccountDto } from 'src/account/dto/account.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { MongoExceptionFilter } from 'src/filters/mongo-exception.filter';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './local-auth.guard ';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@AuthUser() user: User) {
    return this.authService.login(user);
  }

  @Post('register')
  @UseFilters(MongoExceptionFilter)
  async register(@Body() registerDto: RegisterDto): Promise<AccountDto> {
    const user = await this.authService.register(registerDto);
    return AccountDto.from(user);
  }
}
