import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SignedPreKey } from './signed-pre-key.model';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
  _id: string;

  @Prop({ required: true })
  deviceId: number;

  @Prop()
  name: string;

  @Prop()
  registrationId: number;

  @Prop()
  signedPreKey: SignedPreKey;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
