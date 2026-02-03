import { GetFavoritesUseCase } from '../GetFavoritesUseCase';
import { FavoritesRepository } from '@domain/repositories';
import { createMockCats } from '../../../../__tests__/utils/mockFactories';
import { right, left } from 'fp-ts/Either';
import { CacheFailure } from '@core/errors/Failure';

describe('GetFavoritesUseCase', () => {
    let getFavoritesUseCase: GetFavoritesUseCase;
    let mockFavoritesRepo: jest.Mocked<FavoritesRepository>;

    beforeEach(() => {
        mockFavoritesRepo = {
            getFavorites: jest.fn(),
            saveFavorite: jest.fn(),
            removeFavorite: jest.fn(),
        } as jest.Mocked<FavoritesRepository>;

        getFavoritesUseCase = new GetFavoritesUseCase(mockFavoritesRepo);
    });

    it('should return empty array when no favorites exist', async () => {
        mockFavoritesRepo.getFavorites.mockResolvedValue(right([]));

        const result = await getFavoritesUseCase.execute();

        expect(result).toEqual(right([]));
        expect(mockFavoritesRepo.getFavorites).toHaveBeenCalledTimes(1);
    });

    it('should return list of favorites', async () => {
        const mockFavorites = createMockCats(3);
        mockFavoritesRepo.getFavorites.mockResolvedValue(right(mockFavorites));

        const result = await getFavoritesUseCase.execute();

        expect(result).toEqual(right(mockFavorites));
        expect(result).toHaveProperty('right.length', 3);
    });

    it('should propagate repository errors', async () => {
        const failure = new CacheFailure('Storage error');
        mockFavoritesRepo.getFavorites.mockResolvedValue(left(failure));

        const result = await getFavoritesUseCase.execute();

        expect(result).toEqual(left(failure));
    });
});
