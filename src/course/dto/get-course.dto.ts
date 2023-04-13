import { IsEnum, IsNumberString, IsString, Length } from 'class-validator';
import { IsCourseCode } from 'src/decorators/is-course-code.decorator';
import { Semester } from 'src/enums/semester.enum';

export class GetCourseDto {
  @IsCourseCode()
  courseCode: string;

  @IsNumberString()
  @Length(4, 4)
  year: string;

  @IsEnum(Semester)
  semester: Semester;
}
