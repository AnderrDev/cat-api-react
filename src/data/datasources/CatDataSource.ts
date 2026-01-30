import { HttpClient } from '@core/api';
import { NetworkError, Breed } from '@domain/entities';

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

            const data = await this.http.get<CatDTO[]>('/images/search', params);
            return data;
        } catch (error) {
            console.error('Error in RemoteDataSource (getCats):', error);
            throw new NetworkError();
        }
    }

    async getBreeds(): Promise<BreedDTO[]> {
        try {
            const data = await this.http.get<BreedDTO[]>('/breeds');
            return data;
        } catch (error) {
            console.error('Error in RemoteDataSource (getBreeds):', error);
            throw new NetworkError();
        }
    }
}
