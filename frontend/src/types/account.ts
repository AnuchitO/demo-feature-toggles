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

