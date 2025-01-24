import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Draft from './Draft';
import Transfers from './Transfers'
import { FeatureTogglesProvider } from './FeatureTogglesContext'
import { DEMO_ACCOUNT } from './services/accounts';

function Page() {
  return (
    <FeatureTogglesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Draft />} />
          <Route path="/app" element={<App />} />
          <Route path="/transfer" element={<Transfers account={DEMO_ACCOUNT} />} />
        </Routes>
      </Router>
    </FeatureTogglesProvider>
  );
}

export default Page;
