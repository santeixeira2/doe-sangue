import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View } from 'react-native';
import {
  glassTabBarFillStyle,
  glassTabBarOuterStyle,
  tabBarBlurProps,
  tabBarShineStyle,
  useGlassTabBarScheme,
} from '../navigation/glassTabBar';

/**
 * Liquid-glass style tab bar backdrop (ported from sorria-ai).
 * On web, BlurView is limited — use a solid frosted layer instead.
 */
export function GlassTabBarBackground() {
  const { isDark, tokens } = useGlassTabBarScheme();
  const blur = tabBarBlurProps(isDark);

  if (Platform.OS === 'web') {
    return (
      <View style={[StyleSheet.absoluteFill, glassTabBarOuterStyle(tokens.glassBorder)]}>
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, glassTabBarFillStyle(tokens.glassFill)]} />
        <LinearGradient
          pointerEvents="none"
          colors={[tokens.glassHighlightFrom, tokens.glassHighlightTo]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={tabBarShineStyle.shine}
        />
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, glassTabBarOuterStyle(tokens.glassBorder)]}>
      <BlurView intensity={blur.intensity} tint={blur.tint} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, glassTabBarFillStyle(tokens.glassFill)]} />
      <LinearGradient
        pointerEvents="none"
        colors={[tokens.glassHighlightFrom, tokens.glassHighlightTo]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={tabBarShineStyle.shine}
      />
    </View>
  );
}
