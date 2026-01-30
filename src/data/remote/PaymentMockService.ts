import { CreditCard, SecurityToken } from '@domain/entities';

export const PaymentMockService = {
    processPayment: async (card: CreditCard): Promise<SecurityToken> => {
        return new Promise((resolve, reject) => {
            // 1. Simulate Network Latency (2 seconds)
            setTimeout(() => {
                // 2. Basic "Backend" validations
                const cleanNumber = card.cardNumber.replace(/\s/g, '');

                // Simulate failure if card starts with "0000"
                if (cleanNumber.startsWith('0000')) {
                    reject(new Error('Card declined by issuing bank.'));
                    return;
                }

                // Simulate success
                const fakeToken: SecurityToken = {
                    accessToken: `tok_live_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
                    createdAt: Date.now(),
                };

                resolve(fakeToken);
            }, 2000);
        });
    }
};