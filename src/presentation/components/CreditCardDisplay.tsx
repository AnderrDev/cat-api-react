import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CreditCardDisplayProps {
    cardNumber?: string;
    cardHolder?: string;
    expiration?: string;
    variant?: 'preview' | 'filled';
}

export const CreditCardDisplay = ({
    cardNumber = '',
    cardHolder = '',
    expiration = '',
    variant = 'preview'
}: CreditCardDisplayProps) => {
    const displayNumber = cardNumber || '•••• •••• •••• ••••';
    const displayHolder = cardHolder || (variant === 'preview' ? 'NOMBRE APELLIDO' : '');
    const displayExpiration = expiration || (variant === 'preview' ? 'MM/YY' : '');

    return (
        <View style={styles.cardPreview}>
            <Text style={styles.cardLabel}>NÚMERO DE TARJETA</Text>
            <Text style={styles.cardValue}>{displayNumber}</Text>
            <View style={styles.cardBottom}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cardLabel}>TITULAR</Text>
                    <Text style={styles.cardHolder}>{displayHolder}</Text>
                </View>
                <View>
                    <Text style={styles.cardLabel}>VENCE</Text>
                    <Text style={styles.cardExpires}>{displayExpiration}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardPreview: {
        backgroundColor: '#2C3E50',
        borderRadius: 16,
        padding: 24,
        minHeight: 200,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    cardLabel: {
        color: '#BDC3C7',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 8,
    },
    cardValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 24,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardHolder: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    cardExpires: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
