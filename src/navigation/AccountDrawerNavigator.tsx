import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AccountScreen from '../screens/AccountScreen';
import EmailDetailsScreen from '../screens/EmailDetailsScreen';
import LogoutLoginScreen from '../screens/LogoutLoginScreen';
import { SCREEN_NAMES } from '../navigation';

const Drawer = createDrawerNavigator();

const AccountDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName={SCREEN_NAMES.ACCOUNT}>
      <Drawer.Screen name={SCREEN_NAMES.ACCOUNT} component={AccountScreen} />
      <Drawer.Screen name={SCREEN_NAMES.EMAIL_DETAILS} component={EmailDetailsScreen} options={{ title: 'Email Details' }} />
      <Drawer.Screen name={SCREEN_NAMES.LOGOUT_LOGIN} component={LogoutLoginScreen} options={{ title: 'Logout / Login' }} />
    </Drawer.Navigator>
  );
};

export default AccountDrawerNavigator;
