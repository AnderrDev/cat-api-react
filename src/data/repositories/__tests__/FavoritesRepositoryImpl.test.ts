import { FavoritesRepositoryImpl } from '../FavoritesRepositoryImpl';
import { FavoritesDataSource } from '@data/datasources';
import { createMockCat, createMockCats } from '../../../../__tests__/utils/mockFactories';
import { right, left } from 'fp-ts/Either';
import { CacheFailure } from '@core/errors/Failure';

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

            expect(result).toEqual(right(mockFavorites));
            expect(mockDataSource.getFavorites).toHaveBeenCalledTimes(1);
        });

        it('should return CacheFailure when data source fails', async () => {
            const error = new Error('Storage error');
            mockDataSource.getFavorites.mockRejectedValue(error);

            const result = await repository.getFavorites();

            expect(result).toEqual(left(new CacheFailure('Storage error')));
        });
    });

    describe('saveFavorite', () => {
        it('should save favorite through data source', async () => {
            const cat = createMockCat({ id: 'cat-1' });
            mockDataSource.saveFavorite.mockResolvedValue(undefined);

            const result = await repository.saveFavorite(cat);

            expect(result).toEqual(right(undefined));
            expect(mockDataSource.saveFavorite).toHaveBeenCalledWith(cat);
            expect(mockDataSource.saveFavorite).toHaveBeenCalledTimes(1);
        });

        it('should return CacheFailure when data source fails', async () => {
            const cat = createMockCat({ id: 'cat-1' });
            const error = new Error('Storage error');
            mockDataSource.saveFavorite.mockRejectedValue(error);

            const result = await repository.saveFavorite(cat);

            expect(result).toEqual(left(new CacheFailure('Storage error')));
        });
    });

    describe('removeFavorite', () => {
        it('should remove favorite through data source', async () => {
            const catId = 'cat-123';
            mockDataSource.removeFavorite.mockResolvedValue(undefined);

            const result = await repository.removeFavorite(catId);

            expect(result).toEqual(right(undefined));
            expect(mockDataSource.removeFavorite).toHaveBeenCalledWith(catId);
            expect(mockDataSource.removeFavorite).toHaveBeenCalledTimes(1);
        });

        it('should return CacheFailure when data source fails', async () => {
            const catId = 'cat-123';
            const error = new Error('Storage error');
            mockDataSource.removeFavorite.mockRejectedValue(error);

            const result = await repository.removeFavorite(catId);

            expect(result).toEqual(left(new CacheFailure('Storage error')));
        });
    });
});
