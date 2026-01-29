import { Cat } from '@domain/entities';
import { LocalStorage } from '@core/local/LocalStorage';

export interface FavoritesDataSource {
    getFavorites(): Promise<Cat[]>;
    saveFavorite(cat: Cat): Promise<void>;
    removeFavorite(catId: string): Promise<void>;
}

const FAVORITES_KEY = '@favorites_v1';

export class FavoritesDataSourceImpl implements FavoritesDataSource {
    constructor(private localStorage: LocalStorage) { }

    async getFavorites(): Promise<Cat[]> {
        try {
            const jsonValue = await this.localStorage.getItem(FAVORITES_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Error loading favorites from local source', e);
            return [];
        }
    }

    async saveFavorite(cat: Cat): Promise<void> {
        const current = await this.getFavorites();
        if (!current.find(c => c.id === cat.id)) {
            const updated = [...current, cat];
            await this.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        }
    }

    async removeFavorite(catId: string): Promise<void> {
        const current = await this.getFavorites();
        const updated = current.filter(c => c.id !== catId);
        await this.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    }
}
