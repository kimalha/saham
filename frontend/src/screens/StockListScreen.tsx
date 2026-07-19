import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert as RNAlert,
  Platform,
  useWindowDimensions,
  ScrollView
} from 'react-native';
import { useStocks, StockData } from '../hooks/useStocks';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

// Helper resolver untuk ikon sektor
const getSectorIcon = (sectorName: string): any => {
  const name = sectorName.toLowerCase().trim();
  if (name.includes('bank') || name.includes('keuangan')) return 'bank';
  if (name.includes('energi') || name.includes('tenaga')) return 'lightning-bolt';
  if (name.includes('teknologi') || name.includes('digital')) return 'laptop';
  if (name.includes('infra') || name.includes('konstruksi') || name.includes('semen')) return 'crane';
  if (name.includes('properti') || name.includes('real')) return 'home-city';
  if (name.includes('transport') || name.includes('logistik')) return 'car';
  if (name.includes('industri')) return 'factory';
  if (name.includes('barang konsumen primer') || name.includes('primer')) return 'cart';
  if (name.includes('barang konsumen non primer') || name.includes('non primer') || name.includes('ritel')) return 'shopping';
  if (name.includes('sehat') || name.includes('medis') || name.includes('kesehatan')) return 'pill';
  if (name.includes('telekomunikasi') || name.includes('komunikasi') || name.includes('telko')) return 'transmission-tower';
  if (name.includes('tambang') || name.includes('mineral') || name.includes('emas') || name.includes('batu')) return 'pickaxe';
  return 'domain';
};

