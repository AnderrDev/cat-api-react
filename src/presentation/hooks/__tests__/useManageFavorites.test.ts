import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useManageFavorites } from '../useManageFavorites';
import { useRepository } from '@core/di/DiContext';
import { Cat, LimitReachedError } from '@domain/entities';
import { logger } from '@core/utils';

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
        mockGetFavoritesUseCase.execute.mockResolvedValue([]);

        const { result } = renderHook(() => useManageFavorites());

        expect(result.current.favorites).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it('should load favorites on mount', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue([mockCat1, mockCat2]);

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
        const error = new Error('Network error');
        mockGetFavoritesUseCase.execute.mockRejectedValue(error);

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(logger.error).toHaveBeenCalledWith(
                'Error loading favorites',
                error,
                'useManageFavorites'
            );
        });

        expect(result.current.favorites).toEqual([]);
    });

    it('should check if a cat is favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue([mockCat1]);

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toHaveLength(1);
        });

        expect(result.current.isFavorite('1')).toBe(true);
        expect(result.current.isFavorite('2')).toBe(false);
    });

    it('should toggle favorite successfully', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue([mockCat1]);
        mockToggleFavoriteUseCase.execute.mockResolvedValue(true);

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toHaveLength(1);
        });

        mockGetFavoritesUseCase.execute.mockResolvedValue([mockCat1, mockCat2]);

        await act(async () => {
            const isNowFavorite = await result.current.toggleFavorite(mockCat2);
            expect(isNowFavorite).toBe(true);
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
        mockGetFavoritesUseCase.execute.mockResolvedValue([]);
        const limitError = new LimitReachedError();
        mockToggleFavoriteUseCase.execute.mockRejectedValue(limitError);

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toEqual([]);
        });

        await expect(result.current.toggleFavorite(mockCat1)).rejects.toThrow(LimitReachedError);

        expect(logger.warn).toHaveBeenCalledWith(
            'Favorite limit reached for free user',
            'useManageFavorites',
            { catId: '1' }
        );
    });

    it('should handle general errors when toggling favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue([]);
        const error = new Error('Unknown error');
        mockToggleFavoriteUseCase.execute.mockRejectedValue(error);

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toEqual([]);
        });

        await expect(result.current.toggleFavorite(mockCat1)).rejects.toThrow(Error);

        expect(logger.error).toHaveBeenCalledWith(
            'Error toggling favorite',
            error,
            'useManageFavorites',
            { catId: '1' }
        );

        await waitFor(() => {
            expect(result.current.error).toBe(error);
        });
    });

    it('should reset error when toggling favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue([]);
        const error = new Error('Previous error');
        mockToggleFavoriteUseCase.execute.mockRejectedValueOnce(error);

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toEqual([]);
        });

        // First toggle fails
        await expect(result.current.toggleFavorite(mockCat1)).rejects.toThrow();

        await waitFor(() => {
            expect(result.current.error).toBe(error);
        });

        // Second toggle succeeds
        mockToggleFavoriteUseCase.execute.mockResolvedValue(true);
        mockGetFavoritesUseCase.execute.mockResolvedValue([mockCat1]);

        await act(async () => {
            await result.current.toggleFavorite(mockCat1);
        });

        await waitFor(() => {
            expect(result.current.error).toBeNull();
        });
    });

    it('should handle non-Error objects when loading favorites', async () => {
        mockGetFavoritesUseCase.execute.mockRejectedValue('String error');

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

    it('should handle non-Error objects when toggling favorite', async () => {
        mockGetFavoritesUseCase.execute.mockResolvedValue([]);
        mockToggleFavoriteUseCase.execute.mockRejectedValue('String error');

        const { result } = renderHook(() => useManageFavorites());

        await waitFor(() => {
            expect(result.current.favorites).toEqual([]);
        });

        await expect(result.current.toggleFavorite(mockCat1)).rejects.toBeTruthy();

        await waitFor(() => {
            expect(result.current.error).toEqual(expect.any(Error));
        });
    });
});
