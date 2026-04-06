import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BloodType } from '../types';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface BloodTypeBadgeProps {
  type: BloodType;
  selected?: boolean;
  onPress?: (type: BloodType) => void;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const BloodTypeBadge: React.FC<BloodTypeBadgeProps> = ({
  type,
  selected = false,
  onPress,
  size = 'md',
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const sizeMap = {
    sm: { width: 48, height: 48, fontSize: 14 },
    md: { width: 64, height: 64, fontSize: 16 },
    lg: { width: 80, height: 80, fontSize: 20 },
  };

  const { width, height, fontSize } = sizeMap[size];

  return (
    <AnimatedTouchable
      onPress={() => onPress?.(type)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          width,
          height,
          backgroundColor: selected ? colors.primary.DEFAULT : colors.primary[50],
          borderWidth: selected ? 0 : 1,
          borderColor: selected ? 'transparent' : colors.primary[100],
        },
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize,
            color: selected ? '#FFFFFF' : colors.primary.DEFAULT,
            fontWeight: selected ? '700' : '600',
          },
        ]}
      >
        {type}
      </Text>
    </AnimatedTouchable>
  );
};

interface BloodTypeGridProps {
  selectedType: BloodType | null;
  onSelect: (type: BloodType) => void;
}

export const BloodTypeGrid: React.FC<BloodTypeGridProps> = ({ selectedType, onSelect }) => {
  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <View style={styles.grid}>
      {bloodTypes.map((type) => (
        <BloodTypeBadge
          key={type}
          type={type}
          selected={selectedType === type}
          onPress={onSelect}
          style={styles.gridItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  gridItem: {
    marginBottom: 4,
  },
});
