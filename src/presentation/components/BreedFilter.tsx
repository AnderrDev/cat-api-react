import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Breed } from '@domain/entities';

interface Props {
    breeds: Breed[];
    selectedBreedId: string | undefined;
    onSelectBreed: (breedId: string | undefined) => void;
}

export const BreedFilter = ({ breeds, selectedBreedId, onSelectBreed }: Props) => {

    // Add "All" option at the beginning
    const data = [{ id: 'all', name: 'All' }, ...breeds];

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const isSelected = item.id === (selectedBreedId || 'all');
                    return (
                        <TouchableOpacity
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={() => onSelectBreed(item.id === 'all' ? undefined : item.id)}
                        >
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listContent: {
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipSelected: {
        backgroundColor: '#E74C3C',
    },
    chipText: {
        color: '#333',
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
