import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { PreKey, SignedPreKey } from './pre-key.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  registrationId: number;

  @Prop()
  displayName: string;

  @Prop()
  identityKey: string;

  @Prop()
  signedPreKey: SignedPreKey;

  @Prop([PreKey])
  oneTimeKeys: PreKey[];
}

export const UserSchema = SchemaFactory.createForClass(User);
