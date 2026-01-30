import * as Keychain from 'react-native-keychain';
import { SecureStorage } from './SecureStorage';

export class SecureStorageImpl implements SecureStorage {
    async setSecureValue(key: string, value: string): Promise<void> {
        await Keychain.setGenericPassword(key, value);
    }

    async getSecureValue(key: string): Promise<string | null> {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials && credentials.username === key) {
                return credentials.password;
            }
            return null;
        } catch (error) {
            console.error('Error retrieving secure value', error);
            return null;
        }
    }

    async clearSecureValue(_key: string): Promise<void> {
        await Keychain.resetGenericPassword();
    }
}
