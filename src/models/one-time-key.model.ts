import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { PreKey } from './pre-key.model';
import { User } from './user.model';

export type OneTimeKeyDocument = OneTimeKey & Document;

@Schema()
export class OneTimeKey {
  _id: ObjectId;

  @Prop()
  deviceId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User | ObjectId;

  @Prop()
  preKey: PreKey;
}

export const OneTimeKeySchema = SchemaFactory.createForClass(OneTimeKey);
