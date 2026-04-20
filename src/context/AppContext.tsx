import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Group, Expense, generateMockUsers, generateMockGroups } from '../data/mockData';

export interface AppContextType {
  users: User[];
  groups: Group[];
  isLoading: boolean;
  addUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User | undefined>;
  deleteUser: (id: string) => Promise<boolean>;
  getUserById: (id: string) => User | undefined;
  addGroup: (group: Omit<Group, 'id' | 'expenses'>) => Promise<Group>;
  updateGroup: (id: string, updates: Partial<Group>) => Promise<Group | undefined>;
  deleteGroup: (id: string) => Promise<boolean>;
  getGroupById: (id: string) => Group | undefined;
  getExpensesByGroupId: (groupId: string) => Expense[];
  addExpense: (groupId: string, expense: Omit<Expense, 'id' | 'createddate'>) => Promise<Expense | undefined>;
  updateExpense: (groupId: string, expenseId: string, updates: Partial<Expense>) => Promise<Expense | undefined>;
  deleteExpense: (groupId: string, expenseId: string) => Promise<boolean>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const USERS_STORAGE_KEY = '@splitwise_users';
const GROUPS_STORAGE_KEY = '@splitwise_groups';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        const storedGroups = await AsyncStorage.getItem(GROUPS_STORAGE_KEY);

        if (storedUsers && storedGroups) {
          setUsers(JSON.parse(storedUsers));
          setGroups(JSON.parse(storedGroups));
        } else {
          const demoUsers = generateMockUsers(10);
          const demoGroups = generateMockGroups(5);
          
          await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers));
          await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(demoGroups));

          setUsers(demoUsers);
          setGroups(demoGroups);
        }
      } catch (error) {
        console.error('Failed to initialize app data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // ========================
  // USER CRUD
  // ========================
  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const { faker } = await import('@faker-js/faker');
    const newUser: User = { ...user, id: faker.string.uuid() };
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    return newUser;
  };

  const updateUser = async (id: string, updates: Partial<User>): Promise<User | undefined> => {
    let updatedUser: User | undefined;
    const newUsers = users.map((u) => {
      if (u.id === id) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });
    
    if (updatedUser) {
      setUsers(newUsers);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    }
    return updatedUser;
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    const initialLength = users.length;
    const newUsers = users.filter(user => user.id !== id);
    
    if (newUsers.length < initialLength) {
      setUsers(newUsers);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
      return true;
    }
    return false;
  };

  // ========================
  // GROUP CRUD
  // ========================
  const getGroupById = (id: string): Group | undefined => {
    return groups.find(group => group.id === id);
  };

  const addGroup = async (group: Omit<Group, 'id' | 'expenses'>): Promise<Group> => {
    const { faker } = await import('@faker-js/faker');
    const newGroup: Group = { 
      ...group, 
      id: faker.string.uuid(), 
      expenses: [] 
    };
    const newGroups = [...groups, newGroup];
    setGroups(newGroups);
    await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(newGroups));
    return newGroup;
  };

  const updateGroup = async (id: string, updates: Partial<Group>): Promise<Group | undefined> => {
    let updatedGroup: Group | undefined;
    const newGroups = groups.map((g) => {
      if (g.id === id) {
        updatedGroup = { ...g, ...updates };
        return updatedGroup;
      }
      return g;
    });
    
    if (updatedGroup) {
      setGroups(newGroups);
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(newGroups));
    }
    return updatedGroup;
  };

  const deleteGroup = async (id: string): Promise<boolean> => {
    const initialLength = groups.length;
    const newGroups = groups.filter(group => group.id !== id);
    
    if (newGroups.length < initialLength) {
      setGroups(newGroups);
      await AsyncStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(newGroups));
      return true;
    }
    return false;
  };

  // ========================
  // EXPENSE CRUD
  // ========================
  const getExpensesByGroupId = (groupId: string): Expense[] => {
    const group = getGroupById(groupId);
    return group ? group.expenses : [];
  };

  const addExpense = async (
    groupId: string, 
    expense: Omit<Expense, 'id' | 'createddate'>
  ): Promise<Expense | undefined> => {
    const group = getGroupById(groupId);
    if (!group) return undefined;

    const { faker } = await import('@faker-js/faker');
    const newExpense: Expense = { 
      ...expense, 
      id: faker.string.uuid(), 
      createddate: new Date() 
    };
    
    const updatedExpenses = [...group.expenses, newExpense];
    const updatedGroup = { ...group, expenses: updatedExpenses };
    
    await updateGroup(groupId, updatedGroup);
    return newExpense;
  };

  const updateExpense = async (
    groupId: string, 
    expenseId: string, 
    updates: Partial<Expense>
  ): Promise<Expense | undefined> => {
    const group = getGroupById(groupId);
    if (!group) return undefined;

    let updatedExpense: Expense | undefined;
    const updatedExpenses = group.expenses.map(exp => {
      if (exp.id === expenseId) {
        updatedExpense = { ...exp, ...updates };
        return updatedExpense;
      }
      return exp;
    });

    if (updatedExpense) {
      await updateGroup(groupId, { expenses: updatedExpenses });
    }
    return updatedExpense;
  };

  const deleteExpense = async (groupId: string, expenseId: string): Promise<boolean> => {
    const group = getGroupById(groupId);
    if (!group) return false;

    const initialLength = group.expenses.length;
    const filteredExpenses = group.expenses.filter(exp => exp.id !== expenseId);
    
    if (filteredExpenses.length < initialLength) {
      await updateGroup(groupId, { expenses: filteredExpenses });
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{ 
      users, 
      groups, 
      isLoading, 
      addUser, 
      updateUser, 
      deleteUser,
      getUserById,
      addGroup, 
      updateGroup, 
      deleteGroup,
      getGroupById,
      getExpensesByGroupId,
      addExpense,
      updateExpense,
      deleteExpense
    }}>
      {children}
    </AppContext.Provider>
  );
};