import { Cat, Breed } from "@domain/entities";

export interface CatRepository {
    /**
     * Obtiene una lista de gatos paginada, opcionalmente filtrada por raza.
     * @param page Número de página
     * @param limit Cantidad de elementos
     * @param breedId ID de la raza para filtrar (opcional)
     */
    getCats(page: number, limit: number, breedId?: string): Promise<Cat[]>;

    /**
     * Obtiene la lista de todas las razas disponibles.
     */
    getBreeds(): Promise<Breed[]>;
}