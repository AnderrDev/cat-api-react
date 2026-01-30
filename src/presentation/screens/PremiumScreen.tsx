import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePremiumDetails } from '@presentation/hooks';
import Icon from 'react-native-vector-icons/Ionicons';

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
                <Text>Cargando información segura...</Text>
            </View>
        );
    }

    if (!details) {
        return (
            <View style={styles.center}>
                <Text>No se encontró información de la tarjeta.</Text>
            </View>
        );
    }

    const { cardInfo, token } = details;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Billetera Segura</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.cardContainer}>
                {/* Simulated Credit Card View */}
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <Text style={styles.cardBrand}>{cardInfo.brand}</Text>
                        <Icon name="wifi" size={24} color="rgba(255,255,255,0.7)" />
                    </View>

                    <View style={styles.chipContainer}>
                        <View style={styles.chip} />
                    </View>

                    <Text style={styles.cardNumber}>
                        •••• •••• •••• {cardInfo.last4}
                    </Text>

                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>TITULAR</Text>
                            <Text style={styles.cardHolder}>{cardInfo.cardHolder.toUpperCase()}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>VENCE</Text>
                            <Text style={styles.cardExpires}>12/30</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.securityInfo}>
                <Text style={styles.securityTitle}>Token de Seguridad (Activo)</Text>
                <View style={styles.tokenContainer}>
                    <Icon name="lock-closed" size={20} color="#27AE60" />
                    <Text style={styles.tokenText} numberOfLines={1} ellipsizeMode="middle">
                        {token.accessToken}
                    </Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60, // Adjust for Safe Area
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardContainer: {
        alignItems: 'center',
        marginVertical: 30,
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
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        color: '#95A5A6',
        fontSize: 10,
        marginBottom: 2,
    },
    cardHolder: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardExpires: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    securityInfo: {
        padding: 20,
    },
    securityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    tokenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    tokenText: {
        marginLeft: 10,
        color: '#666',
        fontSize: 14,
        flex: 1,
        fontFamily: 'Courier',
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
