import { PaymentMockService } from '@data/remote';
import { CreditCard, SecurityToken, PaymentError } from '@domain/entities';
import { PaymentRepository } from '@domain/repositories';

export class PaymentRepositoryImpl implements PaymentRepository {
    async tokenizeCard(card: CreditCard): Promise<SecurityToken> {
        try {
            // Aquí llamamos al Mock, pero en el futuro cambiaríamos esto por una llamada real a Stripe/Bold/etc.
            const token = await PaymentMockService.processPayment(card);
            return token;
        } catch (error) {
            // Transformamos cualquier error técnico en un Error de Negocio
            throw new PaymentError(error instanceof Error ? error.message : undefined);
        }
    }
}