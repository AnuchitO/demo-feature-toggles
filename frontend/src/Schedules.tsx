import { Fragment } from 'react'
import { useState, useEffect } from 'react'
import { commaSeparated, formatDate, satangToBaht } from './formater'
import { fetchAccountSchedules } from './services/accounts'
import iconSCB from './icon-scb.png'
import iconKTB from './icon-ktb.png'
import iconKbank from './icon-kbank.png'

import type { Bank, Schedule } from './types/account'


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

export const ScheduleItem = ({ toBank, toAccount = "000-000-000-000", toAccountName = "Account Name", date = "dd Mon YYYY", amount = 0 }: ScheduleProps) => {
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
        <p className="font-thin text-gray-400 text-xs/6 tracking-tighter font-os">{formatDate(date)}</p>
        <p className="font-thin text-red-400 text-sm/4 font-os">{commaSeparated(satangToBaht(amount))}</p>
      </div>
    </div>
  </>
}

export const Schedules = ({ accountNumber = '111-111-111' }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAccountSchedules(accountNumber);
        setSchedules(data);
      } catch (err) {
        setError('Failed to load account schedules');
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, [accountNumber]);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }


  return <>
    <div className="flex justify-center m-1">
      <p className="font-black text-slate-100 text-xs">
        Scheduled Transactions
      </p>
    </div>
    <div className="w-full h-full min-w-100 min-h-40 rounded-lg shadow-lg" >
      {schedules.length === 0 && <div className="text-center p-4 font-os">No scheduled transactions</div>}
      {schedules.map((schedule, index) => {
        return <Fragment key={index}>
          <ScheduleItem key={index} toBank={schedule.toBank} toAccount={schedule.toAccount} toAccountName={schedule.toAccountName} amount={schedule.amount} date={schedule.date} />
          {index < schedules.length - 1 && <hr className="border-t border-gray-500 m-4" />}
        </Fragment>
      })}
    </div>
    <p className="font-black text-gray-500 mt-2 mb-2 text-sm">
      End of scheduled transactions
    </p>
  </>
}

