import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Transfers from './Transfers'
import { FeatureTogglesProvider } from './FeatureTogglesContext'
import { DEMO_ACCOUNT } from './services/accounts';

function Page() {
  return (
    <FeatureTogglesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/transfer" element={<Transfers account={DEMO_ACCOUNT} />} />
        </Routes>
      </Router>
    </FeatureTogglesProvider>
  );
}

export default Page;
