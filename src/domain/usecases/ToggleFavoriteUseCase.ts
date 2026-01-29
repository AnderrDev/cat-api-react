import { StorageRepository } from '@domain/repositories';
import { Cat, LimitReachedError } from '@domain/entities';

// Regla de Negocio Hardcodeada (según requerimiento de Sofka)
const MAX_FREE_FAVORITES = 3;

export class ToggleFavoriteUseCase {
    constructor(private storageRepo: StorageRepository) { }

    /**
     * Intenta agregar o quitar un favorito.
     * Si intenta agregar el 4to y no tiene token, lanza error.
     */
    async execute(cat: Cat): Promise<boolean> {
        const favorites = await this.storageRepo.getFavorites();
        const isAlreadyFavorite = favorites.some(c => c.id === cat.id);

        // CASO 1: Si ya es favorito, lo quitamos (siempre permitido)
        if (isAlreadyFavorite) {
            await this.storageRepo.removeFavorite(cat.id);
            return false; // Retorna false indicando que ya no es favorito
        }

        // CASO 2: Quiere agregar uno nuevo. Verificamos reglas.
        const token = await this.storageRepo.getToken();
        const hasPremiumAccess = !!token; // Si existe token, es premium

        if (!hasPremiumAccess && favorites.length >= MAX_FREE_FAVORITES) {
            // AQUÍ ESTÁ LA LÓGICA CORE: Bloqueamos y lanzamos error específico
            throw new LimitReachedError();
        }

        // Si pasa las reglas, guardamos
        await this.storageRepo.saveFavorite(cat);
        return true; // Retorna true indicando que ahora es favorito
    }
}