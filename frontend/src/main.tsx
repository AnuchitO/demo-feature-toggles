import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AccountBalance, Balance } from './AccountBalance.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Balance account={{
      branch: 'Branch Name',
      number: '000-000-000-000',
      type: ' Account Type',
      name: 'Account Name',
      currentBalance: 0,
      availableBalance: 0,
    }} />
    <AccountBalance />
  </StrictMode >,
)
