import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { PreKey } from './pre-key.model';

@Schema({ timestamps: true })
@Exclude()
export class SignedPreKey extends PreKey {
  @Prop({ reqired: true })
  @Expose()
  @IsString()
  signature: string;
}
