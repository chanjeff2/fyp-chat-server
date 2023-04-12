import { Injectable, NotFoundException } from '@nestjs/common';
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
      path: docPath,
    });
    return fileRecord;
  }

  async getFile(fileId: string): Promise<Buffer> {
    const fileRecord = await this.fileModel.findById(fileId);
    if (!fileRecord) {
      throw new NotFoundException(`File #${fileId} not found.`);
    }
    const ref = admin.storage().bucket().file(fileRecord.path);
    const doc = await ref.download();
    return doc[0];
  }
}
