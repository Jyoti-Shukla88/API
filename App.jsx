import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { store, persistor } from './src/redux/store';
import AppLoader from './src/AppLoader';
import HomeScreen from './src/screens/HomeScreen';
import LandingScreen from './src/screens/LandingScreen';
import GuideLinesScreen from './src/screens/GuideLinesScreen'; // double-check file name: 'GuidelinesScreen' not 'GuideLinesScreen'
import TerminologyScreen from './src/screens/TerminologyScreen';
import ReportScreen from './src/screens/ReportScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {!loaded ? (
          <AppLoader onFinish={() => setLoaded(true)} />
        ) : (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: true }}>
              <Stack.Screen name="Landing" component={LandingScreen} options={{ title: 'WHO Toolkit' }} />
            { /* <Stack.Screen name="HomeScreen"        component={HomeScreen} options={{ title: 'Home' }} />
              <Stack.Screen name="GuideLinesScreen"  component={GuideLinesScreen} options={{ title: 'Guidelines' }} />*/}
              <Stack.Screen name="TerminologyScreen" component={TerminologyScreen} options={{ title: 'Terminology' }} />
              <Stack.Screen name="ReportScreen" component={ReportScreen} options={{ title: 'Malaria Report' }} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </PersistGate>
    </Provider>
  );
}
