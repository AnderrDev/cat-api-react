import {
    AppError,
    ErrorSeverity,
    LimitReachedError,
    NetworkError,
    PaymentError,
    ValidationError,
    AuthenticationError,
    StorageError,
    ApiError
} from '../AppErrors';

describe('AppError Base Class', () => {
    // Create a concrete implementation for testing
    class TestError extends AppError {
        constructor(message: string, metadata?: Record<string, any>) {
            super(message, 'TEST_001', ErrorSeverity.MEDIUM, undefined, metadata);
        }
    }

    it('should create error with all properties', () => {
        const metadata = { key: 'value' };
        const error = new TestError('Test message', metadata);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Test message');
        expect(error.code).toBe('TEST_001');
        expect(error.severity).toBe(ErrorSeverity.MEDIUM);
        expect(error.metadata).toEqual(metadata);
        expect(error.name).toBe('TestError');
        expect(error.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('should use message as userMessage when not provided', () => {
        const error = new TestError('Technical message');
        expect(error.userMessage).toBe('Technical message');
    });

    it('should serialize to JSON correctly', () => {
        const metadata = { foo: 'bar' };
        const error = new TestError('Test', metadata);
        const json = error.toJSON();

        expect(json.name).toBe('TestError');
        expect(json.code).toBe('TEST_001');
        expect(json.message).toBe('Test');
        expect(json.severity).toBe(ErrorSeverity.MEDIUM);
        expect(json.metadata).toEqual(metadata);
        expect(json.timestamp).toBeDefined();
    });
});

describe('NetworkError', () => {
    it('should create with default message', () => {
        const error = new NetworkError();
        expect(error.message).toBe('Connection error');
        expect(error.code).toBe('ERR_NETWORK_001');
        expect(error.severity).toBe(ErrorSeverity.HIGH);
        expect(error.userMessage).toBe('Unable to connect. Please check your internet connection.');
    });

    it('should create with custom message and metadata', () => {
        const metadata = { endpoint: '/api/cats', statusCode: 500 };
        const error = new NetworkError('API request failed', metadata);

        expect(error.message).toBe('API request failed');
        expect(error.metadata).toEqual(metadata);
    });
});

describe('PaymentError', () => {
    it('should create with default message', () => {
        const error = new PaymentError();
        expect(error.message).toBe('Payment was declined');
        expect(error.code).toBe('ERR_PAYMENT_001');
        expect(error.severity).toBe(ErrorSeverity.HIGH);
        expect(error.userMessage).toBe('Payment could not be processed. Please verify your payment details.');
    });

    it('should create with custom message and metadata', () => {
        const metadata = { cardHolder: 'John Doe' };
        const error = new PaymentError('Card validation failed', metadata);

        expect(error.message).toBe('Card validation failed');
        expect(error.metadata).toEqual(metadata);
    });
});

describe('LimitReachedError', () => {
    it('should have correct properties', () => {
        const error = new LimitReachedError();

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Free favorites limit reached');
        expect(error.code).toBe('ERR_LIMIT_001');
        expect(error.severity).toBe(ErrorSeverity.MEDIUM);
        expect(error.name).toBe('LimitReachedError');
        expect(error.userMessage).toBe('You have reached the maximum number of favorites. Upgrade to premium for unlimited favorites.');
    });
});

describe('ValidationError', () => {
    it('should create with message and field', () => {
        const error = new ValidationError('Invalid email format', 'email');

        expect(error.message).toBe('Invalid email format');
        expect(error.code).toBe('ERR_VALIDATION_001');
        expect(error.severity).toBe(ErrorSeverity.LOW);
        expect(error.metadata).toEqual({ field: 'email' });
        expect(error.userMessage).toBe('Please check your input and try again.');
    });

    it('should create with additional metadata', () => {
        const error = new ValidationError('Invalid value', 'age', { min: 18, max: 100 });

        expect(error.metadata).toEqual({ field: 'age', min: 18, max: 100 });
    });
});

describe('AuthenticationError', () => {
    it('should create with default message', () => {
        const error = new AuthenticationError();

        expect(error.message).toBe('Authentication failed');
        expect(error.code).toBe('ERR_AUTH_001');
        expect(error.severity).toBe(ErrorSeverity.HIGH);
        expect(error.userMessage).toBe('Session expired. Please log in again.');
    });

    it('should create with custom message and metadata', () => {
        const metadata = { userId: '123' };
        const error = new AuthenticationError('Token expired', metadata);

        expect(error.message).toBe('Token expired');
        expect(error.metadata).toEqual(metadata);
    });
});

describe('StorageError', () => {
    it('should create with default message', () => {
        const error = new StorageError();

        expect(error.message).toBe('Storage operation failed');
        expect(error.code).toBe('ERR_STORAGE_001');
        expect(error.severity).toBe(ErrorSeverity.MEDIUM);
        expect(error.userMessage).toBe('Unable to save data. Please try again.');
    });

    it('should create with operation type', () => {
        const error = new StorageError('Write failed', 'write', { key: 'favorites' });

        expect(error.message).toBe('Write failed');
        expect(error.metadata).toEqual({ operation: 'write', key: 'favorites' });
    });
});

describe('ApiError', () => {
    it('should create with message, statusCode and endpoint', () => {
        const error = new ApiError('Server error', 500, '/api/cats');

        expect(error.message).toBe('Server error');
        expect(error.code).toBe('ERR_API_001');
        expect(error.severity).toBe(ErrorSeverity.HIGH);
        expect(error.metadata).toEqual({ statusCode: 500, endpoint: '/api/cats' });
        expect(error.userMessage).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('should create with additional metadata', () => {
        const error = new ApiError('Not found', 404, '/api/users', { userId: '123' });

        expect(error.metadata).toEqual({ statusCode: 404, endpoint: '/api/users', userId: '123' });
    });
});
