import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type FileDocument = FileModel & Document;

@Schema({ timestamps: true })
export class FileModel {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
