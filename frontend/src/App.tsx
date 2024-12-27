import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getBoolean, getRemoteConfig, fetchAndActivate } from "firebase/remote-config";
import './App.css'


console.log(import.meta.env)
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

// setDefaultConfig({
//   interest_calculation: false,
//   credit_score_check: false,
// });

function App() {
  const [features, setFeatures] = useState({
    interest_calculation: false,
    credit_score_check: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const interestCalc = getBoolean(remoteConfig, 'interest_calculation');
        const creditScoreCheck = getBoolean(remoteConfig, 'credit_score_check');

        setFeatures({ interest_calculation: interestCalc, credit_score_check: creditScoreCheck });
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
      <h1>Feature Toggles</h1>
      <div>
        <ul>
          <li>Interest Calculation: {features.interest_calculation ? 'Enabled' : 'Disabled'}</li>
          <li>Credit Score Check: {features.credit_score_check ? 'Enabled' : 'Disabled'}</li>
        </ul>
        {features.interest_calculation && <p>Interest calculation feature is active</p>}
        {features.credit_score_check && <p>Credit score check feature is active</p>}
      </div>
    </>
  )
}

export default App
