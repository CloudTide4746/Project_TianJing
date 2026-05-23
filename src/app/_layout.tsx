import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';

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
    </ThemeProvider>
  );
}