export default function StockListScreen() {
  const {
    stocks,
    isLoading,
    createStock,
    isCreating,
    updateStock,
    isUpdating,
    deleteStock,
    isDeleting,
    importStocks,
    isImporting,
    syncStocks,
    isSyncing
  } = useStocks();

  const { width } = useWindowDimensions();

  // Navigation state untuk Sektor
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Modal form states
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

  // Form input states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [peRatio, setPeRatio] = useState('');
  const [roe, setRoe] = useState('');
  const [der, setDer] = useState('');
  const [dividendYield, setDividendYield] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Hitung jumlah kolom responsif untuk Grid
  const cardWidth = width > 1024 ? '23.5%' : width > 768 ? '31%' : '48%';

  // Mengelompokkan data saham berdasarkan sektor dan menghitung jumlah sahamnya
  const sectorsData = useMemo(() => {
    const groups: { [key: string]: number } = {};
    stocks.forEach((s: StockData) => {
      const sec = s.sector || 'Lainnya';
      groups[sec] = (groups[sec] || 0) + 1;
    });

    return Object.keys(groups).map(name => ({
      name,
      count: groups[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [stocks]);

  // Filter sektor di halaman utama
  const filteredSectors = useMemo(() => {
    return sectorsData.filter(sec => 
      sec.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sectorsData, searchQuery]);

  // Cari saham global (jika user mencari kode/nama saham dari halaman utama)
  const matchedStocks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return stocks.filter(s => 
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stocks, searchQuery]);

  // Saham yang berada di dalam sektor terpilih (jika ada sektor yang aktif)
  const stocksInSelectedSector = useMemo(() => {
    if (!selectedSector) return [];
    return stocks.filter(s => (s.sector || 'Lainnya') === selectedSector);
  }, [stocks, selectedSector]);

  // Filter saham di dalam sektor terpilih berdasarkan search query
  const filteredStocksInSector = useMemo(() => {
    return stocksInSelectedSector.filter(s =>
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stocksInSelectedSector, searchQuery]);

  // Handle open modal for create
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedStockId(null);
    setCode('');
    setName('');
    setSector(selectedSector || '');
    setPeRatio('');
    setRoe('');
    setDer('');
    setDividendYield('');
    setModalVisible(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (stock: StockData) => {
    setIsEditMode(true);
    setSelectedStockId(stock.id);
    setCode(stock.code);
    setName(stock.name);
    setSector(stock.sector || '');
    setPeRatio(stock.pe_ratio.toString());
    setRoe(stock.roe.toString());
    setDer(stock.der.toString());
    setDividendYield(stock.dividend_yield.toString());
    setModalVisible(true);
  };

  // Handle delete stock alternative
  const handleDelete = (stock: StockData) => {
    Alert.alert(
      'Hapus Saham',
      `Apakah Anda yakin ingin menghapus data saham "${stock.code}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStock(stock.id);
              Alert.alert('Sukses', 'Data saham berhasil dihapus');
            } catch (err: any) {
              Alert.alert('Gagal', err.response?.data?.message || 'Gagal menghapus data saham');
            }
          }
        }
      ]
    );
  };

  // Handle submit form
  const handleSubmit = async () => {
    if (!code || !name || !sector || !peRatio || !roe || !der || !dividendYield) {
      Alert.alert('Peringatan', 'Harap isi semua kolom input');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      sector: sector.trim(),
      pe_ratio: parseFloat(peRatio),
      roe: parseFloat(roe),
      der: parseFloat(der),
      dividend_yield: parseFloat(dividendYield)
    };

    if (
      isNaN(payload.pe_ratio) ||
      isNaN(payload.roe) ||
      isNaN(payload.der) ||
      isNaN(payload.dividend_yield)
    ) {
      Alert.alert('Peringatan', 'Rasio fundamental keuangan harus berupa angka');
      return;
    }

    try {
      if (isEditMode && selectedStockId !== null) {
        await updateStock({ id: selectedStockId, data: payload });
        Alert.alert('Sukses', 'Data saham berhasil diperbarui');
      } else {
        await createStock(payload);
        Alert.alert('Sukses', 'Data saham berhasil ditambahkan');
      }
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal menyimpan data saham');
    }
  };

  // Handle import file Excel/CSV
  const handleImportFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
          'text/comma-separated-values'
        ]
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];
      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        const rawFile = (file as any).file || file;
        formData.append('file', rawFile);
      } else {
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream'
        } as any);
      }

      await importStocks(formData);
      Alert.alert('Sukses', 'Berhasil mengimpor data saham dari file');
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengimpor file data saham');
    }
  };

  // Handle sync financial data otomatis
  const handleSyncData = async () => {
    try {
      const res = await syncStocks();
      Alert.alert('Sukses', res.message || 'Data fundamental saham LQ45 berhasil diperbarui');
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal melakukan sinkronisasi data');
    }
  };

  // Komponen Kartu Saham yang digunakan kembali
  const renderStockCard = (item: StockData) => {
    const isSearchMatch = searchQuery.trim().length > 0 && 
      item.code.toLowerCase() === searchQuery.toLowerCase().trim();

    return (
      <View key={item.id} style={[styles.stockCard, isSearchMatch && styles.highlightedCard]}>
        <View style={styles.stockCardHeader}>
          <View>
            <Text style={styles.stockCode}>{item.code}</Text>
            <Text style={styles.stockName}>{item.name}</Text>
            <Text style={styles.stockSector}>Sektor: {item.sector || 'Lainnya'}</Text>
          </View>
          <View style={styles.cardActions}>
            <Pressable
              style={styles.editBtn}
              onPress={() => handleOpenEdit(item)}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
              disabled={isDeleting}
            >
              <Text style={styles.deleteBtnText}>Hapus</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.ratiosGrid}>
          <View style={styles.ratioItem}>
            <Text style={styles.ratioLabel}>PE Ratio</Text>
            <Text style={[styles.ratioValue, styles.costColor]}>
              {item.pe_ratio.toFixed(2)}x
            </Text>
          </View>
          <View style={styles.ratioItem}>
            <Text style={styles.ratioLabel}>ROE</Text>
            <Text style={[styles.ratioValue, styles.benefitColor]}>
              {item.roe.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.ratioItem}>
            <Text style={styles.ratioLabel}>DER</Text>
            <Text style={[styles.ratioValue, styles.costColor]}>
              {item.der.toFixed(2)}x
            </Text>
          </View>
          <View style={styles.ratioItem}>
            <Text style={styles.ratioLabel}>Div Yield</Text>
            <Text style={[styles.ratioValue, styles.benefitColor]}>
              {item.dividend_yield.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kelola Saham</Text>
        <Text style={styles.subtitle}>Alternatif Saham Indeks LQ45 Berbasis Sektor</Text>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressedBtn]}
          onPress={handleOpenCreate}
        >
          <Text style={styles.actionBtnText}>➕ Tambah</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressedBtn]}
          onPress={handleImportFile}
          disabled={isImporting}
        >
          {isImporting ? (
            <ActivityIndicator size="small" color="#F3F4F6" />
          ) : (
            <Text style={styles.actionBtnText}>📥 Impor File</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressedBtn]}
          onPress={handleSyncData}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#F3F4F6" />
          ) : (
            <Text style={styles.actionBtnText}>🔄 Sinkronisasi</Text>
          )}
        </Pressable>
      </View>

      {/* Kolom Pencarian */}
      <TextInput
        style={styles.searchInput}
        placeholder={selectedSector ? `Cari saham di sektor ${selectedSector}...` : "Cari sektor, kode saham, atau nama perusahaan..."}
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Memuat data saham...</Text>
        </View>
      ) : selectedSector !== null ? (
        // ==========================================
        // TAMPILAN 2: DAFTAR SAHAM DALAM SEKTOR TERPILIH
        // ==========================================
        <View style={styles.sectorViewContainer}>
          {/* Breadcrumb dan Navigasi */}
          <View style={styles.breadcrumbRow}>
            <Pressable 
              style={({ pressed }) => [styles.backBtn, pressed && styles.pressedBtn]} 
              onPress={() => {
                setSelectedSector(null);
                setSearchQuery('');
              }}
            >
              <Text style={styles.backBtnText}>← Kembali ke Daftar Sektor</Text>
            </Pressable>
            <Text style={styles.breadcrumbText}>
              Kelola Saham &gt; <Text style={styles.breadcrumbActive}>{selectedSector}</Text>
            </Text>
          </View>

          {filteredStocksInSector.length > 0 ? (
            <FlatList
              data={filteredStocksInSector}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => renderStockCard(item)}
            />
          ) : (
            <View style={styles.emptyArea}>
              <Text style={styles.emptyText}>Tidak ada data saham di sektor ini.</Text>
            </View>
          )}
        </View>
      ) : (
        // ==========================================
        // TAMPILAN 1: GRID DAFTAR SEKTOR (HALAMAN AWAL)
        // ==========================================
        <ScrollView contentContainerStyle={styles.sectorsScroll}>
          {searchQuery.trim().length > 0 ? (
            // Sub-Tampilan: Hasil Pencarian Global (Sektor + Saham Terkait)
            <View style={styles.searchContainer}>
              
              {/* Saham yang Cocok */}
              {matchedStocks.length > 0 && (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Saham Terkait ({matchedStocks.length})</Text>
                  <View style={styles.listContainer}>
                    {matchedStocks.map(item => renderStockCard(item))}
                  </View>
                </View>
              )}

              {/* Sektor yang Cocok */}
              {filteredSectors.length > 0 ? (
                <View style={styles.searchSection}>
                  <Text style={styles.searchSectionTitle}>Sektor Terkait ({filteredSectors.length})</Text>
                  <View style={styles.sectorGrid}>
                    {filteredSectors.map(item => (
                      <Pressable
                        key={item.name}
                        style={({ pressed }) => [
                          styles.sectorCard,
                          { width: cardWidth },
                          pressed && styles.pressedBtn
                        ]}
                        onPress={() => setSelectedSector(item.name)}
                      >
                        <View style={styles.sectorIconWrapper}>
                          <MaterialCommunityIcons 
                            name={getSectorIcon(item.name)} 
                            size={24} 
                            color="#3B82F6" 
                          />
                        </View>
                        <Text style={styles.sectorName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.sectorStockCount}>{item.count} Saham</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : matchedStocks.length === 0 ? (
                <View style={styles.emptyArea}>
                  <Text style={styles.emptyText}>Tidak ada sektor atau saham yang cocok.</Text>
                </View>
              ) : null}

            </View>
          ) : (
            // Tampilan Normal: Grid Semua Sektor
            <View style={styles.sectorGrid}>
              {sectorsData.length > 0 ? (
                sectorsData.map(item => (
                  <Pressable
                    key={item.name}
                    style={({ pressed }) => [
                      styles.sectorCard,
                      { width: cardWidth },
                      pressed && styles.pressedBtn
                    ]}
                    onPress={() => setSelectedSector(item.name)}
                  >
                    <View style={styles.sectorIconWrapper}>
                      <MaterialCommunityIcons 
                        name={getSectorIcon(item.name)} 
                        size={28} 
                        color="#3B82F6" 
                      />
                    </View>
                    <Text style={styles.sectorCardTitle} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.sectorCardStockCount}>{item.count} Saham</Text>
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyArea}>
                  <Text style={styles.emptyText}>Data saham kosong. Silakan tambah data atau jalankan sinkronisasi.</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Modal Dialog Form Tambah/Edit */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Alternatif Saham' : 'Tambah Alternatif Saham'}
            </Text>
            <View style={styles.modalDivider} />

            <Text style={styles.inputLabel}>Kode Ticker Saham</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Contoh: BBCA"
              placeholderTextColor="#9CA3AF"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              editable={!isEditMode}
            />

            <Text style={styles.inputLabel}>Nama Perusahaan</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Contoh: Bank Central Asia Tbk."
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Sektor Saham</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Contoh: Perbankan, Teknologi, Energi, dll."
              placeholderTextColor="#9CA3AF"
              value={sector}
              onChangeText={setSector}
            />

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.inputLabel}>PE Ratio (Cost)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Contoh: 15.5"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={peRatio}
                  onChangeText={setPeRatio}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.inputLabel}>ROE % (Benefit)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Contoh: 18.2"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={roe}
                  onChangeText={setRoe}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.inputLabel}>DER (Cost)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Contoh: 0.8"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={der}
                  onChangeText={setDer}
                />
              </View>
              <View style={styles.formCol}>
                <Text style={styles.inputLabel}>Div Yield % (Benefit)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Contoh: 4.5"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={dividendYield}
                  onChangeText={setDividendYield}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Batal</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalSubmitBtn]}
                onPress={handleSubmit}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
                  <ActivityIndicator size="small" color="#F3F4F6" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Simpan</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedBtn: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  searchInput: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
    color: '#F3F4F6',
    fontSize: 14,
    marginBottom: 16,
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
  sectorsScroll: {
    paddingBottom: 32,
  },
  sectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-start',
  },
  sectorCard: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    minHeight: 120,
  },
  sectorIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0B0F19',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sectorCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F3F4F6',
    textAlign: 'center',
    marginTop: 4,
  },
  sectorCardStockCount: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  sectorViewContainer: {
    flex: 1,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  backBtn: {
    backgroundColor: '#1F2937',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  backBtnText: {
    color: '#F3F4F6',
    fontSize: 12,
    fontWeight: '600',
  },
  breadcrumbText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  breadcrumbActive: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  stockCard: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  highlightedCard: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderWidth: 1.5,
  },
  stockCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stockCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  stockName: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    maxWidth: 180,
  },
  stockSector: {
    fontSize: 10,
    color: '#3B82F6',
    marginTop: 2,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  ratiosGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  ratioItem: {
    flex: 1,
    backgroundColor: '#0B0F19',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  ratioLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  ratioValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  costColor: {
    color: '#EF4444',
  },
  benefitColor: {
    color: '#10B981',
  },
  emptyArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  searchContainer: {
    gap: 16,
  },
  searchSection: {
    gap: 12,
  },
  searchSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginBottom: 4,
  },
  sectorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F3F4F6',
    textAlign: 'center',
    marginTop: 4,
  },
  sectorStockCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 16,
    width: '100%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginBottom: 10,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
    fontWeight: '600',
  },
  inputField: {
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
    color: '#F3F4F6',
    fontSize: 14,
    marginBottom: 14,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formCol: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: '#1F2937',
  },
  modalCancelBtnText: {
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  modalSubmitBtn: {
    backgroundColor: '#3B82F6',
  },
  modalSubmitBtnText: {
    color: '#F3F4F6',
    fontWeight: 'bold',
  },
});
