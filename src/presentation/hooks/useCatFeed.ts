import { useRepository } from '@core/di/DiContext';
import { Cat, Breed } from '@domain/entities';
import { useEffect, useState } from 'react';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';

export const useCatFeed = () => {
    const { getCatListUseCase, getBreedsUseCase } = useRepository();

    // 1. Local State
    const [cats, setCats] = useState<Cat[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [selectedBreedId, setSelectedBreedId] = useState<string | undefined>(undefined);

    // Loading and pagination state
    const [isLoading, setIsLoading] = useState(true); // Initial loading
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false); // Loading more items
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    // 2. Load Breeds (Only on mount)
    useEffect(() => {
        const loadBreeds = async () => {
            const result = await getBreedsUseCase.execute();
            pipe(
                result,
                fold(
                    (error) => console.error("Error loading breeds:", error.message),
                    (data) => setBreeds(data)
                )
            );
        };
        loadBreeds();
    }, [getBreedsUseCase]);

    // 3. Load Cats (Main effect)
    useEffect(() => {
        const loadCats = async () => {
            // If page 0, it's a full load or filter change
            if (page === 0) {
                setIsLoading(true);
            } else {
                setIsFetchingNextPage(true);
            }

            try {
                const result = await getCatListUseCase.execute(page, 10, selectedBreedId);

                pipe(
                    result,
                    fold(
                        (error) => {
                            console.error("Error loading cats:", error.message);
                        },
                        (newCats) => {
                            if (newCats.length === 0) {
                                setHasMore(false);
                            } else {
                                setCats(prev => {
                                    // If page 0, replace everything
                                    if (page === 0) return newCats;

                                    // Otherwise, add and filter duplicates
                                    const combined = [...prev, ...newCats];
                                    const uniqueMap = new Map();
                                    combined.forEach(cat => uniqueMap.set(cat.id, cat));
                                    return Array.from(uniqueMap.values());
                                });
                            }
                        }
                    )
                );
            } catch (error) {
                // Should not happen with Either, but safety net
                console.error("Unexpected error loading cats:", error);
            } finally {
                setIsLoading(false);
                setIsFetchingNextPage(false);
            }
        };

        loadCats();
    }, [page, selectedBreedId, refetchTrigger, getCatListUseCase]);

    // 4. Handler for filter change
    const handleSelectBreed = (breedId: string | undefined) => {
        setSelectedBreedId(breedId);
        setPage(0);      // Reset pagination
        setHasMore(true); // Reset end flag
        setCats([]);     // Clear current list (optional, for visual feedback)
    };

    // 5. Handler to load more
    const loadMore = () => {
        if (!isLoading && !isFetchingNextPage && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    // 6. Refetch handler
    const refetch = () => {
        setPage(0);
        setRefetchTrigger(prev => prev + 1);
    };

    return {
        cats,
        breeds,
        selectedBreedId,
        setSelectedBreedId: handleSelectBreed, // Use our wrapper to reset state
        isLoading,
        isFetchingNextPage,
        loadMore,
        refetch
    };
};