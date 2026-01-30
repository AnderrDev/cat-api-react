import { useRepository } from '@core/di/DiContext';
import { Cat, LimitReachedError } from '@domain/entities';
import { useCallback, useEffect, useState } from 'react';

export const useManageFavorites = () => {
    const { getFavoritesUseCase, toggleFavoriteUseCase } = useRepository();

    // 1. Estado Local
    const [favorites, setFavorites] = useState<Cat[]>([]);
    const [error, setError] = useState<Error | null>(null);

    // 2. Cargar favoritos al inicio
    const loadFavorites = useCallback(async () => {
        try {
            const data = await getFavoritesUseCase.execute();
            setFavorites(data);
        } catch (e) {
            console.error("Error loading favorites", e);
        }
    }, [getFavoritesUseCase]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    // 3. Función para alternar favorito (Mutation manual)
    const toggleFavorite = async (cat: Cat) => {
        setError(null); // Resetear error
        try {
            // Intentamos la operación (que puede fallar por límite)
            const isNowFavorite = await toggleFavoriteUseCase.execute(cat);

            // Actualización Optimista o Recarga
            // En este caso, recargamos la lista para asegurar consistencia con lo guardado
            await loadFavorites();

            return isNowFavorite;
        } catch (err) {
            // Manejo del error específico
            if (err instanceof LimitReachedError) {
                // Propagar el error para que la UI lo maneje (Alertas, etc)
                throw err;
            }
            setError(err instanceof Error ? err : new Error('Unknown Error'));
            throw err;
        }
    };

    // Helper para UI
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