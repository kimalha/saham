import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import TabNavigator from './tab.navigator';
import AnalysisResultsScreen from '../screens/AnalysisResultsScreen';
import CalculationDetailsScreen from '../screens/CalculationDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B0F19' }
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="AnalysisResults" component={AnalysisResultsScreen} />
      <Stack.Screen name="CalculationDetails" component={CalculationDetailsScreen} />
    </Stack.Navigator>
  );
}
