import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
