import { CatRepository } from '@domain/repositories/CatRepository';
import { Cat, NetworkError } from '@domain/entities';
import { HttpClient } from '@core/api';

interface CatDTO {
    id: string;
    url: string;
    width: number;
    height: number;
}

export class CatRepositoryImpl implements CatRepository {
    constructor(private http: HttpClient) { }
    async getCats(page: number, limit: number): Promise<Cat[]> {
        try {
            const params = {
                limit,
                page,
                order: 'RAND',
                mime_types: 'jpg,png'
            };

            const data = await this.http.get<CatDTO[]>('/images/search', params);

            return data.map(dto => ({
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