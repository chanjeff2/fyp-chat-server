import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from 'src/models/device.model';
import { OneTimeKey, OneTimeKeySchema } from 'src/models/one-time-key.model';
import { User, UserSchema } from 'src/models/user.model';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: OneTimeKey.name, schema: OneTimeKeySchema },
    ]),
  ],
  controllers: [KeysController],
  providers: [KeysService],
})
export class KeysModule {}
