import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class QuoteProjectDto {
  @IsInt()
  @Min(0)
  quotedPrice: number;

  @IsString()
  @IsOptional()
  quotedTimeline?: string;

  @IsString()
  @IsOptional()
  quoteNotes?: string;
}
