import { SecureStorageRepository } from '@domain/repositories';

export class GetPremiumStatusUseCase {
    constructor(private secureStorageRepository: SecureStorageRepository) { }

    async execute(): Promise<boolean> {
        const token = await this.secureStorageRepository.getToken();
        return !!token; // Returns true if token exists, false otherwise
    }
}
