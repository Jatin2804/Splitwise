import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GroupsScreen from '../screens/GroupsScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AccountScreen from '../screens/AccountScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREEN_NAMES } from '../navigation';
import FabController from '../components/FabController';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === SCREEN_NAMES.GROUPS) {
              iconName = 'group';
            } else if (route.name === SCREEN_NAMES.FRIENDS) {
              iconName = 'person';
            } else if (route.name === SCREEN_NAMES.ACTIVITY) {
              iconName = 'photo-library';
            } else if (route.name === SCREEN_NAMES.ACCOUNT) {
              iconName = 'account-circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },

          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name={SCREEN_NAMES.GROUPS} component={GroupsScreen} />
        <Tab.Screen name={SCREEN_NAMES.FRIENDS} component={FriendsScreen} />
        <Tab.Screen name={SCREEN_NAMES.ACTIVITY} component={ActivityScreen} />
        <Tab.Screen
          name={SCREEN_NAMES.ACCOUNT}
          component={AccountScreen}
          options={{ title: 'Account' }}
        />
      </Tab.Navigator>
      {/* <FabController /> */}
    </View>
  );
};

export default TabNavigator;