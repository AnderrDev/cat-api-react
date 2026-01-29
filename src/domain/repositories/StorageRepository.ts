import { Cat, SecurityToken } from '@domain/entities';

export interface StorageRepository {
    // Manejo de Favoritos
    getFavorites(): Promise<Cat[]>;
    saveFavorite(cat: Cat): Promise<void>;
    removeFavorite(catId: string): Promise<void>;

    // Manejo de Seguridad (Token)
    saveToken(token: SecurityToken): Promise<void>;
    getToken(): Promise<SecurityToken | null>;
    clearToken(): Promise<void>;
}