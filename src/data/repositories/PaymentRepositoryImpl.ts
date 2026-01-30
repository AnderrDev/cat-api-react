import { PaymentService } from '@data/remote';
import { CreditCard, SecurityToken, PaymentError } from '@domain/entities';
import { PaymentRepository } from '@domain/repositories';
import { logger } from '@core/utils';

export class PaymentRepositoryImpl implements PaymentRepository {
    constructor(private paymentService: PaymentService) { }

    async tokenizeCard(card: CreditCard): Promise<SecurityToken> {
        try {
            logger.info('Attempting to tokenize payment method', 'PaymentRepository', {
                cardHolder: card.cardHolder,
                last4: card.cardNumber.slice(-4)
            });

            // Call injected service (Mock or Real)
            const token = await this.paymentService.processPayment(card);

            logger.info('Payment method tokenized successfully', 'PaymentRepository');
            return token;
        } catch (error) {
            // Transform any technical error into a Business Error
            const err = error instanceof Error ? error : new Error('Payment processing failed');
            logger.error('Payment tokenization failed', err, 'PaymentRepository', {
                cardHolder: card.cardHolder
            });
            throw new PaymentError(err.message, { cardHolder: card.cardHolder });
        }
    }
}