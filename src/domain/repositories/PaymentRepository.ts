import { CreditCard, SecurityToken } from '@domain/entities';
import { Either } from 'fp-ts/Either';
import { Failure } from '../../core/errors/Failure';

export interface PaymentRepository {
    /**
     * Envía los datos de la tarjeta para obtener un token de autorización.
     */
    tokenizeCard(card: CreditCard): Promise<Either<Failure, SecurityToken>>;
}