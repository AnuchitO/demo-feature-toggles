import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFeatureToggles } from './FeatureTogglesContext';

export const SettingsButton: React.FC = () => {
  return <>
    <button
      data-tooltip-target="tooltip-settings"
      type="button"
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      <svg
        className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
        />
      </svg>
      <span className="sr-only">Settings</span>
    </button>
  </>
}

export const WalletButton: React.FC = () => {
  return <>
    <button
      data-tooltip-target="tooltip-wallet"
      type="button"
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
    >
      <svg
        className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
        <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
      </svg>
      <span className="sr-only">Wallet</span>
    </button>
  </>
}

// icon: https://www.figma.com/design/omCDEWoX3y8MUC7tQD3mKm/Flowbite-Icons---580%2B-free-SVG-icons-in-Figma-(Community)?node-id=0-1&p=f&t=MH095UrLMWctGpkX-0

export const FloatingNavBar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { features, loading } = useFeatureToggles()

  const [hide, setHide] = useState(false)

  const classIcon = "w-7 h-7 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"

  const handleHome = () => {
    navigate('/home');
  }

  const handleTransactionsHistory = () => {
    navigate('/transactions');
  }

  const handleScheduledTransactions = () => {
    navigate('/scheduled');
  }

  const handleTransfer = () => {
    navigate('/transfer');
  }

  const handleProfile = () => {
    alert('Profile')
  }

  useEffect(() => {
    if (location.pathname === '/transfer') {
      setHide(true)
    } else {
      setHide(false)
    }
  }, [location])

  if (hide || loading) {
    return <></>
  }

  return (
    <div className="fixed z-50 w-80 h-16 max-w-sm -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-6 left-1/2 dark:bg-gray-700 dark:border-gray-400">
      <div className="grid grid-cols-3 items-center justify-center h-full max-w-sm mx-auto">
        <div className="min-w-full flex flex-row justify-around">
          {/* Home Button */}
          <button
            data-tooltip-target="tooltip-home"
            type="button"
            className="inline-flex flex-col items-center justify-center rounded-s-full hover:text-gray-50 dark:hover:text-gray-800 group"
            onClick={handleHome}
          >
            <svg
              className={classIcon}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
            </svg>

            <span className="sr-only">Home</span>
          </button>

          {/* Transactions history */}
          {features.enableViewTransactionsHistory &&
            <button
              data-tooltip-target="tooltip-wallet"
              type="button"
              className="inline-flex flex-col items-center justify-center rounded-s-full hover:text-gray-50 dark:hover:text-gray-800 group"
              onClick={handleTransactionsHistory}
            >
              <svg
                className={classIcon}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
              </svg>

              <span className="sr-only">Transactions</span>
            </button>
          }
        </div>

        <div className="flex justify-center">
          {/* Transfer Button */}

          <button
            type="button"
            className="inline-flex items-center justify-center w-16 h-16 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleTransfer}
          >
            <svg
              className="w-8 h-8 text-gray-300 group-hover:text-white dark:group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
            </svg>
            <span className="sr-only">Transfer</span>
          </button>
        </div>

        <div className="min-w-full flex flex-row justify-around">
          {/* Scheduled Button */}
          {features.enableViewScheduledTransactions &&
            <button
              data-tooltip-target="tooltip-settings"
              type="button"
              className="inline-flex flex-col items-center justify-center rounded-s-full hover:text-gray-50 dark:hover:text-gray-800 group"
              onClick={handleScheduledTransactions}
            >
              <svg
                className={classIcon}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m11.5 11.5 2.071 1.994M4 10h5m11 0h-1.5M12 7V4M7 7V4m10 3V4m-7 13H8v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L10 17Zm-5 3h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
              </svg>

              <span className="sr-only">Scheduled</span>
            </button>
          }
          {/* Profile Button */}
          <button
            data-tooltip-target="tooltip-profile"
            type="button"
            className="inline-flex flex-col items-center justify-center rounded-s-full hover:text-gray-50 dark:hover:text-gray-800 group"
            onClick={handleProfile}
          >
            <svg
              className={classIcon}
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <span className="sr-only">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

