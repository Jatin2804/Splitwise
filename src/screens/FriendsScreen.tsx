import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';

const FriendsScreen = () => {
  const context = useContext(AppContext);

  if (!context || context.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading friends...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    let balanceText = 'Settled up';
    let balanceColor = 'gray';
    
    if (item.moneyOwned > 0) {
      balanceText = `Owes you $${item.moneyOwned.toFixed(2)}`;
      balanceColor = '#5bc5a7';
    } else if (item.moneySpend > item.moneyReceived) {
      balanceText = `You owe $${(item.moneySpend - item.moneyReceived).toFixed(2)}`;
      balanceColor = '#ff652f';
    }

    return (
      <View style={styles.friendItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={[styles.friendBalance, { color: balanceColor }]}>{balanceText}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={context.users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' ,marginTop: 30},
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16 },
  friendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  friendInfo: { flex: 1, justifyContent: 'center' },
  friendName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  friendBalance: { fontSize: 14, marginTop: 4 },
});

export default FriendsScreen;
