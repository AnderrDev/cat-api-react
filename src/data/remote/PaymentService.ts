import { CreditCard, SecurityToken } from '@domain/entities';

export interface PaymentService {
    processPayment(card: CreditCard): Promise<SecurityToken>;
}
