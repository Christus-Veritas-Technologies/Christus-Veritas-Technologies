declare module "paynow" {
  export interface PaynowConfig {
    integrationId: string;
    integrationKey: string;
    resultUrl: string;
    returnUrl: string;
  }

  export interface PaynowPayment {
    reference: string;
    items: Array<{ title: string; amount: number }>;
    add(title: string, amount: number): void;
  }

  export interface InitResponse {
    success: boolean;
    hasRedirect: boolean;
    redirectUrl?: string;
    error?: string;
    pollUrl?: string;
    instructions?: string;
  }

  export interface StatusResponse {
    paid: boolean;
    status: string;
    amount?: number;
    reference?: string;
    paynowReference?: string;
    pollUrl?: string;
  }

  export class Paynow {
    constructor(integrationId: string, integrationKey: string);
    resultUrl: string;
    returnUrl: string;
    createPayment(reference: string, authEmail: string): PaynowPayment;
    send(payment: PaynowPayment): Promise<InitResponse>;
    sendMobile(
      payment: PaynowPayment,
      phone: string,
      method: string
    ): Promise<InitResponse>;
    pollTransaction(pollUrl: string): Promise<StatusResponse>;
  }
}
