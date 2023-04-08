import { Module } from '@nestjs/common';
import { BlockModule } from 'src/block/block.module';
import { DevicesModule } from 'src/devices/devices.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [DevicesModule, BlockModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
