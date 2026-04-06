import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

interface StatBoxProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color?: string;
  style?: ViewStyle;
}

export const StatBox: React.FC<StatBoxProps> = ({
  icon,
  label,
  value,
  color = colors.primary.DEFAULT,
  style,
}) => (
  <View style={[styles.container, style]}>
    <Ionicons name={icon} size={20} color={color} style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
});
