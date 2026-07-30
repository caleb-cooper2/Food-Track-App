import {DarkTheme, DefaultTheme, Stack, ThemeProvider} from 'expo-router';
import {useColorScheme} from 'react-native';

import {AnimatedSplashOverlay} from '@/components/animated-icon';
import {OnboardingProvider, useOnboarding} from '@/hooks/use-onboarding';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <OnboardingProvider>
                <RootNavigator />
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
            </Stack.Protected>
        </Stack>
    );
}