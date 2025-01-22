import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import {
  getRemoteConfig,
  fetchAndActivate,
  getBoolean,
  getString,
  getAll
} from "firebase/remote-config";

// Feature flag types
export interface RemoteConfigFeatures {
  enableViewTransactionsHistory: boolean;
  enableViewScheduledTransactions: boolean;
  enableScheduleOnce: boolean;
  enableScheduleMonthly: boolean;
  transferLimit: string;
}

// Context value type
interface RemoteConfigContextValue {
  features: RemoteConfigFeatures;
  error: Error | null;
  loading: boolean;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase and Remote Config
const app = initializeApp(firebaseConfig);
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings = {
  minimumFetchIntervalMillis: 1 * 1000,
  fetchTimeoutMillis: 10 * 1000,
};

// Create Context with type
const RemoteConfigContext = createContext<RemoteConfigContextValue | null>(null);

// Custom hook for using Remote Config
export const useFeatureToggles = (): RemoteConfigContextValue => {
  const context = useContext(RemoteConfigContext);
  if (!context) {
    throw new Error('useRemoteConfig must be used within a RemoteConfigProvider');
  }
  return context;
};

interface RemoteConfigProviderProps {
  children: React.ReactNode;
}

// Provider Component
export const FeatureTogglesProvider: React.FC<RemoteConfigProviderProps> = ({ children }) => {
  const [features, setFeatures] = useState<RemoteConfigFeatures>({
    enableViewTransactionsHistory: false,
    enableViewScheduledTransactions: false,
    enableScheduleOnce: false,
    enableScheduleMonthly: false,
    transferLimit: 'default',
  });
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const allConfig = getAll(remoteConfig);
        console.log('allConfig:', JSON.stringify(allConfig));

        setFeatures({
          enableViewTransactionsHistory: getBoolean(remoteConfig, 'enable_view_transactions_history'),
          enableViewScheduledTransactions: getBoolean(remoteConfig, 'enable_view_scheduled_transactions'),
          enableScheduleOnce: getBoolean(remoteConfig, 'enable_schedule_once'),
          enableScheduleMonthly: getBoolean(remoteConfig, 'enable_schedule_monthly'),
          transferLimit: getString(remoteConfig, 'transfer_limit'),
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error("Error fetching remote config:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const value: RemoteConfigContextValue = {
    features,
    error,
    loading,
  };

  return (
    <RemoteConfigContext.Provider value={value}>
      {children}
    </RemoteConfigContext.Provider>
  );
};
