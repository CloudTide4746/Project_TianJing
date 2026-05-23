import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'has_seen_onboarding';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(KEY, 'true');
}
