import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Group } from './group.model';
import { User } from './user.model';

export type GroupMemberDocument = GroupMember & Document;

export enum Role {
  Member = 'Member',
  Admin = 'Admin',
}

@Schema({ timestamps: true })
export class GroupMember {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group: Group | string;

  @Prop({ type: String, enum: Role })
  role: Role;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User | string;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
