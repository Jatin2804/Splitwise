import { faker } from '@faker-js/faker';

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

export interface Expense {
  id: string;
  name: string;
  description: string;
  createddate: Date;
  amount: number;
}

export interface Group {
  id: string;
  createdAt: Date;
  name: string;
  avatar: string;
  totalspend: number;
  createdBy: string;
  totalMembers: number;
  members: User[];
  type: string;
  setteledAmount: number;
  unsetteledAmount: number;
  startDate: Date;
  endDate: Date;
  expenses: Expense[];
}

export const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    moneySpend: faker.number.float({ min: 0, max: 1000, fractionDigits: 2 }),
    moneyOwned: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
    moneyReceived: faker.number.float({ min: 0, max: 500, fractionDigits: 2 }),
  }));
};

export const generateMockExpenses = (count: number): Expense[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    createddate: faker.date.recent(),
    amount: faker.number.float({ min: 5, max: 500, fractionDigits: 2 }),
  }));
};

export const generateMockGroups = (count: number, usersPerGroup: number = 5, expensesPerGroup: number = 10): Group[] => {
  return Array.from({ length: count }).map(() => {
    const members = generateMockUsers(usersPerGroup);
    const expenses = generateMockExpenses(expensesPerGroup);
    const totalspend = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const setteledAmount = faker.number.float({ min: 0, max: totalspend, fractionDigits: 2 });

    return {
      id: faker.string.uuid(),
      createdAt: faker.date.past(),
      name: faker.company.name(),
      avatar: faker.image.avatar(),
      totalspend,
      createdBy: members[0].id,
      totalMembers: members.length,
      members,
      type: faker.helpers.arrayElement(['Trip', 'Home', 'Couple', 'Other']),
      setteledAmount,
      unsetteledAmount: totalspend - setteledAmount,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      expenses,
    };
  });
};