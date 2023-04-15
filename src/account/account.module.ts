import { Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import { UsersModule } from 'src/users/users.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [UsersModule, MediaModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
