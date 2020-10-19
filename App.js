import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import IntroScreen from './screens/intro';
import CaptureScreen from './screens/capture'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={IntroScreen}
          options={{
            title: 'Welcome',
            headerStyle: {
              backgroundColor: '#15151A',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen name="Profile" component={CaptureScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
