import { useInfiniteQuery } from '@tanstack/react-query';
import { useRepository } from '@core/di/DiContext';
import { Cat } from '@domain/entities';
import { useMemo } from 'react';

export const useCatFeed = () => {
    // 1. Obtenemos el repositorio inyectado
    const { getCatListUseCase } = useRepository();

    // 2. Usamos useInfiniteQuery
    const query = useInfiniteQuery({
        queryKey: ['cats'], // Clave única para el caché
        initialPageParam: 0,

        // Función de carga
        queryFn: async ({ pageParam = 0 }) => {
            // Pedimos 10 gatos por página
            return await getCatListUseCase.execute(pageParam, 10);
        },

        // Lógica para calcular la siguiente página
        getNextPageParam: (lastPage, allPages) => {
            // Si la API devolvió menos de lo esperado, llegamos al final
            if (lastPage.length === 0) return undefined;
            // Si no, la siguiente página es el número de páginas actuales
            return allPages.length;
        },
    });

    // 3. Aplanamos y Deduplicamos (IMPORTANTE para TheCatAPI)
    const cats = useMemo(() => {
        if (!query.data) return [];

        // "Aplanamos" el array de arrays que devuelve infiniteQuery
        const allCats = query.data.pages.flatMap(page => page);

        // Filtramos duplicados por ID usando un Map
        const uniqueCatsMap = new Map();
        allCats.forEach(cat => {
            if (!uniqueCatsMap.has(cat.id)) {
                uniqueCatsMap.set(cat.id, cat);
            }
        });

        return Array.from(uniqueCatsMap.values()) as Cat[];
    }, [query.data]);

    return {
        cats,
        isLoading: query.isLoading,
        isError: query.isError,
        // Funciones para el FlatList
        loadMore: query.fetchNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        refetch: query.refetch,
    };
};