export class CreateServiceDefinitionDto {
  name: string;
  description?: string;
  oneOffPrice?: number;
  recurringPrice?: number;
  recurringPricePerUnit: boolean;
  billingCycleDays: number;
}

export class UpdateServiceDefinitionDto {
  name?: string;
  description?: string;
  oneOffPrice?: number;
  recurringPrice?: number;
  recurringPricePerUnit?: boolean;
  billingCycleDays?: number;
  isActive?: boolean;
}

export class ProvisionServiceDto {
  userId: string;
  serviceDefinitionId: string;
  units: number;
  enableRecurring: boolean;
  customRecurringPrice?: number;
}
