export interface WalletRepository {
    tokenizeCard(cardNumber: string): Promise<string>;
}
