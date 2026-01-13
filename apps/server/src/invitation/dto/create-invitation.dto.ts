export class CreateInvitationDto {
  email: string;
  name: string;
  role: 'ADMIN' | 'CLIENT';
  provisionServiceId?: string;
  provisionUnits?: number;
  provisionRecurring?: boolean;
}
