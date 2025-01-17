import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Transfers from './Transfers'

function Page() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/transfer" element={<Transfers />} />
      </Routes>
    </Router>
  );
}

export default Page;
