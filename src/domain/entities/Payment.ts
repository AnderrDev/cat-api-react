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