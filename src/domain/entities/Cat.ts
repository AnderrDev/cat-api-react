import { Breed } from './Breed';

export interface Cat {
    id: string;
    url: string;
    width?: number;
    height?: number;
    breeds?: Breed[];
}