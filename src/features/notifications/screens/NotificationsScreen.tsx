import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useNotificationsStore } from '../../../store/notificationsStore';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { Notification } from '../../../types';

const typeConfig: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  urgent_request: { icon: 'warning', color: '#D32F2F', bg: '#FFEBEE' },
  donation_reminder: { icon: 'fitness', color: '#1976D2', bg: '#E3F2FD' },
  thank_you: { icon: 'heart', color: '#E53935', bg: '#FDECEA' },
  general: { icon: 'information-circle', color: '#666666', bg: '#F5F5F5' },
};

function getTimeAgo(d: string): string {
  const ms = Date.now() - new Date(d).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return 'Agora';
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, fetchNotifications, markAsRead } = useNotificationsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  const onRefresh = async () => { setRefreshing(true); await fetchNotifications(); setRefreshing(false); };

  const renderItem = ({ item, index }: { item: Notification; index: number }) => {
    const cfg = typeConfig[item.type] ?? typeConfig.general;
    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
        <TouchableOpacity onPress={() => !item.isRead && markAsRead(item.id)} activeOpacity={0.7}
          style={[styles.item, !item.isRead && styles.unread]}>
          <View style={[styles.icon, { backgroundColor: cfg.bg }]}>
            <Ionicons name={cfg.icon} size={20} color={cfg.color} />
          </View>
          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={[styles.title, !item.isRead && { fontWeight: '700' }]} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.time}>{getTimeAgo(item.createdAt)}</Text>
            </View>
            <Text style={styles.msg} numberOfLines={2}>{item.message}</Text>
          </View>
          {!item.isRead && <View style={styles.dot} />}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 44 }} />
      </View>
      <FlatList data={notifications} keyExtractor={(i) => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.DEFAULT} />}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="notifications-off-outline" size={48} color={colors.text.muted} /><Text style={styles.emptyText}>Nenhuma notificação</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  unread: { backgroundColor: '#FFFBFA', borderColor: colors.primary[100] },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  body: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '500', color: colors.text.primary, flex: 1, marginRight: 8 },
  time: { fontSize: 12, color: colors.text.muted },
  msg: { fontSize: 13, color: colors.text.secondary, lineHeight: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary.DEFAULT, marginLeft: 8 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, color: colors.text.muted },
});
