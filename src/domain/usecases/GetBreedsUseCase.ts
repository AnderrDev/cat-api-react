import { CatRepository } from '@domain/repositories';
import { Breed } from '@domain/entities';

export class GetBreedsUseCase {
    constructor(private catRepository: CatRepository) { }

    async execute(): Promise<Breed[]> {
        return await this.catRepository.getBreeds();
    }
}
