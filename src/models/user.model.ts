import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Device } from './device.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  displayName: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  identityKey: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }] })
  devices: (Device | string)[];

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
