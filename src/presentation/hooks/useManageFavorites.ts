import { useRepository } from '@core/di/DiContext';
import { Cat } from '@domain/entities';
import { useCallback, useEffect, useState } from 'react';
import { logger } from '@core/utils';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
import { LimitReachedFailure } from '@core/errors/Failure';

export const useManageFavorites = () => {
    const { getFavoritesUseCase, toggleFavoriteUseCase } = useRepository();

    // 1. Local State
    const [favorites, setFavorites] = useState<Cat[]>([]);
    const [error, setError] = useState<Error | null>(null);

    // 2. Load favorites on mount
    const loadFavorites = useCallback(async () => {
        logger.debug('Loading favorites', 'useManageFavorites');
        const result = await getFavoritesUseCase.execute();

        pipe(
            result,
            fold(
                (failure) => {
                    logger.error('Error loading favorites', new Error(failure.message), 'useManageFavorites');
                    setError(new Error(failure.message));
                },
                (data) => {
                    setFavorites(data);
                    logger.info('Favorites loaded successfully', 'useManageFavorites', { count: data.length });
                }
            )
        );
    }, [getFavoritesUseCase]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    // 3. Function to toggle favorite (Manual mutation)
    const toggleFavorite = async (cat: Cat) => {
        setError(null); // Reset error

        logger.info('Toggling favorite', 'useManageFavorites', { catId: cat.id });

        // Attempt the operation
        const result = await toggleFavoriteUseCase.execute(cat);

        return pipe(
            result,
            fold(
                (failure) => {
                    logger.debug(`Failure type: ${failure.constructor.name}, instanceof LimitReachedFailure: ${failure instanceof LimitReachedFailure}`, 'useManageFavorites');
                    if (failure instanceof LimitReachedFailure) {
                        logger.warn('Favorite limit reached for free user', 'useManageFavorites', { catId: cat.id });
                        // Re-throw to propagate to UI/Alerts
                        throw failure;
                    }
                    const err = new Error(failure.message);
                    logger.error('Error toggling favorite', err, 'useManageFavorites', { catId: cat.id });
                    setError(err);
                    throw err;
                },
                async (isNowFavorite) => {
                    // Reload the list to ensure consistency with saved data
                    // Note: We should probably wait for this or optimistic update.
                    // For now, fire and forget loadFavorites to update list
                    await loadFavorites();

                    logger.info('Favorite toggled successfully', 'useManageFavorites', {
                        catId: cat.id,
                        isNowFavorite
                    });
                    return isNowFavorite;
                }
            )
        );
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