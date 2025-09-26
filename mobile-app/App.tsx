// App.tsx
// Main application entry point with navigation

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStackParamList } from './src/types';
import TimelineScreen from './src/screens/TimelineScreen';
import MovementDetailScreen from './src/screens/MovementDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Timeline">
          <Stack.Screen
            name="Timeline"
            component={TimelineScreen}
            options={{
              title: 'Art Timeline',
              headerStyle: {
                backgroundColor: '#f5f5f5',
              },
              headerTintColor: '#333',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
            initialParams={{ contextId: 'european-art' }}
          />
          <Stack.Screen
            name="MovementDetail"
            component={MovementDetailScreen}
            options={{
              title: 'Movement Details',
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#333',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
