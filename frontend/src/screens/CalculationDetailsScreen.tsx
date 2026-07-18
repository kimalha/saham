import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { HistoryDetail } from '../hooks/useHistory';

type ActiveTabType = 'D' | 'R' | 'Y' | 'IdealDist';

export default function CalculationDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CalculationDetails'>>();
  const navigation = useNavigation();
  const { resultsData } = route.params;
  const detail: HistoryDetail = resultsData;

  const [activeTab, setActiveTab] = useState<ActiveTabType>('D');

  const steps = detail.calculation_steps;
  const ranking = detail.ranking;

  const getStockCode = (rowIndex: number): string => {
    const item = ranking[rowIndex];
    return item ? item.code : `S${rowIndex + 1}`;
  };

  const renderTabHeader = (tab: ActiveTabType, label: string) => {
    const isActive = activeTab === tab;
    return (
      <Pressable
        key={tab}
        style={[styles.tabItem, isActive && styles.tabItemActive]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const renderMatrixRows = (matrix: number[][]) => {
    return matrix.map((row, rIdx) => (
      <View key={`row-${rIdx}`} style={[styles.tableRow, rIdx % 2 === 1 && styles.tableRowAlt]}>
        <Text style={[styles.tableCell, styles.cellCode, styles.textBold]}>
          {getStockCode(rIdx)}
        </Text>
        {row.map((val, cIdx) => (
          <Text key={`cell-${rIdx}-${cIdx}`} style={styles.tableCell}>
            {val.toFixed(4)}
          </Text>
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>&larr; Kembali</Text>
        </Pressable>
        <Text style={styles.title}>Langkah Perhitungan</Text>
        <Text style={styles.subtitle}>Transparansi Proses Matematika TOPSIS</Text>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {renderTabHeader('D', 'Matriks Awal (D)')}
          {renderTabHeader('R', 'Normalisasi (R)')}
          {renderTabHeader('Y', 'Terbobot (Y)')}
          {renderTabHeader('IdealDist', 'Ideal & Jarak (D±)')}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll}>
        {/* Tab 1: Matriks Keputusan Awal D */}
        {activeTab === 'D' && (
          <View style={styles.tabBody}>
            <Text style={styles.stepTitle}>Langkah 1: Membentuk Matriks Keputusan (D)</Text>
            <Text style={styles.stepDesc}>
              Matriks keputusan awal berisi nilai fundamental keuangan dari masing-masing alternatif saham indeks LQ45 pada 4 kriteria yang didukung.
            </Text>

            <View style={styles.tableWrapper}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.cellCode]}>Ticker</Text>
                <Text style={styles.tableHeaderCell}>PE (C)</Text>
                <Text style={styles.tableHeaderCell}>ROE (B)</Text>
                <Text style={styles.tableHeaderCell}>DER (C)</Text>
                <Text style={styles.tableHeaderCell}>DIV (B)</Text>
              </View>
              {renderMatrixRows(steps.matrix_d)}
            </View>
            <Text style={styles.noteText}>* (B) = Benefit (Maksimal lebih baik), (C) = Cost (Minimal lebih baik)</Text>
          </View>
        )}

        {/* Tab 2: Matriks Ternormalisasi R */}
        {activeTab === 'R' && (
          <View style={styles.tabBody}>
            <Text style={styles.stepTitle}>Langkah 2: Membuat Matriks Keputusan Ternormalisasi (R)</Text>
            <Text style={styles.stepDesc}>
              Membagi setiap nilai sel dengan akar kuadrat dari jumlah kuadrat kolomnya (Vector Normalization) untuk menyamakan skala kriteria.
            </Text>

            <View style={styles.tableWrapper}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.cellCode]}>Ticker</Text>
                <Text style={styles.tableHeaderCell}>r1 (PE)</Text>
                <Text style={styles.tableHeaderCell}>r2 (ROE)</Text>
                <Text style={styles.tableHeaderCell}>r3 (DER)</Text>
                <Text style={styles.tableHeaderCell}>r4 (DIV)</Text>
              </View>
              {renderMatrixRows(steps.matrix_r)}
            </View>
          </View>
        )}

        {/* Tab 3: Matriks Terbobot Y */}
        {activeTab === 'Y' && (
          <View style={styles.tabBody}>
            <Text style={styles.stepTitle}>Langkah 3: Membuat Matriks Ternormalisasi Terbobot (Y)</Text>
            <Text style={styles.stepDesc}>
              Mengalikan kolom matriks ternormalisasi (R) dengan bobot kriteria desimal (w) yang diatur oleh pengguna.
            </Text>

            <View style={styles.tableWrapper}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.cellCode]}>Ticker</Text>
                <Text style={styles.tableHeaderCell}>y1 (PE)</Text>
                <Text style={styles.tableHeaderCell}>y2 (ROE)</Text>
                <Text style={styles.tableHeaderCell}>y3 (DER)</Text>
                <Text style={styles.tableHeaderCell}>y4 (DIV)</Text>
              </View>
              {renderMatrixRows(steps.matrix_y)}
            </View>
          </View>
        )}

        {/* Tab 4: Solusi Ideal A+, A- & Jarak D+, D- */}
        {activeTab === 'IdealDist' && (
          <View style={styles.tabBody}>
            <Text style={styles.stepTitle}>Langkah 4: Menentukan Solusi Ideal Positif (A+) & Negatif (A-)</Text>
            <Text style={styles.stepDesc}>
              Mencari nilai terbaik (A+) dan terburuk (A-) untuk setiap kriteria. Untuk Benefit (Max = positif, Min = negatif), untuk Cost (Min = positif, Max = negatif).
            </Text>

            <View style={styles.tableWrapper}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.cellCode]}>Solusi</Text>
                <Text style={styles.tableHeaderCell}>y1 (PE)</Text>
                <Text style={styles.tableHeaderCell}>y2 (ROE)</Text>
                <Text style={styles.tableHeaderCell}>y3 (DER)</Text>
                <Text style={styles.tableHeaderCell}>y4 (DIV)</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.cellCode, styles.benefitColor, styles.textBold]}>A+ (Ideal+)</Text>
                {steps.ideal_solutions.positive.map((v, i) => (
                  <Text key={`pos-${i}`} style={[styles.tableCell, styles.benefitColor]}>{v.toFixed(4)}</Text>
                ))}
              </View>
              <View style={[styles.tableRow, styles.tableRowAlt]}>
                <Text style={[styles.tableCell, styles.cellCode, styles.costColor, styles.textBold]}>A- (Ideal-)</Text>
                {steps.ideal_solutions.negative.map((v, i) => (
                  <Text key={`neg-${i}`} style={[styles.tableCell, styles.costColor]}>{v.toFixed(4)}</Text>
                ))}
              </View>
            </View>

            <View style={styles.spaceDivider} />

            <Text style={styles.stepTitle}>Langkah 5 & 6: Menghitung Jarak Solusi (D+, D-) & Preferensi (V)</Text>
            <Text style={styles.stepDesc}>
              Menghitung jarak Euclidean setiap alternatif ke solusi ideal positif (D+) dan ideal negatif (D-). Nilai kedekatan preferensi dihitung sebagai V = D- / (D+ + D-).
            </Text>

            <View style={styles.tableWrapper}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.cellCode]}>Ticker</Text>
                <Text style={styles.tableHeaderCell}>Jarak D+</Text>
                <Text style={styles.tableHeaderCell}>Jarak D-</Text>
                <Text style={styles.tableHeaderCell}>Preferensi V</Text>
              </View>
              {steps.distances.map((dist, dIdx) => {
                const rankItem = ranking.find(r => r.id === dist.id);
                const score = rankItem ? rankItem.preference_score : 0;
                return (
                  <View key={`dist-${dIdx}`} style={[styles.tableRow, dIdx % 2 === 1 && styles.tableRowAlt]}>
                    <Text style={[styles.tableCell, styles.cellCode, styles.textBold]}>
                      {getStockCode(dIdx)}
                    </Text>
                    <Text style={styles.tableCell}>{dist.d_plus.toFixed(4)}</Text>
                    <Text style={styles.tableCell}>{dist.d_minus.toFixed(4)}</Text>
                    <Text style={[styles.tableCell, styles.textBold, styles.primaryColor]}>
                      {score.toFixed(4)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  header: {
    marginTop: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  tabContainer: {
    backgroundColor: '#161F30',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
    height: 48,
  },
  tabScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 16,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#3B82F6',
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#3B82F6',
  },
  contentScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  tabBody: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 16,
    marginBottom: 16,
  },
  tableWrapper: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F3F4F6',
    textAlign: 'center',
  },
  cellCode: {
    flex: 1.2,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  tableRowAlt: {
    backgroundColor: '#1E293B',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    alignSelf: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  spaceDivider: {
    height: 20,
  },
  benefitColor: {
    color: '#10B981',
  },
  costColor: {
    color: '#EF4444',
  },
  primaryColor: {
    color: '#3B82F6',
  },
});
