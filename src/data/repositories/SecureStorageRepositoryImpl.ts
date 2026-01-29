import { SecurityToken } from '@domain/entities';
import { SecureStorageRepository } from '@domain/repositories';
import { SecureStorageDataSource } from '@data/datasources';

export class SecureStorageRepositoryImpl implements SecureStorageRepository {
    constructor(private secureDataSource: SecureStorageDataSource) { }

    async saveToken(token: SecurityToken): Promise<void> {
        return this.secureDataSource.saveToken(token);
    }

    async getToken(): Promise<SecurityToken | null> {
        return this.secureDataSource.getToken();
    }

    async clearToken(): Promise<void> {
        return this.secureDataSource.clearToken();
    }
}