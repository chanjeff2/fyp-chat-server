import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  StreamableFile,
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
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 10485760 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<FileDto> {
    const uploadedFile = await this.service.uploadFile(file);
    return FileDto.from(uploadedFile);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFile(@Param('id') id: string): Promise<StreamableFile> {
    const file = await this.service.getFile(id);
    return new StreamableFile(file);
  }
}
