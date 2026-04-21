import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import groupBg from '../assets/groupBg.jpg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREEN_NAMES } from '../navigation';

const AddGroupIcon = ({
  size = 20,
  iconSize = 20,
  plusSize = 14,
  color = 'black',
}) => {
  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <Icon name="group" size={iconSize} color={color} />
      <Icon
        name="add"
        size={plusSize}
        color={color}
        style={styles.plusIconOverlay}
      />
    </View>
  );
};

const GroupsScreen = ({ navigation }: any) => {
  const context = useContext(AppContext);

  const handleAddGroup = () => {
    navigation.navigate(SCREEN_NAMES.CREATE_GROUP);
  };

  if (!context || context.isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate(SCREEN_NAMES.GROUP_DETAILS, { groupId: item.id })
        }
        activeOpacity={0.7}
      >
        {/* Left Section - Image/Icon Section */}
        <View style={styles.imageSection}>
          <Image source={groupBg} style={styles.groupImage} />
          <View style={styles.imageOverlay}>
            <Text style={styles.groupInitial}>
              <Icon name="group" size={40} color="#ffffff" />
            </Text>
          </View>
        </View>

        {/* Right Section - Group Info */}
        <View style={styles.infoSection}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.dateText}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View style={styles.expenseContainer}>
            <Text style={styles.expenseLabel}>Total Expense: </Text>
            <Text style={styles.expenseValue}>
              ${item.totalspend?.toFixed(2) || '0.00'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.emptySpace} />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddGroup}
            activeOpacity={0.7}
          >
            <AddGroupIcon size={24} iconSize={20} plusSize={14} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={context.groups}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          context.groups.length === 0 ? { flex: 1 } : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>No groups found</Text>
          </View>
        }
        ListFooterComponent={
          context.groups.length > 0 ? (
            <TouchableOpacity
              style={styles.transparentButton}
              onPress={handleAddGroup}
              activeOpacity={0.7}
            >
              <AddGroupIcon
                size={20}
                iconSize={16}
                plusSize={12}
                color="black"
              />
              <Text style={styles.transparentButtonText}>
                Start a New Group
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Global Add Expense FAB */}
      <TouchableOpacity
        style={styles.expenseFab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate(SCREEN_NAMES.ADD_EXPENSE, {})}
      >
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.expenseFabText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  emptySpace: {
    width: 48,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d3436',
    letterSpacing: 0.5,
  },
  addButton: {
    alignSelf: 'flex-end',
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 10,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    height: 90,
    borderWidth: 0,
  },
  imageSection: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  groupImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  groupInitial: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoSection: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  dateText: {
    fontSize: 13,
    color: '#636e72',
    marginBottom: 12,
    fontWeight: '500',
  },
  expenseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  expenseLabel: {
    fontSize: 13,
    color: '#636e72',
    fontWeight: '600',
  },
  expenseValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e17055',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  transparentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    letterSpacing: 0.5,
  },
  expenseFab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    left: 20,
    backgroundColor: '#00b894',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    gap: 8,
  },
  expenseFabText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default GroupsScreen;
