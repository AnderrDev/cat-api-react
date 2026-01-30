import { CatRepository } from '@domain/repositories/CatRepository';
import { Cat, NetworkError, Breed } from '@domain/entities';
import { CatDataSource } from '@data/datasources';

export class CatRepositoryImpl implements CatRepository {
    constructor(private remoteDataSource: CatDataSource) { }

    async getCats(page: number, limit: number, breedId?: string): Promise<Cat[]> {
        try {
            const dtos = await this.remoteDataSource.getCats(page, limit, breedId);
            return dtos.map(dto => ({
                id: dto.id,
                url: dto.url,
                width: dto.width,
                height: dto.height,
                breeds: dto.breeds
            }));
        } catch (error) {
            console.error('Error fetching cats:', error);
            throw new NetworkError();
        }
    }

    async getBreeds(): Promise<Breed[]> {
        try {
            const dtos = await this.remoteDataSource.getBreeds();
            return dtos.map(dto => ({
                id: dto.id,
                name: dto.name,
                temperament: dto.temperament,
                origin: dto.origin,
                description: dto.description,
                life_span: dto.life_span
            }));
        } catch (error) {
            console.error('Error fetching breeds:', error);
            throw new NetworkError();
        }
    }
}