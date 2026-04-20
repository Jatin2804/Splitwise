import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import EnrollmentScreen from '../screens/EnrollmentScreen';
import EmailDetailsScreen from '../screens/EmailDetailsScreen';
import LogoutLoginScreen from '../screens/LogoutLoginScreen';
import TabNavigator from './TabNavigator';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupDetailsScreen from '../screens/GroupDetailsScreen';
import AddMembersScreen from '../screens/AddMembersScreen';
import { SCREEN_NAMES } from '../navigation';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={SCREEN_NAMES.WELCOME}>
      <Stack.Screen name={SCREEN_NAMES.WELCOME} component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name={SCREEN_NAMES.ENROLLMENT} component={EnrollmentScreen} />
      <Stack.Screen name={SCREEN_NAMES.MAIN_APP} component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name={SCREEN_NAMES.EMAIL_DETAILS} component={EmailDetailsScreen} options={{ title: 'Email Details' }} />
      <Stack.Screen name={SCREEN_NAMES.LOGOUT_LOGIN} component={LogoutLoginScreen} options={{ title: 'Logout / Login' }} />
      <Stack.Screen name={SCREEN_NAMES.CREATE_GROUP} component={CreateGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name={SCREEN_NAMES.GROUP_DETAILS} component={GroupDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name={SCREEN_NAMES.ADD_MEMBERS} component={AddMembersScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
