import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
  // Mendeteksi IP lokal debugger host Metro Bundler (laptop host) secara otomatis.
  // Ini memungkinkan HP fisik terhubung langsung ke port 5000 tanpa ganti hardcode IP.
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000/api`;
  }

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
