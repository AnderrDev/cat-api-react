import { Cat, StorageError } from '@domain/entities';
import { LocalStorage } from '@core/local/LocalStorage';
import { logger } from '@core/utils';

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
            logger.debug('Loaded favorites from storage', 'FavoritesDataSource', { key: FAVORITES_KEY });
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            const error = e instanceof Error ? e : new Error('Unknown error');
            logger.error('Error loading favorites from local source', error, 'FavoritesDataSource');
            throw new StorageError('Failed to load favorites', 'read', { key: FAVORITES_KEY });
        }
    }

    async saveFavorite(cat: Cat): Promise<void> {
        try {
            const current = await this.getFavorites();
            if (!current.find(c => c.id === cat.id)) {
                const updated = [...current, cat];
                await this.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
                logger.info('Favorite saved successfully', 'FavoritesDataSource', { catId: cat.id });
            }
        } catch (e) {
            const error = e instanceof Error ? e : new Error('Unknown error');
            logger.error('Error saving favorite', error, 'FavoritesDataSource', { catId: cat.id });
            throw new StorageError('Failed to save favorite', 'write', { key: FAVORITES_KEY, catId: cat.id });
        }
    }

    async removeFavorite(catId: string): Promise<void> {
        try {
            const current = await this.getFavorites();
            const updated = current.filter(c => c.id !== catId);
            await this.localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
            logger.info('Favorite removed successfully', 'FavoritesDataSource', { catId });
        } catch (e) {
            const error = e instanceof Error ? e : new Error('Unknown error');
            logger.error('Error removing favorite', error, 'FavoritesDataSource', { catId });
            throw new StorageError('Failed to remove favorite', 'delete', { key: FAVORITES_KEY, catId });
        }
    }
}
