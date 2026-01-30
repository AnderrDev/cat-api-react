import { ToggleFavoriteUseCase } from '../ToggleFavoriteUseCase';
import { LimitReachedError } from '@domain/entities';
import { FavoritesRepository, SecureStorageRepository } from '@domain/repositories';
import { createMockCat, createMockCats } from '../../../../__tests__/utils/mockFactories';

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

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toBe(false);
            expect(mockFavoritesRepo.removeFavorite).toHaveBeenCalledWith('cat-1');
            expect(mockFavoritesRepo.saveFavorite).not.toHaveBeenCalled();
        });
    });

    describe('Adding favorites - Premium users', () => {
        it('should add favorite when premium user has < 3 favorites', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(2);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue({ accessToken: 'premium-token', createdAt: Date.now() });

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toBe(true);
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should add 4th favorite when user is premium', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(3);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue({ accessToken: 'premium-token', createdAt: Date.now() });

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toBe(true);
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should add 10th favorite when user is premium', async () => {
            const cat = createMockCat({ id: 'cat-10' });
            const existingFavorites = createMockCats(9);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue({ accessToken: 'premium-token', createdAt: Date.now() });

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toBe(true);
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });
    });

    describe('Adding favorites - Free users (CORE BUSINESS LOGIC)', () => {
        it('should add favorite when free user has 0 favorites', async () => {
            const cat = createMockCat({ id: 'cat-1' });

            mockFavoritesRepo.getFavorites.mockResolvedValue([]);
            mockSecureStorageRepo.getToken.mockResolvedValue(null);

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toBe(true);
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should add favorite when free user has 1 favorite', async () => {
            const cat = createMockCat({ id: 'cat-2' });
            const existingFavorites = createMockCats(1);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue(null);

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toBe(true);
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should add favorite when free user has 2 favorites', async () => {
            const cat = createMockCat({ id: 'cat-3' });
            const existingFavorites = createMockCats(2);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue(null);

            const result = await toggleFavoriteUseCase.execute(cat);

            expect(result).toBe(true);
            expect(mockFavoritesRepo.saveFavorite).toHaveBeenCalledWith(cat);
        });

        it('should throw LimitReachedError when free user tries to add 4th favorite', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(3);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue(null);

            await expect(toggleFavoriteUseCase.execute(cat)).rejects.toThrow(LimitReachedError);
            expect(mockFavoritesRepo.saveFavorite).not.toHaveBeenCalled();
        });

        it('should throw LimitReachedError when free user tries to add 5th favorite', async () => {
            const cat = createMockCat({ id: 'cat-5' });
            const existingFavorites = createMockCats(4); // Simulating somehow got 4

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue(null);

            await expect(toggleFavoriteUseCase.execute(cat)).rejects.toThrow(LimitReachedError);
            expect(mockFavoritesRepo.saveFavorite).not.toHaveBeenCalled();
        });
    });

    describe('Token validation', () => {
        it('should treat undefined token as free user', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(3);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue(undefined as any);

            await expect(toggleFavoriteUseCase.execute(cat)).rejects.toThrow(LimitReachedError);
        });

        it('should treat null token as free user', async () => {
            const cat = createMockCat({ id: 'cat-4' });
            const existingFavorites = createMockCats(3);

            mockFavoritesRepo.getFavorites.mockResolvedValue(existingFavorites);
            mockSecureStorageRepo.getToken.mockResolvedValue(null);

            await expect(toggleFavoriteUseCase.execute(cat)).rejects.toThrow(LimitReachedError);
        });
    });
});
