import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useManageFavorites } from '../useManageFavorites';
import { useRepository } from '@core/di/DiContext';
import { Cat } from '@domain/entities';
import { logger } from '@core/utils';
import { right, left } from 'fp-ts/Either';
import { NetworkFailure, LimitReachedFailure } from '@core/errors/Failure';

jest.mock('@core/di/DiContext');
jest.mock('@core/utils', () => ({
    logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
    }
}));

describe('useManageFavorites', () => {
    const mockGetFavoritesUseCase = {
        execute: jest.fn()
    };

    const mockToggleFavoriteUseCase = {
        execute: jest.fn()
    };

    const mockCat1: Cat = {
        id: '1',
        url: 'https://example.com/cat1.jpg',
        breeds: []
    };

    const mockCat2: Cat = {
        id: '2',
        url: 'https://example.com/cat2.jpg',
        breeds: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useRepository as jest.Mock).mockReturnValue({
            getFavoritesUseCase: mockGetFavoritesUseCase,
            toggleFavoriteUseCase: mockToggleFavoriteUseCase
        });
    });

    it('should initialize with empty favorites', () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([]));

        const { result } = renderHook(() => useManageFavorites());

        expect(result.current.favorites).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it('should load favorites on mount', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([mockCat1, mockCat2]));

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toHaveLength(2);
        });

        expect(result.current.favorites).toEqual([mockCat1, mockCat2]);
        expect(logger.debug).toHaveBeenCalledWith('Loading favorites', 'useManageFavorites');
        expect(logger.info).toHaveBeenCalledWith(
            'Favorites loaded successfully',
            'useManageFavorites',
            { count: 2 }
        );
    });

    it('should handle errors when loading favorites', async () => {
        const error = new NetworkFailure('Network error');
        mockGetFavoritesUseCase.execute.mockResolvedValue(left(error));

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(logger.error).toHaveBeenCalledWith(
                'Error loading favorites',
                expect.any(Error),
                'useManageFavorites'
            );
        });

        expect(result.current.favorites).toEqual([]);
    });

    it('should check if a cat is favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([mockCat1]));

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toHaveLength(1);
        });

        expect(result.current.isFavorite('1')).toBe(true);
        expect(result.current.isFavorite('2')).toBe(false);
    });

    it('should toggle favorite successfully', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([mockCat1]));
        mockToggleFavoriteUseCase.execute.mockResolvedValue(right(true));

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toHaveLength(1);
        });

        // Update mock for the refresh after toggle
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([mockCat1, mockCat2]));

        await act(async () => {
            await result.current.toggleFavorite(mockCat2);
        });

        await waitFor(() => {
            expect(result.current.favorites).toHaveLength(2);
        });

        expect(mockToggleFavoriteUseCase.execute).toHaveBeenCalledWith(mockCat2);
        expect(logger.info).toHaveBeenCalledWith(
            'Toggling favorite',
            'useManageFavorites',
            { catId: '2' }
        );
    });

    it('should handle limit reached error when toggling favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([]));
        const limitError = new LimitReachedFailure("Limit reached");
        mockToggleFavoriteUseCase.execute.mockResolvedValue(left(limitError));

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toEqual([]);
        });

        // The hook re-throws the LimitReachedFailure
        await expect(result.current.toggleFavorite(mockCat1)).rejects.toBe(limitError);

        expect(logger.warn).toHaveBeenCalledWith(
            'Favorite limit reached for free user',
            'useManageFavorites',
            { catId: '1' }
        );
    });

    it('should handle general errors when toggling favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([]));
        const error = new NetworkFailure('Unknown error');
        mockToggleFavoriteUseCase.execute.mockResolvedValue(left(error));

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toEqual([]);
        });

        // The hook converts non-LimitReachedFailure to Error and throws it
        // Check `useManageFavorites.ts` logic: `const err = new Error(failure.message); throw err;`
        await expect(result.current.toggleFavorite(mockCat1)).rejects.toThrow('Unknown error');

        // Check if error state was set (which is also the Error object)
        // Note: result.current.error might be the Error object, not NetworkFailure.
        // Let's waitFor error state update.
        await waitFor(() => {
            expect(result.current.error).toBeInstanceOf(Error);
            expect(result.current.error?.message).toBe('Unknown error');
        });

        expect(logger.error).toHaveBeenCalledWith(
            'Error toggling favorite',
            expect.any(Error),
            'useManageFavorites',
            { catId: '1' }
        );
    });

    it('should reset error when toggling favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([]));
        const error = new NetworkFailure('Previous error');
        mockToggleFavoriteUseCase.execute.mockResolvedValueOnce(left(error));

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toEqual([]);
        });

        // First toggle fails
        await expect(result.current.toggleFavorite(mockCat1)).rejects.toThrow('Previous error');

        await waitFor(() => {
            expect(result.current.error).toBeInstanceOf(Error);
        });

        // Second toggle succeeds
        mockToggleFavoriteUseCase.execute.mockResolvedValue(right(true));
        mockGetFavoritesUseCase.execute.mockResolvedValue(right([mockCat1]));

        await act(async () => {
            await result.current.toggleFavorite(mockCat1);
        });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
        });
    });
});
