import { FavoritesRepository } from '@domain/repositories';
import { Cat } from '@domain/entities';

export class GetFavoritesUseCase {
    constructor(private favoritesRepository: FavoritesRepository) { }

    async execute(): Promise<Cat[]> {
        return await this.favoritesRepository.getFavorites();
    }
}
