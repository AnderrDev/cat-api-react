import { CatRepositoryImpl, PaymentRepositoryImpl, StorageRepositoryImpl } from '@data/repositories';
import { AxiosClient } from '@core/api/AxiosClient';
import { DIContainer } from '.';
import { ToggleFavoriteUseCase } from '@domain/usecases';

// 1. Infraestructura (Cliente HTTP)
const httpClient = new AxiosClient();

// 2. Repositorios (Data Layer)
// Notarás que aquí 'inyectamos' el cliente HTTP. Esto es DI pura.
const catRepository = new CatRepositoryImpl(httpClient);
const paymentRepository = new PaymentRepositoryImpl();
const storageRepository = new StorageRepositoryImpl();

// 3. Use Cases
const toggleFavoriteUseCase = new ToggleFavoriteUseCase(storageRepository);

// 4. Exportamos el contenedor lleno
export const appContainer: DIContainer = {
    catRepository,
    paymentRepository,
    storageRepository,
    // Use Cases
    toggleFavoriteUseCase,
};