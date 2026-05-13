import { Platform, StyleSheet, useColorScheme } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

/** Floating pill tab bar — same layout DNA as sorria-ai RootNavigator.style */
export const TAB_BAR_RADIUS = 28;
export const TAB_BAR_HEIGHT = 68;
export const TAB_BAR_HORIZONTAL_INSET = 16;
export const TAB_ICON_SIZE = 22;

export const LIGHT_TAB_INACTIVE = 'rgba(12,12,12,0.42)';
export const DARK_TAB_INACTIVE = 'rgba(255,255,255,0.42)';

export const glassTabTokens = {
  light: {
    glassFill: 'rgba(255,255,255,0.92)',
    glassBorder: 'rgba(12,12,12,0.06)',
    glassHighlightFrom: 'rgba(255,255,255,0.55)',
    glassHighlightTo: 'transparent',
    activeTint: '#E53935',
  },
  dark: {
    glassFill: 'rgba(255,255,255,0.07)',
    glassBorder: 'rgba(255,255,255,0.08)',
    glassHighlightFrom: 'rgba(255,255,255,0.12)',
    glassHighlightTo: 'transparent',
    activeTint: '#FFFFFF',
  },
} as const;

export const tabBarShineStyle = StyleSheet.create({
  shine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '42%',
    opacity: 0.9,
  },
});

export function useGlassTabBarScheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const tokens = isDark ? glassTabTokens.dark : glassTabTokens.light;
  return { isDark, tokens };
}

export function floatingTabBarStyle(insets: EdgeInsets, isDark: boolean) {
  return {
    position: 'absolute' as const,
    left: TAB_BAR_HORIZONTAL_INSET,
    right: TAB_BAR_HORIZONTAL_INSET,
    bottom: Math.max(insets.bottom, 10),
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_RADIUS,
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: 6,
    borderTopWidth: 0,
    backgroundColor: 'transparent' as const,
    elevation: Platform.OS === 'android' ? 20 : 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: Platform.OS === 'ios' ? (isDark ? 0.45 : 0.18) : isDark ? 0.5 : 0.22,
    shadowRadius: 28,
  };
}

export function glassTabBarOuterStyle(borderColor: string) {
  return {
    borderRadius: TAB_BAR_RADIUS,
    overflow: 'hidden' as const,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor,
  };
}

export function glassTabBarFillStyle(fill: string) {
  return {
    backgroundColor: fill,
    borderRadius: TAB_BAR_RADIUS,
  };
}

export function tabBarBlurProps(isDark: boolean) {
  return {
    intensity: isDark ? 96 : 80,
    tint: (isDark ? 'dark' : 'light') as 'dark' | 'light',
  };
}

export const tabBarLabelStyle = {
  fontSize: 10,
  fontWeight: '500' as const,
  textTransform: 'lowercase' as const,
  marginTop: -2,
};

export const tabBarItemStyle = { paddingVertical: 4 };
