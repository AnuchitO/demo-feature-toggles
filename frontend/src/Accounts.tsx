import { useEffect, useState } from 'react';
import { formatCurrency } from './formater'

export interface Account {
  branch: string;
  number: string;
  type: string;
  name: string;
  currentBalance: number;
  availableBalance: number;
}

export const Balance = ({ account = {
  branch: 'Branch Name',
  number: '000-000-000-000',
  type: ' Account Type',
  name: 'Account Name',
  currentBalance: 0,
  availableBalance: 0,
} }: { account: Account }) => {
  return <>
    <div className="flex justify-center m-4" >
      <div className="w-80 h-40 bg-gradient-to-r from-blue-600 via-blue-800 to-gray-900 rounded-lg shadow-lg" >
        <div className="flex justify-between m-3">
          <div className="flex flex-col text-left">
            <p className="text-white text-sm font-semibold font-os">{account.branch}</p>
            <p className="text-white text-xs font-os">{account.number}</p>
          </div>
          <div className="flex flex-col text-right">
            <p className="text-white text-sm font-semibold font-os">{account.type}</p>
            <p className="text-white text-xs font-os">{account.name}</p>
          </div>
        </div>
        <div className="flex flex-col text-left mt-6 ml-4">
          <p className="font-thin text-gray text-xs font-os">Current Balance</p>
          <h1 className="text-white-400 text-xl font-bold font-os">{formatCurrency(account.currentBalance / 100)}</h1>
        </div>
        <div className="flex justify-between p-4 text-gray-400 font-quick">
          <p className="font-thin text-gray text-xs font-os">Available Balance</p>
          <p className="font-thin text-gray text-xs font-os">{formatCurrency(account.availableBalance / 100)}</p>
        </div>
      </div>
    </div>
  </>
}

export const Accounts = () => {
  const [account, setAccount] = useState<Account>({
    branch: 'Branch Name',
    number: '000-000-000-000',
    type: ' Account Type',
    name: 'Account Name',
    currentBalance: 0,
    availableBalance: 0,
  });

  useEffect(() => {
    setAccount({
      branch: 'Kalasin',
      number: '111-111-111-111',
      type: 'Savings',
      name: 'Main',
      currentBalance: 99999877,
      availableBalance: 99999877,
    });
  }, []);

  return (
    <>
      <Balance account={account} />
    </>
  );
}


export const Demo = () => {
  return <>
    <Balance account={{
      branch: 'Branch Name',
      number: '000-000-000-000',
      type: ' Account Type',
      name: 'Account Name',
      currentBalance: 0,
      availableBalance: 0,
    }} />
    <Balance account={{
      branch: 'Branch Name',
      number: '000-000-000-000',
      type: ' Account Type',
      name: 'Account Name',
      currentBalance: 0,
      availableBalance: 0,
    }} />
  </>
}
