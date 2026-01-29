import { CreditCard, SecurityToken } from '@domain/entities';

export const PaymentMockService = {
    processPayment: async (card: CreditCard): Promise<SecurityToken> => {
        return new Promise((resolve, reject) => {
            // 1. Simular Latencia de Red (2 segundos)
            setTimeout(() => {
                // 2. Validaciones básicas de "Backend"
                const cleanNumber = card.cardNumber.replace(/\s/g, '');

                // Simular fallo si la tarjeta empieza con "0000"
                if (cleanNumber.startsWith('0000')) {
                    reject(new Error('Tarjeta rechazada por el banco emisor.'));
                    return;
                }

                // Simular éxito
                const fakeToken: SecurityToken = {
                    accessToken: `tok_live_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
                    createdAt: Date.now(),
                };

                resolve(fakeToken);
            }, 2000);
        });
    }
};