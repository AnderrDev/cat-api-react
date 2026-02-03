import { Cat, Breed } from "@domain/entities";
import { Either } from "fp-ts/Either";
import { Failure } from "../../core/errors/Failure";

export interface CatRepository {
    /**
     * Obtiene una lista de gatos paginada, opcionalmente filtrada por raza.
     * @param page Número de página
     * @param limit Cantidad de elementos
     * @param breedId ID de la raza para filtrar (opcional)
     */
    getCats(page: number, limit: number, breedId?: string): Promise<Either<Failure, Cat[]>>;

    /**
     * Obtiene la lista de todas las razas disponibles.
     */
    getBreeds(): Promise<Either<Failure, Breed[]>>;
}