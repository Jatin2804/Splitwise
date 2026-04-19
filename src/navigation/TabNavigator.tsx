import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GroupsScreen from '../screens/GroupsScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AccountScreen from '../screens/AccountScreen';
import { SCREEN_NAMES } from '../navigation';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={SCREEN_NAMES.GROUPS} component={GroupsScreen} />
      <Tab.Screen name={SCREEN_NAMES.FRIENDS} component={FriendsScreen} />
      <Tab.Screen name={SCREEN_NAMES.ACTIVITY} component={ActivityScreen} />
      <Tab.Screen
        name={SCREEN_NAMES.ACCOUNT}
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
