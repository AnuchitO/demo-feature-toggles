import { api } from './api';
import type { Account, Transaction, Schedule } from '../types/account';

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

// Fetch account schedules
export const fetchAccountSchedules = async (accountNumber: string): Promise<Schedule[]> => {
  try {
    const response = await api.get<Schedule[]>(`/accounts/${accountNumber}/schedules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account schedules:', error);
    throw error;
  }
};

