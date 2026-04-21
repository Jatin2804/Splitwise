import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Group,
  Expense,
  ExpenseSplit,
  Activity,
  ActivityAction,
} from '../data/types';
import { MOCK_USERS, MOCK_GROUPS, MOCK_ACTIVITIES } from '../data/mockData';

export interface AppContextType {
  users: User[];
  groups: Group[];
  activities: Activity[];
  isLoading: boolean;
  // Users
  getUserById: (id: string) => User | undefined;
  // Groups
  addGroup: (group: Omit<Group, 'id' | 'expenses'>) => Promise<Group>;
  updateGroup: (
    id: string,
    updates: Partial<Group>,
  ) => Promise<Group | undefined>;
  deleteGroup: (id: string) => Promise<boolean>;
  getGroupById: (id: string) => Group | undefined;
  // Expenses
  getExpensesByGroupId: (groupId: string) => Expense[];
  addExpense: (
    groupId: string,
    expense: Omit<Expense, 'id' | 'createddate'>,
  ) => Promise<Expense | undefined>;
  updateExpense: (
    groupId: string,
    expenseId: string,
    updates: Partial<Expense>,
  ) => Promise<Expense | undefined>;
  deleteExpense: (groupId: string, expenseId: string) => Promise<boolean>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const USERS_STORAGE_KEY = '@splitwise_users';
const GROUPS_STORAGE_KEY = '@splitwise_groups';
const ACTIVITIES_STORAGE_KEY = '@splitwise_activities';
const DATA_VERSION_KEY = '@splitwise_data_version';
const CURRENT_DATA_VERSION = '2'; // bump this to force-reset stored data

let _idCounter = 100;
const genId = (prefix: string) => `${prefix}_${++_idCounter}_${Date.now()}`;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [storedVersion, storedUsers, storedGroups, storedActivities] =
          await Promise.all([
            AsyncStorage.getItem(DATA_VERSION_KEY),
            AsyncStorage.getItem(USERS_STORAGE_KEY),
            AsyncStorage.getItem(GROUPS_STORAGE_KEY),
            AsyncStorage.getItem(ACTIVITIES_STORAGE_KEY),
          ]);

        const isFresh =
          storedVersion === CURRENT_DATA_VERSION && storedUsers && storedGroups;

