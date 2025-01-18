import { useState, useEffect } from 'react'
import { MonthlyDropdown } from './MonthlyDropdown'
import { commaSeparated } from './formater'


interface TransactionProps {
  type: string;
  date: string;
  amount: number;
}

const Transaction = ({ type = "Activity", date = "18 Jan 2025 15:03", amount = 0 }: TransactionProps) => {
  return <>
    <div className="flex justify-between m-4">
      <div className="flex flex-col text-left">
        <p className="font-thin text-gray text-sm font-os">{type}</p>
      </div>
      <div className="flex flex-col text-right">
        <p className="font-thin text-gray-400 text-xs/6 tracking-tighter font-os">{date}</p>
        {amount >= 0 && <p className="font-thin text-green-400 text-sm font-os">+{commaSeparated(amount)}</p>}
        {amount < 0 && <p className="font-thin text-red-400 text-sm font-os">{commaSeparated(amount)}</p>}
      </div>
    </div>
  </>
}

export const Transactions = () => {
  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  useEffect(() => {
    setTransactions([
      { type: "Transfer in", date: "10 Jan 2025 14:22", amount: 498200 },
      { type: "Transfer out", date: "16 Jan 2025 11:35", amount: -293000 },
    ])
  }, [])
  return <>
    <div className="flex justify-between m-1">
      <p className="font-black text-slate-100 text-xs">
        Transactions
      </p>
      <MonthlyDropdown />
    </div>
    <div className="w-full h-full min-w-100 min-h-40 rounded-lg shadow-lg" >
      {transactions.map((transaction, index) => {
        return <>
          <Transaction key={index} type={transaction.type} date={transaction.date} amount={transaction.amount} />
          {index < transactions.length - 1 && <hr className="border-t border-gray-500 m-4" />}
        </>
      })}
    </div>
    <p className="font-black text-gray-500 mt-2 mb-2 text-sm">
      End of this month's transactions
    </p>
  </>
}
