import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function WeightSetupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atur Bobot</Text>
        <Text style={styles.subtitle}>Sesuaikan Bobot Kriteria TOPSIS (Wajib 100%)</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Slider pengaturan bobot kriteria akan ditampilkan di sini.</Text>
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
