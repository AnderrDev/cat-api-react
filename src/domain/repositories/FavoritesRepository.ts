import { Cat } from '@domain/entities';

export interface FavoritesRepository {
    getFavorites(): Promise<Cat[]>;
    saveFavorite(cat: Cat): Promise<void>;
    removeFavorite(catId: string): Promise<void>;
}
