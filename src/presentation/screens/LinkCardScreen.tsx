import React from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useLinkCard } from '@presentation/hooks';

export const LinkCardScreen = () => {
    const {
        cardNumber, cvv, name, isLoading,
        handleCardNumberChange, setCvv, setName, submit
    } = useLinkCard();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Vincular Método de Pago</Text>
                <Text style={styles.subtitle}>
                    Desbloquea favoritos ilimitados vinculando tu tarjeta de crédito de prueba.
                </Text>

                {/* Visualización de Tarjeta (Opcional, pero se ve pro) */}
                <View style={styles.cardPreview}>
                    <Text style={styles.cardLabel}>CARD NUMBER</Text>
                    <Text style={styles.cardValue}>
                        {cardNumber || '•••• •••• •••• ••••'}
                    </Text>
                </View>

                {/* Formulario */}
                <View style={styles.form}>
                    <Text style={styles.label}>Nombre en la tarjeta</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="JUAN PEREZ"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="characters"
                    />

                    <Text style={styles.label}>Número de tarjeta</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0000 0000 0000 0000"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={handleCardNumberChange}
                        maxLength={19} // 16 dígitos + 3 espacios
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="123"
                                keyboardType="numeric"
                                maxLength={4}
                                value={cvv}
                                onChangeText={setCvv}
                                secureTextEntry
                            />
                        </View>
                        <View style={{ width: 16 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Expiración</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: '#e0e0e0' }]}
                                placeholder="MM/YY"
                                value="12/30"
                                editable={false} // Hardcodeado para la prueba
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={submit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>VINCULAR TARJETA</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    cardPreview: {
        backgroundColor: '#2C3E50',
        borderRadius: 12,
        padding: 20,
        height: 180,
        justifyContent: 'center',
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    cardLabel: {
        color: '#BDC3C7',
        fontSize: 12,
        marginBottom: 5,
    },
    cardValue: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F4F6F7',
        padding: 15,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E8E8',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#27AE60', // Color "Success" / "Money"
        padding: 18,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#95A5A6',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});