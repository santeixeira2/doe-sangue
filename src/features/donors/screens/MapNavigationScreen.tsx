import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActionSheetIOS,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  FadeIn,
  SlideInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { colors } from '../../../theme/colors';
import { borderRadius, shadows } from '../../../theme/spacing';
import { useLocation } from '../../../hooks/useLocation';
import { openMapRoute, MapProvider } from '../../../utils/navigationUtils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80;
const THUMB_SIZE = 52;

// Coordenadas do Hospital São José (Exemplo: Fortaleza)
const HOSPITAL_COORDS = { lat: -3.7431, lon: -38.5358, name: 'Hospital São José' };

export default function MapNavigationScreen() {
  const router = useRouter();
  const { location, calculateDistance } = useLocation();
  const translateX = useSharedValue(0);
  const [arrived, setArrived] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const distanceInKm = calculateDistance(HOSPITAL_COORDS.lat, HOSPITAL_COORDS.lon);
  const distanceText = distanceInKm 
    ? `${distanceInKm.toFixed(1)} km` 
    : 'Calculando...';

  const maxSlide = SLIDER_WIDTH - THUMB_SIZE - 8;

  const handleArrival = useCallback(() => {
    if (arrived) return;
    setArrived(true);
    setTimeout(() => {
      router.replace('/donor-id');
    }, 500);
  }, [arrived, router]);

  // Auto-chegada se estiver a menos de 100 metros
  useEffect(() => {
    if (distanceInKm !== null && distanceInKm < 0.1) {
      handleArrival();
    }
  }, [distanceInKm, handleArrival]);

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

  const handleExternalNav = (provider: MapProvider) => {
    setShowPicker(false);
    openMapRoute(HOSPITAL_COORDS.lat, HOSPITAL_COORDS.lon, provider, HOSPITAL_COORDS.name);
  };

  const showNavigationOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Google Maps', 'Waze', 'Apple Maps'],
          cancelButtonIndex: 0,
          title: 'Abrir com...',
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleExternalNav('google');
          if (buttonIndex === 2) handleExternalNav('waze');
          if (buttonIndex === 3) handleExternalNav('apple');
        }
      );
    } else {
      setShowPicker(true);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header Bar */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.hospitalName}>{HOSPITAL_COORDS.name}</Text>
            <Text style={styles.entrance}>Entrada de Emergência B</Text>
          </View>
          <TouchableOpacity onPress={showNavigationOptions} style={styles.navActionButton}>
            <Ionicons name="navigate-circle" size={32} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Map Placeholder (Será substituído na Fase 2) */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.routeLine} />
            <View style={[styles.marker, styles.markerStart]}>
              <View style={styles.markerInner} />
            </View>
            <View style={[styles.marker, styles.markerEnd]}>
              <Ionicons name="location" size={24} color={colors.dark.DEFAULT} />
            </View>
          </View>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <View style={styles.distanceRow}>
            <Text style={styles.distanceText}>{distanceText}</Text>
            <Text style={styles.routeText}>Sua localização via GeolocationBridge</Text>
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

        {/* Android Navigation Picker Modal */}
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
            <Animated.View entering={FadeInDown.duration(300)} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Abrir com...</Text>
              
              <TouchableOpacity style={styles.modalOption} onPress={() => handleExternalNav('google')}>
                <Ionicons name="logo-google" size={24} color={colors.text.primary} />
                <Text style={styles.modalOptionText}>Google Maps</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption} onPress={() => handleExternalNav('waze')}>
                <Ionicons name="car" size={24} color={colors.text.primary} />
                <Text style={styles.modalOptionText}>Waze</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalOption, styles.cancelOption]} onPress={() => setShowPicker(false)}>
                <Text style={[styles.modalOptionText, { color: colors.primary.DEFAULT }]}>Cancelar</Text>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FA',
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
    ...shadows.md,
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
  navActionButton: {
    padding: 4,
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
    opacity: 0.3,
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
    fontSize: 28,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 8,
    justifyContent: 'center',
  },
});
