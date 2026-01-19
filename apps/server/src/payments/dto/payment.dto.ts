import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum PaymentItemType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
  PACKAGE = 'PACKAGE',
}

export class InitiatePaymentDto {
  @IsEnum(PaymentItemType)
  itemType: PaymentItemType;

  @IsString()
  itemId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CheckPaymentStatusDto {
  @IsString()
  pollUrl: string;
}

export class PaynowCallbackDto {
  reference?: string;
  paynowreference?: string;
  amount?: string;
  status?: string;
  pollurl?: string;
  hash?: string;
}
