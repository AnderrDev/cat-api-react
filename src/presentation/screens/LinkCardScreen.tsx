import React from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView
} from 'react-native';
import { Controller, useWatch } from 'react-hook-form';
import { useLinkCard } from '@presentation/hooks';
import { CreditCardDisplay } from '@presentation/components';

export const LinkCardScreen = () => {
    const {
        control, errors, isValid, isSubmitting, formatCardNumber, formatExpiration, submit, rules
    } = useLinkCard();

    // Observar valores en tiempo real para la vista previa
    const cardNumber = useWatch({ control, name: 'cardNumber', defaultValue: '' });
    const name = useWatch({ control, name: 'name', defaultValue: '' });
    const expiration = useWatch({ control, name: 'expiration', defaultValue: '' });

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Vincular Método de Pago</Text>
                        <Text style={styles.subtitle}>
                            Desbloquea favoritos ilimitados vinculando tu tarjeta de crédito de prueba.
                        </Text>
                    </View>

                    {/* Vista Previa de Tarjeta */}
                    <CreditCardDisplay
                        cardNumber={cardNumber}
                        cardHolder={name}
                        expiration={expiration}
                        variant="preview"
                    />

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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        marginBottom: 32,
        paddingTop: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 4,
    },
    input: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#E5E8E8',
        fontSize: 16,
    },
    inputError: {
        borderColor: '#E74C3C',
        borderWidth: 2,
        marginBottom: 4,
        backgroundColor: '#FFF5F5',
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
        backgroundColor: '#27AE60',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: "#27AE60",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#95A5A6',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});