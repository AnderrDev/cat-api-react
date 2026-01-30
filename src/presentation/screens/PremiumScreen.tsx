import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowBackIcon } from '@presentation/components/icons';
import { usePremiumDetails } from '@presentation/hooks';
import { CreditCardDisplay } from '@presentation/components';

const { width } = Dimensions.get('window');

export const PremiumScreen = () => {
    const { details, isLoading, removePremium } = usePremiumDetails();
    const navigation = useNavigation();

    const handleRemove = async () => {
        await removePremium();
        navigation.goBack();
    };

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#27AE60" />
            </View>
        );
    }

    if (!details) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No hay datos de pago disponibles</Text>
            </View>
        );
    }

    const { cardInfo } = details;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowBackIcon size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Billetera Segura</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Tarjeta Virtual */}
            <View style={styles.cardContainer}>
                <CreditCardDisplay
                    cardNumber={`•••• •••• •••• ${cardInfo.last4}`}
                    cardHolder={cardInfo.cardHolder}
                    expiration={cardInfo.expiration}
                    variant="filled"
                />
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Detalles del Método de Pago</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipo:</Text>
                    <Text style={styles.infoValue}>{cardInfo.brand}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Últimos 4 dígitos:</Text>
                    <Text style={styles.infoValue}>{cardInfo.last4}</Text>
                </View>
                <Text style={styles.securityNote}>
                    Tu tarjeta está tokenizada. TheCatAPI no tiene acceso a tus datos reales.
                </Text>
            </View>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleRemove}
            >
                <Text style={styles.cancelText}>Cancelar Suscripción</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60, // Adjust for Safe Area
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardContainer: {
        margin: 20,
    },
    card: {
        width: width * 0.9,
        height: 200,
        backgroundColor: '#2C3E50',
        borderRadius: 16,
        padding: 20,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    chipContainer: {
        marginVertical: 10,
    },
    chip: {
        width: 40,
        height: 30,
        backgroundColor: '#F1C40F',
        borderRadius: 6,
    },
    cardNumber: {
        color: '#FFF',
        fontSize: 22,
        letterSpacing: 2,
        fontWeight: '600',
        fontFamily: 'Courier', // Monospace font simulation
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    infoSection: {
        paddingHorizontal: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    securityNote: {
        marginTop: 10,
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    cancelButton: {
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E74C3C',
        alignItems: 'center',
        marginTop: 20,
    },
    cancelText: {
        color: '#E74C3C',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
