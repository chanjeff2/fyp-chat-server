import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Block, BlockSchema } from 'src/models/block.model';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
  ],
  controllers: [BlockController],
  providers: [BlockService],
})
export class BlockModule {}
