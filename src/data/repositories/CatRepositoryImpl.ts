import { CatRepository } from '@domain/repositories/CatRepository';
import { Cat, NetworkError, Breed } from '@domain/entities';
import { CatDataSource } from '@data/datasources';
import { logger } from '@core/utils';

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
            // Error already logged in DataSource, just propagate
            if (error instanceof NetworkError) {
                throw error;
            }
            const err = error instanceof Error ? error : new Error('Unknown error');
            logger.error('Error in CatRepository.getCats', err, 'CatRepository', { page, limit, breedId });
            throw new NetworkError('Failed to fetch cats from repository', { page, limit, breedId });
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
            // Error already logged in DataSource, just propagate
            if (error instanceof NetworkError) {
                throw error;
            }
            const err = error instanceof Error ? error : new Error('Unknown error');
            logger.error('Error in CatRepository.getBreeds', err, 'CatRepository');
            throw new NetworkError('Failed to fetch breeds from repository');
        }
    }
}