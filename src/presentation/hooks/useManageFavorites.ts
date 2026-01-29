import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRepository } from '@core/di/DiContext';
import { Cat, LimitReachedError } from '@domain/entities';

export const useManageFavorites = () => {
    const { getFavoritesUseCase, toggleFavoriteUseCase } = useRepository();
    const queryClient = useQueryClient();

    // 1. Query para leer favoritos (Reemplaza al useEffect)
    const { data: favorites = [] } = useQuery({
        queryKey: ['favorites'],
        queryFn: async () => await getFavoritesUseCase.execute(),
    });

    // 2. Mutación para agregar/quitar (Maneja la lógica de éxito/error)
    const mutation = useMutation({
        mutationFn: async (cat: Cat) => {
            return await toggleFavoriteUseCase.execute(cat);
        },
        onSuccess: () => {
            // Si tuvo éxito, invalida la caché para que se refresque la lista sola
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        // IMPORTANTE: Aquí manejamos el error de negocio sin ensuciar la UI
        onError: (error) => {
            if (error instanceof LimitReachedError) {
                // Opción A: Lanzar evento para navegación (lo veremos en el Screen)
                // Opción B (Rápida): Mostrar alerta aquí (aunque es menos limpio)
                console.log("Límite alcanzado");
            }
        }
    });

    // Helper para saber si un gato específico es favorito
    const isFavorite = (catId: string) => favorites.some(c => c.id === catId);

    return {
        favorites,
        isFavorite,
        toggleFavorite: mutation.mutateAsync, // Exponemos la función
        error: mutation.error, // Exponemos el error para que la Screen decida qué hacer
    };
};