import React from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Controller } from 'react-hook-form';
import { useLinkCard } from '@presentation/hooks';

export const LinkCardScreen = () => {
    const {
        control, errors, isValid, isSubmitting, formatCardNumber, formatExpiration, submit, rules
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

                {/* Formulario */}
                <View style={styles.form}>
                    <Text style={styles.label}>Nombre en la tarjeta</Text>
                    <Controller
                        control={control}
                        name="name"
                        rules={rules.name}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                placeholder="JUAN PEREZ"
                                value={value}
                                onChangeText={(text) => onChange(text.toUpperCase())}
                                autoCapitalize="characters"
                            />
                        )}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                    <Text style={styles.label}>Número de tarjeta</Text>
                    <Controller
                        control={control}
                        name="cardNumber"
                        rules={rules.cardNumber}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.cardNumber && styles.inputError]}
                                placeholder="0000 0000 0000 0000"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={(text) => onChange(formatCardNumber(text))}
                                maxLength={19}
                            />
                        )}
                    />
                    {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber.message}</Text>}

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>CVV</Text>
                            <Controller
                                control={control}
                                name="cvv"
                                rules={rules.cvv}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[styles.input, errors.cvv && styles.inputError]}
                                        placeholder="123"
                                        keyboardType="numeric"
                                        maxLength={3}
                                        value={value}
                                        onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
                                        secureTextEntry
                                    />
                                )}
                            />
                            {errors.cvv && <Text style={styles.errorText}>{errors.cvv.message}</Text>}
                        </View>
                        <View style={{ width: 16 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Expiración</Text>
                            <Controller
                                control={control}
                                name="expiration"
                                rules={rules.expiration}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        style={[styles.input, errors.expiration && styles.inputError]}
                                        placeholder="MM/YY"
                                        value={value}
                                        onChangeText={(text) => onChange(formatExpiration(text))}
                                        keyboardType="numeric"
                                        maxLength={5}
                                    />
                                )}
                            />
                            {errors.expiration && <Text style={styles.errorText}>{errors.expiration.message}</Text>}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (isSubmitting || !isValid) && styles.buttonDisabled]}
                        onPress={submit}
                        disabled={isSubmitting || !isValid}
                    >
                        {isSubmitting ? (
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
    inputError: {
        borderColor: '#E74C3C',
        borderWidth: 2,
        marginBottom: 4,
    },
    errorText: {
        color: '#E74C3C',
        fontSize: 12,
        marginBottom: 12,
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