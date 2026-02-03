import { Cat } from '@domain/entities';
import { Either } from 'fp-ts/Either';
import { Failure } from '../../core/errors/Failure';

export interface FavoritesRepository {
    getFavorites(): Promise<Either<Failure, Cat[]>>;
    saveFavorite(cat: Cat): Promise<Either<Failure, void>>;
    removeFavorite(catId: string): Promise<Either<Failure, void>>;
}
