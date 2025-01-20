import { Fragment, useEffect, useState } from 'react'
import { MonthlyDropdown } from './MonthlyDropdown'
import { commaSeparated } from './formater'
import { fetchAccountTransactions } from './services/accounts'
import type { Transaction } from './types/account'

interface TransactionProps {
  type: string;
  date: string;
  amount: number;
}

const satangToBaht = (satang: number) => {
  return satang / 100;
}

const Transaction = ({ type = "Activity", date = "18 Jan 2025 15:03", amount = 0 }: TransactionProps) => {
  return <>
    <div className="flex justify-between m-4">
      <div className="flex flex-col text-left">
        <p className="font-thin text-gray text-sm font-os">{type}</p>
      </div>
      <div className="flex flex-col text-right">
        <p className="font-thin text-gray-400 text-xs/6 tracking-tighter font-os">{date}</p>
        {amount >= 0 && <p className="font-thin text-green-400 text-sm font-os">+{commaSeparated(satangToBaht(amount))}</p>}
        {amount < 0 && <p className="font-thin text-red-400 text-sm font-os">{commaSeparated(satangToBaht(amount))}</p>}
      </div>
    </div>
  </>
}

export const Transactions = ({ accountNumber = '111-111-111' }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /*
    useEffect(() => {
      setTransactions([
        { type: "Transfer in", date: "10 Jan 2025 14:22", amount: 498200 },
        { type: "Transfer out", date: "16 Jan 2025 11:35", amount: -293000 },
      ])
    }, []) */

  useEffect(() => {
    const loadAccount = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAccountTransactions(accountNumber);
        setTransactions(data);
      } catch (err) {
        console.error('Failed to load account data:', err);
        setError('Failed to load account data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAccount();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return <>
    <div className="flex justify-between m-1">
      <p className="font-black text-slate-100 text-xs">
        Transactions
      </p>
      <MonthlyDropdown />
    </div>
    <div className="w-full h-full min-w-100 min-h-40 rounded-lg shadow-lg" >
      {transactions.map((transaction, index) => {
        return <Fragment key={index}>
          <Transaction type={transaction.type} date={transaction.date} amount={transaction.amount} />
        </Fragment>
      })}
    </div>
    <p className="font-black text-gray-500 mt-2 mb-2 text-sm">
      End of this month's transactions
    </p>
  </>
}
