import React from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStocks } from '../hooks/useStocks';
import { useHistory } from '../hooks/useHistory';

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { stocks, refetch: refetchStocks, isLoading: isStocksLoading } = useStocks();
  const { historyList, refetch: refetchHistory, isLoading: isHistoryLoading } = useHistory();

  // Muat ulang data setiap kali screen ini difokuskan
  useFocusEffect(
    React.useCallback(() => {
      refetchStocks();
      refetchHistory();
    }, [refetchStocks, refetchHistory])
  );

  const lastAnalysis = historyList[0];
  const totalStocks = stocks.length;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  if (isStocksLoading || isHistoryLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Memuat statistik...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saham LQ45</Text>
        <Text style={styles.subtitle}>Sistem Pendukung Keputusan TOPSIS</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Saham Terdaftar</Text>
          <Text style={styles.statValue}>{totalStocks} Saham</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Analisis Terakhir</Text>
          <Text style={styles.statValue}>
            {lastAnalysis ? formatDate(lastAnalysis.created_at) : 'Belum Ada'}
          </Text>
        </View>
      </View>

      {lastAnalysis ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hasil Rekomendasi Terakhir</Text>
          <View style={styles.divider} />
          <Text style={styles.recommendationText}>{lastAnalysis.title}</Text>
          <Text style={styles.weightsText}>
            Bobot Kriteria: PE({lastAnalysis.weight_pe}%) ROE({lastAnalysis.weight_roe}%) DER({lastAnalysis.weight_der}%) DIV({lastAnalysis.weight_div}%)
          </Text>
          <Pressable
            style={styles.viewDetailLink}
            onPress={() =>
              navigation.navigate('AnalysisResults', { historyId: lastAnalysis.id })
            }
          >
            <Text style={styles.viewDetailLinkText}>Lihat Hasil Analisis &rarr;</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hasil Rekomendasi Terakhir</Text>
          <View style={styles.divider} />
          <Text style={styles.placeholderText}>Belum ada riwayat simulasi analisis dijalankan.</Text>
        </View>
      )}

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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14
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
  placeholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic'
  },
  viewDetailLink: {
    marginTop: 14,
    alignSelf: 'flex-start'
  },
  viewDetailLinkText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600'
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
    height: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
});
