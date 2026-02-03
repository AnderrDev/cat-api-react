import { SecureStorageRepository } from '@domain/repositories';
import { Either } from 'fp-ts/Either';
import { Failure } from '@core/errors/Failure';

export class RemovePremiumUseCase {
    constructor(private secureStorageRepository: SecureStorageRepository) { }

    async execute(): Promise<Either<Failure, void>> {
        return await this.secureStorageRepository.clearToken();
    }
}
