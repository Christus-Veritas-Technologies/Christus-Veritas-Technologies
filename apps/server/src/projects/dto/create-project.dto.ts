import { IsString, IsOptional, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  @IsOptional()
  timeline?: string;

  @IsInt()
  @IsOptional()
  budget?: number;
}
