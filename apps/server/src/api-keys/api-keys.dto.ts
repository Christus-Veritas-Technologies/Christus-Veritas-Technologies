import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class VerifyApiKeyDto {
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}

export class VerifyApiKeyForServiceDto {
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;
}

export class CreateApiKeyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class DeleteApiKeyDto {
  @IsString()
  @IsNotEmpty()
  confirmationText: string;
}
