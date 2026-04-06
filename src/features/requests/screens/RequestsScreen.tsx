import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { RequestCard } from '../../../components/RequestCard';
import { SkeletonCard } from '../../../components/Skeleton';
import { useRequestsStore } from '../../../store/requestsStore';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { BloodType, BloodRequest, UrgencyLevel } from '../../../types';

const BLOOD_TYPES: (BloodType | 'Todos')[] = ['Todos', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const URGENCY_LEVELS: (UrgencyLevel | 'Todos')[] = ['Todos', 'critical', 'high', 'medium', 'low'];

const urgencyLabels: Record<string, string> = {
  Todos: 'Todos',
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Médio',
  low: 'Baixo',
};

export default function RequestsScreen() {
  const router = useRouter();
  const { requests, fetchRequests, isLoading, selectRequest } = useRequestsStore();
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType | 'Todos'>('Todos');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel | 'Todos'>('Todos');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const filteredRequests = requests.filter((r) => {
    if (selectedBloodType !== 'Todos' && r.bloodType !== selectedBloodType) return false;
    if (selectedUrgency !== 'Todos' && r.urgency !== selectedUrgency) return false;
    return true;
  }).sort((a, b) => {
    const urgencyOrder: Record<UrgencyLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });

  const handleRequestPress = (request: BloodRequest) => {
    selectRequest(request);
    router.push(`/request/${request.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
        <Text style={styles.title}>Pedidos de Sangue</Text>
        <Text style={styles.subtitle}>{filteredRequests.length} pedidos ativos</Text>
      </Animated.View>

      {/* Blood Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {BLOOD_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedBloodType(type)}
            style={[
              styles.filterChip,
              selectedBloodType === type && styles.filterChipActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedBloodType === type && styles.filterChipTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Urgency Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.urgencyScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {URGENCY_LEVELS.map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setSelectedUrgency(level)}
            style={[
              styles.urgencyChip,
              selectedUrgency === level && styles.urgencyChipActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.urgencyChipText,
                selectedUrgency === level && styles.urgencyChipTextActive,
              ]}
            >
              {urgencyLabels[level]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Request List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
              <RequestCard
                request={item}
                onPress={handleRequestPress}
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.DEFAULT}
              colors={[colors.primary.DEFAULT]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="water-outline" size={48} color={colors.text.muted} />
              <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
              <Text style={styles.emptySubtext}>Tente ajustar os filtros</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 4,
  },
  filterScroll: {
    maxHeight: 50,
    marginTop: 12,
  },
  urgencyScroll: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: colors.primary.DEFAULT,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  urgencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urgencyChipActive: {
    backgroundColor: colors.dark.DEFAULT,
    borderColor: colors.dark.DEFAULT,
  },
  urgencyChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  urgencyChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  loadingContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.muted,
  },
});
