// Log levels
export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

// Log entry interface
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    context?: string;
    metadata?: Record<string, any>;
    error?: Error;
}

// Logger configuration
interface LoggerConfig {
    minLevel: LogLevel;
    enableConsole: boolean;
    enableTimestamps: boolean;
    prettyPrint: boolean;
}

// Determine if we're in development mode
const isDevelopment = __DEV__;

// Logger class
export class Logger {
    private config: LoggerConfig;
    private static instance: Logger;

    private constructor(config?: Partial<LoggerConfig>) {
        this.config = {
            minLevel: isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
            enableConsole: true,
            enableTimestamps: true,
            prettyPrint: isDevelopment,
            ...config
        };
    }

    // Singleton pattern
    public static getInstance(config?: Partial<LoggerConfig>): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(config);
        }
        return Logger.instance;
    }

    // Core logging method
    private log(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>, error?: Error) {
        if (!this.shouldLog(level)) {
            return;
        }

        const entry: LogEntry = {
            level,
            message,
            timestamp: Date.now(),
            context,
            metadata,
            error
        };

        if (this.config.enableConsole) {
            this.logToConsole(entry);
        }

        // In production, you could send logs to a service like Sentry, LogRocket, etc.
        // this.logToService(entry);
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        const minLevelIndex = levels.indexOf(this.config.minLevel);
        const currentLevelIndex = levels.indexOf(level);
        return currentLevelIndex >= minLevelIndex;
    }

    private logToConsole(entry: LogEntry) {
        const timestamp = this.config.enableTimestamps ? new Date(entry.timestamp).toISOString() : '';
        const context = entry.context ? `[${entry.context}]` : '';

        if (this.config.prettyPrint) {
            // Pretty print for development
            const prefix = `${timestamp} ${entry.level.toUpperCase()} ${context}`.trim();
            const logFn = this.getConsoleMethod(entry.level);

            logFn(prefix, entry.message);

            if (entry.metadata && Object.keys(entry.metadata).length > 0) {
                console.log('Metadata:', entry.metadata);
            }

            if (entry.error) {
                console.error('Error:', entry.error);
            }
        } else {
            // JSON format for production
            const logData = {
                timestamp,
                level: entry.level,
                context: entry.context,
                message: entry.message,
                metadata: entry.metadata,
                error: entry.error ? {
                    name: entry.error.name,
                    message: entry.error.message,
                    stack: entry.error.stack
                } : undefined
            };

            const logFn = this.getConsoleMethod(entry.level);
            logFn(JSON.stringify(logData));
        }
    }

    private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
        switch (level) {
            case LogLevel.DEBUG:
                return console.debug;
            case LogLevel.INFO:
                return console.info;
            case LogLevel.WARN:
                return console.warn;
            case LogLevel.ERROR:
                return console.error;
            default:
                return console.log;
        }
    }

    // Public API
    public debug(message: string, context?: string, metadata?: Record<string, any>) {
        this.log(LogLevel.DEBUG, message, context, metadata);
    }

    public info(message: string, context?: string, metadata?: Record<string, any>) {
        this.log(LogLevel.INFO, message, context, metadata);
    }

    public warn(message: string, context?: string, metadata?: Record<string, any>) {
        this.log(LogLevel.WARN, message, context, metadata);
    }

    public error(message: string, error?: Error, context?: string, metadata?: Record<string, any>) {
        this.log(LogLevel.ERROR, message, context, metadata, error);
    }

    // Performance tracking
    public startTimer(label: string): () => void {
        const start = Date.now();
        return () => {
            const duration = Date.now() - start;
            this.debug(`${label} completed`, 'Performance', { duration: `${duration}ms` });
        };
    }
}

// Export singleton instance
export const logger = Logger.getInstance();
