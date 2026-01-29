import { CatRepository } from '@domain/repositories';
import { Cat } from '@domain/entities';

export class GetCatListUseCase {
    constructor(private catRepository: CatRepository) { }

    async execute(page: number, limit: number): Promise<Cat[]> {
        return await this.catRepository.getCats(page, limit);
    }
}