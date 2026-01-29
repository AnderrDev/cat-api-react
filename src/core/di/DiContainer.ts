import { CatRepository, PaymentRepository, SecureStorageRepository, FavoritesRepository } from '@domain/repositories';
import { ToggleFavoriteUseCase, TokenizePaymentMethodUseCase, GetCatListUseCase, GetFavoritesUseCase, GetPremiumStatusUseCase } from '@domain/usecases';

export interface DIContainer {

    // Repositories
    catRepository: CatRepository;
    paymentRepository: PaymentRepository;
    secureStorageRepository: SecureStorageRepository;
    favoritesRepository: FavoritesRepository;

    // Use Cases
    toggleFavoriteUseCase: ToggleFavoriteUseCase;
    tokenizePaymentMethodUseCase: TokenizePaymentMethodUseCase;
    getCatListUseCase: GetCatListUseCase;
    getFavoritesUseCase: GetFavoritesUseCase;
    getPremiumStatusUseCase: GetPremiumStatusUseCase;
}