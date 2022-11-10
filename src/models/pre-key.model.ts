import { Prop, Schema } from '@nestjs/mongoose';
import { IsInt, IsString } from 'class-validator';

@Schema()
export class PreKey {
  @Prop({ reqired: true })
  @IsInt()
  id: number;

  @Prop({ reqired: true })
  @IsString()
  key: string;
}
