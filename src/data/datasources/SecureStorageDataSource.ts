import * as Keychain from 'react-native-keychain';
import { SecurityToken, StoredPaymentDetails } from '@domain/entities';

export interface SecureStorageDataSource {
    savePaymentDetails(details: StoredPaymentDetails): Promise<void>;
    getPaymentDetails(): Promise<StoredPaymentDetails | null>;
    clearToken(): Promise<void>;
}

export class SecureStorageDataSourceImpl implements SecureStorageDataSource {

    async savePaymentDetails(details: StoredPaymentDetails): Promise<void> {
        await Keychain.setGenericPassword('auth_token', JSON.stringify(details));
    }

    async getPaymentDetails(): Promise<StoredPaymentDetails | null> {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                // Check legacy (just token) vs new (object)
                const parsed = JSON.parse(credentials.password);
                if (parsed.token) {
                    return parsed;
                }
                // Migration fallback: if it's just the old token structure (unlikely in this new flow but good practice)
                return {
                    token: parsed,
                    cardInfo: { last4: '0000', cardHolder: 'Unknown', brand: 'Generic', expiration: '00/00' }
                };
            }
            return null;
        } catch (error) {
            console.error('Error retrieving secure token', error);
            return null;
        }
    }

    async clearToken(): Promise<void> {
        await Keychain.resetGenericPassword();
    }
}
