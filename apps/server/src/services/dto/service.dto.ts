import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateServiceDefinitionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  oneOffPrice?: number;

  @IsOptional()
  @IsNumber()
  recurringPrice?: number;

  @IsBoolean()
  recurringPricePerUnit: boolean;

  @IsNumber()
  billingCycleDays: number;
}

export class UpdateServiceDefinitionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  oneOffPrice?: number;

  @IsOptional()
  @IsNumber()
  recurringPrice?: number;

  @IsOptional()
  @IsBoolean()
  recurringPricePerUnit?: boolean;

  @IsOptional()
  @IsNumber()
  billingCycleDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ProvisionServiceDto {
  @IsString()
  userId: string;

  @IsString()
  serviceDefinitionId: string;

  @IsNumber()
  units: number;

  @IsBoolean()
  enableRecurring: boolean;

  @IsOptional()
  @IsNumber()
  customRecurringPrice?: number;

  @IsOptional()
  @IsBoolean()
  oneOffPaidInCash?: boolean;

  @IsOptional()
  @IsBoolean()
  currentMonthPaidInCash?: boolean;
}

export class ConfirmCashPaymentDto {
  @IsString()
  clientServiceId: string;

  @IsString()
  paymentType: 'oneOff' | 'currentMonth';
}
