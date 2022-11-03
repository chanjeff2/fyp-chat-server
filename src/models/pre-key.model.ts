import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class PreKey {
  @Prop({ reqired: true })
  id: number;

  @Prop({ reqired: true })
  key: string;
}

@Schema()
export class SignedPreKey extends PreKey {
  @Prop({ reqired: true })
  signature: string;
}
