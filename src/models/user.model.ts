import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Device } from './device.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  displayName: string;

  @Prop()
  identityKey: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }] })
  devices: Device[];
}

export const UserSchema = SchemaFactory.createForClass(User);
