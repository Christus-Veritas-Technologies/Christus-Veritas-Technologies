import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ProjectAction {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

export class RespondToQuoteDto {
  @IsEnum(ProjectAction)
  action: ProjectAction;

  @IsString()
  @IsOptional()
  declineReason?: string;
}
