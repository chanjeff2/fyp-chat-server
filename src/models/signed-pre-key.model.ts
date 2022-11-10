import { Prop, Schema } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { PreKey } from './pre-key.model';

@Schema()
export class SignedPreKey extends PreKey {
  @Prop({ reqired: true })
  @IsString()
  signature: string;
}
