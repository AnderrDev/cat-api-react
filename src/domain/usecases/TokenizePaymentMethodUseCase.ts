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

        // 2. Guardar token seguro (Keychain)
        // El diagrama implica que el caso de uso maneja el flujo completo
        await this.secureStorageRepository.saveToken(token);

        return token;
    }
}