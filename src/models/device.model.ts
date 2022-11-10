import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { SignedPreKey } from './signed-pre-key.model';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
  _id: ObjectId;

  @Prop()
  deviceId: number;

  @Prop()
  registrationId: number;

  @Prop()
  signedPreKey: SignedPreKey;
}

export const UserSchema = SchemaFactory.createForClass(Device);
