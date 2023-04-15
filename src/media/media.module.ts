import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModel, FileSchema } from 'src/models/file.model';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileModel.name, schema: FileSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
