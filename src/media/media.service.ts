import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileDocument, FileModel } from 'src/models/file.model';
import admin from 'firebase-admin';
import * as crypto from 'crypto';
import { read } from 'fs';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(FileModel.name) private fileModel: Model<FileDocument>,
  ) {}

  /// return public url of the file
  private async saveFile(
    path: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const ref = admin.storage().bucket().file(path);
    await ref.save(file.buffer);
    await ref.makePublic();
    return ref.metadata.mediaLink;
  }

  async uploadFile(file: Express.Multer.File): Promise<FileModel> {
    const uuid = crypto.randomUUID();
    const docPath = `file/${uuid}`;
    await this.saveFile(docPath, file);
    const fileRecord = await this.fileModel.create({
      name: file.originalname,
      path: docPath,
    });
    return fileRecord;
  }

  async uploadProfilePic(
    id: string,
    file: Express.Multer.File,
  ): Promise<string> {
    // upload file
    const path = `profile-pic/${id}`;
    return await this.saveFile(path, file);
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
