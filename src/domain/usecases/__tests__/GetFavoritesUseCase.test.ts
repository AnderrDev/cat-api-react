import { GetFavoritesUseCase } from '../GetFavoritesUseCase';
import { FavoritesRepository } from '@domain/repositories';
import { createMockCats } from '../../../../__tests__/utils/mockFactories';

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
        mockFavoritesRepo.getFavorites.mockResolvedValue([]);

        const result = await getFavoritesUseCase.execute();

        expect(result).toEqual([]);
        expect(mockFavoritesRepo.getFavorites).toHaveBeenCalledTimes(1);
    });

    it('should return list of favorites', async () => {
        const mockFavorites = createMockCats(3);
        mockFavoritesRepo.getFavorites.mockResolvedValue(mockFavorites);

        const result = await getFavoritesUseCase.execute();

        expect(result).toEqual(mockFavorites);
        expect(result).toHaveLength(3);
    });

    it('should propagate repository errors', async () => {
        mockFavoritesRepo.getFavorites.mockRejectedValue(new Error('Storage error'));

        await expect(getFavoritesUseCase.execute()).rejects.toThrow('Storage error');
    });
});
