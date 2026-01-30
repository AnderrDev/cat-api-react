import { PaymentRepository, SecureStorageRepository } from '@domain/repositories';
import { CreditCard, SecurityToken } from '@domain/entities';

export class TokenizePaymentMethodUseCase {
    constructor(
        private paymentRepository: PaymentRepository,
        private secureStorageRepository: SecureStorageRepository // We also need to save the token
    ) { }

    async execute(card: CreditCard): Promise<SecurityToken> {
        // 1. Get token from provider (Mock)
        const token = await this.paymentRepository.tokenizeCard(card);

        // 2. Save secure token + Card Info
        const cardInfo = {
            last4: card.cardNumber.slice(-4),
            cardHolder: card.cardHolder,
            brand: 'Visa (Simulated)', // In a real SDK this comes from the issuer
            expiration: card.expirationDate,
        };

        await this.secureStorageRepository.savePaymentDetails({
            token,
            cardInfo
        });

        return token;
    }
}