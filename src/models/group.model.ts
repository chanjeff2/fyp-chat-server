import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GroupType } from 'src/enums/group-type.enum';

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  _id: string;

  @Prop({
    type: String,
    enum: GroupType,
    required: true,
    default: GroupType.Basic,
  })
  groupType: GroupType;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true, default: false })
  isPublic: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
