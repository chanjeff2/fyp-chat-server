import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SignedPreKey } from './signed-pre-key.model';

export type DeviceDocument = Device & Document;

@Schema({ timestamps: true })
export class Device {
  _id: string;

  @Prop({ required: true })
  deviceId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  registrationId: number;

  @Prop()
  signedPreKey?: SignedPreKey;

  @Prop({ required: true })
  firebaseMessagingToken: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
