import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

@Schema()
@Exclude()
export class PreKey {
  @Expose()
  @Prop({ reqired: true })
  @IsInt()
  id: number;

  @Expose()
  @Prop({ reqired: true })
  @IsString()
  key: string;
}
