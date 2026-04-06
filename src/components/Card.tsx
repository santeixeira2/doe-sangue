import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'pink' | 'red' | 'teal';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 20,
}) => {
  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.card,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.card,
      ...shadows.md,
    },
    pink: {
      backgroundColor: colors.primary[50],
    },
    red: {
      backgroundColor: colors.primary.DEFAULT,
    },
    teal: {
      backgroundColor: colors.teal.DEFAULT,
    },
  };

  return (
    <View style={[styles.base, variantStyles[variant], { padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});
