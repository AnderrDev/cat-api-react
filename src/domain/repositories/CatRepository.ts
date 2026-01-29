import { Cat } from "@domain/entities";

export interface CatRepository {
    /**
     * Obtiene una lista de gatos paginada.
     * @param page Número de página
     * @param limit Cantidad de elementos
     */
    getCats(page: number, limit: number): Promise<Cat[]>;
}