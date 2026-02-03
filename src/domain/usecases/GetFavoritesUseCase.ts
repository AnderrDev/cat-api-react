import { FavoritesRepository } from '@domain/repositories';
import { Cat } from '@domain/entities';
import { Either } from 'fp-ts/Either';
import { Failure } from '@core/errors/Failure';

export class GetFavoritesUseCase {
    constructor(private favoritesRepository: FavoritesRepository) { }

    async execute(): Promise<Either<Failure, Cat[]>> {
        return await this.favoritesRepository.getFavorites();
    }
}
