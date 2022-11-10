import { IsString, IsInt } from 'class-validator';

export class PreKeyDto {
  @IsInt()
  id: number;

  @IsString()
  key: string;
}
