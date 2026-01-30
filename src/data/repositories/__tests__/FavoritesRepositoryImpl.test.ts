import { FavoritesRepositoryImpl } from '../FavoritesRepositoryImpl';
import { FavoritesDataSource } from '@data/datasources';
import { createMockCat, createMockCats } from '../../../../__tests__/utils/mockFactories';

describe('FavoritesRepositoryImpl', () => {
    let repository: FavoritesRepositoryImpl;
    let mockDataSource: jest.Mocked<FavoritesDataSource>;

    beforeEach(() => {
        mockDataSource = {
            getFavorites: jest.fn(),
            saveFavorite: jest.fn(),
            removeFavorite: jest.fn(),
        } as jest.Mocked<FavoritesDataSource>;

        repository = new FavoritesRepositoryImpl(mockDataSource);
    });

    describe('getFavorites', () => {
        it('should return favorites from data source', async () => {
            const mockFavorites = createMockCats(3);
            mockDataSource.getFavorites.mockResolvedValue(mockFavorites);

            const result = await repository.getFavorites();

            expect(result).toEqual(mockFavorites);
            expect(mockDataSource.getFavorites).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from data source', async () => {
            const error = new Error('Storage error');
            mockDataSource.getFavorites.mockRejectedValue(error);

            await expect(repository.getFavorites()).rejects.toThrow('Storage error');
        });
    });

    describe('saveFavorite', () => {
        it('should save favorite through data source', async () => {
            const cat = createMockCat({ id: 'cat-1' });
            mockDataSource.saveFavorite.mockResolvedValue(undefined);

            await repository.saveFavorite(cat);

            expect(mockDataSource.saveFavorite).toHaveBeenCalledWith(cat);
            expect(mockDataSource.saveFavorite).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from data source', async () => {
            const cat = createMockCat({ id: 'cat-1' });
            const error = new Error('Storage error');
            mockDataSource.saveFavorite.mockRejectedValue(error);

            await expect(repository.saveFavorite(cat)).rejects.toThrow('Storage error');
        });
    });

    describe('removeFavorite', () => {
        it('should remove favorite through data source', async () => {
            const catId = 'cat-123';
            mockDataSource.removeFavorite.mockResolvedValue(undefined);

            await repository.removeFavorite(catId);

            expect(mockDataSource.removeFavorite).toHaveBeenCalledWith(catId);
            expect(mockDataSource.removeFavorite).toHaveBeenCalledTimes(1);
        });

        it('should propagate errors from data source', async () => {
            const catId = 'cat-123';
            const error = new Error('Storage error');
            mockDataSource.removeFavorite.mockRejectedValue(error);

            await expect(repository.removeFavorite(catId)).rejects.toThrow('Storage error');
        });
    });
});
