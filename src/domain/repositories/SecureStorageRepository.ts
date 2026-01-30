import { SecurityToken, CardInfo, StoredPaymentDetails } from '@domain/entities';

export interface SecureStorageRepository {
    // Security Management (Token + Card Info)
    savePaymentDetails(details: StoredPaymentDetails): Promise<void>;
    getPaymentDetails(): Promise<StoredPaymentDetails | null>;
    getToken(): Promise<SecurityToken | null>; // Convenient helper for quick checks
    clearToken(): Promise<void>;
}