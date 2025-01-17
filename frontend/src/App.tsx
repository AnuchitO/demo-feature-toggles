import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./App.css"
import { TransferButton } from './TransferButton'
import { TransactionButton } from './TransactionButton'
import { ScheduleButton } from './ScheduleButton'
import { Accounts } from './Accounts'
import { Transactions } from './Transactions'
import { Schedules } from './Schedules'


const App = () => {
  const [tab, setTab] = useState('transaction')
  const navigate = useNavigate()


  const onClickTransfer = () => {
    navigate('transfer')
  }

  const onClickTransaction = () => {
    setTab('transaction')
  }

  const onClickSchedule = () => {
    setTab('schedule')
  }

  return <>
    <div>
      <div className="rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center" >
          <div>
            <Accounts />
          </div>
          <div className="flex justify-center mb-3" >
            <TransferButton label="Transfer" onClick={onClickTransfer} />
          </div>
          <div className="flex flex-row">
            <TransactionButton onClick={onClickTransaction} />
            <ScheduleButton onClick={onClickSchedule} />
          </div>
        </div>
        <div className="flex flex-col min-h-80  m-4" >
          {tab === 'transaction' && <>
            <Transactions />
          </>}
          {tab === 'schedule' && <>
            <Schedules />
          </>}
        </div>
      </div>
    </div >
  </>
}
export default App;
