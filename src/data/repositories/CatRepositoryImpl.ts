import { CatRepository } from '@domain/repositories/CatRepository';
import { Cat, NetworkError } from '@domain/entities';
import { CatDataSource } from '@data/datasources';

export class CatRepositoryImpl implements CatRepository {
    constructor(private remoteDataSource: CatDataSource) { }

    async getCats(page: number, limit: number): Promise<Cat[]> {
        try {
            const dtos = await this.remoteDataSource.getCats(page, limit);
            return dtos.map(dto => ({
                id: dto.id,
                url: dto.url,
                width: dto.width,
                height: dto.height,
            }));
        } catch (error) {
            console.error('Error fetching cats:', error);
            throw new NetworkError();
        }
    }
}