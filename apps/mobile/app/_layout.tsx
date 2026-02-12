import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '../src/theme';

/**
 * Root layout — wraps the entire app with required providers.
 */
export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.root}>
            <SafeAreaProvider>
                <StatusBar style="light" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: Colors.bg.primary },
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="lobby" />
                    <Stack.Screen name="swipe" />
                    <Stack.Screen
                        name="match-modal"
                        options={{
                            presentation: 'transparentModal',
                            animation: 'fade',
                        }}
                    />
                    <Stack.Screen name="matches" />
                    <Stack.Screen name="settings" />
                </Stack>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.bg.primary,
    },
});
