import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FileDto } from './dto/file.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private service: MediaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    const uploadedFile = await this.service.uploadFile(file);
    return FileDto.from(uploadedFile);
  }
}
