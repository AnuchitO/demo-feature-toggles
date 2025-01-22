import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Transfers from './Transfers'
import { RemoteConfigProvider } from './RemoteConfigContext';
import { DEMO_ACCOUNT } from './services/accounts';

function Page() {
  return (
    <RemoteConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/transfer" element={<Transfers account={DEMO_ACCOUNT} />} />
        </Routes>
      </Router>
    </RemoteConfigProvider>
  );
}

export default Page;
