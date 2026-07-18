import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useStocks } from '../hooks/useStocks';
import { useAnalysis } from '../hooks/useAnalysis';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function WeightSetupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { stocks, isLoading: isStocksLoading } = useStocks();
  const { runAnalysis, isAnalyzing } = useAnalysis();

  // Selected stocks checklist state (default select all)
  const [selectedStockIds, setSelectedStockIds] = useState<number[]>([]);

  // Kriteria bobot (default 25% masing-masing)
  const [peWeight, setPeWeight] = useState(25);
  const [roeWeight, setRoeWeight] = useState(25);
  const [derWeight, setDerWeight] = useState(25);
  const [divWeight, setDivWeight] = useState(25);

  // Judul simulasi kustom
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (stocks.length > 0) {
      setSelectedStockIds(stocks.map((s: any) => s.id));
    }
  }, [stocks]);

  const totalWeight = peWeight + roeWeight + derWeight + divWeight;
  const isWeightValid = Math.abs(totalWeight - 100) < 0.001;
  const hasMinStocks = selectedStockIds.length >= 2;

  // Toggle selection saham
  const toggleStock = (id: number) => {
    setSelectedStockIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Jalankan perhitungan TOPSIS
  const handleCalculate = async () => {
    if (!isWeightValid) {
      Alert.alert('Peringatan', `Total bobot harus tepat 100%. Saat ini: ${totalWeight}%`);
      return;
    }

    if (!hasMinStocks) {
      Alert.alert('Peringatan', 'Pilih minimal 2 saham alternatif untuk dianalisis');
      return;
    }

    const payload = {
      title: title.trim() || `Analisis ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      stock_ids: selectedStockIds,
      weights: {
        pe_ratio: peWeight,
        roe: roeWeight,
        der: derWeight,
        dividend_yield: divWeight
      }
    };

    try {
      const result = await runAnalysis(payload);
      Alert.alert('Sukses', 'Perhitungan TOPSIS berhasil dieksekusi', [
        {
          text: 'Lihat Hasil',
          onPress: () => {
            navigation.navigate('AnalysisResults', { historyId: result.history_id });
          }
        }
      ]);
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengeksekusi analisis TOPSIS');
    }
  };

  if (isStocksLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Memuat parameter analisis...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Analisis TOPSIS</Text>
          <Text style={styles.subtitle}>Sesuaikan Kriteria & Pilih Alternatif Saham</Text>
        </View>

        {/* Bagian 1: Pengaturan Bobot */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Bobot Kriteria (Wajib Total 100%)</Text>
          <View style={styles.divider} />

          {/* PE Ratio Slider */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderLabel}>PE Ratio (Cost / Minimasi)</Text>
              <Text style={styles.sliderValue}>{peWeight}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={5}
              value={peWeight}
              onValueChange={v => setPeWeight(Math.round(v))}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#1F2937"
              thumbTintColor="#3B82F6"
            />
          </View>

          {/* ROE Slider */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderLabel}>Return on Equity (Benefit / Maksimasi)</Text>
              <Text style={styles.sliderValue}>{roeWeight}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={5}
              value={roeWeight}
              onValueChange={v => setRoeWeight(Math.round(v))}
              minimumTrackTintColor="#10B981"
              maximumTrackTintColor="#1F2937"
              thumbTintColor="#10B981"
            />
          </View>

          {/* DER Slider */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderLabel}>Debt to Equity Ratio (Cost / Minimasi)</Text>
              <Text style={styles.sliderValue}>{derWeight}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={5}
              value={derWeight}
              onValueChange={v => setDerWeight(Math.round(v))}
              minimumTrackTintColor="#EF4444"
              maximumTrackTintColor="#1F2937"
              thumbTintColor="#EF4444"
            />
          </View>

          {/* Dividend Yield Slider */}
          <View style={styles.sliderGroup}>
            <View style={styles.sliderLabelRow}>
              <Text style={styles.sliderLabel}>Dividend Yield (Benefit / Maksimasi)</Text>
              <Text style={styles.sliderValue}>{divWeight}%</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={5}
              value={divWeight}
              onValueChange={v => setDivWeight(Math.round(v))}
              minimumTrackTintColor="#10B981"
              maximumTrackTintColor="#1F2937"
              thumbTintColor="#10B981"
            />
          </View>

          {/* Weight Indicator Status */}
          <View
            style={[
              styles.weightStatusCard,
              isWeightValid ? styles.statusValidBg : styles.statusInvalidBg
            ]}
          >
            <Text
              style={[
                styles.weightStatusText,
                isWeightValid ? styles.statusValidText : styles.statusInvalidText
              ]}
            >
              {isWeightValid
                ? '✅ TOTAL BOBOT PAS 100%'
                : `⚠️ TOTAL BOBOT HARUS 100% (Saat ini: ${totalWeight}%)`}
            </Text>
          </View>
        </View>

        {/* Bagian 2: Checklist Saham */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Alternatif Saham Terpilih</Text>
          <Text style={styles.sectionDesc}>Pilih saham fundamental yang ingin dibandingkan (min. 2):</Text>
          <View style={styles.divider} />

          {stocks.length > 0 ? (
            <View style={styles.checkboxGrid}>
              {stocks.map((stock: any) => {
                const isSelected = selectedStockIds.includes(stock.id);
                return (
                  <Pressable
                    key={stock.id}
                    style={[styles.checkboxItem, isSelected && styles.checkboxItemActive]}
                    onPress={() => toggleStock(stock.id)}
                  >
                    <Text
                      style={[
                        styles.checkboxCode,
                        isSelected ? styles.checkboxCodeActive : styles.checkboxCodeInactive
                      ]}
                    >
                      {stock.code}
                    </Text>
                    <Text
                      style={[
                        styles.checkboxName,
                        isSelected ? styles.checkboxNameActive : styles.checkboxNameInactive
                      ]}
                      numberOfLines={1}
                    >
                      {stock.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>Data saham kosong. Harap isi data terlebih dahulu di tab Kelola Saham.</Text>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.calculateBtn,
            (!isWeightValid || !hasMinStocks) && styles.calculateBtnDisabled,
            pressed && isWeightValid && hasMinStocks && { transform: [{ scale: 0.98 }], opacity: 0.9 }
          ]}
          onPress={handleCalculate}
          disabled={!isWeightValid || !hasMinStocks || isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator size="small" color="#F3F4F6" />
          ) : (
            <Text style={styles.calculateBtnText}>HITUNG PERINGKAT SAHAM</Text>
          )}
        </Pressable>
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
  header: {
    marginTop: 24,
    marginBottom: 20,
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
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 12,
  },
  sliderGroup: {
    marginBottom: 16,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  weightStatusCard: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  statusValidBg: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusInvalidBg: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  weightStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusValidText: {
    color: '#10B981',
  },
  statusInvalidText: {
    color: '#EF4444',
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkboxItem: {
    width: '48%',
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    padding: 10,
  },
  checkboxItemActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  checkboxCode: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxCodeActive: {
    color: '#3B82F6',
  },
  checkboxCodeInactive: {
    color: '#9CA3AF',
  },
  checkboxName: {
    fontSize: 10,
    marginTop: 2,
  },
  checkboxNameActive: {
    color: '#F3F4F6',
  },
  checkboxNameInactive: {
    color: '#9CA3AF',
  },
  emptyText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontSize: 12,
  },
  calculateBtn: {
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  calculateBtnDisabled: {
    backgroundColor: '#1F2937',
    opacity: 0.5,
  },
  calculateBtnText: {
    color: '#F3F4F6',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
