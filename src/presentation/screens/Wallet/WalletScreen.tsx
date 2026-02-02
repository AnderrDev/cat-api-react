import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useWalletViewModel } from './useWalletViewModel';

export const WalletScreen = () => {
    const { cardNumber, setCardNumber, token, loading, error, handleTokenize } = useWalletViewModel();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>🔒 Secure Wallet</Text>
                <Text style={styles.subtitle}>Native Vault Demo (Kotlin/Swift)</Text>

                <View style={styles.cardContainer}>
                    <Text style={styles.label}>Card Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0000 0000 0000 0000"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        maxLength={19}
                    />
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity
                    style={[styles.button, loading && styles.disabled]}
                    onPress={handleTokenize}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>🛡️ Tokenize Card</Text>
                    )}
                </TouchableOpacity>

                {token && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>✅ Token Generated:</Text>
                        <Text style={styles.token}>{token}</Text>
                        <Text style={styles.info}>
                            Real card data has been encrypted in Native Hardware Store and removed from JS memory.
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAAAAA',
        marginBottom: 32,
    },
    cardContainer: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    label: {
        color: '#888',
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 2,
    },
    button: {
        backgroundColor: '#6C63FF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    disabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: '#FF5252',
        marginBottom: 16,
        textAlign: 'center',
    },
    resultContainer: {
        marginTop: 32,
        padding: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    resultLabel: {
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    token: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Courier',
        marginBottom: 12,
    },
    info: {
        color: '#888',
        fontSize: 12,
        fontStyle: 'italic',
    }
});
