import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { useRequestsStore } from '../../../store/requestsStore';
import { useAuthStore } from '../../../store/authStore';
import { isCompatibleWithRequest } from '../../../utils/bloodCompatibility';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { UrgencyLevel } from '../../../types';

const urgencyConfig: Record<UrgencyLevel, { label: string; color: string; bg: string }> = {
  critical: { label: 'Crítico', color: '#D32F2F', bg: '#FFEBEE' },
  high: { label: 'Alto', color: '#E65100', bg: '#FFF3E0' },
  medium: { label: 'Médio', color: '#F9A825', bg: '#FFFDE7' },
  low: { label: 'Baixo', color: '#43A047', bg: '#E8F5E9' },
};

export default function RequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedRequest, respondToRequest } = useRequestsStore();
  const { user } = useAuthStore();

  const request = selectedRequest;
  if (!request) return <View style={styles.container}><Text>Carregando...</Text></View>;

  const urgency = urgencyConfig[request.urgency];
  const isCompatible = user ? isCompatibleWithRequest(user.bloodType, request) : false;

  const handleHelp = async () => {
    await respondToRequest(request.id);
    router.push('/safety-check');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card variant="elevated" style={styles.mainCard}>
            <View style={styles.topRow}>
              <View style={styles.bloodBadge}>
                <Text style={styles.bloodText}>{request.bloodType}</Text>
              </View>
              <View style={[styles.urgencyBadge, { backgroundColor: urgency.bg }]}>
                <Text style={[styles.urgencyText, { color: urgency.color }]}>{urgency.label}</Text>
              </View>
            </View>
            <Text style={styles.hospital}>{request.hospitalName}</Text>
            <Text style={styles.address}>{request.hospitalAddress}</Text>

            <View style={styles.infoGrid}>
              <InfoItem icon="water-outline" label="Unidades" value={`${request.unitsFulfilled}/${request.unitsNeeded}`} />
              <InfoItem icon="location-outline" label="Distância" value={`${request.distance} km`} />
              <InfoItem icon="time-outline" label="Expira" value={formatExpiry(request.expiresAt)} />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{request.description}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${request.contactPhone}`)}>
            <Ionicons name="call-outline" size={20} color={colors.primary.DEFAULT} />
            <Text style={styles.contactText}>{request.contactPhone}</Text>
          </TouchableOpacity>
        </Animated.View>

        {!isCompatible && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.warningBox}>
            <Ionicons name="information-circle" size={20} color={colors.warning} />
            <Text style={styles.warningText}>
              Seu tipo sanguíneo ({user?.bloodType}) não é compatível com este pedido ({request.bloodType}).
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button title="Quero Ajudar" onPress={handleHelp} disabled={!isCompatible}
          icon={<Ionicons name="arrow-forward" size={20} color="#FFF" />} />
      </View>
    </View>
  );
}

function InfoItem({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color={colors.text.muted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function formatExpiry(d: string): string {
  const h = Math.max(0, Math.floor((new Date(d).getTime() - Date.now()) / 3600000));
  return h > 24 ? `${Math.floor(h / 24)}d` : `${h}h`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  content: { paddingHorizontal: 24, paddingBottom: 120 },
  mainCard: { padding: 20, marginBottom: 24 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  bloodBadge: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center' },
  bloodText: { fontSize: 20, fontWeight: '800', color: colors.primary.DEFAULT },
  urgencyBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  urgencyText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  hospital: { fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  address: { fontSize: 14, color: colors.text.secondary, marginBottom: 16 },
  infoGrid: { flexDirection: 'row', gap: 8 },
  infoItem: { flex: 1, backgroundColor: colors.background, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4 },
  infoLabel: { fontSize: 11, color: colors.text.muted, fontWeight: '500' },
  infoValue: { fontSize: 15, fontWeight: '700', color: colors.text.primary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  description: { fontSize: 15, color: colors.text.secondary, lineHeight: 22, marginBottom: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.primary[50], borderRadius: 12, padding: 14, marginBottom: 20 },
  contactText: { fontSize: 15, fontWeight: '600', color: colors.primary.DEFAULT },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14 },
  warningText: { flex: 1, fontSize: 13, color: '#F57F17', lineHeight: 19 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 36, paddingTop: 16, backgroundColor: colors.background },
});
