import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function CalculationDetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Detail Perhitungan</Text>
        <Text style={styles.subtitle}>Transparansi 7 Langkah TOPSIS</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Tabel langkah-langkah matriks perhitungan TOPSIS akan ditampilkan di sini.</Text>
      </View>
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>KEMBALI</Text>
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
  footer: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#161F30',
    borderWidth: 1,
    borderColor: '#1F2937',
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
