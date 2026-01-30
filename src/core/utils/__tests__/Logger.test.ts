import { Logger, LogLevel } from '../Logger';

// Mock console methods
const mockConsole = {
    debug: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

describe('Logger', () => {
    let originalConsole: any;
    let logger: Logger;

    beforeEach(() => {
        // Save original console
        originalConsole = {
            debug: console.debug,
            info: console.info,
            log: console.log,
            warn: console.warn,
            error: console.error
        };

        // Mock console methods
        console.debug = mockConsole.debug;
        console.info = mockConsole.info;
        console.log = mockConsole.log;
        console.warn = mockConsole.warn;
        console.error = mockConsole.error;

        // Clear mocks
        jest.clearAllMocks();

        // Get logger instance
        logger = Logger.getInstance({ minLevel: LogLevel.DEBUG });
    });

    afterEach(() => {
        // Restore original console
        console.debug = originalConsole.debug;
        console.info = originalConsole.info;
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
    });

    describe('Log Levels', () => {
        it('should log debug messages', () => {
            logger.debug('Debug message', 'TestContext');
            expect(mockConsole.debug).toHaveBeenCalled();
        });

        it('should log info messages', () => {
            logger.info('Info message', 'TestContext');
            expect(mockConsole.info).toHaveBeenCalled();
        });

        it('should log warn messages', () => {
            logger.warn('Warning message', 'TestContext');
            expect(mockConsole.warn).toHaveBeenCalled();
        });

        it('should log error messages', () => {
            const error = new Error('Test error');
            logger.error('Error message', error, 'TestContext');
            expect(mockConsole.error).toHaveBeenCalled();
        });
    });

    describe('Contextual Logging', () => {
        it('should include context in logs', () => {
            logger.info('Test message', 'MyComponent');

            const callArgs = mockConsole.info.mock.calls[0];
            expect(callArgs[0]).toContain('[MyComponent]');
        });

        it('should include metadata in logs', () => {
            const metadata = { userId: '123', action: 'login' };
            logger.info('User action', 'AuthService', metadata);

            // Check that console.log was called with metadata
            expect(mockConsole.log).toHaveBeenCalledWith('Metadata:', metadata);
        });

        it('should log errors with stack traces', () => {
            const error = new Error('Test error');
            logger.error('Error occurred', error, 'TestContext');

            // Verify error was logged
            expect(mockConsole.error).toHaveBeenCalledWith('Error:', error);
        });
    });

    describe('Performance Tracking', () => {
        it('should track operation duration', () => {
            const stopTimer = logger.startTimer('Test Operation');

            // Stop the timer immediately
            stopTimer();

            // Check that a debug log was created
            expect(mockConsole.debug).toHaveBeenCalled();

            // Check that metadata with duration was logged
            const logCalls = mockConsole.log.mock.calls;
            const metadataCall = logCalls.find(call => {
                return call[0] === 'Metadata:' && call[1]?.duration;
            });
            expect(metadataCall).toBeDefined();
        });

        it('should measure elapsed time', () => {
            const stopTimer = logger.startTimer('Async Operation');

            // Get initial call count
            const initialCallCount = mockConsole.debug.mock.calls.length;

            stopTimer();

            // Verify a new debug call was made
            expect(mockConsole.debug.mock.calls.length).toBeGreaterThan(initialCallCount);
        });
    });

    describe('Singleton Pattern', () => {
        it('should return the same instance', () => {
            const instance1 = Logger.getInstance();
            const instance2 = Logger.getInstance();

            expect(instance1).toBe(instance2);
        });
    });

    describe('Message Format', () => {
        it('should include timestamp in logs when enabled', () => {
            logger.info('Test message');

            const callArgs = mockConsole.info.mock.calls[0][0];
            // Should contain timestamp in ISO format
            expect(callArgs).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });

        it('should include log level in output', () => {
            logger.warn('Warning');

            const callArgs = mockConsole.warn.mock.calls[0][0];
            expect(callArgs).toContain('WARN');
        });
    });
});
