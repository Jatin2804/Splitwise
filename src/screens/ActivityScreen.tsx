import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { Activity, ActivityAction } from '../data/types';
import { SCREEN_NAMES } from '../navigation';

const ACTION_CONFIG: Record<
  ActivityAction,
  { icon: string; color: string; bg: string }
> = {
  GROUP_CREATED: { icon: 'group-add', color: '#0984e3', bg: '#e8f4fd' },
  GROUP_DELETED: { icon: 'delete', color: '#d63031', bg: '#ffefef' },
  GROUP_UPDATED: { icon: 'edit', color: '#6c5ce7', bg: '#f0eeff' },
  EXPENSE_ADDED: { icon: 'add-shopping-cart', color: '#00b894', bg: '#e8f8f5' },
  EXPENSE_UPDATED: { icon: 'edit-note', color: '#fdcb6e', bg: '#fffbef' },
  EXPENSE_DELETED: {
    icon: 'remove-shopping-cart',
    color: '#e17055',
    bg: '#fff3ef',
  },
  MEMBER_ADDED: { icon: 'person-add', color: '#00cec9', bg: '#e6fafa' },
};

const formatTime = (ts: Date | string) => {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
};

const ActivityItem = ({
  item,
  navigation,
}: {
  item: Activity;
  navigation: any;
}) => {
  const cfg = ACTION_CONFIG[item.action] ?? {
    icon: 'info',
    color: '#636e72',
    bg: '#f1f2f6',
  };
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={item.groupId ? 0.7 : 1}
      onPress={() =>
        item.groupId &&
        navigation.navigate(SCREEN_NAMES.GROUP_DETAILS, {
          groupId: item.groupId,
        })
      }
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
        <Icon name={cfg.icon} size={22} color={cfg.color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.desc}>{item.description}</Text>
        {item.groupName && (
          <Text style={styles.groupName}>{item.groupName}</Text>
        )}
        <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ActivityScreen = ({ navigation }: any) => {
  const appCtx = useContext(AppContext);
  const activities = appCtx?.activities ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      {activities.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="notifications-none" size={72} color="#dfe6e9" />
          <Text style={styles.emptyTitle}>No activity yet</Text>
          <Text style={styles.emptySub}>
            Your group and expense history will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={a => a.id}
          renderItem={({ item }) => (
            <ActivityItem item={item} navigation={navigation} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    backgroundColor: '#fff',
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
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1e272e' },
  list: { padding: 16, paddingBottom: 32 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemContent: { flex: 1 },
  desc: { fontSize: 14, color: '#2d3436', fontWeight: '600', marginBottom: 3 },
  groupName: {
    fontSize: 12,
    color: '#0984e3',
    fontWeight: '600',
    marginBottom: 2,
  },
  time: { fontSize: 12, color: '#b2bec3', fontWeight: '500' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3436',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ActivityScreen;
