import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getAll, getBoolean, getString, getRemoteConfig, fetchAndActivate } from "firebase/remote-config";
import './RemoteConfig.css'


// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings = {
  minimumFetchIntervalMillis: 1 * 1000, // 1 second
  fetchTimeoutMillis: 10 * 1000,
}

// setDefaultConfig({
//   interest_calculation: false,
//   credit_score_check: false,
// });

function RemoteConfig() {
  const [features, setFeatures] = useState({
    interest_calculation: false,
    credit_score_check: false,
    loan_limit: "default",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const interestCalc = getBoolean(remoteConfig, 'interest_calculation');
        const creditScoreCheck = getBoolean(remoteConfig, 'credit_score_check');
        const loanLimit = getString(remoteConfig, 'loan_limit');
        const allConfig = getAll(remoteConfig);
        console.log('allConfig:', allConfig);

        setFeatures({
          interest_calculation: interestCalc,
          credit_score_check: creditScoreCheck,
          loan_limit: loanLimit,
        });
      } catch (error) {
        setError(error);
        console.error("Error fetching remote config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  return (
    <>
      <h1>Feature Toggles: Status</h1>
      <div>
        <ol>
          <li>Interest Calculation: {features.interest_calculation ? 'Enabled' : 'Disabled'}</li>
          <li>Credit Score Check: {features.credit_score_check ? 'Enabled' : 'Disabled'}</li>
          <li>Loan limit: {features.loan_limit}</li>
        </ol>
        <h1>Showing Features</h1>
        {features.interest_calculation && <p>Interest calculation feature is active</p>}
        {features.credit_score_check && <p>Credit score check feature is active</p>}
        <p>Loan limit: {features.loan_limit}</p>
      </div>
    </>
  )
}

export default RemoteConfig;
