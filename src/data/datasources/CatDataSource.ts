import { HttpClient } from '@core/api';
import { NetworkError } from '@domain/entities';

export interface CatDTO {
    id: string;
    url: string;
    width: number;
    height: number;
}

export interface CatDataSource {
    getCats(page: number, limit: number): Promise<CatDTO[]>;
}

export class CatDataSourceImpl implements CatDataSource {
    constructor(private http: HttpClient) { }

    async getCats(page: number, limit: number): Promise<CatDTO[]> {
        try {
            const params = {
                limit,
                page,
                order: 'RAND',
                mime_types: 'jpg,png'
            };

            const data = await this.http.get<CatDTO[]>('/images/search', params);
            return data;
        } catch (error) {
            console.error('Error in RemoteDataSource:', error);
            throw new NetworkError();
        }
    }
}
