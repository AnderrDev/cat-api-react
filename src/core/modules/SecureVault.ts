import { NativeModules } from 'react-native';

const { SecureVault } = NativeModules;

export interface SecureVaultInterface {
    tokenizeCard(cardNumber: string): Promise<string>;
    setSecureValue(key: string, value: string): Promise<boolean>;
    getSecureValue(key: string): Promise<string | null>;
    clearSecureValue(key: string): Promise<boolean>;
}

export default SecureVault as SecureVaultInterface;
