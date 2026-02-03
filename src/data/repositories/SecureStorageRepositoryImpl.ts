import { SecurityToken, StoredPaymentDetails } from '@domain/entities';
import { SecureStorageRepository } from '@domain/repositories';
import { SecureStorageDataSource } from '@data/datasources';
import { Either, left, right } from 'fp-ts/Either';
import { Failure, StorageFailure } from '@core/errors/Failure';

export class SecureStorageRepositoryImpl implements SecureStorageRepository {
    constructor(private secureDataSource: SecureStorageDataSource) { }

    async savePaymentDetails(details: StoredPaymentDetails): Promise<Either<Failure, void>> {
        try {
            await this.secureDataSource.savePaymentDetails(details);
            return right(undefined);
        } catch (error) {
            return left(new StorageFailure(error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async getPaymentDetails(): Promise<Either<Failure, StoredPaymentDetails | null>> {
        try {
            const details = await this.secureDataSource.getPaymentDetails();
            return right(details);
        } catch (error) {
            return left(new StorageFailure(error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async getToken(): Promise<Either<Failure, SecurityToken | null>> {
        try {
            const details = await this.secureDataSource.getPaymentDetails();
            return right(details ? details.token : null);
        } catch (error) {
            return left(new StorageFailure(error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async clearToken(): Promise<Either<Failure, void>> {
        try {
            await this.secureDataSource.clearToken();
            return right(undefined);
        } catch (error) {
            return left(new StorageFailure(error instanceof Error ? error.message : 'Unknown error'));
        }
    }
}