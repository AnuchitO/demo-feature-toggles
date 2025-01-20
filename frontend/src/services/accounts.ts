import { api } from './api';
import type { Account, Transaction } from '../types/account';

export const fetchAccountBalances = async (accountNumber: string): Promise<Account> => {
  try {
    const response = await api.get<Account>(`/accounts/${accountNumber}/balances`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
};

export const fetchAccountTransactions = async (accountNumber: string): Promise<Transaction[]> => {
  try {
    const response = await api.get<Transaction[]>(`/accounts/${accountNumber}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
};
