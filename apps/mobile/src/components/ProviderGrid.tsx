import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { STREAMING_PROVIDERS, TMDB_IMAGE_BASE } from '@streamsync/shared';
import { Colors, BorderRadius, Spacing, Typography } from '../theme';

interface Props {
    selectedIds: number[];
    onToggle: (providerId: number) => void;
}

/**
 * ProviderGrid — clean grid of streaming service logos with selection toggles.
 */
export function ProviderGrid({ selectedIds, onToggle }: Props) {
    return (
        <FlatList
            data={STREAMING_PROVIDERS}
            numColumns={4}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => {
                const isSelected = selectedIds.includes(item.id);
                const logoUrl = `${TMDB_IMAGE_BASE}/w92${item.logo}`;

                return (
                    <TouchableOpacity
                        style={[styles.item, isSelected && styles.itemSelected]}
                        onPress={() => onToggle(item.id)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: logoUrl }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.label} numberOfLines={1}>
                            {item.name}
                        </Text>
                        {isSelected && (
                            <View style={styles.checkmark}>
                                <Text style={styles.checkText}>✓</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    grid: {
        paddingHorizontal: Spacing.sm,
    },
    row: {
        gap: Spacing.sm,
        marginBottom: Spacing.sm,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xs,
        backgroundColor: Colors.bg.tertiary,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    itemSelected: {
        borderColor: Colors.accent.primary,
        backgroundColor: Colors.bg.secondary,
    },
    logo: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.sm,
    },
    label: {
        ...Typography.caption,
        color: Colors.text.secondary,
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
    checkmark: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.accent.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});
