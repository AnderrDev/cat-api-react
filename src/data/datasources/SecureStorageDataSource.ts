import { StoredPaymentDetails } from '@domain/entities';
import { SecureStorage } from '@core/local/SecureStorage';

export interface SecureStorageDataSource {
    savePaymentDetails(details: StoredPaymentDetails): Promise<void>;
    getPaymentDetails(): Promise<StoredPaymentDetails | null>;
    clearToken(): Promise<void>;
}

export class SecureStorageDataSourceImpl implements SecureStorageDataSource {
    constructor(private secureStorage: SecureStorage) { }

    async savePaymentDetails(details: StoredPaymentDetails): Promise<void> {
        await this.secureStorage.setSecureValue('auth_token', JSON.stringify(details));
    }

    async getPaymentDetails(): Promise<StoredPaymentDetails | null> {
        try {
            const credentials = await this.secureStorage.getSecureValue('auth_token');
            if (credentials) {
                return JSON.parse(credentials) as StoredPaymentDetails;
            }
            return null;
        } catch (error) {
            console.error('Error retrieving secure token', error);
            return null;
        }
    }

    async clearToken(): Promise<void> {
        await this.secureStorage.clearSecureValue('auth_token');
    }
}
