import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { BloodRequest, UrgencyLevel } from '../types';

interface RequestCardProps {
  request: BloodRequest;
  onPress: (request: BloodRequest) => void;
  style?: ViewStyle;
}

const urgencyConfig: Record<UrgencyLevel, { label: string; color: string; bg: string }> = {
  critical: { label: 'Crítico', color: '#D32F2F', bg: '#FFEBEE' },
  high: { label: 'Alto', color: '#E65100', bg: '#FFF3E0' },
  medium: { label: 'Médio', color: '#F9A825', bg: '#FFFDE7' },
  low: { label: 'Baixo', color: '#43A047', bg: '#E8F5E9' },
};

export const RequestCard: React.FC<RequestCardProps> = ({ request, onPress, style }) => {
  const urgency = urgencyConfig[request.urgency];

  return (
    <TouchableOpacity
      onPress={() => onPress(request)}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <View style={styles.header}>
        <View style={styles.bloodTypeBadge}>
          <Text style={styles.bloodTypeText}>{request.bloodType}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.hospital} numberOfLines={1}>{request.hospitalName}</Text>
          <Text style={styles.address} numberOfLines={1}>{request.hospitalAddress}</Text>
        </View>
        <View style={[styles.urgencyBadge, { backgroundColor: urgency.bg }]}>
          <Text style={[styles.urgencyText, { color: urgency.color }]}>{urgency.label}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={14} color={colors.text.muted} />
          <Text style={styles.footerText}>{request.distance} km</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="water-outline" size={14} color={colors.text.muted} />
          <Text style={styles.footerText}>
            {request.unitsFulfilled}/{request.unitsNeeded} unidades
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color={colors.text.muted} />
          <Text style={styles.footerText}>
            {getTimeAgo(request.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Agora';
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bloodTypeBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary.DEFAULT,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hospital: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  address: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '500',
  },
});
