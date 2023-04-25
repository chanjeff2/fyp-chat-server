import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupType } from 'src/enums/group-type.enum';
import { GroupChatService } from 'src/group-chat/group-chat.service';
import { Course, CourseDocument } from 'src/models/course.model';
import { CourseDto } from './dto/course.dto';
import { GetCourseDto } from './dto/get-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private groupChatService: GroupChatService,
  ) {}

  async isCourseExists(getCourseDto: GetCourseDto): Promise<boolean> {
    const doc = await this.courseModel.exists(getCourseDto);
    return doc != null;
  }

  async joinCourse(
    userId: string,
    getCourseDto: GetCourseDto,
  ): Promise<CourseDto> {
    let course;
    if (await this.isCourseExists(getCourseDto)) {
      course = await this.getCourse(getCourseDto);
    } else {
      course = await this.createCourse(getCourseDto);
    }
    await this.groupChatService.memberJoin(userId, course!.groupId.toString());

    const dto = await this.getCourseDto(getCourseDto);
    if (!dto) {
      // how ??
      throw new NotFoundException('course not found.');
    }
    return dto;
  }

  async createCourse(getCourseDto: GetCourseDto): Promise<Course> {
    const group = await this.groupChatService.createGroup({
      name: `${getCourseDto.courseCode} ${getCourseDto.year} ${getCourseDto.semester}`,
      groupType: GroupType.Course,
      isPublic: true,
    });
    const course = await this.courseModel.create({
      ...getCourseDto,
      groupId: group._id,
    });
    return course;
  }

  async getCourse(getCourseDto: GetCourseDto): Promise<Course | null> {
    return await this.courseModel.findOne(getCourseDto);
  }

  async getCourseDto(getCourseDto: GetCourseDto): Promise<CourseDto | null> {
    const course = await this.courseModel.findOne(getCourseDto);
    if (!course) {
      return null;
    }
    const group = await this.groupChatService.getGroup(course.groupId);
    if (!group) {
      return null;
    }
    const dto = CourseDto.fromCourseAndGroupDto(course, group);
    return dto;
  }
}
