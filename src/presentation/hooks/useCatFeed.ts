import { useRepository } from '@core/di/DiContext';
import { Cat, Breed } from '@domain/entities';
import { useCallback, useEffect, useState } from 'react';

export const useCatFeed = () => {
    const { getCatListUseCase, getBreedsUseCase } = useRepository();

    // 1. Estado Local
    const [cats, setCats] = useState<Cat[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [selectedBreedId, setSelectedBreedId] = useState<string | undefined>(undefined);

    // Estado de carga y paginación
    const [isLoading, setIsLoading] = useState(true); // Carga inicial
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false); // Carga de más items
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // 2. Cargar Razas (Solo al montar)
    useEffect(() => {
        const loadBreeds = async () => {
            try {
                const data = await getBreedsUseCase.execute();
                setBreeds(data);
            } catch (error) {
                console.error("Error loading breeds:", error);
            }
        };
        loadBreeds();
    }, []);

    // 3. Cargar Gatos (Efecto principal)
    useEffect(() => {
        const loadCats = async () => {
            // Si es la página 0, es una carga completa o cambio de filtro
            if (page === 0) {
                setIsLoading(true);
            } else {
                setIsFetchingNextPage(true);
            }

            try {
                const newCats = await getCatListUseCase.execute(page, 10, selectedBreedId);

                if (newCats.length === 0) {
                    setHasMore(false);
                } else {
                    setCats(prev => {
                        // Si es página 0, reemplazamos todo
                        if (page === 0) return newCats;

                        // Si no, agregamos y filtramos duplicados
                        const combined = [...prev, ...newCats];
                        const uniqueMap = new Map();
                        combined.forEach(cat => uniqueMap.set(cat.id, cat));
                        return Array.from(uniqueMap.values());
                    });
                }
            } catch (error) {
                console.error("Error loading cats:", error);
            } finally {
                setIsLoading(false);
                setIsFetchingNextPage(false);
            }
        };

        loadCats();
    }, [page, selectedBreedId]);

    // 4. Manejador para cambio de filtro
    const handleSelectBreed = (breedId: string | undefined) => {
        setSelectedBreedId(breedId);
        setPage(0);      // Reseteamos paginación
        setHasMore(true); // Reseteamos bandera de fin
        setCats([]);     // Limpiamos lista actual (opcional, para visual feedback)
    };

    // 5. Manejador para cargar más
    const loadMore = () => {
        if (!isLoading && !isFetchingNextPage && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return {
        cats,
        breeds,
        selectedBreedId,
        setSelectedBreedId: handleSelectBreed, // Usamos nuestro wrapper para resetear estado
        isLoading,
        isFetchingNextPage,
        loadMore,
        refetch: () => setPage(0)
    };
};