import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PreKey } from './pre-key.model';
import { User } from './user.model';

export type OneTimeKeyDocument = OneTimeKey & Document;

@Schema()
export class OneTimeKey {
  _id: string;

  @Prop()
  deviceId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User | string;

  @Prop()
  preKey: PreKey;
}

export const OneTimeKeySchema = SchemaFactory.createForClass(OneTimeKey);
