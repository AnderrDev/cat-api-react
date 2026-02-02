import { WalletRepository } from '../repositories/WalletRepository';

export class TokenizeCardUseCase {
    private walletRepository: WalletRepository;

    constructor(walletRepository: WalletRepository) {
        this.walletRepository = walletRepository;
    }

    async execute(cardNumber: string): Promise<string> {
        if (!cardNumber || cardNumber.length < 16) {
            throw new Error("Invalid Card Number");
        }
        return this.walletRepository.tokenizeCard(cardNumber);
    }
}
