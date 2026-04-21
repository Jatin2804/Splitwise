import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context/AppContext';
import { UserContext } from '../context/UserContext';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SCREEN_NAMES } from '../navigation';
import { Expense, User } from '../data/types';
import groupBg from '../assets/groupBg.jpg';

type GroupDetailsRouteProp = RouteProp<
  RootStackParamList,
  typeof SCREEN_NAMES.GROUP_DETAILS
>;
type GroupDetailsNavProp = NativeStackNavigationProp<
  RootStackParamList,
  typeof SCREEN_NAMES.GROUP_DETAILS
>;

interface Props {
  route: GroupDetailsRouteProp;
  navigation: GroupDetailsNavProp;
}

const TABS = ['Settle Up', 'Charts', 'Balances', 'Totals'];
const CATEGORY_COLORS: Record<string, string> = {
  Food: '#fd79a8',
  Travel: '#0984e3',
  Accommodation: '#6c5ce7',
  Entertainment: '#e17055',
  Other: '#00b894',
};


const SettleUpTab = ({
  expenses,
  getUserById,
  currentUserId,
}: {
  expenses: Expense[];
  getUserById: (id: string) => User | undefined;
  currentUserId: string;
}) => {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const appCtx = useContext(AppContext);

  if (expenses.length === 0) {
    return (
      <View style={styles.fallback}>
        <Icon name="receipt-long" size={64} color="#dfe6e9" />
        <Text style={styles.fallbackText}>No expenses yet</Text>
        <Text style={styles.fallbackSub}>Add an expense to get started.</Text>
      </View>
    );
  }

  return (
    <View>
      {expenses.map(exp => {
        const payer = getUserById(exp.paidBy);
        const mySplit = exp.splits.find(s => s.userId === currentUserId);
        const isPayer = exp.paidBy === currentUserId;
        const othersTotal = exp.splits
          .filter(s => s.userId !== currentUserId)
          .reduce((sum, s) => sum + s.amount, 0);

        return (
          <View key={exp.id} style={styles.expenseCard}>
            <View
              style={[
                styles.expCategoryDot,
                { backgroundColor: CATEGORY_COLORS[exp.category] ?? '#636e72' },
              ]}
            />
            <View style={styles.expInfo}>
              <Text style={styles.expName}>{exp.name}</Text>
              <Text style={styles.expMeta}>
                {payer?.name ?? 'Someone'} paid ·{' '}
                {new Date(exp.createddate).toLocaleDateString()}
              </Text>
              {exp.description ? (
                <Text style={styles.expDesc}>{exp.description}</Text>
              ) : null}
              <View style={styles.expAmountRow}>
                <Text style={styles.expTotal}>
                  ₹{exp.amount.toLocaleString('en-IN')}
                </Text>
                {isPayer && othersTotal > 0 && (
                  <Text style={styles.expYouLent}>
                    you lent ₹{othersTotal.toLocaleString('en-IN')}
                  </Text>
                )}
                {!isPayer && mySplit && (
                  <Text style={styles.expYouOwe}>
                    you owe ₹{mySplit.amount.toLocaleString('en-IN')}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Delete expense?', exp.name, [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      const groupId = exp.id; 
                    },
                  },
                ])
              }
              style={styles.expDeleteBtn}
            >
              <Icon name="more-vert" size={20} color="#b2bec3" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const ChartsTab = ({ expenses }: { expenses: Expense[] }) => {
  if (expenses.length === 0) {
    return (
      <View style={styles.fallback}>
        <Icon name="bar-chart" size={64} color="#dfe6e9" />
        <Text style={styles.fallbackText}>No chart data</Text>
        <Text style={styles.fallbackSub}>
          Add expenses to see category breakdown.
        </Text>
      </View>
    );
  }

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxVal = entries[0]?.[1] ?? 1;

  return (
    <View>
      <Text style={styles.chartTitle}>Expense by Category</Text>
      {entries.map(([cat, total]) => (
        <View key={cat} style={styles.barRow}>
          <Text style={styles.barLabel}>{cat}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.round((total / maxVal) * 100)}%` as any,
                  backgroundColor: CATEGORY_COLORS[cat] ?? '#636e72',
                },
              ]}
            />
          </View>
          <Text style={styles.barValue}>₹{total.toLocaleString('en-IN')}</Text>
        </View>
      ))}
    </View>
  );
};

const BalancesTab = ({
  expenses,
  members,
  getUserById,
  currentUserId,
}: {
  expenses: Expense[];
  members: User[];
  getUserById: (id: string) => User | undefined;
  currentUserId: string;
}) => {
  if (expenses.length === 0 || members.length === 0) {
    return (
      <View style={styles.fallback}>
        <Icon name="account-balance-wallet" size={64} color="#dfe6e9" />
        <Text style={styles.fallbackText}>No balances yet</Text>
        <Text style={styles.fallbackSub}>
          Add members and expenses to see balances.
        </Text>
      </View>
    );
  }

  // Net balance per member if positive = is owed an if negative = owes
  const balances: Record<string, number> = {};
  members.forEach(m => {
    balances[m.id] = 0;
  });
  expenses.forEach(exp => {
    if (balances[exp.paidBy] !== undefined) balances[exp.paidBy] += exp.amount;
    exp.splits.forEach(s => {
      if (balances[s.userId] !== undefined) balances[s.userId] -= s.amount;
    });
  });

  return (
    <View>
      <Text style={styles.chartTitle}>Net Balances</Text>
      {members.map(m => {
        const bal = balances[m.id] ?? 0;
        const isOwed = bal > 0;
        const isSettled = Math.abs(bal) < 0.01;
        return (
          <View key={m.id} style={styles.balRow}>
            <Image source={{ uri: m.avatar }} style={styles.balAvatar} />
            <View style={styles.balInfo}>
              <Text style={styles.balName}>
                {m.id === currentUserId ? 'You' : m.name}
              </Text>
              {isSettled ? (
                <Text style={styles.settled}>Settled up ✓</Text>
              ) : (
                <Text
                  style={[
                    styles.balAmount,
                    { color: isOwed ? '#00b894' : '#d63031' },
                  ]}
                >
                  {isOwed
                    ? `gets back ₹${Math.abs(bal).toLocaleString('en-IN')}`
                    : `owes ₹${Math.abs(bal).toLocaleString('en-IN')}`}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const TotalsTab = ({
  expenses,
  members,
  getUserById,
}: {
  expenses: Expense[];
  members: User[];
  getUserById: (id: string) => User | undefined;
}) => {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byPayer: Record<string, number> = {};
  expenses.forEach(e => {
    byPayer[e.paidBy] = (byPayer[e.paidBy] ?? 0) + e.amount;
  });

  return (
    <View>
      <View style={styles.totalSummaryCard}>
        <Text style={styles.totalSummaryLabel}>Total Group Spend</Text>
        <Text style={styles.totalSummaryAmount}>
          ₹{total.toLocaleString('en-IN')}
        </Text>
      </View>
      {expenses.length === 0 ? (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>No totals yet.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.chartTitle}>Paid by member</Text>
          {Object.entries(byPayer).map(([uid, amt]) => {
            const u = getUserById(uid) ?? members.find(m => m.id === uid);
            if (!u) return null;
            return (
              <View key={uid} style={styles.balRow}>
                <Image source={{ uri: u.avatar }} style={styles.balAvatar} />
                <Text style={styles.balName}>{u.name}</Text>
                <Text style={styles.totalAmt}>
                  ₹{amt.toLocaleString('en-IN')}
                </Text>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};


const GroupDetailsScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;
  const appCtx = useContext(AppContext);
  const userCtx = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('Settle Up');

  const group = appCtx?.getGroupById(groupId);
  const currentUserId = userCtx?.currentUser?.id ?? '';

  const expenses = useMemo(() => group?.expenses ?? [], [group]);

  const settledStatus = useMemo(() => {
    if (!group || expenses.length === 0)
      return { type: 'settled' as const, amount: 0 };
    let net = 0;
    expenses.forEach(e => {
      if (e.paidBy === currentUserId) {
        const othersShare = e.splits
          .filter(s => s.userId !== currentUserId)
          .reduce((s, x) => s + x.amount, 0);
        net += othersShare;
      } else {
        const myShare =
          e.splits.find(s => s.userId === currentUserId)?.amount ?? 0;
        net -= myShare;
      }
    });
    if (net > 0.01) return { type: 'owed' as const, amount: net };
    if (net < -0.01) return { type: 'owes' as const, amount: Math.abs(net) };
    return { type: 'settled' as const, amount: 0 };
  }, [expenses, currentUserId, group]);

  if (!group) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>Group not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.errorBtn}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'Settle Up':
        return (
          <SettleUpTab
            expenses={expenses}
            getUserById={id => appCtx?.getUserById(id)}
            currentUserId={currentUserId}
          />
        );
      case 'Charts':
        return <ChartsTab expenses={expenses} />;
      case 'Balances':
        return (
          <BalancesTab
            expenses={expenses}
            members={group.members}
            getUserById={id => appCtx?.getUserById(id)}
            currentUserId={currentUserId}
          />
        );
      case 'Totals':
        return (
          <TotalsTab
            expenses={expenses}
            members={group.members}
            getUserById={id => appCtx?.getUserById(id)}
          />
        );
      default:
        return null;
    }
  };

  const statusColor =
    settledStatus.type === 'owed'
      ? '#00b894'
      : settledStatus.type === 'owes'
      ? '#d63031'
      : '#00b894';
  const statusIcon =
    settledStatus.type === 'owed'
      ? 'trending-up'
      : settledStatus.type === 'owes'
      ? 'trending-down'
      : 'check-circle';
  const statusTitle =
    settledStatus.type === 'owed'
      ? `You are owed ₹${settledStatus.amount.toLocaleString('en-IN')}`
      : settledStatus.type === 'owes'
      ? `You owe ₹${settledStatus.amount.toLocaleString('en-IN')}`
      : 'You are all settled up!';
  const statusSub =
    settledStatus.type === 'settled'
      ? 'You are settled up in this group as of now.'
      : 'Based on current expenses in this group.';

  const bgSource = group.avatar ? { uri: group.avatar } : groupBg;

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ImageBackground source={bgSource} style={styles.headerImage}>
          <View style={styles.headerOverlay}>
            <SafeAreaView>
              <View style={styles.headerTop}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.iconBtn}
                >
                  <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(SCREEN_NAMES.GROUP_SETTINGS, {
                      groupId,
                    })
                  }
                  style={styles.iconBtn}
                >
                  <Icon name="settings" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            <View style={styles.headerBottom}>
              <Text style={styles.groupName}>{group.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Icon name="event" size={13} color="#fff" />
                  <Text style={styles.metaText}>
                    {new Date(group.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaChip}>
                  <Icon name="people" size={15} color="#fff" />
                  <Text style={styles.metaText}>
                    {group.totalMembers} people
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

       
        {group.members.length === 0 && (
          <View style={styles.addMembersWrap}>
            <TouchableOpacity
              style={styles.addMembersBtn}
              onPress={() =>
                navigation.navigate(SCREEN_NAMES.ADD_MEMBERS, {
                  groupId: group.id,
                })
              }
            >
              <Icon name="person-add" size={22} color="#fff" />
              <Text style={styles.addMembersText}>Add Members</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status card */}
        <View
          style={[
            styles.statusCard,
            group.members.length > 0 && { marginTop: -16 },
          ]}
        >
          <View
            style={[styles.statusIcon, { backgroundColor: `${statusColor}22` }]}
          >
            <Icon name={statusIcon} size={28} color={statusColor} />
          </View>
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, { color: statusColor }]}>
              {statusTitle}
            </Text>
            <Text style={styles.statusSub}>{statusSub}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsBar}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabPill,
                activeTab === tab && styles.tabPillActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab content */}
        <View style={styles.tabContent}>{renderTab()}</View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate(SCREEN_NAMES.ADD_EXPENSE, { groupId })
        }
      >
        <Icon name="add" size={22} color="#fff" />
        <Text style={styles.fabText}>Add expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  errorBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: '#d63031', marginBottom: 16 },
  errorBtn: {
    backgroundColor: '#0984e3',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  headerImage: { width: '100%', height: 240 },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconBtn: { padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  headerBottom: { marginBottom: 20 },
  groupName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 5,
  },
  metaText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 10,
  },

  addMembersWrap: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  addMembersBtn: {
    backgroundColor: '#00b894',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addMembersText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  statusSub: { fontSize: 13, color: '#636e72' },

  // tabs
  tabsBar: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f2f6',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tabPillActive: { backgroundColor: '#2d3436', borderColor: '#2d3436' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#636e72' },
  tabTextActive: { color: '#fff' },
  tabContent: { padding: 16, paddingBottom: 100 },

  // expense cards
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  expCategoryDot: {
    width: 6,
    height: '100%',
    borderRadius: 3,
    marginRight: 12,
    minHeight: 48,
  },
  expInfo: { flex: 1 },
  expName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 3,
  },
  expMeta: { fontSize: 12, color: '#636e72', marginBottom: 4 },
  expDesc: {
    fontSize: 13,
    color: '#636e72',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  expAmountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  expTotal: { fontSize: 16, fontWeight: '800', color: '#2d3436' },
  expYouLent: { fontSize: 13, color: '#00b894', fontWeight: '600' },
  expYouOwe: { fontSize: 13, color: '#d63031', fontWeight: '600' },
  expDeleteBtn: { padding: 4 },

  // charts
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#636e72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  barRow: { marginBottom: 16 },
  barLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 6,
  },
  barTrack: {
    height: 12,
    backgroundColor: '#f1f2f6',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: { height: '100%', borderRadius: 6 },
  barValue: { fontSize: 13, color: '#636e72', fontWeight: '600' },

  // balances
  balRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  balAvatar: { width: 42, height: 42, borderRadius: 21, marginRight: 12 },
  balInfo: { flex: 1 },
  balName: { fontSize: 15, fontWeight: '600', color: '#2d3436' },
  balAmount: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  settled: { fontSize: 13, color: '#00b894', fontWeight: '600', marginTop: 2 },

  // totals
  totalSummaryCard: {
    backgroundColor: '#2d3436',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalSummaryLabel: {
    fontSize: 13,
    color: '#adb5bd',
    fontWeight: '600',
    marginBottom: 6,
  },
  totalSummaryAmount: { fontSize: 32, fontWeight: '800', color: '#fff' },
  totalAmt: { fontSize: 15, fontWeight: '700', color: '#2d3436' },

  // fallback
  fallback: { alignItems: 'center', paddingTop: 40 },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackSub: { fontSize: 14, color: '#636e72', textAlign: 'center' },

  
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    left: 20,
    backgroundColor: '#00b894',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    gap: 8,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default GroupDetailsScreen;
