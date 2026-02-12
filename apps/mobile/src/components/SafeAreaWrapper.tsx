import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme';

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
    edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * SafeAreaWrapper — ensures content respects device safe areas.
 * All root screen views should use this wrapper.
 */
export function SafeAreaWrapper({ children, style, edges }: Props) {
    return (
        <SafeAreaView
            style={[styles.container, style]}
            edges={edges ?? ['top', 'bottom']}
        >
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg.primary,
    },
});
