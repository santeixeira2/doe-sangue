import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

interface QuickActionRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({
  icon,
  title,
  onPress,
  style,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.container, style]}
  >
    <View style={styles.left}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={colors.primary.DEFAULT} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
    <Ionicons name="arrow-forward" size={20} color={colors.primary.DEFAULT} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
