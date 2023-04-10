import { IsBoolean, IsMongoId } from 'class-validator';

export class TrustWorthyDto {
  @IsMongoId()
  chatroomId: string;

  @IsBoolean()
  isTrustWorthy: boolean;
}
