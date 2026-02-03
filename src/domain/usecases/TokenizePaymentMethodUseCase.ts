import { PaymentRepository, SecureStorageRepository } from '@domain/repositories';
import { CreditCard, SecurityToken } from '@domain/entities';
import { Either, isLeft, right } from 'fp-ts/Either';
import { Failure } from '@core/errors/Failure';

export class TokenizePaymentMethodUseCase {
    constructor(
        private paymentRepository: PaymentRepository,
        private secureStorageRepository: SecureStorageRepository // We also need to save the token
    ) { }

    async execute(card: CreditCard): Promise<Either<Failure, SecurityToken>> {
        // 1. Get token from provider (Mock)
        const tokenResult = await this.paymentRepository.tokenizeCard(card);
        if (isLeft(tokenResult)) return tokenResult;
        const token = tokenResult.right;

        // 2. Save secure token + Card Info
        const cardInfo = {
            last4: card.cardNumber.slice(-4),
            cardHolder: card.cardHolder,
            brand: 'Visa (Simulated)', // In a real SDK this comes from the issuer
            expiration: card.expirationDate,
        };

        const saveResult = await this.secureStorageRepository.savePaymentDetails({
            token,
            cardInfo
        });
        if (isLeft(saveResult)) return saveResult;

        return right(token);
    }
}