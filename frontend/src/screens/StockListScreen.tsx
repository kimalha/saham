import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function StockListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kelola Saham</Text>
        <Text style={styles.subtitle}>Daftar Alternatif Saham Indeks LQ45</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Data saham akan ditampilkan di sini.</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
