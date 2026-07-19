import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert as RNAlert,
  TextInput,
  Platform
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useStocks } from '../hooks/useStocks';
import { useAnalysis } from '../hooks/useAnalysis';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// Polyfill Alert untuk Web agar tidak silent no-op
const Alert = {
  alert: (title: string, message?: string, buttons?: any[]) => {
    if (Platform.OS === 'web') {
      const msg = message ? `${title}\n\n${message}` : title;
      if (buttons && buttons.length > 0) {
        const confirmBtn = buttons.find(b => b.style === 'destructive' || b.text === 'Hapus' || b.text === 'OK');
        const cancelBtn = buttons.find(b => b.style === 'cancel' || b.text === 'Batal');
        const result = window.confirm(msg);
        if (result && confirmBtn && typeof confirmBtn.onPress === 'function') {
          confirmBtn.onPress();
        } else if (!result && cancelBtn && typeof cancelBtn.onPress === 'function') {
          cancelBtn.onPress();
        }
      } else {
        window.alert(msg);
      }
    } else {
      RNAlert.alert(title, message, buttons);
    }
  }
};

export default function WeightSetupScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { stocks, isLoading: isStocksLoading } = useStocks();
  const { runAnalysis, isAnalyzing } = useAnalysis();

  // Selected stocks state
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<any[]>([]);

  // Kriteria bobot (default 25% masing-masing)
  const [peWeight, setPeWeight] = useState(25);
  const [roeWeight, setRoeWeight] = useState(25);
  const [derWeight, setDerWeight] = useState(25);
  const [divWeight, setDivWeight] = useState(25);

  // Judul simulasi kustom
  const [title, setTitle] = useState('');

  const totalWeight = peWeight + roeWeight + derWeight + divWeight;
  const isWeightValid = Math.abs(totalWeight - 100) < 0.001;
  const hasMinStocks = selectedStocks.length >= 2;

  // Mendapatkan daftar semua sektor unik secara dinamis dari database
  const availableSectors = Array.from(new Set(stocks.map((s: any) => s.sector || 'Lainnya'))).sort();

  // Memfilter saham berdasarkan sektor yang dipilih
  const stocksInSelectedSectors = stocks.filter(stock => 
    selectedSectors.length > 0 && selectedSectors.includes(stock.sector || 'Lainnya')
  );

  // Memfilter saham berdasarkan pencarian nama/kode di dalam sektor terpilih (Opsional)
  const filteredSearchStocks = stocksInSelectedSectors.filter(stock => {
    const matchesSearch = stock.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Toggle pilihan sektor
  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => {
      const nextSectors = prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector];
      
      // Bersihkan selectedStocks yang tidak lagi termasuk dalam sektor terpilih
      const updatedSelectedStocks = selectedStocks.filter(stock => 
        nextSectors.includes(stock.sector || 'Lainnya')
      );
      setSelectedStocks(updatedSelectedStocks);
      
      return nextSectors;
    });
  };

  // Jalankan perhitungan TOPSIS
  const handleCalculate = async () => {
    if (!isWeightValid) {
      Alert.alert('Peringatan', `Total bobot harus tepat 100%. Saat ini: ${totalWeight}%`);
      return;
    }

    if (selectedStocks.length < 2) {
      Alert.alert('Peringatan', 'Pilih minimal 2 saham alternatif untuk dianalisis');
      return;
    }

    const payload = {
      title: title.trim() || `Analisis ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      stock_ids: selectedStocks.map(s => s.id),
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

        {/* Bagian 2: Pemilihan Alternatif Saham */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Pilih Alternatif Saham</Text>
          <Text style={styles.sectionDesc}>Filter berdasarkan sektor, lalu pilih saham yang ingin dibandingkan (min. 2)</Text>
          <View style={styles.divider} />

          {stocks.length > 0 ? (
            <View style={styles.stepContainer}>
              
              {/* LANGKAH 1: PILIH SEKTOR */}
              <View style={styles.stepBlock}>
                <Text style={styles.stepLabel}>Langkah 1: Pilih Sektor Saham</Text>
                <View style={styles.sectorGrid}>
                  {availableSectors.map(sector => {
                    const isChecked = selectedSectors.includes(sector);
                    return (
                      <Pressable
                        key={sector}
                        style={[
                          styles.sectorCheckboxItem,
                          isChecked && styles.sectorCheckboxItemActive
                        ]}
                        onPress={() => toggleSector(sector)}
                      >
                        <Text style={[styles.checkboxBox, isChecked && styles.checkboxBoxActive]}>
                          {isChecked ? '✓' : ' '}
                        </Text>
                        <Text style={[styles.sectorText, isChecked && styles.sectorTextActive]}>
                          {sector}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* LANGKAH 2: DAFTAR SAHAM & SEARCH */}
              <View style={styles.stepBlock}>
                <View style={styles.selectedHeaderRow}>
                  <Text style={styles.stepLabel}>Langkah 2: Pilih Saham Alternatif</Text>
                  {selectedStocks.length > 0 && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{selectedStocks.length} Terpilih</Text>
                    </View>
                  )}
                </View>

                {selectedSectors.length > 0 ? (
                  <View style={styles.stocksSelectionArea}>
                    {/* Search box (Filter Tambahan) */}
                    <TextInput
                      style={styles.searchInputCompact}
                      placeholder="🔍 Cari kode atau nama saham (Opsional)..."
                      placeholderTextColor="#9CA3AF"
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                      autoCapitalize="characters"
                    />

                    {/* Horizontal Selected Chips */}
                    {selectedStocks.length > 0 && (
                      <View style={styles.selectedChipsWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedChipsScroll}>
                          {selectedStocks.map(stock => (
                            <Pressable
                              key={stock.id}
                              style={styles.selectedChip}
                              onPress={() => setSelectedStocks(selectedStocks.filter(s => s.id !== stock.id))}
                            >
                              <Text style={styles.selectedChipText}>{stock.code}</Text>
                              <Text style={styles.selectedChipClose}>✕</Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* Stock list */}
                    <View style={styles.stockItemGrid}>
                      {filteredSearchStocks.length > 0 ? (
                        filteredSearchStocks.map(stock => {
                          const isSelected = selectedStocks.some(s => s.id === stock.id);
                          return (
                            <Pressable
                              key={stock.id}
                              style={[
                                styles.stockItemRow,
                                isSelected && styles.stockItemRowActive
                              ]}
                              onPress={() => {
                                if (isSelected) {
                                  setSelectedStocks(selectedStocks.filter(s => s.id !== stock.id));
                                } else {
                                  setSelectedStocks([...selectedStocks, stock]);
                                }
                              }}
                            >
                              <View style={styles.stockItemLeft}>
                                <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleActive]}>
                                  {isSelected && <Text style={styles.checkboxCheckText}>✓</Text>}
                                </View>
                                <View style={styles.stockItemTextWrapper}>
                                  <Text style={styles.stockItemCode}>{stock.code}</Text>
                                  <Text style={styles.stockItemName} numberOfLines={1}>{stock.name}</Text>
                                  <Text style={styles.stockItemSector}>Sektor: {stock.sector}</Text>
                                </View>
                              </View>
                            </Pressable>
                          );
                        })
                      ) : (
                        <Text style={styles.noResultsText}>Tidak ada saham yang cocok di sektor terpilih</Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.sectorWarningCard}>
                    <Text style={styles.sectorWarningText}>
                      ⚠️ Silakan pilih minimal satu sektor di Langkah 1 untuk menampilkan daftar saham.
                    </Text>
                  </View>
                )}
              </View>

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
  stepContainer: {
    gap: 16,
  },
  stepBlock: {
    gap: 8,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sectorCheckboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  sectorCheckboxItemActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  checkboxBox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    borderRadius: 3,
    textAlign: 'center',
    lineHeight: 12,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  checkboxBoxActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  sectorText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  sectorTextActive: {
    color: '#F3F4F6',
    fontWeight: '500',
  },
  selectedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#F3F4F6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stocksSelectionArea: {
    gap: 8,
  },
  searchInputCompact: {
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 10,
    color: '#F3F4F6',
    fontSize: 13,
  },
  selectedChipsWrapper: {
    height: 34,
    justifyContent: 'center',
  },
  selectedChipsScroll: {
    gap: 6,
    alignItems: 'center',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 6,
  },
  selectedChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
  },
  selectedChipClose: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  stockItemGrid: {
    gap: 6,
    marginTop: 4,
  },
  stockItemRow: {
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    padding: 10,
  },
  stockItemRowActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },
  stockItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleActive: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  checkboxCheckText: {
    color: '#0B0F19',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  stockItemTextWrapper: {
    flex: 1,
  },
  stockItemCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  stockItemName: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  stockItemSector: {
    fontSize: 9,
    color: '#3B82F6',
    marginTop: 1,
  },
  noResultsText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  sectorWarningCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sectorWarningText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
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
