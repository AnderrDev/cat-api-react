// Note: @testing-library/react-native v12.4+ includes built-in Jest matchers

// Mock React Native modules
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');


// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Keychain
jest.mock('react-native-keychain', () => ({
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
    resetGenericPassword: jest.fn(),
}));

// Silence console warnings during tests
globalThis.console = {
    ...console,
    warn: jest.fn(),
    error: jest.fn(),
};
