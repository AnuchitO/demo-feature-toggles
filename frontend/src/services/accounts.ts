import { api } from './api';
import type { Account, Transaction, Schedule, ScheduleTransferPayload, ScheduleTransferResponse } from '../types/account';


export const DEMO_ACCOUNT: Account = {
  branch: 'Demo Branch',
  number: '111-111-111',
  type: 'Savings',
  name: 'AnuchitO',
  currentBalance: 101282250,
  availableBalance: 101282250,
};

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

export interface TransferPayload {
  fromAccount: string;
  toAccount: string;
  toBank: string;
  note: string;
  amount: number;
}

export interface TransferResponse {
  transactionID: string;
  status: string;
  transferredAt: string;
}


export const transfer = async (payload: TransferPayload): Promise<TransferResponse> => {
  try {
    const response = await api.post<TransferResponse>(`/accounts/${payload.fromAccount}/transfers`, payload);
    return response.data;
  } catch (error) {
    console.error('Error transferring:', error);
    throw error;
  }
}

export const scheduleTransfer = async (payload: ScheduleTransferPayload): Promise<ScheduleTransferResponse> => {
  try {
    const response = await api.post<ScheduleTransferResponse>(`/accounts/${payload.fromAccount}/schedules`, payload);
    return response.data;
  } catch (error) {
    console.error('Error scheduling transfer:', error);
    throw error;
  }
}

