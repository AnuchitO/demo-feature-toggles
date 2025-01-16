import { useState, useEffect } from 'react'
import { Accounts } from './Accounts'
import { MonthlyDropdown } from './MonthlyDropdown'
import "./App.css"
import { TransferButton } from './TransferButton'
import { commaSeparated } from './formater'
import { ScheduleButton } from './ScheduleButton'
import iconSCB from './icon-scb.png'
import iconKTB from './icon-ktb.png'
import iconKbank from './icon-kbank.png'


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


const Transfers = () => {
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
    <p className="font-black text-gray-500 mt-2 text-sm">
      End of this month's transactions
    </p>
  </>
}


type Bank = "SCB" | "KTB" | "KBank"

const logos = {
  "SCB": iconSCB,
  "KTB": iconKTB,
  "KBank": iconKbank,
}

interface ScheduleProps {
  toBank: Bank;
  toAccount: string;
  toAccountName: string;
  amount: number;
  date: string;
}

const Schedule = ({ toBank, toAccount = "000-000-000-000", toAccountName = "Account Name", date = "dd Mon YYYY", amount = 0 }: ScheduleProps) => {
  const logo = logos[toBank]
  return <>
    <div className="flex justify-between m-4">
      <div className="flex items-center text-left">
        <div className="flex text-left m-3">
          <img src={logo} alt={toBank} className="w-8 h-8" />
        </div>
        <div className="flex flex-col text-left">
          <p className="font-thin text-gray text-xs font-os">{toAccountName}</p>
          <p className="font-thin text-gray text-xs font-os">{toBank} {toAccount}</p>
        </div>
      </div>
      <div className="flex flex-col text-right">
        <p className="font-thin text-gray-400 text-xs/6 tracking-tighter font-os">{date}</p>
        {amount < 0 && <p className="font-thin text-red-400 text-sm/4 font-os">{commaSeparated(amount / 100)}</p>}
      </div>
    </div>
  </>
}

export const Schedules = () => {
  const [schedules, setSchedules] = useState<ScheduleProps[]>([])

  useEffect(() => {
    setSchedules([
      { toBank: "KTB", toAccount: "222-222-222-222", toAccountName: "AnuchitO", amount: -1899900, date: "10 Jan 2025" },
      { toBank: "SCB", toAccount: "333-333-333-333", toAccountName: "AnuchitO", amount: -2499850, date: "10 Jan 2025" },
      { toBank: "KBank", toAccount: "444-444-444-444", toAccountName: "AnuchitO", amount: -2499850, date: "10 Jan 2025" },
    ])
  }, [])

  return <>
    <div className="flex justify-center m-1">
      <p className="font-black text-slate-100 text-xs">
        Scheduled Transactions
      </p>
    </div>
    <div className="w-full h-full min-w-100 min-h-40 rounded-lg shadow-lg" >
      {schedules.map((schedule, index) => {
        return <>
          <Schedule key={index} toBank={schedule.toBank} toAccount={schedule.toAccount} toAccountName={schedule.toAccountName} amount={schedule.amount} date={schedule.date} />
          {index < schedules.length - 1 && <hr className="border-t border-gray-500 m-4" />}
        </>
      })}
    </div>
    <p className="font-black text-gray-500 mt-2 text-sm">
      End of scheduled transactions
    </p>
  </>
}


const App = () => {
  const [tab, setTab] = useState('transfer')

  const onClickTransfer = () => {
    setTab('transfer')
  }

  const onClickSchedule = () => {
    setTab('schedule')
  }

  return <>
    <div>
      <div className="rounded-2xl overflow-hidden shadow-lg">
        {/* <div className="flex justify-center bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" > */}
        <div className="flex flex-col justify-center" >
          <div>
            <Accounts />
          </div>
          <div>
            <TransferButton onClick={onClickTransfer} />
            <ScheduleButton onClick={onClickSchedule} />
          </div>
        </div>
        <div className="flex flex-col min-h-80  m-4" >
          {tab === 'transfer' && <>
            <Transfers />
          </>}
          {tab === 'schedule' && <>
            <Schedules />
          </>}
        </div>
      </div>
    </div >
  </>
}
export default App;
