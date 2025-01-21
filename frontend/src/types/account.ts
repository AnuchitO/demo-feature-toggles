export interface Account {
  branch: string;
  number: string;
  type: string;
  name: string;
  currentBalance: number;
  availableBalance: number;
}

export interface Transaction {
  type: string;
  transferredAt: string;
  amount: number;
}

// Define the payload types for transfer and schedule
export interface TransferPayload {
  fromAccount: string;
  toAccount: string;
  toBank: string;
  amount: number;
  currency: string;
  note: string;
}


export type Bank = "SCB" | "KTB" | "KBank"

export interface Schedule {
  toBank: Bank;
  toAccount: string;
  toAccountName: string;
  amount: number;
  date: string;
}

export interface ScheduleTransferPayload {
  fromAccount: string;
  toAccount: string;
  toBank: string;
  amount: number;
  currency: string;
  note: string;
  schedule: string; // 'ONCE' | 'MONTHLY'
  startDate: string;
  endDate: string;
}

export interface ScheduleTransferResponse {
  scheduleID: string;
  status: string;
  nextRunDate: string;
  endDate: string;
  scheduleType: string;
}
