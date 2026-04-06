import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { borderRadius, shadows } from '../../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80;
const THUMB_SIZE = 52;

export default function MapNavigationScreen() {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const [arrived, setArrived] = useState(false);

  const maxSlide = SLIDER_WIDTH - THUMB_SIZE - 8;

  const handleArrival = () => {
    setArrived(true);
    setTimeout(() => {
      router.replace('/donor-id');
    }, 500);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newX = Math.min(Math.max(0, event.translationX), maxSlide);
      translateX.value = newX;
    })
    .onEnd(() => {
      if (translateX.value > maxSlide * 0.85) {
        translateX.value = withSpring(maxSlide);
        runOnJS(handleArrival)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Red Header Bar */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.hospitalName}>Hospital São José</Text>
            <Text style={styles.entrance}>Entrada de Emergência B</Text>
          </View>
        </Animated.View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            {/* Route line */}
            <View style={styles.routeLine} />
            {/* Start marker */}
            <View style={[styles.marker, styles.markerStart]}>
              <View style={styles.markerInner} />
            </View>
            {/* End marker */}
            <View style={[styles.marker, styles.markerEnd]}>
              <Ionicons name="location" size={24} color={colors.dark.DEFAULT} />
            </View>
          </View>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <View style={styles.distanceRow}>
            <Text style={styles.distanceText}>12 min (4.2 km)</Text>
            <Text style={styles.routeText}>Rota mais rápida via Av. Santos Dumont</Text>
          </View>

          {/* Slide to Arrive */}
          <View style={styles.sliderContainer}>
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.sliderThumb, thumbStyle]}>
                <Ionicons name="arrow-forward" size={22} color="#FFF" />
              </Animated.View>
            </GestureDetector>
            <Text style={styles.sliderText}>Deslize para Chegar</Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  headerBar: {
    backgroundColor: colors.primary.DEFAULT,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  entrance: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.6,
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    top: '20%',
    left: '30%',
    width: '50%',
    height: '60%',
    borderWidth: 3,
    borderColor: colors.primary.DEFAULT,
    borderStyle: 'solid',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    transform: [{ rotate: '-15deg' }],
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerStart: {
    top: '10%',
    left: '25%',
    backgroundColor: colors.primary[50],
    borderWidth: 3,
    borderColor: colors.primary.DEFAULT,
  },
  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.DEFAULT,
  },
  markerEnd: {
    bottom: '15%',
    right: '15%',
    backgroundColor: 'transparent',
  },
  bottomCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
    ...shadows.lg,
  },
  distanceRow: {
    marginBottom: 24,
  },
  distanceText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  sliderContainer: {
    height: THUMB_SIZE + 8,
    backgroundColor: colors.primary[50],
    borderRadius: (THUMB_SIZE + 8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sliderThumb: {
    position: 'absolute',
    left: 4,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadows.md,
  },
  sliderText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary.DEFAULT,
    opacity: 0.7,
  },
});
