import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Semester } from 'src/enums/semester.enum';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  _id: string;

  @Prop({ required: true })
  courseCode: string;

  @Prop({ required: true })
  year: string;

  @Prop({ type: String, enum: Semester, required: true })
  semester: Semester;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  groupId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
