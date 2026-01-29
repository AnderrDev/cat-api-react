import { CreditCard, SecurityToken } from '@domain/entities';

export interface PaymentRepository {
    /**
     * Envía los datos de la tarjeta para obtener un token de autorización.
     */
    tokenizeCard(card: CreditCard): Promise<SecurityToken>;
}