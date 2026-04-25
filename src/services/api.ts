import type { Account, PaginatedResponse } from '../types';

// Mock DB
let accountsDB: Account[] = [
  { id: '1', name: 'Bridge Foundation', iban: 'ES50 1234 4954 4443 2222', bank: 'Nairobi Bank' },
  { id: '2', name: 'Ramón Curado García', iban: 'ES50 1235 4954 4443 2222', bank: 'Denver Bank' },
  { id: '3', name: 'Vodafone Spain', iban: 'ES50 1236 4954 4443 2222', bank: 'Moscow Bank' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  login: async (customerId: string): Promise<{ success: boolean; token: string }> => {
    await delay(500);
    if (!customerId) throw new Error('Customer ID is required');
    return { success: true, token: 'mock-jwt-token' };
  },

  getAccounts: async (page = 1, pageSize = 5): Promise<PaginatedResponse<Account>> => {
    await delay(300);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = accountsDB.slice(start, end);
    
    return {
      data,
      total: accountsDB.length,
      page,
      pageSize
    };
  },

  getAccount: async (id: string): Promise<Account> => {
    await delay(200);
    const account = accountsDB.find(a => a.id === id);
    if (!account) throw new Error('Account not found');
    return account;
  },

  addAccount: async (accountData: Omit<Account, 'id'>): Promise<Account> => {
    await delay(400);
    if (accountsDB.length >= 20) {
      throw new Error('Maximum of 20 favorite accounts allowed.');
    }
    const newAccount = { ...accountData, id: Math.random().toString(36).substring(2, 9) };
    accountsDB.push(newAccount);
    return newAccount;
  },

  updateAccount: async (id: string, accountData: Omit<Account, 'id'>): Promise<Account> => {
    await delay(400);
    const index = accountsDB.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Account not found');
    
    accountsDB[index] = { ...accountData, id };
    return accountsDB[index];
  },

  deleteAccount: async (id: string): Promise<void> => {
    await delay(300);
    accountsDB = accountsDB.filter(a => a.id !== id);
  }
};
