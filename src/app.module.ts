import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { DevicesModule } from './devices/devices.module';
import { KeysModule } from './keys/keys.module';
import { HeartbeatModule } from './heartbeat/heartbeat.module';
import { EventsModule } from './events/events.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { BlockModule } from './block/block.module';
import { MediaModule } from './media/media.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_CONNECT_STRING'),
      }),
    }),
    UsersModule,
    AuthModule,
    AccountModule,
    DevicesModule,
    KeysModule,
    HeartbeatModule,
    EventsModule,
    GroupChatModule,
    BlockModule,
    MediaModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
