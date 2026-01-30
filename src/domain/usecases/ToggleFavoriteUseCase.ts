import { SecureStorageRepository, FavoritesRepository } from '@domain/repositories';
import { Cat, LimitReachedError } from '@domain/entities';

// Hardcoded business rule (as per Sofka requirement)
const MAX_FREE_FAVORITES = 3;

export class ToggleFavoriteUseCase {
    constructor(
        private secureStorageRepo: SecureStorageRepository,
        private favoritesRepo: FavoritesRepository
    ) { }

    /**
     * Attempts to add or remove a favorite.
     * If trying to add the 4th without a token, throws an error.
     */
    async execute(cat: Cat): Promise<boolean> {
        const favorites = await this.favoritesRepo.getFavorites();
        const isAlreadyFavorite = favorites.some(c => c.id === cat.id);

        // CASE 1: If already a favorite, remove it (always allowed)
        if (isAlreadyFavorite) {
            await this.favoritesRepo.removeFavorite(cat.id);
            return false; // Returns false indicating it's no longer a favorite
        }

        // CASE 2: Wants to add a new one. Verify rules.
        const token = await this.secureStorageRepo.getToken();
        const hasPremiumAccess = !!token; // If token exists, user is premium

        if (!hasPremiumAccess && favorites.length >= MAX_FREE_FAVORITES) {
            // CORE LOGIC HERE: Block and throw specific error
            throw new LimitReachedError();
        }

        // If passes rules, save it
        await this.favoritesRepo.saveFavorite(cat);
        return true; // Returns true indicating it's now a favorite
    }
}