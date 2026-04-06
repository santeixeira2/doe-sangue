import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Card } from '../../../components/Card';
import { StatBox } from '../../../components/StatBox';
import { QuickActionRow } from '../../../components/QuickActionRow';
import { SkeletonCard } from '../../../components/Skeleton';
import { useAuthStore } from '../../../store/authStore';
import { useRequestsStore } from '../../../store/requestsStore';
import { useNotificationsStore } from '../../../store/notificationsStore';
import { colors } from '../../../theme/colors';
import { borderRadius, shadows } from '../../../theme/spacing';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { requests, fetchRequests, isLoading: requestsLoading } = useRequestsStore();
  const { unreadCount, fetchUnreadCount } = useNotificationsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchUnreadCount();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchRequests(), fetchUnreadCount()]);
    setRefreshing(false);
  };

  // Find urgent request matching user's blood type
  const urgentRequest = requests.find(
    (r) => r.urgency === 'critical' || r.urgency === 'high'
  );

  const firstName = user?.name?.split(' ')[0] ?? 'Doador';
  const lastDonation = user?.lastDonationDate
    ? formatTimeSince(user.lastDonationDate)
    : 'Nenhuma ainda';
  const livesSaved = user?.livesSaved ?? 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary.DEFAULT}
          colors={[colors.primary.DEFAULT]}
        />
      }
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
        <View>
          <Text style={styles.greeting}>{firstName}</Text>
          <Text style={styles.subtitle}>
            {user?.isAvailable ? 'Respondedor Ativo' : 'Pronto para ajudar'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          style={styles.notifButton}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Status Card */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <Card variant="pink" style={styles.statusCard}>
          <View style={styles.statusIconRow}>
            <View style={styles.statusDot} />
            <View style={styles.statusIconContainer}>
              <Ionicons name="heart" size={28} color={colors.primary.DEFAULT} />
              <View style={styles.plusBadge}>
                <Ionicons name="add" size={12} color="#FFF" />
              </View>
            </View>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.statusTitle}>
            Tudo certo, {firstName}.
          </Text>
          <Text style={styles.statusSubtitle}>
            Estamos monitorando pedidos urgentes em Fortaleza.
          </Text>
        </Card>
      </Animated.View>

      {/* Urgent Request Banner */}
      {urgentRequest && (
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Card variant="red" style={styles.urgentCard}>
            <View style={styles.urgentIconContainer}>
              <Ionicons name="warning" size={20} color="#FFF" />
            </View>
            <Text style={styles.urgentTitle}>
              {urgentRequest.bloodType} Necessário
            </Text>
            <Text style={styles.urgentSubtitle}>
              {urgentRequest.hospitalName} • {urgentRequest.distance} km
            </Text>
            <TouchableOpacity
              style={styles.urgentButton}
              onPress={() => router.push(`/request/${urgentRequest.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.urgentButtonText}>Posso Ajudar</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          </Card>
        </Animated.View>
      )}

      {/* Stats Row */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.statsRow}>
        <StatBox
          icon="time-outline"
          label="Última doação"
          value={lastDonation}
          color={colors.primary.DEFAULT}
        />
        <View style={{ width: 12 }} />
        <StatBox
          icon="star-outline"
          label="Vidas Salvas"
          value={livesSaved > 0 ? String(livesSaved) : 'Nenhuma'}
          color={colors.teal.DEFAULT}
        />
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <QuickActionRow
          icon="location"
          title="Encontrar Centro Mais Próximo"
          onPress={() => {}}
        />
        <QuickActionRow
          icon="fitness"
          title="Verificar Elegibilidade"
          onPress={() => router.push('/safety-check')}
        />
        <QuickActionRow
          icon="water"
          title="Ver Pedidos de Sangue"
          onPress={() => router.push('/(tabs)/requests')}
        />
      </Animated.View>
    </ScrollView>
  );
}

function formatTimeSince(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 30) return `${diffDays} dias`;
  if (diffDays < 60) return '1 mês';
  return `${Math.floor(diffDays / 30)} meses`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.teal.DEFAULT,
    fontWeight: '600',
    marginTop: 2,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statusCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 28,
  },
  statusIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.DEFAULT,
    opacity: 0.4,
  },
  statusIconContainer: {
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  urgentCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 24,
  },
  urgentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  urgentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  urgentSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  urgentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: borderRadius.xl,
  },
  urgentButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary.DEFAULT,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
});
