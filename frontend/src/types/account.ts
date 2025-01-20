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
  date: string;
  amount: number;
}

export type Bank = "SCB" | "KTB" | "KBank"

export interface Schedule {
  toBank: Bank;
  toAccount: string;
  toAccountName: string;
  amount: number;
  date: string;
}

