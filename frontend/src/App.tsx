import { useState, useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate } from "firebase/remote-config";
import './App.css'

// Your Firebase configuration (replace with your actual config)


const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "G-MEASUREMENT_ID"
};


const app = initializeApp(firebaseConfig);
const remoteConfig = getRemoteConfig(app);


function App() {
  const [count, setCount] = useState(0)
  const [features, setFeatures] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const interestCalc = remoteConfig.getValue('interest_calculation').val();
        const creditScoreCheck = remoteConfig.getValue('credit_score_check').val();

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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
