import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum AdminProjectAction {
  START = 'START',
  HOLD = 'HOLD',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export class UpdateProjectStatusDto {
  @IsEnum(AdminProjectAction)
  action: AdminProjectAction;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  deliverables?: string;
}
