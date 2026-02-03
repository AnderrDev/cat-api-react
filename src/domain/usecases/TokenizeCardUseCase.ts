import { WalletRepository } from '../repositories/WalletRepository';
import { Failure, InvalidCardFailure } from '../../core/errors/Failure';
import { Either, left } from 'fp-ts/Either';

export class TokenizeCardUseCase {
    private walletRepository: WalletRepository;

    constructor(walletRepository: WalletRepository) {
        this.walletRepository = walletRepository;
    }

    async execute(cardNumber: string): Promise<Either<Failure, string>> {
        if (!cardNumber || cardNumber.length < 16) {
            return left(new InvalidCardFailure("Invalid Card Number"));
        }
        return this.walletRepository.tokenizeCard(cardNumber);
    }
}
