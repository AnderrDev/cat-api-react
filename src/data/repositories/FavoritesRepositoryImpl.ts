import { Cat } from '@domain/entities';
import { FavoritesRepository } from '@domain/repositories';
import { FavoritesDataSource } from '@data/datasources';
import { Either, left, right } from 'fp-ts/Either';
import { Failure, CacheFailure } from '@core/errors/Failure';

export class FavoritesRepositoryImpl implements FavoritesRepository {
    constructor(private localDataSource: FavoritesDataSource) { }

    async getFavorites(): Promise<Either<Failure, Cat[]>> {
        try {
            const favorites = await this.localDataSource.getFavorites();
            return right(favorites);
        } catch (error) {
            return left(new CacheFailure(error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async saveFavorite(cat: Cat): Promise<Either<Failure, void>> {
        try {
            await this.localDataSource.saveFavorite(cat);
            return right(undefined);
        } catch (error) {
            return left(new CacheFailure(error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async removeFavorite(catId: string): Promise<Either<Failure, void>> {
        try {
            await this.localDataSource.removeFavorite(catId);
            return right(undefined);
        } catch (error) {
            return left(new CacheFailure(error instanceof Error ? error.message : 'Unknown error'));
        }
    }
}
