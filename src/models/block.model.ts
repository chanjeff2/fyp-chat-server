import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlockDocument = Block & Document;

@Schema({ timestamps: true })
export class Block {
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  chatroomId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
