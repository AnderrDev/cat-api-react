import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from './LocalStorage';

export class AsyncStorageImpl implements LocalStorage {
    async getItem(key: string): Promise<string | null> {
        return AsyncStorage.getItem(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        return AsyncStorage.setItem(key, value);
    }

    async removeItem(key: string): Promise<void> {
        return AsyncStorage.removeItem(key);
    }
}
