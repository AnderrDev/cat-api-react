export interface CreditCard {
    cardNumber: string;
    cvv: string;
    expirationDate: string; // MM/YY
    cardHolder: string;
}

export interface SecurityToken {
    accessToken: string;
    createdAt: number;
}

export interface CardInfo {
    last4: string;
    cardHolder: string;
    brand: string; // Visa, Mastercard, etc. (Simulated)
}

export interface StoredPaymentDetails {
    token: SecurityToken;
    cardInfo: CardInfo;
}