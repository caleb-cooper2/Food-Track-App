import {DarkTheme, DefaultTheme, Stack, ThemeProvider} from 'expo-router';
import {useColorScheme} from 'react-native';

import {AnimatedSplashOverlay} from '@/components/animated-icon';
import {LogsProvider} from '@/hooks/use-logs';
import {OnboardingProvider, useOnboarding} from '@/hooks/use-onboarding';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <OnboardingProvider>
                <LogsProvider>
                    <RootNavigator />
                </LogsProvider>
            </OnboardingProvider>
        </ThemeProvider>
    );
}

function RootNavigator() {
    const { isComplete } = useOnboarding();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!isComplete}>
                <Stack.Screen name="onboarding" />
            </Stack.Protected>

            <Stack.Protected guard={isComplete}>
                <Stack.Screen name="index" />
                <Stack.Screen name="new-log" options={{presentation: 'fullScreenModal', animation: 'slide_from_bottom'}} />
                <Stack.Screen name="log/[id]" options={{animation: 'slide_from_right'}} />
                <Stack.Screen name="edit-log/[id]" options={{animation: 'slide_from_right'}} />
            </Stack.Protected>
        </Stack>
    );
}