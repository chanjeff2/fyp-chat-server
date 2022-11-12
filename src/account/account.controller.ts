import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/models/user.model';
import { AccountDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@AuthUser() user: User): Promise<AccountDto> {
    return AccountDto.from(user);
  }
}
