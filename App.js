// libraries
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';

// static dependencies
import IntroScreen from './screens/intro';
import RecordingScreen from './screens/recording';

// injected dependencies
import Depends from './lib/depends';
import ScanCamMock from './components/ScanCamMock';
import ScanCam from './components/ScanCam';
import Camera from './components/Camera';

Depends.register('qrScan', ScanCam);
Depends.register('recCam', Camera);

// navigation
const Stack = createStackNavigator();
const opts = {
  headerStyle: { backgroundColor: '#15151A' },
  headerTintColor: '#CCC',
  cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
}

// application
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={IntroScreen}
          options={{
            title: 'Welcome',
            ...opts
          }}
        />
        <Stack.Screen
          name="Profile"
          component={RecordingScreen}
          options={{...opts}}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
