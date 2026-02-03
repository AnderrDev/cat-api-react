import { PaymentService } from '@data/remote';
import { CreditCard, SecurityToken } from '@domain/entities';
import { PaymentRepository } from '@domain/repositories';
import { logger } from '@core/utils';
import SecureVault from '@core/modules/SecureVault';
import { Either, left, right } from 'fp-ts/Either';
import { Failure, PaymentFailure } from '@core/errors/Failure';

export class PaymentRepositoryImpl implements PaymentRepository {
    constructor(private paymentService: PaymentService) { }

    async tokenizeCard(card: CreditCard): Promise<Either<Failure, SecurityToken>> {
        try {
            logger.info('Attempting to tokenize payment method via Native SecureVault', 'PaymentRepository', {
                cardHolder: card.cardHolder,
                last4: card.cardNumber.slice(-4)
            });

            // Call Native Module directly
            const rawToken = await SecureVault.tokenizeCard(card.cardNumber);

            const token: SecurityToken = {
                accessToken: rawToken,
                createdAt: Date.now()
            };

            logger.info('Payment method tokenized successfully', 'PaymentRepository');
            return right(token);
        } catch (error) {
            // Transform any technical error into a Business Error
            const message = error instanceof Error ? error.message : 'Payment processing failed';
            logger.error('Payment tokenization failed', error instanceof Error ? error : new Error(message), 'PaymentRepository', {
                cardHolder: card.cardHolder
            });
            return left(new PaymentFailure(message));
        }
    }
}