import { CatRepository, PaymentRepository, StorageRepository } from '@domain/repositories';
import { ToggleFavoriteUseCase } from '@domain/usecases';

export interface DIContainer {

    // Repositories
    catRepository: CatRepository;
    paymentRepository: PaymentRepository;
    storageRepository: StorageRepository;

    // Use Cases
    toggleFavoriteUseCase: ToggleFavoriteUseCase;
}