import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileDocument, FileModel } from 'src/models/file.model';
import admin from 'firebase-admin';
import * as crypto from 'crypto';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(FileModel.name) private fileModel: Model<FileDocument>,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<FileModel> {
    const uuid = crypto.randomUUID();
    const docPath = `file/${uuid}`;
    const ref = admin.storage().bucket().file(docPath);
    await ref.save(file.buffer);
    const fileRecord = await this.fileModel.create({
      name: file.originalname,
      publicUrl: ref.publicUrl(),
    });
    return fileRecord;
  }
}
