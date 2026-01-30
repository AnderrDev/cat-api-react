import { useRepository } from '@core/di/DiContext';
import { Cat, LimitReachedError } from '@domain/entities';
import { useCallback, useEffect, useState } from 'react';
import { logger } from '@core/utils';

export const useManageFavorites = () => {
    const { getFavoritesUseCase, toggleFavoriteUseCase } = useRepository();

    // 1. Local State
    const [favorites, setFavorites] = useState<Cat[]>([]);
    const [error, setError] = useState<Error | null>(null);

    // 2. Load favorites on mount
    const loadFavorites = useCallback(async () => {
        try {
            logger.debug('Loading favorites', 'useManageFavorites');
            const data = await getFavoritesUseCase.execute();
            setFavorites(data);
            logger.info('Favorites loaded successfully', 'useManageFavorites', { count: data.length });
        } catch (e) {
            const error = e instanceof Error ? e : new Error('Unknown error');
            logger.error('Error loading favorites', error, 'useManageFavorites');
        }
    }, [getFavoritesUseCase]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    // 3. Function to toggle favorite (Manual mutation)
    const toggleFavorite = async (cat: Cat) => {
        setError(null); // Reset error
        try {
            logger.info('Toggling favorite', 'useManageFavorites', { catId: cat.id });

            // Attempt the operation (may fail due to limit)
            const isNowFavorite = await toggleFavoriteUseCase.execute(cat);

            // Optimistic Update or Reload
            // In this case, reload the list to ensure consistency with saved data
            await loadFavorites();

            logger.info('Favorite toggled successfully', 'useManageFavorites', {
                catId: cat.id,
                isNowFavorite
            });

            return isNowFavorite;
        } catch (err) {
            // Handle specific error
            if (err instanceof LimitReachedError) {
                logger.warn('Favorite limit reached for free user', 'useManageFavorites', { catId: cat.id });
                // Propagate error for UI to handle (Alerts, etc)
                throw err;
            }
            const error = err instanceof Error ? err : new Error('Unknown Error');
            logger.error('Error toggling favorite', error, 'useManageFavorites', { catId: cat.id });
            setError(error);
            throw err;
        }
    };

    // Helper for UI
    const isFavorite = useCallback((catId: string) => {
        return favorites.some(c => c.id === catId);
    }, [favorites]);

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        error,
    };
};