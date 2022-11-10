import {
  Controller,
  Get,
  NotImplementedException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthRequest } from 'src/interfaces/auth-request.interface';
import { AccountDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthRequest): Promise<AccountDto> {
    return AccountDto.from(req.user);
  }
}
