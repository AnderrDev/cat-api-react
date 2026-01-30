import { SecureStorageRepository } from '@domain/repositories';

export class RemovePremiumUseCase {
    constructor(private secureStorageRepository: SecureStorageRepository) { }

    async execute(): Promise<void> {
        return await this.secureStorageRepository.clearToken();
    }
}
