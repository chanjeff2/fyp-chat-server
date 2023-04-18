import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  displayName?: string;

  @Prop()
  status?: string;

  @Prop()
  profilePicUrl?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  identityKey?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
