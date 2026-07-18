import React from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saham LQ45</Text>
        <Text style={styles.subtitle}>Sistem Pendukung Keputusan TOPSIS</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Saham Terdaftar</Text>
          <Text style={styles.statValue}>5 Saham</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Analisis Terakhir</Text>
          <Text style={styles.statValue}>18-07-2026</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Hasil Rekomendasi Terakhir</Text>
        <View style={styles.divider} />
        <Text style={styles.recommendationText}>#1 BBCA (V = 0.8920)</Text>
        <Text style={styles.weightsText}>
          Bobot: PE(25%) ROE(30%) DER(20%) DIV(25%)
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
          ]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'WeightSetup' } as any)}
        >
          <Text style={styles.buttonText}>MULAI ANALISIS BARU</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#161F30',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  summaryCard: {
    backgroundColor: '#161F30',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F4F6',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  weightsText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48, // Touch target height >= 44
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
});
