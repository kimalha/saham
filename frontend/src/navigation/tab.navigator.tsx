import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import DashboardScreen from '../screens/DashboardScreen';
import StockListScreen from '../screens/StockListScreen';
import WeightSetupScreen from '../screens/WeightSetupScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom helper function to render simple text icon fallback
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: focused ? '#3B82F6' : '#9CA3AF', fontSize: 10, fontWeight: focused ? 'bold' : 'normal' }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#161F30',
          borderTopWidth: 1,
          borderTopColor: '#1F2937',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="StockList"
        component={StockListScreen}
        options={{
          tabBarLabel: 'Saham',
          tabBarIcon: ({ focused }) => <TabIcon label="📈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="WeightSetup"
        component={WeightSetupScreen}
        options={{
          tabBarLabel: 'Analisis',
          tabBarIcon: ({ focused }) => <TabIcon label="⚖️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Riwayat',
          tabBarIcon: ({ focused }) => <TabIcon label="🕒" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
