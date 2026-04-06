import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Card } from '../../../components/Card';
import { StatBox } from '../../../components/StatBox';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/authStore';
import { colors } from '../../../theme/colors';
import { borderRadius, shadows } from '../../../theme/spacing';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateAvailability, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/onboarding');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </Animated.View>

      {/* Profile Card */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={colors.primary.DEFAULT} />
            </View>
            <View style={styles.bloodBadge}>
              <Text style={styles.bloodBadgeText}>{user?.bloodType ?? 'O-'}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name ?? 'Doador'}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? 'email@mail.com'}</Text>

          {/* Availability Toggle */}
          <View style={styles.availabilityRow}>
            <View>
              <Text style={styles.availabilityTitle}>Disponível para Doação</Text>
              <Text style={styles.availabilitySubtitle}>
                {user?.isAvailable ? 'Ativo — recebendo alertas' : 'Inativo — sem alertas'}
              </Text>
            </View>
            <Switch
              value={user?.isAvailable ?? true}
              onValueChange={updateAvailability}
              trackColor={{ false: colors.border, true: colors.primary[200] }}
              thumbColor={user?.isAvailable ? colors.primary.DEFAULT : '#f4f3f4'}
            />
          </View>
        </Card>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.statsRow}>
        <StatBox
          icon="water-outline"
          label="Doações"
          value={String(user?.totalDonations ?? 0)}
          color={colors.primary.DEFAULT}
        />
        <View style={{ width: 12 }} />
        <StatBox
          icon="heart-outline"
          label="Vidas Salvas"
          value={String(user?.livesSaved ?? 0)}
          color={colors.teal.DEFAULT}
        />
        <View style={{ width: 12 }} />
        <StatBox
          icon="flame-outline"
          label="Sequência"
          value={String(user?.streak ?? 0)}
          color={colors.warning}
        />
      </Animated.View>

      {/* Badges */}
      {user?.badges && user.badges.length > 0 && (
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <View style={styles.badgesGrid}>
            {user.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Menu Items */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={styles.menuItem}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Logout */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.logoutContainer}>
        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          variant="ghost"
          textStyle={{ color: colors.primary.DEFAULT }}
        />
      </Animated.View>
    </ScrollView>
  );
}

const menuItems = [
  {
    icon: 'notifications-outline' as const,
    title: 'Notificações',
    bgColor: colors.primary[50],
    iconColor: colors.primary.DEFAULT,
  },
  {
    icon: 'time-outline' as const,
    title: 'Histórico de Doações',
    bgColor: colors.teal[50],
    iconColor: colors.teal.DEFAULT,
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Privacidade e Segurança',
    bgColor: '#E8F5E9',
    iconColor: '#43A047',
  },
  {
    icon: 'help-circle-outline' as const,
    title: 'Ajuda e Suporte',
    bgColor: '#FFF3E0',
    iconColor: '#FB8C00',
  },
  {
    icon: 'information-circle-outline' as const,
    title: 'Sobre o App',
    bgColor: '#E3F2FD',
    iconColor: '#1E88E5',
  },
];

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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodBadge: {
    position: 'absolute',
    bottom: -4,
    right: -8,
    backgroundColor: colors.primary.DEFAULT,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.card,
  },
  bloodBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 14,
  },
  availabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  availabilitySubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
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
  badgesGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  badgeItem: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
  },
  logoutContainer: {
    marginTop: 16,
  },
});
