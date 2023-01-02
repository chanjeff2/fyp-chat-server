import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@AuthUser() user: JwtPayload): Promise<AccountDto> {
    const userObj = await this.accountService.getProfile(user.userId);
    if (!userObj) throw new NotFoundException('user profile not found');
    return AccountDto.from(userObj);
  }

  @Patch('update-profile')
  @UseGuards(JwtAuthGuard)
  async updateDisplayName(
    @AuthUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<AccountDto> {
    const userObj = await this.accountService.updateUser(
      user.userId,
      updateUserDto,
    );
    if (!userObj) throw new NotFoundException('user profile not found');
    return AccountDto.from(userObj);
  }
}
