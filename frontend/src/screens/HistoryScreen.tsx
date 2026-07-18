import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useHistory, HistorySummary } from '../hooks/useHistory';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { historyList, isLoading, deleteHistory, refetch } = useHistory();

  // Muat ulang riwayat setiap kali screen difokuskan
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const handleDeleteHistory = (item: HistorySummary) => {
    Alert.alert(
      'Hapus Riwayat',
      `Apakah Anda yakin ingin menghapus riwayat analisis "${item.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHistory(item.id);
              Alert.alert('Sukses', 'Riwayat analisis berhasil dihapus');
            } catch (err: any) {
              Alert.alert('Gagal', err.response?.data?.message || 'Gagal menghapus riwayat');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Analisis</Text>
        <Text style={styles.subtitle}>Rekaman Simulasi Keputusan Saham</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Memuat riwayat simulasi...</Text>
        </View>
      ) : historyList.length > 0 ? (
        <FlatList
          data={historyList}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.historyCard, pressed && styles.cardPressed]}
              onPress={() =>
                navigation.navigate('AnalysisResults', { historyId: item.id })
              }
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
                </View>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteHistory(item)}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </Pressable>
              </View>

              <View style={styles.divider} />

              <Text style={styles.weightsLabel}>Konfigurasi Bobot:</Text>
              <View style={styles.weightsGrid}>
                <View style={styles.weightItem}>
                  <Text style={styles.weightLabel}>PE Ratio</Text>
                  <Text style={styles.weightValue}>{item.weight_pe}%</Text>
                </View>
                <View style={styles.weightItem}>
                  <Text style={styles.weightLabel}>ROE</Text>
                  <Text style={styles.weightValue}>{item.weight_roe}%</Text>
                </View>
                <View style={styles.weightItem}>
                  <Text style={styles.weightLabel}>DER</Text>
                  <Text style={styles.weightValue}>{item.weight_der}%</Text>
                </View>
                <View style={styles.weightItem}>
                  <Text style={styles.weightLabel}>Div Yield</Text>
                  <Text style={styles.weightValue}>{item.weight_div}%</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.emptyArea}>
          <Text style={styles.emptyText}>Belum ada riwayat kalkulasi TOPSIS.</Text>
        </View>
      )}
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
  loadingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
  },
  listContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  historyCard: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  cardDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#1F2937',
  },
  deleteText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 12,
  },
  weightsLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 8,
  },
  weightsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  weightItem: {
    flex: 1,
    backgroundColor: '#0B0F19',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  weightValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  emptyArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
