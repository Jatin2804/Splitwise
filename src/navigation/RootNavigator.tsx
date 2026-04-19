import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import EnrollmentScreen from '../screens/EnrollmentScreen';
import TabNavigator from './TabNavigator';
import { SCREEN_NAMES } from '../navigation';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={SCREEN_NAMES.MAIN_APP}>
      <Stack.Screen name={SCREEN_NAMES.WELCOME} component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name={SCREEN_NAMES.ENROLLMENT} component={EnrollmentScreen} />
      <Stack.Screen name={SCREEN_NAMES.MAIN_APP} component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
