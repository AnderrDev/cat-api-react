export interface SecureStorage {
    setSecureValue(key: string, value: string): Promise<void>;
    getSecureValue(key: string): Promise<string | null>;
    clearSecureValue(key: string): Promise<void>;
}
