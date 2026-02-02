import SecureVault from '../modules/SecureVault';
import { SecureStorage } from './SecureStorage';

export class SecureStorageImpl implements SecureStorage {
    async setSecureValue(key: string, value: string): Promise<void> {
        await SecureVault.setSecureValue(key, value);
    }

    async getSecureValue(key: string): Promise<string | null> {
        return await SecureVault.getSecureValue(key);
    }

    async clearSecureValue(key: string): Promise<void> {
        await SecureVault.clearSecureValue(key);
    }

    // NEW METHOD SPECIAL FOR WALLET
    async tokenizeCard(cardNumber: string): Promise<string> {
        return await SecureVault.tokenizeCard(cardNumber);
    }
}