        if (isFresh) {
          setUsers(JSON.parse(storedUsers!));
          setGroups(JSON.parse(storedGroups!));
          setActivities(
            storedActivities ? JSON.parse(storedActivities) : MOCK_ACTIVITIES,
          );
        } else {
          await Promise.all([
            AsyncStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION),
            AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS)),
            AsyncStorage.setItem(
              GROUPS_STORAGE_KEY,
              JSON.stringify(MOCK_GROUPS),
            ),
            AsyncStorage.setItem(
              ACTIVITIES_STORAGE_KEY,
              JSON.stringify(MOCK_ACTIVITIES),
            ),
          ]);
          setUsers(MOCK_USERS);
          setGroups(MOCK_GROUPS);
          setActivities(MOCK_ACTIVITIES);
        }
      } catch (err) {
        console.error('Failed to initialize app data:', err);
        setUsers(MOCK_USERS);
        setGroups(MOCK_GROUPS);
        setActivities(MOCK_ACTIVITIES);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // ── Activity Helpers ──────────────────────────────────────────────────────
  const pushActivity = async (
    action: ActivityAction,
    description: string,
    meta: Partial<Activity> = {},
  ) => {
    const entry: Activity = {
      id: genId('act'),
      action,
      description,
      timestamp: new Date().toISOString(),
      ...meta,
    };
    setActivities(prev => {
      const next = [entry, ...prev];
      AsyncStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // ── Group CRUD ────────────────────────────────────────────────────────────
  const getGroupById = (id: string) => groups.find(g => g.id === id);

  const addGroup = async (
    group: Omit<Group, 'id' | 'expenses'>,
  ): Promise<Group> => {
    const newGroup: Group = { ...group, id: genId('g'), expenses: [] };
    const next = [...groups, newGroup];
    setGroups(next);
    await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
    await pushActivity(
      'GROUP_CREATED',
      `Group "${newGroup.name}" was created`,
      { groupId: newGroup.id, groupName: newGroup.name },
    );
    return newGroup;
  };

  const updateGroup = async (
    id: string,
    updates: Partial<Group>,
  ): Promise<Group | undefined> => {
    let updated: Group | undefined;
    const next = groups.map(g => {
      if (g.id === id) {
        updated = { ...g, ...updates };
        return updated;
      }
      return g;
    });
    if (updated) {
      setGroups(next);
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
      await pushActivity(
        'GROUP_UPDATED',
        `Group "${updated.name}" was updated`,
        { groupId: id, groupName: updated.name },
      );
    }
    return updated;
  };

  const deleteGroup = async (id: string): Promise<boolean> => {
    const group = getGroupById(id);
    const next = groups.filter(g => g.id !== id);
    if (next.length < groups.length) {
      setGroups(next);
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
      await pushActivity(
        'GROUP_DELETED',
        `Group "${group?.name}" was deleted`,
        { groupId: id, groupName: group?.name },
      );
      return true;
    }
    return false;
  };

  // ── Expense CRUD ──────────────────────────────────────────────────────────
  const getExpensesByGroupId = (groupId: string): Expense[] => {
    return getGroupById(groupId)?.expenses ?? [];
  };

  const _recalcGroup = (g: Group): Partial<Group> => {
    const totalspend = g.expenses.reduce((s, e) => s + e.amount, 0);
    return { totalspend };
  };

  const addExpense = async (
    groupId: string,
    expense: Omit<Expense, 'id' | 'createddate'>,
  ): Promise<Expense | undefined> => {
    const group = getGroupById(groupId);
    if (!group) return undefined;
    const newExp: Expense = {
      ...expense,
      id: genId('exp'),
      createddate: new Date().toISOString(),
    };
    const updatedExpenses = [...group.expenses, newExp];
    const updatedGroup = {
      ...group,
      expenses: updatedExpenses,
      ..._recalcGroup({ ...group, expenses: updatedExpenses }),
    };
    const next = groups.map(g => (g.id === groupId ? updatedGroup : g));
    setGroups(next);
    await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
    await pushActivity(
      'EXPENSE_ADDED',
      `₹${expense.amount.toLocaleString('en-IN')} "${expense.name}" added to ${
        group.name
      }`,
      { groupId, groupName: group.name, expenseId: newExp.id },
    );
    return newExp;
  };

  const updateExpense = async (
    groupId: string,
    expenseId: string,
    updates: Partial<Expense>,
  ): Promise<Expense | undefined> => {
    const group = getGroupById(groupId);
    if (!group) return undefined;
    let updated: Expense | undefined;
    const updatedExpenses = group.expenses.map(e => {
      if (e.id === expenseId) {
        updated = { ...e, ...updates };
        return updated;
      }
      return e;
    });
    if (updated) {
      const updatedGroup = {
        ...group,
        expenses: updatedExpenses,
        ..._recalcGroup({ ...group, expenses: updatedExpenses }),
      };
      const next = groups.map(g => (g.id === groupId ? updatedGroup : g));
      setGroups(next);
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
      await pushActivity(
        'EXPENSE_UPDATED',
        `Expense "${updated.name}" updated in ${group.name}`,
        { groupId, groupName: group.name, expenseId },
      );
    }
    return updated;
  };

  const deleteExpense = async (
    groupId: string,
    expenseId: string,
  ): Promise<boolean> => {
    const group = getGroupById(groupId);
    if (!group) return false;
    const exp = group.expenses.find(e => e.id === expenseId);
    const updatedExpenses = group.expenses.filter(e => e.id !== expenseId);
    if (updatedExpenses.length < group.expenses.length) {
      const updatedGroup = {
        ...group,
        expenses: updatedExpenses,
        ..._recalcGroup({ ...group, expenses: updatedExpenses }),
      };
      const next = groups.map(g => (g.id === groupId ? updatedGroup : g));
      setGroups(next);
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next));
      await pushActivity(
        'EXPENSE_DELETED',
        `Expense "${exp?.name}" deleted from ${group.name}`,
        { groupId, groupName: group.name },
      );
      return true;
    }
    return false;
  };

  const getUserById = (id: string) => users.find(u => u.id === id);

  return (
    <AppContext.Provider
      value={{
        users,
        groups,
        activities,
        isLoading,
        getUserById,
        addGroup,
        updateGroup,
        deleteGroup,
        getGroupById,
        getExpensesByGroupId,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
