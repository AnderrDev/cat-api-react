import { SecureStorageRepository, FavoritesRepository } from '@domain/repositories';
import { Cat } from '@domain/entities';
import { Either, left, right, isLeft } from 'fp-ts/Either';
import { Failure, LimitReachedFailure } from '@core/errors/Failure';

// Hardcoded business rule (as per Sofka requirement)
const MAX_FREE_FAVORITES = 3;

export class ToggleFavoriteUseCase {
    constructor(
        private secureStorageRepo: SecureStorageRepository,
        private favoritesRepo: FavoritesRepository
    ) { }

    /**
     * Attempts to add or remove a favorite.
     * If trying to add the 4th without a token, throws an error (returns Left).
     */
    async execute(cat: Cat): Promise<Either<Failure, boolean>> {
        const favoritesResult = await this.favoritesRepo.getFavorites();
        if (isLeft(favoritesResult)) return favoritesResult;
        const favorites = favoritesResult.right;

        const isAlreadyFavorite = favorites.some(c => c.id === cat.id);

        // CASE 1: If already a favorite, remove it (always allowed)
        if (isAlreadyFavorite) {
            const removeResult = await this.favoritesRepo.removeFavorite(cat.id);
            if (isLeft(removeResult)) return removeResult;
            return right(false); // Returns false indicating it's no longer a favorite
        }

        // CASE 2: Wants to add a new one. Verify rules.
        const tokenResult = await this.secureStorageRepo.getToken();
        if (isLeft(tokenResult)) return tokenResult;
        const token = tokenResult.right;

        const hasPremiumAccess = !!token; // If token exists, user is premium

        if (!hasPremiumAccess && favorites.length >= MAX_FREE_FAVORITES) {
            // CORE LOGIC HERE: Block and return specific error
            return left(new LimitReachedFailure("Has alcanzado el límite de 3 favoritos gratuitos."));
        }

        // If passes rules, save it
        const saveResult = await this.favoritesRepo.saveFavorite(cat);
        if (isLeft(saveResult)) return saveResult;

        return right(true); // Returns true indicating it's now a favorite
    }
}