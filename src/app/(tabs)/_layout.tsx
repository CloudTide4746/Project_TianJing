import { Tabs } from 'expo-router';
import { useColorScheme, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const scheme = useColorScheme();
  // Ensure we fallback to dark theme colors if unspecified, per project style
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme] ?? Colors.dark;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.backgroundBright,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/images/tabIcons/home.png')} 
              style={{ width: 24, height: 24, tintColor: color }} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '创作',
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '我的收藏',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/images/tabIcons/explore.png')} 
              style={{ width: 24, height: 24, tintColor: color }} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
