import { useEffect, useState } from 'react';
import { formatCurrency } from './formater';
import { DEMO_ACCOUNT, fetchAccountBalances } from './services/accounts';
import { Account } from './types/account';

interface BalanceProps {
  account: Account;
}

const defaultAccount: Account = {
  branch: 'Branch Name',
  number: '000-000-000',
  type: 'Account Type',
  name: 'Account Name',
  currentBalance: 0,
  availableBalance: 0,
};

export const Balance: React.FC<BalanceProps> = ({ account = defaultAccount }) => {
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
          <p className="font-thin text-slate-300 text-xs font-os">Current Balance</p>
          <h1 className="text-xl font-bold text-slate-300 font-os">{formatCurrency(account.currentBalance / 100)}</h1>
        </div>
        <div className="flex justify-between p-4 text-gray-400 font-quick">
          <p className="font-thin text-slate-300 text-xs font-os">Available Balance</p>
          <p className="font-thin text-slate-300 text-xs font-os">{formatCurrency(account.availableBalance / 100)}</p>
        </div>
      </div>
    </div>
  </>
};

export const Accounts: React.FC = () => {
  const [account, setAccount] = useState<Account>(defaultAccount);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAccountBalances(DEMO_ACCOUNT.number);
        setAccount(data);
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

  return <Balance account={account} />;
};

export const Demo: React.FC = () => {
  return (
    <div className="space-y-4">
      <Balance account={defaultAccount} />
    </div>
  );
};
