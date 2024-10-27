import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { InitializationProvider } from './src/contexts/InitializationContext';

export default function App() {
  return (
    <InitializationProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </InitializationProvider>
  );
}
