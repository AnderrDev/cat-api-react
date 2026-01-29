import * as Keychain from 'react-native-keychain';
import { SecurityToken } from '@domain/entities';

export interface SecureStorageDataSource {
    saveToken(token: SecurityToken): Promise<void>;
    getToken(): Promise<SecurityToken | null>;
    clearToken(): Promise<void>;
}

export class SecureStorageDataSourceImpl implements SecureStorageDataSource {

    async saveToken(token: SecurityToken): Promise<void> {
        await Keychain.setGenericPassword('auth_token', JSON.stringify(token));
    }

    async getToken(): Promise<SecurityToken | null> {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                return JSON.parse(credentials.password);
            }
            return null;
        } catch (error) {
            console.error('Error retrieving secure token', error);
            return null;
        }
    }

    async clearToken(): Promise<void> {
        await Keychain.resetGenericPassword();
    }
}
