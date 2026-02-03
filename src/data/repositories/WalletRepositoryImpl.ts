import { WalletRepository } from '../../domain/repositories/WalletRepository';
import SecureVault from '../../core/modules/SecureVault';
import { Either, left, right } from 'fp-ts/Either';
import { Failure, ServerFailure } from '../../core/errors/Failure';

export class WalletRepositoryImpl implements WalletRepository {
    async tokenizeCard(cardNumber: string): Promise<Either<Failure, string>> {
        try {
            const token = await SecureVault.tokenizeCard(cardNumber);
            return right(token);
        } catch (error) {
            return left(new ServerFailure(error instanceof Error ? error.message : "Unknown error"));
        }
    }
}
