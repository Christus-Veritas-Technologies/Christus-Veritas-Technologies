import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class VerifyApiKeyDto {
  @ApiProperty({
    description: 'The CVT API key to verify',
    example: 'cvt_abc123def456ghi789...',
  })
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}

export class VerifyApiKeyForServiceDto {
  @ApiProperty({
    description: 'The CVT API key to verify',
    example: 'cvt_abc123def456ghi789...',
  })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({
    description: 'The ID of the service to check access for',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  serviceId: string;
}

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'A friendly name for the API key (e.g., "Production POS", "Dev Environment")',
    example: 'My POS Application',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class DeleteApiKeyDto {
  @ApiProperty({
    description: 'Confirmation text - must be exactly "delete my cvt api key"',
    example: 'delete my cvt api key',
  })
  @IsString()
  @IsNotEmpty()
  confirmationText: string;
}
