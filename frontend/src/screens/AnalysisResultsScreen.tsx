import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { apiClient } from '../services/api.client';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useHistory, HistoryDetail } from '../hooks/useHistory';
import Svg, { Polygon, Line, Circle, Text as SvgText, G } from 'react-native-svg';

export default function AnalysisResultsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'AnalysisResults'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { getHistoryDetail } = useHistory();
  const { historyId } = route.params;

  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHistoryDetail(historyId);
        setDetail(data);
      } catch (err: any) {
        Alert.alert('Gagal', 'Gagal memuat detail hasil analisis');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [historyId]);

  const handleExport = async (type: 'PDF' | 'Excel') => {
    const extension = type === 'PDF' ? 'pdf' : 'excel';
    const downloadUrl = `${apiClient.defaults.baseURL}/export/${extension}/${historyId}`;

    try {
      const supported = await Linking.canOpenURL(downloadUrl);
      if (supported) {
        await Linking.openURL(downloadUrl);
      } else {
        Alert.alert('Gagal', 'Tidak dapat membuka tautan download di perangkat Anda');
      }
    } catch (error) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengunduh laporan');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Menghitung hasil keputusan...</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Data tidak ditemukan.</Text>
      </View>
    );
  }

  // Ambil 3 alternatif saham terbaik untuk radar chart
  const top3Stocks = detail.ranking.slice(0, 3);
  const steps = detail.calculation_steps;

  // Radar Chart Matematika & Koordinat SVG
  // 4 Kriteria: PE, ROE, DER, DIV
  const criteriaNames = ['PE Ratio', 'ROE', 'DER', 'Div Yield'];
  const center = 100;
  const radius = 70;

  // Mendapatkan koordinat X & Y untuk radar chart sumbu
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI / 2) * index - Math.PI / 2; // Sumbu diputar 90 derajat per kriteria
    const r = radius * val;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Nilai maksimum untuk menskalakan data radar sumbu
  const colMaxs = [0.0001, 0.0001, 0.0001, 0.0001];
  steps.matrix_y.forEach(row => {
    for (let j = 0; j < 4; j++) {
      if (row[j] > colMaxs[j]) colMaxs[j] = row[j];
    }
  });

  // Skema warna untuk top 3 saham di radar chart
  const top3Colors = [
    'rgba(16, 185, 129, 0.7)', // #10B981 (Emerald Green) untuk Juara 1
    'rgba(59, 130, 246, 0.7)', // #3B82F6 (Blue) untuk Juara 2
    'rgba(245, 158, 11, 0.7)'  // #F59E0B (Amber/Orange) untuk Juara 3
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>&larr; Kembali</Text>
          </Pressable>
          <Text style={styles.title}>{detail.title}</Text>
          <Text style={styles.subtitle}>Rekomendasi Saham Berdasarkan Perhitungan TOPSIS</Text>
        </View>

        {/* Bagian 1: Hasil Ranking - Bar Chart Horizontal Kustom */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🏆 Peringkat Alternatif Terbaik</Text>
          <View style={styles.divider} />

          <View style={styles.rankingList}>
            {detail.ranking.map((item, index) => {
              // Hitung lebar persentase untuk bar (berdasarkan skor preferensi)
            const barWidth = `${Math.max(5, item.preference_score * 100)}%` as any;
            const isWinner = index === 0;

              return (
                <View key={item.id} style={styles.rankingRow}>
                  <View style={styles.rankingLabelRow}>
                    <Text style={[styles.rankNum, isWinner && styles.winnerColor]}>
                      #{item.rank}
                    </Text>
                    <Text style={styles.rankCode}>{item.code}</Text>
                    <Text style={styles.rankScore}>{item.preference_score.toFixed(4)}</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.barFill,
                        { width: barWidth },
                        isWinner ? styles.winnerBarBg : styles.normalBarBg
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Bagian 2: Radar Chart Komparasi Top 3 Saham */}
        {top3Stocks.length >= 2 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>🕸️ Radar Chart Perbandingan Top 3 Saham</Text>
            <Text style={styles.sectionDesc}>Membadingkan sebaran kriteria ternormalisasi terbobot:</Text>
            <View style={styles.divider} />

            <View style={styles.chartWrapper}>
              <Svg height="210" width="210" viewBox="0 0 200 200">
                {/* Gambar Jaring Lingkaran Radar (Web Grid) */}
                {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => {
                  const points = [0, 1, 2, 3]
                    .map(i => {
                      const coord = getCoordinates(i, scale);
                      return `${coord.x},${coord.y}`;
                    })
                    .join(' ');
                  return (
                    <Polygon
                      key={`grid-${sIdx}`}
                      points={points}
                      fill="none"
                      stroke="#1F2937"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Sumbu Kriteria */}
                {[0, 1, 2, 3].map(i => {
                  const coord = getCoordinates(i, 1.0);
                  const textCoord = getCoordinates(i, 1.25);
                  return (
                    <G key={`axis-${i}`}>
                      <Line
                        x1={center}
                        y1={center}
                        x2={coord.x}
                        y2={coord.y}
                        stroke="#1F2937"
                        strokeWidth="1.5"
                      />
                      <SvgText
                        x={textCoord.x}
                        y={textCoord.y}
                        fill="#9CA3AF"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                      >
                        {criteriaNames[i]}
                      </SvgText>
                    </G>
                  );
                })}

                {/* Polygon Pola Nilai untuk Top 3 Saham */}
                {top3Stocks.map((stock, stIdx) => {
                  // Temukan baris stock yang cocok di matrix_y
                  const stockIndex = detail.ranking.findIndex(r => r.id === stock.id);
                  if (stockIndex === -1) return null;

                  const stockYValues = steps.matrix_y[stockIndex];

                  const points = stockYValues
                    .map((val, cIdx) => {
                      // Normalisasi skala nilai (skala 0 sampai 1)
                      const scaleVal = val / colMaxs[cIdx];
                      const coord = getCoordinates(cIdx, scaleVal);
                      return `${coord.x},${coord.y}`;
                    })
                    .join(' ');

                  return (
                    <Polygon
                      key={`pattern-${stock.id}`}
                      points={points}
                      fill={top3Colors[stIdx]}
                      stroke={top3Colors[stIdx].replace('0.7', '1.0')}
                      strokeWidth="1.5"
                    />
                  );
                })}
              </Svg>

              {/* Legend Radar Chart */}
              <View style={styles.legendContainer}>
                {top3Stocks.map((stock, idx) => (
                  <View key={stock.id} style={styles.legendItem}>
                    <View style={[styles.legendIndicator, { backgroundColor: top3Colors[idx].replace('0.7', '1.0') }]} />
                    <Text style={styles.legendText}>#{idx + 1} {stock.code}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Tombol Tindakan */}
        <View style={styles.btnColumn}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressedBtn]}
            onPress={() =>
              navigation.navigate('CalculationDetails', { resultsData: detail })
            }
          >
            <Text style={styles.primaryBtnText}>🔎 DETAIL LANGKAH PERHITUNGAN</Text>
          </Pressable>

          <View style={styles.exportRow}>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressedBtn]}
              onPress={() => handleExport('PDF')}
            >
              <Text style={styles.secondaryBtnText}>📄 Ekspor PDF</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressedBtn]}
              onPress={() => handleExport('Excel')}
            >
              <Text style={styles.secondaryBtnText}>📊 Ekspor Excel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  header: {
    marginTop: 16,
    marginBottom: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#161F30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937'
  },
  backBtnText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  sectionDesc: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 12,
  },
  rankingList: {
    gap: 14,
  },
  rankingRow: {
    flexDirection: 'column',
  },
  rankingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rankNum: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 28,
  },
  winnerColor: {
    color: '#10B981',
  },
  rankCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F3F4F6',
    flex: 1,
  },
  rankScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#0B0F19',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  winnerBarBg: {
    backgroundColor: '#10B981',
  },
  normalBarBg: {
    backgroundColor: '#3B82F6',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#F3F4F6',
    fontSize: 10,
    fontWeight: '600',
  },
  btnColumn: {
    gap: 12,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#F3F4F6',
    fontWeight: 'bold',
    fontSize: 13,
  },
  exportRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#9CA3AF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  pressedBtn: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
