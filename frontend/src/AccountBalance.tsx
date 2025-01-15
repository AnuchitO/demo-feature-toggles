
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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
    <div className="flex justify-center p-10" >
      <div className="w-80 h-40 bg-gradient-to-r from-blue-600 via-blue-800 to-gray-900 rounded-lg shadow-lg" >
        <div className="flex justify-between m-3">
          <div className="flex flex-col text-left">
            <text className="text-white text-sm font-semibold font-os">{account.branch}</text>
            <text className="text-white text-xs font-os">{account.number}</text>
          </div>
          <div className="flex flex-col text-right">
            <text className="text-white text-sm font-semibold font-os">{account.type}</text>
            <text className="text-white text-xs font-os">{account.name}</text>
          </div>
        </div>
        <div className="flex flex-col text-left mt-6 ml-4">
          <text className="font-thin text-gray text-xs font-os">Current Balance</text>
          <h1 className="text-white-400 text-xl font-bold font-os">{formatCurrency(account.currentBalance / 100)}</h1>
        </div>
        <div className="flex justify-between p-4 text-gray-400 font-quick">
          <text className="font-thin text-gray text-xs font-os">Available Balance</text>
          <text className="font-thin text-gray text-xs font-os">{formatCurrency(account.availableBalance / 100)}</text>
        </div>
      </div>
    </div>
  </>
}

export const AccountBalance = () => {
  const account = {
    branch: 'Kalasin',
    number: '111-111-111-111',
    type: 'Savings',
    name: 'Main',
    currentBalance: 99999877,
    availableBalance: 99999877,
  };
  return (
    <div className="p-8">
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="flex justify-center p-10 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600" >
          <Balance account={account} />
        </div>
        <div className="text-center mt-8 mb-2 font-quick">
          <h1 className="font-black text-gray-700 tracking-wide text-xl">
            Banks are supported
          </h1>
          <p className="font-bold text-gray-500">including yours</p>
        </div>
        <div className="p-8 flex justify-center">
        </div>
      </div>
    </div>
  );
}


