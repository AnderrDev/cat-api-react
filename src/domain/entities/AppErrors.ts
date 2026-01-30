// Error severity levels
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// Base error class with metadata support
export abstract class AppError extends Error {
    public readonly code: string;
    public readonly severity: ErrorSeverity;
    public readonly metadata?: Record<string, any>;
    public readonly userMessage: string;
    public readonly timestamp: number;

    constructor(
        message: string,
        code: string,
        severity: ErrorSeverity,
        userMessage?: string,
        metadata?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.severity = severity;
        this.userMessage = userMessage || message;
        this.metadata = metadata;
        this.timestamp = Date.now();

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            userMessage: this.userMessage,
            severity: this.severity,
            metadata: this.metadata,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

// Network related errors
export class NetworkError extends AppError {
    constructor(
        message = "Connection error",
        metadata?: Record<string, any>
    ) {
        super(
            message,
            'ERR_NETWORK_001',
            ErrorSeverity.HIGH,
            'Unable to connect. Please check your internet connection.',
            metadata
        );
    }
}

// Payment related errors
export class PaymentError extends AppError {
    constructor(
        message = "Payment was declined",
        metadata?: Record<string, any>
    ) {
        super(
            message,
            'ERR_PAYMENT_001',
            ErrorSeverity.HIGH,
            'Payment could not be processed. Please verify your payment details.',
            metadata
        );
    }
}

// Business logic errors
export class LimitReachedError extends AppError {
    constructor() {
        super(
            "Free favorites limit reached",
            'ERR_LIMIT_001',
            ErrorSeverity.MEDIUM,
            'You have reached the maximum number of favorites. Upgrade to premium for unlimited favorites.'
        );
    }
}

// Validation errors
export class ValidationError extends AppError {
    constructor(
        message: string,
        field?: string,
        metadata?: Record<string, any>
    ) {
        super(
            message,
            'ERR_VALIDATION_001',
            ErrorSeverity.LOW,
            'Please check your input and try again.',
            { field, ...metadata }
        );
    }
}

// Authentication errors
export class AuthenticationError extends AppError {
    constructor(
        message = "Authentication failed",
        metadata?: Record<string, any>
    ) {
        super(
            message,
            'ERR_AUTH_001',
            ErrorSeverity.HIGH,
            'Session expired. Please log in again.',
            metadata
        );
    }
}

// Storage errors
export class StorageError extends AppError {
    constructor(
        message = "Storage operation failed",
        operation?: 'read' | 'write' | 'delete',
        metadata?: Record<string, any>
    ) {
        super(
            message,
            'ERR_STORAGE_001',
            ErrorSeverity.MEDIUM,
            'Unable to save data. Please try again.',
            { operation, ...metadata }
        );
    }
}

// API errors
export class ApiError extends AppError {
    constructor(
        message: string,
        statusCode?: number,
        endpoint?: string,
        metadata?: Record<string, any>
    ) {
        super(
            message,
            'ERR_API_001',
            ErrorSeverity.HIGH,
            'Service temporarily unavailable. Please try again later.',
            { statusCode, endpoint, ...metadata }
        );
    }
}