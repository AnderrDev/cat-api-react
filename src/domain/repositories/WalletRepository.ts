import { Either } from 'fp-ts/Either';
import { Failure } from '../../core/errors/Failure';

export interface WalletRepository {
    tokenizeCard(cardNumber: string): Promise<Either<Failure, string>>;
}
