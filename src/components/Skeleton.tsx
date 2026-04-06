import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadiusValue?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadiusValue = borderRadius.md,
  style,
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius: borderRadiusValue,
          backgroundColor: colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ style }) => (
  <View style={[skeletonStyles.card, style]}>
    <View style={skeletonStyles.row}>
      <Skeleton width={48} height={48} borderRadiusValue={borderRadius.md} />
      <View style={skeletonStyles.textBlock}>
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={12} style={{ marginTop: 8 }} />
      </View>
    </View>
    <Skeleton width={'100%' as unknown as number} height={14} style={{ marginTop: 16 }} />
    <Skeleton width={'70%' as unknown as number} height={14} style={{ marginTop: 8 }} />
  </View>
);

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBlock: {
    marginLeft: 12,
  },
});
