import { CatRepositoryImpl, PaymentRepositoryImpl, SecureStorageRepositoryImpl, FavoritesRepositoryImpl } from '@data/repositories';
import { AxiosClient } from '@core/api/AxiosClient';
import { DIContainer } from '.';
import {
    ToggleFavoriteUseCase, TokenizePaymentMethodUseCase, GetCatListUseCase, GetFavoritesUseCase, GetPremiumStatusUseCase, GetBreedsUseCase, GetPremiumDetailsUseCase, RemovePremiumUseCase
} from '@domain/usecases';

import { CatDataSourceImpl, FavoritesDataSourceImpl, SecureStorageDataSourceImpl } from '@data/datasources';
import { AsyncStorageImpl } from '@core/local/AsyncStorageImpl';
import { SecureStorageImpl } from '@core/local/SecureStorageImpl';

import { PaymentMockService } from '@data/remote';

// 1. Infraestructura (Cliente HTTP & Local Storage)
const httpClient = new AxiosClient();
const localStorage = new AsyncStorageImpl();
const secureStorage = new SecureStorageImpl();
const paymentService = new PaymentMockService();

// 2. Data Sources
const catRemoteDataSource = new CatDataSourceImpl(httpClient);
const favoritesLocalDataSource = new FavoritesDataSourceImpl(localStorage);
const secureStorageDataSource = new SecureStorageDataSourceImpl(secureStorage);

// 3. Repositorios (Data Layer)
const catRepository = new CatRepositoryImpl(catRemoteDataSource);
const paymentRepository = new PaymentRepositoryImpl(paymentService);
const secureStorageRepository = new SecureStorageRepositoryImpl(secureStorageDataSource);
const favoritesRepository = new FavoritesRepositoryImpl(favoritesLocalDataSource);

// 3. Use Cases
const toggleFavoriteUseCase = new ToggleFavoriteUseCase(secureStorageRepository, favoritesRepository);
const tokenizePaymentMethodUseCase = new TokenizePaymentMethodUseCase(paymentRepository, secureStorageRepository);
const getPremiumDetailsUseCase = new GetPremiumDetailsUseCase(secureStorageRepository);
const removePremiumUseCase = new RemovePremiumUseCase(secureStorageRepository);
const getCatListUseCase = new GetCatListUseCase(catRepository);

const getFavoritesUseCase = new GetFavoritesUseCase(favoritesRepository);
const getPremiumStatusUseCase = new GetPremiumStatusUseCase(secureStorageRepository);
const getBreedsUseCase = new GetBreedsUseCase(catRepository);

export const appContainer: DIContainer = {
    catRepository,
    paymentRepository,
    secureStorageRepository,
    favoritesRepository,
    // Use Cases
    toggleFavoriteUseCase,
    tokenizePaymentMethodUseCase,
    getCatListUseCase,
    getFavoritesUseCase,
    getPremiumStatusUseCase,
    getBreedsUseCase,
    getPremiumDetailsUseCase,
    removePremiumUseCase,
};