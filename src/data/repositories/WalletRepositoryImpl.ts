import { WalletRepository } from '../../domain/repositories/WalletRepository';
import SecureVault from '../../core/modules/SecureVault';

export class WalletRepositoryImpl implements WalletRepository {
    async tokenizeCard(cardNumber: string): Promise<string> {
        return await SecureVault.tokenizeCard(cardNumber);
    }
}
