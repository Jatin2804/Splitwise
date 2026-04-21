export interface User {
  id: string;
  name: string;
  avatar: string;
  phoneNumber: string;
  email: string;
  moneySpend: number;
  moneyOwned: number;
  moneyReceived: number;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  name: string;
  description: string;
  createddate: Date | string;
  amount: number;
  paidBy: string; // userId
  splits: ExpenseSplit[];
  category: string; // e.g. Food, Travel, Accommodation, Entertainment, Other
}

export interface Group {
  id: string;
  createdAt: Date | string;
  name: string;
  avatar: string;
  totalspend: number;
  createdBy: string;
  totalMembers: number;
  members: User[];
  type: string;
  setteledAmount: number;
  unsetteledAmount: number;
  startDate: Date | string;
  endDate: Date | string;
  expenses: Expense[];
}

export type ActivityAction =
  | 'GROUP_CREATED'
  | 'GROUP_DELETED'
  | 'GROUP_UPDATED'
  | 'EXPENSE_ADDED'
  | 'EXPENSE_UPDATED'
  | 'EXPENSE_DELETED'
  | 'MEMBER_ADDED';

export interface Activity {
  id: string;
  action: ActivityAction;
  description: string;
  timestamp: Date | string;
  groupId?: string;
  groupName?: string;
  expenseId?: string;
  userId?: string;
}
