import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { useAuthStore } from '../../../store/authStore';
import { colors } from '../../../theme/colors';
import { borderRadius, shadows } from '../../../theme/spacing';

export default function MissionCompleteScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.headerRow}>
          <View style={styles.celebrationIcon}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
          </View>
          <Text style={styles.title}>Missão Completa!</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.subtitle}>Você ajudou a salvar 3 vidas hoje.</Text>
        </Animated.View>

        {/* Recovery Timer */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionTitle}>Tempo de Recuperação</Text>
          <Card variant="teal" style={styles.timerCard}>
            <Text style={styles.timerText}>00:{formatTime(timeLeft)}</Text>
            <Text style={styles.timerSubtext}>
              Descanse por 15 minutos antes de dirigir.{'\n'}Avisaremos quando terminar.
            </Text>
          </Card>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tipo Sanguíneo</Text>
            <Text style={styles.statValue}>{user?.bloodType ?? 'O-'}</Text>
          </View>
          <View style={{ width: 12 }} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Doação #</Text>
            <Text style={styles.statValue}>
              {String((user?.totalDonations ?? 0) + 1).padStart(2, '0')}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Voltar ao Início"
          onPress={() => router.replace('/(tabs)')}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 72,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  celebrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.teal[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.teal.DEFAULT,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: 32,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  timerCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 12,
  },
  timerSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.teal[50],
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
  },
  bottomContainer: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
});
