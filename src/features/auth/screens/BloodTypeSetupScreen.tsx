import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { BloodTypeGrid } from '../../../components/BloodTypeBadge';
import { useAuthStore } from '../../../store/authStore';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { BloodType } from '../../../types';

export default function BloodTypeSetupScreen() {
  const router = useRouter();
  const { completeSetup, isLoading } = useAuthStore();
  const [selectedType, setSelectedType] = useState<BloodType | null>(null);
  const [gpsEnabled, setGpsEnabled] = useState(true);

  const handleComplete = async () => {
    if (!selectedType) return;
    await completeSetup(selectedType);
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Qual é o seu{'\n'}Tipo Sanguíneo?</Text>
      <Text style={styles.subtitle}>
        Só alertamos quando seu tipo específico é necessário por perto.
      </Text>

      {/* Blood Type Grid */}
      <View style={styles.gridContainer}>
        <BloodTypeGrid
          selectedType={selectedType}
          onSelect={setSelectedType}
        />
      </View>

      {/* Location Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas por Localização</Text>
        <View style={styles.gpsRow}>
          <View style={styles.gpsLeft}>
            <View style={styles.gpsIconContainer}>
              <Ionicons name="location" size={20} color={colors.primary.DEFAULT} />
            </View>
            <View>
              <Text style={styles.gpsTitle}>Ativar GPS</Text>
              <Text style={styles.gpsSubtitle}>Alertas em raio de 5km</Text>
            </View>
          </View>
          <Switch
            value={gpsEnabled}
            onValueChange={setGpsEnabled}
            trackColor={{
              false: colors.border,
              true: colors.primary[200],
            }}
            thumbColor={gpsEnabled ? colors.primary.DEFAULT : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Complete Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Completar Cadastro"
          onPress={handleComplete}
          disabled={!selectedType}
          loading={isLoading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  gridContainer: {
    marginBottom: 36,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gpsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  gpsSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  bottomContainer: {
    marginTop: 8,
  },
});
