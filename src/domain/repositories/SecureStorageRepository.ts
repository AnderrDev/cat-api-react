import { SecurityToken, CardInfo, StoredPaymentDetails } from '@domain/entities';

export interface SecureStorageRepository {
    // Manejo de Seguridad (Token + Info de Tarjeta)
    savePaymentDetails(details: StoredPaymentDetails): Promise<void>;
    getPaymentDetails(): Promise<StoredPaymentDetails | null>;
    getToken(): Promise<SecurityToken | null>; // Helper conveniente para checks rápidos
    clearToken(): Promise<void>;
}