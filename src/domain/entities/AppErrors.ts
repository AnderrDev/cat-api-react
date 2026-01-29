export class NetworkError extends Error {
    constructor(message = "Error de conexión") {
        super(message);
        this.name = "NetworkError";
    }
}

export class PaymentError extends Error {
    constructor(message = "El pago fue rechazado") {
        super(message);
        this.name = "PaymentError";
    }
}

export class LimitReachedError extends Error {
    constructor() {
        super("Límite de favoritos gratuitos alcanzado. Vincula tu tarjeta.");
        this.name = "LimitReachedError";
    }
}