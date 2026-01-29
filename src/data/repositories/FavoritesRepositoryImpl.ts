import { Cat } from '@domain/entities';
import { FavoritesRepository } from '@domain/repositories';
import { FavoritesDataSource } from '@data/datasources';

export class FavoritesRepositoryImpl implements FavoritesRepository {
    constructor(private localDataSource: FavoritesDataSource) { }

    async getFavorites(): Promise<Cat[]> {
        return this.localDataSource.getFavorites();
    }

    async saveFavorite(cat: Cat): Promise<void> {
        return this.localDataSource.saveFavorite(cat);
    }

    async removeFavorite(catId: string): Promise<void> {
        return this.localDataSource.removeFavorite(catId);
    }
}
