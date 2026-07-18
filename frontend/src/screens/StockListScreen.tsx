import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { useStocks, StockData } from '../hooks/useStocks';
import * as DocumentPicker from 'expo-document-picker';

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

  // Modal form states
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);

  // Form input states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [peRatio, setPeRatio] = useState('');
  const [roe, setRoe] = useState('');
  const [der, setDer] = useState('');
  const [dividendYield, setDividendYield] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Handle open modal for create
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedStockId(null);
    setCode('');
    setName('');
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
    if (!code || !name || !peRatio || !roe || !der || !dividendYield) {
      Alert.alert('Peringatan', 'Harap isi semua kolom input');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
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
      
      // Di React Native, kirim file via FormData dengan interface berikut
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream'
      } as any);

      await importStocks(formData);
      Alert.alert('Sukses', 'Berhasil mengimpor data saham dari file');
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengimpor file data saham');
    }
  };

  // Handle sync financial data otomatis
  const handleSyncData = async () => {
    try {
      await syncStocks();
      Alert.alert('Sukses', 'Data fundamental saham LQ45 berhasil diperbarui');
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal melakukan sinkronisasi data');
    }
  };

  // Filter stocks based on query search
  const filteredStocks = stocks.filter(
    (s: StockData) =>
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kelola Saham</Text>
        <Text style={styles.subtitle}>Daftar Alternatif Saham Indeks LQ45</Text>
      </View>

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

      <TextInput
        style={styles.searchInput}
        placeholder="Cari berdasarkan kode atau nama..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading ? (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Memuat daftar saham...</Text>
        </View>
      ) : filteredStocks.length > 0 ? (
        <FlatList
          data={filteredStocks}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.stockCard}>
              <View style={styles.stockCardHeader}>
                <View>
                  <Text style={styles.stockCode}>{item.code}</Text>
                  <Text style={styles.stockName}>{item.name}</Text>
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
          )}
        />
      ) : (
        <View style={styles.emptyArea}>
          <Text style={styles.emptyText}>Data saham kosong atau tidak ditemukan.</Text>
        </View>
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
    height: 44, // Target sentuh minimal
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
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
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
