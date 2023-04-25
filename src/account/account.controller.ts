import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  ParseFilePipeBuilder,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  async updateProfile(
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

  @Put('profile-pic')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePic(
    @AuthUser() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({ maxSize: 10485760 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<AccountDto> {
    const userObj = await this.accountService.uploadProfilePic(
      user.userId,
      file,
    );
    if (!userObj) throw new NotFoundException('user profile not found');
    return AccountDto.from(userObj);
  }

  @Delete('profile-pic')
  @UseGuards(JwtAuthGuard)
  async removeProfilePic(@AuthUser() user: JwtPayload): Promise<AccountDto> {
    const userObj = await this.accountService.removeProfilePic(user.userId);
    if (!userObj) throw new NotFoundException('user profile not found');
    return AccountDto.from(userObj);
  }
}
