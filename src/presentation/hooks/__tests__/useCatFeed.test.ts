import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useCatFeed } from '../useCatFeed';
import { useRepository } from '@core/di/DiContext';
import { Cat, Breed } from '@domain/entities';
import { right, left } from 'fp-ts/Either';
import { NetworkFailure } from '@core/errors/Failure';

jest.mock('@core/di/DiContext');

describe('useCatFeed', () => {
    const mockGetCatListUseCase = {
        execute: jest.fn()
    };

    const mockGetBreedsUseCase = {
        execute: jest.fn()
    };

    const mockCats: Cat[] = [
        { id: '1', url: 'https://example.com/cat1.jpg', breeds: [] },
        { id: '2', url: 'https://example.com/cat2.jpg', breeds: [] },
        { id: '3', url: 'https://example.com/cat3.jpg', breeds: [] }
    ];

    const mockBreeds: Breed[] = [
        { id: 'bengal', name: 'Bengal', temperament: 'Active', origin: 'United States', description: 'Bengal cat', life_span: '12-15' },
        { id: 'siamese', name: 'Siamese', temperament: 'Affectionate', origin: 'Thailand', description: 'Siamese cat', life_span: '15-20' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRepository as jest.Mock).mockReturnValue({
            getCatListUseCase: mockGetCatListUseCase,
            getBreedsUseCase: mockGetBreedsUseCase
        });

        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize with loading state', () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right([]));
        mockGetCatListUseCase.execute.mockResolvedValue(right([]));

        const { result } = renderHook(() => useCatFeed());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.cats).toEqual([]);
        expect(result.current.breeds).toEqual([]);
        expect(result.current.selectedBreedId).toBeUndefined();
    });

    it('should load breeds and cats on mount', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValue(right(mockCats));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.breeds).toEqual(mockBreeds);
        expect(result.current.cats).toEqual(mockCats);
        expect(mockGetBreedsUseCase.execute).toHaveBeenCalled();
        expect(mockGetCatListUseCase.execute).toHaveBeenCalledWith(0, 10, undefined);
    });

    it('should handle errors when loading breeds', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(left(new NetworkFailure('Breeds error')));
        mockGetCatListUseCase.execute.mockResolvedValue(right(mockCats));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(console.error).toHaveBeenCalledWith('Error loading breeds:', 'Breeds error');
        expect(result.current.breeds).toEqual([]);
    });

    it('should handle errors when loading cats', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValue(left(new NetworkFailure('Cats error')));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(console.error).toHaveBeenCalledWith('Error loading cats:', 'Cats error');
        expect(result.current.cats).toEqual([]);
    });

    it('should filter cats by breed', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValue(right(mockCats));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        const bengalCats = [mockCats[0]];
        mockGetCatListUseCase.execute.mockResolvedValue(right(bengalCats));

        act(() => {
            result.current.setSelectedBreedId('bengal');
        });

        await waitFor(() => {
            expect(result.current.cats).toEqual(bengalCats);
        });

        expect(mockGetCatListUseCase.execute).toHaveBeenCalledWith(0, 10, 'bengal');
        expect(result.current.selectedBreedId).toBe('bengal');
    });

    it('should reset pagination when changing breed filter', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValue(right(mockCats));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Load more pages
        mockGetCatListUseCase.execute.mockResolvedValue(right([mockCats[0]]));

        act(() => {
            result.current.loadMore();
        });

        await waitFor(() => {
            expect(mockGetCatListUseCase.execute).toHaveBeenCalledWith(1, 10, undefined);
        });

        // Change breed filter
        mockGetCatListUseCase.execute.mockResolvedValue(right([mockCats[1]]));

        act(() => {
            result.current.setSelectedBreedId('bengal');
        });

        await waitFor(() => {
            expect(mockGetCatListUseCase.execute).toHaveBeenCalledWith(0, 10, 'bengal');
        });
    });

    it('should load more cats when scrolling', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValueOnce(right([mockCats[0], mockCats[1]]));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        mockGetCatListUseCase.execute.mockResolvedValueOnce(right([mockCats[2]]));

        act(() => {
            result.current.loadMore();
        });

        await waitFor(() => {
            expect(result.current.cats).toHaveLength(3);
        });

        expect(mockGetCatListUseCase.execute).toHaveBeenCalledWith(1, 10, undefined);
    });

    it('should not load more when already loading', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValue(right(mockCats));

        const { result } = renderHook(() => useCatFeed());

        // Try to load more while initial load is happening
        act(() => {
            result.current.loadMore();
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Should only have been called once (initial load)
        expect(mockGetCatListUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should not load more when no more data available', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValueOnce(right([mockCats[0]]));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Return empty array to indicate no more data
        mockGetCatListUseCase.execute.mockResolvedValueOnce(right([]));

        act(() => {
            result.current.loadMore();
        });

        await waitFor(() => {
            expect(result.current.isFetchingNextPage).toBe(false);
        });

        // Try to load more again
        const callCountBefore = mockGetCatListUseCase.execute.mock.calls.length;

        act(() => {
            result.current.loadMore();
        });

        // Should not call again since hasMore is false
        expect(mockGetCatListUseCase.execute).toHaveBeenCalledTimes(callCountBefore);
    });

    it('should refetch cats from page 0', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValue(right(mockCats));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.cats).toHaveLength(3);
        const initialCallCount = mockGetCatListUseCase.execute.mock.calls.length;

        // Reset the mock implementation for the next call to ensure it returns the same cats
        mockGetCatListUseCase.execute.mockResolvedValue(right([...mockCats]));

        act(() => {
            result.current.refetch();
        });

        await waitFor(() => {
            expect(mockGetCatListUseCase.execute.mock.calls.length).toBe(initialCallCount + 1);
        });

        expect(mockGetCatListUseCase.execute).toHaveBeenLastCalledWith(0, 10, undefined);
    });

    it('should clear cats when changing breed filter', async () => {
        mockGetBreedsUseCase.execute.mockResolvedValue(right(mockBreeds));
        mockGetCatListUseCase.execute.mockResolvedValue(right(mockCats));

        const { result } = renderHook(() => useCatFeed());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.cats).toHaveLength(3);

        // Change breed filter resets everything
        mockGetCatListUseCase.execute.mockResolvedValue(right([mockCats[0]]));

        act(() => {
            result.current.setSelectedBreedId('bengal');
        });

        await waitFor(() => {
            expect(result.current.selectedBreedId).toBe('bengal');
        });
    });
});
