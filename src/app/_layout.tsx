import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';

import { OnboardingOverlay } from '@/components/onboarding/onboarding-overlay';
import { Colors } from '@/constants/theme';
SplashScreen.preventAutoHideAsync();

const appColors = Colors.light;

const productTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: appColors.gold,
    background: appColors.background,
    card: appColors.backgroundElement,
    text: appColors.text,
    border: appColors.border,
    notification: appColors.error,
  },
};

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    (async () => {
      setReady(true);
      await SplashScreen.hideAsync();
    })();
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  if (!ready) return null;

  return (
    <ThemeProvider value={productTheme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: appColors.background,
          },
        }}
      />
      {showOnboarding ? (
        <OnboardingOverlay onComplete={handleOnboardingComplete} />
      ) : null}
    </ThemeProvider>
  );
}
