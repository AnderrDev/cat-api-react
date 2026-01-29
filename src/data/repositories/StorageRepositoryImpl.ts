import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { Cat, SecurityToken } from '@domain/entities';
import { StorageRepository } from '@domain/repositories';

const FAVORITES_KEY = '@favorites_v1';

export class StorageRepositoryImpl implements StorageRepository {

    // --- MANEJO DE FAVORITOS (AsyncStorage) ---

    async getFavorites(): Promise<Cat[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Error leyendo favoritos', e);
            return [];
        }
    }

    async saveFavorite(cat: Cat): Promise<void> {
        const current = await this.getFavorites();
        // Evitamos duplicados por si acaso
        if (!current.find(c => c.id === cat.id)) {
            const updated = [...current, cat];
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        }
    }

    async removeFavorite(catId: string): Promise<void> {
        const current = await this.getFavorites();
        const updated = current.filter(c => c.id !== catId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    }

    // --- MANEJO DE SEGURIDAD (Keychain) ---
    // Esto es lo que busca Sofka: que no guardes tokens en AsyncStorage

    async saveToken(token: SecurityToken): Promise<void> {
        // Keychain guarda usuario/password. Usamos 'token' como usuario y el JSON como password
        await Keychain.setGenericPassword('auth_token', JSON.stringify(token));
    }

    async getToken(): Promise<SecurityToken | null> {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                // credentials.password contiene nuestro JSON string
                return JSON.parse(credentials.password);
            }
            return null;
        } catch (error) {
            console.error('Error recuperando token seguro', error);
            return null;
        }
    }

    async clearToken(): Promise<void> {
        await Keychain.resetGenericPassword();
    }
}