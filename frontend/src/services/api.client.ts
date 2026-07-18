import axios from 'axios';
import { Platform } from 'react-native';

// Di emulator Android, localhost dipetakan ke 10.0.2.2.
// Untuk iOS / Web menggunakan 127.0.0.1.
// Jika menggunakan HP fisik via Expo Go, sesuaikan IP ini dengan IP lokal komputer Anda (misal: 192.168.1.5).
const getBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://127.0.0.1:5000/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
