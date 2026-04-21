import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SCREEN_NAMES } from '../navigation';
import { User } from '../data/mockData';

type AddMembersRouteProp = RouteProp<
  RootStackParamList,
  typeof SCREEN_NAMES.ADD_MEMBERS
>;
type AddMembersNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof SCREEN_NAMES.ADD_MEMBERS
>;

interface Props {
  route: AddMembersRouteProp;
  navigation: AddMembersNavigationProp;
}

const AddMembersScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;
  const context = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const group = context?.getGroupById(groupId);

  const availableUsers = useMemo(() => {
    if (!context || !group) return [];
    const groupMemberIds = new Set(group.members.map(m => m.id));
    return context.users.filter(
      user =>
        !groupMemberIds.has(user.id) &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [context, group, searchQuery]);

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleAddMembers = async () => {
    if (!context || !group) return;

    if (selectedUsers.length === 0) {
      Alert.alert(
        'No users selected',
        'Please select at least one user to add.',
      );
      return;
    }

    const updatedMembers = [...group.members, ...selectedUsers];

    try {
      await context.updateGroup(groupId, {
        members: updatedMembers,
        totalMembers: group.totalMembers + selectedUsers.length,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add members');
    }
  };

  const renderSelectedUserPill = (user: User) => (
    <View key={user.id} style={styles.selectedPill}>
      <Image source={{ uri: user.avatar }} style={styles.pillAvatar} />
      <Text style={styles.pillText} numberOfLines={1}>
        {user.name.split(' ')[0]}
      </Text>
      <TouchableOpacity
        style={styles.pillRemoveBtn}
        onPress={() => toggleUserSelection(user)}
      >
        <Icon name="close" size={14} color="#636e72" />
      </TouchableOpacity>
    </View>
  );

  const renderUserItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.some(u => u.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.userRow, isSelected && styles.userRowSelected]}
        onPress={() => toggleUserSelection(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userPhone}>{item.phoneNumber}</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Icon name="check" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  if (!group) {
    return (
      <View style={styles.centerContainer}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header with Search */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#2d3436" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={20}
              color="#636e72"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends by name or phone"
              placeholderTextColor="#b2bec3"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="cancel" size={20} color="#b2bec3" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {selectedUsers.length > 0 && (
          <View style={styles.selectedContainer}>
            <FlatList
              horizontal
              data={selectedUsers}
              keyExtractor={item => item.id}
              renderItem={({ item }) => renderSelectedUserPill(item)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedListContent}
            />
          </View>
        )}

        <FlatList
          data={availableUsers}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No matching users found.</Text>
            </View>
          }
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              selectedUsers.length === 0 && styles.addButtonDisabled,
            ]}
            onPress={handleAddMembers}
            disabled={selectedUsers.length === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>
              {selectedUsers.length > 0
                ? `Add ${selectedUsers.length} Member${selectedUsers.length > 1 ? 's' : ''}`
                : 'Add Members'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#2d3436',
    paddingVertical: 0,
  },
  selectedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
    paddingVertical: 12,
    backgroundColor: '#fafbfc',
  },
  selectedListContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 10,
  },
  pillAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    color: '#2d3436',
    fontWeight: '500',
    maxWidth: 80,
  },
  pillRemoveBtn: {
    marginLeft: 6,
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  userRowSelected: {
    backgroundColor: '#f0f8ff',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: '#636e72',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#0984e3',
    borderColor: '#0984e3',
  },
  emptyText: {
    color: '#636e72',
    fontSize: 15,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#00b894',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#b2bec3',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddMembersScreen;
