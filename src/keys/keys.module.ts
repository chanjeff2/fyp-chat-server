import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesModule } from 'src/devices/devices.module';
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
    forwardRef(() => DevicesModule),
  ],
  controllers: [KeysController],
  providers: [KeysService],
  exports: [KeysService],
})
export class KeysModule {}
