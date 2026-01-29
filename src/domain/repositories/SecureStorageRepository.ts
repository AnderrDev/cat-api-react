import { Cat, SecurityToken } from '@domain/entities';

export interface SecureStorageRepository {
    // Manejo de Seguridad (Token)
    saveToken(token: SecurityToken): Promise<void>;
    getToken(): Promise<SecurityToken | null>;
    clearToken(): Promise<void>;
}