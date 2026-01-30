import { SecurityToken, StoredPaymentDetails } from '@domain/entities';
import { SecureStorageRepository } from '@domain/repositories';
import { SecureStorageDataSource } from '@data/datasources';

export class SecureStorageRepositoryImpl implements SecureStorageRepository {
    constructor(private secureDataSource: SecureStorageDataSource) { }

    async savePaymentDetails(details: StoredPaymentDetails): Promise<void> {
        return this.secureDataSource.savePaymentDetails(details);
    }

    async getPaymentDetails(): Promise<StoredPaymentDetails | null> {
        return this.secureDataSource.getPaymentDetails();
    }

    async getToken(): Promise<SecurityToken | null> {
        const details = await this.secureDataSource.getPaymentDetails();
        return details ? details.token : null;
    }

    async clearToken(): Promise<void> {
        return this.secureDataSource.clearToken();
    }
}