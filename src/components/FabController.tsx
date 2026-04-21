import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigationState } from '@react-navigation/native';
import { SCREEN_NAMES } from '../navigation';

const FabController = () => {
  const currentTab = useNavigationState(state => {
    if (!state) return SCREEN_NAMES.GROUPS;

    const currentRoute = state.routes[state.index];
    if (currentRoute.name === SCREEN_NAMES.MAIN_APP) {
      const tabState = currentRoute.state;
      if (tabState && tabState.index !== undefined) {
        return tabState.routes[tabState.index]?.name ?? SCREEN_NAMES.GROUPS;
      }
      return SCREEN_NAMES.GROUPS;
    }

    return currentRoute.name;
  });

  const showFab = currentTab !== SCREEN_NAMES.ACCOUNT;

  if (!showFab) return null;

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => console.log('Navigate to Add Expense')}
      activeOpacity={0.8}
    >
      <Icon name="add" size={20} color="#fff" />
      <Text style={styles.fabText}>Add Expense</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    backgroundColor: '#00b578',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FabController;
