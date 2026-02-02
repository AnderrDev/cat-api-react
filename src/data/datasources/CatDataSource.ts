import { HttpClient, Endpoints } from '@core/api';
import { NetworkError, Breed } from '@domain/entities';
import { logger } from '@core/utils';

export interface CatDTO {
    id: string;
    url: string;
    width: number;
    height: number;
    breeds?: Breed[];
}

export interface BreedDTO {
    id: string;
    name: string;
    temperament: string;
    origin: string;
    description: string;
    life_span: string;
}

export interface CatDataSource {
    getCats(page: number, limit: number, breedId?: string): Promise<CatDTO[]>;
    getBreeds(): Promise<BreedDTO[]>;
}

export class CatDataSourceImpl implements CatDataSource {
    constructor(private http: HttpClient) { }

    async getCats(page: number, limit: number, breedId?: string): Promise<CatDTO[]> {
        try {
            const params: any = {
                limit,
                page,
                order: 'RAND',
                mime_types: 'jpg,png'
            };

            if (breedId && breedId !== 'all') {
                params.breed_ids = breedId;
            }

            const data = await this.http.get<CatDTO[]>(Endpoints.search, params);
            return data;
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            logger.error('Error fetching cats from API', err, 'CatDataSource', { page, limit, breedId });
            throw new NetworkError('Failed to fetch cats', { endpoint: Endpoints.search, params: { page, limit, breedId } });
        }
    }

    async getBreeds(): Promise<BreedDTO[]> {
        try {
            const data = await this.http.get<BreedDTO[]>(Endpoints.breeds);
            return data;
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            logger.error('Error fetching breeds from API', err, 'CatDataSource');
            throw new NetworkError('Failed to fetch breeds', { endpoint: Endpoints.breeds });
        }
    }
}
