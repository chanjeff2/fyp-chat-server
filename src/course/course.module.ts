import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupChatModule } from 'src/group-chat/group-chat.module';
import { Course, CourseSchema } from 'src/models/course.model';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    GroupChatModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
