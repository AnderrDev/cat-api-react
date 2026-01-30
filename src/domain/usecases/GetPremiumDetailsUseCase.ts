import { SecureStorageRepository } from '@domain/repositories';
import { StoredPaymentDetails } from '@domain/entities';

export class GetPremiumDetailsUseCase {
    constructor(private secureStorageRepository: SecureStorageRepository) { }

    async execute(): Promise<StoredPaymentDetails | null> {
        return await this.secureStorageRepository.getPaymentDetails();
    }
}
