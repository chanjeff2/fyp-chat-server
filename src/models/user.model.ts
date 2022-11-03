import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PreKey, SignedPreKey } from './pre-key.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  registrationId: number;

  @Prop()
  displayName: string;

  @Prop()
  identityKey: Uint8Array;

  @Prop()
  signedPreKey: SignedPreKey;

  @Prop([PreKey])
  oneTimeKeys: PreKey[];
}

export const UserSchema = SchemaFactory.createForClass(User);
