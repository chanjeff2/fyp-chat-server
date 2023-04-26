import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumberString, IsString, Length } from 'class-validator';
import { IsCourseCode } from 'src/decorators/is-course-code.decorator';
import { Semester } from 'src/enums/semester.enum';
import { GroupDto } from 'src/group-chat/dto/group.dto';
import { Course } from 'src/models/course.model';

export class CourseDto extends GroupDto {
  @IsCourseCode()
  courseCode: string;

  @IsNumberString()
  @Length(4, 4)
  year: string;

  @IsEnum(Semester)
  semester: Semester;

  static fromCourseAndGroupDto(course: Course, groupDto: GroupDto): CourseDto {
    const dto = groupDto as CourseDto;
    dto.courseCode = course.courseCode;
    dto.year = course.year;
    dto.semester = course.semester;
    return dto;
  }
}
