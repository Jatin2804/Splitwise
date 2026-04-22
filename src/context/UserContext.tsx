import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../data/types';

export interface UserContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<User>;
  updateCurrentUser: (updates: Partial<User>) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const USER_STORAGE_KEY = '@splitwise_current_user';

let _idCounter = 1000;
const genId = () => `local_${++_idCounter}`;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (user: User) => {
    setCurrentUser(user);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  };


  const logout = async () => {
    setCurrentUser(null);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
  ): Promise<User> => {
    const newUser: User = {
      id: genId(),
      name,
      email,
      phoneNumber: phone,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      moneySpend: 0,
      moneyOwned: 0,
      moneyReceived: 0,
    };
    await login(newUser);
    return newUser;
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isLoading,
        login,
        logout,
        register,
        updateCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
