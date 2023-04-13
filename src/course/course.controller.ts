import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { CourseService } from './course.service';
import { CourseDto } from './dto/course.dto';
import { GetCourseDto } from './dto/get-course.dto';

@Controller('course')
export class CourseController {
  constructor(private service: CourseService) {}

  @Post('join')
  @UseGuards(JwtAuthGuard)
  async joinCourse(
    @AuthUser() user: JwtPayload,
    @Body() joinCourseDto: GetCourseDto,
  ): Promise<CourseDto> {
    return this.service.joinCourse(user.userId, joinCourseDto);
  }
}
