import { SecurityToken, StoredPaymentDetails } from '@domain/entities';
import { Either } from 'fp-ts/Either';
import { Failure } from '../../core/errors/Failure';

export interface SecureStorageRepository {
    // Security Management (Token + Card Info)
    savePaymentDetails(details: StoredPaymentDetails): Promise<Either<Failure, void>>;
    getPaymentDetails(): Promise<Either<Failure, StoredPaymentDetails | null>>;
    getToken(): Promise<Either<Failure, SecurityToken | null>>; // Convenient helper for quick checks
    clearToken(): Promise<Either<Failure, void>>;
}