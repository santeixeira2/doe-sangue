import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassTabBarBackground } from '../../src/components/GlassTabBarBackground';
import {
  DARK_TAB_INACTIVE,
  LIGHT_TAB_INACTIVE,
  TAB_ICON_SIZE,
  floatingTabBarStyle,
  tabBarItemStyle,
  tabBarLabelStyle,
  useGlassTabBarScheme,
} from '../../src/navigation/glassTabBar';

const tabIcon = {
  index: { focused: 'home' as const, outline: 'home-outline' as const },
  requests: { focused: 'water' as const, outline: 'water-outline' as const },
  profile: { focused: 'person' as const, outline: 'person-outline' as const },
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDark, tokens } = useGlassTabBarScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle,
        tabBarItemStyle,
        tabBarActiveTintColor: tokens.activeTint,
        tabBarInactiveTintColor: isDark ? DARK_TAB_INACTIVE : LIGHT_TAB_INACTIVE,
        tabBarStyle: floatingTabBarStyle(insets, isDark),
        tabBarBackground: () => <GlassTabBarBackground />,
        tabBarIcon: ({ color, focused }) => {
          const name = route.name as keyof typeof tabIcon;
          const icons = tabIcon[name];
          if (!icons) {
            return <Ionicons name="ellipse-outline" size={TAB_ICON_SIZE} color={color} />;
          }
          return (
            <Ionicons
              name={focused ? icons.focused : icons.outline}
              size={TAB_ICON_SIZE}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'início',
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'pedidos',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'perfil',
        }}
      />
    </Tabs>
  );
}
