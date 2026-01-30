import { PaymentRepository, SecureStorageRepository } from '@domain/repositories';
import { CreditCard, SecurityToken } from '@domain/entities';

export class TokenizePaymentMethodUseCase {
    constructor(
        private paymentRepository: PaymentRepository,
        private secureStorageRepository: SecureStorageRepository // Necesitamos guardar el token también
    ) { }

    async execute(card: CreditCard): Promise<SecurityToken> {
        // 1. Obtener token del proveedor (Mock)
        const token = await this.paymentRepository.tokenizeCard(card);

        // 2. Guardar token seguro + Info de Tarjeta
        const cardInfo = {
            last4: card.cardNumber.slice(-4),
            cardHolder: card.cardHolder,
            brand: 'Visa (Simulado)', // En un SDK real esto viene del emisor
            expiration: card.expirationDate,
        };

        await this.secureStorageRepository.savePaymentDetails({
            token,
            cardInfo
        });

        return token;
    }
}