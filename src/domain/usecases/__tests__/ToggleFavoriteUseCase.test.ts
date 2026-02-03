import { ToggleFavoriteUseCase } from '../ToggleFavoriteUseCase';
import { LimitReachedFailure } from '@core/errors/Failure';
import { FavoritesRepository, SecureStorageRepository } from '@domain/repositories';
import { createMockCat, createMockCats } from '../../../../__tests__/utils/mockFactories';
import { right, left } from 'fp-ts/Either';

describe('ToggleFavoriteUseCase', () => {
    let toggleFavoriteUseCase: ToggleFavoriteUseCase;
    let mockSecureStorageRepo: jest.Mocked<SecureStorageRepository>;
    let mockFavoritesRepo: jest.Mocked<FavoritesRepository>;

    beforeEach(() => {
        mockSecureStorageRepo = {
            savePaymentDetails: jest.fn(),
            getPaymentDetails: jest.fn(),
            getToken: jest.fn(),
            clearToken: jest.fn(),
        } as jest.Mocked<SecureStorageRepository>;

        mockFavoritesRepo = {
            getFavorites: jest.fn(),
            saveFavorite: jest.fn(),
            removeFavorite: jest.fn(),
        } as jest.Mocked<FavoritesRepository>;

        toggleFavoriteUseCase = new ToggleFavoriteUseCase(
            mockSecureStorageRepo,
            mockFavoritesRepo
        );
    });

    describe('Removing favorites', () => {
        it('should remove a favorite when cat is already favorited', async () => {
            const cat = createMockCat({ id: 'cat-1' });
            const existingFavorites = [cat];

            mockFavoritesRepo.getFavorites.mockResolvedValue(right(existingFavorites));
            mockFavoritesRepo.removeFavorite.mockResolvedValue(right(undefined));

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toEqual(right(false));
            expect(mockFavoritesRepo.removeFavorite).toHaveBeenCalledWith('cat-1');
            expect(mockFavoritesRepo.saveFavorite).not.toHaveBeenCalled();
        });
    });

    describe('Adding favorites - Premium users', () => {
        it('should add favorite when premium user has < 3 favorites', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(2);

            mockFavoritesRepo.getFavorites.mockResolvedValue(right(existingFavorites));
            mockSecureStorageRepo.getToken.mockResolvedValue(right({ accessToken: 'premium-token', createdAt: Date.now() }));
            mockFavoritesRepo.saveFavorite.mockResolvedValue(right(undefined));

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toEqual(right(true));
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should add 4th favorite when user is premium', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(3);

            mockFavoritesRepo.getFavorites.mockResolvedValue(right(existingFavorites));
            mockSecureStorageRepo.getToken.mockResolvedValue(right({ accessToken: 'premium-token', createdAt: Date.now() }));
            mockFavoritesRepo.saveFavorite.mockResolvedValue(right(undefined));

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toEqual(right(true));
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });
    });

    describe('Adding favorites - Free users (CORE BUSINESS LOGIC)', () => {
        it('should add favorite when free user has 0 favorites', async () => {
            const cat = createMockCat({ id: 'cat-1' });

            mockFavoritesRepo.getFavorites.mockResolvedValue(right([]));
            mockSecureStorageRepo.getToken.mockResolvedValue(right(null));
            mockFavoritesRepo.saveFavorite.mockResolvedValue(right(undefined));

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toEqual(right(true));
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should add favorite when free user has 2 favorites', async () => {
            const cat = createMockCat({ id: 'cat-3' });
            const existingFavorites = createMockCats(2);

            mockFavoritesRepo.getFavorites.mockResolvedValue(right(existingFavorites));
            mockSecureStorageRepo.getToken.mockResolvedValue(right(null));
            mockFavoritesRepo.saveFavorite.mockResolvedValue(right(undefined));

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toEqual(right(true));
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should return LimitReachedFailure when free user tries to add 4th favorite', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(3);

            mockFavoritesRepo.getFavorites.mockResolvedValue(right(existingFavorites));
            mockSecureStorageRepo.getToken.mockResolvedValue(right(null));

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toEqual(left(new LimitReachedFailure("Has alcanzado el límite de 3 favoritos gratuitos.")));
            expect(mockFavoritesRepo.saveFavorite).not.toHaveBeenCalled();
        });
    });

    describe('Token validation', () => {
        it('should treat null token as free user', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(3);

            mockFavoritesRepo.getFavorites.mockResolvedValue(right(existingFavorites));
            mockSecureStorageRepo.getToken.mockResolvedValue(right(null));

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toEqual(left(new LimitReachedFailure("Has alcanzado el límite de 3 favoritos gratuitos.")));
        });
    });
});
