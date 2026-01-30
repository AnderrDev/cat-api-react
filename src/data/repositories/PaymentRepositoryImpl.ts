import { PaymentMockService } from '@data/remote';
import { CreditCard, SecurityToken, PaymentError } from '@domain/entities';
import { PaymentRepository } from '@domain/repositories';
import { logger } from '@core/utils';

export class PaymentRepositoryImpl implements PaymentRepository {
    async tokenizeCard(card: CreditCard): Promise<SecurityToken> {
        try {
            logger.info('Attempting to tokenize payment method', 'PaymentRepository', {
                cardHolder: card.cardHolder,
                last4: card.cardNumber.slice(-4)
            });

            // Call Mock service, but in the future this would be a real call to Stripe/Bold/etc.
            const token = await PaymentMockService.processPayment(card);

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