import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/authStore';
import { colors } from '../../../theme/colors';
import { borderRadius, shadows } from '../../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DonorIdScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        onPress={() => router.replace('/mission-complete')}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* ID Card */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.card}>
        {/* Red section */}
        <View style={styles.redSection}>
          {/* Blood type badge */}
          <View style={styles.bloodTypeBadge}>
            <Text style={styles.bloodTypeText}>{user?.bloodType ?? 'O-'}</Text>
          </View>
          <Text style={styles.donorName}>{user?.name ?? 'Doador'}</Text>
        </View>

        {/* Teal QR section */}
        <View style={styles.tealSection}>
          {/* QR Code Placeholder */}
          <View style={styles.qrContainer}>
            <View style={styles.qrGrid}>
              {Array.from({ length: 64 }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    Math.random() > 0.4 && styles.qrCellFilled,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Dashed line */}
        <View style={styles.dashedLine}>
          {Array.from({ length: 12 }, (_, i) => (
            <View key={i} style={styles.dash} />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.emergencyId}>
            ID Emergência: #TR-{Math.floor(Math.random() * 900 + 100)}
          </Text>
          <Text style={styles.showText}>Mostre na Recepção</Text>
        </View>
      </Animated.View>

      {/* Brightness indicator */}
      <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.brightnessRow}>
        <Ionicons name="sunny-outline" size={18} color="rgba(255,255,255,0.7)" />
        <Text style={styles.brightnessText}>Brilho da Tela 100%</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: SCREEN_WIDTH - 64,
    backgroundColor: colors.card,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.lg,
  },
  redSection: {
    backgroundColor: colors.primary.DEFAULT,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bloodTypeBadge: {
    position: 'absolute',
    top: 16,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  donorName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
  },
  tealSection: {
    backgroundColor: colors.teal.DEFAULT,
    paddingVertical: 24,
    alignItems: 'center',
  },
  qrContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: {
    width: 112,
    height: 112,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    width: 14,
    height: 14,
  },
  qrCellFilled: {
    backgroundColor: colors.text.primary,
  },
  dashedLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: colors.primary.DEFAULT,
  },
  dash: {
    width: 16,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
  },
  cardFooter: {
    backgroundColor: colors.primary.DEFAULT,
    paddingBottom: 20,
    paddingTop: 4,
    alignItems: 'center',
  },
  emergencyId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  showText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  brightnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  brightnessText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
});
