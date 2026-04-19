import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GroupsScreen from '../screens/GroupsScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AccountDrawerNavigator from './AccountDrawerNavigator';
import { SCREEN_NAMES } from '../navigation';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={SCREEN_NAMES.GROUPS} component={GroupsScreen} />
      <Tab.Screen name={SCREEN_NAMES.FRIENDS} component={FriendsScreen} />
      <Tab.Screen name={SCREEN_NAMES.ACTIVITY} component={ActivityScreen} />
      <Tab.Screen
        name={SCREEN_NAMES.ACCOUNT_TAB}
        component={AccountDrawerNavigator}
        options={{ title: 'Account' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(SCREEN_NAMES.ACCOUNT_TAB); 
            navigation.openDrawer(); 
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
